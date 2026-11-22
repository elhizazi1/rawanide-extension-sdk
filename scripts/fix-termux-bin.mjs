// npm on Termux may copy JS bin entries into $PREFIX/bin instead of symlinking.
// Fix only the installed command shims, leaving package sources portable.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const prefix = process.env.PREFIX;
if (!prefix || !prefix.includes('/com.termux/')) process.exit(0);
const executableDir = path.join(prefix, 'bin');
for (const name of ['rawanide-sdk', 'rawanide-sdk-desktop', 'rawanide']) {
  const target = path.join(executableDir, name);
  const source = path.join(packageRoot, 'bin', 'rawanide-sdk.mjs'); // every command name runs the same launcher
  if (!fs.existsSync(source) || !fs.existsSync(target)) continue;
  // Do not overwrite a command owned by another installation.
  const real = fs.realpathSync(target);
  if (real !== target && real !== source) continue;
  if (real !== target) fs.unlinkSync(target); // Never write through a symlink into SDK source.
  const content = `#!${process.execPath}\nimport ${JSON.stringify(new URL(`file://${source}`).href)};\n`;
  fs.writeFileSync(target, content, {mode:0o755});
  fs.chmodSync(target, 0o755);
  console.log(`Configured Termux launcher: ${name}`);
}
