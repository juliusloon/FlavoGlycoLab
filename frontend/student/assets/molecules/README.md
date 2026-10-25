# 异槲皮苷结构可视化资产

TASK-018，2026-10-21。由所有者“异槲皮苷 SMILES 或实时 3Dmol”的直接指令接入。用于认识结构与糖连接；`pending_teacher_review`，不是教师审定、实验观测或活性构象。

## 来源与许可

- 结构采用 [ChEBI:68352](https://www.ebi.ac.uk/chebi/CHEBI:68352) 的 `default_structure.smiles`；[API](https://www.ebi.ac.uk/chebi/backend/api/public/compound/68352/)。
- ChEBI 数据依 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 提供；许可声明见 [ChEBI About](https://www.ebi.ac.uk/chebi/about) 页脚。本资产对来源表示进行了计算几何、绘图和字段整理，署名 ChEBI / EMBL-EBI；无其背书。
- [PubChem CID 5280804](https://pubchem.ncbi.nlm.nih.gov/compound/5280804) 仅作身份交叉检查，SMILES经RDKit标准化后与ChEBI均为 `OVSQVDMCBVZWGM-QSOFNFLRSA-N`；分子式一致。响应的字节指纹记录在JSON，原响应保留于本地审计目录。
- 精确目标为 quercetin 3-O-β-D-glucopyranoside。泛名称 `isoquercitrin` 曾返回不同CID，不能以同义词首条替换这里的身份。
- 本地渲染库为 **3Dmol.js 2.5.5，BSD-3-Clause**，并非项目原创代码；完整上游许可证位于 `../../vendor/3dmol/LICENSE`，包括其继承组件声明。

## 文件与生成

`isoquercitrin.json` 保存来源SMILES、SDF、来源响应SHA、许可和计算方法；原子索引按SDF的0基顺序。`sugar`包括糖基及连接氧，`linkage`是苷元3位碳—氧—糖端碳三个原子，只做结构高亮。

SDF由本机RDKit对来源SMILES执行 `AddHs → ETKDGv3(randomSeed=20261021) → MMFF94(maxIters=1000) → CanonicalizeConformer → RemoveHs`。优化已收敛；SDF重读的标准InChIKey与来源一致。33个重原子、36条键；省略显式氢仅为显示清晰。**计算构象不代表溶液、晶体或酶结合态实测构象；能量优化不是实验验证。**

`isoquercitrin-2d.svg` 由同一来源SMILES经RDKit二维坐标及绘图生成，保留立体键。三维不可用时可显示本图与文本SMILES，无网络依赖。

生成脚本、原始API响应、库包校验与结构检查保留在 `temp/task-018/molecule/`，不是运行依赖。资产及库SHA见同目录 `verification.json`；浏览器运行仅取当前项目 `frontend/student/` 内的文件。

## 集成

`mountMolecule(element, {reducedMotion})` 在已有尺寸的元素中挂载，返回 `destroy()`、`reset()`、`setStyle('ball-stick'|'stick'|'sphere'|'2d')`、`highlight('sugar'|'aglycone'|'linkage'|null)`；异步返回的 `data` 包含来源与SMILES。页面切换必须调用 `destroy()` 释放GPU资源。

默认不自动旋转；鼠标拖动/滚轮及方向键/加减键/Home可以旋转、缩放和复位。屏幕阅读器保留结构描述。主体界面应在来源面板明确显示“计算构象 · 待教师审定”，并保留本来源/许可入口。

## TASK-052：五类身份切换（2026-10-25）

`mountMolecule(element, {moleculeId, reducedMotion})`新增固定白名单，默认仍为isoquercitrin。任务02按钮顺序为isoquercitrin、rutin、quercetin、emiq-example、spiraeoside；每次切换回收前一viewer，异步旧挂载不得覆盖新选择，二维降级与来源/SMILES均跟随当前身份。计算结构均pending_teacher_review，不是实验构象。

| 资产 | 来源与定位 | 结构校验 |
| --- | --- | --- |
| quercetin | [ChEBI:16243](https://www.ebi.ac.uk/chebi/CHEBI:16243)，API default_structure.smiles | C15H10O7；22重原子；REFJWTPEDVJJIY-UHFFFAOYSA-N |
| rutin | [ChEBI:28527](https://www.ebi.ac.uk/chebi/CHEBI:28527)，同字段 | C27H30O16；43重原子；IKGXIBQEEMLURG-NVPNHPEKSA-N |
| spiraeoside | [ChEBI:75839](https://www.ebi.ac.uk/chebi/CHEBI:75839)，同字段 | C21H20O12；33重原子；OIUBYZLTFSLSBY-HMGRVEAOSA-N |
| emiq-example | [Makino et al. 2009](https://doi.org/10.1248/bpb.32.2034)，p.2035，Fig.1化合物3（Q3M）、4（EMIQ）及Chemicals段 | 手工编码一个α-(1→4)葡萄糖延伸代表Q3M；C27H30O17；44重原子；UTECWQIXBMWRRR-XDVLAUTQSA-N |

三个新增ChEBI结构按CC BY 4.0署名ChEBI / EMBL-EBI，原响应SHA各自保存于JSON。EMIQ代表的结构事实根据图1手工编码：在原异槲皮苷葡萄糖O4接入一个α-D葡萄糖基，保留β连接及其余立体中心；JSON登记论文PDF指纹、定位、原异槲皮苷资产指纹与推导方法。**未复制/分发论文原文或图片**，不声称第三方论文属于CC BY 4.0。手工编码的Q3M另经PubChem精确InChIKey查询命中[CID10304622](https://pubchem.ncbi.nlm.nih.gov/compound/10304622)，分子式与立体SMILES经RDKit标准化均相符；交叉响应SHA保存在emiq-example.json。EMIQ为混合物，当前代表不提供平均分子式、组分比例、纯度或完整产品结构。

四项新资产使用RDKit 2026.09.1，ETKDGv3种子20261025、MMFF94最多2000步优化，全部收敛；SDF重读InChIKey与生成前一致。原有异槲皮苷JSON/SVG字节保持不变。来源响应、手工编码生成脚本、论文定位图及核验保存在本轮本地QA目录，不是运行依赖。运行只依赖本目录JSON/SVG与既有本地3Dmol库。
