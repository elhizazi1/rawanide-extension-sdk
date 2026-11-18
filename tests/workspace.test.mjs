import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cli=path.join(root,'bin/rawanide.mjs');
const run=(...args)=>spawnSync(process.execPath,[cli,...args],{cwd:root,encoding:'utf8'});
const managed=path.join(root,'workspace/projects');
const dist=path.join(root,'workspace/dist');
const name='workspace-test-fixture';
const project=path.join(managed,name);
const archive=path.join(dist,name+'.r1');
test('managed workspace creates project, validates and packs archive',()=>{
 fs.rmSync(project,{recursive:true,force:true});fs.rmSync(archive,{force:true});
 try{
  assert.equal(run('init','hosted-js-selection-panel',name).status,0);
  assert.ok(fs.existsSync(path.join(project,'assets/context-action.svg')));
  assert.equal(run('validate',name).status,0);
  assert.equal(run('inspect',name).status,0);
  assert.equal(run('audit',name).status,0);
  assert.equal(run('pack',name,name+'.r1').status,0);
  assert.ok(fs.statSync(archive).size>0);
 }finally{fs.rmSync(project,{recursive:true,force:true});fs.rmSync(archive,{force:true});}
});
test('legacy explicit paths and output locations still work',()=>{
 const temp=fs.mkdtempSync(path.join(root,'workspace','legacy-'));
 try{
  const project=path.join(temp,'project');const archive=path.join(temp,'legacy.r1');
  assert.equal(run('init','declarative',project).status,0);
  assert.equal(run('validate',project).status,0);
  assert.equal(run('pack',project,archive).status,0);
  assert.ok(fs.statSync(archive).size>0);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('workspace is excluded from npm package allowlist',()=>{
 const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
 assert.ok(!pkg.files.some(x=>x.startsWith('workspace')));
 assert.match(fs.readFileSync(path.join(root,'.gitignore'),'utf8'),/^workspace\//m);
});
