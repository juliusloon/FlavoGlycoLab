# REPORT-022：四幕导入叙事与文献PDF接入

## 对应任务
- TASK文件：docs/tasks/TASK-022-intro-narrative-paper-access.md
- 状态：Completed（2026-10-22，工程验收完成）
- 基线提交与分支：`c90e0f7`，main（工作树保留TASK-015—022未提交改动）
- 结果提交：pending（未提交、未push）
- 授权来源：human_direct。所有者2026-10-22明确四幕导入思路（介绍→合成难题→三篇文献卡片与PDF→主线探究）、文献"不必现在读完、主线中由AI导师指导阅读"的定位，并在本日批准按TASK-022合同执行。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 导入内容 | frontend/student/content/demo-content.json | 新增`intro`块：`case`（幕一4条）与`chemical_limit`（幕二4条）每条挂已登记source_id、块级`review_status=pending_teacher_review`；`reading_note`教学流程提示；`papers`最小打开元数据（R1/R2/R3↔Pei2019/Zhang2015/Niu2024）。24步、证据、报告值、21命中边界均未改 |
| 开场与论文视图 | frontend/student/views/inquiry.js | `explorationScene()`三幕化（幕一介绍+3Dmol、幕二化学受限、幕三文献卡+阅读提示+开始主线探究，reveal/未展开占位保留）；新增`paperView()`：要点区（方向/催化/供体/小结，复用routes.evidence与route_analysis.route_summary非数值文本）＋同源PDF面板（iframe+新标签页回退链接）＋"待教师审定"与TASK-008公开范围说明，仅在单研究视图呈现 |
| 编排与导师 | frontend/student/app.js | `togglePaper()`：HEAD预检→设置iframe src→加载态/失败态；`openPaper`跟踪最近阅读论文并进入导师上下文行；askTutor的context白名单新增`task:{id,title}`与`paper:{source_id}`；stage 0建议问题改为阅读导向；新实验清空openPaper |
| 样式 | frontend/student/styles.css | 追加`.intro-act/.act-points/.point-source/.act-review/.reading-note/.paper-view/.paper-panel`等规则及620px断点适配；未改既有选择器 |
| PDF只读端点 | scripts/serve_lab.py | `load_papers()`启动时将intro.papers三id与metadata/public_sources.json精确匹配路径+SHA并核验文件字节，失败即标记降级；`GET /api/paper/{source_id}`仅服务三个登记id，流式返回application/pdf＋no-store，仅该响应覆盖CSP为`frame-ancestors 'self'`；未知id/含`/`、`\`、`..`的id/查询串分别404/400；HEAD只回头部；`make_messages`服务端映射任务标题与论文定位/非数值要点（客户端自由文本不进上下文）；SYSTEM增加两句阅读指导边界 |
| 服务端测试 | tests/test_lab_server.py | 新增5项：三PDF的GET/HEAD字节与SHA、CSP/no-store头；未知id/遍历/查询串4xx；SHA失配降级503且不出字节；全局页面仍`frame-ancestors 'none'`；task/paper上下文服务端映射且伪造字段被丢弃 |
| 状态守卫测试 | tests/test_workbench_state.mjs | 新增1项：intro块逐条挂源、块级待审定、无数值/产率/剂量/疗效字样、papers三id与sources路径/SHA及route一致 |
| 浏览器回归 | tests/test_inquiry_browser.mjs | 新增34项：三视口×三路线各3项导入幕检查与7项论文面板/端点/导师上下文检查；键盘夹具3项（paper与task上下文随tutor请求发出且为服务端可映射id、导师上下文行显示当前论文）；失败夹具1项（端点降级时诚实状态、不出字节、回退链接在）。修复本轮发现的2处测试缺陷（见偏差） |
| 报告与状态 | docs/reports/REPORT-022（本文件）、STATE.md、PROGRESS.md、docs/README.md、docs/tasks/README.md、docs/reports/README.md | 事后事实闭环与索引 |
| 本地证据 | temp/task-022/（Git忽略） | 三篇论文首页文本提取（起草核对用）、protected-after.json、browser/、browser-run.log、server.log、public-root/隔离副本 |

## 实际操作与观察

### intro逐条挂源表（起草依据：data/raw/literature三篇PDF首页经pdftotext提取核对，提取件存temp/task-022/*.intro.txt；ChEBI身份沿用TASK-017机器交叉核对）
| 幕 | 表述要点 | 挂源 | 依据 |
| --- | --- | --- | --- |
| 一 | 3-O位β构型连接一个葡萄糖 | ChEBI68352 | 身份记录quercetin 3-O-β-D-glucopyranoside |
| 一 | 与芦丁只差末端鼠李糖；槲皮素不带糖基；三者相近但身份不同 | Zhang2015, ChEBI28527 | Zhang p.1引言"derhamnosylation product…only a rhamnose"；ChEBI 28527 |
| 一 | 芦丁存在于药用植物、果蔬等；异槲皮苷天然丰度有限 | Zhang2015, Niu2024 | Zhang p.1引言；Niu p.1"limited natural abundance" |
| 一 | 水溶性高于槲皮素；生物活性仅为研究背景而非本实验结论 | Pei2019 | Pei p.1"higher water solubility than quercetin" |
| 二 | 结构复杂+天然丰度有限→大批量化学合成与植物提取均困难 | Niu2024 | Niu p.1 Background原句语义 |
| 二 | 位点/构型选择性需多步保护与脱保护控制（一般性原创表述） | Pei2019, Niu2024 | Pei p.1（GT区域/立体选择性优势）与Niu p.1（化学合成困难）动机 |
| 二 | 酶法思路：GT区域/立体选择性；鼠李糖苷酶选择性去末端鼠李糖 | Pei2019, Zhang2015 | 两篇引言/摘要 |
| 二 | 三条思路概览：体外加糖/选择性去糖/全细胞转化 | Pei2019, Zhang2015, Niu2024 | 三篇路线定位（结构性说明） |

- 阅读提示为所有者点名的教学流程说明（"不必现在读完；主线中AI导师会指导阅读"），非文献事实，块级标`pending_teacher_review`。
- 全部表述无数值产率、无疗效/剂量声明；Node守卫以`[%％]|产率|转化率|剂量|疗效`正则fail-closed。

### 论文视图与端点
- 单研究对话框（文献卡片点开或标签切换）显示"论文 PDF 与要点"：4条非数值要点＋原文定位（沿用既有study-locator）＋"待教师审定"＋TASK-008公开范围说明；并排对照视图不加面板，保持紧凑。
- 端点启动时逐文件核验：registry路径↔SHA精确匹配且文件字节SHA一致才`ok:true`；本机三id全部ok。降级路径经patch模拟核验：503且响应体无PDF字节。
- CSP仅论文响应放宽为`frame-ancestors 'self'`，根页面仍`frame-ancestors 'none'`（有测试）；全局CSP其余指令不变，静态后缀白名单未加.pdf。
- 导师：客户端仅发送`task:{id,title}`/`paper:{source_id}`；服务端按内容库重映射标题、来源定位与路线非数值要点；伪造title/label/locator不进上下文（有测试）。因论文对话框为modal，关闭后"最近阅读"保留在导师上下文中，学生可关闭对话框后直接提问；新实验清空。

## 验证
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python3 scripts/dev.py check` | 51项Python：48通过＋3项研究资产显式skip（REPORT生成前按TASK/REPORT配对规则失败1项，生成本报告后复跑通过）；Node 31/31 |
| `npm test` | 31/31通过（含新增intro守卫） |
| 浏览器回归 | Chromium 153.0.8010.12 headless shell，三视口（1536×1024 R1、768×1024 R3、375×812 R2）全流程＋键盘/失败夹具：551/551通过；console错误0、页面外部请求0、4条WebGL性能warning（与TASK-021同类既有） |
| 本轮新增浏览器守卫 | 34项：导入三幕挂源/无数值疗效/阅读提示9项；论文视图与端点21项（要点4条、待审定、TASK-008说明、HEAD 200 application/pdf、%PDF字节、同源iframe＋回退链接、导师上下文、路线不被改变、无溢出）；夹具4项 |
| 端点安全（Python） | 未知id/空id/含`/`、`\`、`..`/百分号编码遍历→404；查询串→400；降级→503无字节；HEAD无响应体；三PDF实际字节SHA与metadata/public_sources.json一致 |
| 保护字节审计 | 199/199不变（基线temp/task-018/protected-before.json，本轮temp/task-022/protected-after.json） |
| PDF SHA复核 | 3/3与登记一致（sha256sum直读） |
| AC3不读PDF完成主线 | 三视口会话均完成01–04与路线确认、24步、快照与导出；论文面板交互不进入任务/路线状态机（状态守卫未改且通过） |

命令：
```bash
python3 scripts/dev.py check
npm test
# 隔离服务：temp/task-022/public-root/scripts/serve_lab.py --port 8768（含公开PDF与登记、无私有导师配置，模拟干净克隆）
# PLAYWRIGHT_MODULE=/home/ljx/paperico/frontend/node_modules/playwright/index.mjs FRONTEND_URL=http://127.0.0.1:8768/ \
# QA_OUTPUT=temp/task-022/browser node tests/test_inquiry_browser.mjs
```

## 与任务合同的偏差
- 测试先行运行暴露两处本轮新增测试自身缺陷并已修复：①论文iframe断言与HEAD预检存在竞态，改为等待iframe src属性就位；②"阅读不改变路线"断言误用目标路线值，改为与打开前快照比较（路线选择在面板检查之后发生）。两处均为测试代码缺陷，非产品缺陷。
- 隔离测试服务必须运行于`temp/task-022/public-root/`副本（前端＋serve_lab.py＋公开PDF＋public_sources.json）：本机存在私有导师配置`data/private/runtime/tutor.json`，直接从仓库根启动会使"默认public不需要模型凭据"检查失败；副本不含private，且验证了新克隆（Git自带三PDF、无私有配置）场景下端点可用。该副本在temp内，不入Git。
- headless shell的iframe不渲染PDF（load事件不触发，加载态保留"正在加载"），本轮以HEAD/字节/状态断言替代视觉渲染核对；真实浏览器的PDF渲染未在本轮做视觉验收。
- 8766常驻服务未重启：其进程仍是旧代码，无`/api/paper`端点；8766上前端新页面即时生效，但在线阅读会走诚实的失败态（"此入口暂未提供论文 PDF 在线阅读"＋回退链接，回退链接同样404）。待所有者批准重启后生效。

## 数据、许可与审核门
- research_evaluation：未改变；本轮未接触研究包或历史命中数据。
- teaching_case_review：22/22仍pending_teacher_review；intro块与要点区均标待教师审定；教师批准0。
- public_teaching_release：not_started；PDF端点仅服务TASK-008已公开的三份登记文件，rights_verified=false不变；页面明示勿二次分发。
- 未消费HYK摘录/原文配图/SI图文；未新增参考文献行；未改`learning.steps`、`teaching_matrix`、`route_analysis`数值与边界。

## 已发现但未改的问题
- 8766需一次经批准的服务重启才能提供论文端点（本轮合同明确不重启）。
- headless环境iframe PDF渲染不可见（见偏差）；真实浏览器视觉验收留待后续。
- 导师SYSTEM仅增两句阅读指导边界；真实模型下的阅读指导质量未做真人评估。

## 遗留风险、仓库与CI
- 分支main，HEAD `c90e0f7`；TASK-015—022全部改动在本地工作树，未提交、未push、本轮未跑CI。
- temp/task-022/public-root为7.8MB本地隔离副本（含三份公开PDF复制件），Git忽略，不分发。
- 三篇PDF字节与登记未变；data/raw、data/derived、data/private其余内容未触碰。

## 建议的下一TASK
- 经所有者批准后重启8766并在LAN入口验收论文端点（含真实浏览器PDF渲染核对）；或按所有者优先级推进教师审定相关准备。不自动启动。
