# 四象模型·DSH智能体 · DSH 安装说明

适用于 **DeepSeek Harness 桌面端 / Web 端**，要求 DSH `>= 0.2.1-rc.2`（bundle 形态）。

> 转换说明、来源对应关系与校验结果见 [`MANIFEST.md`](./MANIFEST.md)；本版冻结哈希见 [`FREEZE.md`](./FREEZE.md)。

## 一、这个包是什么

`dsh-preset-four-images-model` 是一个 **DSH Agent preset bundle**。装上之后，新建会话的预设选择器里会多出一张卡片 **四象模型·DSH智能体**，选中它即得到一个"**主体** / 环境 / 地位 / 行为 / 才能 / 心态"**六维**、四阶段的管理问题分析智能体。其中**才能与心态是两个独立维度**，从诊断到方案再到汇总都不合并；**主体维度只做确认与画像，不出方案**。

它**只引用 DSH 随附插件**：没有第三方依赖、没有安装脚本、不需要构建步骤、不需要联网下载任何东西，也**不需要先安装任何名册类插件**。

## 二、安装

### 方式 A：让 DSH 自己装（推荐）

用插件管理工具安装。推荐直接按 npm 包名（已发布到 npm，无需下载）：

```
plugin_manager({ action: "install_bundle", target: "dsh-preset-four-images-model" })
```

也可以传本目录的绝对路径，或传打包出来的 `.tgz`：

```
plugin_manager({ action: "install_bundle", target: "<本目录的绝对路径>" })
plugin_manager({ action: "install_bundle", target: "<artifacts/dsh-preset-four-images-model-<版本号>.tgz 的绝对路径>" })
```

安装会在当前 profile 里执行 `pnpm add`。桌面端默认 profile 是 `desktop`。装完如果提示需要重启，就重启一次 DSH。

### 方式 B：手动加进 profile

编辑 `$DSH_HOME/profiles/<你的 profile>/package.json`：

```json
{
  "dependencies": {
    "dsh-preset-four-images-model": "file:<本目录的绝对路径>"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "dsh-preset-four-images-model"
      ]
    }
  }
}
```

然后在 `$DSH_HOME/profiles/<你的 profile>/` 目录用 DSH 自带的 pnpm 执行 `pnpm install`，再重启 DSH。

### 方式 C：放进已有 bundle 的 patch 层

若你已有自己的 profile patch（`$DSH_HOME/profiles/<profile>/cordis.patch.yml`），把本包 `cordis.patch.yml` 中 `- insert:` 下面的整段贴进去也可以，效果相同——但要自己保证 `@deepseek-ai/dsh-agent-preset`、`@deepseek-ai/dsh-persona`、`@deepseek-ai/dsh-tool-subagent`、`@deepseek-ai/dsh-tool-ask-user`、`@deepseek-ai/dsh-tool-web`、`@deepseek-ai/dsh-tool-subagent-control`、`@deepseek-ai/dsh-time-context`、`@deepseek-ai/dsh-compaction-basic`、`@deepseek-ai/dsh-command-compact`、`@deepseek-ai/dsh-compaction-tool-result-pruner` 都在你的部署里存在。

## 三、安装后自检

```
plugin_manager({ action: "list_bundles" })
```

应看到 `dsh-preset-four-images-model`，`enabled: true`、`installed: true`，`rows` 含 `preset-four-images`。

```
plugin_manager({ action: "list_plugins", offset: 0, limit: 100 })
```

应看到 `include:preset-four-images` 且 `enabled: true`、`fiberPhase: "active"`。

**若 `fiberPhase` 不是 `active`，或卡片被拒绝挂载**：检查 DSH 版本是否满足 `>= 0.2.1-rc.2`，以及 `cordis.patch.yml` 里引用的官方插件包名在你这版 DSH 中是否都存在（包改名会导致激活失败，而不是静默降级）。

**真机验证建议**：新建会话 → 选 **四象模型·DSH智能体** → 用一个有主体、有环境、有流程的真实管理问题跑一遍，确认：① 阶段一能提问/产出主体与环境；② 四个诊断子代理各自返回结构化 JSON；③ 汇总里才与心是两节、主体在最前。本项目没有自动化端到端测试，这一步必须人工做。

## 四、使用

1. **新建会话**，在预设选择器里选 **四象模型·DSH智能体**（preset id `four-images-model`）。
2. 直接描述你的管理问题，例如："某事业部新品导入周期比行业慢一倍，责任说不清。"
3. 父智能体会走四阶段：主体+环境确认 → **位 / 行 / 才 / 心**并行诊断 → 四个维度的方案 → 汇总为**六维各自独立成节**的报告与待验证项。

> **注意**：才能与心态是两个独立维度。若输出把两者合并成一条，属不合格——请让父智能体按六维拆分重写。

**已存在的会话不会获得这个 preset**——DSH 规定既有会话沿用启动时的插件组合，必须开新会话。

## 五、预设组成（这张表就是"它有什么能力"）

本 preset 声明的是**完整能力组合**（DSH Web/桌面端会把 host 层的 agent 平面工具行全部禁用，会话能用的工具取决于 preset 自己声明了什么）：

| 插件行 | 包 | 作用 |
|---|---|---|
| `persona` | `@deepseek-ai/dsh-persona` | 父调度器 + 10 个角色章节（六维定义、四阶段、输出契约） |
| `time-context` | `@deepseek-ai/dsh-time-context` | 当前日期，供"截至某时点"的环境判断使用 |
| `tool-ask-user` | `@deepseek-ai/dsh-tool-ask-user` | `ask_user_question`，阶段一向用户澄清 |
| `tool-web` | `@deepseek-ai/dsh-tool-web` | `web_search` / `web_fetch`，环境维度的时效信息 |
| `subagent-fast` | `@deepseek-ai/dsh-tool-subagent` | `subagent_fast`，诊断角色（`deepseek-v4-flash`） |
| `subagent-pro` | `@deepseek-ai/dsh-tool-subagent` | `subagent_pro`，方案角色（`deepseek-v4-pro`） |
| `subagent-control` | `@deepseek-ai/dsh-tool-subagent-control` | `send_message`，向子代理追问缺失字段 |
| `compaction`（group） | `@deepseek-ai/dsh-compaction-basic`、`@deepseek-ai/dsh-command-compact`、`@deepseek-ai/dsh-compaction-tool-result-pruner` | 四阶段长会话的上下文压缩 |

**只读**：组合里**没有** `write` / `edit` / `pwsh` / `bash` / 文件写入类工具，父智能体与子代理都没有落盘能力。这是"只读"的构造性保证，不依赖任何逐条目工具过滤。

**模型分工**：`subagent_fast` 绑定 `deepseek-v4-flash`，`subagent_pro` 绑定 `deepseek-v4-pro`。如果你的部署没有这两个模型 id，在 profile 的 `cordis.patch.yml` 里覆盖这两行（改 `agentOptions.model`，或删掉 `agentOptions` 让子代理继承父会话模型）。

## 六、升级说明（1.4.8 → 1.4.9）

- 1.4.9 起**不再依赖第三方名册插件**，也**不再随包提供名册目录**；如果你以前按旧文档把某个名册插件的目录指向本包的旧角色文件目录，请删除那份配置（该目录已不存在）。
- 角色框架改为随 preset 一起分发（`prompts/` 为源码，`cordis.patch.yml` 由 `scripts/compose.mjs` 合成），**不需要手工复制任何文件**。
- 旧版本"改名册 YAML 热生效"的能力不再保留：改角色文本需要改 `prompts/` → `compose` → 升 `version` → 重新打包安装。
- 运行标识符不变：包名、preset id `four-images-model`、Loader row id `preset-four-images`。

## 七、维护与发布脚本

```powershell
node scripts/compose.mjs            # 由 template + prompts/ 生成 cordis.patch.yml
node scripts/compose.mjs --check    # 校验生成物是否新鲜（不一致退出码 2）
node scripts/check.mjs              # 结构/契约/工具组合校验 + tgz 内条目与磁盘逐字节核对
node scripts/checksums.mjs          # 生成包根 SHA256SUMS.txt
node scripts/pack.mjs               # 重新打包 tgz 到本包 artifacts/（确定性）
node scripts/finalize.mjs           # 生成 artifacts/SHA256SUMS.txt
node scripts/freeze-manifest.mjs    # 生成 FREEZE.md（含真实 check 结果与确定性结论）
```

**发布顺序**：`compose → checksums → pack → finalize → check → freeze-manifest → check`。任何内容改动（含文档措辞）都必须递增 `version` 后重新打包，否则 pnpm 会判 `Already up to date`，装机副本不会更新。

## 八、卸载

```
plugin_manager({ action: "remove_bundle", target: "dsh-preset-four-images-model" })
```

## 九、已知限制

1. **DSH 版本**：`engines.dsh: ">=0.2.1-rc.2"`。更早版本缺少本预设使用的官方工具行或 preset 组合语义，会激活失败或被宿主拒绝。
2. **不做市场数据检索的强保证**：环境维度的时效性事实依赖使用者所在部署的 Web 搜索能力；没有该能力时，环境因子需由用户提供，父智能体会把它们标为待验证。
3. **不替代现场调研**：所有结论带证据与置信度要求；拿不到证据的结论会被写成"待验证"，这是设计意图，不是缺陷。
4. **没有文件/命令能力**：本预设面向"分析和出方案"，不读写工作区、不执行命令；这是只读设计的一部分。
5. **模型 id 绑定**：默认使用 `deepseek-v4-flash` / `deepseek-v4-pro`；部署侧模型 id 不同时需按第五节的说明覆盖。
