# FlavoGlycoLab 当前架构与工件责任表

本文件是当前职责与工件归属规范。当前已实现与计划内容必须分开；不存在的接口不被描述成已运行。

## 当前基线
日期：2026-10-16。TASK-001实现自包含历史证据池和标准库读取器，TASK-002建设命名与治理；TASK-003对照进展并建立独立公开代码快照。课程模拟、评分、师生前端、AI服务和公网教学发布均未实现。所有路径相对于本项目根目录，受限私有原件不进入公开Git。

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
| 来源原件/外部模型 | data/raw/legacy/ | no | local restricted |
| 派生候选记录与SQLite | data/derived/v3/ | no | local candidate |
| 私有教师待审候选 | data/private/review_candidates/ | no | local pending |
| 证据读取API | src/flavoglycolab/evidence/catalog.py | yes | active |
| 分子结构审核包 | docs/cases/isoquercitrin/ | yes | draft, not approved |
| 24步课程 | docs/curriculum/ | yes | scaffold |
| 背景研究（非状态/政策真值） | docs/research/ | yes | reference only |
| iLab政策 | docs/policy/ilab-2026/ | yes | scaffold |
| 学生/教师交互 | frontend/ | yes | scaffold |
| 迁移只读审计 | migrations/ | yes | frozen provenance (see notes) |
| 历史核心文件快照 | reference/flavoretro-snapshot/ | mixed | reference only, never runtime |
| 自动测试 | tests/ | yes | active engineering |
| 公开代码快照导出 | scripts/export_public_repository.py | yes | 仅导出已提交允许树；副本撤下未授权数值，不改本地原表 |
| 公开检出与过程暂存 | temp/public-repository/ | no | 独立Git根历史；仅此检出的main同步GitHub |

公开仓库与本地研究历史分离：本地case_admission原表保留未授权历史数值，不能直接推送本地main或旧分支。导出副本只改变historical_yield_raw及yield_status的公开呈现，保留来源定位、SHA、missing和待审状态；公开代码不改变三个状态门。

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
