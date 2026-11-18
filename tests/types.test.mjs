import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const types=readFileSync(new URL('../types/rawanide.d.ts',import.meta.url),'utf8');
test('SDK exposes command, panel, editor and network type surfaces',()=>{for(const name of ['CommandApi','PanelApi','EditorApi','NetworkApi','PanelMessage'])assert.match(types,new RegExp('interface '+name+'\\b'));});
test('global rawanide binding is declared',()=>assert.match(types,/declare global \{ const rawanide: RawanIDEHost; \}/));
