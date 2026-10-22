# TASK-022：四幕导入叙事与文献PDF接入

## 合同元数据
- 任务ID：TASK-022（本仓库唯一、严格递增）
- 状态：Approved（human_direct 定约，交接给执行agent实施；不得扩项）
- 基线分支：main（工作树保留TASK-015—021未提交改动）
- 基线提交：`c90e0f7`
- 授权来源：human_direct。所有者2026-10-22明确导入思路四幕：①异槲皮苷介绍（是什么、自然界来源、性质、效果→为什么要讨论它的合成，展示3Dmol）；②合成问题（化学直接合成受限，无法在实验室用原料直接合成）；③三篇合成路线文献：每张文献卡片展示原理示意图，点开后展示PDF与要点（可复用现有内容）；④之后开始主线探究。并明确：学生不必在导入时读完全部三篇文献，应进入主线探究后，在AI导师指导下阅读三篇文献、总结后续实验所需关键内容。所有者要求先调研给出TASK交接执行，不直接生成网页。
- 人工负责人：LJX（所有者）
- 执行者：待指派的执行agent（本文件即交接执行合同）
- 修改预算（逐路径允许清单）：
  - `docs/tasks/TASK-022-intro-narrative-paper-access.md`
  - `docs/reports/REPORT-022-intro-narrative-paper-access.md`
  - `frontend/student/index.html`（仅当对话框骨架/无障碍标注需要）
  - `frontend/student/app.js`
  - `frontend/student/views/inquiry.js`
  - `frontend/student/styles.css`
  - `frontend/student/content/demo-content.json`
  - `scripts/serve_lab.py`
  - `tests/test_inquiry_browser.mjs`
  - `tests/test_lab_server.py`
  - `tests/test_workbench_state.mjs`（仅当内容不变量守卫需要）
  - `STATE.md`、`PROGRESS.md`、`docs/README.md`、`docs/tasks/README.md`、`docs/reports/README.md`
  - `temp/task-022/`（本地验证证据，Git忽略）
- 关联：TASK-008（三篇PDF公开例外）、TASK-018（探究空间/3Dmol）、TASK-020（LYW v5 24步与报告值）、TASK-021（文案清理基线）；不改变三个状态门。

## 目标
把学生入口（stage 0 案例与路线）重构为四幕导入：分子介绍→合成难题→三篇文献（卡片原理示意＋点开PDF与要点）→开始主线探究；为三篇已公开PDF提供有边界的同源只读访问；主线探究期间AI导师能围绕当前任务与当前论文指导阅读。学生不读完文献也能进入并完成主线01–04。全程非数值、不晋级三个状态门。

## 背景与已核实事实
- 现状开场：`frontend/student/views/inquiry.js` 的 `explorationScene()`＝标题＋`moleculeStage()`（3Dmol，`molecule-viewer.js` 挂载）＋“展开三种思路”→`caseCards()`（三张卡，含原创SVG机制示意 `routeDiagram()`）＋“开始主线探究”。卡片经 `app.js` `data-case`→`showEvidence()`→`#evidence-dialog` 的 `caseComparison()`（六字段dl、DOI外链、选择路线按钮）。demo-content.json 中**没有**自然资源/性质/效果与化学合成受限的介绍内容（grep 0命中）。
- 服务端：`scripts/serve_lab.py` `do_GET` 只服务 `frontend/student` 目录，后缀白名单 `{html,css,js,json,png,webp,svg,ico}`（无 .pdf）；`/api/` 前缀除 `/api/health` 一律404。全局CSP含 `frame-ancestors 'none'` 与 `object-src 'none'`：**同源iframe内嵌PDF会被 frame-ancestors 拦截，PDF响应必须单独覆盖CSP（仅放宽到 `frame-ancestors 'self'`），父页面禁止 `<object>/<embed>`**。
- PDF资产：`data/raw/literature/` 三份（约0.15/0.7/4.6 MB），路径与SHA唯一登记于 `metadata/public_sources.json`（TASK-008 human_direct例外，rights_verified=false）；`demo-content.json` `sources[].source_path/source_sha256` 指向同一批文件；`src/flavoglycolab/evidence/catalog.py` 已有 `public_sources()` 读取接口。
- 可复用要点内容（已在Git、全部非数值）：`sources[].source_locator/quality_status/license_status`；`routes[].evidence.*`（方向/催化剂/供体/报告证据/缺口）；`case_studies[].stages[]` 六字段；`learning.route_analysis`（route_summary、C01–C14、reported_results 4组“原文报告”、can_support/cannot_conclude/next_steps、21条命中边界）；`learning.identities` 5项身份辨析。TASK-015的HYK摘录表/15张原文配图与Niu SI为本地不入Git且未获前端再利用授权，**禁止消费**。
- AI导师：`app.js askTutor` POST `/api/tutor`；`serve_lab.make_messages` 白名单注入 stage/route/independent_reason/plan/operation/reflection/sources(4字段)；SYSTEM 禁止虚构数值/页码；`contextRevision` 防陈旧回复。当前 context 不含当前任务与当前论文。
- 主线：stage 0＝任务01–04（`quest-state.js` 顺序解锁），完成后 `routeConfirmation()`；24步 `learning.steps` 为 LYW v5 教师待审内容（TASK-020接入），不得改写。
- TASK-021 已删除的注释性文案清单见 REPORT-021；新导入文案属所有者点名的教学叙事，不是装饰说明，不得回添已删除句式（如“先探索论文中的做法”“自查进度 · 不计正式成绩”等）。
- 服务：8766 常驻只读磁盘上的前端静态资产（前端改动即时生效）；`serve_lab.py` 代码改动需重启才生效——**本次不重启8766**，PDF端点在 8767/8768 验证并在报告注明。

## 范围
### 允许项
- `demo-content.json` 新增 `intro` 块（介绍/化学受限/阅读提示）与最小论文打开元数据；每条事实性表述必须挂已登记 source_id（现有人选：ChEBI68352、EMIQReview2022、Pei2019/Zhang2015/Niu2024 的引言定位），带 `pending_teacher_review` 状态；无法挂源的表述删除（fail closed）。
- `inquiry.js`/`app.js`/`styles.css`：开场三幕（介绍＋3Dmol、化学受限、文献卡片）与论文视图（同源PDF面板＋要点区＋边界标签）；保持既有 reveal、任务HUD、replay-intro、减少动态效果、响应式断点。
- `serve_lab.py`：新增 `GET /api/paper/{source_id}`（仅三个登记id，启动时SHA校验失败即端点降级503）；PDF响应单独覆盖CSP为 `frame-ancestors 'self'`，其余安全头保留；`make_messages` context 白名单新增 `task:{id,title}` 与 `paper:{source_id}`（服务端映射，不接收客户端自由文本）；SYSTEM 增加不超过两句的阅读指导边界。
- 测试扩展与工程验收；STATE/PROGRESS/README索引更新；`temp/task-022/` 证据。

### 禁止项
- 不改 `learning.steps` 24步语义/顺序/判定、`teaching_matrix`、`route_analysis` 数值与边界；不新增观测、计分、成绩或自动晋级。
- 不改三份PDF及 `data/raw`、`data/derived`、`data/private`、`metadata/*`、`data/registries/*` 任何字节；不新增参考文献行；不把HYK摘录/原文配图/SI图文放进前端或Git。
- 不引入CDN/外部请求/构建器/新第三方库；不放宽全局CSP；不扩展静态后缀白名单。
- 不回添TASK-021已删除的装饰性文案；不写医疗诊断、剂量、疗效结论或具体产率数值。
- 不重启8766、不提交、不push、不启动下一TASK。

### 涉及目录及文件职责
| 目录职责 | 文件 | 当前状态与拟改动 |
| --- | --- | --- |
| 事前合同 | 本文件 | 新建 |
| 导入内容 | `content/demo-content.json` | 新增 `intro` 块（case/chemical_limit/reading_note，均挂源并标待教师审定）；不改24步与证据字段 |
| 开场与论文视图 | `views/inquiry.js`、`styles.css` | `explorationScene()` 三幕化；`caseComparison()` 增加PDF＋要点模式；原创SVG示意沿用 |
| 编排与导师 | `app.js` | 论文打开事件、tutor context 白名单字段、stage 0 建议问题（可选，阅读导向） |
| PDF只读端点 | `scripts/serve_lab.py` | `/api/paper/{source_id}`、SHA校验、CSP覆盖、make_messages 扩展 |
| 对话框骨架 | `index.html` | 仅当需要新增对话框/无障碍标注 |
| 测试 | `test_inquiry_browser.mjs`、`test_lab_server.py`、`test_workbench_state.mjs` | 三幕/论文视图/端点/白名单守卫 |
| 报告与状态 | `REPORT-022`、STATE/PROGRESS/索引 | 事后事实闭环 |

## 非目标
- 视觉全面重设计、信息架构重构、24步改写、新增练习题型或计分、教师审定、真实测量、仿真数值、公开发布、移动实体设备适配、新参考文献或新图像资产。
- 不实现“读文献进度记录”等新持久化状态（阅读支持仅经现有导师对话与现有任务草稿）。

## 必须执行的操作
1. 起草 `intro` 内容并逐条核对可挂源（fail closed）：介绍（是什么/存在背景/性质/为何值得合成，可引用 ChEBI:68352 身份、EMIQReview2022 综述定位、三篇论文引言）、化学受限（糖基化位点/构型选择性与保护基/分离困难的一般性原创表述，可引用三篇论文动机，禁止数值）、阅读提示一句（“不必现在读完；主线中AI导师会指导阅读”）。
2. 实现 `explorationScene()` 三幕：幕一介绍＋3Dmol（保留聚焦糖基/复位/来源面板）；幕二化学受限；幕三现有 caseCards（原理示意沿用 `routeDiagram()`）＋阅读提示＋“开始主线探究”。
3. 实现论文视图：案例对话框新增“论文PDF＋要点”呈现——同源 `<iframe>`（加载/失败态＋“新标签页打开PDF”同源回退链接）＋要点区（复用 source_locator、routes.evidence、case_studies 当前阶段、route_analysis 非数值摘要）＋既有边界短标签（“原文报告 · 非本次观测”“待教师审定”、TASK-008 公开范围说明）；保留选择路线与DOI外链。
4. 实现 `/api/paper/{source_id}`：仅 `demo-content.sources` 中能在 `metadata/public_sources.json` 精确匹配路径/SHA 的三个 id；启动时校验SHA；流式返回 `application/pdf`＋no-store；拒绝遍历/查询串/未知id；不触碰既有静态服务与tutor逻辑。
5. 扩展导师阅读支持：client 只发送 `task:{id,title}` 与 `paper:{source_id}`；`make_messages` 服务端映射（任务标题、论文 source_id 与来源定位、该路线非数值要点）；SYSTEM 增补≤2句（可指导阅读当前论文的非数值要点与定位，不得补足页面未提供的数值/结论/页码）。
6. 更新三类测试（端点含SHA匹配、404与降级；浏览器三视口×三路线含论文面板、外联0、console错误0、TASK-021被删句式不回归）。
7. 运行全部验证，生成 REPORT-022（记录实际文案与挂源清单、测试分母、8766未重启限制、偏差），更新 STATE/PROGRESS 与三个README索引；保护字节审计199/199＋三份PDF SHA复核。

## 验收标准
- [ ] AC1：开场呈现幕一（介绍＋3Dmol）、幕二（化学受限）、幕三（三张文献卡＋原理示意SVG）与“开始主线探究”；每条事实性表述挂已登记source_id并标待教师审定；无数值产率、无疗效/剂量声明。
- [ ] AC2：浏览器内可同源打开三份PDF（iframe成功或回退链接可用）；`/api/paper/{id}` 对未知id/遍历/查询串返回4xx；SHA不匹配时端点降级且不出字节；全局CSP未放宽。
- [ ] AC3：不打开任何PDF也能进入并完成主线01–04并确认路线；24步内容、判定、保存与导出逻辑零变化。
- [ ] AC4：主线中打开论文后，AI导师能围绕当前任务/论文给出阅读指导；无数据守卫（QUANT_REQUEST/QUANT_OUTPUT）行为不变。
- [ ] AC5：Python、Node、浏览器测试通过并记录分母；三视口无横向溢出、console错误0、页面外联0；保护字节199/199。
- [ ] AC6：REPORT-022 闭环、STATE/PROGRESS 更新；三状态门不晋级（teaching_case_review 仍 22/22 pending_teacher_review）。

## 验证
    python scripts/dev.py check
    npm test
    # 浏览器回归：Node 22 + 既有Playwright缓存；隔离端口8768；三视口×三路线
    # 保护字节审计：199/199；sha256sum data/raw/literature/*.pdf 对 metadata/public_sources.json

实际分母与偏差写入REPORT-022，不得用历史结果冒充本轮。

## 停止条件
- 任一PDF的SHA与 `metadata/public_sources.json` 不一致或读取失败。
- intro 表述必须引入具体数值、疗效/剂量结论或新参考文献才能成立。
- 需要改24步语义、`teaching_matrix`、状态机或任何注册表/元数据字节才能实现。
- 同源PDF呈现必须放宽全局CSP或引入外部脚本才能完成（应改用新标签页回退；放宽CSP即停止）。
- 改动溢出到预算外路径，或需要重启8766/提交/push才能继续。

## 报告要求
生成 `docs/reports/REPORT-022-intro-narrative-paper-access.md`：记录四幕实际实现、intro逐条挂源表、PDF端点验收、测试分母、8766未重启的生效限制、偏差与未决问题；更新STATE/PROGRESS与索引。不自动启动下一TASK。
