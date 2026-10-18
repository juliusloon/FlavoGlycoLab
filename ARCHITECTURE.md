# FlavoGlycoLab 当前架构与工件责任表

本文件是当前职责与工件归属规范。当前已实现与计划内容必须分开；不存在的接口不被描述成已运行。

## 当前基线
日期：2026-10-16。TASK-001实现自包含历史证据池和标准库读取器，TASK-002建设命名与治理；TASK-003对照进展并建立独立公开代码快照。课程模拟、评分、师生前端、AI服务和公网教学发布均未实现。所有路径相对于本项目根目录，受限私有原件不进入公开Git。

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
           student UI / teacher UI                [planned]

重要：箭头指计划消费方向，不代表模块已通过科学/服务就绪验收。审批/许可守卫横切每个消费端。

## 模块责任表

| 所有者/模块 | 输入 | 输出 | 当前状态 | 约束 |
| --- | --- | --- | --- | --- |
| src/flavoglycolab/evidence/ | data/derived/v3/records.json, data/registries, metadata/active.json | 只读记录/来源登记、SHA核验与候选状态 | active local read-only | 不计算产率；拒绝工作区外路径 |
| src/flavoglycolab/chemistry/ | 候选分子、结构与原始文献 | 结构身份、糖连接/反应方向/角色校验 | scaffold | 需来源证据与人工复核 |
| src/flavoglycolab/experiment/ | 教师审定的条件与数值 | D1仿真状态、取样与结果反馈 | scaffold | 无经准入观测不得合成数值 |
| src/flavoglycolab/teaching/ | 课程步骤、案例与人工教学决议 | 学习进程、评分依据、教学指导 | scaffold | 24步仍属规划 |
| src/flavoglycolab/platform/ | 访问鉴权与审定内容 | 学生/教师服务与审计接口 | scaffold | 未实现公开服务 |
| frontend/student/ | 已审定可公开的教学API | 学生交互 | scaffold | 禁止访问raw/derived/private |
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
| 三篇指定文献PDF | data/raw/literature/；路径/SHA唯一登记在scripts/export_public_repository.py的PUBLIC_PDFS | yes，human_direct例外 | 原字节公开，rights_verified=false，不作为教师批准 |
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
| 校内沟通唯一记录 | docs/p10ns/261019/communication_log.md | 待许可核查后按内容决定；不公开个人信息/回执原件 | planned，010仅准备问题与记录框；实际回复后续由责任人确认；F0—F4矩阵引用此处，不复制回复真值 |
| LJX申报技术分段 | docs/p10ns/261019/shenbaoshu_sections_LJX.md | 原创准备稿可纳入，提交/同步另授权 | planned，010底稿；沟通①/T-H2/实测后方可定稿 |
| 站会唯一记录 | docs/p10ns/261019/standup_log.md | 按实际内容与授权决定 | planned，010模板；真实参会/交接不预填 |
| 申报实施基线、主机实况、技术目标与F0—F4条件汇总 | docs/policy/ilab-2026/readiness-evidence-2026.md | 原创非数值/脱敏汇总可登记；原凭据按许可决定 | active document，TASK-006；唯一维护活跃目标与替换凭据，引用沟通记录，不替代教师审定。Ubuntu已选，未部署，性能值null；TASK中的目标表只为事前快照 |
| 学生本地演示内容 | frontend/student/content/demo-content.json | 原创非数值规划文本可纳入，提交/同步另授权 | planned，011；仅演示内容及来源指纹，不作案例准入、观测或教学真值副本 |
| iLab政策 | docs/policy/ilab-2026/ | yes | scaffold |
| 学生/教师交互 | frontend/ | yes | scaffold |
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

所有者明确指令“三篇PDF也要公开”。`data/raw/literature/`中的三个已提交PDF按`PUBLIC_PDFS`（`scripts/export_public_repository.py`）登记的精确路径及SHA公开；其余raw/derived/private仍不公开。这是human_direct范围决定，出版方rights_verified=false，不追认为教师审定或全数据授权，PDF不适用本项目原创代码/文档许可。原件不改，原案例表仍脱敏。

`PUBLIC_PDFS`仍是三篇PDF路径/SHA例外的唯一登记。当前main直接同步public/main，scripts/publish.py仅保留普通push兼容入口；temp/public-repository已不作为日常依赖。
