# TASK-025：LYW 2026-10-22 交件接办、数据查询页与 AI 实况标识

## 合同元数据
- 任务ID：TASK-025（本仓库唯一、严格递增）
- 状态：Approved（human_direct 定约；不得扩项）
- 基线分支：main（工作树保留TASK-015—024未提交改动）
- 基线提交：`c90e0f7`
- 授权来源：human_direct。所有者2026-10-22把LYW三份交件放入`temp/261022-handout/`并明确要求“新增了LYW的今日交接内容，根据交接内容接着完成LJX的今日内容”；同时明确两项修正：①AI状态“直接以实际情况为准，修改更新就好”；②“把数据查询UI做好”。
- 人工负责人：LJX（所有者）
- 执行者：主agent
- 修改预算（逐路径允许清单）：
  - `docs/tasks/TASK-025-lyw-handoff-data-query.md`
  - `docs/reports/REPORT-025-lyw-handoff-data-query.md`
  - `docs/p10ns/261019/24step_teaching_matrix_LYW_v2.md`（按原字节复制）
  - `docs/p10ns/261019/evaluation_rubric_LYW_v1.md`（按原字节复制）
  - `docs/p10ns/261019/b2_shotlist_LYW_v1.md`（按原字节复制）
  - `docs/p10ns/261019/24step_status_LJX.md`
  - `docs/p10ns/261019/handoff_acceptance.md`
  - `docs/p10ns/261019/standup_log.md`
  - `frontend/student/data.html`、`data-page.js`、`data-page.css`、`data-query.js`（新增）
  - `frontend/student/index.html`、`app.js`、`case.html`、`case-page.js`、`styles.css`
  - `frontend/student/views/workbench.js`、`frontend/student/views/inquiry.js`
  - `frontend/student/content/demo-content.json`（新增`data_query`；更新`case_page.ai/status`、`learning.teaching_matrix`）
  - `frontend/student/README.md`
  - `tests/test_data_query.mjs`（新增）、`tests/test_data_page_browser.mjs`（新增）
  - `tests/test_case_page.mjs`、`tests/test_lab_server.py`、`tests/test_inquiry_browser.mjs`
  - `package.json`、`scripts/dev.py`
  - `STATE.md`、`PROGRESS.md`、`docs/README.md`、`docs/tasks/README.md`、`docs/reports/README.md`
  - `temp/task-025/`（截图、浏览器证据，Git忽略）
- 关联：TASK-020（LYW v5实际稿接入）、TASK-024（ZYT案例页与B1素材）、W-03/W-04；不改变三个状态门。

## 目标
接办LYW 2026-10-22的三份实际交件：①科学24步教学矩阵v2；②反馈与能力评价说明v1（20/40/30/10）；③B2操作示范拍摄执行版v1。完成LJX当日可直接交付的技术工作：①建立独立、同源的“数据查询”页，只检索已核对文献报告值并明确无数据状态；②按本机实际Qwen连接更新AI状态标识，不再把已连接说成未连接；③按LYW v2科学步骤重算24步状态表，并与现行网页任务做诚实映射；④把B2镜头需求中可由网页承担的数据查询入口接上。

## 背景与已核实事实
- 三份LYW交件位于`temp/261022-handout/`，实际字节与SHA：
  - `24step_teaching_matrix.v2.md`：29,452字节，SHA `f3e3ccb0d29be0e1c57bde0fdd41311d5ab4e3a99b9ad8e3ebddea1995e3f74d`；内文标题“异槲皮苷24步教学思路 v1 完善版”，六界面科学步骤5/5/6/1/3/4，明确“只改文档，未做本轮浏览器／模型调用验收”。
  - `反馈与能力评价说明_v1 (2).md`：8,103字节，SHA `31d8b1b558a3616b279f1b25593c4bf29e8d934e42cd266391d4895454b230da`；总分100＝预习20/操作40/报告30/课堂核验10，纸质记录，五维能力不另加分。
  - `b2_shotlist.md`：26,874字节，SHA `1052c864275eecfb3b0a57e2a111abafa67f2b90b557b73a85db79655877abf9`；12镜290秒计划，主版仍按“AI未配置”表述，但含“按实际模式标示”的条件替换规则。
- 当前本机运行环境实际配置Qwen，`/api/health`返回`configured=true`，前端显示“实时辅导已配置”。所有者明确要求以实际为准，不沿用“未连接实时大模型”的固定角标；正式平台仍未接入，不能把本机演示写成正式平台。
- 当前没有独立数据查询页；案例页只有`case_page.ai.data_service`文字卡，分析页只有“无对应实验数据”。B1镜头9右栏与B2镜头10/12需要可辨识的文献数据入口。
- 现行网页24项任务是LYW v5界面简明版（4/4/4/4/4/4）；LYW v2是科学教学步骤（5/5/6/1/3/4），两者不是同一层。不能把v2文档直接说成已实现，也不能用v5界面任务冒充v2科学步骤。
- 三篇论文仅作为文献报告来源；所有数值均有原文定位，网页不得生成本次观测、任意条件预测或跨路线排名。三份PDF按`metadata/public_sources.json`登记路径/SHA公开。

## 范围
### 允许项
- 复制LYW三份交件到`docs/p10ns/261019/`，保持原字节与SHA；登记接收状态、缺项与不升级签收。
- 新增`data_query`内容块：只收录已在案例页/教学矩阵/证据表出现且可回接原文定位的文献报告值；每条含路线、来源、类别、原指标名、条件、定位、边界与待审定状态。
- 新增`data.html/data-page.js/data-page.css/data-query.js`：同源静态检索，按路线/来源/类别/关键词筛选；显示结果计数、来源定位、边界；无匹配时明确“没有对应实验数据”，不返回0、不预测。
- 在实验台顶栏、案例页、分析结果页加入数据查询入口；不改变学习状态机、不写localStorage。
- 更新AI状态：`Qwen · 实时辅导（本机演示，未接入正式平台）`；固定角标`本机演示 · 未接入正式平台`；未配置/不可用时显示实际状态并保留实验台。更新案例页AI文案。
- 按LYW v2重写`24step_status_LJX.md`：24行科学步骤，逐项映射现行网页能力，重新统计可操作/仅占位/受阻；保留“不是教学验收”的边界。
- 更新交接登记、站会准备、状态/报告/索引；新增测试。

### 禁止项
- 不改LYW/ZYT原件字节；不改`temp/261021-handout/`与`temp/261022-handout/`原件。
- 不改`data/raw`、`data/derived`、`data/private`、`metadata/*`、`data/registries/*`任何字节；不新增来源登记或PDF端点。
- 不新增实验观测、产率、条件推荐、路线排名、教师审定、正式评分或签收；不把数据查询结果绑定到当前学生样品。
- 不改24步网页任务的语义/顺序/评分，不把LYW v2科学步骤直接覆盖现行UI；不重启8766；不提交/push。
- 不引入CDN、外部字体、运行时外联或新第三方库；数据页只读同源JSON。
- 不制作B2成片，不替LYW/ZYT/HYK签收。

### 涉及目录及文件职责
| 目录职责 | 文件 | 当前状态与拟改动 |
| --- | --- | --- |
| 事前合同 | docs/tasks/TASK-025-lyw-handoff-data-query.md | 新建 |
| LYW交件归档 | docs/p10ns/261019/24step_teaching_matrix_LYW_v2.md、evaluation_rubric_LYW_v1.md、b2_shotlist_LYW_v1.md | 原字节复制并登记SHA |
| 数据查询页 | frontend/student/data.html、data-page.js、data-page.css、data-query.js | 新建；只读文献报告值 |
| UI内容投影 | frontend/student/content/demo-content.json | 新增`data_query`；更新AI/状态/矩阵元数据 |
| 入口与AI实况 | index.html、app.js、case.html、case-page.js、styles.css、views/workbench.js、views/inquiry.js | 导航、固定角标、实际状态、分析页入口、矩阵来源说明 |
| 技术状态 | docs/p10ns/261019/24step_status_LJX.md | 按LYW v2重写并映射现行能力 |
| 交接/会议 | handoff_acceptance.md、standup_log.md | 登记H03 v2/H05实际B2/评价说明；写10-22站会准备 |
| 测试 | tests/test_data_query.mjs、test_data_page_browser.mjs、test_case_page.mjs、test_lab_server.py、test_inquiry_browser.mjs、package.json、scripts/dev.py | 内容/逻辑/静态路由/浏览器回归 |
| 状态/报告 | REPORT-025、STATE、PROGRESS、README | 事后事实闭环 |

## 非目标
- 不把LYW v2科学24步全部实现为网页交互；不改写24项现行任务。
- 不接入原始色谱、标准曲线、样品测量、AI文献检索或正式评分。
- 不做B2录制、真实AI回答展示或平台联调。
- 不处理TASK-023遗留的装配/方案编辑重置等无关问题。

## 必须执行的操作
1. 计算并登记三份LYW交件SHA；原字节复制到`docs/p10ns/261019/`。
2. 设计`data_query`记录合同，只录入可回接原文的文献报告值；每条记录标注“原文报告·非本次观测·待教师审定”。
3. 实现数据查询页与筛选/空状态，接实验台/案例页/分析页入口；确保无外联、无学习状态写入。
4. 按本机Qwen实际状态更新前端与案例页AI文案；固定“本机演示·未接入正式平台”角标。
5. 按LYW v2重算24步状态表，给出v2科学步骤→现行网页任务的映射与新的状态统计。
6. 更新交接/会议/状态/报告；新增并运行Node、Python与浏览器测试。
7. 生成B1/B2可用的数据查询真实截图`temp/task-025/`（Git忽略），更新素材清单。

## 验收标准
- [ ] AC1：三份LYW交件归档字节与原SHA一致；handoff_acceptance登记H03 v2、H05实际B2与评价说明，明确未取得本人/教师签收。
- [ ] AC2：数据页可按路线/来源/类别/关键词筛选；每条结果显示原指标、值、条件、原文定位与“原文报告·非本次观测·待教师审定”；无匹配显示“没有对应实验数据”，不出现0或预测；页面无外部请求、无CDN。
- [ ] AC3：实验台/案例页/分析页均有数据查询入口；数据页不读写学习记录；三档视口无横向溢出。
- [ ] AC4：本机配置Qwen时AI状态显示“实时辅导（本机演示，未接入正式平台）”；固定角标存在；未配置/不可用状态仍与实际一致，测试不把已连接说成未连接。
- [ ] AC5：`24step_status_LJX.md`24行科学步骤齐全，状态只取{可操作,仅占位,受阻}，附v2→现行UI映射、统计与依据；不声称v2已全部实现。
- [ ] AC6：`python3 scripts/dev.py check`、`npm test`、数据页/案例页/工作台浏览器回归通过并记录分母；console错误0、外部请求0；保护字节199/199；三份PDF SHA 3/3。
- [ ] AC7：REPORT-025闭环；STATE/PROGRESS/README更新；三状态门不晋级；8766未重启。

## 验证
    python3 scripts/dev.py check
    npm test
    node --test tests/test_data_query.mjs tests/test_case_page.mjs
    # 浏览器：本地Chromium 153，隔离public-root；数据页三视口（1536×1024/768×1024/375×812）
    # 检查：筛选/空状态/来源定位/无外部请求/无横向溢出；工作台AI状态与固定角标
    # 保护字节：199/199；sha256sum data/raw/literature/*.pdf 对 metadata/public_sources.json

实际分母与偏差写入REPORT-025，不得用历史结果冒充本轮。

## 停止条件
- 数据记录无法回接案例页/证据表/原文定位，或需要新增来源登记/PDF端点。
- 必须改24步UI语义、评分或状态机才能完成数据查询/AI标识。
- 本机Qwen配置读取需要私有密钥或重启8766。
- 出现未标注数值、许可冲突或必须替成员/教师签收才能继续。

## 报告要求
生成`docs/reports/REPORT-025-lyw-handoff-data-query.md`，记录三份交件SHA、数据查询记录与空状态、AI实况、24步v2映射、测试分母、偏差与未决项；更新STATE/PROGRESS与索引。不自动启动下一TASK。
