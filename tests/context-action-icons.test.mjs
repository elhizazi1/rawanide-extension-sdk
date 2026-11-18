import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
const root=new URL('../',import.meta.url).pathname;
const cli=path.join(root,'bin/rawanide.mjs');
for(const name of ['hosted-js-selection-panel','hosted-js-safe-edit']){
 test(`${name}: dedicated selection action SVG is referenced and packaged`,()=>{
  const folder=path.join(root,'templates',name);
  const manifest=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
  assert.equal(manifest.icon,'assets/icon.svg');
  assert.equal(manifest.contextActions[0].icon,'assets/context-action.svg');
  assert.match(fs.readFileSync(path.join(folder,'assets/context-action.svg'),'utf8'),/<svg/);
  assert.match(fs.readFileSync(path.join(folder,'README.md'),'utf8'),/contextActions\[0\]\.icon/);
  execFileSync(process.execPath,[cli,'validate',folder]);
 });
}
for(const bad of ['assets/missing.svg','../outside.svg','/absolute.svg']){
 test(`context action icon rejects ${bad}`,()=>{
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rawanide-context-icon-'));
  try{
   fs.cpSync(path.join(root,'templates/hosted-js-selection-panel'),temp,{recursive:true});
   const file=path.join(temp,'manifest.json');const manifest=JSON.parse(fs.readFileSync(file,'utf8'));
   manifest.contextActions[0].icon=bad;fs.writeFileSync(file,JSON.stringify(manifest));
   const result=spawnSync(process.execPath,[cli,'validate',temp],{encoding:'utf8'});
   assert.notEqual(result.status,0);
   assert.match(result.stderr,/Context action icon not found|Unsafe context action icon path/);
  }finally{fs.rmSync(temp,{recursive:true,force:true});}
 });
}
