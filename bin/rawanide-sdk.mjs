#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const [,,command,...args]=process.argv;
if(command==='test'&&!fs.existsSync(path.join(root,'tests'))){
  console.error('The SDK test suite is only available in a source checkout (the tests/ folder is not part of the npm package).');
  process.exitCode=1;
}else if(command==='test'){
  const result=spawnSync(process.execPath,['--test',...requireTests()],{cwd:root,stdio:'inherit'});
  if(result.error){console.error(result.error.message);process.exitCode=1}
  else process.exitCode=result.status??1;
}else{
  const result=spawnSync(process.execPath,[path.join(root,'bin/rawanide.mjs'),...(command?[command,...args]:[])],{stdio:'inherit',env:{...process.env,RAWANIDE_SDK_WORKSPACE:path.join(process.cwd(),'workspace')}});
  if(result.error){console.error(result.error.message);process.exitCode=1}
  else process.exitCode=result.status??1;
}
function requireTests(){
  // Expand the same tests/*.test.mjs set used by the original npm test script.
  const {readdirSync}=requireFs();
  return readdirSync(path.join(root,'tests')).filter(x=>x.endsWith('.test.mjs')).sort().map(x=>path.join(root,'tests',x));
}
function requireFs(){return {readdirSync:fs.readdirSync}}
