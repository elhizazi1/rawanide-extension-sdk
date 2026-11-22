import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {collectFiles,makeZip} from '../lib/zip.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cli=path.join(root,'bin/rawanide.mjs');
const fixture=path.join(root,'tests/fixtures/parity-extension');
const templates=['declarative','hosted-js','hosted-js-panel','hosted-js-selection-panel','hosted-js-safe-edit'];
const sha=(buf)=>crypto.createHash('sha256').update(buf).digest('hex');
const run=(...args)=>spawnSync(process.execPath,[cli,...args],{encoding:'utf8'});
const tmp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'rawanide-sdk-'));

// lib/zip.mjs is shipped as a byte-identical copy in the repository templates (tools/lib/zip.mjs).
// If you change it, update this constant here and in the repository templates' tests.
const ZIP_MODULE_SHA256='539b2c718a5d1e13185a54ff55e41386ef82d1370a7f7408d6369bc42613c72f';
const COMMUNITY_RULES_SHA256='2a23b9b056d7e5ced2a486f40ee1c6a3acda45bd85bbe76318583214958fd38f';
test('shared packer and rules match their fingerprints',()=>{
  const normalized=(file)=>Buffer.from(fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n'),'utf8');
  assert.equal(sha(normalized('lib/zip.mjs')),ZIP_MODULE_SHA256);
  assert.equal(sha(normalized('community-rules.json')),COMMUNITY_RULES_SHA256);
});

for(const template of templates){
  test(`${template}: template passes the community repository rules`,()=>{
    const result=run('validate',path.join(root,'templates',template),'--repository');
    assert.equal(result.status,0,result.stderr);
    assert.match(result.stdout,/community repository rules/);
  });
}

test('repository rules reject what the repository builder rejects',()=>{
  const temp=tmp();
  try{
    const folder=path.join(temp,'ext');
    execFileSync(process.execPath,[cli,'init','hosted-js',folder]);
    const file=path.join(folder,'manifest.json');
    const original=JSON.parse(fs.readFileSync(file,'utf8'));
    const edit=(change)=>{const m=structuredClone(original);change(m);fs.writeFileSync(file,JSON.stringify(m,null,2));};
    // each case: passes plain validate, fails --repository
    const cases=[
      ['missing localizedMetadata',m=>{delete m.localizedMetadata},/localizedMetadata\.en is required/],
      ['blocked permission',m=>{m.permissions=['UI_ACCESS','TERMINAL_ACCESS']},/TERMINAL_ACCESS is not allowed/],
      ['preview-js runtime',m=>{m.runtime='preview-js';delete m.entrypoint;delete m.commands;delete m.activationEvents},/runtime "preview-js" is not allowed/],
      ['missing icon',m=>{delete m.icon},/"icon" is required/],
    ];
    for(const [label,change,pattern] of cases){
      edit(change);
      assert.equal(run('validate',folder).status,0,label+': plain validate should pass');
      const strict=run('validate',folder,'--repository');
      assert.notEqual(strict.status,0,label+': --repository should fail');
      assert.match(strict.stderr,pattern,label);
    }
  }finally{fs.rmSync(temp,{recursive:true,force:true})}
});

test('audit --repository reports missing recommended fields as warnings',()=>{
  const temp=tmp();
  try{
    const folder=path.join(temp,'ext');
    execFileSync(process.execPath,[cli,'init','declarative',folder]);
    const file=path.join(folder,'manifest.json');
    const m=JSON.parse(fs.readFileSync(file,'utf8'));delete m.publisher;fs.writeFileSync(file,JSON.stringify(m,null,2));
    const report=JSON.parse(run('audit',folder,'--repository').stdout);
    assert.deepEqual(report.errors,[]);
    assert.ok(report.warnings.some(w=>/"publisher" is recommended/.test(w)));
  }finally{fs.rmSync(temp,{recursive:true,force:true})}
});

test('pack is deterministic and equals the shared packer output',()=>{
  const temp=tmp();
  try{
    const a=path.join(temp,'a.r1'),b=path.join(temp,'b.r1');
    assert.equal(run('pack',fixture,a).status,0);
    fs.writeFileSync(path.join(fixture,'.DS_Store'),'junk');
    try{assert.equal(run('pack',fixture,b).status,0)}finally{fs.rmSync(path.join(fixture,'.DS_Store'),{force:true})}
    const expected=makeZip(collectFiles(fixture));
    assert.ok(fs.readFileSync(a).equals(fs.readFileSync(b)),'same input, same bytes (.DS_Store ignored)');
    assert.ok(fs.readFileSync(a).equals(expected),'CLI output equals makeZip output');
    const out=run('pack',fixture,path.join(temp,'c.r1')).stdout;
    assert.match(out,new RegExp('SHA-256: '+sha(expected)));
  }finally{fs.rmSync(temp,{recursive:true,force:true})}
});

test('option flags are never mistaken for the output file name',()=>{
  const temp=tmp();
  try{
    const folder=path.join(temp,'ext');
    execFileSync(process.execPath,[cli,'init','hosted-js-panel',folder]);
    const result=run('pack',folder,'--repository');
    assert.equal(result.status,0,result.stderr);
    assert.ok(fs.existsSync(path.join(folder,'ext.r1')));
  }finally{fs.rmSync(temp,{recursive:true,force:true})}
});
