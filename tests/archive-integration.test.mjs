import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cli=path.join(root,'bin/rawanide.mjs');
const templates=['declarative','hosted-js','hosted-js-panel','hosted-js-selection-panel','hosted-js-safe-edit'];
function run(...args){return execFileSync(process.execPath,[cli,...args],{encoding:'utf8'});}
function archiveInfo(file){
 const py=`import json,sys,zipfile\nwith zipfile.ZipFile(sys.argv[1]) as z:\n names=z.namelist()\n bad=z.testzip()\n manifest=json.loads(z.read('manifest.json'))\n print(json.dumps({'names':names,'bad':bad,'manifest':manifest,'paths':{n:len(z.read(n)) for n in names}}))`;
 return JSON.parse(execFileSync('python3',['-c',py,file],{encoding:'utf8'}));
}
for(const template of templates){
 test(`${template}: init, validate, pack and inspect real .r1 archive`,()=>{
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rawanide-sdk-'));
  try{
   const folder=path.join(temp,'extension'),archive=path.join(temp,`${template}.r1`);
   run('init',template,folder);
   assert.match(run('validate',folder),/PASS/);
   run('pack',folder,archive);
   assert.ok(fs.statSync(archive).size>0);
   const info=archiveInfo(archive);
   assert.equal(info.bad,null);
   const local=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
   assert.deepEqual(info.manifest,local);
   assert.equal(info.names.length,new Set(info.names).size,'duplicate ZIP entries');
   assert.ok(info.names.every(n=>!n.startsWith('/')&&!n.includes('..')&&!n.includes('\\')),'safe root-relative ZIP paths');
   assert.deepEqual([...info.names].sort(),fs.readdirSync(folder,{recursive:true,withFileTypes:true}).filter(e=>e.isFile()).map(e=>path.relative(folder,path.join(e.parentPath??e.path,e.name)).split(path.sep).join('/')).sort());
   for(const required of ['manifest.json','README.md','LICENSE','assets/icon.svg'])assert.ok(info.names.includes(required),required);
   assert.ok(info.names.includes(local.icon),'manifest icon packaged');
   if(local.entrypoint)assert.ok(info.names.includes(local.entrypoint),'entrypoint packaged');
   assert.ok(info.names.every(n=>info.paths[n]>0),'nonempty packaged files');
  }finally{fs.rmSync(temp,{recursive:true,force:true});}
 });
}
test('pack defaults to project folder and excludes git and previous archives',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rawanide-sdk-'));
 try{
  const folder=path.join(temp,'ext');run('init','declarative',folder);
  fs.mkdirSync(path.join(folder,'.git'));fs.writeFileSync(path.join(folder,'.git','config'),'secret');
  fs.mkdirSync(path.join(folder,'node_modules'));fs.writeFileSync(path.join(folder,'node_modules','junk'),'junk');
  const output=path.join(folder,'ext.r1');
  run('pack',folder);
  assert.ok(fs.existsSync(output));
  run('pack',folder);
  const info=archiveInfo(output);
  assert.ok(!info.names.some(n=>n.startsWith('.git/')||n.startsWith('node_modules/')||n.endsWith('.r1')));
  assert.equal(info.bad,null);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('pack rejects missing icon before writing an archive',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rawanide-sdk-'));
 try{
  const folder=path.join(temp,'ext');run('init','hosted-js',folder);
  fs.rmSync(path.join(folder,'assets','icon.svg'));
  const output=path.join(temp,'bad.r1');
  const result=spawnSync(process.execPath,[cli,'pack',folder,output],{encoding:'utf8'});
  assert.notEqual(result.status,0);
  assert.match(result.stderr,/Icon not found/);
  assert.equal(fs.existsSync(output),false);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
