#!/usr/bin/env node
/**
 * 四象模型·管理世界 bundle · 打包为 tgz
 * 用法：node scripts/pack.mjs
 * 输出：dist-share/artifacts/dsh-preset-four-images-model-<version>.tgz
 *
 * 实现说明：用 Node 内置 zlib 现写 ustar 头，无第三方依赖（不需要 tar 命令行）。
 * 确定性：条目按路径排序、mtime 归零、uid/gid 归零，同一份内容重复打包哈希一致。
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve, sep } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const prefix = pkg.name;
const outDir = join(root, 'artifacts');
const outFile = join(outDir, `${pkg.name}-${pkg.version}.tgz`);

const INCLUDE_TOP = ['package.json', 'cordis.patch.yml', 'README.md', 'INSTALL.md', 'MANIFEST.md', 'LICENSE'];
const INCLUDE_DIRS = ['subagents', 'scripts'];

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const entries = [];
for (const f of INCLUDE_TOP) entries.push(f);
for (const d of INCLUDE_DIRS) {
  const abs = join(root, d);
  for (const f of walk(abs)) entries.push(relative(root, f).split(sep).join('/'));
}
entries.sort();

function tarHeader(name, size) {
  const h = Buffer.alloc(512, 0);
  const write = (str, off, len) => h.write(str.slice(0, len), off, len, 'utf8');
  // 长路径走 ustar 前缀/名分割
  const bytes = Buffer.from(name, 'utf8');
  if (bytes.length <= 100) {
    write(name, 0, 100);
  } else {
    const cut = name.lastIndexOf('/', 155);
    write(name.slice(0, cut), 345, 155);
    write(name.slice(cut + 1), 0, 100);
  }
  write('0000644', 100, 8);            // mode
  write('0000000', 108, 8);            // uid
  write('0000000', 116, 8);            // gid
  write(size.toString(8).padStart(11, '0'), 124, 12); // size
  write('00000000000', 136, 12);       // mtime = 0
  h.write('        ', 148, 8);         // checksum 占位（空格）
  h.write('0', 156, 1);                // typeflag: 普通文件
  write('ustar', 257, 6);
  write('00', 263, 2);
  const sum = h.reduce((a, b) => a + b, 0);
  h.write(sum.toString(8).padStart(6, '0') + '\0 ', 148, 8);
  return h;
}

const chunks = [];
const manifest = [];
for (const rel of entries) {
  const data = readFileSync(join(root, rel));
  const name = `${prefix}/${rel}`;
  chunks.push(tarHeader(name, data.length), data);
  const pad = (512 - (data.length % 512)) % 512;
  if (pad) chunks.push(Buffer.alloc(pad, 0));
  manifest.push({ rel, size: data.length, sha256: createHash('sha256').update(data).digest('hex').toUpperCase() });
}
chunks.push(Buffer.alloc(1024, 0)); // 两个零块结束

const tar = Buffer.concat(chunks);
const tgz = gzipSync(tar, { level: 9 });
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, tgz);

const sha = createHash('sha256').update(tgz).digest('hex').toUpperCase();
console.log(`已打包 ${entries.length} 个文件`);
for (const m of manifest) console.log(`  ${String(m.size).padStart(8)}  ${m.rel}`);
console.log(`\n输出：${outFile}`);
console.log(`大小：${tgz.length} 字节`);
console.log(`SHA256：${sha}`);
