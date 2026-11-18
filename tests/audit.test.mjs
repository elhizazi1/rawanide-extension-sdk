import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=new URL('../',import.meta.url).pathname;
function audit(name){return JSON.parse(execFileSync(process.execPath,[path.join(root,'bin/rawanide.mjs'),'audit',path.join(root,'templates',name)],{encoding:'utf8'}));}
test('audit succeeds on known hosted JS template',()=>{const r=audit('hosted-js');assert.deepEqual(r.errors,[]);assert.equal(r.staticOnly,true)});
test('audit succeeds on safe edit template',()=>assert.deepEqual(audit('hosted-js-safe-edit').errors,[]));
test('community archive manifest inventory is present and source-free',()=>{const r=JSON.parse(fs.readFileSync(path.join(root,'docs/community-manifest-audit.json')));assert.equal(r.sampleCount,22);assert.equal(r.samples.length,22);assert.ok(r.samples.every(x=>!('source' in x)&&Array.isArray(x.manifestKeys)))});
