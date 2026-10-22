# 案例证据表：ZYT范围代理交接 v1

编制日期：2026-10-21；任务：TASK-017；执行者：Cano / zyt_handoff subagent。用途：补齐10-20阶段成果并形成供LJX接入的T-Z1候选工作稿。不是ZYT本人交稿，不登记成员签收或教师审定。`decision_origin=agent_delegated`，`human_reviewed=false`，`teaching_case_review=pending_teacher_review`。

唯一案例准入真值仍为[data/registries/case_admission.csv](../../../data/registries/case_admission.csv)，本文是核对与接入说明，不回写或替代登记。交接状态仅在[H02](handoff_acceptance.md)维护。

## 1. 五类分子身份卡

下列卡片用于名称、糖连接与证据辨析。四种单一分子的PubChem/ChEBI响应已于本轮只读核对：分子式一致4/4、两来源SMILES经现有RDKit转为标准InChIKey后一致4/4；这只是机器身份交叉检查，不是教师批准。第三方SMILES、分子式和分子量原值保存在本地`temp/task-017/zyt-verification.json`及响应文件，九项只读来源的source_id/URL/定位/SHA/质量与许可状态见`temp/task-017/zyt-source-checks.json`。按本TASK不新增结构/数值公开载荷的边界，公开卡给出原源定位和字段状态，不向页面提供换算常数。

| 卡片 | 中英文名与稳定来源 | 糖连接/学生可核对的差别 | SMILES / 分子式 / 分子量核对状态 | 对主案例的使用边界 |
| --- | --- | --- | --- | --- |
| M1 | 异槲皮苷；明确采用 quercetin 3-O-β-D-glucopyranoside / isoquercetin；[PubChem CID 5280804](https://pubchem.ncbi.nlm.nih.gov/compound/5280804)、[ChEBI 68352](https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:68352) | 槲皮素骨架3-O位连接β-D-葡萄吡喃糖基；需同时检查位点、糖环和立体信息 | SMILES结构与分子式双源机器一致；分子量两库显示精度不同，原值均保留，不要求文本相等 | 与Pei p.1、Niu p.1–2的目标名称一致；教师身份决议仍待补 |
| M2 | 芦丁 / rutin；[PubChem CID 5280805](https://pubchem.ncbi.nlm.nih.gov/compound/5280805)、[ChEBI 28527](https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:28527) | 槲皮素3-O芸香糖苷；相对M1多末端鼠李糖，R2讨论选择性去鼠李糖 | SMILES结构与分子式双源机器一致；分子量显示精度差异保留；不向产品引入质量常数 | 不能把“去掉所有糖”当作制备M1；Zhang p.1–2的路线定位支持该辨析 |
| M3 | 槲皮素 / quercetin；[PubChem CID 5280343](https://pubchem.ncbi.nlm.nih.gov/compound/5280343)、[ChEBI 16243](https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:16243) | 不带糖基的苷元；与M1不同，R1/R3以其为底物 | SMILES结构与分子式双源机器一致；质量原值存在末位/精度差异，记录后待统一换算口径 | 苷元浓度下降不自动证明M1生成；不据名称导出样品产率 |
| M4 | 酶改性异槲皮苷 / enzymatically modified isoquercitrin（EMIQ/AGIQ） | 含异槲皮苷及其α-葡糖基衍生物的混合组成，不能按一个分子处理 | 单一SMILES、单一分子式、固定分子量：**不适用**，不是缺值填零；批次组成/质控资料缺失，不能用某个平均量替代确定分子 | [2022综述 DOI 10.3390/ijms232314784](https://doi.org/10.3390/ijms232314784) §2.1/§8；只支持混合物辨析，不引入其工艺数值/药效结论 |
| M5 | 代表位点异构体：槲皮素4′-O-β-D-葡萄吡喃糖苷 / spiraeoside；[PubChem CID 5320844](https://pubchem.ncbi.nlm.nih.gov/compound/5320844)、[ChEBI 75839](https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:75839) | 葡萄糖基连接在4′-O而非3-O；可作“相同组成不能判断连接位置”的对照 | SMILES结构与分子式双源机器一致；与M1分子式相同而标准InChIKey不同；质量显示精度差异保留 | 仅用连接位点的原创文字比较；本轮未新增结构图片、该异构体制备反应或教师判分 |

**名称解析实际歧义。** PubChem本轮对`isoquercitrin`名称返回CID 5484006，对`isoquercetin`返回CID 5280804，二者返回不同InChIKey。不能把名称搜索首条自动当作目标。本表采用三篇论文明确的3-O-β-D-glucopyranoside定义，再以ChEBI 68352和CID 5280804交叉核对；该标识与现有历史目标匹配一致。本轮没有修改任何原始分子、来源或准入记录，也未替数据库裁定同义词。名称请求/失败路径与全部原响应留在本地检查目录。

**给LJX的候选反馈。** 让学生选择连接位置与糖类型并说明依据；错选时反馈“先比较苷元、糖种类、连接位置和立体信息”。M1/M5用于解释仅看分子式/质量不足；M4用于解释混合物不能被一条SMILES概括。反馈是证据辨析练习，不调用尚未实现的科学结构验证器，不给正式成绩。

## 2. 21条历史命中：来源逐条对齐

本节只使用已公开准入表的元数据；不恢复11项`withheld_unlicensed`数值，保留10项`missing`。全部21项原`reference_doi_if_recorded`为空，不能由文件名或结构命中补成某篇论文。现有来源登记不含`source_id`列，本交接采用`sha256:<完整原SHA>`作为**技术source_id**，L1—L5只是下表的排版别名，不新建科学来源、不改注册表。

### 来源索引

| 别名 | source_id（由既存SHA定义）/原件SHA | 原相对路径 | 原登记质量/许可 |
| --- | --- | --- | --- |
| L1 | `sha256:366e9981b4f8dd6b7a8c4563646c553b40fe8cfe43d150589a48bdc1f2396cc9` | `data/raw/legacy/import_raw/5-O-glycoside quercetin kaempferol synthesis gold_20260910_2200.rdf` | historical_claims_only_not_revalidated / source_inherited_not_cleared_for_redistribution；不再分发 |
| L2 | `sha256:d943b2c2b2a732805bd2f3f05b83467a274e1377b109b43f55e2ef10d22f2bbb` | `data/raw/legacy/import_raw/UDP-glycosyltransferase flavonoid regioselectivity 7-O 3-O_20260910_2233.rdf` | historical_claims_only_not_revalidated / source_inherited_not_cleared_for_redistribution；不再分发 |
| L3 | `sha256:023f0f92b52e1fa1b9c0e6b19a99e6b814617fcc3ff6195f2f9bf976733afa48` | `data/raw/legacy/import_raw/alpha-L-rhamnosidase hesperidin hesperetin 7-O-glucoside_20260910_2229.rdf` | historical_claims_only_not_revalidated / source_inherited_not_cleared_for_redistribution；不再分发 |
| L4 | `sha256:5e65a2a14eb149a8e142e0e6f511414386462dcd2afb280fe1ba8d4dc57f91e0` | `data/raw/legacy/import_raw/flavonoid Koenigs-Knorr glycosyl bromide_20260910_2210.rdf` | historical_claims_only_not_revalidated / source_inherited_not_cleared_for_redistribution；不再分发 |
| L5 | `sha256:b639425792892873849e860d901c10a16cf993ee8b32de15491cc6bcb837837c` | `data/raw/legacy/import_raw/phase transfer glycosylation flavonoid glycosyl halide_20260910_2213.rdf` | historical_claims_only_not_revalidated / source_inherited_not_cleared_for_redistribution；不再分发 |

### 逐条核对

`D0`＝方向待原始研究核对；公开表只标目标产物结构命中。`E0`＝是否酶促待核，不因检索词含酶名而确认。`R0`＝与主案例的关系仅是历史目标产物结构命中。`U0`＝record_id及“源路径＋RFMT定位”均唯一；独立研究/化学反应去重尚未完成，不能按21项计21个独立实验。以下缩写是明确未决结论，不是空白。

| admission_id | record_id（原ref_id） | source_id别名 | 原定位 | 方向 | 酶促 | 主案例关系 | 去重 | 原结果状态 | 当前状态 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FH-R-001 | `1485756f4431f2b75616aac36cd96d0043fa77ca5e231d45fc91a5efb4fc867b` | L1 | RFMT/135 | D0 | E0 | R0 | U0 | withheld_unlicensed | pending_teacher_review |
| FH-R-002 | `aaadd83fcecdf9abe034f766b2d0663476a73d360e1651e58c35de674df8a33f` | L1 | RFMT/186 | D0 | E0 | R0 | U0 | withheld_unlicensed | pending_teacher_review |
| FH-R-003 | `1402d6d6dc66ca841ce6144a88e78f4647f6f94779c75b530323380ba16be709` | L2 | RFMT/45 | D0 | E0 | R0 | U0 | missing | pending_teacher_review |
| FH-R-004 | `a2a0d8053ee98c28ac1a5bf80ebb9fd6d6cb8f01aee4b4fe38cd87971ad4d190` | L2 | RFMT/46 | D0 | E0 | R0 | U0 | missing | pending_teacher_review |
| FH-R-005 | `bd2e0fbed483e176700a230e60c1d8ec3ddf85ed4693337573fb789b738d9106` | L2 | RFMT/66 | D0 | E0 | R0 | U0 | missing | pending_teacher_review |
| FH-R-006 | `73a67f76f24d490b346b0993b42f546835bd1edc4ed80971acbe5c8f3f27569a` | L3 | RFMT/1 | D0 | E0 | R0 | U0 | withheld_unlicensed | pending_teacher_review |
| FH-R-007 | `34bcaeb068ab15286a02cf9028384d161c760e50d84fc076015b7e60a4acf8a7` | L3 | RFMT/2 | D0 | E0 | R0 | U0 | withheld_unlicensed | pending_teacher_review |
| FH-R-008 | `13eeaa23527b702abba9e51f25f93cec8afe3ecbee636192a75f85371bde3449` | L3 | RFMT/3 | D0 | E0 | R0 | U0 | withheld_unlicensed | pending_teacher_review |
| FH-R-009 | `a8c8b735d75a61934a6efe7468d6f8b2fc7643a29e0ca36f29505a5adb2e163d` | L3 | RFMT/4 | D0 | E0 | R0 | U0 | withheld_unlicensed | pending_teacher_review |
| FH-R-010 | `ae02ebd4973e79fa0519ef44c817949d1739773aeaa631cc2511fead3bd80aec` | L3 | RFMT/5 | D0 | E0 | R0 | U0 | withheld_unlicensed | pending_teacher_review |
| FH-R-011 | `77f002e9e993e8932a37ceca2ee71681a73d25665ac89b963a61300183958b8e` | L3 | RFMT/6 | D0 | E0 | R0 | U0 | withheld_unlicensed | pending_teacher_review |
| FH-R-012 | `35402e3c78c8bd3ae815ca08251a46b518c41f679b2c8766221455ef48ed5482` | L3 | RFMT/7 | D0 | E0 | R0 | U0 | missing | pending_teacher_review |
| FH-R-013 | `843a270caeba69eb71ba61a45aaf87e1c262b68aa1098e6d4f822c16a906c0a3` | L3 | RFMT/8 | D0 | E0 | R0 | U0 | missing | pending_teacher_review |
| FH-R-014 | `658f3df5e2acbbbf40ca300ab89e470b4c39eda5653cd7d4e057df030a32d3ff` | L3 | RFMT/9 | D0 | E0 | R0 | U0 | missing | pending_teacher_review |
| FH-R-015 | `9cd8c5fb9ea41ba9f17c5f2ccbafd4ec9ec69c14a6b8121239e22fa813c6927f` | L3 | RFMT/10 | D0 | E0 | R0 | U0 | missing | pending_teacher_review |
| FH-R-016 | `55c081115812d1a1a0375a5e7bd764c3a577bd33afa403e02db7add6c1641045` | L3 | RFMT/11 | D0 | E0 | R0 | U0 | missing | pending_teacher_review |
| FH-R-017 | `54949908c54f54f8e9bd9eeed1aa3bf505c07bbc3b421fca730cf35635bf1f19` | L3 | RFMT/510 | D0 | E0 | R0 | U0 | missing | pending_teacher_review |
| FH-R-018 | `f8241f314ca88e4aaabaa1a4a1968302e8e189f152e1a82f49494d119981337d` | L3 | RFMT/511 | D0 | E0 | R0 | U0 | missing | pending_teacher_review |
| FH-R-019 | `f34cab6e9074226a0dc6c08263e5c75e2dcece53a2478d8388c89ab4b678f934` | L4 | RFMT/345 | D0 | E0 | R0 | U0 | withheld_unlicensed | pending_teacher_review |
| FH-R-020 | `e1980bde8083d5f4b1a9215997504e9a943415c3184008f1a1250db8f52c8331` | L4 | RFMT/346 | D0 | E0 | R0 | U0 | withheld_unlicensed | pending_teacher_review |
| FH-R-021 | `e218fa0e19e069b800e6e159512ab582c02be7200988a6c3e66b929b88621f5a` | L5 | RFMT/34 | D0 | E0 | R0 | U0 | withheld_unlicensed | pending_teacher_review |

核对结果：准入表reaction_record为21/21；record_id唯一21/21；来源＋定位唯一21/21；五个来源的本地原字节与准入/来源登记SHA全部一致，逐记录覆盖21/21。主案例FH-CASE-001另计1项，合计22项，未增删。没有教师审核记录（21/21 `not_performed`）。唯一ID不等于反应/论文去重完成。本地曾查看候选记录的结构角色元数据，只用于确认还需要原研究核验，不据此公开受限反应载荷或推定实验可重放。

给LJX：页面可展示“历史结构候选不能替代酶法证据”的分级练习；不必在学生运行时读取私有RDF或21条原反应。需要研究级逐条化学裁定时，由有权限的复核者按source_id/定位调原件并核原研究，而非由本次UI自动归类。

## 3. 三路线反应卡与14项字段比对

以下来自三篇已登记PDF、TASK-015定性核对与TASK-016补充材料核对。用原文页序定位；原字节路径/SHA继续以[public_sources.json](../../../metadata/public_sources.json)为准；Pei2019/Zhang2015/Niu2024是既存publication_sources的source_id。每格为原创概述，不摘录图表数值。三路线全为`pending_teacher_review`。

| 核对项 | R1：Pei2019，体外酶促糖基化 | R2：Zhang2015，选择性水解 | R3：Niu2024，工程菌转化 |
| --- | --- | --- | --- |
| C01 底物→目标 | 槲皮素→异槲皮苷；p.1、Experimental | 芦丁→异槲皮苷；p.1–2 | 外加槲皮素→异槲皮苷；p.1–3 |
| C02 方向 | 在槲皮素上转移葡萄糖基；p.1 | 选择性去末端鼠李糖，保留连接苷元的葡萄糖；p.1–2 | 全细胞中完成糖基转移；不是葡萄糖从头合成槲皮素；p.1–3 |
| C03 催化名称 | AtUGT78D2；p.1、p.4 | α-L-鼠李糖苷酶；p.1–3 | 异源表达UGT78D2；p.1、p.3–5 |
| C04 酶来源 | 拟南芥UGT、大豆GmSUS；p.1、Experimental | Bifidobacterium breve来源；p.1–2 | UGT与宿主需分别登记；正文p.3–5，SI Table S1/S2提供构建资料 |
| C05 表达/反应体系 | 重组表达用于取酶；反应是体外双酶体系，不能称全细胞产物；p.4 | 大肠杆菌表达后获得重组酶；体外水解；p.2–3 | Bacillus subtilis为转化宿主；p.3–5 |
| C06 糖供体 | UGT使用UDP-葡萄糖，游离葡萄糖不能直接替代；p.1–2 | 无需外加糖供体；水解反应；p.1–3 | 胞内代谢提供UDP-葡萄糖；p.2–5 |
| C07 辅助/再生 | GmSUS由蔗糖和UDP再生UDP-葡萄糖；p.1–2 | 供体再生不是必要组件；不可照搬R1装配 | 比较胞内供体供给、底物降解、产物水解和碳流改造；p.5–10 |
| C08 对照意义 | 分开比较供体组和酶组合；Table 1–2 | 人工底物酶活测定与芦丁制备不能互用参数；p.3、p.5 | 逐级菌株对照，要同时看生长负担；Fig.3–6 |
| C09 条件域 | 标准反应/补料组必须分开；方法续至p.5；本轮不建立推荐数值域 | 方法/正文/图注溶剂比例和动力学口径有冲突；不选一值覆盖另一值 | 摇瓶/发酵罐与补料组分开；本轮不建立插值域 |
| C10 测量方式 | HPLC与LC/MS方法；p.4 | 产品分析/论文色谱；p.3、Fig.4 | HPLC/LC-MS鉴定；正文Fig.2、SI Fig.S2/S3 |
| C11 图像的证据层次 | 论文曲线不是学生样品原始信号 | Fig.4/5不能变成本次计划样品的积分数据 | 正文/SI图像不是可任意条件重放的时间点表 |
| C12 未解材料 | 标曲、稀释、原始峰面积、重复信息不足；配比摘录待补正 | 标曲/峰面积/稀释链不足；正文与图终点范围分开 | 原始重复点/标曲不足；SI重复BS215标签歧义保留 |
| C13 可接入动作 | 区分活化供体与游离糖；解释双酶分工 | 选择不加供体并解释保留葡萄糖的目的 | 比较供体/降解/水解/生长负担，不叠加推算增产 |
| C14 无数据分支 | 学生自定条件保留为方案，结果null | 同左；不把未报告当0 | 同左；收到SI不自动解锁产率 |

核对分母为14个语义字段×3路线＝42格；与既存前端三路线摘要逐项比对，未发现需改动原路线方向/催化体系的冲突。这里的“比对”不声称全篇数值或构建序列经科学审定。原文冲突仍按[data_gap_list.md](data_gap_list.md)的L01—L12登记，不另创冲突真值表。

许可：三PDF由所有者指定公开，出版方`rights_verified=false`仍保留；Niu正文CC BY 4.0不自动授权新增SI/图表载荷。新增PubChem/ChEBI只读响应及EMIQ综述XML留`temp/task-017/`，不成为public运行依赖，也不扩大三PDF公开例外。

## 4. 交给LJX的具体内容与未决项

| 学习动作 | 依据/建议反馈 | 接入边界 |
| --- | --- | --- |
| 识别目标与四类近似对象 | M1—M5；让学生比较糖种类、连接位点、混合物与单分子 | 不自动判定任意输入SMILES，不给结构正式分 |
| 选择加糖/去糖/全细胞路线 | C01—C07；说明底物、酶来源、表达宿主与反应体系不同 | 反馈仅限已给候选路线 |
| 选能支持结论的证据 | 历史命中→候选；原文方法/图→特定条件报告；审定观测→尚缺 | 不让数据库命中或模型建议升级为真实观测 |
| 为供体和对照选择写理由 | R1活化供体/再生，R2无需供体，R3胞内供体；空白/无酶/灭活/宿主对照意义按体系解释 | 对照是学生计划，没有实测结果 |
| 辨认未测条件与缺定量链 | C09—C14；说明为何有论文图仍不能算本次样品产率 | 保持observations=[]、quantitative_result=null |
| 比较工程菌改造与局限 | R3供体、降解、水解和生长代价；至少指出一个需对照的混杂因素 | 不推断线性叠加增产，不模拟发酵 |

尚待人工处理：教师分子身份及课程量规；21条独立研究/反应方向/酶促性与重复裁定；历史文献冲突；原始测量/许可；ZYT/LYW/HYK本人确认。原T-Z1“每卡均有单一SMILES/分子量”不适用于EMIQ，不能为凑五张单分子卡硬填；其余四卡字段已机器核对但本TASK只公开来源定位，不声称完整结构数据载荷已交付。H02可登记“代理工作稿收到、非数值内容可接入、科学未决保留”。
