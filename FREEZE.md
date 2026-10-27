# 冻结清单 · dsh-preset-four-images-model 1.4.7

> **状态：FROZEN（冻结发布态）**。本清单由 `scripts/freeze-manifest.mjs` 依据磁盘实际内容生成；
> 冻结生效后**包内任何文件不得修改**。确需调整必须递增 `version` 并重跑打包与全量校验流程。

## 一、分发产物（唯一）

| 项 | 值 |
|---|---|
| 文件名 | `dsh-preset-four-images-model-1.4.7.tgz` |
| 字节大小 | 579431 |
| SHA-256 | `4A0C6325FEBAD212BC82743C368131578C6D83DD43DE1ADABA717805093BAE83` |
| 所在目录 | `<本包>/artifacts/` |
| 产物清单 | `artifacts/SHA256SUMS.txt`（与本表同值：已核对一致） |

核对命令（PowerShell，逐字可复制）：

```powershell
Get-FileHash "<本包>\artifacts\dsh-preset-four-images-model-1.4.7.tgz" -Algorithm SHA256
```

## 二、冻结文件清单（源文件口径：不含 artifacts/ 与两个自引用清单）

合计 **23 个文件 / 713323 字节**（本清单 FREEZE.md 自身不参与校验，逐次生成会随内容变化）。

| # | 文件 | 字节 | SHA-256 |
|---|---|---|---|
| 1 | `INSTALL.md` | 8705 | `095CE47D17F01C89CF73DA3112543ABE99BF14487627A65192D930C4D94EBDC4` |
| 2 | `LICENSE` | 1070 | `60AD16BFBEDC503E7EEF6362ADBF04C42F1DECBACA4249DC4FFC8187062EAF3C` |
| 3 | `MANIFEST.md` | 59048 | `B4C10A06E9D98B978697248F18E283946C6DA8F0B1753CC722011C83DC291877` |
| 4 | `README.md` | 7676 | `A072FEC19F26902687B88FA6C36824B96173A73E81C949058E28B82804C68351` |
| 5 | `assets/images/four-images-model-2026.png` | 538261 | `58062B2204A548F73D5B931FB91E3F9EB196EB18A1D20BF62763D9273E3BCDF9` |
| 6 | `cordis.patch.yml` | 14808 | `CCAC4F508CEFE1BE45F7FABCE767D7F7414C428FE9B37EE57EB6838D6E845FF2` |
| 7 | `package.json` | 1237 | `CB27FA35E62B2B40E1E372ABDB790AE05D5A7770586F2BABDC9DC53CEB178E61` |
| 8 | `scripts/check.mjs` | 22218 | `DF471578945242A6DBFC7C7A3F389DFD3AFE2F40D7BF332D391BFDDC71B79544` |
| 9 | `scripts/checksums.mjs` | 2729 | `2B28DB96A278BA9371FBDEFC249C1D00335D4EA9FA3C06DFBF072864F09B9AC4` |
| 10 | `scripts/finalize.mjs` | 1970 | `3CA263ACAB515D88D6B0A77AF3BAAD8AB5D6D257941BAF546C55C0397761BE14` |
| 11 | `scripts/freeze-manifest.mjs` | 6046 | `DCED9E3ABAC5932CF3BA098F15C94F8829A102576409CFFC4369E49388D1FFF0` |
| 12 | `scripts/pack.mjs` | 3506 | `909DF1EB24F9C63F6AEB337DE55AA010C68A23934FA12FE429501213AAA8294B` |
| 13 | `scripts/sync-roster.mjs` | 6977 | `D2E76CE0878BE892F1657D2B198B2E74F325DB309E8B1CA6393CE777177109EF` |
| 14 | `subagents/four-images-beh-a.yaml` | 3994 | `D4570D689C03F566CA98689020CE3EF7579D32F36B5EC16150C50CECBB715C3F` |
| 15 | `subagents/four-images-beh-b.yaml` | 2962 | `F4868E1E39297BF009D651B3E4EC20473AA7E7A116E9B050FD4913D0DDBB9BDC` |
| 16 | `subagents/four-images-cog-a.yaml` | 3738 | `66D306656C0B11B0B40AC85F8C5ECD6BE7A360FB5CA463781426E053B3D60F7F` |
| 17 | `subagents/four-images-cog-b.yaml` | 3283 | `6F9ADFF263B615E59F93A1AB28E3CF35D9FF9B42ECED64372E7B1C1FAD998E9F` |
| 18 | `subagents/four-images-environment.yaml` | 3236 | `E99B784EBA823C9B7C1BF79A4502F3C17F1170660875B38DA0BAF481D84CE98A` |
| 19 | `subagents/four-images-pos-a.yaml` | 3911 | `9E85782324835C026B06879914B8A215F40ACA065448A7ED169AE2AB6BA5CF5F` |
| 20 | `subagents/four-images-pos-b.yaml` | 2876 | `0DE8D65262122B604FC38A7EC10A907014114777F92A0BD4ED4D117764E2B373` |
| 21 | `subagents/four-images-subject.yaml` | 8376 | `03CDF05B3AFC2C8342D59E2DA90BCA3FC79B3B43A269143CC6969417BBCC8457` |
| 22 | `subagents/four-images-tal-a.yaml` | 3503 | `392AA15014757B2EBD71A2F4D091DBE0B003CE1F83359EEE5B053F73E8F0DB12` |
| 23 | `subagents/four-images-tal-b.yaml` | 3193 | `33700F276C0823BC8763E1F4E2C2AA4045B43E6BF1C68CC196BE76A21DE5CDB3` |

> 上表与包根 `SHA256SUMS.txt` 同源；`SHA256SUMS.txt` 与 `FREEZE.md` 均不参与 tgz 归档（避免哈希自引用）。

## 三、冻结前体检与回归结论

| 检查项 | 结果 |
|---|---|
| BOM 文件数 | 0 |
| CRLF 文件数（要求统一 LF） | 0 |
| 替换字符 U+FFFD 文件数 | 0 |
| 历史遗留词命中文件数（5 类） | 0 |
| 全量结构校验 | `node scripts/check.mjs` → 通过，0 失败 |
| 打包确定性 | 连续 3 次 `node scripts/pack.mjs` → 同一 SHA-256 与字节数 |
| 归档 mtime/uid/gid | 归档内 mtime = 0、uid = 0、gid = 0（与构建时间、机器无关） |
| 归档条目顺序 | 按路径排序（打包顺序确定） |

## 四、冻结后纪律

1. 对外分发只用 `artifacts/` 下的 tgz，安装前用 `Get-FileHash` 核对上表 SHA-256；
2. 收到本版后如需改动：**递增 `version`** → 重跑 `checksums → pack → finalize` → 重跑 `check.mjs` → 更新本清单（`node scripts/freeze-manifest.mjs`）；
3. 禁止"同版本号原地改内容再打包"：pnpm 会判 `Already up to date`，装机副本不会更新；
4. 名册条目 id 与 1.3.5 相同：升级后**必须**执行 `node scripts/sync-roster.mjs`，否则运行时仍读旧契约。
