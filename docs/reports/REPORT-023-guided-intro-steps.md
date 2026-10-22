# REPORT-023：导入分步交互与任务引导重构

## 对应任务
- TASK文件：docs/tasks/TASK-023-guided-intro-steps.md
- 状态：Completed（2026-10-22，工程验收完成）
- 基线提交与分支：`c90e0f7`，main（工作树保留TASK-015—023未提交改动）
- 结果提交：pending（未提交、未push）
- 授权来源：human_direct。所有者2026-10-22要求：幕一/二/三改为需交互推进的独立步骤；派两个子agent分别以授课老师/学生预设实走实验；指出产品"像带icon的md文档、无交互感/教学感/设计感、信息不直观"；点名任务01无引导；要求强调AI导师作用。

## 改动文件与职责
| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 事前合同与设计 | docs/tasks/TASK-023-guided-intro-steps.md、temp/task-023/design.md | human_direct合同；实施契约（内容/状态/视图/编排/测试五层的精确约定，供并行实施） |
| 导入内容 | frontend/student/content/demo-content.json | intro块新增`orientation`（首屏定位行）、幕一/幕二各一道交互题（prompt/choices/answer/feedback/retry，挂源并标待审定）、`papers_gate`（门禁文案＋导师预填问题）；任务01新增`guidance`（3条观察指引）、`guidance_source_ids`、`coach_question`、`example`（参考示例）；24步既有字段零改动 |
| 状态机 | frontend/student/lab-state.js | 新增`introProgress`（含legacy迁移：有revealed/routeChosen无step→导入已完成）、`answerIntroAct`（顺序门禁，答对方进幕）、`recordIntroPaper`（去重记录）；hydrate对exploration宽容清洗（非法字段剔除而非throw，旧存档不锁死）；既有状态机语义零改动 |
| 视图 | frontend/student/views/inquiry.js | `explorationScene`改为分步：进度指示（认识分子/合成的难处/三篇论文）、未解锁幕显示锁定占位、每幕交互题（答错给retry提示、答对给feedback并解锁下一幕）、幕三门禁行（导师预填入口＋已打开n/3＋未达门禁禁用的开始按钮）；任务01加观察指引与比较角度chips；任务视图加"问导师"按钮、理由框标签统一为`note_prompt`、提交后显示"参考示例（非标准答案）"折叠块 |
| 编排 | frontend/student/app.js | intro-choice判定与状态写入、intro-tutor/ask-task-tutor预填并打开导师、stage 0打开文献卡计入papers门禁、openTask在stage 0且导入未完成时拒绝并提示、applyRoute/chooseRoute保留分幕进度、replay-intro重置到幕一、表单required控件的中文校验提示、PDF面板8秒无加载给出"新标签页"超时提示、对话框关闭仅在导入场景重渲染（见偏差） |
| 样式 | frontend/student/styles.css | 追加`.orientation/.intro-steps/.act-locked/.act-question/.intro-choice/.intro-feedback/.gate-row/.gate-hint/.task-guidance/.angle-chips/.task-example`等及断点适配；未改既有选择器 |
| 状态守卫测试 | tests/test_workbench_state.mjs | 新增4项：intro交互题/门禁/任务01引导字段的挂源与无数值守卫；分幕状态机（乱序拒绝/答错不进/答对进幕/论文门禁/legacy迁移/hydrate清洗） |
| 浏览器回归 | tests/test_inquiry_browser.mjs | reveal流程改为`completeIntro`分幕流程（含答错拒绝、锁定断言、门禁disabled→enabled）；新增orientation呈现、任务01观察指引/参考示例/问导师预填/中文校验断言；legacy迁移fixture与PDF慢加载fixture（挂起路由验证8秒超时提示） |
| 报告与状态 | 本文件、STATE.md、PROGRESS.md、docs/README.md、docs/tasks/README.md、docs/reports/README.md | 事后事实闭环与索引 |
| 评测证据 | temp/task-023/teacher/、temp/task-023/student/、temp/task-023/browser/等 | 双角色notes.md＋截图、设计稿、保护字节、回归结果（Git忽略） |

## 实际操作与观察

### 角色扮演评测（合同第1步）
- 两个子agent分别以授课老师（8771端口）与学生（8772端口）预设实走完整流程，各产出notes.md与40+截图（temp/task-023/teacher|student/）。老师实测了真实AI导师2次提问（限速内）；学生完整走完R1路线全流程并故意错配测试。
- 一致结论：产品有交互骨架但导入段是文档流；任务01能完成但无质量感知（无框架/无示例/反馈无内容评价）；AI导师实测有用但入口被动；另有若干流程缺陷。

### 评测采纳清单
| 评测发现（来源） | 处理 |
| --- | --- |
| 导入三幕是文档流、缺分步交互（两角色＋所有者） | 已实现：分幕交互题＋顺序解锁＋进度指示＋论文门禁 |
| 任务01无脚手架、题干/标签/placeholder三处措辞不一致（学生） | 已实现：观察指引3条（挂ChEBI源）、比较角度chips、标签统一为note_prompt、提交后参考示例 |
| AI导师入口被动、缺情境化入口（两角色） | 已实现：幕三"让导师带我读论文"与任务视图"问导师"，均预填上下文问题 |
| 首屏无定位说明（学生P0-3） | 已实现：orientation行（角色/流程/产出），为流程说明不挂源 |
| 原生英文校验气泡出戏（学生P2-7） | 已实现：required控件中文自定义提示 |
| PDF面板加载卡死无提示（老师P2-6/学生P2-8） | 已实现：8秒超时给出新标签页提示；失败态与回退链接既有 |
| "选择路线"发现太晚（学生P1-4） | 部分缓解：幕三门禁要求先打开论文卡（对话框内有选择按钮）；不改变任务04既有语义 |

### 评测未采纳/转未决（不越权扩项）
| 发现 | 理由 |
| --- | --- |
| 装配/方案编辑静默重置同阶段任务记录（老师P0-1/学生P0-2） | 修复触及`clearDownstream`状态机核心语义，超出本合同禁区；建议下一TASK专项处理（含UI明示顺序） |
| 无仿真内核、"实验没有结果"（老师P0-2/学生P0-1） | 需要新数据内容授权与教师审定；本任务以orientation预期管理缓解 |
| 导师回答泄漏开发者术语observations=[]等（老师P1-5） | serve_lab.py不在本任务预算；建议后续任务清洗SYSTEM提示 |
| 教师端班级汇总/审定入口（老师P2尾部） | platform/teacher为scaffold，属独立任务 |

## 验证
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python3 scripts/dev.py check` | 51项Python：48通过＋3项研究资产显式skip；Node 35/35 |
| `npm test` | 35/35通过（TASK-022的31项＋新增4项） |
| 浏览器回归 | Chromium 153.0.8010.12 headless shell，三视口（1536×1024 R1、768×1024 R3、375×812 R2）全流程＋legacy迁移/键盘/失败/慢PDF四个夹具：603/603通过；console错误0、页面外部请求0 |
| 新增浏览器守卫 | 分幕锁定/答错retry/答对解锁/门禁disabled→enabled、orientation、任务01指引/示例/问导师预填/中文校验、legacy迁移、慢PDF提示等 |
| AC1分幕 | 幕二/三初始锁定、答错停留、答对解锁、开卡后门禁放行、刷新保留、replay重置、legacy存档自动完成——均有浏览器断言 |
| AC2任务01引导 | 观察指引3条＋挂源标签、比较角度3枚chips、提交后参考示例、问导师预填含"任务01"；24步判定/保存/导出断言不变且通过 |
| AC3挂源 | Node守卫：question/papers_gate/orientation/任务01新字段逐条校验，source_ids全部已登记，无数值/产率/剂量/疗效正则命中 |
| 保护字节 | 199/199不变（基线temp/task-018/protected-before.json，本轮temp/task-023/protected-after.json）；PDF SHA 3/3 |
| 8766 | 未重启；前端资产磁盘直读，新UI即时生效；论文端点仍为旧进程（TASK-022已记录的限制不变） |

## 与任务合同的偏差
- 两个实施子agent在429配额中断前已完成大部分产品与测试代码；主agent完成集成核对、定位并修复两处缺陷：①PDF"加载较慢"提示计时器原先只覆盖iframe加载、不覆盖HEAD预检挂起（已前移到HEAD之前，失败/加载均清理）；②对话框close事件按规范异步派发，原实现对main无条件重渲染会与后续表单fill竞态导致输入丢失（表现为方案/反思字段随机丢值、三视口稳定复现）——改为仅在导入场景（.gate-row存在）重渲染。两处均为本轮新增代码的缺陷修复。
- 设计稿的"答对后反馈＋继续按钮"在实施中改为答对即推进（反馈保留在完成态），测试与设计稿已同步，交互更简。
- 角色扮演agent曾短暂启动服务于8771/8772，均已停止并确认端口释放；8766为10-19既有实例，与本轮无关。

## 数据、许可与审核门
- research_evaluation：未改变。teaching_case_review：22/22仍pending_teacher_review；新增交互题/指引/示例均标待教师审定；教师批准0。public_teaching_release：not_started。
- 未改data/raw、data/derived、data/private、metadata/*、data/registries/*任何字节；未消费HYK摘录/SI图文；未新增参考文献。

## 已发现但未改的问题
- 装配/方案编辑会静默重置同阶段任务记录（角色扮演两路独立复现）：需新合同处理clearDownstream语义与界面明示。
- 学生期待"做实验出数据"与产品诚实无观测的定位存在张力：orientation只做了预期管理，仿真内核或参考曲线需另行授权。
- 导师模型回答偶现开发者术语：需清洗serve_lab.py的SYSTEM提示（本轮预算外）。
- headless环境iframe不渲染PDF（TASK-022已记录）；本轮慢加载提示以挂起路由fixture验证。

## 遗留风险、仓库与CI
- 分支main，HEAD `c90e0f7`；TASK-015—023全部改动在本地工作树，未提交、未push、本轮未跑CI。
- temp/task-023/public-root为本地隔离副本（含三份公开PDF复制件），Git忽略，不分发。

## 建议的下一TASK
- 专项处理装配/方案编辑与主线任务记录的重置语义及界面明示（角色扮演P0级，两路独立复现）；或按所有者优先级处理导师SYSTEM术语清洗。不自动启动。
