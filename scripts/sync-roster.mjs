#!/usr/bin/env node
/**
 * 四象模型·DSH智能体 bundle · 活名册同步
 *
 * 用法：
 *   node scripts/sync-roster.mjs                # 把本 bundle 的条目同步到活名册目录
 *   node scripts/sync-roster.mjs --check        # 只报告差异，不写任何文件（退出码 2 表示存在差异）
 *   node scripts/sync-roster.mjs --prune        # 同时清理名册目录里本包已删除的 four-images-*.yaml
 *   node scripts/sync-roster.mjs --dir <路径>   # 覆盖目标目录（支持 ~ 开头；默认 $DSH_HOME/subagents）
 *
 * 存在的原因：升级 bundle **不会**自动同步 `$DSH_HOME/subagents/`，运行时读的是名册副本。
 * 曾因此连续两轮真机复测失效（bundle 已更新、运行时仍在用旧条目）。
 *
 * 安全约定：
 *   - 只处理 `four-images-*.yaml`（本包自有前缀），**不碰**其他包的条目；
 *   - 覆盖或删除前，把将被改动的原文件备份到 `<目标>\_backups\sync-<时间戳>\`；
 *   - 不使用 --prune 时绝不删除任何文件；
 *   - 删除路径必须落在目标目录内且前缀匹配（防路径穿越）；
 *   - 写完后逐文件复核哈希，不一致即退出码 1。
 *   - 仅用 Node 内置模块。
 */

import {
  readFileSync, readdirSync, existsSync, mkdirSync, statSync, copyFileSync, rmSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PREFIX = 'four-images-';
const bundleRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(bundleRoot, 'subagents');

// ---------- 参数 ----------
const argv = process.argv.slice(2);
const checkOnly = argv.includes('--check');
const prune = argv.includes('--prune');
const dirFlag = argv.indexOf('--dir');
const explicitDir = dirFlag !== -1 ? argv[dirFlag + 1] : undefined;

const expandDir = (raw) => {
  const home = homedir();
  if (!raw) return join(process.env.DSH_HOME || join(home, '.dsh'), 'subagents');
  let p = raw.trim();
  if (p === '~') return home;
  if (p.startsWith('~/') || p.startsWith('~\\')) p = join(home, p.slice(2));
  return resolve(p);
};
const targetDir = expandDir(explicitDir);
const targetRoot = resolve(targetDir);

const sha = (buf) => createHash('sha256').update(buf).digest('hex').toUpperCase();
const isMine = (name) => name.startsWith(PREFIX) && name.endsWith('.yaml');

// ---------- 前置检查 ----------
if (!existsSync(srcDir) || !statSync(srcDir).isDirectory()) {
  console.error(`✗ 源目录不存在：${srcDir}`);
  process.exit(1);
}
const srcFiles = readdirSync(srcDir).filter(isMine).sort();
if (srcFiles.length === 0) {
  console.error(`✗ 源目录内没有 ${PREFIX}*.yaml 条目：${srcDir}`);
  process.exit(1);
}

console.log(`四象模型·DSH智能体 · 活名册同步${checkOnly ? '（--check 预览模式，不写文件）' : ''}`);
console.log(`  源  ：${srcDir}`);
console.log(`  目标：${targetDir}`);
console.log(`  条目：${srcFiles.length} 个（仅处理前缀 ${PREFIX}*）\n`);

if (!existsSync(targetDir)) {
  if (checkOnly) {
    console.log(`! 目标目录不存在（--check 不创建）：${targetDir}`);
    process.exit(2);
  }
  mkdirSync(targetDir, { recursive: true });
  console.log(`+ 已创建目标目录：${targetDir}\n`);
}

// ---------- 逐条目比对 ----------
const plan = { add: [], update: [], same: [], stale: [] };
const srcHashes = new Map();

for (const name of srcFiles) {
  const buf = readFileSync(join(srcDir, name));
  const srcHash = sha(buf);
  srcHashes.set(name, srcHash);
  const dstPath = join(targetDir, name);
  if (!existsSync(dstPath)) {
    plan.add.push({ name, srcHash, dstHash: null });
  } else {
    const dstHash = sha(readFileSync(dstPath));
    (dstHash === srcHash ? plan.same : plan.update).push({ name, srcHash, dstHash });
  }
}

for (const name of readdirSync(targetDir).filter(isMine).sort()) {
  if (!srcFiles.includes(name)) plan.stale.push({ name, srcHash: null, dstHash: sha(readFileSync(join(targetDir, name))) });
}

const fmt = (o) =>
  `  ${o.name.padEnd(34)} ${(o.srcHash ?? '--------').slice(0, 8)} ← ${(o.dstHash ?? '(不存在)').slice(0, 8)}`;
const section = (title, rows, extra = '') => {
  console.log(`  [${title}] ${rows.length === 0 ? '无' : `${rows.length} 个${extra}`}`);
  rows.forEach((o) => console.log(fmt(o)));
};

console.log('差异计划：');
section('新增', plan.add);
section('更新', plan.update);
section('一致', plan.same);
section('陈旧', plan.stale, prune ? '（本次将删除）' : '（需 --prune 才删除）');

const drift = plan.add.length + plan.update.length + plan.stale.length;

// ---------- --check ----------
if (checkOnly) {
  console.log(
    drift === 0
      ? '\n结论：活名册已与 bundle 一致（0 处差异）'
      : `\n结论：存在 ${drift} 处差异 —— 运行 node scripts/sync-roster.mjs 进行同步`,
  );
  process.exit(drift === 0 ? 0 : 2);
}

if (drift === 0) {
  console.log('\n结论：无需同步（活名册已与 bundle 一致）');
  process.exit(0);
}

// ---------- 备份 ----------
const toBackup = [...plan.update, ...(prune ? plan.stale : [])];
let backupDir = null;
if (toBackup.length > 0) {
  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  backupDir = join(targetDir, '_backups', `sync-${stamp}`);
  mkdirSync(backupDir, { recursive: true });
  for (const o of toBackup) copyFileSync(join(targetDir, o.name), join(backupDir, o.name));
  console.log(`\n已备份 ${toBackup.length} 个将改动的原文件 → ${backupDir}`);
}

// ---------- 写入与删除 ----------
for (const o of [...plan.add, ...plan.update]) copyFileSync(join(srcDir, o.name), join(targetDir, o.name));

if (prune) {
  for (const o of plan.stale) {
    const p = resolve(targetDir, o.name);
    const inside = p.startsWith(targetRoot + (targetRoot.endsWith('\\') ? '' : '\\')) || p.startsWith(targetRoot + '/');
    if (!inside || !isMine(basename(p))) {
      console.error(`✗ 拒绝删除（越界或前缀不符）：${p}`);
      continue;
    }
    rmSync(p);
  }
}

// ---------- 复核 ----------
const failed = srcFiles.filter((name) => {
  const p = join(targetDir, name);
  return !existsSync(p) || sha(readFileSync(p)) !== srcHashes.get(name);
});

console.log(
  `\n写入完成：新增 ${plan.add.length} / 更新 ${plan.update.length} / 未变 ${plan.same.length}${
    prune ? ` / 删除陈旧 ${plan.stale.length}` : ''
  }`,
);
if (failed.length > 0) {
  console.error(`结论：同步后复核发现 ${failed.length} 个文件不一致：${failed.join(', ')}`);
  process.exit(1);
}
console.log(`结论：同步成功，${srcFiles.length} 个条目已与 bundle 逐字节一致`);
if (!prune && plan.stale.length > 0) console.log(`注意：名册目录仍有 ${plan.stale.length} 个陈旧条目（清理请加 --prune）`);
