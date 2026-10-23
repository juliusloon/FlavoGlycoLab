# FlavoGlycoLab 当前架构与工件责任表

本文件是当前职责与工件归属规范。当前已实现与计划内容必须分开；不存在的接口不被描述成已运行。

## 当前基线
日期：2026-10-21（TASK-018/019/020更新）。TASK-001实现自包含历史证据池和标准库读取器，TASK-002建设命名与治理；TASK-003对照进展并建立独立公开代码快照。真实数据驱动的课程仿真、评分、师生身份和公众教学发布未实现；TASK-012在既有LAN托管上重建六阶段交互工作台，并接入服务器端Qwen辅导。所有路径相对于本项目根目录，受限私有原件不进入公开Git。

TASK-004仅修订本地老师汇报的表达并验证显示，不新增业务模块或科学/教学审核事实。

2026-10-18：应所有者指令新增申报冲刺工作计划（docs/p10ns/261019/），仅登记与排程，不新增业务模块或科学/教学审核事实，不改变三个状态门。

2026-10-18 TASK-005：审计LJX独立范围并编制010文档准备、011本地演示两份Proposed合同；原可行性草案顺延006。只完成文档定约，前端/教学模块仍scaffold，三个状态门不变。

2026-10-18 TASK-006：所有者确认当前Ubuntu并human_direct授权实施；只读主机清点与唯一申报基线已验收。整机/当前可用/项目预算分开，技术目标未压测。该文档工件不新增active业务模块、真实D1/AI或教学服务，不改变三个状态门。

2026-10-18 TASK-007：按所有者明确命令删除本地pre-push钩子并恢复独立公开检出；公开更新继续沿用远端已有父链，导出排除本地汇报包与两份申报附件。候选合同顺延010/011，仍未实施。

## 模块与依赖拓扑
    data/raw (private, registered original bytes)
         |                  metadata/active.json (local-relative manifest)
         v                          |
    data/derived/v3 (candidate data) |
         |                          |
         +------> evidence catalog <+
                       |
           +-----------+-----------+
           |           |           |
     chemistry     experiment    teaching         [planned]
           |           |           |
           +-----------+-----------+
                       |
                  platform/API                    [planned]
                       |
           student process UI [active prototype] / teacher UI [planned]

当前student过程交互只读取原创非数值元数据，并通过scripts/serve_lab.py调用既有模型；不消费私有科学证据池。上图其余箭头指计划消费方向，不代表模块已通过科学/服务就绪验收。审批/许可守卫横切每个消费端。

## 模块责任表

| 所有者/模块 | 输入 | 输出 | 当前状态 | 约束 |
| --- | --- | --- | --- | --- |
| src/flavoglycolab/evidence/ | 默认data/registries及公开来源，research显式读取data/derived/v3/records.json，metadata/active.json | 只读记录/来源登记、SHA核验与候选状态 | active local read-only | 不计算产率；拒绝工作区外路径 |
| src/flavoglycolab/chemistry/ | 候选分子、结构与原始文献 | 结构身份、糖连接/反应方向/角色校验 | scaffold | 需来源证据与人工复核 |
| src/flavoglycolab/experiment/ | 教师审定的条件与数值 | D1仿真状态、取样与结果反馈 | scaffold | 无经准入观测不得合成数值 |
| src/flavoglycolab/teaching/ | 课程步骤、案例与人工教学决议 | 学习进程、评分依据、教学指导 | scaffold | 24步仍属规划 |
| src/flavoglycolab/platform/ | 访问鉴权与审定内容 | 学生/教师服务与审计接口 | scaffold | 未实现公开服务 |
| frontend/student/ | 公开结构表示、非数值候选路线、学生方案、明确标识的Qwen回复 | 分子/三案例、六阶段主线探究、LYW v5六界面×4步、文献报告值/三路线结论视图、本地记录与导出 | active LAN prototype，TASK-018/019/020 | 不读取私有证据、不生成真实观测/评分；AI不修改学生方案 |
| scripts/serve_lab.py | student资产、项目内私有模型配置、限定问题/上下文 | 资产服务、health与tutor同源API | active bounded service，TASK-012 | 固定上游/模型；服务端保密；无文件/命令/审批工具 |
| frontend/teacher/ | 权限控制后的审核界面 | 审核与教学监控 | scaffold | 教师身份真实性另行验证 |

## 三个状态门

| 状态门 | 当前值 | 晋级依据 |
| --- | --- | --- |
| research_evaluation | 历史候选，未在本项目确认化学泛化 | 实验证据与独立复核 |
| teaching_case_review | 22/22 pending_teacher_review，0批准 | 具名教师审定、文献/结构/条件/许可 |
| public_teaching_release | not_started | 专项发布TASK、授权、权限、安全与平台验收 |

三种状态不得通过一份工程测试合并为“Ready”。

## Artifact Registry（唯一归属）

| 类别/职责 | 唯一权威文件或目录 | Git | 状态 |
| --- | --- | --- | --- |
| 长期项目目标 | PROJECT.md | yes | active |
| 实体/依赖责任 | ARCHITECTURE.md | yes | active |
| 最新可证状态 | STATE.md | yes | active |
| 阶段进度与阻断 | PROGRESS.md | yes | active |
| 计划路线 | ROADMAP.md | yes | planned only |
| Agent操作纪律 | AGENTS.md | yes | active |
| TASK/REPORT/ADR模板 | docs/{tasks,reports,adr}/TEMPLATE.md | yes | active |
| 长期决定 | docs/adr/ | yes | active |
| 原始来源登记 | data/registries/source_registry.csv | yes | 123登记/122现存 |
| 候选案例准入 | data/registries/case_admission.csv | yes | 22未审 |
| 学术参考文献索引 | data/registries/publication_sources.csv | yes | 6参考，不等于全文审查 |
| 运行资源相对路径 | metadata/active.json | yes | active |
| 24步导师评价preset | metadata/tutor_presets.json | yes | TASK-026 active；agent_checked_candidate，待教师审定；serve_lab.py加载并对账demo-content步id，fail-closed |
| 三篇指定文献PDF | data/raw/literature/；路径/SHA唯一登记在metadata/public_sources.json | yes，human_direct例外 | 原字节公开，rights_verified=false，不作为教师批准 |
| 日常Git推送 | 当前main → public/main；scripts/publish.py兼容入口 | yes | 直接git push，当前main沿用公开父链 |
| 来源原件/外部模型 | data/raw/legacy/ | no | local restricted |
| 派生候选记录与SQLite | data/derived/v3/ | no | local candidate |
| 私有教师待审候选 | data/private/review_candidates/ | no | local pending |
| 证据读取API | src/flavoglycolab/evidence/catalog.py | yes | active |
| 分子结构审核包 | docs/cases/isoquercitrin/ | yes | draft, not approved |
| 24步课程 | docs/curriculum/ | yes | scaffold |
| 背景研究（非状态/政策真值） | docs/research/ | yes | reference only |
| 老师阶段汇报（非状态真值） | docs/p10ns/261017/ | 本地研究Git已跟踪；公开导出排除 | 29页汇报、讲稿与第三方参考资源保留本地；不构成审核或发布 |
| 申报冲刺工作计划（非状态真值） | docs/p10ns/261019/申报阶段分工与执行方案_20261019-1026.md | yes | active（human_direct 2026-10-18）；16任务卡、13条交接矩阵、AI赋能§1.4；实施须另行TASK批准 |
| LJX范围审计（历史判断，非实时状态） | docs/reports/REPORT-005-ljx-independent-work-audit.md | yes | 15项范围与13条交接；不修改原方案或代签 |
| 校内沟通唯一记录 | docs/p10ns/261019/communication_log.md | 待许可核查后按内容决定；不公开个人信息/回执原件 | planned，历史文档准备候选；实际回复后续由责任人确认；F0—F4矩阵引用此处，不复制回复真值 |
| LJX申报技术分段 | docs/p10ns/261019/shenbaoshu_sections_LJX.md | 原创准备稿可纳入，提交/同步另授权 | planned，历史文档准备候选；沟通①/T-H2/实测后方可定稿 |
| 站会唯一记录 | docs/p10ns/261019/standup_log.md | 按实际内容与授权决定 | planned，历史文档准备候选；真实参会/交接不预填 |
| 申报实施基线、主机实况、技术目标与F0—F4条件汇总 | docs/policy/ilab-2026/readiness-evidence-2026.md | 原创非数值/脱敏汇总可登记；原凭据按许可决定 | active document，TASK-006；唯一维护活跃目标与替换凭据，引用沟通记录，不替代教师审定。Ubuntu已选，未部署，性能值null；TASK中的目标表只为事前快照 |
| 学生路线内容 | frontend/student/content/demo-content.json | 原创非数值规划文本可纳入，提交/同步另授权 | TASK-012使用的唯一候选路线摘要与来源指纹；不作案例准入、观测或教学真值副本 |
| 文献参考分析引擎 | frontend/student/analysis-engine.js | yes | TASK-026 active；确定性白名单计算（8项，输入仅限已登记DQ记录）与条件四态对照；不新造数值、不接受自由输入 |
| iLab政策 | docs/policy/ilab-2026/ | yes | scaffold |
| 学生/教师界面 | frontend/ | yes | student交互实验台LAN托管；teacher仍scaffold，无正式教学评分/发布 |
| 工作台工程守卫 | tests/test_workbench_state.mjs、tests/test_workbench_browser.mjs、tests/test_lab_server.py | yes | 流程/持久化/API/浏览器；旧test_frontend_scaffold.mjs转入当前测试，历史验收保留 |
| 工作台产品设计 | docs/design/workbench.md | yes | 六阶段交互、24步需求映射、实时AI职责与真实仿真后续依赖 |
| 页面/界面规范 | docs/design/interface-system.md | yes | TASK-037；页面矩阵、访问/续接、token、组件调用与验收唯一规范 |
| 页面路由/续接 | frontend/student/navigation.js | yes | TASK-037；解析独立地址、调用既有门禁；last-page仅为界面偏好，不复制完成状态 |
| 共享界面组件 | frontend/student/components.js、components.css、design-tokens.css | yes | TASK-037；页头、标题、按钮、字段、面板、状态、空状态、返回与分栏的唯一维护位置 |
| 总览与局部页面导航 | frontend/student/views/pages.js | yes | TASK-037；已有内容/学习状态的只读投影 |
| 可操作组件展示 | frontend/student/components.html、components-page.js | yes | TASK-037；生产组件示例，演示数据只在页面内存中使用 |
| 页面导航工程守卫 | tests/test_navigation.mjs、tests/test_pages_browser.mjs | yes | TASK-037；直达/返回/刷新/续接、锁定页、共享外观、案例/数据/组件跨页验收 |
| 原创装置示意 | frontend/student/assets/lab-bench.png | yes | imagegen生成装置场景，非实验原件/数据 |
| 浏览器练习记录 | localStorage键flavoglycolab.workbench.v1 | no | 当前源的用户方案/操作/AI对话；最多12快照；不是教师记录真值 |
| 模型服务私有配置 | data/private/runtime/tutor.json | no | 0600；服务器端读取，不暴露给student或导出Git |
| TASK-012验收证据 | temp/task-012/ | no | 概念、截图、真实模型探针、测试、保护与部署检查；保留审计 |
| TASK-010验收证据 | temp/task-010/ | no | 概念/渲染图、比对表、浏览器/治理日志与保护SHA，仅本次工程证据 |
| LAN运行配置 | ops/systemd/flavoglycolab-lan.service.in | yes | 模板唯一维护，安装至当前账户systemd/user；仅student，8766，重启/开机启动配置 |
| LAN安装器 | scripts/install_lan_service.py | yes | 幂等安装，仅管理本项目同名服务，校验资产/端口/单元 |
| LAN入口与运维 | docs/operations/lan-site.md | yes | 唯一活跃地址/启停/日志/回滚说明；LAN原型，不是公众教学发布 |
| TASK-011验收证据 | temp/task-011/ | no | HTTP/浏览器/重启/治理/保护SHA；不覆盖TASK-010历史证据 |
| 迁移只读审计 | migrations/ | yes | frozen provenance (see notes) |
| 历史核心文件快照 | reference/flavoretro-snapshot/ | mixed | reference only, never runtime |
| 自动测试 | tests/ | yes | active engineering |
| 公开代码快照导出 | scripts/export_public_repository.py | yes | 从已提交树排除明确本地保留项并报告路径/原因；副本撤下未授权数值，不改本地原表 |
| 旧公开检出/过程暂存 | temp/public-repository/、temp/task-009/ | no | 旧检出非必需；归档bundle/原树与过程证据本地保留 |
| 原研究案例登记副本 | data/private/research-history-20261018/case_admission.csv | no | 原SHA保全，只读历史证据；当前tracked案例表为公开脱敏表示 |

公开导出的精确排除项由脚本中的`LOCAL_ONLY_PREFIXES`、`LOCAL_ONLY_FILES`维护：`docs/p10ns/261017/`及两份申报DOCX/PDF附件。该登记只收窄导出集合，不授予第三方许可；新增未知载荷仍由原守卫拒绝。本地推送钩子已依TASK-007删除，没有安装替代钩子。

TASK-009后，当前工作区main与GitHub main共用公开父链，可直接普通push。旧研究历史归档在本地分支codex/archive-research-20261018及temp/task-009/research-history.bundle，禁止把归档分支推到公开远端。原案例表在private归档保持原字节；活动登记表沿用远端已有脱敏表示，其来源、SHA、missing和待审状态不变。

## 冻结/只读边界
- 23项迁移源参考文件与哈希以及122项登记来源原件，禁止为更名修改原始字节。
- 参考快照仅留作一次性历史证据；活动程序不能import或以绝对路径调用。
- 受限原件不得出现在部署和源代码发行物中。
- 未来模块的实施必须先建立数据门、接口合同与验收，不能因为建了占位目录就标active。

## 文档角色和依赖
    PROJECT stable goals
        +-- ROADMAP planned stages
        +-- ARCHITECTURE responsibilities / artifact registry
        +-- Approved TASK one-time scope
                     |
               EXECUTE/VERIFY
                     |
               matching REPORT (facts)
                     |
              STATE (current facts)
                     |
           PROGRESS (milestones only)

ADR保存跨任务长期选择与复审条件，不能替代执行授权或事实验收。

## TASK-008公开范围例外（2026-10-18）

所有者明确指令“三篇PDF也要公开”。`data/raw/literature/`中的三个已提交PDF按`metadata/public_sources.json`登记的精确路径及SHA（导出脚本的`PUBLIC_PDFS`兼容读取）公开；其余raw/derived/private仍不公开。这是human_direct范围决定，出版方rights_verified=false，不追认为教师审定或全数据授权，PDF不适用本项目原创代码/文档许可。原件不改，原案例表仍脱敏。

`metadata/public_sources.json`自TASK-013起是三篇PDF路径/SHA例外的唯一登记，`PUBLIC_PDFS`兼容读取该文件。当前main直接同步public/main，scripts/publish.py仅保留普通push兼容入口；temp/public-repository已不作为日常依赖。

## TASK-010学生网站骨架（2026-10-19）

本次直接授权独立于历史完整演示提案。frontend/student以原生HTML/CSS/ES模块实现六个hash路由，运行不需要构建器、CDN、其他工作区或证据API。三个来源的原件SHA只作指纹，科学定位仍待逐项摘录；24步是设计目录，无实验控件/评分；AI仅脚本切换，未连模型。只服务student目录并绑定127.0.0.1。正式科学/教学服务、部署与发布仍为后续工作。

## TASK-011局域网托管（2026-10-19）

用户明确要求同LAN持续访问，新增systemd用户静态服务，只服务frontend/student并监听0.0.0.0:8766；使用当前账户已有Linger，enable至default.target并设置Restart=always。应用内容不改，不新增业务API/模型/成绩。当前回环预览保留；公众教学发布/容量/安全/平台验收仍为后续工作。

## TASK-012交互工作台与实时辅导（2026-10-19）

基于直接重建指令，student收敛为实验台/实验记录两入口。app.js负责编排与持久化，lab-state.js负责流程约束和上游失效，views/workbench.js负责六阶段及记录视图，ui.js只提供基础转义/图标/来源展示。JSON只保留案例/非数值路线/来源指纹，不重复原24步占位脚本。

唯一教学真值仍在原注册表；学生字段明确为自述/方案。过程播放时间不对应反应时间，样品标签没有观测，结果null。脚本服务和frontend的活动不把src/experiment或src/teaching的科学课程实现标为完成。

模型密钥仅项目内私有配置；浏览器请求同源API，后端组装受限上下文、调用固定Qwen并区分真实回复/证据守卫/失败。共享主机模型服务由所有者提供，本任务不修改模型或GPU部署。服务常驻模板/安装器仍由原TASK-011路径负责，唯一操作说明docs/operations/lan-site.md。

## TASK-013协作交付（2026-10-20）

默认运行拓扑为metadata/active.json(public)→真实案例/公开来源索引；frontend/student→scripts/dev.py→serve_lab.py。没有私有数据、模型配置或其它工作区依赖。research配置显式选择；不改变历史原件/科学状态，不将全量研究计数冒充已加载。

| 唯一职责 | 工件 | Git/边界 |
| --- | --- | --- |
| 跨平台启动、诊断、检查 | scripts/dev.py | yes；默认本机8767，标准库 |
| 默认public/可选research数据配置 | metadata/active.json | yes；替代旧默认v3依赖 |
| 三个公开PDF精确路径/SHA | metadata/public_sources.json | yes；PUBLIC_PDFS兼容读取，原件不变 |
| 四项v3派生包字节指纹 | metadata/research_bundle.json | yes；原件仍仅source_registry登记 |
| 离线研究包导出/预检/导入 | scripts/research_bundle.py | yes；117证据＋4派生，不含模型/private/密钥 |
| 协作操作与数据取得指引 | docs/operations/collaboration.md | yes；本地运行唯一入口，LAN另见lan-site.md |
| 现行数据规范 | docs/data-governance.md | yes；ADR0006长期决策 |
| QA依赖与可复现浏览器 | package.json、package-lock.json、tests/test_workbench_browser.mjs | yes；QA可选，不是运行依赖 |
| profile/导入边界测试 | tests/test_data_profiles.py、tests/test_research_bundle.py | yes；无私有数据可运行 |
| 研究包/验证过程 | temp/task-013/、temp/flavoglycolab-research-v3.tar.gz及SHA旁文件 | no；受限内部交接，不自动发送/上传 |

此前模块表evidence的输入data/derived/v3是可选research输入；默认public的cases/registry/三篇PDF核验是活动接口。原始122项仍完整保全；研究包只要求117现存证据，五项旧模型保留登记并明确可选，不删除原件。source_integrity按实际profile报告分母。三篇PDF与原案例表脱敏/待审状态不变。

## TASK-014技术准备与职责更新（2026-10-20）

所有者human_direct确认：校内推荐/流程、材料与签章、课程负责人与资质/软著等校内事务由两位指导老师负责。LJX负责技术材料、工程验收和内部交接；教师姓名/真实结论不得代填。

| 唯一工件 | 职责 | 边界 |
| --- | --- | --- |
| docs/p10ns/261019/shenbaoshu_sections_LJX.md | 申报6/7栏26字段技术准备稿、架构与AI口径 | TASK-014 active preparation；老师/同事/实测待补不冒充已确认 |
| docs/p10ns/261019/handoff_acceptance.md | 14项交接的接收、缺项、文件/接入映射 | 只登记接收和引用，不复制案例/文献真值 |
| docs/p10ns/261019/standup_log.md | 站会唯一记录及未开会模板 | 不代填参会或签收 |
| docs/operations/browser-acceptance.md | 品牌浏览器走查结果与复现 | 代理QA，非真人/Windows/移动实体机或课程验收 |
| tests/test_workbench_browser.mjs | 可复现品牌、截图、录像及流程守卫 | 不新增产品科学语义 |
| temp/task-014/ | 原表解析、版本/主机、品牌包及QA影像/验证 | 本地ignored，不提交包/原件/大录像 |

原Artifact Registry中的技术分段/站会planned状态由本节更新；communication_log保留历史规划但本TASK不编制校内问询或代办。旧候选文档准备合同仍是历史Proposed，不整份追认。

## TASK-015文献交接与候选内容（2026-10-20）

| 唯一工件 | 职责 | 边界 |
| --- | --- | --- |
| data/derived/extracted_from_literature/ | HYK署名摘录表、双语整理与15张原文配图 | 本地只读输入，全部不入Git；交接原表不另复制到docs |
| docs/p10ns/261019/handoff_acceptance.md | H01实际到件、指纹与缺项 | 仍为接收事实唯一表；不代签教师结论 |
| docs/p10ns/261019/data_gap_list.md | T-H2代理准备稿、最低字段/24步影响与降级 | 由HYK后续确认；非审定数据或完整课程真值 |
| frontend/student/content/demo-content.json | 三路线原创非数值摘要、来源定位和证据缺口 | 维持原职责，不消费本地derived、不公开其图文/数值 |
| temp/task-015/ | 输入SHA、PDF文本、逐项检查/冲突和QA证据 | ignored，本地机器核对，不是教师批准 |

来源可得性仅更新publication_sources.csv，不增记来源原件或改case_admission。学生样品继续没有观测；论文图像存在与原始测量/标准曲线可用分别登记。

## TASK-016新增SI原件与查证（2026-10-20）

| 唯一工件 | 职责 | 边界 |
| --- | --- | --- |
| data/raw/literature/supplementary/ | 所有者补交Niu2024 SI的原字节本地副本 | Git忽略，不属于三个PDF公开例外，不成为public运行依赖 |
| metadata/literature_supplements.json | SI子来源与三篇SI可得性、查证/限制唯一登记 | 仅元数据；source_registry的123项历史登记/研究包范围不改 |
| temp/task-016/ | 附件/官方字节、ZIP/XML/图像和查证/验证 | 本地ignored，机器核对不等于教师批准 |

接收状态继续只在handoff_acceptance维护；现行缺口引用data_gap_list。TASK-015的SI未到是历史事实，TASK-016记录后续收到与核对，不覆盖旧报告/证据。

## TASK-017代理交接与练习内容（2026-10-21）

| 唯一工件 | 职责 | 边界 |
| --- | --- | --- |
| docs/p10ns/261019/case_evidence_table.md | 五类身份、21候选逐项复核及路线字段交接 | ZYT范围的代理工作稿；不替代case_admission或教师审定 |
| docs/p10ns/261019/24step_table_3-6.md | 24步动作、拟议时间/量规与数据缺失降级的设计原稿 | LYW范围代理工作稿；教师未审，正式成绩未实现 |
| docs/p10ns/261019/shenbaoshu_sections_LYW.md | 24步配套的3-6(2)交互说明 | 仅准备稿，不代交后续申报栏目 |
| docs/p10ns/261019/b1_script_v1.md、b1_storyboard.md | B1介绍脚本与画面接入需求 | 代理v1，不代表成片/真人互审 |
| docs/p10ns/261019/b2_script_v1.md、b2_shotlist.md | B2操作脚本及镜头要求 | 代理v1，实际可拍与拟建分列 |
| frontend/student/content/demo-content.json | 分阶段学习任务和身份/路线证据提示的UI投影 | 不复制准入真值、原始数值或第三方图文 |
| temp/task-017/ | 本轮保护指纹、交接算术/内容核对与浏览器验证 | ignored，本地工程证据 |

H02—H05接收/接入继续由handoff_acceptance.md唯一维护。学习自述属于现有浏览器练习记录，不是教师成绩；助手宽度属于界面偏好，与实验状态分离。

TASK-017实现责任补充：learning-state.js独立管理学习草稿/核对/独立判断与失效，views/learning.js只渲染探究和学习记录；lab-state.js在既有流程和导出中调用，app.js编排事件。sidebar-resize.js仅管理指针/键盘分隔条与flavoglycolab.tutor-width.v1偏好，styles.css负责可用宽度响应式。scripts/dev.py将三个新增JS纳入运行资产检查；服务API和常驻进程未改。原生ES模块仍无需构建器或私有运行资料。

## TASK-018沉浸式探究工作空间（2026-10-21）

现有student模块内重构，不新增科学活动模块。`views/`负责分子/三案例场景及任务HUD投影，主线状态由独立状态辅助模块管理，`app.js`编排；`content/demo-content.json`继续唯一维护界面非数值路线/来源/学习内容。`assets/`允许本轮请求的公开分子表示及计算几何，附独立来源说明；`vendor/`只收可再分发的本地渲染库及原许可。两者不替代来源/案例准入登记，不访问私有材料。`temp/task-018/`独占本轮概念/验收/保护审计；最终文件归属与实测在REPORT-018闭环。


本轮最终职责：

| 工件 | 唯一职责与边界 |
| --- | --- |
| frontend/student/views/inquiry.js | 分子/三路线场景、主线HUD与单任务、六阶段论文对照；不存另一份完成状态 |
| frontend/student/quest-state.js | 从已有学习答案推导自查通过/短答提交、顺序解锁、可访问与进度 |
| frontend/student/views/inquiry-tools.js、inquiry-tools.css | 17证据分类、09四字段假设、20证据链，操作不产生观测/成绩 |
| frontend/student/molecule-viewer.js | 本地3Dmol生命周期、旋转/缩放/高亮、WebGL失败的二维降级 |
| frontend/student/assets/molecules/ | ChEBI:68352结构、RDKit计算几何与二维表示、来源SHA与CC BY 4.0署名说明；PubChem精确CID交叉核对，非实测/教师批准 |
| frontend/student/vendor/3dmol/ | 固定2.5.5离线渲染库及BSD-3-Clause/组件原许可证，不套用项目原创许可 |
| frontend/student/app.js、index.html、styles.css | 全局空间/事件/保存、浮动导师、输入法安全发送、设置及响应式；不再加载sidebar-resize.js |
| frontend/student/lab-state.js、learning-state.js | 既有流程/草稿；上下文修订号与AI请求事实跨路线保留，阻断旧回复及独立判断追认 |
| frontend/student/views/workbench.js、views/learning.js | 阶段2—6操作与记录、学习记录；旧阶段1/折叠表单渲染移除 |
| tests/test_quest_state.mjs、test_inquiry_browser.mjs | 主线状态与整页三路线/三视口、无观测和AI键盘/失败守卫；旧browser文件兼容转入 |

此前TASK-017固定侧栏调宽为历史实现，新浮窗不占布局列。三案例的18项分阶段内容继续只在demo-content.json.case_studies维护。分子来源说明与渲染资产属于新可视化职责，不修改123项历史source_registry或22条case_admission。最终本地验收与限制见REPORT-018；科学/教师/发布门未晋级。

## TASK-019教学矩阵与三路线结论（2026-10-21，历史代理假设）

在现有student模块内补充内容投影，不新增科学活动模块或运行时数据源。`demo-content.json`的24个`learning.steps`增加矩阵元数据，并新增`learning.teaching_matrix`与`learning.route_analysis`；两者均来自LYW/ZYT工作副本的原创非数值整理，不复制原始数值或第三方图文。`views/inquiry.js`只渲染任务矩阵条/角标与对照对话框的结论页，不改变任务判定、路线状态或保存逻辑；`styles.css`只负责其响应式布局。`tests/test_quest_state.mjs`守卫180分钟/100分、数据依赖集合与21条命中边界，`test_inquiry_browser.mjs`守卫三视口矩阵标识和结论页。`docs/p10ns/261019/three_route_analysis_LJX.md`为接入整理稿，明确非ZYT docx逐字转录；H02/H03唯一接收状态仍在handoff_acceptance.md。最终本地验收与限制见REPORT-019；教师量规、科学审定与公众发布门未晋级。该节的时间/分值/阶段切分来自代理工作副本，TASK-020已按实际文件校正。

## TASK-020实际交件校正（2026-10-21）

学生端仍只在现有student模块内调整内容投影，不新增科学模块或数据源。`demo-content.json`的24个学习任务按LYW实际“v5 界面简明版”重排为六界面×4步（4/4/4/4/4/4）；任务卡移除分钟/分值/成绩类型，改为实际界面序号与“待教师审定”角标。`learning.teaching_matrix`记录实际来源路径/SHA、阶段计数、数据依赖集合（沿用TASK-019代理设计，LYW实际稿未给该角标）与`proxy_rubric`；180分钟/100分只作`agent_proposal_not_teacher_approved`内部草案，不进入页面或成绩。`learning.route_analysis`新增4组ZYT docx文献报告值（R1补料、R1供体/酶组合、R2时间进程、R3 84 h补料），每行带条件、来源与“原文报告/非本次观测”边界；不新增学生样品值。`views/inquiry.js`、`views/inquiry-tools.js`、`learning-state.js`、`styles.css`只做任务映射、独立判断04/09、旧05/06独立记录只读保留与报告区块样式；`app.js`/`views/learning.js`仅为清除旧任务硬编码和标注旧编号做最小修复。`tests/test_quest_state.mjs`、`test_workbench_state.mjs`、`test_inquiry_browser.mjs`更新为实际阶段/报告值/工具ID守卫。三份实际原件留在Git忽略的`temp/261021-handout/`，不复制进公开前端；H02/H03接收状态仍在handoff_acceptance.md。最终本地验收见REPORT-020；教师、科学与公众发布门未晋级。

## TASK-027 LJX会后整合、两阶段状态、AI结果解析与逆合成评估（2026-10-23）

现有student模块内增量接入，不新增科学活动模块、模型或外部运行服务。新增字段与职责的唯一归属如下：`lab-state.js` 的 `run.stageMode`（guided参照练习/open开放探究，默认guided）与 `run.guidedDone`（参照完成标记）是两阶段流程状态唯一真值，旧存档缺失字段按guided默认值迁移、非法枚举拒绝加载（fail-closed），不另存第二份完成真值；`planBaseline`/`pendingPlanBefore` 仅作开放探究放弃/回滚的已确认方案快照，非学生记录真值；上下文修订继续复用既有 `contextRevision` 使陈旧AI回复按修订失效。`content/demo-content.json` 顶层 `feedback_rules` 是定性反馈规则唯一投影（13条、九字段以上齐全、无来源阈值0条、缺证据显式unknown、不造SHA），不复制到另一份运行配置；`metadata/tutor_presets.json` 的 `roles.result_analyst` 是结果解析角色唯一登记（review_status=agent_checked_candidate，启动校验fail-closed），`scripts/serve_lab.py` 的角色白名单与kind=analyze四分区协议（文献事实/学生自述/机制假设/尚不可判断）是唯一服务端出口，伪造来源/审核/"观测"400、双守卫不放宽。`docs/design/workbench.md` 新增「逆合成融合可行性评估」节是静态回溯示意与三路线分类（R1/R2酶促转化、R3工程菌途径）的唯一设计位置，动态算法本任务只评估不上线。`temp/task-027/` 独占本轮基线快照、保护清单（169文件sha256+size口径）、走查与L04对账证据；H02—H05及成员交付接收状态仍只在handoff_acceptance.md维护。最终验收见REPORT-027；教师、科学与公众发布门未晋级。

## TASK-035 逆合成来源接收

`metadata/retrosynthesis.json`唯一登记外部交接的本地目标/前体/论文角色合同；不是新反应数据池或第二份教学准入表。`scripts/retro_handoff.py`只读本地公开三篇原件与内容登记，校验包的身份/来源/角色/校验和；`serve_lab.py /api/retro-import/validate`是同源有界出口，固定本地加载兼容python -I。`frontend/student/retro-import.js`唯一编排接收/文件/来源卡与退回原始运行；`app.js`将校验记录附到当前草稿，`lab-state.js.run.retroImport`随现有保存/导出，不改变任何学习完成真值。`temp/task-035`仅本地实际交接包/校验与浏览器证据，Git忽略；不新增模型或另一仓库文件依赖。ADR0007解释长期边界。TASK-027的动态化受限评估保持历史事实；本次只接收计算来源，未将动态搜索或数值仿真部署到Lab。
