# TASK-024：ZYT 2026-10-22 交件接办、图1制图与案例页 v1

## 合同元数据
- 任务ID：TASK-024（本仓库唯一、严格递增）
- 状态：Approved（human_direct 定约；不得扩项）
- 基线分支：main（工作树保留TASK-015—023未提交改动）
- 基线提交：`c90e0f7`
- 授权来源：human_direct。所有者2026-10-22把ZYT三份交件放入`temp/261022-handout/`并明确要求“根据ZYT的交接文件，完成LJX的今日任务”；交件中的[路线图文字稿](../../temp/261022-handout/route_diagram_text_v1_20261022.md)写明“下一接收人：L（制图）”。
- 人工负责人：LJX（所有者）
- 执行者：主agent
- 修改预算（逐路径允许清单）：
  - `docs/tasks/TASK-024-zyt-handoff-figure-casepage.md`
  - `docs/reports/REPORT-024-zyt-handoff-figure-casepage.md`
  - `frontend/student/assets/figures/route_map_v1.svg`
  - `frontend/student/assets/figures/route_map_v1.png`
  - `frontend/student/assets/figures/README.md`
  - `frontend/student/case.html`
  - `frontend/student/case-page.js`
  - `frontend/student/case-page.css`
  - `frontend/student/content/demo-content.json`（仅新增`case_page`块；既有sources/routes/learning/24步零改动）
  - `frontend/student/index.html`（仅增加案例页入口链接）
  - `tests/test_case_page.mjs`（新增）、`tests/test_lab_server.py`（仅新增静态路由断言）、`package.json`（仅把新测试加入`npm test`）
  - `docs/p10ns/261019/24step_status_LJX.md`（新增）
  - `docs/p10ns/261019/handoff_acceptance.md`、`docs/p10ns/261019/standup_log.md`
  - `STATE.md`、`PROGRESS.md`、`docs/README.md`、`docs/tasks/README.md`、`docs/reports/README.md`
  - `temp/task-024/`（渲染/截图/来源核验证据，Git忽略）
- 关联：TASK-020（ZYT实际案例表与docx接入）、TASK-023（导入交互）、W-02（案例页）、W-03/W-04（演示域）；不改变三个状态门。

## 目标
接办ZYT 2026-10-22的三份交件：①按路线图文字稿制作图1（SVG＋PNG）；②把案例页文案v1接入一个可浏览的静态案例页，保留来源、状态与“原文报告/非本次观测”边界；③按B1脚本对L的技术画面要求，产出24步“可操作/仅占位/受阻”状态表与界面截图清单。所有数值仅为文献原文报告，不生成观测、不评分、不晋级任何审核门。

## 背景与已核实事实
- 三份交件位于`temp/261022-handout/`，实际字节与SHA：
  - `B1 项目简介视频｜脚本 v1.md`：6,642字节，SHA `96408256fe7c720502e1f89f14fc202357987dc1d5d158409ef1c04f330cc9f8`。
  - `case_page_copy_v1_20261022.md`：8,550字节，SHA `4cc3f96304f2b9fe2277edeadc1b98ba9a628ba7689bcb9b25caf32d27fcfe9a`。
  - `route_diagram_text_v1_20261022.md`：4,891字节，SHA `89bd34bace2388ff4c6c35d1c0f528c94c7a74119b7807510b5b46219f103fbf`。
- 三份文件署名均为周娅彤（ZYT）；`route_diagram_text_v1`明确“下一接收人：L（制图）”，是本轮LJX的直接交付。
- 案例页文案含S1—S6标准句、5类分子辨析、三路线卡、横向对照表引用、证据规则、AI分工、已有/拟建与5条参考文献。横向对照表可回接实际证据表`temp/261021-handout/case_evidence_table(1).md`第四部分（26,371字节，SHA `a731b7e7…c109`）。
- B1脚本镜头8要求“步骤状态角标（可操作/占位/受阻，以L 10/23状态表为准）”，镜头9要求“左右栏真实界面（待L 10/23，拿不到则注明教学示意）”。
- 现有站点无独立案例页；`#/case`等路由当前回落实验台。demo-content.json仅登记Pei2019、Zhang2015、Niu2024三篇论文源，`/api/paper`逐源服务PDF；不能把Bondonno2020或PubChem加入`sources`，否则会误触论文端点合同。
- PubChem PUG REST按CID核验（2026-10-22）：5280343槲皮素、5280804异槲皮素、5280805芦丁、8629 UDP-Glc、6031 UDP、5988蔗糖、5984 D-果糖、439730 β-L-鼠李糖的分子式/分子量均与交件一致；除芦丁SMILES书写形式不同外，其余CID的IsomericSMILES与交件逐字一致。芦丁以CID 5280805与分子式交叉核对，图内不印SMILES，避免把书写形式差异当成结构差异。

## 范围
### 允许项
- 图1：按交件的路线、节点、箭头、旁路、结果标签与脚注制作原创SVG；PNG由本地Chromium渲染，仅用于预览/视频素材候选。
- 案例页：静态`case.html`读取`demo-content.json`新增的`case_page`块；文案逐字采用ZYT案例页文案v1的S1—S6、标题、导语、路线卡、横向对照、证据/AI规则、已有/拟建与参考文献；每条数值带“原文报告·非本次观测·待教师审定”标识。
- 24步状态表：只按当前UI事实分类“可操作/仅占位/受阻”，不改变24步语义、判定或评分。
- 截图：当前公开UI的静态截图，存`temp/task-024/b1-assets/`，Git忽略。
- 交接/会议/状态文档：按实际到件更新，不预填真人签收或会议结论。

### 禁止项
- 不改ZYT三份原件字节；不改`temp/261021-handout/`原件。
- 不改`data/raw`、`data/derived`、`data/private`、`metadata/*`、`data/registries/*`任何字节；不新增来源登记或PDF端点。
- 不新增实验观测、产率、条件推荐、路线排名或教师审定；不把文献报告值写成“本实验观测”。
- 不改24步语义/顺序/判定、状态机核心、评分、AI协议；不重启动8766；不提交/push。
- 不引入CDN、外部字体、运行时外联或新第三方库；案例页外链仅限DOI/PubChem/ChEBI的普通链接，不加载远程资源。
- 不制作/替代B1/B2成片；不替ZYT/LYW/HYK签收或承诺新时点。

### 涉及目录及文件职责
| 目录职责 | 文件 | 当前状态与拟改动 |
| --- | --- | --- |
| 事前合同 | docs/tasks/TASK-024-zyt-handoff-figure-casepage.md | 新建 |
| 图件资产 | frontend/student/assets/figures/route_map_v1.svg、.png、README.md | 新建；SVG为唯一源，PNG为渲染预览 |
| 案例页 | frontend/student/case.html、case-page.js、case-page.css | 新建；只读展示，不写学习状态 |
| UI内容投影 | frontend/student/content/demo-content.json | 仅新增`case_page`；既有键零改动 |
| 导航 | frontend/student/index.html | 仅增加案例页入口 |
| 测试 | tests/test_case_page.mjs、tests/test_lab_server.py、package.json | 新增静态页/内容/无外联守卫与静态路由断言 |
| 技术状态 | docs/p10ns/261019/24step_status_LJX.md | 新建24步状态表与截图清单 |
| 交接/会议 | docs/p10ns/261019/handoff_acceptance.md、standup_log.md | 登记H04 v1与H15/H16；写10-22站会准备，不写已发生结论 |
| 状态/报告 | REPORT-024、STATE、PROGRESS、三个README | 事后事实闭环 |

## 非目标
- 不完成W-03/W-04全量验收，不激活D1观测/正式评分，不提升teaching_case_review或public_teaching_release。
- 不重制三分子结构图（视频镜头3由ZYT负责），不制作B1/B2 MP4。
- 不新增Bondonno2020或PubChem到`sources`/论文端点，不修改来源登记。
- 不处理装配/方案编辑重置、无仿真内核、导师SYSTEM术语等TASK-023遗留问题。

## 必须执行的操作
1. 计算并登记三份交件SHA；核对交件字段、来源与许可边界。
2. 按PubChem CID/SMILES核验制图节点；标注芦丁SMILES书写差异与图内不印SMILES的决定。
3. 制作`route_map_v1.svg`并用本地Chromium渲染`route_map_v1.png`；检查中文、箭头、节点、脚注与待审定标识。
4. 在`demo-content.json`新增`case_page`块，逐字接入S1—S6、5分子、三路线卡、横向对照表、证据/AI规则、已有/拟建与参考文献；实现静态案例页与导航入口。
5. 生成24步状态表与B1镜头8/9截图清单；截图存`temp/task-024/b1-assets/`。
6. 新增/扩展测试：案例页内容守卫（S1—S6逐字、数值标签、来源锚点、无外部资源）、静态服务路由、24步状态表完整性；运行Python、Node与浏览器回归。
7. 更新handoff_acceptance（H04 v1、H15案例页文案、H16图1文字稿）、standup_log（10-22 20:00准备）、STATE/PROGRESS/README；生成REPORT-024。

## 验收标准
- [ ] AC1：图1 SVG含R1/R2/R3三路线、公共产物节点、R1旁路、R2副产物、R3三步与工程改造括注、三组结果标签与5条脚注；所有数值带“原文报告”或“待授权/待审定”标识；PubChem CID/分子式核验记录落档；SVG可解析，PNG成功渲染。
- [ ] AC2：案例页逐字显示S1—S6、标题、导语、5分子表、三路线卡、横向对照表、证据规则、AI分工、已有/拟建、5条参考文献；所有产率/转化率/浓度均带“原文报告·非本次观测·待教师审定”标识；页面无未标注数值、无运行时外联、无CDN。
- [ ] AC3：24步状态表24/24行；状态仅取{可操作,仅占位,受阻}；每行有依据/限制；截图清单与文件对应；不改变24步语义/评分。
- [ ] AC4：`python3 scripts/dev.py check`、`npm test`、浏览器回归通过并记录本轮分母；console错误0、页面外部请求0；保护字节199/199；三份PDF SHA 3/3。
- [ ] AC5：handoff_acceptance登记三份交件实际SHA与状态；standup_log只写10-22站会准备，不写已发生/真人签收；REPORT-024闭环；三状态门不晋级。

## 验证
    python3 scripts/dev.py check
    npm test
    node --test tests/test_case_page.mjs
    # 浏览器：本地Chromium 153，隔离端口；案例页三视口（1536×1024/768×1024/375×812）
    # 检查：console错误0、页面外部请求0、无横向溢出、图1可见、S1—S6逐字
    # 保护字节：199/199；sha256sum data/raw/literature/*.pdf 对 metadata/public_sources.json

实际分母与偏差写入REPORT-024，不得用历史结果冒充本轮。

## 停止条件
- PubChem核验出现CID/结构冲突且无法在交件范围内解释。
- 案例页接入必须新增来源登记、改PDF端点或改24步语义/评分才能成立。
- 交件含未标注数值且无法回接证据表/原文定位。
- 需要重启8766、提交或push才能继续。

## 报告要求
生成`docs/reports/REPORT-024-zyt-handoff-figure-casepage.md`，记录三份交件SHA、图1核验、案例页接入、24步状态表、测试分母、偏差与未决项；更新STATE/PROGRESS与索引。不自动启动下一TASK。
