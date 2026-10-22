# REPORT-025：LYW 交件接办、数据查询页与 AI 实况标识

## 对应任务
- TASK文件：[TASK-025-lyw-handoff-data-query.md](../tasks/TASK-025-lyw-handoff-data-query.md)
- 状态：Completed（工程验收完成；内容、量规与拍摄仍待教师/成员确认）
- 基线提交与分支：`c90e0f7`，main（工作树保留TASK-015—025未提交改动）
- 结果提交：pending（未提交、未push）
- 授权来源：human_direct。所有者2026-10-22把LYW三份交件放入`temp/261022-handout/`并要求“新增了LYW的今日交接内容，根据交接内容接着完成LJX的今日内容”；同时明确：AI状态“直接以实际情况为准，修改更新就好”，“把数据查询UI做好”。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 事前合同 | [docs/tasks/TASK-025-lyw-handoff-data-query.md](../tasks/TASK-025-lyw-handoff-data-query.md) | 新建；限定LYW三交件接办、数据查询页、AI实况标识、24步v2状态表与B1截图 |
| LYW交件归档 | `docs/p10ns/261019/24step_teaching_matrix_LYW_v2.md`（29,452字节）、`evaluation_rubric_LYW_v1.md`（8,103字节）、`b2_shotlist_LYW_v1.md`（26,874字节） | 原字节复制；SHA分别为`f3e3ccb0…f74d`、`31d8b1b5…30da`、`1052c864…abf9`，与`temp/261022-handout/`原件逐字节一致 |
| 数据查询页 | `frontend/student/data.html`、`data-page.js`、`data-page.css`、`data-query.js` | 新建；同源只读检索21条文献报告记录，支持路线/来源/类别/关键词筛选、URL深链、明确空状态；无框架、无CDN、无外部字体、不写学习状态 |
| UI内容投影 | `frontend/student/content/demo-content.json` | 新增`data_query`块（21条记录、7类数据、3路线标签、边界与空状态）；更新`case_page.ai/status`与`learning.teaching_matrix.science_matrix` |
| 入口与AI实况 | `frontend/student/index.html`、`app.js`、`case.html`、`case-page.js`、`styles.css`、`views/workbench.js`、`views/inquiry.js` | 顶栏新增“数据查询”，案例页与“查看分析结果”加入入口；AI状态改为真实本机Qwen文案并保留固定“本机演示 · 未接入正式平台”角标；案例页补`favicon`空数据URI |
| 技术状态 | [docs/p10ns/261019/24step_status_LJX.md](../p10ns/261019/24step_status_LJX.md) | 按LYW v2科学24步重写：24行、v2→现行UI映射、分阶段覆盖与13/9/2统计；明确不声称v2已实现 |
| 交接/会议 | [handoff_acceptance.md](../p10ns/261019/handoff_acceptance.md)、[standup_log.md](../p10ns/261019/standup_log.md) | 升v6；H03登记LYW v2、H05登记实际B2、新增H17评价说明；写10-22站会事实、议程与未决项 |
| Node守卫 | `tests/test_data_query.mjs`（新增5项）、`tests/test_data_page_browser.mjs`（新增三视口浏览器检查）、`tests/test_case_page.mjs`（增至8项） | 内容合同、筛选逻辑、空状态不转0、只读无外联、入口、AI实况文案 |
| Python/浏览器守卫 | `tests/test_lab_server.py`、`tests/test_inquiry_browser.mjs`、`tests/test_workbench_browser.mjs` | 静态路由加入数据页四文件；外联检测只统计跨源http(s)；工作台回归覆盖新导航/AI状态 |
| 测试入口 | `package.json`、`scripts/dev.py` | `npm test`及内置Node子集加入`tests/test_data_query.mjs` |
| 页面说明/状态/索引 | `frontend/student/README.md`、`STATE.md`、`PROGRESS.md`、`docs/README.md`、`docs/tasks/README.md`、`docs/reports/README.md` | 本任务事后事实闭环 |
| 本地证据 | `temp/task-025/`（Git忽略） | LYW原件核验、B1五张1920×1080截图、三视口数据页/案例页截图、隔离public-root、浏览器结果与保护字节after |

## 实际操作与观察

### 1. LYW三份交件接收
- 逐字节计算SHA并与TASK-025登记一致：LYW v2科学24步29,452字节/`f3e3ccb0…f74d`；评价说明8,103字节/`31d8b1b5…30da`；B2拍摄执行版26,874字节/`1052c864…abf9`。三份原字节复制到`docs/p10ns/261019/`，归档后SHA仍一致。
- 未修改`temp/261022-handout/`任何字节；未取得LYW本人签收、提交时刻或教师审定。LYW v2内文自述“只改文档，未做本轮浏览器／模型调用验收”。
- 评价说明的100分（预习20/操作40/报告30/课堂核验10）与五维能力只登记为教师纸质量规，不接入网页评分、不形成学生成绩。

### 2. 数据查询页
- 新增顶层`data_query`：21条已登记文献报告记录，R1 9条（Pei2019）、R2 5条（Zhang2015）、R3 7条（Niu2024）；7类数据为方法条件、产物浓度、转化率/收率、供体/机制、指标辨析、身份/谱图、投料/梯度。每条含路线、来源、原指标、值、条件、原文定位、使用边界与标签，全部标“原文报告 · 非本次观测 · 待教师审定”。
- `data.html` + `data-page.js` + `data-query.js`为静态只读页：路线标签、来源下拉、类别下拉、中文关键词多词匹配；筛选同步到URL（`history.replaceState`），案例页/分析页可用`?route=…`深链。
- 无匹配时显示“没有对应实验数据”，明说“不表示结果为 0，也不表示原文一定没有报告”；页面不生成0、预测、排名或本次样品结论。页面不加载论文原文、不调用AI、不读写`localStorage`、不请求任何第三方资源。
- 入口：实验台顶栏“数据查询”；案例页AI/数据服务卡“打开数据查询”；“查看分析结果”无数据提示处“到数据查询页核对本路线文献报告值”。
- 三档视口（1536×1024/768×1024/375×812）均显示21条记录，R2筛选5条、Niu2024来源7条、身份/谱图3条、关键词`BS306G`命中1条（3.58 g/L）、`3830`深链命中1条，无横向溢出，console错误0、外部请求0。
- 修复数据页“清除筛选”按钮与输入控件缺样式、窄屏标题换行问题；补齐`.button/.text-button/.query-field`样式。

### 3. AI实况标识
- 本机`/api/health`实际`configured=true`，前端显示`Qwen · 实时辅导（本机演示，未接入正式平台）`；固定角标`本机演示 · 未接入正式平台`常显。未配置时显示`模型尚未配置 · 本机练习可继续`；连接失败时显示`模型连接不可用 · 实验台可继续`。
- 案例页AI文案改为“本机环境在配置可用时连接Qwen”，并明确“不代表学校正式平台、固定域名或长期可用”。清理了“未连接实时大模型”的固定表述，不再把已连接写成未连接。
- 8781主工作区实际Qwen配置下截图`temp/task-025/b1-ai-tutor.png`，`capture-report.json`记录`aiStatus`为上述文案、`errors:[]`、`ok:true`；截图只证明状态与界面，不冒充正式平台联调或长时间可用性。

### 4. 24步状态表（LYW v2口径）
- 明确两层：LYW v2科学24步（六界面5/5/6/1/3/4，设计稿）与现行网页LYW v5任务（4/4/4/4/4/4）。逐项映射后：**可操作13步（02、03、05、06、09、10、11、12、16、17、22、23、24）、仅占位9步（01、04、07、08、13、14、15、20、21）、受阻2步（18、19）**。
- 分阶段覆盖：案例与路线3/2/0、配置体系3/2/0、设定方案3/3/0、操作1/0/0、分析0/1/2、结论3/1/0。受阻指正式定量目标缺标准品/原始峰/标曲/稀释链，不表示页面无法进入。
- 表内每行写明现行网页对应任务、可做操作、状态与限制；不改变网页24项任务的语义、顺序或判定，不声称v2已全部实现。

### 5. B1/B2素材与截图
- 生成5张1920×1080真实界面截图：`b1-data-query.png`（默认21条）、`b1-data-query-filtered.png`（R3+BS306G）、`b1-data-query-empty.png`（空状态）、`b1-ai-tutor.png`（实际Qwen状态）、`b1-24steps-status-v2.png`（13/9/2状态板）。采集脚本`temp/task-025/capture.mjs`最终`ok:true`、`errors:[]`。
- 新状态板取代TASK-024的16/6/2旧板；旧板与旧AI截图只保留为历史，不再作为B1镜头8/9素材。
- B2执行版已登记，但未录制、未成片；B2要求的AI画面需在正式拍摄时按实际Qwen状态标示。

### 6. 测试环境修正
- 工作台回归首次在8777运行时仍指向TASK-024遗留的隔离public-root，未包含TASK-025新代码；发现后重建`temp/task-025/public-root`（当前frontend/scripts、public元数据与3份公开PDF，无`data/private`），重启8777并重跑全部浏览器检查。旧root的603项不计入本轮。
- 测试的跨源请求检测原先把同源PDF iframe触发的`chrome-extension://…`与`chrome://resources/…`计为外部请求；改为只统计跨源`http:`/`https:`请求。该修正是测试守卫口径修正，不是产品外联。
- 案例页桌面首访的`/favicon.ico` 404来自未声明的favicon，已在`case.html`补`<link rel="icon" href="data:,">`，与index/data页一致；复测三视口console错误均为0。

## 验证
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python3 scripts/dev.py check` | 52项Python：49通过＋3项研究资产显式skip；内置Node子集48/48 |
| `npm test` | 48/48通过（工作台状态23、任务状态12、案例页8、数据查询5） |
| `python3 -m unittest tests.test_lab_server` | 17/17通过（含数据页四文件同源200与CSP断言） |
| 数据页浏览器（隔离public-root 8777） | 65/65通过；三视口；console错误0、外部请求0；`temp/task-025/data-browser/data-browser-results.json` |
| 数据页浏览器（本机Qwen 8781） | 68/68通过（多出3项“已配置时保留本机演示边界”）；console错误0、外部请求0；`temp/task-025/data-browser-qwen/data-browser-results.json` |
| 工作台浏览器回归（隔离public-root 8777） | Chromium 153.0.8010.12 headless，603/603通过；3路线×3视口；console错误0、外部请求0；`temp/task-025/browser-public/results.json` |
| 案例页三视口（隔离public-root 8777） | 3/3档：6标准句/5分子/3路线/10行对照、图1可见（自然宽1800）、无横向溢出、console错误0、外部请求0；`temp/task-025/case-page/report.json` |
| 保护字节 | 199/199不变（基线`temp/task-018/protected-before.json`，本轮`temp/task-025/protected-after.json`） |
| 三份公开PDF | SHA 3/3与`metadata/public_sources.json`一致（712,382/4,608,260/153,626字节） |
| LYW归档字节 | 3/3与原件SHA一致（29,452/8,103/26,874字节） |

### 验证补记
- 数据页分母因运行环境而异：隔离public-root无模型配置，不执行3项“已配置边界”条件检查，故65项；8781实际配置Qwen时68项。两者均通过，不能把68项说成无配置环境的检查数。
- 工作台603项是在重建后的当前代码public-root上取得；8777此前指向TASK-024旧副本的结果603项已废弃，不计入本轮。
- 案例页三视口与数据页三视口均使用隔离public-root；AI实况截图使用8781本机Qwen环境。两者环境不同，报告中分别注明。

## 与任务合同的偏差
- LYW v2是科学教学步骤设计稿，本轮只做映射与状态表，没有把v2二十四步实现为网页交互；网页仍执行v5界面任务。
- 评价说明的20/40/30/10未接入网页评分；无师生账户、成绩或正式量规执行。
- B2只接办拍摄执行版，未录制、未成片；B1的AI画面按实际Qwen状态截取，没有预置“未连接”画面。
- 数据查询是21条已登记文献报告值的只读检索，不是实时文献库、不是D1原始观测、不是任意条件预测；缺标准曲线/原始峰的数据仍显示“无对应实验数据”。
- 测试守卫修正（仅统计跨源http(s)）与favicon修复超出纯内容工作，但属于让验收结果诚实的必要修正，未改产品网络行为。
- 首次8777回归使用了TASK-024旧public-root，已重建并重跑；旧结果不冒充本轮通过。
- 案例页`status.as_of`仍为2026-10-22；S6和免责声明写明“原型状态以2026-10-23步骤状态表为准”，10-23定稿后需同步。

## 数据、许可与审核门
- `research_evaluation`：未改变；三篇来源、案例表与原始PDF字节未改。
- `teaching_case_review`：22/22仍`pending_teacher_review`，教师批准0；LYW v2、评价说明、数据查询记录、24步状态表与AI文案全部待审；数据查询的“已登记”不等于教师批准。
- `public_teaching_release`：`not_started`；数据页与案例页只在本地隔离服务验收，未部署到8766或公众入口。
- 未改`data/raw`、`data/derived`、`data/private`、`metadata/*`、`data/registries/*`任何字节；未新增来源登记、PDF端点或第三方运行时依赖。
- 三篇公开PDF仍按TASK-008例外登记；Niu CC BY 4.0不自动扩展为Springer两篇图表授权。

## 已发现但未改的问题
- LYW v2科学24步尚未逐项实现；任务18/19受阻于标准品、原始峰、标准曲线与稀释链。
- 数据页只覆盖21条已登记文献报告值，不能替代D1观测、统计检验或路线排名。
- 评价说明100分制/五维能力未进入网页；正式评分、师生权限、成绩留存未实现。
- B2未录制；B1/B2成片中的AI画面、数据页镜头与口播仍需按最终文案统一。
- TASK-023遗留的装配/方案编辑静默重置、无仿真内核、导师SYSTEM术语三项未处理（超本任务范围）。
- 案例页`status.as_of`与S6“以10-23状态表为准”的日期口径待同步。
- `ARCHITECTURE.md`的frontend文件责任表仍停在TASK-018/019/020口径，未列入TASK-024案例页与TASK-025数据页；本任务修改预算未包含该文件，留待下一次结构文档更新。

## 遗留风险、仓库与CI
- 分支main，HEAD `c90e0f7`；TASK-015—025全部改动在本地工作树，未提交、未push、本轮未跑CI。
- 临时服务：8781使用主工作区（含本机Qwen配置），8777使用`temp/task-025/public-root`隔离副本（无`data/private`）；均只监听127.0.0.1，本轮结束停止并释放端口。8766未重启。
- 8766上的旧服务未验收数据页/新AI文案；公开教学发布仍未启动。
- `temp/task-025/public-root`含三份公开PDF复制件，位于Git忽略目录，不分发；截图与证据只留本地。
- 数据页依赖`demo-content.json`与`data-query.js`同步更新；若后续改记录合同，需同时更新测试与截图文案。

## 建议的下一TASK
- 优先把LYW v2科学24步与现行v5任务之间的9个“仅占位”和2个“受阻”项逐项落成可操作控件或明确教学降级；或在教师审定后接入评价说明的纸质量规与报告模板。仅建议，不自动启动。
