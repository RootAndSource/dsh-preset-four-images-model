# 四象模型·DSH智能体 · DSH 安装说明

适用于 **DeepSeek Harness 桌面端 / Web 端**（bundle 形态，DSH `>= 0.2.0-rc.2`）。

> 本目录是经规范化落盘的版本（源：同族 `dsh-preset-four-images-model-1.3.5/`）。转换说明、来源对应关系与校验结果见 [`MANIFEST.md`](./MANIFEST.md)。

## 一、这个包是什么

`dsh-preset-four-images-model` 是一个 **DSH Agent preset bundle**。装上之后，新建会话的预设选择器里会多出一张卡片 **四象模型·DSH智能体**，选中它即得到一个"**主体** / 环境 / 地位 / 行为 / 才能 / 心态"**六维**并行、每维走「A 阶段诊断 → B 阶段方案」的管理问题分析智能体。其中**才能与心态是两个独立维度**，从诊断到方案再到汇总都不合并。

它**只引用 DSH 随附插件**，没有第三方依赖、没有安装脚本、不需要构建步骤，也不需要联网下载任何东西。

> 注意：DSH 现在不读旧的 `~/.dsh/.agent-presets/<id>/` 目录格式。请用下面的 bundle 方式安装。

## 二、安装

### 方式 A：让 DSH 自己装（推荐）

用插件管理工具安装，`target` 传本目录的绝对路径，或传打包出来的 `.tgz`：

```
plugin_manager({ action: "install_bundle", target: "<本目录的绝对路径>" })
plugin_manager({ action: "install_bundle", target: "<artifacts/dsh-preset-four-images-model-1.4.6.tgz 的绝对路径>" })
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

若你已有自己的 profile patch（`$DSH_HOME/profiles/<profile>/cordis.patch.yml`），把本包 `cordis.patch.yml` 中 `- insert:` 下面的整段贴进去也可以，效果相同——但要自己保证 `@deepseek-ai/dsh-agent-preset`、`@deepseek-ai/dsh-persona`、`@deepseek-ai/dsh-tool-cordis` 都在你的部署里存在。

## 三、安装前/后的自检

```powershell
node scripts/check.mjs              # 结构校验：入口、清单、10 个名册条目（含契约可解析）、绝对路径依赖、产物可读性
node scripts/checksums.mjs          # 生成 SHA256SUMS.txt 逐文件哈希
node scripts/pack.mjs               # 重新打包 tgz 到 本包 artifacts/（确定性，内容不变则哈希不变）
node scripts/finalize.mjs           # 生成 本包 artifacts/SHA256SUMS.txt 产物哈希
node scripts/sync-roster.mjs --check # 核对活名册是否与 bundle 一致（有差异退出码 2）
node scripts/sync-roster.mjs        # 同步活名册（改 bundle 后必做，覆盖前自动备份）
```

> **为什么必须同步活名册**：`$DSH_HOME/subagents/` 是运行时真正读取的条目副本，**升级 bundle 不会自动更新它**。漏掉这一步会导致"bundle 已更新、子代理仍按旧契约作答"——本项目曾因此连续两轮真机复测失效。

安装后：

```
plugin_manager({ action: "list_bundles" })
```
应看到 `dsh-preset-four-images-model`，`enabled: true`、`installed: true`，`rows` 含 `preset-four-images`。

```
plugin_manager({ action: "list_plugins", offset: 0, limit: 100 })
```
应看到 `include:preset-four-images` 且 `enabled: true`、`fiberPhase: "active"`。

**若 `fiberPhase` 不是 `active`，或卡片被拒绝挂载**：检查 DSH 版本是否满足 `>=0.2.0-rc.2`，以及上述三个插件包名在你这版 DSH 中是否存在（包改名会导致激活失败，而不是静默降级）。

## 四、使用

1. **新建会话**，在预设选择器里选 **四象模型·DSH智能体**（preset id `four-images-model`）。
2. 直接描述你的管理问题，例如："某事业部新品导入周期比行业慢一倍，责任说不清。"
3. 父智能体会走四阶段：主体+环境确认 → **位 / 行 / 才 / 心**并行诊断（环境维度沿用阶段一结果）→ 四个维度的方案 → 汇总为**六维各自独立成节**的报告与待验证项。

> **注意**：才能与心态是两个独立维度。若输出把两者合并成一条，属不合格——请让父智能体按六维拆分重写。

**已存在的会话不会获得这个 preset**——DSH 规定既有会话沿用启动时的插件组合，必须开新会话。

## 五、子代理怎么派发（名册派发）

本预设通过 **`dsh-subagent-library`**（npm，≥ 0.3.x）的具名名册派发。父智能体先 `list_subagents` 确认名册，再用 `delegate({ library_id, prompt })` 按 id 派活。

### 前置：安装名册库

```
plugin_manager({ action: "install_bundle", target: "dsh-subagent-library" })
```

名册库的工具注册在 host 平面，**与 agent preset 无关**——装上之后任何会话都能用；`delegate` / `list_subagents` 会直接出现在工具集里（本机实测为 `application: "applied"`，无需重启）。

### 前置：把 10 个条目放进名册目录

名册条目存放在 `$DSH_HOME/subagents/`，**条目 id 就是文件名**。把本 bundle 的 `subagents/` 复制过去即可：

```powershell
Copy-Item -Path ".\subagents\*.yaml" -Destination "$env:USERPROFILE\.dsh\subagents\" -Force
```

名册目录**热生效**：改文件、加文件立即生效，不需要重启。用 `list_subagents` 核对是否 10 条都在；条目解析失败会以诊断形式出现在同一输出里。

### 条目字段（超出即整条被跳过）

| 字段 | 必填 | 说明 |
|---|---|---|
| `description` | 是 | 角色描述，`list_subagents` 展示给模型 |
| `model` | 否 | 本包用 `deepseek-v4-flash`（A 阶段诊断）/ `deepseek-v4-pro`（B 阶段方案） |
| `provider` | 否 | LLM 路由；本包留空，沿用会话默认路由 |
| `persona` | 否 | 角色提示词与分析框架 |
| `toolFilter` | 否 | `allow` / `deny` 工具名单。本包 `four-images-pos-a` / `four-images-beh-a` / `four-images-tal-a` / `four-images-cog-a` 四个只读诊断角色使用 `deny: [write, edit, pwsh, bash, subagent, workflow, delegate, list_subagents, create_goal, update_goal]`（含 shell 类，堵住绕过文件工具落盘的通道）；`four-images-subject` / `four-images-environment` 未设 |
| `maxDepth` | 否 | 委派深度上限，本包统一 `1`（禁止子代理再派活） |
| `backgroundMode` | 否 | 本包统一省略 = `one-shot` |
| `reasoningEffort` / `subagentProvider` / `maxTokens` / `enabled` | 否 | 未使用 |

**注意**：名册插件对未知字段是响亮拒绝——`id`、`displayName`、`tools` 都**不是**合法条目字段（`id` 取文件名），写进去会让该角色被跳过。本包 `scripts/check.mjs` 已把这条做成校验项。

### 降级路径

名册库不可用（未安装 / id 缺失 / 条目被停用 / 传输层不支持 persona 或工具过滤）时，父智能体会改用内置 `subagent` 工具派发，并把 `subagents/<role>.yaml` 的 persona 内联进 prompt；四阶段流程与判断标准完全不变，报告里会注明"本次走降级路径"。

## 六、卸载

```
plugin_manager({ action: "remove_bundle", target: "dsh-preset-four-images-model" })
```

## 七、已知限制

1. **`engines.dsh: ">=0.2.0-rc.2"`**：更早的 DSH 版本可能缺少 `@deepseek-ai/dsh-tool-cordis` 或 preset 注册表，会激活失败。
2. **更新已安装的 bundle 必须递增版本号**：profile 里的依赖是 `"file:<绝对路径>.tgz"` 形式。实测在同一路径、同一版本号下更新 tgz 内容后再次 `install_bundle`，pnpm 返回 `Already up to date`，管理接口随即返回 `changed: false` / `application: "failed"`（错误码 `ambiguous-install`），**装机副本不会更新**。正确做法：改 `package.json` 的 `version` → 重跑 `node scripts/pack.mjs` → 对新 tgz 执行 `install_bundle`。
3. **不做市场数据检索的强保证**：环境维度的时效性事实依赖使用者所在部署的联网搜索能力；没有该能力时，环境因子需由用户提供，父智能体会把它们标为待验证。
4. **不替代现场调研**：所有结论带证据与置信度要求；拿不到证据的结论会被写成"待验证"，这是设计意图，不是缺陷。
