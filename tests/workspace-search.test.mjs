import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {isCompatibleApiVersion} from '../lib/api-version.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('API 1.1 accepts compatible releases and legacy zero patch aliases',()=>{for(const version of ['1','1.0','1.0.0','1.1','1.1.0'])assert.equal(isCompatibleApiVersion(version,'1.1'),true,version)});
test('future, breaking and malformed API versions fail',()=>{for(const version of ['1.2','2.0','1.-1','1.0.extra','1..0','1.1.1','1.00000000000000000000000001.4','9999999999999999999.0'])assert.equal(isCompatibleApiVersion(version,'1.1'),false,version)});
test('SDK and search contract versions agree',()=>{const pkg=JSON.parse(readFileSync(path.join(root,'package.json'))),contract=JSON.parse(readFileSync(path.join(root,'contract.json')));assert.equal(pkg.version,'1.1.0');assert.equal(contract.apiVersion,'1.1');assert.equal(contract.features.workspaceSearch.since,'1.1');assert.equal(contract.features.workspaceSearch.permission,'FILE_READ')});
test('types describe cancellation, coordinates and async results',()=>{const types=readFileSync(path.join(root,'types/rawanide.d.ts'),'utf8');for(const name of ['WorkspaceApi','WorkspaceSearchOptions','WorkspaceTextMatch','WorkspaceSearchResult'])assert.match(types,new RegExp('interface '+name));assert.match(types,/signal\?: WorkspaceAbortSignal/);assert.match(types,/findText\(query: string/);assert.match(types,/Promise<WorkspaceSearchResult>/)});
test('new project search template initializes, validates, audits and packs',()=>{const folder=mkdtempSync(path.join(os.tmpdir(),'rawanide-search-template-'));try{const project=path.join(folder,'example');execFileSync(process.execPath,[path.join(root,'bin/rawanide.mjs'),'init','hosted-js-project-search',project]);for(const command of ['validate','audit']){const out=execFileSync(process.execPath,[path.join(root,'bin/rawanide.mjs'),command,project,'--repository'],{encoding:'utf8'});if(command==='audit'){assert.deepEqual(JSON.parse(out).errors,[]);assert.deepEqual(JSON.parse(out).warnings,[])}}execFileSync(process.execPath,[path.join(root,'bin/rawanide.mjs'),'pack',project]);const manifest=JSON.parse(readFileSync(path.join(project,'manifest.json')));assert.equal(manifest.apiVersion,'1.1');assert.deepEqual(manifest.permissions,['FILE_READ','UI_ACCESS']);}finally{rmSync(folder,{recursive:true,force:true})}});

test('Termux-style copied launcher shims keep the new SDK version',()=>{
 const folder=mkdtempSync(path.join(os.tmpdir(),'rawanide-termux-shim-'));
 try {
  const prefix=path.join(folder,'com.termux','files','usr'),bin=path.join(prefix,'bin');
  fs.mkdirSync(bin,{recursive:true});for(const name of ['rawanide-sdk','rawanide-sdk-desktop','rawanide'])fs.writeFileSync(path.join(bin,name),'placeholder');
  execFileSync(process.execPath,[path.join(root,'scripts/fix-termux-bin.mjs')],{env:{...process.env,PREFIX:prefix}});
  const help=execFileSync(process.execPath,[path.join(bin,'rawanide-sdk'),'help'],{encoding:'utf8'});assert.match(help,/SDK 1\.1\.0/);
 }finally{rmSync(folder,{recursive:true,force:true})}
});
