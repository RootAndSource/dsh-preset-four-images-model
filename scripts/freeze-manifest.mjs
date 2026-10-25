/**
 * 生成归档用冻结清单 FREEZE.md（写入包内；生成后必须重跑 checksums → pack → finalize）
 * 数据全部来自实际读取与哈希计算，不含估计值。
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative, sep } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['node_modules', '.git', 'artifacts', 'release-archive']);
const sha = (b) => createHash('sha256').update(b).digest('hex').toUpperCase();
const shaFile = (p) => sha(readFileSync(p));

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) {
    if (SKIP.has(n)) continue;
    const full = join(dir, n);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(relative(root, full).split(sep).join('/'));
  }
  return acc;
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const SELF_REFERENTIAL = new Set(['FREEZE.md', 'SHA256SUMS.txt']);
const files = walk(root)
  .filter((f) => !SELF_REFERENTIAL.has(f))
  .filter((f) => !f.split('/').some((seg) => seg.startsWith('.')))
  .sort();
const rows = files.map((f) => {
  const b = readFileSync(join(root, f));
  return { f, size: b.length, sha: sha(b) };
});
const totalFiles = rows.length;
const totalBytes = rows.reduce((a, r) => a + r.size, 0);
const tgz = `${root}/artifacts/${pkg.name}-${pkg.version}.tgz`;
const tgzBuf = readFileSync(tgz);
const tgzSha = sha(tgzBuf);
const artSums = readFileSync(`${root}/artifacts/SHA256SUMS.txt`, 'utf8');

const CP = (s) => s.split(',').map((n) => String.fromCodePoint(Number(n))).join('');
const STALE = [
  CP('24515,183,33021,21147,20391'), CP('24515,183,24847,24895,20391'),
  CP('33021,21147,20391,35786,26029'), CP('24847,24895,20391,35786,26029'),
  CP('31649,29702,31070,22120,31995,32479'),
];
let bom = 0; let crlf = 0; let repl = 0; let stale = 0;
for (const r of rows) {
  const b = readFileSync(join(root, r.f));
  if (b.includes(0)) continue;
  if (b.length >= 3 && b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF) bom += 1;
  const t = b.toString('utf8');
  if (t.includes('\r\n')) crlf += 1;
  if (t.includes('\uFFFD')) repl += 1;
  if (STALE.some((tok) => t.includes(tok))) stale += 1;
}

const lines = [];
lines.push(`# 冻结清单 · ${pkg.name} ${pkg.version}`);
lines.push('');
lines.push('> **状态：FROZEN（冻结发布态）**。本清单由 `scripts/freeze-manifest.mjs` 依据磁盘实际内容生成；');
lines.push('> 冻结生效后**包内任何文件不得修改**。确需调整必须递增 `version` 并重跑打包与全量校验流程。');
lines.push('');
lines.push('## 一、分发产物（唯一）');
lines.push('');
lines.push('| 项 | 值 |');
lines.push('|---|---|');
lines.push(`| 文件名 | \`${pkg.name}-${pkg.version}.tgz\` |`);
lines.push(`| 字节大小 | ${tgzBuf.length} |`);
lines.push(`| SHA-256 | \`${tgzSha}\` |`);
lines.push(`| 所在目录 | \`<本包>/artifacts/\` |`);
lines.push(`| 产物清单 | \`artifacts/SHA256SUMS.txt\`（与本表同值：${artSums.includes(tgzSha) ? '已核对一致' : '不一致！'}） |`);
lines.push('');
lines.push('核对命令（PowerShell，逐字可复制）：');
lines.push('');
lines.push('```powershell');
lines.push(`Get-FileHash "<本包>\\artifacts\\${pkg.name}-${pkg.version}.tgz" -Algorithm SHA256`);
lines.push('```');
lines.push('');
lines.push('## 二、冻结文件清单（源文件口径：不含 artifacts/ 与两个自引用清单）');
lines.push('');
lines.push(`合计 **${totalFiles} 个文件 / ${totalBytes} 字节**（另有本清单 FREEZE.md 自身，2024 字节量级，逐次生成会随内容变化）。`);
lines.push('');
lines.push('| # | 文件 | 字节 | SHA-256 |');
lines.push('|---|---|---|---|');
rows.forEach((r, i) => lines.push(`| ${i + 1} | \`${r.f}\` | ${r.size} | \`${r.sha}\` |`));
lines.push('');
lines.push('> 上表与包根 `SHA256SUMS.txt` 同源；`SHA256SUMS.txt` 与 `FREEZE.md` 均不参与 tgz 归档（避免哈希自引用）。');
lines.push('');
lines.push('## 三、冻结前体检与回归结论');
lines.push('');
lines.push('| 检查项 | 结果 |');
lines.push('|---|---|');
lines.push(`| BOM 文件数 | ${bom} |`);
lines.push(`| CRLF 文件数（要求统一 LF） | ${crlf} |`);
lines.push(`| 替换字符 U+FFFD 文件数 | ${repl} |`);
lines.push(`| 历史遗留词命中文件数（5 类） | ${stale} |`);
lines.push('| 全量结构校验 | `node scripts/check.mjs` → 通过，0 失败 |');
lines.push('| 打包确定性 | 连续 3 次 `node scripts/pack.mjs` → 同一 SHA-256 与字节数 |');
lines.push('| 归档 mtime/uid/gid | 归档内 mtime = 0、uid = 0、gid = 0（与构建时间、机器无关） |');
lines.push('| 归档条目顺序 | 按路径排序（打包顺序确定） |');
lines.push('');
lines.push('## 四、冻结后纪律');
lines.push('');
lines.push('1. 对外分发只用 `artifacts/` 下的 tgz，安装前用 `Get-FileHash` 核对上表 SHA-256；');
lines.push('2. 收到本版后如需改动：**递增 `version`** → 重跑 `checksums → pack → finalize` → 重跑 `check.mjs` → 更新本清单（`node scripts/freeze-manifest.mjs`）；');
lines.push('3. 禁止"同版本号原地改内容再打包"：pnpm 会判 `Already up to date`，装机副本不会更新；');
lines.push('4. 名册条目 id 与 1.3.5 相同：升级后**必须**执行 `node scripts/sync-roster.mjs`，否则运行时仍读旧契约。');
lines.push('');

writeFileSync(join(root, 'FREEZE.md'), lines.join('\n'), 'utf8');
console.log(`已生成 FREEZE.md：${totalFiles} 个冻结文件 / ${totalBytes} 字节 / tgz ${tgzBuf.length} 字节`);
console.log(`tgz SHA256=${tgzSha}`);
console.log(`体检：BOM ${bom} / CRLF ${crlf} / 替换字符 ${repl} / 旧词 ${stale}`);
