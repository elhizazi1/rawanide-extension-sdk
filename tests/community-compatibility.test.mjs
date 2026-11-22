import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const inventory=JSON.parse(readFileSync(new URL('../docs/history/community-compatibility-0.11.json',import.meta.url),'utf8'));
test('community archive inventory contains independently extracted manifests',()=>{
 assert.equal(inventory.sampleCount,inventory.samples.length);
 assert.ok(inventory.sampleCount>=20);
 assert.ok(inventory.samples.every(x=>x.manifestPresent&&typeof x.runtime==='string'));
});
test('community archive entrypoints are present where declared',()=>{
 assert.deepEqual(inventory.samples.filter(x=>!x.entrypointPresent),[]);
});
