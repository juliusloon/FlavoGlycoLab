# REPORT-024：ZYT 2026-10-22 交件接办、图1制图与案例页 v1

## 对应任务
- TASK文件：[TASK-024-zyt-handoff-figure-casepage.md](../tasks/TASK-024-zyt-handoff-figure-casepage.md)
- 状态：Completed（工程验收完成；内容仍待教师审定）
- 基线提交与分支：`c90e0f7`，main（工作树保留TASK-015—024未提交改动）
- 结果提交：pending（未提交、未push）
- 授权来源：human_direct。所有者2026-10-22把ZYT三份交件放入`temp/261022-handout/`并要求“根据ZYT的交接文件，完成LJX的今日任务”；[路线图文字稿](../../temp/261022-handout/route_diagram_text_v1_20261022.md)写明“下一接收人：L（制图）”。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 事前合同 | [docs/tasks/TASK-024-zyt-handoff-figure-casepage.md](../tasks/TASK-024-zyt-handoff-figure-casepage.md) | 新建；限定三份交件接办、图1、案例页、24步状态表与截图 |
| 图件资产 | `frontend/student/assets/figures/route_map_v1.svg`（17,045字节）、`route_map_v1.png`（897,428字节）、`README.md`（3,058字节） | 新建；SVG为唯一可编辑源，PNG为Chromium渲染预览/视频素材候选，不入服务端点 |
| 案例页 | `frontend/student/case.html`（1,519字节）、`case-page.js`（7,628字节）、`case-page.css`（8,970字节） | 新建；读取同源`demo-content.json`只读渲染，不写学习状态 |
| UI内容投影 | `frontend/student/content/demo-content.json` | 仅新增`case_page`块（6条标准句、5分子、3路线卡、10行对照、4条证据规则、AI边界、状态、5条参考文献）；既有sources/routes/learning/24步零改动 |
| 导航 | `frontend/student/index.html` | 仅新增`案例页`入口链接（`./case.html`） |
| Node守卫 | `tests/test_case_page.mjs` | 新增7项：S1—S6逐字、5分子/3路线、数值标注、10行对照/5参考文献、AI与证据边界、无运行时外联、同源SVG结构 |
| Python路由守卫 | `tests/test_lab_server.py` | 新增1项静态路由断言：`/case.html`、`/case-page.js`、`/case-page.css`、`/assets/figures/route_map_v1.svg`均为同源200且CSP `frame-ancestors 'none'` |
| 测试入口 | `package.json` | `npm test`加入`tests/test_case_page.mjs` |
| 技术状态 | [docs/p10ns/261019/24step_status_LJX.md](../p10ns/261019/24step_status_LJX.md) | 新建；24行状态表（16可操作/6仅占位/2受阻）与B1镜头8/9截图清单 |
| 交接/会议 | [handoff_acceptance.md](../p10ns/261019/handoff_acceptance.md)、[standup_log.md](../p10ns/261019/standup_log.md) | H04按实际B1 v1更新；新增H15案例页文案、H16图1文字稿；写10-22 20:00站会准备 |
| 状态/索引 | `STATE.md`、`PROGRESS.md`、`docs/README.md`、`docs/tasks/README.md`、`docs/reports/README.md` | 本任务事后事实闭环 |
| 本地证据 | `temp/task-024/`（Git忽略） | 三交件核验、SVG渲染、案例页三视口截图/report.json、11张B1截图、状态板、隔离public-root与日志 |

## 实际操作与观察

### 1. 三份交件接收
- 逐字节计算SHA并与TASK-024登记一致：B1脚本6,642字节/`96408256…cc9f8`；案例页文案8,550字节/`4cc3f963…fe9a`；路线图文字稿4,891字节/`89bd34ba…3fbf`。三份均署名ZYT，但未提供分支/PR、提交时刻或本人签收；本轮为所有者转交后的代理接收，不登记ZYT真人签收。
- 未修改`temp/261022-handout/`任何字节；未把三份原件复制进Git。

### 2. 图1（案例页/图示资产）
- 按文字稿制作原创SVG：R1槲皮素→异槲皮苷加糖（含UDP-葡萄糖再生旁路）、R2芦丁→异槲皮苷剪糖（含副产物）、R3工程菌胞内转化（含三步工程改造括注）、公共产物节点、三组结果标签与5条脚注；数值均带“原文报告/待授权/待审定”标识。
- 分子身份按PubChem PUG REST CID核对：5280343槲皮素、5280804异槲皮苷、5280805芦丁、8629 UDP-Glc、6031 UDP、5988蔗糖、5984 D-果糖、439730 β-L-鼠李糖；分子式/分子量与交件一致。芦丁IsomericSMILES书写形式与交件不同，以CID/分子式交叉核对，图内不印SMILES，避免把书写形式差异当成结构差异。
- 本地Chromium渲染PNG成功；中文、箭头、节点、脚注与待审定标识已人工检查。PNG只是预览/素材候选，不是论文原图，也不表示Springer图表授权已取得。

### 3. 案例页 v1
- `demo-content.json`新增`case_page`块：S1—S6逐字、标题/导语、5类分子身份、3张路线卡、10行横向对照、4条证据规则、AI与数据服务边界、已有/拟建状态、5条GB/T 7714参考文献及[4]未入来源登记的说明。
- `case.html` + `case-page.js` + `case-page.css`为静态只读页：无框架、无CDN、无外部字体，运行时不请求任何第三方资源；所有产率/转化率/浓度均带“原文报告·非本次观测·待教师审定”标注，无未标注数值。
- 三视口Chromium检查（1536×1024、768×1024、375×812）：每档均显示6条标准句、5个分子、3条路线、10行对照，图1可见（渲染宽度1800），页面`scrollWidth==innerWidth`无横向溢出，console错误0、外部请求0；证据`temp/task-024/case-page/report.json`与三张截图。
- 参考文献[4] Bondonno 2020只在页面文本引用，未加入`sources`、`metadata/public_sources.json`或`/api/paper`端点，不加载/再分发原文。

### 4. 24步状态表与B1技术画面
- 按当前可运行原型逐项核对，输出24/24行：**可操作16步（01—10、12、17、21—24）、仅占位6步（11、13—16、20）、受阻2步（18—19）**；每行有页面动作、状态与依据/限制，不改变24步语义、判定或评分。
- 生成11张1920×1080真实界面截图（`temp/task-024/b1-assets/`），覆盖镜头8状态板、任务01、13—16操作演练、任务17/24、文献卡、AI导师、文献报告值表与空数据分析；截图采集脚本`capture.mjs`最终`ok:true`、`errors:[]`。
- 发现两处需在成片前处理的表述冲突：①B1 v1要求中列固定角标“交互示例，未连接实时大模型”，但当前本机演示环境实际配置了Qwen并显示“实时辅导已配置”，不能把已连接说成未连接，须改角标措辞（如“本机演示/未接入正式平台”）或改用预置画面；②当前没有独立的数据查询UI，镜头9右栏使用“原文报告值·非本次观测”文献结果表，不能剪成实时查询服务。

### 5. 交接与会议文档
- `handoff_acceptance.md`升为v5：H04登记实际B1 v1路径/大小/SHA及镜头8/9要求；新增H15（案例页文案）与H16（路线图文字稿）；新增TASK-024小节，明确未取得ZYT/LYW本人签收或教师审定。
- `standup_log.md`新增2026-10-22 20:00站会准备，只写会前事实与议程，不预填实际召开、参会人或决策。

## 验证
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python3 scripts/dev.py check` | 52项Python：49通过＋3项研究资产显式skip；其固定Node子集35/35 |
| `npm test` | 42/42通过（TASK-023的35项＋案例页7项） |
| `python3 -m unittest tests.test_lab_server` | 17/17通过（含新增案例页静态路由/CSP断言） |
| 案例页三视口 | 3/3档（1536×1024/768×1024/375×812）；每档6标准句/5分子/3路线/10对照行，图1可见，无横向溢出，console错误0、外部请求0 |
| 工作台浏览器回归 | Chromium 153.0.8010.12 headless，隔离public-root（8777，无私有导师配置）：603/603通过，3个路线会话、console错误0、外部请求0；证据`temp/task-024/browser-public/results.json` |
| 保护字节 | 199/199不变（基线`temp/task-018/protected-before.json`，本轮`temp/task-024/protected-after.json`） |
| 三份公开PDF | SHA 3/3与`metadata/public_sources.json`一致（712,382/4,608,260/153,626字节） |
| 图1渲染 | SVG 17,045字节/PNG 897,428字节；Chromium本地渲染成功，无外部字体/图片依赖 |

### 验证补记
工作台回归先在8775（主工作区、已配置本机Qwen）运行首项即失败：测试的默认public合同要求`#ai-status`显示“尚未配置”，而本机服务显示“实时辅导已配置”。这不是产品回归，而是测试环境与默认public前提不符；改用`temp/task-024/public-root`（无`data/private`）在8777重跑，603/603通过、console错误0、外部请求0。本报告不把首次环境失败写成产品通过，也不使用TASK-023的历史603项冒充本轮。

## 与任务合同的偏差
- B1镜头8的24步状态板是独立HTML渲染件（状态表的生产辅助），不是学生端内置页面；截图清单已注明其性质，未冒充产品功能。
- 案例页`status.as_of`为2026-10-22，而S6与免责声明写明“原型状态以2026-10-23步骤状态表为准”。10-23状态表定稿后需同步该字段；当前不预填10-23结论。
- 因实际AI导师已配置Qwen，B1要求的“未连接实时大模型”固定角标无法按字面执行；本轮只在状态表/截图说明中标出冲突，不改脚本原件，留待ZYT在v2中决定措辞或画面方案。
- 图1为原创示意，不是三篇论文原图的复制或改绘；Springer两篇图表展示授权仍待，未因制图而取得。

## 数据、许可与审核门
- `research_evaluation`：未改变；三篇来源、案例表与docx原件字节未改。
- `teaching_case_review`：22/22仍`pending_teacher_review`，教师批准0；案例页、图1、24步状态表全部标注待教师审定；S1—S6为文案投影，不是教师签收文本。
- `public_teaching_release`：`not_started`；案例页只在本地隔离服务验收，未部署到8766或公众入口。
- 未改`data/raw`、`data/derived`、`data/private`、`metadata/*`、`data/registries/*`任何字节；未新增来源登记、PDF端点或第三方运行时依赖。
- Bondonno 2020仅文本引用；Niu CC BY 4.0不自动扩展为Springer两篇的图表授权。

## 已发现但未改的问题
- B1脚本v1的AI角标与当前真实运行状态冲突（见偏差）；需ZYT在v2确认“预置演示”还是“本机演示”表述。
- 无独立数据查询UI；镜头9右栏只能用已核文献表，不能表现“实时查询”。
- 案例页文案、图1与24步状态仍待ZYT/LYW本人核对；若20:00交件修订，需按新版更新S1—S6/节点/状态。
- TASK-023遗留的装配/方案编辑静默重置、无仿真内核、导师SYSTEM术语三项未处理（超本任务范围）。

## 遗留风险、仓库与CI
- 分支main，HEAD `c90e0f7`；TASK-015—024全部改动在本地工作树，未提交、未push、本轮未跑CI。
- 临时服务：8775使用主工作区（含本机导师配置），8777使用`temp/task-024/public-root`隔离副本（无`data/private`）；两者均只监听127.0.0.1，本轮结束停止并释放端口。8766未重启。
- `temp/task-024/public-root`含三份公开PDF复制件，位于Git忽略目录，不分发；`temp/task-024/b1-assets/`截图与状态板同样只留本地。
- 图1的PNG是Chromium渲染结果；不同字体/浏览器可能存在像素差异，SVG为唯一源。

## 建议的下一TASK
- 优先处理TASK-023两路复现的装配/方案编辑重置语义与界面明示（P0）；或在收到ZYT B1 v2/LYW 24步v2后，按新版本同步案例页、图1与状态表并做教师审阅包。仅建议，不自动启动。
