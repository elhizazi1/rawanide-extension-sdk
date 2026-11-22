import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('release-check verifies every shipped template',()=>{
 const report=JSON.parse(execFileSync(process.execPath,['bin/rawanide.mjs','release-check'],{cwd:root,encoding:'utf8'}));
 assert.equal(report.sdkVersion,'1.1.0');assert.equal(report.templatesChecked,6);
 assert.deepEqual(report.errors,[]);
});
test('npm metadata and types are distributed',()=>{
 const pkg=JSON.parse(readFileSync(path.join(root,'package.json'),'utf8'));
 assert.equal(pkg.version,'1.1.0');assert.equal(pkg.types,'./types/rawanide.d.ts');
 assert.ok(pkg.files.includes('types/'));assert.equal(pkg.private,false);
});
