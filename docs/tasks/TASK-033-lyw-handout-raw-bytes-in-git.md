# TASK-033：三份LYW原始交件按登记SHA原样入库（修复干净检出SHA失配与CI红）

## 合同元数据

- 任务ID：TASK-033（本仓库正式编号；TASK-028—032 随 1bedaa4 同步提交后其 CI 复红的根因修复）
- 状态：Completed（2026-10-23 实施与验证完成；批准来源 human_direct；实际改动与验收分母以 [REPORT-033](../reports/REPORT-033-lyw-handout-raw-bytes-in-git.md) 为准；三状态门不晋级）
- 基线分支：`main`；基线提交：`1bedaa4`（TASK-028—032 同步提交；其 CI run 39934879636 与 2704edd 的 39838205559 public-check 三平台失败，根因即本任务）
- 授权来源：human_direct。所有者 2026-10-23 指示“完成各 task 尚未完成的内容，做完之后登记同步，然后 git 同步提交”；同步提交的 CI 复红属该同步的未完成项，根因修复为使同步可验证的必要内容。
- 人工负责人：龙锦轩（LJX）；执行者：Cano
- 修改预算（逐路径允许清单）：`.gitattributes`（追加 3 条 `-text` 规则）、`docs/p10ns/261019/24step_teaching_matrix_LYW_v2.md`、`docs/p10ns/261019/b2_shotlist_LYW_v1.md`、`docs/p10ns/261019/evaluation_rubric_LYW_v1.md`（仅 Git 存储字节恢复为原件，磁盘字节零改动）、`docs/tasks/TASK-033-lyw-handout-raw-bytes-in-git.md`、`docs/reports/REPORT-033-lyw-handout-raw-bytes-in-git.md`、`docs/tasks/README.md`、`docs/reports/README.md`、`STATE.md`、`PROGRESS.md`
- 关联ADR：无新增（执行 AGENTS.md 既有“原始来源字节不可静默修改”原则，不构成新设计决定）

## 目标

使任何干净检出的 `docs/p10ns/261019/` 三份 LYW 交件字节与 `frontend/student/content/demo-content.json` 登记的原件 SHA 一致，消除 `tests/test_quest_state.mjs` test 27 在干净检出的必然失败与 CI public-check 三平台红；原件磁盘字节与登记 SHA 均零改动。

## 背景与已核实事实

| 来源 | 事实 / 对本任务的影响 |
| --- | --- |
| CI run 39838205559（2704edd）与 39934879636（1bedaa4） | public-check（ubuntu/macos/windows）失败于同一断言：`tests/test_quest_state.mjs:156` test 27，actual=`f3e3ccb0…`（检出文件 SHA）≠ expected=`eb734a44…`（规范化后的旧 Git blob SHA）；browser job 通过 |
| `git ls-files --eol` | 三文件 `i/lf w/crlf attr/text eol=lf`：`.gitattributes` 的 `*.md text eol=lf` 在提交时把磁盘 CRLF 原件规范化为 LF blob；磁盘原件未被 git 改写（status clean 仅因 clean 过滤后相等） |
| `frontend/student/content/demo-content.json` | `science_matrix.source_sha256=f3e3ccb0…` 锚定所有者原件（磁盘 CRLF）字节——登记正确，不得改登记迁就 Git |
| 干净 worktree@2704edd 实测 | `npm test` 68/69 复现（Linux，Node v22.23.1），失败与平台无关、与 TASK-028—032 改动无关 |
| 同类隐患 | `b2_shotlist_LYW_v1.md`、`evaluation_rubric_LYW_v1.md` 同为 `w/crlf`，暂无 SHA 断言，属同源失真，一并修复 |

## 范围

### 允许项

- `.gitattributes` 在通用规则之后追加三行 `-text`（仅限上述三路径）；对三文件执行 `git add --renormalize` 使 blob 恢复为磁盘原件字节。
- 本合同、同号 REPORT、双索引、STATE.md、PROGRESS.md 的登记。

### 禁止项

- 不修改三文件的磁盘字节；不修改 `demo-content.json` 的任何登记 SHA；不触碰 data/raw、data/derived、data/private、data/registries 与 metadata 登记文件；不触碰三个状态门。

### 涉及目录及文件职责

| 唯一职责 | 允许修改的精确路径 | 改动边界 |
| --- | --- | --- |
| 原件字节保全 | `.gitattributes`、三份 LYW 交件 | 仅 Git 存储表示恢复原件；磁盘零改动 |
| 任务与闭环 | 本合同、REPORT-033、双 README、STATE.md、PROGRESS.md | 登记 |

## 非目标

不为其余 `i/lf w/lf` 文件扩规则；不引入对全部交件的 SHA 断言；不处理 CI 的 Node 20 deprecation 警告；不推进任何状态门。

## 必须执行的操作

1. 记录三文件改动前磁盘 SHA（证据入 REPORT-033）。
2. `.gitattributes` 追加三行 `-text`；`git add --renormalize` 三文件；核对 index blob SHA == 磁盘原件 SHA（v2 教学矩阵另有登记 SHA 断言，一并核对）。
3. TASK-033/REPORT-033 登记对、双索引、STATE、PROGRESS。
4. 验证：干净 worktree `npm test` 69/69；`python3 scripts/dev.py check` 全绿；冻结根快照 0 差异；提交并推送后核验 CI。

## 验收标准

- [ ] 干净检出 `npm test` 69/69（test 27 通过）。
- [ ] 三文件磁盘 SHA 改动前后一致；`demo-content.json` 零改动；index blob SHA 恢复为原件字节。
- [ ] `dev.py check` 全绿；冻结根 0 差异。
- [ ] 推送后 CI public-check 三平台通过。

## 验证

    sha256sum docs/p10ns/261019/24step_teaching_matrix_LYW_v2.md   # 前后一致
    git ls-files --eol docs/p10ns/261019/24step_teaching_matrix_LYW_v2.md   # i/crlf w/crlf attr/-text
    git worktree add --detach /tmp/fgl-verify <HEAD> && (cd /tmp/fgl-verify && npm test)   # 69/69
    python3 scripts/dev.py check

## 停止条件

- renormalize 后 index blob SHA ≠ 磁盘原件 SHA 或 ≠ 登记 SHA（字节链断裂）→ 立即停止并报告，不得以改登记 SHA 的方式凑数。
- 干净检出仍有非相关失败且无法归因 → 停止并报告。

## 报告要求

必须生成 docs/reports/REPORT-033-lyw-handout-raw-bytes-in-git.md（即使 Partial/Blocked/Failed），报告实际状态并更新 STATE/PROGRESS。不要自动执行下一 TASK。
