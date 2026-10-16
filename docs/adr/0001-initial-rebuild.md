# ADR 0001：FutureHealth 新建仓库与受控迁移策略

- 状态：accepted（agent_delegated；所有者授权 Cano 代行批准，human_reviewed=false）
- 日期：2026-10-15
- 负责人：Cano（执行）；所有者（授权）

## 背景

FlavoRetro 是已承载活跃科研状态的既有项目（65,702 个文件、大量未提交科研资料、科学账本与冻结资产）。其 `outputs/restructure/future-health-20261015` 预迁移包给出 M0—M5 重建路线，明确要求：全新隔离目录、只复制批准子集、不修改旧库；教学建设（24 步课程、D1 仿真、平台与发布）必须与科研状态隔离；P1 资料须人工/专业审查后选入。

## 决定

1. 新项目定名 **FutureHealth**，位于 `/home/ljx/FutureHealth`（与 FlavoRetro 同级），建立独立 Git 仓库，不继承旧 Git 历史。
2. P0 的 23 个 CORE_REUSE 文件以 `reference/flavoretro-snapshot/` 受控参考副本迁入：保持原相对路径、逐文件 SHA256 对照 VERIFIED_PRIORITY_HASHES.csv 验证；它们不是新运行时，任何复用需新合同。
3. P1 的 49 项 SELECTIVE_REVIEW 只登记待审（`migrations/p1_pending_review.csv`），教师/所有者审定前不复制内容。
4. 数据边界：`data/private/` 与参考副本的 data/metadata 层不入 Git；登记表（路径/哈希/许可门）可入 Git。
5. 三套状态门分离：research_evaluation（旧库承载，本仓库不触碰）、teaching_case_review（全部 pending_teacher_review）、public_teaching_release（未启动）。

## 备选方案

- 在 FlavoRetro 内新建子目录改造：否——违反预迁移包「全新隔离目录」要求，且会把教学写入混入科研事实源。
- 立即复制 P1 资料以加快进度：否——P1 明确要求人工/专业审查后选入；agent 代审不构成教师审定，本轮以「登记不复制」执行。
- 直接以 v3 数据作为教学开放库：否——v3 的 3,059 条是内部候选筛选池，教学版只允许带审定子集。

## 影响与风险

- 旧库继续承载科研状态；两库对应关系由 `migrations/` 与预迁移包登记。
- 风险：参考副本被误当作可运行系统 → README/ADR/映射三处声明「非运行时」。
- 风险：许可未清前误分发 → Git 边界 + license_gate 列 + 发布门（M5）前置。
- 风险：把历史产率/结构命中当教学真值 → case_admission 全行 pending_teacher_review，M2 前禁用。

## 复审条件

进入 M1（结构复核）或任何 P1 复制前；所有者变更项目名/位置或许可门；预迁移包被修订。
