import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
test('TypeScript usage compiles, invalid calls are rejected with expect-error', (t) => {
  const result=spawnSync('tsc', ['--noEmit','--strict','--skipLibCheck','--target','ES2020','tests/typing-smoke.ts'], {cwd:root,encoding:'utf8'});
  if(result.error?.code==='ENOENT') { t.skip('tsc unavailable; run npm run check:types:compile after installing TypeScript'); return; }
  assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
});
