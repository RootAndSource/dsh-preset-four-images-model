#!/usr/bin/env node
/**
 * 四象模型·管理世界 bundle · 逐文件 SHA256 清单
 * 用法：node scripts/checksums.mjs
 * 输出：控制台表格 + 写入本 bundle 根目录的 SHA256SUMS.txt
 * 说明：SHA256SUMS.txt 自身不参与计算（否则无法收敛）。
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve, sep } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SELF = 'SHA256SUMS.txt';
/** artifacts/ 子树为产物（tgz 与产物清单），由 finalize.mjs 单独登记，不进入源文件逐文件清单 */
const ARTIFACTS_DIR = 'artifacts/';
/** 点文件（.gitignore 等）不属于发布内容，也不进归档，故不纳入清单（与 pack.mjs 的归档面保持一致） */
const isDotFile = (rel) => rel.split('/').some((seg) => seg.startsWith('.'));
/** 自引用文档：内容随构建变化，排除出逐文件清单（其哈希另见 FREEZE.md 与 artifacts/SHA256SUMS.txt） */
const SELF_REFERENTIAL = new Set([SELF, 'FREEZE.md']);
/** release-archive/ 为历史留档目录（存放上一版归档），不属本版发布内容、不进清单与归档 */
const SKIP_DIRS = new Set(['node_modules', '.git', 'release-archive']);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const files = walk(root)
  .map((f) => relative(root, f).split(sep).join('/'))
  .filter((f) => !SELF_REFERENTIAL.has(f))
  .filter((rel) => !isDotFile(rel))
  .filter((f) => !f.startsWith(ARTIFACTS_DIR))
  .sort();

const rows = files.map((rel) => {
  const buf = readFileSync(join(root, rel));
  return { rel, size: buf.length, sha256: createHash('sha256').update(buf).digest('hex').toUpperCase() };
});

const width = Math.max(...rows.map((r) => r.rel.length), 12);
const lines = [
  '# 四象模型·管理世界 bundle · 逐文件 SHA256',
  `# 文件数：${rows.length}`,
  '# 说明：本文件不含生成时间戳——内容确定的哈希清单才可复现，重跑本脚本不会产生无意义差异。',
  '',
  ...rows.map((r) => `${r.sha256}  ${String(r.size).padStart(8)}  ${r.rel}`),
  '',
];

writeFileSync(join(root, SELF), lines.join('\n'), 'utf8');

console.log('SHA256' + ' '.repeat(62) + '  SIZE  FILE');
for (const r of rows) console.log(`${r.sha256}  ${String(r.size).padStart(8)}  ${r.rel.padEnd(width)}`);
console.log(`\n共 ${rows.length} 个文件；已写入 ${SELF}`);
