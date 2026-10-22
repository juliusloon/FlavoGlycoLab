# 图1：三条文献路线示意图

版本 v1，2026-10-22，TASK-024。依据 ZYT 交件 `temp/261022-handout/route_diagram_text_v1_20261022.md`（4,891字节，SHA-256 `89bd34bace2388ff4c6c35d1c0f528c94c7a74119b7807510b5b46219f103fbf`）制作。交件明确“下一接收人：L（制图）”。

## 文件

| 文件 | 用途 | SHA-256 |
| --- | --- | --- |
| `route_map_v1.svg` | 唯一矢量源；案例页直接引用 | `bea591920d98711df357fd3be96b91704295e9d2286507804c10098a9674c24f` |
| `route_map_v1.png` | 本地 Chromium 1800×1240、2× 渲染预览；视频/幻灯片素材候选 | `c539af231b12ca3f484ab0d9f7e553637748bfcd3998cd046c2c45f7492b9713` |

PNG 由 SVG 渲染，不是第二套内容真值；修改时以 SVG 为准并同步重渲染。

## 内容与边界

- 三条路线共用右侧单一产物节点：异槲皮苷（C21H20O12，相对分子质量 464.4，CID 5280804）。
- R1：槲皮素 → AtUGT78D2 + UDP-Glc → 异槲皮苷；虚线旁路为 GmSUS 再生 UDP-Glc（UDP + 蔗糖 ⇌ UDP-Glc + 果糖）。
- R2：芦丁 → α-L-鼠李糖苷酶选择性剪糖 → 异槲皮苷；支箭头释放 L-鼠李糖。
- R3：外加槲皮素 → 工程化 B. subtilis 168 胞内 UGT78D2 糖基化 → 释放至培养基；虚线括注六轮改造（底物降解阻断、产物水解阻断、Δpgi 碳流重定向）。
- 所有产率、转化率、浓度、RCmax 均为原文报告值，图中逐条标“原文报告/非本次观测”；不可跨路线比较或换算（S3）。
- R1/R2 示意图为原创重绘，不复制 Springer 原图；R3 依据 Niu 2024（CC BY 4.0，已署名）。
- 教学状态：待教师审定。本图不生成观测、产率或成绩。

## PubChem 核验（2026-10-22）

用 PubChem PUG REST 按 CID 核对交件的分子式/分子量与 IsomericSMILES：

| CID | 名称 | 分子式 | 分子量 | 与交件SMILES |
| --- | --- | --- | --- | --- |
| 5280343 | quercetin | C15H10O7 | 302.23 | 逐字一致 |
| 5280804 | isoquercitrin | C21H20O12 | 464.4 | 逐字一致 |
| 5280805 | rutin | C27H30O16 | 610.5 | 书写形式不同；CID/分子式一致，图内不印SMILES |
| 8629 | UDP-glucose | C15H24N2O17P2 | 566.30 | 逐字一致 |
| 6031 | UDP | C9H14N2O12P2 | 404.16 | 逐字一致 |
| 5988 | sucrose | C12H22O11 | 342.30 | 逐字一致 |
| 5984 | D-(-)-fructose | C6H12O6 | 180.16 | 逐字一致 |
| 439730 | beta-L-rhamnose | C6H12O5 | 164.16 | 逐字一致；图中按“L-鼠李糖（游离糖）”表述 |

交件中芦丁 SMILES 与 PubChem 当前 IsomericSMILES 的书写形式不同，但 CID 5280805 与分子式 C27H30O16 双源一致；为避免把书写差异误当结构差异，图内只标 CID/分子式，不印 SMILES。若后续需要结构级审核，应以 CID 与结构图另行人工核对。

## 复现渲染

    ~/.nvm/versions/node/v22.23.1/bin/node temp/task-024/render/render-svg.mjs

脚本用本地 Playwright/Chromium 打开 SVG 并截图；不访问外部网络。PNG 不是申报定版图，教师审定与 Springer 授权状态不因渲染改变。
