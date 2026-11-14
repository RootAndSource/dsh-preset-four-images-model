# 冻结清单 · dsh-preset-four-images-model 1.5.0

> **状态：FROZEN（冻结发布态）**。本清单由 `scripts/freeze-manifest.mjs` 依据磁盘实际内容与真实执行结果生成；
> 冻结生效后**包内任何文件不得修改**。确需调整必须递增 `version` 并重跑打包与全量校验流程。

## 一、分发产物（唯一）

| 项 | 值 |
|---|---|
| 文件名 | `dsh-preset-four-images-model-1.5.0.tgz` |
| 字节大小 | 823233 |
| SHA-256 | `3C2ED5FB0DF87CD2E8CCF2573CE1D56641EAD9FBA7E64E29084D1D54323049B6` |
| 所在目录 | `<本包>/artifacts/` |
| 产物清单 | `artifacts/SHA256SUMS.txt`（与本表同值：已核对一致） |

核对命令（PowerShell，逐字可复制）：

```powershell
Get-FileHash "<本包>\artifacts\dsh-preset-four-images-model-1.5.0.tgz" -Algorithm SHA256
```

## 二、冻结文件清单（源文件口径：不含 artifacts/ 与两个自引用清单）

合计 **30 个文件 / 1031226 字节**（本清单 FREEZE.md 自身不参与校验，逐次生成会随内容变化）。

| # | 文件 | 字节 | SHA-256 |
|---|---|---|---|
| 1 | `INSTALL.md` | 11258 | `D05337EFBF4EEABD072ED6CF6696166BD11DA7C98FFF6087C039EAFCDD0A34AD` |
| 2 | `LICENSE` | 1070 | `60AD16BFBEDC503E7EEF6362ADBF04C42F1DECBACA4249DC4FFC8187062EAF3C` |
| 3 | `MANIFEST.md` | 72481 | `8D14060319CE57FD98A05EAAF2B96ABAA500AA5DFF2D0C62739FCEC8E1AFF81C` |
| 4 | `README.md` | 10777 | `BBBFA3DEC83684BF03461F9FD6796500F44DA6C8CF7597057BF613D829EF06CA` |
| 5 | `assets/images/four-images-model-2026.png` | 538261 | `58062B2204A548F73D5B931FB91E3F9EB196EB18A1D20BF62763D9273E3BCDF9` |
| 6 | `client.js` | 29368 | `5C923E4BAE9CAC100D1F89E09EA098946682BCC33B4C118BC5EF1A519A0BFED7` |
| 7 | `cordis.patch.template.yml` | 3362 | `77F7A08ABBBB8FF708448D700F64BA84DEA96042DC4D0C2BC526CA13AEAAF7F6` |
| 8 | `cordis.patch.yml` | 58245 | `00E37027FF4A28B794B142AC6CE2C76551297109433CB1D1DE6291EDE4454DD9` |
| 9 | `icon.png` | 212231 | `80B71165854D4F04563FFFAB04F22E6EE22FE755CF5CAFB0F89C09872924F5A2` |
| 10 | `index.js` | 614 | `3889EE1A1AE654781A69D2C055199427A22C31D367A016A19D83BC762D596823` |
| 11 | `locale/en.json` | 258 | `86E41AEA1EAA5A5D8BB1A9F01B734D2751FF743CD59AD37C4642CE65C1630B38` |
| 12 | `locale/zh.json` | 264 | `49437ACA4072B08F5431D46E265C127D34ACFC22199B12D05F585DCC838F8DE7` |
| 13 | `package.json` | 1740 | `BEA46BDCFFDAA3AA46799BCB33A0F7B0FB81AE52B6777A78AEC584F139DA3E22` |
| 14 | `prompts/parent.md` | 12417 | `76595C6FB3F1B54D4FFF429A1310F6E159FC2FB92970537927863A77CA7190E4` |
| 15 | `prompts/roles/four-images-beh-a.md` | 3195 | `87A33935D245FB4E9BF02DF2426E12ACAD308F9349645B636627EAD99F39247E` |
| 16 | `prompts/roles/four-images-beh-b.md` | 2500 | `C9E7E1342507FFCDBB70451603B24EA100667086A2FA6EEEAACE8671BB9CC17B` |
| 17 | `prompts/roles/four-images-cog-a.md` | 2946 | `249F0905EE9F113446FB2B4ECB517589DC40D3FB7E0C24F4C1984B12152642A9` |
| 18 | `prompts/roles/four-images-cog-b.md` | 2743 | `44FFC25A4DC39CAD28F5A338A2187CA28627EA20DA616E54756798D1CEA40CCE` |
| 19 | `prompts/roles/four-images-environment.md` | 2709 | `C8A1670F4F3B1F8E4968505406C48787027595B3E819ACEA3542867BEA0BCC03` |
| 20 | `prompts/roles/four-images-pos-a.md` | 3090 | `BEF59950E25F3A4A39BFCD164C939C49B7BCB2F66B5317918BBA85CD65BA3E4B` |
| 21 | `prompts/roles/four-images-pos-b.md` | 2421 | `E6C7DCB5D58A99C8D32F6F8F0F06E0D6CCE4EA73CB53A361B0A70CBA2E94EB04` |
| 22 | `prompts/roles/four-images-subject.md` | 7628 | `5BB18ACB47A4193ED7A5AD48A69F6704E822961777FD75F52F14739297D45D72` |
| 23 | `prompts/roles/four-images-tal-a.md` | 2698 | `7F0BE9FC8E80C6EBA0E68EAC4899E5E2C740DB51F646481B3A6FC5DE44D383DE` |
| 24 | `prompts/roles/four-images-tal-b.md` | 2650 | `B67A76EA79F863F48890F9EFB34DAF4AF8AC589005483F7195842CA7C3FBFB24` |
| 25 | `scripts/check.mjs` | 25922 | `EAFA852B23981470DC5EFB7A81C37822F454A614D0C82CD7D613594AC213E855` |
| 26 | `scripts/checksums.mjs` | 2729 | `2B28DB96A278BA9371FBDEFC249C1D00335D4EA9FA3C06DFBF072864F09B9AC4` |
| 27 | `scripts/compose.mjs` | 3306 | `1D1AC99516C7EFF580B96B9E5AC54C5237FE33B7C45DF188223FF853EB29F872` |
| 28 | `scripts/finalize.mjs` | 1969 | `D926FAD524A6155A7DB336F2115BDFDC90D963CF7C529D9B24D7C79632AC19FB` |
| 29 | `scripts/freeze-manifest.mjs` | 7928 | `F890B7857045D9EC7F3A0E2469966925B7E155119471EBAF801B039F057D0CF7` |
| 30 | `scripts/pack.mjs` | 4446 | `0932D09A6961B882A4B110312354E70635DB52EC625AA502A1B439CAA0C774D8` |

> 上表与包根 `SHA256SUMS.txt` 同源；`SHA256SUMS.txt` 与 `FREEZE.md` 均不参与 tgz 归档（避免哈希自引用）。

## 三、校验与确定性（本次实测）

| 检查项 | 结果 |
|---|---|
| 全量结构校验 | `node scripts/check.mjs` → 通过（通过 228 项 / 失败 0 项，退出码 0） |
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
