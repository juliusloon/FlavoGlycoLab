# FlavoGlycoLab 当前架构与工件责任表

本文件是当前职责与工件归属规范。当前已实现与计划内容必须分开；不存在的接口不被描述成已运行。

## 当前基线
日期：2026-10-19（TASK-012更新）。TASK-001实现自包含历史证据池和标准库读取器，TASK-002建设命名与治理；TASK-003对照进展并建立独立公开代码快照。真实数据驱动的课程仿真、评分、师生身份和公众教学发布未实现；TASK-012在既有LAN托管上重建六阶段交互工作台，并接入服务器端Qwen辅导。所有路径相对于本项目根目录，受限私有原件不进入公开Git。

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
| src/flavoglycolab/evidence/ | data/derived/v3/records.json, data/registries, metadata/active.json | 只读记录/来源登记、SHA核验与候选状态 | active local read-only | 不计算产率；拒绝工作区外路径 |
| src/flavoglycolab/chemistry/ | 候选分子、结构与原始文献 | 结构身份、糖连接/反应方向/角色校验 | scaffold | 需来源证据与人工复核 |
| src/flavoglycolab/experiment/ | 教师审定的条件与数值 | D1仿真状态、取样与结果反馈 | scaffold | 无经准入观测不得合成数值 |
| src/flavoglycolab/teaching/ | 课程步骤、案例与人工教学决议 | 学习进程、评分依据、教学指导 | scaffold | 24步仍属规划 |
| src/flavoglycolab/platform/ | 访问鉴权与审定内容 | 学生/教师服务与审计接口 | scaffold | 未实现公开服务 |
| frontend/student/ | 非数值候选路线、学生方案、明确标识的Qwen回复 | 六阶段过程演练、本地记录与导出 | active LAN prototype，TASK-012 | 不读取私有证据、不生成真实观测/评分；AI不修改学生方案 |
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
| iLab政策 | docs/policy/ilab-2026/ | yes | scaffold |
| 学生/教师界面 | frontend/ | yes | student交互实验台LAN托管；teacher仍scaffold，无正式教学评分/发布 |
| 工作台工程守卫 | tests/test_workbench_state.mjs、tests/test_workbench_browser.mjs、tests/test_lab_server.py | yes | 流程/持久化/API/浏览器；旧test_frontend_scaffold.mjs转入当前测试，历史验收保留 |
| 工作台产品设计 | docs/design/workbench.md | yes | 六阶段交互、24步需求映射、实时AI职责与真实仿真后续依赖 |
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
