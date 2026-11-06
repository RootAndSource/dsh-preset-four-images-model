#!/usr/bin/env node
/**
 * 四象模型·DSH智能体 bundle · 合成入口文件
 *
 * 用法：
 *   node scripts/compose.mjs           # 按模板与 prompts/ 生成 cordis.patch.yml
 *   node scripts/compose.mjs --check   # 只校验生成物是否新鲜（不一致退出码 2）
 *
 * 生成关系：
 *   cordis.patch.template.yml  +  prompts/parent.md  +  prompts/roles/<id>.md
 *     → cordis.patch.yml
 *
 * 之所以把 persona 放在独立 Markdown 里再合成，而不是手写进 YAML：
 * 角色正文合计约 1.7 万字符，直接手改 YAML 块标量极易吞掉换行或破坏缩进；
 * 生成 + 新鲜度校验能把「源码」和「分发物」绑定起来。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = 'cordis.patch.template.yml';
const OUTPUT = 'cordis.patch.yml';
const MARKER = '{{PERSONA}}';
const PERSONA_INDENT = 16;

/** 角色章节顺序（与父 persona 的派发表一致） */
export const ROLE_ORDER = [
  'four-images-subject',
  'four-images-environment',
  'four-images-pos-a',
  'four-images-beh-a',
  'four-images-tal-a',
  'four-images-cog-a',
  'four-images-pos-b',
  'four-images-beh-b',
  'four-images-tal-b',
  'four-images-cog-b',
];

/** 读取一个 UTF-8 文本文件（去 BOM） */
function read(rel) {
  return readFileSync(join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

/** 父 persona + 10 个角色章节，空行分隔 */
export function personaText() {
  const parts = [read('prompts/parent.md').trim()];
  for (const id of ROLE_ORDER) parts.push(read(`prompts/roles/${id}.md`).trim());
  return parts.join('\n\n');
}

/** 把多行文本整体缩进（空行保持空行） */
function indentBlock(text, spaces) {
  const pad = ' '.repeat(spaces);
  return text
    .split(/\r?\n/)
    .map((line) => (line.trim() === '' ? '' : pad + line.replace(/\s+$/, '')))
    .join('\n');
}

/** 生成完整的 cordis.patch.yml 文本 */
export function composeText() {
  const template = read(TEMPLATE);
  if (!template.includes(MARKER)) throw new Error(`${TEMPLATE} 缺少 ${MARKER} 占位符`);
  const composed = template.replace(new RegExp(`^${MARKER}$`, 'm'), indentBlock(personaText(), PERSONA_INDENT));
  return composed.endsWith('\n') ? composed : `${composed}\n`;
}

const invokedPath = process.argv[1] === undefined ? undefined : resolve(process.argv[1]);
const isMain = invokedPath === fileURLToPath(import.meta.url);

if (isMain) {
  const checkOnly = process.argv.includes('--check');
  const expected = composeText();
  const current = existsSync(join(root, OUTPUT)) ? read(OUTPUT) : null;
  if (checkOnly) {
    if (current !== expected) {
      console.error(`✗ ${OUTPUT} 与模板/角色源文件不一致，请运行 node scripts/compose.mjs`);
      process.exit(2);
    }
    console.log(`✓ ${OUTPUT} 与模板/角色源文件一致`);
  } else if (current === expected) {
    console.log(`= ${OUTPUT} 已是最新（无需写入）`);
  } else {
    writeFileSync(join(root, OUTPUT), expected, 'utf8');
    const chars = expected.length;
    console.log(`✓ 已生成 ${OUTPUT}（${chars} 字符）`);
  }
}
