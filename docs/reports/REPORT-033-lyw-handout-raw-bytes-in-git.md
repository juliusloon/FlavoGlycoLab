# REPORT-033：三份LYW原始交件按登记SHA原样入库（修复干净检出SHA失配与CI红）

- 任务：[TASK-033](../tasks/TASK-033-lyw-handout-raw-bytes-in-git.md)（human_direct，2026-10-23）
- 状态：Completed（2026-10-23 实施与验证完成；三状态门不晋级）
- 执行者：Cano；人工负责人：龙锦轩（LJX）
- 基线：`main`@`1bedaa4`（TASK-028—032 同步提交）

## 根因（实测链）

1. CI run 39838205559（2704edd）与 39934879636（1bedaa4）public-check 三平台失败于 `tests/test_quest_state.mjs:156` test 27：actual `f3e3ccb0…` ≠ expected `eb734a44…`；browser job 均通过。
2. 干净 worktree@2704edd（Linux/Node v22.23.1）`npm test` 68/69 复现 → 与平台无关、与本批 028—032 改动无关。
3. `git ls-files --eol`：三文件 `i/lf w/crlf attr/text eol=lf`——`.gitattributes` 的 `*.md text eol=lf` 在 TASK-020 首次提交这些交件时把磁盘 CRLF 原件规范化为 LF blob；`demo-content.json` 登记的 `science_matrix.source_sha256=f3e3ccb0…` 锚定所有者原件字节（磁盘文件从未被 git 改写，status clean 仅因 clean 过滤后相等）。
4. 结论：Git 存储表示失真，登记与磁盘原件正确；修复必须让 blob 恢复原件字节，不得改登记。

## 实际改动

| 文件 | 改动 |
| --- | --- |
| `.gitattributes` | 追加 3 行：三份交件 `-text`（原件字节保全，置于通用规则之后） |
| `docs/p10ns/261019/24step_teaching_matrix_LYW_v2.md` | 仅 Git blob：eb734a44… → f3e3ccb0…（=登记 SHA=磁盘原件）；磁盘零改动 |
| `docs/p10ns/261019/b2_shotlist_LYW_v1.md` | 仅 Git blob → 1052c864…（=磁盘原件）；磁盘零改动 |
| `docs/p10ns/261019/evaluation_rubric_LYW_v1.md` | 仅 Git blob → 31d8b1b5…（=磁盘原件）；磁盘零改动 |
| 登记 | 本报告、TASK-033 合同、双 README、STATE.md、PROGRESS.md |

## 验证（2026-10-23 远程实测）

- 磁盘 SHA 改动前后一致：v2 教学矩阵 `f3e3ccb0d29be0e1c57bde0fdd41311d5ab4e3a99b9ad8e3ebddea1995e3f74d`、b2_shotlist_LYW_v1 `1052c864275eecfb3b0a57e2a111abafa67f2b90b557b73a85db79655877abf9`、evaluation_rubric_LYW_v1 `31d8b1b558a3616b279f1b25593c4bf29e8d934e42cd266391d4895454b230da`（三文件 sha256sum 前后比对一致）。
- index blob SHA == 磁盘原件 SHA；`git ls-files --eol` 三文件 `i/crlf w/crlf attr/-text`。
- 干净 worktree@修复后 HEAD：`npm test` **69/69**（test 27 通过，Node v22.23.1）。
- `python3 scripts/dev.py check`：exit=0 全绿（治理配对含 033 对）。
- 冻结根快照 170 文件前后 0 差异。
- 推送后 CI 复核：见同日修复提交的 Actions run。

## 偏差与登记

- 无预算外文件。`.gitattributes` 规则严格限定三路径；未来所有者新交件若为 CRLF 原件，建议按同方式登记 `-text`（登记为建议，不自动扩大）。
- 三状态门不晋级；teaching_case_review 仍 22/22 待审。

## 未解决问题

1. CI 的 Node 20 deprecation 警告（actions 被 Node 24 强制运行）未处理。
2. 若所有者后续希望对全部 docs/p10ns 交件建立 SHA 断言，需另行 TASK（涉及登记面扩大）。
