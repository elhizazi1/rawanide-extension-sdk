import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {readFileSync,mkdtempSync,cpSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {tmpdir} from 'node:os';
const root=path.resolve(import.meta.dirname,'..');
const cli=path.join(root,'bin/rawanide.mjs');
const template=path.join(root,'templates/hosted-js');
test('inspect reports template metadata',()=>{
 const x=JSON.parse(execFileSync(process.execPath,[cli,'inspect',template],{encoding:'utf8'}));
 assert.equal(x.runtime,'hosted-js');assert.ok(x.commands.length);assert.deepEqual(x.errors,[]);
});
test('duplicate permissions rejected',()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'sdk07-'));cpSync(template,dir,{recursive:true});
 const p=path.join(dir,'manifest.json');const m=JSON.parse(readFileSync(p));m.permissions.push(m.permissions[0]);writeFileSync(p,JSON.stringify(m));
 const x=spawnSync(process.execPath,[cli,'validate',dir],{encoding:'utf8'});assert.notEqual(x.status,0);assert.match(x.stderr,/Duplicate permissions/);
});
test('non-array commands rejected',()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'sdk07-'));cpSync(template,dir,{recursive:true});
 const p=path.join(dir,'manifest.json');const m=JSON.parse(readFileSync(p));m.commands={};writeFileSync(p,JSON.stringify(m));
 const x=spawnSync(process.execPath,[cli,'validate',dir],{encoding:'utf8'});assert.notEqual(x.status,0);assert.match(x.stderr,/commands must be an array/);
});
test('npm publishing allowlist excludes tests',()=>{
 const p=JSON.parse(readFileSync(path.join(root,'package.json')));assert.equal(p.private,false);assert.ok(p.files.includes('types/'));assert.ok(!p.files.includes('tests/'));
});
