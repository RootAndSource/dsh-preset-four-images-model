#!/usr/bin/env node
/**
 * 四象模型·DSH智能体 bundle · 打包为 tgz
 * 用法：node scripts/pack.mjs
 * 输出：本 bundle 内 artifacts/dsh-preset-four-images-model-<version>.tgz
 *
 * 实现说明：用 Node 内置 zlib 现写 ustar 头，无第三方依赖（不需要 tar 命令行）。
 * 确定性：条目按路径排序、mtime 归零、uid/gid 归零，同一份内容重复打包哈希一致。
 * 同时导出 buildTgz()，供 check.mjs（产物核对）与 freeze-manifest.mjs（确定性）复用。
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve, sep } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** 归档根级文件（顺序无关，打包前统一排序） */
export const INCLUDE_TOP = ['package.json', 'cordis.patch.yml', 'cordis.patch.template.yml', 'README.md', 'INSTALL.md', 'MANIFEST.md', 'LICENSE', 'index.js', 'client.js', 'icon.png'];
/** 归档目录（递归包含） */
export const INCLUDE_DIRS = ['prompts', 'scripts', 'assets', 'locale'];

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

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

/**
 * 按 bundle 目录构建确定性 tgz（不写盘）。
 * @param {string} bundleRoot bundle 根目录
 * @returns {{buffer: Buffer, entries: Array<{rel: string, size: number, sha256: string}>, sha256: string, size: number}}
 */
export function buildTgz(bundleRoot = root) {
  const pkg = JSON.parse(readFileSync(join(bundleRoot, 'package.json'), 'utf8'));
  const prefix = pkg.name;
  const entries = [...INCLUDE_TOP];
  for (const d of INCLUDE_DIRS) {
    for (const f of walk(join(bundleRoot, d))) entries.push(relative(bundleRoot, f).split(sep).join('/'));
  }
  entries.sort();

  const chunks = [];
  const manifest = [];
  for (const rel of entries) {
    const data = readFileSync(join(bundleRoot, rel));
    const name = `${prefix}/${rel}`;
    chunks.push(tarHeader(name, data.length), data);
    const pad = (512 - (data.length % 512)) % 512;
    if (pad) chunks.push(Buffer.alloc(pad, 0));
    manifest.push({ rel, size: data.length, sha256: createHash('sha256').update(data).digest('hex').toUpperCase() });
  }
  chunks.push(Buffer.alloc(1024, 0)); // 两个零块结束

  const buffer = gzipSync(Buffer.concat(chunks), { level: 9 });
  return { buffer, entries: manifest, sha256: createHash('sha256').update(buffer).digest('hex').toUpperCase(), size: buffer.length };
}

const invokedPath = process.argv[1] === undefined ? undefined : resolve(process.argv[1]);
if (invokedPath === fileURLToPath(import.meta.url)) {
  const { buffer, entries, sha256, size } = buildTgz();
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const outDir = join(root, 'artifacts');
  const outFile = join(outDir, `${pkg.name}-${pkg.version}.tgz`);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, buffer);
  console.log(`已打包 ${entries.length} 个文件`);
  for (const m of entries) console.log(`  ${String(m.size).padStart(8)}  ${m.rel}`);
  console.log(`\n输出：${outFile}`);
  console.log(`大小：${size} 字节`);
  console.log(`SHA256：${sha256}`);
}
