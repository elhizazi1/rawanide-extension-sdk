// Deterministic .r1 packer shared by `rawanide-sdk pack` and the community repository builder.
// The repository templates ship a byte-identical copy of this file as tools/lib/zip.mjs, so the same
// source folder always produces the same archive (same SHA-256) in both places.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })()
export const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }

// Fixed timestamp: archives must not depend on when or where they were built.
const DOS_TIME = 0
const DOS_DATE = ((2026 - 1980) << 9) | (10 << 5) | 22

const EXCLUDED_PARTS = new Set(['.git', '.hg', '.svn', 'node_modules'])
// Which files belong in a package. `relative` uses "/" separators.
export const isPackagedPath = (relative) => {
  const parts = relative.split('/')
  if (parts.some((part) => EXCLUDED_PARTS.has(part))) return false
  const base = parts[parts.length - 1]
  return base !== '.DS_Store' && !base.endsWith('.r1') && !base.endsWith('.tmp')
}

// Package file names (relative, "/" separators), sorted. Symbolic links are rejected.
export function listFiles(dir, base = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const relative = path.posix.join(base, e.name)
    if (!isPackagedPath(relative)) return []
    if (e.isSymbolicLink()) throw new Error('Symlinks are not supported: ' + relative)
    return e.isDirectory() ? listFiles(path.join(dir, e.name), relative) : [relative]
  }).sort((a, b) => (a < b ? -1 : 1))
}

// Package entries ({ name, data }), sorted by name.
export const collectFiles = (dir) => listFiles(dir).map((name) => ({ name, data: fs.readFileSync(path.join(dir, name)) }))

export function makeZip(entries) {
  const locals = [], central = []
  let offset = 0
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, 'utf8')
    const packed = zlib.deflateRawSync(data, { level: 9 })
    const crc = crc32(data)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(8, 8)
    local.writeUInt16LE(DOS_TIME, 10); local.writeUInt16LE(DOS_DATE, 12); local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(packed.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(nameBuf.length, 26); local.writeUInt16LE(0, 28)
    locals.push(local, nameBuf, packed)
    const c = Buffer.alloc(46)
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10)
    c.writeUInt16LE(DOS_TIME, 12); c.writeUInt16LE(DOS_DATE, 14); c.writeUInt32LE(crc, 16)
    c.writeUInt32LE(packed.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(nameBuf.length, 28)
    c.writeUInt32LE(offset, 42)
    central.push(c, nameBuf)
    offset += 30 + nameBuf.length + packed.length
  }
  const centralBuf = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(centralBuf.length, 12); end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, centralBuf, end])
}

// name -> CRC-32 for every entry of an archive made by makeZip (no trailing comment).
export function zipCrcs(buf) {
  const map = new Map()
  let p = buf.readUInt32LE(buf.length - 6)
  while (buf.readUInt32LE(p) === 0x02014b50) {
    const crc = buf.readUInt32LE(p + 16), n = buf.readUInt16LE(p + 28), x = buf.readUInt16LE(p + 30), c = buf.readUInt16LE(p + 32)
    map.set(buf.toString('utf8', p + 46, p + 46 + n), crc)
    p += 46 + n + x + c
  }
  return map
}
