import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync,spawnSync} from 'node:child_process';
const root=new URL('../',import.meta.url).pathname;
const cli=path.join(root,'bin/rawanide.mjs');
const names=fs.readdirSync(path.join(root,'templates'));
for(const name of names){
 test(`${name} includes documented replaceable icon and license`,()=>{
  const dir=path.join(root,'templates',name);
  const m=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
  assert.equal(m.icon,'assets/icon.svg');
  assert.equal(m.license,'MIT');
  assert.match(fs.readFileSync(path.join(dir,'README.md'),'utf8'),/Replace.*icon.svg/);
  assert.match(fs.readFileSync(path.join(dir,'LICENSE'),'utf8'),/\[COPYRIGHT HOLDER\]/);
  assert.match(fs.readFileSync(path.join(dir,m.icon),'utf8'),/<svg/);
  execFileSync(process.execPath,[cli,'validate',dir]);
 });
}
test('missing manifest icon asset fails validation',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rawanide-icon-'));
 try{fs.cpSync(path.join(root,'templates','declarative'),temp,{recursive:true});fs.unlinkSync(path.join(temp,'assets','icon.svg'));
  const p=spawnSync(process.execPath,[cli,'validate',temp],{encoding:'utf8'});
  assert.notEqual(p.status,0);assert.match(p.stderr,/Icon not found/);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('init copies README, LICENSE and placeholder icon',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rawanide-init-'));
 try{const target=path.join(temp,'sample');execFileSync(process.execPath,[cli,'init','hosted-js',target]);
  for(const file of ['README.md','LICENSE','assets/icon.svg'])assert.ok(fs.existsSync(path.join(target,file)));
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
