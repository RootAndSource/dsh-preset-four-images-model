#!/usr/bin/env node
/**
 * 四象模型·DSH智能体 bundle · 结构校验（名册派发版）
 * 用法：node scripts/check.mjs
 * 仅使用 Node 内置模块，无第三方依赖。
 *
 * 校验项：
 *   A. 必需文件齐全（入口、清单、资源目录、说明文件、10 个名册条目）
 *   B. 清单元数据完整（name / version / description / 入口指向）
 *   C. 入口文件结构（preset id、order、persona 正文含六维定义与禁止合并条款、三个插件引用）
 *   D. 10 个名册条目：字段全部在名册允许集合内、无被拒字段、persona 非空、
 *      模型路由符合 A/B 阶段约定、无替换字符、无行粘连、id 合法
 *   D2. 1.4.0 修正项：契约 dimension 必须是六维别名之一；条目文本（含注释）不得出现
 *      维度拆分之前的侧别命名与自造的系统称谓（词表按码位构造，本脚本自身不回显旧词）
 *   E. 全部文本文件的外部绝对路径扫描（运行时依赖为零）
 *   F. 打包产物可读性（gzip 魔数）
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve, sep } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED = ['package.json', 'cordis.patch.yml', 'README.md', 'INSTALL.md', 'MANIFEST.md'];
const ROLES = [
  'four-images-subject', 'four-images-environment',
  'four-images-pos-a', 'four-images-beh-a', 'four-images-tal-a', 'four-images-cog-a',
  'four-images-pos-b', 'four-images-beh-b', 'four-images-tal-b', 'four-images-cog-b',
];
const A_ROLES = ['four-images-subject', 'four-images-environment', 'four-images-pos-a', 'four-images-beh-a', 'four-images-tal-a', 'four-images-cog-a'];
const B_ROLES = ['four-images-pos-b', 'four-images-beh-b', 'four-images-tal-b', 'four-images-cog-b'];

/** dsh-subagent-library 0.3.x 允许的条目字段（未知字段会被插件响亮拒绝） */
const ROSTER_KEYS = new Set([
  'description', 'provider', 'model', 'reasoningEffort', 'subagentProvider',
  'maxTokens', 'persona', 'toolFilter', 'maxDepth', 'backgroundMode', 'enabled',
]);
/** 名册插件不认识的旧 bundle 字段：出现即会让整条条目被跳过 */
const FORBIDDEN_KEYS = ['id', 'displayName', 'tools'];

const TEXT_EXT = ['.json', '.yml', '.yaml', '.md', '.mjs', '.js', '.txt'];
const SKIP_EXT = new Set(['.tgz', '.gz', '.zip', '.png', '.jpg', '.pdf']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'artifacts']);

const pass = [];
const fail = [];
const warn = [];
const ok = (m) => pass.push(m);
const bad = (m) => fail.push(m);
const soft = (m) => warn.push(m);

const read = (p) => readFileSync(join(root, p), 'utf8').replace(/^\uFEFF/, '');
const isFile = (p) => existsSync(join(root, p)) && statSync(join(root, p)).isFile();

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const parentDir = resolve(root, '..');

/** 取 YAML 块标量：`<indent>key: |` 之后的更深缩进行，去掉公共缩进 */
function blockScalar(text, key, indent) {
  const lines = text.split(/\r?\n/);
  const pad = ' '.repeat(indent);
  const start = lines.findIndex((l) => l.startsWith(`${pad}${key}: |`));
  if (start === -1) return null;
  const out = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const l = lines[i];
    if (l.trim() === '') { out.push(''); continue; }
    const cur = l.match(/^ */)[0].length;
    if (cur <= indent) break;
    out.push(l);
  }
  const body = out.join('\n').replace(/\n+$/, '');
  const indents = body.split('\n').filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return body.split('\n').map((l) => l.slice(cut)).join('\n');
}

/** 取顶层标量：`<key>: value` */
function topScalar(text, key) {
  const m = text.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

/** 顶层键名列表（跳过注释、空行与块标量内容） */
function topKeys(text) {
  const keys = [];
  let inBlock = false;
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*#/.test(line) || line.trim() === '') continue;
    if (inBlock) { if (/^\s/.test(line)) continue; inBlock = false; }
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):/);
    if (!m) continue;
    keys.push(m[1]);
    if (/: \|\s*$/.test(line)) inBlock = true;
  }
  return keys;
}

/**
 * 从 persona 正文中抽出「输出格式」段落里的 JSON 契约并尝试解析。
 * 目的是拦住"契约结构塌陷"这类破坏（例如两个键被压到同一行导致 JSON 非法）——
 * 关键词断言拦不住这种问题，只有真正 JSON.parse 才能拦住。
 */
function extractContract(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => /##\s*输出格式/.test(l));
  if (start === -1) return { ok: false, reason: '未找到「输出格式」章节' };
  // 章节内第一个"单独一行的 {"即契约起点
  let i = -1;
  for (let k = start + 1; k < lines.length; k += 1) {
    if (/^\s*\{\s*$/.test(lines[k])) { i = k; break; }
    if (/^\s*##\s/.test(lines[k])) break;
  }
  if (i === -1) return { ok: false, reason: '输出格式章节内未找到契约起始 {' };
  // 逐字符扫描，按花括号深度找闭合，字符串内部不计
  const buf = [];
  let depth = 0;
  let inStr = false;
  let esc = false;
  let closed = false;
  for (let k = i; k < lines.length && !closed; k += 1) {
    const line = lines[k];
    for (let c = 0; c < line.length; c += 1) {
      const ch = line[c];
      buf.push(ch);
      if (inStr) {
        if (esc) esc = false;
        else if (ch === '\\') esc = true;
        else if (ch === '"') inStr = false;
      } else if (ch === '"') inStr = true;
      else if (ch === '{') depth += 1;
      else if (ch === '}') {
        depth -= 1;
        if (depth === 0) { closed = true; break; }
      }
    }
    if (!closed) buf.push('\n');
  }
  if (!closed) return { ok: false, reason: '契约花括号未闭合' };
  const raw = buf.join('');
  try {
    return { ok: true, value: JSON.parse(raw), raw };
  } catch (e) {
    return { ok: false, reason: `JSON 解析失败：${e.message}`, raw };
  }
}

console.log(`四象模型·DSH智能体 bundle（${JSON.parse(read('package.json')).version}）校验（名册派发版） · 根目录 ${root}\n`);

// ---------- A. 必需文件 ----------
for (const f of REQUIRED) (isFile(f) ? ok(`存在 ${f}`) : bad(`缺失 ${f}`));
for (const r of ROLES) {
  const p = `subagents/${r}.yaml`;
  isFile(p) ? ok(`存在名册条目 ${p}`) : bad(`缺失名册条目 ${p}`);
}
if (existsSync(join(root, 'subagents'))) {
  const names = readdirSync(join(root, 'subagents'));
  const extra = names.filter((n) => !ROLES.includes(n.replace(/\.yaml$/, '')));
  if (extra.length) bad(`subagents/ 有多余文件（名册插件会当作条目或诊断）：${extra.join(', ')}`);
  const legacy = names.filter((n) => n.endsWith('.yml'));
  if (legacy.length) soft(`存在非规范的 .yml 后缀：${legacy.join(', ')}（名册插件会收敛为 .yaml 并丢掉手写注释）`);
}

// ---------- B. 清单元数据 ----------
let pkg = null;
try {
  pkg = JSON.parse(read('package.json'));
} catch (e) {
  bad(`package.json 不是合法 JSON：${e.message}`);
}
if (pkg) {
  for (const k of ['name', 'version', 'description']) {
    pkg[k] ? ok(`package.json.${k} = ${pkg[k]}`) : bad(`package.json 缺 ${k}`);
  }
  const entry = pkg.dsh?.bundle?.patch;
  if (!entry) bad('package.json 缺 dsh.bundle.patch（入口指向）');
  else {
    const target = entry.replace(/^\.\//, '');
    isFile(target) ? ok(`入口指向存在：${entry} → ${target}`) : bad(`入口指向的文件不存在：${entry}`);
  }
  pkg.dsh?.manifestVersion ? ok(`dsh.manifestVersion = ${pkg.dsh.manifestVersion}`) : bad('缺 dsh.manifestVersion');
  for (const f of pkg.files ?? []) {
    if (f.endsWith('/')) {
      const d = f.replace(/\/$/, '');
      existsSync(join(root, d)) ? ok(`files 声明的目录存在：${f}`) : bad(`files 声明的目录不存在：${f}`);
    } else if (!isFile(f)) bad(`files 声明的文件不存在：${f}`);
  }
}

// ---------- C. 入口结构 ----------
let patchText = null;
if (isFile('cordis.patch.yml')) {
  patchText = read('cordis.patch.yml');
  /\n\s*- insert:/.test(patchText) ? ok('入口含 - insert: 段') : bad('入口缺 - insert: 段');
  /id:\s*preset-four-images/.test(patchText) ? ok('Loader row id = preset-four-images') : bad('入口缺 row id');
  /id:\s*four-images-model/.test(patchText) ? ok('preset id = four-images-model') : bad('入口缺 preset id');
  /order:\s*10/.test(patchText) ? ok('order = 10') : soft('入口未设置 order');

  const prefix = blockScalar(patchText, 'prefix', 14);
  if (prefix) {
    prefix.length > 1500 ? ok(`persona 正文已内嵌（${prefix.length} 字符）`) : bad(`persona 正文过短（${prefix.length} 字符）`);
    for (const k of ['六维定义', '维度独立性与禁止合并', '具名名册', '阶段一', '阶段二', '阶段三', '阶段四', '质量纪律', '降级路径']) {
      prefix.includes(k) ? ok(`persona 含要点 ${k}`) : bad(`persona 缺要点 ${k}`);
    }
    for (const id of ROLES) {
      prefix.includes(id) ? ok(`persona 提到名册 id ${id}`) : bad(`persona 未提到名册 id ${id}`);
    }
    /list_subagents/.test(prefix) ? ok('persona 使用 list_subagents') : bad('persona 未使用 list_subagents');
    /delegate/.test(prefix) ? ok('persona 使用 delegate') : bad('persona 未使用 delegate');
    /[\uFFFD]/.test(prefix) ? bad('persona 含替换字符') : ok('persona 无替换字符');

    // 六维结构断言：主体置首 + 才能与心态各自独立成维、禁止合并
    prefix.includes('主体维度') ? ok('persona 含独立「主体维度」') : bad('persona 缺独立「主体维度」');
    /主体维度排在最前/.test(prefix) ? ok('persona 声明主体维度排在最前') : bad('persona 未声明主体维度置首');
    prefix.includes('才能维度') ? ok('persona 含独立「才能维度」') : bad('persona 缺独立「才能维度」');
    prefix.includes('心态维度') ? ok('persona 含独立「心态维度」') : bad('persona 缺独立「心态维度」');
    prefix.includes('才能与心态是两个独立维度') ? ok('persona 声明才/心为两个独立维度') : bad('persona 未声明才/心为独立维度');
    /禁止把才能与心态合并为一份方案/.test(prefix) ? ok('persona 禁止把才/心合并为一份方案') : bad('persona 缺「禁止合并才/心方案」条款');
    /六维分析总览表/.test(prefix) ? ok('persona 要求六维总览表') : bad('persona 未要求六维总览表');
    /主体必须在最前一栏/.test(prefix) ? ok('persona 要求主体列在最前') : bad('persona 未要求主体列在最前');
    /逐维独立成节/.test(prefix) ? ok('persona 要求逐维独立成节') : bad('persona 未要求逐维独立成节');
    /利益相关者/.test(prefix) ? ok('persona 提及利益相关者') : bad('persona 未提及利益相关者');
    /人物画像|人物\/组织画像/.test(prefix) ? ok('persona 提及人物/组织画像') : bad('persona 未提及人物/组织画像');
    if (/才能·心态维度/.test(prefix)) bad('persona 仍含已废弃的「才能·心态维度」合并表述');
    else ok('persona 无「才能·心态维度」合并表述');
    if (/五维定义|五维分析总览表/.test(prefix)) bad('persona 仍含已废弃的五维表述');
    else ok('persona 无已废弃的五维表述');
  } else {
    bad('入口未找到 persona 的 prefix 块标量');
  }
  for (const p of ['@deepseek-ai/dsh-agent-preset', '@deepseek-ai/dsh-persona', '@deepseek-ai/dsh-tool-cordis']) {
    patchText.includes(`'${p}'`) ? ok(`引用 ${p}`) : bad(`未引用 ${p}`);
  }
}

// ---------- D. 名册条目 ----------
const seenIds = new Set();
for (const r of ROLES) {
  const p = `subagents/${r}.yaml`;
  if (!isFile(p)) continue;
  const t = read(p);
  const keys = topKeys(t);
  const unknown = keys.filter((k) => !ROSTER_KEYS.has(k));
  const forbidden = keys.filter((k) => FORBIDDEN_KEYS.includes(k));

  unknown.length === 0
    ? ok(`${p} 字段全部合法（${keys.join(', ')}）`)
    : bad(`${p} 含名册不认识的字段：${unknown.join(', ')}（插件会整条拒绝该条目）`);
  forbidden.length === 0 ? ok(`${p} 无旧 bundle 专属字段`) : bad(`${p} 含被名册插件拒绝的字段：${forbidden.join(', ')}`);

  // 主体条目断言：必须覆盖利益相关者、利益关联、人物/组织画像三类产出
  if (r === 'four-images-subject') {
    /利益相关者/.test(t) ? ok('主体条目含「利益相关者」') : bad('主体条目缺「利益相关者」');
    /利益关联/.test(t) ? ok('主体条目含「利益关联」') : bad('主体条目缺「利益关联」');
    /人物画像/.test(t) && /组织画像/.test(t) ? ok('主体条目含「人物画像」与「组织画像」') : bad('主体条目缺人物/组织画像');
    /stakeholders/.test(t) ? ok('主体条目输出契约含 stakeholders') : bad('主体条目输出契约缺 stakeholders');
    /profile_type/.test(t) ? ok('主体条目输出契约含 profile_type') : bad('主体条目输出契约缺 profile_type');
    /只做确认与分析，不出方案/.test(t) ? ok('主体条目声明不出方案') : bad('主体条目未声明「不出方案」');
    /契约硬约束/.test(t) ? ok('主体条目含契约硬约束条款') : bad('主体条目缺契约硬约束条款');
    /不得自行改结构或造词/.test(t) ? ok('主体条目禁止自造枚举/改结构') : bad('主体条目未禁止自造枚举/改结构');
    /stakeholder_matrix/.test(t) && /strategy/.test(t) ? ok('主体条目矩阵契约为 name/interest/influence/strategy') : bad('主体条目矩阵契约不完整');
  }

  // toolFilter 断言：4 个只读诊断角色必须 deny 掉文件写入类与 shell 类工具
  const READONLY_ROLES = ['four-images-subject', 'four-images-pos-a', 'four-images-beh-a', 'four-images-tal-a', 'four-images-cog-a'];
  const REQUIRED_DENY = ['write', 'edit', 'pwsh', 'bash'];
  const tf = t.match(/^toolFilter:\n((?:\s+.*\n?)*)/m);
  if (READONLY_ROLES.includes(r)) {
    if (!tf) bad(`${p} 缺 toolFilter（只读诊断角色必须禁写文件）`);
    else {
      const denyMatch = tf[1].match(/deny:\s*\[([^\]]*)\]/);
      const denied = denyMatch ? denyMatch[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
      const missing = REQUIRED_DENY.filter((d) => !denied.includes(d));
      missing.length === 0
        ? ok(`${p} toolFilter.deny 已覆盖 ${REQUIRED_DENY.join(' / ')}`)
        : bad(`${p} toolFilter.deny 缺 ${missing.join(' / ')}`);
      ok(`${p} toolFilter.deny = [${denied.join(', ')}]`);
    }
  } else if (tf) {
    soft(`${p} 也设了 toolFilter（非只读角色，请确认是否为有意）`);
  }

  const desc = topScalar(t, 'description');
  const model = topScalar(t, 'model');
  const persona = blockScalar(t, 'persona', 0);
  desc ? ok(`${p} description OK`) : bad(`${p} 缺 description（名册必填）`);
  model ? ok(`${p} model = ${model}`) : bad(`${p} 缺 model`);
  persona && persona.length > 300 ? ok(`${p} persona ${persona.length} 字符`) : bad(`${p} persona 缺失或过短`);
  /[\uFFFD]/.test(t) ? bad(`${p} 含替换字符（编码损坏）`) : null;
  /[\u4e00-\u9fff]/.test(t) ? null : bad(`${p} 不含中文字符（疑似编码损坏）`);

  // 契约完整性断言：persona 里的 JSON 契约必须能真正解析（拦住结构塌陷）
  const ct = extractContract(persona ?? '');
  if (ct.ok) {
    const keys = Object.keys(ct.value);
    ok(`${p} 输出契约 JSON 可解析（${keys.length} 个顶层字段）`);
    if (r === 'four-images-subject') {
      const need = ['dimension', 'first_subject', 'related_subjects', 'stakeholders', 'stakeholder_matrix', 'uncertainties', 'data_gaps'];
      const miss = need.filter((k) => !keys.includes(k));
      miss.length === 0
        ? ok(`${p} 契约含主体维度全部必填顶层字段`)
        : bad(`${p} 契约缺顶层字段：${miss.join(', ')}`);
      const st = ct.value.stakeholders?.[0] ?? {};
      const stKeys = Object.keys(st);
      const stNeed = ['name', 'level', 'tier', 'relation_type', 'relation_strength', 'direction', 'demands', 'interest_link'];
      const stMiss = stNeed.filter((k) => !stKeys.includes(k));
      stMiss.length === 0 ? ok(`${p} stakeholders 元素字段完整`) : bad(`${p} stakeholders 缺字段：${stMiss.join(', ')}`);
      const mx = ct.value.stakeholder_matrix?.[0] ?? {};
      const mxKeys = Object.keys(mx);
      const mxNeed = ['name', 'interest', 'influence', 'strategy'];
      const mxMiss = mxNeed.filter((k) => !mxKeys.includes(k));
      mxMiss.length === 0 ? ok(`${p} stakeholder_matrix 元素为四字段`) : bad(`${p} stakeholder_matrix 缺字段：${mxMiss.join(', ')}`);
      const pf = ct.value.first_subject?.profile ?? {};
      const pfNeed = ['identity', 'power_and_resources', 'background', 'style', 'demands', 'concerns', 'influence_source', 'stance'];
      const pfMiss = pfNeed.filter((k) => !Object.keys(pf).includes(k));
      pfMiss.length === 0 ? ok(`${p} first_subject.profile 字段完整`) : bad(`${p} first_subject.profile 缺字段：${pfMiss.join(', ')}`);
    }
    // 1.4.0 新增：契约 dimension 必须是六维别名之一（拦住维度拆分之前的侧别命名）
    const DIM_ALIASES = ['主', '环', '位', '行', '才', '心'];
    const dim = ct.value.dimension;
    DIM_ALIASES.includes(dim)
      ? ok(`${p} 契约 dimension = ${dim}（六维别名之一）`)
      : bad(`${p} 契约 dimension = ${JSON.stringify(dim)}，应为 ${DIM_ALIASES.join(' / ')} 之一`);
  } else {
    bad(`${p} 输出契约无法解析：${ct.reason}`);
  }

  if (A_ROLES.includes(r) && model && model !== 'deepseek-v4-flash') bad(`${p} 诊断角色模型应为 deepseek-v4-flash，实际 ${model}`);
  if (B_ROLES.includes(r) && model && model !== 'deepseek-v4-pro') bad(`${p} 方案角色模型应为 deepseek-v4-pro，实际 ${model}`);

  const glued = t.split(/\r?\n/).filter((l) => /^(description|model|persona):.*\s(model|persona|maxDepth):\s/.test(l));
  if (glued.length) bad(`${p} 存在行粘连：${glued.length} 处`);

  // 1.4.0 新增：禁用词扫描——全行扫描，注释也不例外；词表按码位构造，本脚本自身不含旧词字面值
  const cp = (s) => s.split(',').map((n) => String.fromCodePoint(Number(n))).join('');
  const STALE_TOKENS = [
    cp('24515,183,33021,21147,20391'),
    cp('24515,183,24847,24895,20391'),
    cp('33021,21147,20391,35786,26029'),
    cp('24847,24895,20391,35786,26029'),
    cp('31649,29702,31070,22120,31995,32479'),
  ];
  const staleHit = [...new Set(STALE_TOKENS.filter((tok) => t.includes(tok)))];
  staleHit.length === 0
    ? ok(`${p} 全文（含注释）无拆分前侧别命名与自造系统名残留`)
    : bad(`${p} 含已废弃表述：${staleHit.join(' / ')}`);

  const descHit = desc ? ['能力侧', '意愿侧'].filter((tok) => desc.includes(tok)) : [];
  if (desc) {
    descHit.length === 0
      ? ok(`${p} description 无拆分前侧别命名`)
      : bad(`${p} description 仍含侧别命名：${descHit.join(' / ')}`);
  }
  seenIds.has(r) ? bad(`重复角色 ${r}`) : seenIds.add(r);
}
if (existsSync(join(root, 'subagents'))) {
  const ids = readdirSync(join(root, 'subagents')).filter((n) => n.endsWith('.yaml')).map((n) => n.replace(/\.yaml$/, ''));
  for (const id of ids) {
    /^[a-z0-9][a-z0-9-]*$/.test(id) ? ok(`名册 id 合法：${id}`) : bad(`名册 id 不合法：${id}（须匹配 [a-z0-9][a-z0-9-]*）`);
    id.length <= 64 ? null : bad(`名册 id 过长：${id}`);
  }
}

// ---------- E. 绝对路径扫描 ----------
const SELF_PATH = 'scripts/check.mjs';
const absPatterns = [
  { re: /[A-Za-z]:\\[^\s"'`)]+/, label: 'Windows 绝对路径' },
  { re: /file:\/\/\//, label: 'file:// 协议引用' },
  { re: /\\\\[^\s\\]+\\[^\s\\]+/, label: 'UNC 路径' },
  { re: /(?<![\w.-])\/(?:Users|home|mnt|opt|var)\/[^\s"'`)]+/, label: 'Unix 绝对路径' },
];
const files = walk(root)
  .filter((f) => TEXT_EXT.includes(f.slice(f.lastIndexOf('.'))))
  .filter((f) => !SKIP_EXT.has(f.slice(f.lastIndexOf('.'))))
  .filter((f) => relative(root, f).split(sep).join('/') !== SELF_PATH);
let absHits = 0;
for (const f of files) {
  const rel = relative(root, f).split(sep).join('/');
  readFileSync(f, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).forEach((line, i) => {
    for (const { re, label } of absPatterns) {
      if (re.test(line)) { absHits += 1; soft(`${rel}:${i + 1} 出现 ${label}：${line.trim().slice(0, 90)}`); }
    }
  });
}
absHits === 0 ? ok(`扫描 ${files.length} 个文本文件：无外部绝对路径依赖`) : soft(`共 ${absHits} 处绝对路径命中，需人工判断是否为文档示例`);

// ---------- F. 打包产物 ----------
const artDir = join(root, 'artifacts');
if (existsSync(artDir)) {
  const tarballs = readdirSync(artDir).filter((n) => n.endsWith('.tgz'));
  if (!tarballs.length) soft('artifacts/ 存在但没有 .tgz 产物');
  for (const t of tarballs) {
    const buf = readFileSync(join(artDir, t));
    buf.length > 2 && buf[0] === 0x1f && buf[1] === 0x8b
      ? ok(`产物 ${t} 为合法 gzip 流（${buf.length} 字节）`)
      : bad(`产物 ${t} 不是 gzip 流`);
  }
} else {
  soft('未找到本 bundle 的 artifacts/ 目录（尚未打包）');
}

// ---------- 汇总 ----------
console.log(`通过 ${pass.length} 项`);
if (warn.length) {
  console.log(`\n提示 ${warn.length} 项：`);
  warn.forEach((w) => console.log(`  ! ${w}`));
}
if (fail.length) {
  console.log(`\n失败 ${fail.length} 项：`);
  fail.forEach((f) => console.log(`  x ${f}`));
  console.log('\n结论：校验未通过');
  process.exit(1);
}
console.log('\n结论：校验通过');
