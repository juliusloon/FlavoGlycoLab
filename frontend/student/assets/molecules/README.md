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
