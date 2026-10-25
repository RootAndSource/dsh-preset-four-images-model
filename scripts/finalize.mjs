#!/usr/bin/env node
/**
 * 四象模型·DSH智能体 bundle · 收尾（生成产物哈希）
 * 用法：node scripts/finalize.mjs
 * 动作：计算 dist-share/artifacts/ 下所有 .tgz 的大小与 SHA256，写入同目录 SHA256SUMS.txt（该文件自身除外）。
 * 说明：产物哈希单独成文件，避免与被哈希的文档互相引用形成循环。
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const artDir = join(root, 'artifacts');
const SELF = 'SHA256SUMS.txt';

let names = [];
try {
  names = readdirSync(artDir).filter((n) => n.endsWith('.tgz') && statSync(join(artDir, n)).isFile()).sort();
} catch {
  console.log(`未找到产物目录 ${artDir}，先运行 node scripts/pack.mjs`);
  process.exit(0);
}

if (!names.length) {
  console.log(`产物目录为空：${artDir}，先运行 node scripts/pack.mjs`);
  process.exit(0);
}

const rows = names.map((n) => {
  const buf = readFileSync(join(artDir, n));
  return { n, size: buf.length, sha256: createHash('sha256').update(buf).digest('hex').toUpperCase() };
});

const lines = [
  '# 四象模型·DSH智能体 · 打包产物校验',
  '# 说明：本文件不含生成时间戳——内容确定的产物清单才可复现，重跑本脚本不会产生无意义差异。',
  '',
  ...rows.map((r) => `${r.sha256}  ${String(r.size).padStart(8)}  ${r.n}`),
  '',
  '# 核对（PowerShell）：',
  '#   Get-FileHash .\\artifacts\\<文件名>.tgz -Algorithm SHA256',
  '# 哈希不一致就不要安装。',
  '',
];
writeFileSync(join(artDir, SELF), lines.join('\n'), 'utf8');

console.log(`已写入 ${join(artDir, SELF).replace(root, '<bundle>')}`);
for (const r of rows) console.log(`  ${r.sha256}  ${String(r.size).padStart(8)}  ${r.n}`);
