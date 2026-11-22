import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,cpSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
test('hosted-js template validates',()=>{const output=execFileSync(process.execPath,[path.join(root,'bin/rawanide.mjs'),'validate',path.join(root,'templates/hosted-js')],{encoding:'utf8'});assert.match(output,/PASS/)});
test('declarative template validates',()=>{const output=execFileSync(process.execPath,[path.join(root,'bin/rawanide.mjs'),'validate',path.join(root,'templates/declarative')],{encoding:'utf8'});assert.match(output,/PASS/)});
test('contract is source-grounded',()=>{const c=JSON.parse(readFileSync(path.join(root,'contract.json')));assert.equal(c.apiVersion,'1.1');assert.equal(c.maxEntries,2000);assert.ok(c.permissions.includes('PROCESS_EXECUTION'))});

test('hello template registers a real hosted-js command',()=>{
 const code=readFileSync(path.join(root,'templates/hosted-js/src/main.js'),'utf8');
 assert.match(code,/rawanide\.commands\.registerCommand\(/);
 assert.match(code,/rawanide\.window\.showToast\(/);
 assert.doesNotMatch(code,/editor\.showInfo/);
});

test('hosted-js command is declared in manifest and registered in source',()=>{
 const m=JSON.parse(readFileSync(path.join(root,'templates/hosted-js/manifest.json')));
 const js=readFileSync(path.join(root,'templates/hosted-js/src/main.js'),'utf8');
 assert.equal(m.commands[0].runtime,true);
 assert.match(js,/registerCommand\('local\.sdk-hello\.sayHello'/);
 assert.ok(m.activationEvents.includes('onCommand'));
 assert.ok(m.permissions.includes('UI_ACCESS'));
});
