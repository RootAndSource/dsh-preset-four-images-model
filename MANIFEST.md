# 转换清单（MANIFEST）· dsh-preset-four-images-model · 1.4.8

> **本包身份**：包名 `dsh-preset-four-images-model`，preset id `four-images-model`，Loader row id `preset-four-images`，名册条目 id 前缀 `four-images-`，品牌显示名 **`四象模型·DSH智能体`**。
> **本版基线**：同族 `dsh-preset-four-images-model-1.3.5/`（**保留不动**）。**1.4.0 相对 1.3.5 只做一件事**：修正 1.3.5 中两处遗留命名瑕疵，并把修正结果做成机器可验断言——详见本文件末尾**第十五节**。运行标识符（包名 / preset id / row id / 10 个名册条目 id）**全部未改**，故本版是 1.3.5 的**直接升级**（装机覆盖，不新增卡片）。
> **维度模型（现行）**：**六维** —— **主体（置首）** / 环境 / 地位 / 行为 / **才能** / **心态**。**才能与心态是两个独立维度**，从诊断、方案到汇总全程不得合并（详见第十三节）；**主体维度只做确认与画像、不出方案**（详见第十四节）。
> **逐字节对齐**：打包前冻结全部文档、打包后不回写 bundle 内文件，保证"装机副本 = tgz 内容 = 磁盘 bundle"三者一致。
> **版本纪律**：凡改动 bundle 内容（含文档措辞）都必须升 `version` 再打包装机；否则 pnpm 判定 `Already up to date`，装机副本不会更新。
> **版本推进**：1.1.1 修复乱码角色文件 → 1.1.2 改用名册派发 → 1.1.5 消除文档时序差 → 1.1.6 为 4 个只读诊断角色启用 `toolFilter` → 1.1.7 把 shell 类工具纳入 deny → 1.1.8 分发源替换 → 1.1.9 包名 `present`→`preset` 更正 → 1.3.5 清理陈旧路径引用 → 1.3.5 才能与心态拆分独立（五维）→ 1.3.5 新增主体维度并置首（六维）→ **1.4.0 修正遗留命名** → **1.4.1 补齐包元数据与 LICENSE** → **1.4.3 面向使用者的 README** → **1.4.4 同步 README 并升版** → **1.4.5 README 标题改为「四象模型·DSH智能体」** → **1.4.6 显示名整体改为「四象模型·DSH智能体」** → **1.4.7 仓库地址与文档修正** → **1.4.8 npm 发布与安装文档（本版）**。
> **零旧标识符**：本包内**不出现**任何改名前的包名、preset id、loader row id 或名册条目 id。包内保留的"四象模型·DSH智能体"是**品牌与预设卡片标题**，与标识符改名无关。
> **本版另有一项零残留要求**：包内（含条目首行注释、脚本注释、全部文档）**不出现维度拆分之前的侧别命名与自造的系统称谓**——修正清单以中性描述指代，不复现旧词字面值。


本文件记录本 bundle 的转换、改名与维度改造过程，来源对应、校验结果与需人工确认项。

## 一、来源与目标

| 项 | 值 |
|---|---|
| 母本（本包的来源） | 同仓母本 bundle（20 个文件：10 个名册条目 + 4 个自检脚本 + 6 个包级文件） |
| 来源谱系 | 该母本自身源自定义素材目录（10 个角色文件字符集损坏 → 按干净素材重建），完整过程见本文档第三至五节 |
| 本包目标 | 本仓库根目录（`dsh-preset-four-images-model`，1.4.8） |
| 分发产物 | `本包 artifacts/dsh-preset-four-images-model-<version>.tgz`（字节数与 SHA256 见同目录 `SHA256SUMS.txt`） |
| 源格式 | DSH Agent preset bundle（`dsh.manifestVersion=1` + `dsh.bundle.patch`） |
| 目标格式 | 同上，仅标识符改名（不改变运行形态与内容语义） |
| 幂等性 | 重复执行产生相同文件内容；`scripts/pack.mjs` 为确定性打包（mtime/uid/gid 归零、条目排序） |

## 二、源文件处置表（14 → 17）

| 源文件 | 目标文件 | 处置 | 说明 |
|---|---|---|---|
| `package.json` | `package.json` | 改写 | 补 `scripts`、`files` 增加 `scripts/` 与 `MANIFEST.md`；保留 `name`/`version`/`engines`/`dsh.bundle.patch` |
| `cordis.patch.yml` | `cordis.patch.yml` | 原样 | 唯一入口，源文件编码正常，逐字节保留 |
| `README.md` | `README.md` | 增补 | 追加规范化状态、`MANIFEST.md` 指引、包内容树与自检命令 |
| `INSTALL.md` | `INSTALL.md` | 增补 | 追加自检脚本段、roster 可选方案中的 id 对应关系 |
| `subagents/four-images-subject.yml` | `subagents/four-images-subject.yml` | **重建** | 源文件字符集损坏（见第四节） |
| `subagents/four-images-environment.yml` | `subagents/four-images-environment.yml` | **重建** | 同上 |
| `subagents/four-images-pos-a.yml` | `subagents/four-images-pos-a.yml` | **重建** | 同上 |
| `subagents/four-images-beh-a.yml` | `subagents/four-images-beh-a.yml` | **重建** | 同上 |
| `subagents/four-images-tal-a.yml` | `subagents/four-images-tal-a.yml` | **重建** | 同上 |
| `subagents/four-images-cog-a.yml` | `subagents/four-images-cog-a.yml` | **重建** | 同上 |
| `subagents/four-images-pos-b.yml` | `subagents/four-images-pos-b.yml` | **重建** | 同上 |
| `subagents/four-images-beh-b.yml` | `subagents/four-images-beh-b.yml` | **重建** | 同上 |
| `subagents/four-images-tal-b.yml` | `subagents/four-images-tal-b.yml` | **重建** | 同上 |
| `subagents/four-images-cog-b.yml` | `subagents/four-images-cog-b.yml` | **重建** | 同上 |
| — | `MANIFEST.md` | 新增 | 本文件 |
| — | `scripts/check.mjs` | 新增 | 结构校验（入口/清单/角色/绝对路径） |
| — | `scripts/checksums.mjs` | 新增 | 逐文件 SHA256 |
| — | `scripts/pack.mjs` | 新增 | 确定性打包 tgz |
| — | `SHA256SUMS.txt` | 新增 | 由 checksums.mjs 生成 |

## 三、角色文件重建的来源对应

重建以**工作区干净素材**为主源、以**入口文件 `cordis.patch.yml` 的现版设计**为准绳。

| 本包条目（当前） | 承继自母本条目 | 主要改动 |
|---|---|---|
| `four-images-subject.yaml` | 母本的 `subject` | 派发名改为本包前缀；工具名按 DSH 实际契约书写；保留联网检索能力 |
| `four-images-environment.yaml` | 母本的 `environment` | 派发名改为本包前缀；无内容改动 |
| `four-images-pos-a.yaml` | 母本的 `pos-a` | 派发名改为本包前缀；补"工具不可用时改纯文本推理"降级说明 |
| `four-images-beh-a.yaml` | 母本的 `beh-a` | 同上 |
| `four-images-tal-a.yaml` | 母本的 `tal-a` | 同上 |
| `four-images-cog-a.yaml` | 母本的 `cog-a` | 同上 |
| `four-images-pos-b.yaml` | 母本的 `pos-b` | 派发名改为本包前缀 |
| `four-images-beh-b.yaml` | 母本的 `beh-b` | 派发名改为本包前缀 |
| `four-images-tal-b.yaml` | 母本的 `tal-b` | 派发名改为本包前缀 |
| `four-images-cog-b.yaml` | 母本的 `cog-b` | 派发名改为本包前缀 |

每个条目文件头部保留溯源注释行，便于回溯。**含旧标识符的完整历史记录不在本包内**，保存在同仓母本 bundle 的 `MANIFEST.md` 中（本包与其并存于 `dist-share/`，未改动）。

## 四、承继的历史缺陷与修复（重要）

母本的早期分发包内，`subagents/` 下 **10 个角色文件全部损坏**，表现一致：

1. **字符集错误**：UTF-8 中文被按 GBK/CP936 二次解码，得到"涓讳綋鏅鸿兘浣?"式乱码（经典 UTF-8→GBK 误读特征）。
2. **换行丢失**：多个逻辑行被粘连成一行，例如 `displayName`、`description`、`model` 挤在同一条 YAML 键值内。按 YAML 解析时 `description` 与 `model` 会整段丢失，`displayName` 变成一长串乱码。
3. 影响范围：`subagents/` 10 个文件 **全部**；`package.json`、`cordis.patch.yml`、`README.md`、`INSTALL.md` 四个文件**编码正常**。

该早期版本的说明文件曾声称 10 个角色文件包含"完整 persona 正文 + 输出 JSON 契约"，与字节事实不符——即**该版本装机后读到的是乱码角色定义**。此缺陷已在母本的重建阶段修复，本包作为其派生**继承了修复结果**，可直接核验：本包 10 个条目均为正常中文、键值完整（见第十二节校验记录）。

## 五、校验结果（已实际执行）

命令与结果（Node v22.23.1，工作目录为本 bundle 根）：

```
node scripts/check.mjs
  → 通过 85 项；提示 3 项；失败 0 项；结论：校验通过
  → 通过项含：18 个必需文件齐全、package.json 元数据与入口指向、
     入口 6 个必需章节、10 个角色文件 id/model/persona 齐全且 id 唯一、
     无替换字符、无行粘连、17 个文本文件绝对路径扫描 0 命中
  → 提示 3 项说明：入口 persona 正文以"subagents/four-images-pos-b.yml 等"概括写法提及
     B 阶段角色，故 four-images-beh-b / four-images-tal-b / four-images-cog-b 未被逐字匹配；文件本身存在且校验通过，
     属检测规则的匹配粒度问题，非缺项
  → 自查豁免：scripts/check.mjs 因正文含路径检测正则表，扫描自身会自引用命中，已显式排除

node scripts/checksums.mjs
  → 18 个文件逐文件 SHA256，写入 SHA256SUMS.txt（该文件自身不参与计算）

node scripts/pack.mjs        # 打包到 本包 artifacts/
node scripts/finalize.mjs    # 生成 本包 artifacts/SHA256SUMS.txt（产物哈希单独成文件，避免循环引用）
```

**打包产物哈希**：见 `本包 artifacts/SHA256SUMS.txt`（本文件不再内嵌 tgz 哈希——哈希写进被哈希的文档会形成循环，改一次就要重算一次）。

**与源 tgz 的对比**：本项目早期分发的 tgz 与当前产物**字节数与哈希均不同**（具体见各自目录的 `SHA256SUMS.txt`）。差异来源有三：① 10 个角色文件由损坏改为干净；② 新增 `MANIFEST.md`、`scripts/` 四个脚本与 `artifacts/`；③ 打包实现不同（本包用 Node 内置 zlib 现写 ustar 头，非 npm pack）。**两个 tgz 不是同一份字节，不可用旧哈希校验新产物。**

**真机安装验证（已执行）**：用 `plugin_manager({ action: "install_bundle", target: "dist-share\artifacts\dsh-preset-four-images-model-1.4.0.tgz 的绝对路径" })` 实际安装，结果：

```
stage=enable, target=dsh-preset-four-images-model, enabled=true, changed=true
application=restart-required
pnpm: exitCode=0，Packages +1，resolved 6 / downloaded 2 / added 1，562ms（pnpm v11.7.0）
  仅一条 WARN：Issues with peer dependencies found（未阻断安装）
日志：%USERPROFILE%\.dsh\profiles\desktop\.plugin-manager\logs\operation-UUYMNU\pnpm.log
```

`list_bundles` 核验：`dsh-preset-four-images-model` `version 1.1.0`、`installed: true`、`enabled: true`、`rows: [{ rowId: "preset-four-images", moduleName: "@deepseek-ai/dsh-agent-preset", entryId: "include:preset-four-images" }]`。

`list_plugins` 核验：`include:preset-four-images` `enabled: true`、`fiberPhase: "active"`。

落盘核验：`%USERPROFILE%\.dsh\profiles\desktop\node_modules\dsh-preset-four-images-model\` 下 20 个文件齐全（含 `cordis.patch.yml`、`package.json`、`README.md`、`INSTALL.md`、`MANIFEST.md`、`scripts/` 4 个、`subagents/` 10 个）。抽查装机后的 `subagents/four-images-pos-a.yml`：中文正常，`id` / `displayName` / `description` / `model` / `persona` 五键逐行完整——**乱码版修复确已生效**（该装机目录内唯一的乱码字符串出自本 MANIFEST 引用损坏示例的那一行，属文档内容，非数据损坏）。

**仍需重启**：管理接口返回 `application: restart-required`；热加载已把该行挂为 `active`，但建议按提示重启一次 DSH，再开新会话使用。

## 六、需人工确认项

1. **`tools` 列表未在运行时验证**：`four-images-subject.yml` 的 `ask_user_question`、各角色的 `cordis_*` 工具名按 DSH 当前工具集书写，但本 bundle 采用"内联 persona 派发"模式，`tools` 字段是否被运行时读取尚未实测。若不被读取，可忽略；若被读取且名称有出入，需按你的部署改名。
2. **`model` 字段已实测生效**（1.1.2 起）：名册条目 `model: deepseek-v4-flash` 被 `list_subagents` 正确显示，且 A 阶段角色实派任务返回结构化 JSON，说明路由已按条目生效。原先"是否生效取决于 `workflow`/`subagent` 能力"的不确定性已消除。
3. **角色 id 与名册的兼容性已实测**（1.1.2 起）：10 个 id 作为文件名落在 `$DSH_HOME/subagents/`，`list_subagents` 全部列出且无诊断；`delegate` 按 `library_id: four-images-pos-a` 实派成功。仅剩未验证的是 B 阶段四个方案角色的独立调用（A 阶段已实测通过，B 阶段与 A 阶段走同一 `delegate` 路径与同一模型路由配置）。
4. **源目录未改动**：`dist-share/` 保持原状（含损坏文件与旧 tgz），本次未删除、未覆盖。是否要用本目录替换分发源，由你决定。
5. **版本号已递增至 `1.1.1`**：原因见下条。分发侧据此可区分"修复版"与源 `1.1.0`；`本包 artifacts/CHECKSUMS.md` 仍记的是源 tgz，如需对齐请另行更新。

## 七、1.1.1 变更说明（为何升版本）

1.1.0 → 1.1.1 只做两件事，**不改预设行为**：

1. **修复数据损坏**：10 个 `subagents/*.yml` 由乱码版重建为正常中文（本次转换的核心修复）。
2. **补齐工程件**：新增 `MANIFEST.md` 与 `scripts/`（check / checksums / pack / finalize）。

**为什么必须升版本**：profile 的依赖声明是文件路径形式 `"file:D:/.../dsh-preset-four-images-model-1.4.0.tgz"`。实测把同一路径、同一版本号的 tgz 内容更新后再次 `install_bundle`，pnpm 返回 `Already up to date`，管理接口随即返回 `changed: false`、`application: "failed"`（错误码 `ambiguous-install`）——**装机副本不会更新**。递增版本号后路径与版本都变化，pnpm 才会重新解析安装。这是 `file:` 依赖的已知行为，不是本包缺陷。

## 八、1.1.2 变更说明（改用名册派发）

1.1.1 → 1.1.2 是**派发机制改造**，四维框架与判断阈值不变：

| 项 | 1.1.1 | 1.1.2 |
|---|---|---|
| 派发方式 | `workflow` 脚本内 `agent(prompt)`，把角色 persona **内联**进 prompt | `list_subagents` + `delegate(library_id, prompt)`，persona 由名册条目自带 |
| 角色文件 | `subagents/<role>.yml`，字段含 `id` / `displayName` / `model` / `persona` / `tools` | `subagents/<role>.yaml`，字段为名册契约（无 `id` / `displayName` / `tools`） |
| id 来源 | 文件内 `id:` 字段 | **文件名**（`four-images-pos-a.yaml` → id `four-images-pos-a`） |
| 模型路由 | 依赖派发工具是否支持 model 覆盖 | 由条目 `model` 固定：A 阶段 `deepseek-v4-flash`、B 阶段 `deepseek-v4-pro` |
| 依赖 | 纯 DSH 随附插件，无第三方依赖 | 运行期需 `dsh-subagent-library` ≥ 0.3.x；缺失时自动降级为内联 persona 派发 |
| 校验 | 85 项 | 112 项（新增名册字段白名单、模型路由、id 合法性等校验） |

**改造过程中实测确认的三件事**（均已验证，不是推断）：

1. **名册条目字段是响亮拒绝的**：插件解析器 `parseEntryDocument` 对未知键直接抛错（`未知字段：…（可用：…）`），坏文件被跳过并进入诊断。旧文件的 `id` / `displayName` / `tools` 三个字段会让**全部 10 个角色失效**——这是本次改造最关键的坑。
2. **persona 的花括号不会炸**：官方文档称 persona 走严格 `{{…}}` 模板插值、未注册变量会导致激活失败。用含 JSON 花括号的探测条目实测：子代理正常激活并回出 JSON。因此角色 persona 里的输出契约 JSON **原样保留**。
3. **`delegate` 的 prompt 不被模板化**：它作为子代理的首条用户消息直接透传（插件源码 `prompt: [{ type: "text", text: args.prompt }]`），所以把上一阶段的 JSON 原样嵌入 prompt 是安全的。

**名册条目与 bundle 的关系**：bundle 内 `subagents/` 是这 10 个条目的**唯一源文件**；安装时复制到 `$DSH_HOME/subagents/`。名册目录热生效，改条目不需要重新打包或重启。

## 九、1.1.4/1.1.5 变更说明（分发源替换 → 文档对齐）

### 1.1.4：分发源替换 + 重打包（与预设行为无关）

| 动作 | 结果 |
|---|---|
| 替换 `dist-share/` 源内容 | 用当时已验证的干净 bundle 树整体重建；**10 个乱码角色文件与旧 `1.1.0` tgz 随之移出** |
| 旧树留档 | 备份为工作区 `dist-share.bak-1.1.0-corrupt/`（16 个文件），未销毁，可回溯 |
| 在 `dist-share/` 内重新打包 | 产物路径 `dist-share/artifacts/dsh-preset-four-images-model-<version>.tgz`（字节与哈希随版本变化，见同目录 `SHA256SUMS.txt`） |
| 校验 | bundle 内实跑 `check.mjs`：**112 项通过、0 失败** |
| 真机安装 | `install_bundle` 指向 `dist-share/artifacts/` 的产物 → `stage=enable`、`changed: true`、pnpm `exitCode=0` |
| 装机核验 | 装机副本 `subagents/*.yaml` 10 个、入口含"具名名册"、名册条目**无乱码** |
| 三处一致性 | 名册目录 `$DSH_HOME/subagents/`、`dist-share/` 镜像、装机副本的 10 个条目 **SHA256 逐字节一致** |
| 清理 | 确认装机改用新版本后，才删除被取代的旧 tgz（遵循"先声明后清理"顺序） |

### 1.1.5：消除文档时序差（本次）

1.1.4 的遗留问题是：核验记录在 tgz 打包后才写回 bundle 内的 `MANIFEST.md`，使磁盘副本与 tgz 内同名文件不一致。1.1.5 的处理：

1. 打包前先冻结 bundle 内全部文档（本文档的说明与本节均在此之前定稿）；
2. 打包后**不再回写 bundle 内任何文件**，核验记录改写到 bundle 之外的工作副本 MANIFEST 与工作区顶层 README；
3. 结果：装机副本 = tgz 内容 = 磁盘 bundle，三者逐字节一致（可复核）。

**版本号语义**：从 1.1.5 起，任何 bundle 内容变更（含文档措辞）都必须升 `version` 才能被打包与装机，否则 pnpm 会判定 `Already up to date`。这条纪律是保证"文档与产物对齐"的前提。

**踩过的坑（记录以备复用）**：先删旧 tgz、后声明新版本，会让 pnpm 在解析 profile 依赖时报 `ENOENT` 并使安装失败。正确顺序是：**改 `version` → 重打包 → `install_bundle` → 核验装机副本 → 最后清理旧产物**。

## 十、1.1.6 / 1.3.5 只读 toolFilter（4 个诊断角色）

`four-images-pos-a` / `four-images-beh-a` / `four-images-tal-a` / `four-images-cog-a` 四个只读诊断角色最终为：

```yaml
toolFilter:
  deny: [write, edit, pwsh, bash, subagent, workflow, delegate, list_subagents, create_goal, update_goal]
  # pwsh / bash：堵住"用 shell 绕开文件工具落盘"的路径；本会话没有的工具名由插件静默忽略，不会导致整次派发失败
```

**为什么 deny 里是这几类**：

1. `write` / `edit` —— 禁止诊断角色落盘改文件（本次要求的核心）；
2. `pwsh` / `bash` —— **1.3.5 补上**：文件工具被禁后，shell 是绕道写文件的唯一剩余通道，堵掉它才构成工具级强保证。条目是共享名册，跨平台部署（bash 版 DSH）同样需要这条；本会话没有 `bash` 时插件会静默忽略该名字，不会让整次派发失败；
3. `subagent` / `workflow` / `delegate` / `list_subagents` —— 插件文档对受限角色的明确建议：禁掉再派活，**防止子代理被全局提示词教去链式再派活**；`maxDepth: 1` 是第二道闸；
4. `create_goal` / `update_goal` —— 会写持久化会话状态，一并禁掉。

**为什么 `four-images-subject` / `four-images-environment` 不设**：它们的任务是检索与确认，明确要求是"4 个诊断角色"；两者本身没有写文件任务。如需一并收紧，把同一段 `toolFilter` 复制过去即可（名册改文件热生效，无需重装）。

**实测执法结果（真机，非推断）**：

| 测试 | 结果 |
|---|---|
| `list_subagents` 显示 | 1.1.6：`deny:[write, edit, workflow, delegate, list_subagents, create_goal, update_goal] 忽略:[subagent]`；1.3.5：`deny:[write, edit, pwsh, workflow, delegate, list_subagents, create_goal, update_goal] 忽略:[bash, subagent]` —— `pwsh` 已从"可用"落到 deny 侧 |
| `write` 尝试落盘 | 工具不在其列表中（`unknown tool "write"`）；探测文件**未产生**（`read` + `glob` 双向确认） |
| `pwsh` / `bash` shell 写入 | 1.3.5 实测：两者均**不在**子代理工具列表中，子代理报告"没有任何通用 shell/命令执行工具，无法运行写文件命令"；探测文件同样未产生 |
| `subagent` 再派活 | 被拒：`subagent depth 2 exceeds maxDepth 1` |
| 校验断言 | `check.mjs` 要求 4 个只读角色必须存在 `toolFilter` 且 `deny` 覆盖 `write` / `edit` / `pwsh` / `bash`，缺失即校验失败（校验项 112 → **120**） |

**关于"忽略"标注不是缺失**：`subagent` 被标为"本会话专属工具，子代本就继承不到"、`bash` 被标为"本会话不存在"——两者都是 DSH 实际工具集差异，插件按会话可应用集合解析 deny，因此不会让整次派发失败。1.1.6 版记录中曾把 `pwsh` 列为"未决缺口"，**该缺口已在 1.3.5 关闭**。

## 十一、本次改名记录（→ dsh-preset-four-images-model）

以同仓**母本 bundle（同一版本号的姊妹包）**整树复制，按下列**四类标识符**统一改名，并同步更新**品牌显示名**。**内容语义未改动**：四维框架（环境 / 地位 / 行为 / 才能·心态）、判断阈值、persona 正文、工具过滤配置全部保持原样。

| 类别 | 改名前 | 改名后 |
|---|---|---|
| 包名（含目录名与 tgz 名） | 母本的包名 | `dsh-preset-four-images-model` |
| preset id | 母本的 preset id | `four-images-model` |
| Loader row id | 母本的 row id | `preset-four-images` |
| 名册条目 id（= 文件名），10 个 | 母本的 10 个简短角色 id | `four-images-subject` / `four-images-environment` / `four-images-pos-a` … `four-images-cog-b` |
| **品牌显示名**（预设卡片标题、文档标题、产物注释） | 母本的品牌名 | **`四象模型·管理世界`**（16 个文件、26 处） |

**品牌改名的边界**：仅替换品牌串本身。"四维定义"（章节名）、"四维并行"、"四维总览表"、"四维分析系统"里的通用量词与校验断言键名 `'四维定义'` **保留原样**——它们是描述"四个维度"的功能性表述，不是品牌标识符；替换它们会破坏校验断言与语义（如"四象并行"不成立）。

> 改名前的具体字符串**有意不在本包内记录**（零旧标识符），完整对照见母本 bundle 的 `MANIFEST.md` 第十一节，或直接对比两份 bundle 的同名文件。

| 项 | 结果 |
|---|---|
| 复制 | 母本 20 个文件整树复制；名册条目 10 个文件同步改名 |
| 文本替换 | 19 个文件被改写（全部为标识符替换，无内容语义改动） |
| 路径修正 | 修正了替换过程中产生的版本化路径错乱（形如 `…-<旧版本号>.tgz`）→ 统一归为 `…-1.3.5`；产物目录引用改为 `dist-share/artifacts/` |
| 重算哈希 | `scripts/checksums.mjs` 重算 19 个文件哈希写入 `SHA256SUMS.txt` |
| 重新打包 | `scripts/pack.mjs` → `本包 artifacts/dsh-preset-four-images-model-1.4.0.tgz` |
| 结构校验 | `scripts/check.mjs`：**120 项通过、0 失败**（含"入口提到全部 10 个名册 id"与"名册字段白名单/模型路由/id 正则"规则） |
| 名册契约验证 | 见第十二节 |
| 旧名残留 | bundle 内不再出现旧**包名/preset id/row id** |

**与母本的关系**：两包并存于同一仓；母本 bundle **未被修改**（20 个文件，`MANIFEST.md` 19,081 字节，与本包生成前一致），可回退对照。两包的 loader row id 不同，因此可同时装载；但**名册目录是共享的**（`$DSH_HOME/subagents/`），详见第十二节。

## 十二、名册契约验证与真委派验收

| 项 | 结果 |
|---|---|
| 结构校验 | `scripts/check.mjs`：**140 项通过、0 失败**（含"入口 persona 提到全部 10 个名册 id"、"字段白名单"、"A/B 模型路由"、"id 正则"、"六维结构"与"主体维度三类产出"断言） |
| 契约键修复（重要） | 改名替换曾误伤 persona 输出契约的 JSON 键：`first_subject`→`first_four-images-subject`、`target_subject`→`target_four-images-subject`、`"subject"`→`"four-images-subject"`。已按完整签名精确回改，10 个条目全部修正；复查残留 0 处 |
| 名册解析与列出 | 改名后 10 个条目放入 `$DSH_HOME/subagents/` 后，`list_subagents` 全部列出新 id（`four-images-subject` … `four-images-cog-b`），描述、模型路由、`toolFilter` 均正确继承，**无诊断** |
| 真委派验收 1 | `delegate(library_id: "four-images-pos-a")` → 返回严格 JSON；四项权力逐项打标（无证据写"无证据"）、关系四要素齐全、high 问题带证据、6 条 `data_gaps`；回显忽略项 `bash`（本会话不存在）、`subagent`（本会话专属） |
| 真委派验收 2 | 契约键修复后复测 `delegate(library_id: "four-images-subject")` → 字段名恢复为 `first_subject` / `related_subjects` / `uncertainties`，**契约一致** |
| 标识符一致性 | `package.json.name` = `dsh-preset-four-images-model`；目录名 = `dsh-preset-four-images-model-1.3.5`；tgz 同前缀；preset id = `four-images-model`；row id = `preset-four-images`；名册条目 10/10 带 `four-images-` 前缀，残留旧名 0 |
| 断链扫描 | 全 bundle 扫描：指向工作区其他目录的失效产物路径 **0 处**；版本号错乱的自我引用路径（`…-1.1.x`，x≠7）**0 处** |
| 旧名残留说明 | 本文档历史章节（第三至十节）仍出现母本的旧包名 / 旧 preset id / 旧 row id ——这些是**母本改名前的审计溯源记录**，非本包标识符；本包的运行配置、入口与名册条目中**无旧名** |
| 产物 | `本包 artifacts/dsh-preset-four-images-model-1.4.0.tgz`；字节数与 SHA256 见同目录 `SHA256SUMS.txt`（哈希不内嵌本文档，避免循环引用） |
| 活名册状态 | 验收后 `$DSH_HOME/subagents/` 保留**改名后**的 10 个条目（`four-images-*`）。母本条目 id 仍留在母本 bundle 内；若要让母本恢复可派发，把其 `subagents/*.yaml` 复制回该目录即可（同一时刻只能存在一套 id） |

## 十三、1.3.5 维度结构改造：才能与心态拆分独立

### 问题

1.1.x 把**才能**与**心态**并成一个"心维度"（表头写作"才能·心态维度"），汇总阶段明确定为"合并为心维度一份方案"。这会导致：能力缺口被写成意愿问题、意愿问题被开成培训方案——即本预设声称要治的**归因错维**，反而被结构本身制造出来。

### 改造内容

| 项 | 1.1.x | 1.3.5 |
|---|---|---|
| 维度数 | 四维（环境 / 地位 / 行为 / 才能·心态） | **五维**（环境 / **才能** / **心态** / 地位 / 行为） |
| 维度表头 | `才能·心态维度 \| 心` | `才能维度 \| 才` 与 `心态维度 \| 心` **两行** |
| 推导顺序 | 环定约束 → 位定可能 → 行定现实 → **心定突破** | 环定约束 → 位定可能 → 行定现实 → **才定条件** → **心定成败** |
| 阶段四汇总 | 四维总览表；`tal-b` 与 `cog-b` **合并为一份心维度方案** | **五维总览表**；`tal-b` 与 `cog-b` **各自独立成节**，禁止合并 |
| 行动清单 | 未区分 | 才能类与心态类行动项**分开排列** |
| A 阶段返回 | 未约束 | `tal-a` 返回不得含意愿侧结论；`cog-a` 返回不得含能力侧结论 |
| 回流条件 | 心 → 环境 | **才 → 环** 与 **心 → 环** 各自独立触发 |
| 新增纪律章节 | — | persona 增「维度独立性与禁止合并」专章 |

### 校验强化

`scripts/check.mjs` 新增 7 项断言，把"不得合并"变成**机器可验的硬约束**（校验项 **121 → 128**）：

1. persona 含独立「才能维度」
2. persona 含独立「心态维度」
3. persona 声明"才能与心态是两个独立维度"
4. persona 含"禁止把才能与心态合并为一份方案"
5. persona 要求「五维分析总览表」
6. persona 要求「逐维独立成节」
7. persona **不得**再出现已废弃的「才能·心态维度」合并表述

### 未改动项

- **名册条目 id 不变**（10 个 `four-images-*`），条目内部 persona 不动——`tal` 系列本就只写能力侧、`cog` 系列本就只写意愿侧，无需改写。
- 标识符体系不变（包名 / preset id / row id 均含 `four-images`，按决定保留）。
- 各维度判断阈值不变。
- 品牌显示名不变（`四象模型·管理世界`）。

### 验证结果

| 项目 | 结果 |
|---|---|
| 结构校验 | `scripts/check.mjs`：**128 项通过、0 失败**（含上述 7 项新断言） |
| persona 内「四维」残留 | 仅 1 处，为有意保留的对比句"五维总览表（不是四维）" |
| 名册条目字段 | 10/10 仍符合名册契约（未改动），模型路由不变（6 个 flash / 4 个 pro） |

### 升级动作

因 bundle 内容已变，按版本纪律升版 `1.3.5 → 1.3.5` 并重打包安装；被取代的旧产物在装机核验通过后删除。

## 十四、1.3.5 新增主体维度并置首（六维）

### 变更动机

1.3.5 及更早版本里，`four-images-subject` 只承担"**确认**"职责（输出第一主体 + 1–3 相关主体 + uncertainties），不构成一个分析维度——利益相关者、利益关联、人物/组织画像这些"这件事是谁的事"的关键判断**没有专门角色负责**，只能靠后序维度各自夹带，导致主体信息散落、口径不一。

### 变更内容

| 项 | 1.3.5 之前（五维） | 1.3.5（六维） |
|---|---|---|
| 维度数 | 五维（环境/地位/行为/才能/心态） | **六维（主体 / 环境 / 地位 / 行为 / 才能 / 心态）** |
| 维度顺序 | 环境置首 | **主体置首**，随后是环境→地位→行为→才能→心态 |
| 推导顺序 | 环定约束 → 位定可能 → 行定现实 → 才定条件 → 心定成败 | **主定对象** → 环定约束 → 位定可能 → 行定现实 → 才定条件 → 心定成败 |
| `four-images-subject` 定位 | 确认角色（阶段一辅助） | **完整维度第一维**：确认 + 利益相关者识别 + 利益关联判定 + 人物/组织画像 |
| 阶段四汇总 | 五维总览表 + 五节 | **六维总览表（主体排最前）** + **六节**，主体节含清单/利益相关者/利益关联/画像 |
| 方案产出 | 位/行/才/心 四份 | 仍为 位/行/才/心 四份——**主体维度只做分析，不出方案**（按确认意见） |
| 新增纪律 | — | 主体维度不得被其他维度取代；其他维度不得自行新增或改写主体，需新增必须回流主体维度 |

### 主体维度新增的输出契约

`four-images-subject` 的 JSON 契约由"仅主体清单"扩展为四块：

1. `first_subject` —— 第一主体 + `profile_type`（人物画像/组织画像）+ `profile`（identity / power_and_resources / background / style / demands / concerns / influence_source / stance）
2. `related_subjects` —— 1–3 个重要相关主体，各自带画像与 `interest_link`
3. `stakeholders` —— 利益相关者清单，每条含 `tier`（主要/次要/外部环境）、`relation_type`（利益共享/交换/冲突/依附/监管约束/竞争关系/无明显关系）、`relation_strength`、`direction`、`demands`（具体诉求）
4. `stakeholder_matrix` —— 利益相关度 × 影响力矩阵 + 策略取向（重点争取/保持满意/持续通报/最小投入）

### 新增判断阈值（写入条目 persona）

- 画像至少覆盖 5 个要素，少于 5 项视为画像不完整；
- 每个利益相关者必须有**具体诉求**，只能写"关注/重视"的视为未识别、移出清单；
- 仅凭名称/头衔/常见印象推断画像属不合格，无事实支撑的写"无证据"；
- 利益相关者清单为空或只有第一主体自身时，必须显式声明并列出已检查的依据来源。

### 校验强化

`scripts/check.mjs` 由 128 项增至 **145 项**，新增：

- 入口 persona：独立「主体维度」、主体维度排在最前、六维分析总览表、主体列在最前、提及利益相关者、提及人物/组织画像、**不得再出现已废弃的五维表述**；
- 主体条目本体：含「利益相关者」「利益关联」「人物画像」「组织画像」、输出契约含 `stakeholders` 与 `profile_type`、声明"只做确认与分析，不出方案"、含契约硬约束条款、禁止自造枚举/改结构、矩阵契约含 `strategy`；
- **主体条目纳入只读角色**：`four-images-subject` 与 4 个诊断角色一样必须带 `toolFilter.deny` 且覆盖 `write / edit / pwsh / bash`。

### 契约收紧（实测驱动）

首次真机验收 `four-images-subject` 时发现**契约漂移**：核心产出齐全（画像逐要素带证据、利益相关者与矩阵完整、未输出任何方案），但枚举字段被自造——`tier` 写成"外部平级""资源审批方"、`relation_type` 写成自定义短语、`stakeholder_matrix` 被改写成 `pairs` / `conflict_axis` 结构。处置：

1. 条目 persona 新增「**契约硬约束**」章节：字段名与层级严格按契约、枚举字段逐字取自枚举值、矩阵固定为 `name/interest/influence/strategy` 数组、额外判断写进 `interest_link` 或 `uncertainties`、输出不得含方案类字段；
2. 主体条目加 `toolFilter`（只读）；
3. 校验脚本补 5 项断言（契约硬约束条款、禁止造词、矩阵契约、主体只读）。

> 这是"实测 → 收紧 → 再验证"的闭环。契约漂移是 LLM 输出的常见失效模式，用断言加硬约束条款双重约束，比只写一次契约可靠。

### 1.3.5：修掉一次真实破坏 + 补两条流程护栏

1.3.1 封包后复测**失败**，根因有两层，都值得记录：

| # | 问题 | 根因 | 处置 |
|---|---|---|---|
| 1 | 主体条目 JSON 契约**结构塌陷**（`},` 与 `"related_subjects"` 被压到同一行 → 契约非法 → 模型丢掉 schema 并自造字段） | 一次"看着无变化"的编辑吞掉了一个换行；而校验只做关键词断言，**拦不住结构破坏** | 修复换行；新增断言：从每个条目 persona 抽 JSON 契约做**真实 `JSON.parse`**，主体条目另验 4 组必填字段 |
| 2 | 运行时读到的仍是**旧契约**（模型在 `uncertainties` 自述"原契约无 profile_type / profile"） | **活名册 `$DSH_HOME/subagents/` 里 10 个条目全部滞后于 bundle**——升级 bundle 不会自动同步名册副本（`subject` 仅 2,402 字节 vs bundle 8,300 字节） | 用 bundle 版覆盖活名册，逐文件 SHA256 复核 10/10 一致 |

**流程护栏（今后必须做）**：

1. 改 bundle 后**必须同步活名册**：`node scripts/sync-roster.mjs`；否则运行时仍用旧条目——本次即因此连续两轮复测失败。
2. 校验脚本的**契约可解析断言不可删**：它是唯一能拦住"结构塌陷"的检查（校验项 145 → **159**）。

### 1.3.5：把护栏 1 脚本化

新增 `scripts/sync-roster.mjs`（附 `npm run sync-roster` / `sync-roster:check`），把"人工记得复制"变成"可检查、可自动化"：

| 能力 | 说明 |
|---|---|
| `--check` | 只报差异不写文件；**有差异退出码 2**，可直接接 CI / 开机自检 |
| 默认（无参数） | 只同步 `four-images-*` 前缀条目，**不碰其他包的条目** |
| `--prune` | 追加删除名册里本包已移除的条目；**不加则绝不删除** |
| `--dir <路径>` | 指定其他名册目录（支持 `~`），用于多 profile 或临时验证 |
| 自动备份 | 覆盖或删除前，把原文件复制到 `<名册>/_backups/sync-<时间戳>/` |
| 越界防护 | 删除路径必须落在目标目录内且前缀匹配 |
| 写入后复核 | 逐文件重算哈希，不一致退出码 1 |

**真机四向实测（非推断）**：

| 测试 | 结果 |
|---|---|
| 一致时 `--check` | "0 处差异"、退出码 **0** |
| 故意制造漂移（活名册 `subject` 截断为 1,623 字节）后 `--check` | 检出 **1 处差异**、退出码 **2** |
| 执行同步 | 备份 1 个原文件 → `_backups/sync-20261015090249/four-images-subject.yaml`（1,623 字节）；更新 1 / 未变 9；复核 10/10 一致；退出码 **0** |
| 再次 `--check` | 回到"0 处差异"、退出码 **0** |

### 1.3.5：条目溯源注释去版本化 + 修掉一次换行副作用

**动机**：条目首行的溯源注释里写了版本号（形如 `# 来源：本包 1.3.3 的 …`），于是**每次升版都会让这行变化**，同步脚本必然报 1 处"差异"——属无功能意义的改动，应当消除。

| 改动 | 说明 |
|---|---|
| 溯源注释去版本化 | 10 个条目首行统一为 `# 来源：母本 bundle 的 subagents/four-images-<role>.yml（名册版：去掉 id/displayName/tools 三个名册不识别的字段）`，**不再含版本号**。改前已用逐行扫描确认：版本号**只出现在第 1 行**（10/10 条目均如此），故契约与正文零风险 |

**途中出现的副作用与修复（值得记录）**：

用 .NET `WriteAllLines` 改写首行时，它把这 10 个条目从 **LF 变成了 CRLF**，而 `check.mjs` 的 toolFilter 正则按 `\n` 匹配 → 5 个只读角色被**误报**"缺 toolFilter"（数据其实都在）。这是校验脚本的**假阳性**，不是数据损坏。

- 处置：把这 10 个条目换行统一为 **LF**（与 bundle 其余文件一致），断言随即恢复 → 校验 **159 项通过、0 失败**。
- 教训：Windows 上改 YAML/文本时 `WriteAllLines` 会引入 CRLF；**要么显式用 LF 写，要么让断言的换行匹配兼容 CRLF**。本次选择统一 LF，保持全仓一致。

### 未改动项

- 10 个名册条目 id 不变（仍为 `four-images-*`），标识符体系不变（按确认意见保留）；
- 其余 9 个条目的 persona 与判断阈值不变；
- 模型路由不变（6 个 flash / 4 个 pro）；品牌显示名不变。

### 升级动作

因 bundle 内容已变，按版本纪律升版 `1.3.5 → 1.3.5` 并重打包安装；被取代的旧产物在装机核验通过后删除。


## 十五、1.4.0 变更说明（修正遗留命名；运行标识符未改）

### 变更动机

1.3.5 及更早版本把「才能 / 心态」拆成两个独立维度并写入六维结构，但**条目文件与入口文档的若干措辞停留在拆分之前**，形成两类不一致：

1. `tal-a` / `tal-b` / `cog-a` / `cog-b` 的**输出契约 `dimension` 值**仍沿用维度拆分之前的侧别命名（能力侧 / 意愿侧两套旧称），与父智能体汇总阶段的六维别名体系（主 / 环 / 位 / 行 / 才 / 心）不一致——父智能体按六维调度，子代理却回旧名称，属契约口径不一致；
2. `tal-a` / `cog-a` 的 `description` 与 persona 首句、`tal-b` / `cog-b` 的 persona 首句同样沿用该旧命名；`environment` / `pos-a` / `beh-a` 的 persona 另有一处**自造的系统称谓**，与品牌显示名不一致。

### 变更内容（共 7 个条目文件、13 处文本；另 10 个条目首行注释去旧词）

| # | 1.3.5 的瑕疵 | 1.4.0 修正 | 涉及条目 |
|---|---|---|---|
| 1 | 输出契约 `dimension` 沿用维度拆分之前的侧别命名 | `tal-a` / `tal-b` → `"dimension": "才"`；`cog-a` / `cog-b` → `"dimension": "心"` | 4 个条目、4 处 |
| 2 | `description` 带同一套旧侧别命名（`list_subagents` 展示给父智能体的就是这段） | `（才）` / `（心）`，与六维别名一致 | `tal-a` / `cog-a`、2 处 |
| 3 | B 阶段 persona 首句用旧侧别命名指代 A 阶段产出 | 改为"把**才**维度诊断转化为可执行方案" / "把**心**维度诊断转化为可执行方案" | `tal-b` / `cog-b`、2 处 |
| 4 | `tal-a` / `cog-a` persona 把自身定位写成"…系统'心维度'"下的某一侧 | 改为"负责四象模型·管理世界'**才能维度（才）**' / '**心态维度（心）**'" | 2 个条目、2 处 |
| 5 | `environment` / `pos-a` / `beh-a` persona 使用自造的系统称谓 | 去掉该称谓，统一为品牌名"四象模型·管理世界" | 3 个条目、3 处 |
| 6 | 10 个条目首行溯源注释写法陈旧（含旧词，且把条目描述成旧结构） | 统一改写为不含旧词的溯源句；正文未改的 `subject` / `pos-b` / `beh-b` 注释里明确写出"仅改写注释、正文逐字未改" | 10 处 |

> 上表**有意不复现旧词字面值**：本版要求全包零旧词残留。需要看原始字面值时，请对比同族 `dsh-preset-four-images-model-1.3.5/`。

### 未改动项

- **运行标识符全部未改**：包名 `dsh-preset-four-images-model`、preset id `four-images-model`、Loader row id `preset-four-images`、10 个名册条目 id `four-images-*` —— 故本版是 1.3.5 的**原地升级**（同名同 id，换版本与内容），不新增预设卡片，也不与 `dsh-preset-four-images-plus`（独立命名空间）冲突。
- **产品语义零变化**：六维结构与顺序、禁止合并纪律、判断阈值、分析框架、模型路由（6 flash / 4 pro）、`toolFilter`、`maxDepth`、四阶段流程与降级路径、入口 persona 正文，全部与 1.3.5 一致。
- 条目正文未改的 3 个（`subject` / `pos-b` / `beh-b`）**除首行注释外逐字相同**。

### 文件口径（本版明确，与 `checksums.mjs` / `pack.mjs` / `tools/release-verify.mjs` 一致）

| 类别 | 是否纳入源文件清单 | 是否进入 tgz 归档 | 说明 |
|---|---|---|---|
| 常规文件（`package.json` / `cordis.patch.yml` / `*.md` / `LICENSE` / `subagents/*` / `scripts/*`） | ✅ | ✅ | 发布内容主体 |
| `SHA256SUMS.txt`、`FREEZE.md` | ❌ | ❌ | 两个自引用清单，避免"哈希写在被哈希的文件里" |
| `artifacts/` 子树（tgz 与产物清单） | ❌ | ❌ | 产物，由 `finalize.mjs` 单独登记 |
| 点文件：`.gitignore`、`.gitattributes` | ❌ | ❌ | 仓库设施，非发布内容（本版把口径写死，避免"清单 23 / 归档 22"这类偏差） |

### 重新验证点（两轮）

1. 第一轮（交付前）：`checksums → pack → finalize` → `check.mjs`（189 项通过）→ `tools/release-verify.mjs --version 1.4.1`（PASS 17 / FAIL 0）→ `tools/release-diff.mjs --version 1.4.1`（无非预期增删）；
2. 第二轮（收尾改写后）：因本版新增 `.gitattributes` 与上述口径说明属**归档内文件**变更，**必须重跑同一套命令**并确认 tgz 哈希随之更新、且连续两轮打包同哈希（确定性）。

### 兼容性影响（需注意）

`dimension` 字段值由旧侧别命名改为 `才` / `心`，属**子代理输出契约的取值变更**：若你有外部脚本、下游分析或自建汇总逻辑在按旧值匹配该字段，需要同步改为匹配 `才` / `心`。父智能体自身的汇总调度不受影响（它按六维别名工作，改后与它一致）。

### 校验强化

`scripts/check.mjs` 新增 30 项断言，把"不得回退"做成硬约束：

1. 10 个条目契约的 `dimension` 必须 ∈ `主 / 环 / 位 / 行 / 才 / 心`；
2. 10 个条目**全文（含注释）**禁用词扫描：两类旧侧别命名、两类侧别诊断命名、自造的系统称谓，任一命中即校验失败。词表在脚本内**按 Unicode 码位构造**，故校验脚本自身不含旧词字面值；
3. 10 个条目 `description` 不得出现侧别字样。

### 逐条目差异行（机器比对 1.4.0 vs 1.3.5，行号从 1 起）

| 条目 | 差异行 | 性质 |
|---|---|---|
| `subject` | 1 | 仅首行注释 |
| `environment` | 1、6 | 注释 + 品牌自称去自造系统称谓 |
| `pos-a` | 1、9 | 同上 |
| `beh-a` | 1、9 | 同上 |
| `tal-a` | 1、2、9、41 | 注释 + `description` + persona 首句 + 契约 `dimension` |
| `cog-a` | 1、2、9、43 | 同上 |
| `pos-b` | 1 | 仅首行注释 |
| `beh-b` | 1 | 仅首行注释 |
| `tal-b` | 1、6、34 | 注释 + persona 首句 + 契约 `dimension` |
| `cog-b` | 1、6、34 | 同上 |

### 实测结果

| 项 | 结果 |
|---|---|
| 结构校验 | `node scripts/check.mjs` → **通过、0 失败**（含上述 30 项新断言） |
| 零旧词终检 | 全目录 5 类旧词扫描（yaml / md / mjs / json，含注释与脚本自身）→ **命中 0** |
| 编码与行尾 | 10 个条目统一 **LF**、UTF-8 无 BOM（CRLF 0 / BOM 0） |
| 产物 | `artifacts/dsh-preset-four-images-model-1.4.0.tgz`（字节数与 SHA256 见同目录 `artifacts/SHA256SUMS.txt`；本文档不内嵌哈希，避免循环引用） |
| 1.3.5 零改动 | 用其自带 `SHA256SUMS.txt` 复核 **20 个文件、0 处不一致**；`dist-share/artifacts/dsh-preset-four-images-model-1.3.5.tgz` 未重写 |
| 升级动作 | 改 `version` → 重打包 → `install_bundle` → 核验装机副本 → **最后**清理旧产物；本版**尚未安装** |

### 升级动作与名册同步

1. `plugin_manager({ action: "install_bundle", target: "<本目录>/artifacts/dsh-preset-four-images-model-1.4.0.tgz" })`
2. **必须** `node scripts/sync-roster.mjs`：名册条目 id 与 1.3.5 完全相同，bundle 升级**不会**自动更新 `$DSH_HOME/subagents/`，不同步则运行时仍读旧契约（本项目曾因此连续两轮复测失效）。
3. 若同时装有 `dsh-preset-four-images-plus`，注意两者名册 id 前缀不同（`four-images-` 与 `four-images-plus-`），各自同步互不影响。

### 1.4.0 实施记录：一次产物清单误写的发现与修复

派生 1.4.0 时，`scripts/pack.mjs` 与 `scripts/finalize.mjs` **沿用了 1.3.5 的写法**（`resolve(root, '..', 'artifacts')`，即共享的 `dist-share/artifacts/`）。后果与处置：

| # | 现象 | 处置 |
|---|---|---|
| 1 | 1.4.0 的 tgz 被打到共享 `dist-share/artifacts/`（与 1.3.5 的产物同目录） | 已删除该临时产物；`pack.mjs` 输出目录改为**本 bundle 内 `artifacts/`** |
| 2 | `finalize.mjs` 重写了共享 `dist-share/artifacts/SHA256SUMS.txt`（内容未丢：1.3.5 那行仍在，但多了一行 1.4.0、时间戳被刷新） | 已把该文件恢复为**只含 1.3.5 产物**的形态；`finalize.mjs` 输出目录改为**本 bundle 内 `artifacts/`** |
| 3 | 1.3.5 的 tgz 本身 | **未被改动**（48,953 字节，SHA256 与恢复后的清单一致） |

**教训（与同族 PLUS 包的一致性）**：派生版本必须**独立产物目录**，否则共享目录的产物清单会被兄弟包重写。本次两处脚本已改，1.4.0 的产物与哈希现在只落在 `<本包>/artifacts/`。
**注意**：`dist-share/artifacts/` 仍由 1.3.5 的 `finalize.mjs` 管辖——**如再次对 1.3.5 运行 `finalize.mjs`，会连同目录内其他 tgz 一起重新登记**，这是其原有行为，非本版引入。

## 十七、1.4.1 变更说明（包元数据与 LICENSE；运行标识符与产品语义未改）

### 变更动机

1.4.0 发布后发现两处**仓库与产物不同源**的问题（取证见工作区 `tools/FINDINGS-1.4.0.md`）：

1. 仓库 HEAD 的 `package.json` 含 `author` / `repository` 两个字段（1251 字节），而 1.4.0 归档内的那份没有（1030 字节）——`version` 同为 1.4.0，导致"从源码重打包会产出同版本号、不同哈希的 tgz"，与冻结纪律冲突；
2. 仓库根 `LICENSE`（MIT）**被 git 跟踪**，却不在 `package.json.files`，也不在 `pack.mjs` 的 `INCLUDE_TOP` 里——**从未进入任何分发包**。

### 变更内容（共 3 个文件）

| # | 文件 | 1.4.0 | 1.4.1 |
|---|---|---|---|
| 1 | `package.json` | `version: 1.4.0`，无 `author` / `repository`，`files` 无 `LICENSE` | `version: 1.4.1`，**补齐 `author` / `repository`**，`files` **纳入 `LICENSE`** |
| 2 | `scripts/pack.mjs` | `INCLUDE_TOP` 5 项 | `INCLUDE_TOP` **加入 `LICENSE`**（归档面与 `files` 声明对齐） |
| 3 | `FREEZE.md` | 生成器口径缺陷（表格含 `SHA256SUMS.txt`，比逐文件清单多一行） | 用修正口径重新生成：表格行数 = 合计声明 = `SHA256SUMS.txt` 条目数 |

其余全部文件（`cordis.patch.yml`、10 个名册条目、`scripts/` 其余 5 个脚本、`README.md`、`INSTALL.md`、本文件正文）与 1.4.0 逐字一致。

### 未改动项

- **运行标识符全部未改**：包名 `dsh-preset-four-images-model`、preset id `four-images-model`、Loader row id `preset-four-images`、10 个名册条目 id `four-images-*`；
- **产品语义零变化**：六维结构与顺序、禁止合并纪律、判断阈值、分析框架、模型路由、`toolFilter`、四阶段流程、入口 persona 正文；
- 1.4.0 目录与其产物`**保持原样、未被回写**（只读留档）。

### 兼容性影响

- 无破坏性变更：新增的 `author` / `repository` 仅为包元数据，`LICENSE` 仅为归档内多一个文件；
- 分发侧注意：**产物文件名与哈希都变了**（`-1.4.1.tgz`），profile 依赖路径需同步更新。

### 升级动作

按版本纪律：改 `version` → 重跑 `checksums → pack → finalize` → 重跑 `check.mjs` 与 `tools/release-verify.mjs` → 用 `tools/freeze-manifest.fixed.mjs` 重生成冻结清单 → 提交。

## 十八、1.4.3 变更说明（README 改为面向使用者）

### 变更动机

1.4.1 的 `README.md` 是**开发者视角**的：开篇讲"本包是同族 1.3.5 的派生升级版"、逐条列"1.4.0/1.4.1 修了什么"、并引导读者去看 `MANIFEST.md`。对**只想起作用的使用者**来说，这些信息既不必要，还会让人以为"必须先懂这套版本谱系才能安装"。

### 变更内容（1 个文件）

| 文件 | 1.4.1 | 1.4.3 |
|---|---|---|
| `README.md` | 开发者视角（版本链、修正清单、指向 MANIFEST） | **使用者视角**：从 Releases 下载 tgz → 装名册库 → 装本插件 → 把名册目录指向包内 `subagents/` → `list_subagents` 确认 → 新建会话使用；附常见问题与卸载方式 |

其余全部文件（`package.json`、`cordis.patch.yml`、10 个名册条目、`scripts/` 6 个脚本、`INSTALL.md`、`LICENSE`、本文件正文）与 1.4.1 逐字一致；**版本号由 1.4.1 升为 1.4.3**。

### 未改动项

- 运行标识符：包名 `dsh-preset-four-images-model`、preset id `four-images-model`、Loader row id `preset-four-images`、10 个名册条目 id；
- 产品语义：六维结构与顺序、禁止合并纪律、判断阈值、模型路由、`toolFilter`、四阶段流程、入口 persona 正文。

### 安装方式的关键澄清（本版 README 明确写出）

安装包**自带** 10 个名册条目（归档内 `subagents/*.yaml`），因此使用者**不需要**手工复制任何文件到 `$DSH_HOME/subagents/`；只需把 `dsh-subagent-library` 的 `entriesDir` 指向包内目录：

```
%USERPROFILE%\.dsh\profiles\<profile>\node_modules\dsh-preset-four-images-model\subagents
```

该配置项由 `dsh-subagent-library` 提供、保存后热生效。

### 升级动作

改 `version` → 重跑 `checksums → pack → finalize` → `check.mjs` 与 `tools/release-verify.mjs` → `tools/freeze-manifest.fixed.mjs` 重生成冻结清单 → 提交；产物用于 GitHub Releases 分发。


## 十九、1.4.3 变更说明（品牌显示名改为「四象模型·管理世界」）

### 变更动机

品牌显示名统一为 **四象模型·管理世界**（原「四象模型·管理神器」）。该名称出现在预设卡片标题、文档标题与角色自我介绍中，属面向使用者的展示层文案。

### 变更范围（全包统一，共 29 处）

| 载体 | 处数 | 说明 |
|---|---|---|
| `package.json` `description` | 1 | 预设卡片副标题 |
| `cordis.patch.yml` | 1 | 入口注释与文档头 |
| `README.md` / `INSTALL.md` / 本文件 | 11 | 标题与正文 |
| `scripts/*.mjs`（6 个脚本的横幅与注释） | 10 | 仅注释/控制台文案 |
| `subagents/*.yaml`（5 个条目） | 5 | persona 自我介绍句，如"负责四象模型·管理世界'环境维度（环）'" |
| `SHA256SUMS.txt` / `FREEZE.md` | 1 | 由脚本重新生成 |

**仅改展示名，不改任何运行标识符与逻辑**。

### 未改动项

- 运行标识符：包名 `dsh-preset-four-images-model`、preset id `four-images-model`、Loader row id `preset-four-images`、10 个名册条目 id `four-images-*`；
- 产品语义：六维结构与顺序、禁止合并纪律、判断阈值、分析框架、模型路由、`toolFilter`、四阶段流程、入口 persona 正文（除品牌串本身）；
- 其余 5 个未含品牌串的名册条目（`subject` / `pos-b` / `beh-b` / `tal-b` / `cog-b`）逐字未改。

### 注意（名册条目 id 未变）

名册条目 id 与 1.4.2 相同，故 `$DSH_HOME/subagents/` 中**同一 id 只应存在一份**：升级到 1.4.3 后执行 `node scripts/sync-roster.mjs` 会把 5 个含品牌串的条目更新为新品牌，未含品牌串的 5 个保持字节一致。

### 升级动作

改 `version` → 重跑 `checksums → pack → finalize` → `check.mjs` 与 `tools/release-verify.mjs` → `tools/freeze-manifest.fixed.mjs` → 提交。


## 十六、冻结发布记录（1.4.0 · Frozen）

> **状态**：**已冻结（Frozen）**。`artifacts/dsh-preset-four-images-model-1.4.0.tgz` 为本版唯一分发产物；**包内任何文件此后不得修改**。确需调整必须递增 `version` 并重跑"打包 → 全量校验 → 逐条目差异核验 → 更新本节"全流程。
> **权威哈希**：字节大小与 SHA256 见 `artifacts/SHA256SUMS.txt`（本节不内嵌 tgz 哈希，避免"改文档→改哈希"的循环引用）；本包根目录 `SHA256SUMS.txt` 覆盖全部 22 个包内文件，可逐文件复核。
> **历史节的说明**：第五、十二节等早期章节记录的是**当时装机副本**的状态（如"20 个文件""scripts/ 4 个"），属历史事实，未随 1.4.0 重写；**当前状态一律以本节为准**。

### 冻结范围

| 项 | 值 |
|---|---|
| 源码目录 | `dist-share/dsh-preset-four-images-model-1.4.3/` |
| 产物目录 | `dist-share/dsh-preset-four-images-model-1.4.3/artifacts/` |
| 唯一分发产物 | `artifacts/dsh-preset-four-images-model-1.4.0.tgz` |
| 冻结文件数（源文件口径） | **21 个**（= 进归档的文件数）；另有 `SHA256SUMS.txt`、`FREEZE.md` 两个自引用清单与 `artifacts/` 产物，共 26 个文件在盘 |
| 包内文件总字节 | 见 `SHA256SUMS.txt`（逐文件字节与哈希齐备） |
| 构建工具 | `scripts/pack.mjs`（Node 内置 zlib 现写 ustar 头；条目排序、mtime/uid/gid 归零） |
| 冻结清单文档 | `FREEZE.md`（归档用：产物哈希 + 全部包内文件逐一哈希 + 体检结论 + 冻结后纪律；**不进入归档**） |
| 清单生成器 | `scripts/freeze-manifest.mjs`（按磁盘实际内容重算并重写 `FREEZE.md`） |
| 校验入口 | `node scripts/check.mjs`（结构 + 契约 + 禁用词）／`node scripts/sync-roster.mjs --check`（活名册一致性） |

### 冻结前体检与回归结论

| 检查项 | 结果 |
|---|---|
| BOM | **0** 个文件带 BOM |
| CRLF | **0** 个文件含 CRLF（统一 LF） |
| 替换字符 U+FFFD | **0** 处 |
| 历史遗留词（5 类） | **0** 处命中（含注释与脚本自身） |
| 全量结构校验 | `node scripts/check.mjs` → **通过，0 失败** |
| 确定性 | 连续两次 `pack` 产出的 tgz **SHA256 完全一致**（字节级相同） |
| 文档与包内实际一致性 | `README.md` / `MANIFEST.md` 的包内容树与名册条目清单与实际文件一致；`package.json.files` 声明的路径全部存在 |

### 冻结后纪律

1. 分发只发 `artifacts/dsh-preset-four-images-model-1.4.0.tgz`，安装前用 `Get-FileHash` 核对 `artifacts/SHA256SUMS.txt`；
2. 收到本版后如需改动，**必须** `version` 递增（例：1.4.1）并重跑全流程，禁止"原地改 + 重打包同版本号"——pnpm 会判 `Already up to date`，装机副本不会更新；
3. 名册条目 id 与 1.3.5 相同：**升级后必须** `node scripts/sync-roster.mjs`，否则运行时仍读旧契约；
4. 本包与 `dsh-preset-four-images-model-1.3.5`、`dsh-preset-four-images-plus-1.0.0 / 2.0.1` **并存互不覆盖**（各自独立目录与产物目录）；
5. 下游若需按版本引用安装路径，`docs` 内的版本化路径（如 `artifacts/dsh-preset-four-images-model-1.4.0.tgz`）**可安全升级为下一版本号**，不影响产物哈希——tgz 实际打包的内容不含 `FREEZE.md`，且 `SHA256SUMS.txt`、`FREEZE.md` 两个自引用清单**均不进归档**。


## 二十、1.4.7 变更说明（仓库地址与文档修正）

### 变更动机

1.4.6 发布后复核发现：`package.json` 的 `repository` 仍指向旧仓库 `DaiGuobin-CSU/dsh-preset-four-images-model`，与本仓库实际远程 `RootAndSource/dsh-preset-four-images-model` 不一致；`MANIFEST.md` 的「本包目标」仍停留在 1.4.3 的 `dist-share/` 路径，且含两处本机 Windows 绝对路径；`scripts/freeze-manifest.mjs` 生成 FREEZE.md 时硬编码了错误的自身字节数说明。

### 变更内容

| 文件 | 改动 |
|---|---|
| `package.json` | `repository.url` 改为 `git+https://github.com/RootAndSource/dsh-preset-four-images-model.git`；`version` 升为 1.4.7；`author` 保持 `DaiGuobin-CSU <daiguobin@csu.edu.cn>` 不变 |
| `LICENSE` | 不变（版权署名仍为 DaiGuobin-CSU） |
| `MANIFEST.md` | 标题版本改为 1.4.7；「本包目标」改为本仓库根目录；两处本机绝对路径改为 `%USERPROFILE%` 形式；补本节目录结构说明 |
| `scripts/freeze-manifest.mjs` | 删除「2024 字节量级」硬编码，改为不写具体字节数；注明隐藏文件不纳入冻结清单 |
| `README.md` / `INSTALL.md` | 版本引用 1.4.6 → 1.4.7 |
| `SHA256SUMS.txt` / `FREEZE.md` / `artifacts/` | 按 1.4.7 重新生成；1.4.6 的 tgz 移入 `release-archive/1.4.6/` |

### 目录结构说明

- `artifacts/`：当前版本（1.4.7）的唯一分发产物 `dsh-preset-four-images-model-1.4.7.tgz` 及其 `SHA256SUMS.txt`；
- `release-archive/<version>/`：各历史版本的 tgz 留档，**仅存在于仓库**，不进入 tgz，也不参与 `SHA256SUMS.txt` 与 `FREEZE.md`；
- `SHA256SUMS.txt` / `FREEZE.md`：仓库根部的逐文件校验与冻结清单，不进入 tgz；
- `.gitattributes` / `.gitignore`：仓库基础设施，不进入 tgz，也不纳入逐文件清单与冻结清单。

### 未改动项

- 包名、preset id、Loader row id、10 个名册条目 id 全部未改；
- 六维结构、四阶段流程、模型路由、`toolFilter` 与 persona 语义未改；
- `package.json` 的 `author` 与 `LICENSE` 的版权署名保持不变。


## 二十一、1.4.8 变更说明（npm 发布与安装文档）

### 变更动机

1.4.7 已发布到 npm（`dsh-preset-four-images-model@1.4.7`），但 README/INSTALL 仍只写“从 Releases 下载 tgz”，没有说明可以直接按 npm 包名安装。为了让使用者用一条 `plugin_manager({ action: "install_bundle", target: "dsh-preset-four-images-model" })` 完成安装，1.4.8 补充 npm 安装说明并升版重建。

### 变更内容

| 文件 | 改动 |
|---|---|
| `package.json` | `version` 升为 1.4.8 |
| `README.md` | 增加“按 npm 包名安装”说明（第 2 步方式 A），tgz 方式保留为方式 B；版本引用改为 1.4.8 |
| `INSTALL.md` | 方式 A 增加 npm 包名安装命令，本地目录与 tgz 作为备选；版本引用改为 1.4.8 |
| `MANIFEST.md` | 标题版本改为 1.4.8；版本推进补 1.4.8；补本节 |
| `SHA256SUMS.txt` / `FREEZE.md` / `artifacts/` | 按 1.4.8 重新生成；1.4.7 的 tgz 移入 `release-archive/1.4.7/` |

### 未改动项

- 包名、preset id、Loader row id、10 个名册条目 id 全部未改；
- 六维结构、四阶段流程、模型路由、`toolFilter` 与 persona 语义未改；
- `package.json` 的 `author` 与 `LICENSE` 的版权署名保持不变；
- npm 包名与 DSH bundle 结构不变。
