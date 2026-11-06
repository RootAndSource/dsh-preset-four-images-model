# 冻结清单 · dsh-preset-four-images-model 1.4.10

> **状态：FROZEN（冻结发布态）**。本清单由 `scripts/freeze-manifest.mjs` 依据磁盘实际内容与真实执行结果生成；
> 冻结生效后**包内任何文件不得修改**。确需调整必须递增 `version` 并重跑打包与全量校验流程。

## 一、分发产物（唯一）

| 项 | 值 |
|---|---|
| 文件名 | `dsh-preset-four-images-model-1.4.10.tgz` |
| 字节大小 | 596091 |
| SHA-256 | `5344A517B42E2DFE99C381689EE599585DE2BD32B6F1A1B5E5B6C560C446D803` |
| 所在目录 | `<本包>/artifacts/` |
| 产物清单 | `artifacts/SHA256SUMS.txt`（与本表同值：已核对一致） |

核对命令（PowerShell，逐字可复制）：

```powershell
Get-FileHash "<本包>\artifacts\dsh-preset-four-images-model-1.4.10.tgz" -Algorithm SHA256
```

## 二、冻结文件清单（源文件口径：不含 artifacts/ 与两个自引用清单）

合计 **25 个文件 / 775866 字节**（本清单 FREEZE.md 自身不参与校验，逐次生成会随内容变化）。

| # | 文件 | 字节 | SHA-256 |
|---|---|---|---|
| 1 | `INSTALL.md` | 9092 | `3CFCF834AC5011C7F43727359D3D95851651D5B580A01B0C76B9952BDD2647D3` |
| 2 | `LICENSE` | 1070 | `60AD16BFBEDC503E7EEF6362ADBF04C42F1DECBACA4249DC4FFC8187062EAF3C` |
| 3 | `MANIFEST.md` | 68262 | `994FD1BC4748EFF7FD1BAB1FF536E70DB3A2E0C73F967165E77C3167ABEAA7FD` |
| 4 | `README.md` | 9001 | `A6D53E44340FEBA0ACFD1F6C59B2A942D79E2AA379682817889B3E6771052275` |
| 5 | `assets/images/four-images-model-2026.png` | 538261 | `58062B2204A548F73D5B931FB91E3F9EB196EB18A1D20BF62763D9273E3BCDF9` |
| 6 | `cordis.patch.template.yml` | 3068 | `794689648C9A59BA08DD559929A750DFE3E64B8F2AA1832256541E01988D0EBE` |
| 7 | `cordis.patch.yml` | 57951 | `8DE5637FF492131979C28F48EE01D23515285C0638EDD3EA71E15A4AED41F1D4` |
| 8 | `package.json` | 1304 | `15D9723473D92354DCCC05FF0436117D28F865B4B988671D708644B992ED01E7` |
| 9 | `prompts/parent.md` | 12417 | `76595C6FB3F1B54D4FFF429A1310F6E159FC2FB92970537927863A77CA7190E4` |
| 10 | `prompts/roles/four-images-beh-a.md` | 3195 | `87A33935D245FB4E9BF02DF2426E12ACAD308F9349645B636627EAD99F39247E` |
| 11 | `prompts/roles/four-images-beh-b.md` | 2500 | `C9E7E1342507FFCDBB70451603B24EA100667086A2FA6EEEAACE8671BB9CC17B` |
| 12 | `prompts/roles/four-images-cog-a.md` | 2946 | `249F0905EE9F113446FB2B4ECB517589DC40D3FB7E0C24F4C1984B12152642A9` |
| 13 | `prompts/roles/four-images-cog-b.md` | 2743 | `44FFC25A4DC39CAD28F5A338A2187CA28627EA20DA616E54756798D1CEA40CCE` |
| 14 | `prompts/roles/four-images-environment.md` | 2709 | `C8A1670F4F3B1F8E4968505406C48787027595B3E819ACEA3542867BEA0BCC03` |
| 15 | `prompts/roles/four-images-pos-a.md` | 3090 | `BEF59950E25F3A4A39BFCD164C939C49B7BCB2F66B5317918BBA85CD65BA3E4B` |
| 16 | `prompts/roles/four-images-pos-b.md` | 2421 | `E6C7DCB5D58A99C8D32F6F8F0F06E0D6CCE4EA73CB53A361B0A70CBA2E94EB04` |
| 17 | `prompts/roles/four-images-subject.md` | 7628 | `5BB18ACB47A4193ED7A5AD48A69F6704E822961777FD75F52F14739297D45D72` |
| 18 | `prompts/roles/four-images-tal-a.md` | 2698 | `7F0BE9FC8E80C6EBA0E68EAC4899E5E2C740DB51F646481B3A6FC5DE44D383DE` |
| 19 | `prompts/roles/four-images-tal-b.md` | 2650 | `B67A76EA79F863F48890F9EFB34DAF4AF8AC589005483F7195842CA7C3FBFB24` |
| 20 | `scripts/check.mjs` | 22529 | `A427BDFEF047C70B99F103D2519FF8B032A9EC396BB35DECF19D801406E9CDFB` |
| 21 | `scripts/checksums.mjs` | 2729 | `2B28DB96A278BA9371FBDEFC249C1D00335D4EA9FA3C06DFBF072864F09B9AC4` |
| 22 | `scripts/compose.mjs` | 3306 | `1D1AC99516C7EFF580B96B9E5AC54C5237FE33B7C45DF188223FF853EB29F872` |
| 23 | `scripts/finalize.mjs` | 1969 | `D926FAD524A6155A7DB336F2115BDFDC90D963CF7C529D9B24D7C79632AC19FB` |
| 24 | `scripts/freeze-manifest.mjs` | 7928 | `F890B7857045D9EC7F3A0E2469966925B7E155119471EBAF801B039F057D0CF7` |
| 25 | `scripts/pack.mjs` | 4399 | `96D59669E8C5E3B23F3482D2143810116E92845F5E7583E6EB7E370A3D48CDE4` |

> 上表与包根 `SHA256SUMS.txt` 同源；`SHA256SUMS.txt` 与 `FREEZE.md` 均不参与 tgz 归档（避免哈希自引用）。

## 三、校验与确定性（本次实测）

| 检查项 | 结果 |
|---|---|
| 全量结构校验 | `node scripts/check.mjs` → 通过（通过 190 项 / 失败 0 项，退出码 0） |
| 打包确定性 | 内存连续两次构建 → SHA256 与字节数一致 |
| 产物与重构建一致 | artifacts/ 内 tgz 与内存重构建逐字节一致 |
| BOM 文件数 | 0 |
| CRLF 文件数（要求统一 LF） | 0 |
| 替换字符 U+FFFD 文件数 | 0 |
| 历史遗留词命中文件数（5 类） | 0 |

## 四、冻结后纪律

1. 对外分发只用 `artifacts/` 下的 tgz，安装前用 `Get-FileHash` 核对上表 SHA-256；
2. 收到本版后如需改动：**递增 `version`** → `compose` → 重跑 `checksums → pack → finalize` → 重跑 `check.mjs` → 更新本清单（`node scripts/freeze-manifest.mjs`）；
3. 禁止"同版本号原地改内容再打包"：pnpm 会判 `Already up to date`，装机副本不会更新；
4. 本版本不再依赖第三方名册库；升级后**不需要**也不应再执行任何名册同步脚本。
