#!/usr/bin/env node
/**
 * 四象模型·DSH智能体 bundle · 结构校验（零第三方依赖 / 官方 subagent 派发版）
 *
 * 用法：node scripts/check.mjs
 * 仅使用 Node 内置模块，无第三方依赖。
 *
 * 校验项：
 *   A. 必需文件齐全（入口、模板、prompts、脚本、说明文件、LICENSE）
 *   B. 清单元数据完整（name / version / description / engines / files / 入口指向）
 *   C. 生成物新鲜度：cordis.patch.yml 必须等于 template + prompts 的合成结果
 *   D. 入口结构：preset 行、10 个角色章节、官方工具行清单、persona 六维/四阶段要点
 *   E. 10 个角色章节的 JSON 输出契约必须能真正 JSON.parse，dimension 取六维别名
 *   F. 运行时文件中不得残留旧名册库/旧派发/旧品牌/旧侧别命名
 *   G. 全部文本文件的外部绝对路径扫描（运行时依赖为零）
 *   H. 打包产物：gzip 合法，且 tgz 内条目与磁盘逐字节一致
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { composeText, ROLE_ORDER } from './compose.mjs';
import { INCLUDE_TOP, INCLUDE_DIRS, buildTgz } from './pack.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const ROLE_LABELS = {
  'four-images-subject': '主体',
  'four-images-environment': '环境',
  'four-images-pos-a': '位-A',
  'four-images-beh-a': '行-A',
  'four-images-tal-a': '才-A',
  'four-images-cog-a': '心-A',
  'four-images-pos-b': '位-B',
  'four-images-beh-b': '行-B',
  'four-images-tal-b': '才-B',
  'four-images-cog-b': '心-B',
};
const DIMENSIONS = {
  'four-images-subject': '主',
  'four-images-environment': '环',
  'four-images-pos-a': '位',
  'four-images-pos-b': '位',
  'four-images-beh-a': '行',
  'four-images-beh-b': '行',
  'four-images-tal-a': '才',
  'four-images-tal-b': '才',
  'four-images-cog-a': '心',
  'four-images-cog-b': '心',
};
const FAST_ROLES = ['four-images-subject', 'four-images-environment', 'four-images-pos-a', 'four-images-beh-a', 'four-images-tal-a', 'four-images-cog-a'];
const PRO_ROLES = ['four-images-pos-b', 'four-images-beh-b', 'four-images-tal-b', 'four-images-cog-b'];

const REQUIRED = [
  'package.json',
  'cordis.patch.yml',
  'cordis.patch.template.yml',
  'README.md',
  'INSTALL.md',
  'MANIFEST.md',
  'LICENSE',
  'index.js',
  'client.js',
  'icon.png',
  'locale/zh.json',
  'locale/en.json',
  'prompts/parent.md',
  ...ROLE_ORDER.map((id) => `prompts/roles/${id}.md`),
];
const REQUIRED_SCRIPTS = ['check.mjs', 'checksums.mjs', 'compose.mjs', 'finalize.mjs', 'freeze-manifest.mjs', 'pack.mjs'];
const EXPECTED_PLUGIN_IDS = ['persona', 'time-context', 'tool-ask-user', 'tool-web', 'subagent-fast', 'subagent-pro', 'compaction'];

const TEXT_EXT = ['.json', '.yml', '.yaml', '.md', '.mjs', '.js', '.txt'];
const SKIP_EXT = new Set(['.tgz', '.gz', '.zip', '.png', '.jpg', '.pdf']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'artifacts', 'release-archive']);
const SELF_PATH = 'scripts/check.mjs';

const pass = [];
const fail = [];
const warn = [];
const ok = (m) => pass.push(m);
const bad = (m) => fail.push(m);
const soft = (m) => warn.push(m);

const read = (p) => readFileSync(join(root, p), 'utf8').replace(/^\uFEFF/, '');
const isFile = (p) => existsSync(join(root, p)) && statSync(join(root, p)).isFile();
const isDir = (p) => existsSync(join(root, p)) && statSync(join(root, p)).isDirectory();

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

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
    if (l.match(/^ */)[0].length <= indent) break;
    out.push(l);
  }
  const body = out.join('\n').replace(/\n+$/, '');
  const indents = body.split('\n').filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return body.split('\n').map((l) => l.slice(cut)).join('\n');
}

/** 从一段角色章节中抽出「输出格式」里的 JSON 契约并真正 JSON.parse */
function extractContract(sectionText) {
  const lines = sectionText.split(/\r?\n/);
  const start = lines.findIndex((l) => /^##\s*输出格式/.test(l));
  if (start === -1) return { ok: false, reason: '未找到「输出格式」章节' };
  let i = -1;
  for (let k = start + 1; k < lines.length; k += 1) {
    if (/^\s*#\s/.test(lines[k])) break;
    if (/^\s*\{\s*$/.test(lines[k])) { i = k; break; }
  }
  if (i === -1) return { ok: false, reason: '输出格式章节内未找到契约起始 {' };
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
  try {
    return { ok: true, value: JSON.parse(buf.join('')) };
  } catch (e) {
    return { ok: false, reason: `JSON 解析失败：${e.message}` };
  }
}

/** 从 persona 中截取某个角色章节（到下一个角色标题或文本末尾） */
function roleSection(persona, id) {
  const label = ROLE_LABELS[id];
  const head = `# 角色：${label}（${id}）`;
  const start = persona.indexOf(head);
  if (start === -1) return null;
  const next = persona.indexOf('\n# 角色：', start + head.length);
  return next === -1 ? persona.slice(start) : persona.slice(start, next);
}

/** 解析 ustar 归档，返回 path -> {size, sha256} */
function tarEntries(buf) {
  const out = new Map();
  for (let off = 0; off + 512 <= buf.length;) {
    const h = buf.subarray(off, off + 512);
    if (h.every((b) => b === 0)) break;
    const name = h.subarray(0, 100).toString('utf8').replace(/\0.*$/, '');
    const prefix = h.subarray(345, 500).toString('utf8').replace(/\0.*$/, '');
    const full = prefix ? `${prefix}/${name}` : name;
    const size = parseInt(h.subarray(124, 136).toString('utf8').trim(), 8);
    const data = buf.subarray(off + 512, off + 512 + size);
    out.set(full, { size, data });
    off += 512 + Math.ceil(size / 512) * 512;
  }
  return out;
}

console.log(`四象模型·DSH智能体 bundle（${JSON.parse(read('package.json')).version}）结构校验（零第三方依赖版） · 根目录 ${root}\n`);

// ---------- A. 必需文件 ----------
for (const f of REQUIRED) (isFile(f) ? ok(`存在 ${f}`) : bad(`缺失 ${f}`));
for (const s of REQUIRED_SCRIPTS) (isFile(`scripts/${s}`) ? ok(`存在 scripts/${s}`) : bad(`缺失 scripts/${s}`));
isDir('subagents') ? bad('旧名册目录 subagents/ 仍然存在（1.4.9 起应删除）') : ok('旧名册目录 subagents/ 已移除');
isFile('scripts/sync-roster.mjs') ? bad('旧脚本 scripts/sync-roster.mjs 仍然存在') : ok('旧脚本 scripts/sync-roster.mjs 已移除');

// ---------- B. 清单元数据 ----------
let pkg = null;
try {
  pkg = JSON.parse(read('package.json'));
  ok('package.json 是合法 JSON');
} catch (e) {
  bad(`package.json 不是合法 JSON：${e.message}`);
}
if (pkg) {
  for (const k of ['name', 'version', 'description']) {
    pkg[k] ? ok(`package.json.${k} = ${pkg[k]}`) : bad(`package.json 缺 ${k}`);
  }
  /^\d+\.\d+\.\d+$/.test(pkg.version ?? '') ? ok('version 为语义化版本') : bad(`version 不是语义化版本：${pkg.version}`);
  pkg.engines?.dsh ? ok(`engines.dsh = ${pkg.engines.dsh}`) : bad('缺 engines.dsh');
  for (const key of ['.', './client', './locale/*.json', './icon']) {
    Object.hasOwn(pkg.exports ?? {}, key) ? ok(`exports 含 ${key}`) : bad(`exports 缺 ${key}`);
  }
  pkg.dsh?.client?.platform === 'web' ? ok('dsh.client.platform = web') : bad('dsh.client.platform 不是 web');
  pkg.dsh?.client?.immediately === true ? ok('dsh.client.immediately = true') : bad('dsh.client.immediately 不是 true');
  Array.isArray(pkg.dsh?.client?.inject) && pkg.dsh.client.inject.length > 0
    ? ok(`dsh.client.inject 声明 ${pkg.dsh.client.inject.length} 项`)
    : soft('dsh.client.inject 未声明');
  const entry = pkg.dsh?.bundle?.patch;
  if (!entry) bad('package.json 缺 dsh.bundle.patch（入口指向）');
  else {
    const target = entry.replace(/^\.\//, '');
    isFile(target) ? ok(`入口指向存在：${entry} → ${target}`) : bad(`入口指向的文件不存在：${entry}`);
  }
  pkg.dsh?.manifestVersion ? ok(`dsh.manifestVersion = ${pkg.dsh.manifestVersion}`) : bad('缺 dsh.manifestVersion');
  for (const f of pkg.files ?? []) {
    const target = f.replace(/\/$/, '');
    existsSync(join(root, target)) ? ok(`files 声明存在：${f}`) : bad(`files 声明的路径不存在：${f}`);
  }
  for (const f of ['index.js', 'client.js', 'icon.png', 'locale/']) {
    (pkg.files ?? []).includes(f) ? ok(`files 含 ${f}`) : bad(`files 未声明 ${f}`);
  }
  (pkg.files ?? []).includes('prompts/') ? ok('files 声明含 prompts/') : bad('files 未声明 prompts/');
  (pkg.files ?? []).some((f) => f.startsWith('subagents')) ? bad('files 仍声明 subagents/') : ok('files 不再声明 subagents/');
  pkg.scripts?.compose ? ok('scripts.compose 存在') : bad('缺 scripts.compose');
  pkg.scripts?.['compose:check'] ? ok('scripts.compose:check 存在') : bad('缺 scripts.compose:check');
  pkg.scripts?.['sync-roster'] ? bad('scripts 仍含 sync-roster') : ok('scripts 不含 sync-roster');
}

// ---------- C. 生成物新鲜度 ----------
let patchText = null;
if (isFile('cordis.patch.yml')) {
  patchText = read('cordis.patch.yml');
  const expected = composeText();
  patchText === expected
    ? ok('cordis.patch.yml 与 template + prompts 合成结果一致')
    : bad('cordis.patch.yml 不是最新的合成结果（请运行 node scripts/compose.mjs）');
}

// ---------- D. 入口结构 ----------
if (patchText) {
  /\n\s*- insert:/.test(patchText) ? ok('入口含 - insert: 段') : bad('入口缺 - insert: 段');
  /id:\s*preset-four-images/.test(patchText) ? ok('Loader row id = preset-four-images') : bad('入口缺 row id');
  /name:\s*'@deepseek-ai\/dsh-agent-preset'/.test(patchText) ? ok('preset 行引用 @deepseek-ai/dsh-agent-preset') : bad('入口缺 preset 插件引用');
  /id:\s*four-images-model/.test(patchText) ? ok('preset id = four-images-model') : bad('入口缺 preset id');
  /id:\s*preset-four-images-host/.test(patchText) ? ok('含空 Host 行 preset-four-images-host') : bad('入口缺空 Host 行（client 半不会被加载）');
  /name:\s*dsh-preset-four-images-model/.test(patchText) ? ok('空 Host 行指向本包') : bad('空 Host 行未指向本包');
  /order:\s*10/.test(patchText) ? ok('order = 10') : soft('入口未设置 order');
  /name:\s*四象模型·DSH智能体/.test(patchText) ? ok('preset 显示名已显式声明') : bad('preset 缺显示名 name');
  /description:\s*\S+/.test(patchText) ? ok('preset 描述已显式声明') : bad('preset 缺 description');

  for (const id of EXPECTED_PLUGIN_IDS) {
    new RegExp(`- id: ${id}\\n`).test(patchText) ? ok(`preset 含插件行 ${id}`) : bad(`preset 缺插件行 ${id}`);
  }
  for (const name of ['@deepseek-ai/dsh-persona', '@deepseek-ai/dsh-time-context', '@deepseek-ai/dsh-tool-ask-user', '@deepseek-ai/dsh-tool-web', '@deepseek-ai/dsh-tool-subagent', '@deepseek-ai/dsh-compaction-basic', '@deepseek-ai/dsh-compaction-tool-result-pruner']) {
    patchText.includes(`'${name}'`) ? ok(`preset 引用 ${name}`) : bad(`preset 未引用 ${name}`);
  }
  /toolName:\s*subagent_fast/.test(patchText) ? ok('存在 subagent_fast 工具实例') : bad('缺 subagent_fast 工具实例');
  /toolName:\s*subagent_pro/.test(patchText) ? ok('存在 subagent_pro 工具实例') : bad('缺 subagent_pro 工具实例');
  !/agentOptions:\s*\n\s*model:/.test(patchText) ? ok('子代理不写死 agentOptions.model（继承父会话模型）') : bad('preset 仍写死子代理 model id');
  (patchText.match(/maxDepth:\s*1/g) ?? []).length >= 2 ? ok('两个 subagent 实例均限制 maxDepth: 1') : bad('subagent 实例缺 maxDepth: 1');
  patchText.includes('tool-cordis') ? bad('preset 仍含无用的 tool-cordis') : ok('preset 不再含 tool-cordis');
  patchText.includes('tool-subagent-control') ? bad('preset 仍含 tool-subagent-control（子代理会主动回传消息）') : ok('preset 不含 tool-subagent-control');
  patchText.includes('send_message') ? bad('preset 仍引用 send_message') : ok('preset 不引用 send_message（缺字段用重新派发）');
  /- id: (write|edit|tool-fs|tool-pwsh|tool-bash)\n/.test(patchText) ? bad('preset 含写类工具行（应保持只读组合）') : ok('preset 不含写类工具行（只读由组合保证）');

  const persona = blockScalar(patchText, 'prefix', 14);
  if (!persona) bad('入口未找到 persona 的 prefix 块标量');
  else {
    persona.length > 20000 ? ok(`persona 正文已内嵌（${persona.length} 字符）`) : bad(`persona 正文过短（${persona.length} 字符）`);
    for (const k of ['身份判定', '六维定义', '维度独立性与禁止合并', '角色章节与派发工具', '派发规范', '阶段一', '阶段二', '阶段三', '阶段四', '异常处理', '输出格式', '质量纪律']) {
      persona.includes(k) ? ok(`persona 含要点 ${k}`) : bad(`persona 缺要点 ${k}`);
    }
    persona.includes('主体维度排在最前') ? ok('persona 声明主体维度置首') : bad('persona 未声明主体维度置首');
    persona.includes('才能与心态是两个独立维度') ? ok('persona 声明才/心为两个独立维度') : bad('persona 未声明才/心为独立维度');
    persona.includes('禁止把才能与心态合并为一份方案') ? ok('persona 禁止合并才/心方案') : bad('persona 缺「禁止合并才/心方案」条款');
    persona.includes('六维分析总览表') ? ok('persona 要求六维分析总览表') : bad('persona 未要求六维分析总览表');
    persona.includes('逐维独立成节') ? ok('persona 要求逐维独立成节') : bad('persona 未要求逐维独立成节');
    persona.includes('利益相关者') ? ok('persona 提及利益相关者') : bad('persona 未提及利益相关者');
    persona.includes('人物画像') && persona.includes('组织画像') ? ok('persona 提及人物/组织画像') : bad('persona 未提及人物/组织画像');
    !/并行发出\*\*五个\*\*|五个\s*`?subagent/.test(persona) ? ok('persona 无「五个 subagent」数量错误') : bad('persona 仍写「五个」派发调用');
    !/五维定义|五维分析总览表/.test(persona) ? ok('persona 无已废弃的五维表述') : bad('persona 仍含五维表述');
    !/才能·心态维度/.test(persona) ? ok('persona 无「才能·心态维度」合并表述') : bad('persona 仍含合并维度表述');
    !/\[\[|\{\{/.test(persona) ? ok('persona 无未替换的模板占位符') : bad('persona 含未替换的模板占位符');
  }
}

// ---------- D2. Client 半与展示元数据 ----------
if (isFile('client.js')) {
  const client = read('client.js');
  client.includes('window.__ModuleLoader__.load(') ? ok('client.js 使用 window.__ModuleLoader__') : bad('client.js 未使用 window.__ModuleLoader__');
  /id:\s*'dsh-preset-four-images-model'/.test(client) ? ok('client module id = 包名') : bad('client module id 不是包名');
  /const PRESET_ID = 'four-images-model'/.test(client) ? ok('client 声明 preset id') : bad('client 未声明 preset id');
  for (const slot of ['four-images.page', 'four-images.home.card', 'four-images.home.action']) {
    client.includes(`'${slot}'`) ? ok(`client 注册 ${slot}`) : bad(`client 未注册 ${slot}`);
  }
  client.includes('fourImagesNavigation') ? ok('client 使用 fourImagesNavigation 可选注入') : soft('client 未注册导航');
  client.includes('uiWorkspace') && client.includes('startSession') ? ok('client 通过 uiWorkspace.startSession 启动') : bad('client 未调用 uiWorkspace.startSession');
  client.includes('agentPreset: PRESET_ID') ? ok('startSession 传入 agentPreset') : bad('startSession 未传 agentPreset');
  !client.includes('document.body') ? ok('client 不写 document.body') : bad('client 写 document.body');
  !client.includes('iframe') ? ok('client 不使用 iframe') : bad('client 使用 iframe');
  !/require\(\s*['"]@deepseek-ai\/dsh-client-/.test(client) ? ok('client 不 require Harness Client 包') : bad('client require 了 Harness Client 包');
}
for (const loc of ['locale/zh.json', 'locale/en.json']) {
  if (!isFile(loc)) continue;
  try {
    const data = JSON.parse(read(loc));
    data?.meta?.title && data?.meta?.description ? ok(`${loc} 含 meta.title/description`) : bad(`${loc} 缺 meta.title/description`);
  } catch (e) {
    bad(`${loc} 不是合法 JSON：${e.message}`);
  }
}
if (isFile('icon.png')) {
  const buf = readFileSync(join(root, 'icon.png'));
  const isPng = buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  isPng ? ok(`icon.png 为合法 PNG（${buf.length} 字节）`) : bad('icon.png 不是 PNG');
  buf.length <= 256 * 1024 ? ok('icon.png ≤ 256 KiB') : bad(`icon.png 超过 256 KiB（${buf.length} 字节）`);
}

// ---------- E. 角色章节与契约 ----------
if (patchText) {
  const persona = blockScalar(patchText, 'prefix', 14) ?? '';
  for (const id of ROLE_ORDER) {
    const label = ROLE_LABELS[id];
    const head = `# 角色：${label}（${id}）`;
    persona.includes(head) ? ok(`persona 含角色章节 ${id}`) : bad(`persona 缺角色章节 ${id}`);
    const section = roleSection(persona, id);
    if (!section) continue;
    section.includes('## 输出格式') ? ok(`${id} 角色章节含输出格式`) : bad(`${id} 角色章节缺输出格式`);
    const ct = extractContract(section);
    if (!ct.ok) { bad(`${id} 输出契约无法解析：${ct.reason}`); continue; }
    ok(`${id} 输出契约 JSON 可解析（${Object.keys(ct.value).length} 个顶层字段）`);
    ct.value.dimension === DIMENSIONS[id]
      ? ok(`${id} 契约 dimension = ${DIMENSIONS[id]}`)
      : bad(`${id} 契约 dimension = ${JSON.stringify(ct.value.dimension)}，应为 ${DIMENSIONS[id]}`);
    if (id === 'four-images-subject') {
      for (const k of ['first_subject', 'related_subjects', 'stakeholders', 'stakeholder_matrix', 'uncertainties', 'data_gaps']) {
        Object.hasOwn(ct.value, k) ? ok(`主体契约含 ${k}`) : bad(`主体契约缺 ${k}`);
      }
      ct.value.first_subject?.profile && Object.keys(ct.value.first_subject.profile).length >= 5
        ? ok('主体契约 profile 含 ≥5 个要素')
        : bad('主体契约 profile 要素不足');
    }
  }
  for (const id of FAST_ROLES) {
    const section = roleSection(persona, id) ?? '';
    section.includes('## 协同关系') ? ok(`${id} 含协同关系`) : soft(`${id} 缺协同关系`);
  }
  const envSection = roleSection(persona, 'four-images-environment') ?? '';
  envSection.includes('接收"才"的反馈') ? ok('环境角色回流指向「才」') : bad('环境角色回流方仍不是「才」');
}

// ---------- F. 旧名册/旧品牌/旧词残留 ----------
const runtimeFiles = ['cordis.patch.yml', 'cordis.patch.template.yml', 'README.md', 'INSTALL.md', ...REQUIRED.filter((f) => f.startsWith('prompts/'))];
const FORBIDDEN = [
  ['dsh-subagent-library', '旧第三方名册库名'],
  ['list_subagents', '旧名册工具'],
  ['library_id', '旧名册参数'],
  ['entriesDir', '旧名册配置'],
  ['sync-roster', '旧同步脚本'],
  ['subagents/', '旧名册目录引用'],
  ['toolFilter', '旧只读机制'],
  ['降级路径', '旧降级路径说明'],
  ['send_message', '已移除的子代理回传工具'],
  ['四象模型·管理世界', '旧品牌名'],
  ['四象模型·管理神器', '旧品牌名'],
  ['Five-Dimension', '旧五维描述'],
  ['FIVE', '旧五维描述'],
];
for (const f of runtimeFiles) {
  if (!isFile(f)) continue;
  const t = read(f);
  const hits = FORBIDDEN.filter(([tok]) => t.includes(tok)).map(([, label]) => label);
  hits.length === 0 ? ok(`${f} 无旧名册/旧brand残留`) : bad(`${f} 含旧残留：${hits.join(' / ')}`);
}
// 维度拆分前的侧别命名与自造系统称谓（按 Unicode 码位构造，脚本自身不复现旧词）
const cp = (s) => s.split(',').map((n) => String.fromCodePoint(Number(n))).join('');
const STALE_TOKENS = [
  cp('24515,183,33021,21147,20391'),
  cp('24515,183,24847,24895,20391'),
  cp('33021,21147,20391,35786,26029'),
  cp('24847,24895,20391,35786,26029'),
  cp('31649,29702,31070,22120,31995,32479'),
];
for (const f of ['cordis.patch.yml', 'cordis.patch.template.yml', ...REQUIRED.filter((p) => p.startsWith('prompts/'))]) {
  if (!isFile(f)) continue;
  const t = read(f);
  const hit = STALE_TOKENS.filter((tok) => t.includes(tok));
  hit.length === 0 ? ok(`${f} 无拆分前侧别命名残留`) : bad(`${f} 含已废弃表述（${hit.length} 类）`);
}

// ---------- G. 绝对路径扫描 ----------
const files = walk(root)
  .filter((f) => TEXT_EXT.includes(f.slice(f.lastIndexOf('.'))))
  .filter((f) => !SKIP_EXT.has(f.slice(f.lastIndexOf('.'))))
  .filter((f) => relative(root, f).split(sep).join('/') !== SELF_PATH);
const absPatterns = [
  { re: /[A-Za-z]:\\[^\s"'`)]+/, label: 'Windows 绝对路径' },
  { re: /file:\/\/\//, label: 'file:// 协议引用' },
  { re: /\\\\[^\s\\]+\\[^\s\\]+/, label: 'UNC 路径' },
  { re: /(?<![\w.-])\/(?:Users|home|mnt|opt|var)\/[^\s"'`)]+/, label: 'Unix 绝对路径' },
];
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

// ---------- H. 打包产物 ----------
const artDir = join(root, 'artifacts');
if (!existsSync(artDir)) {
  soft('未找到 artifacts/ 目录（尚未打包）');
} else {
  const expectedName = `${pkg?.name}-${pkg?.version}.tgz`;
  const tarballs = readdirSync(artDir).filter((n) => n.endsWith('.tgz'));
  const target = tarballs.includes(expectedName) ? expectedName : null;
  if (!target) bad(`artifacts/ 缺当前版本产物 ${expectedName}（现有：${tarballs.join(', ') || '无'}）`);
  else {
    const buf = readFileSync(join(artDir, target));
    buf.length > 2 && buf[0] === 0x1f && buf[1] === 0x8b ? ok(`产物 ${target} 为合法 gzip 流（${buf.length} 字节）`) : bad(`产物 ${target} 不是 gzip 流`);
    try {
      const entries = tarEntries(gunzipSync(buf));
      const expectedFiles = [...INCLUDE_TOP, ...INCLUDE_DIRS.flatMap((d) => walk(join(root, d)).map((f) => relative(root, f).split(sep).join('/')))].sort();
      const prefix = `${pkg?.name}/`;
      const tarNames = [...entries.keys()].map((n) => n.replace(prefix, '')).sort();
      JSON.stringify(tarNames) === JSON.stringify(expectedFiles)
        ? ok(`归档条目与磁盘文件清单一致（${expectedFiles.length} 个）`)
        : bad(`归档条目与磁盘不一致：归档 ${tarNames.length} / 期望 ${expectedFiles.length}`);
      let mismatch = 0;
      for (const rel of expectedFiles) {
        const entry = entries.get(prefix + rel);
        if (!entry) { mismatch += 1; continue; }
        const disk = readFileSync(join(root, rel));
        const sha = createHash('sha256').update(entry.data).digest('hex');
        if (entry.size !== disk.length || sha !== createHash('sha256').update(disk).digest('hex')) mismatch += 1;
      }
      mismatch === 0 ? ok('归档内每个条目与磁盘逐字节一致') : bad(`${mismatch} 个归档条目与磁盘不一致`);
    } catch (e) {
      bad(`归档解析失败：${e.message}`);
    }
    // 与 finalize 产出的产物清单对照（存在时）
    if (isFile('artifacts/SHA256SUMS.txt')) {
      const sha = createHash('sha256').update(buf).digest('hex').toUpperCase();
      read('artifacts/SHA256SUMS.txt').includes(sha) ? ok('artifacts/SHA256SUMS.txt 含当前 tgz 哈希') : bad('artifacts/SHA256SUMS.txt 未含当前 tgz 哈希');
    }
  }
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
