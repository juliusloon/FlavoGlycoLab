# TASK-034：JS MIME断言按守卫意图放宽（修复Windows CI红，不改服务端）

## 合同元数据

- 任务ID：TASK-034（本仓库正式编号；TASK-033 修复推送后 CI run 39936328472 中 windows-latest 仍红的另一处既有缺陷）
- 状态：Completed（2026-10-23 实施与验证完成；批准来源 human_direct；实际改动与验收分母以 [REPORT-034](../reports/REPORT-034-js-mime-guard-platform-variance.md) 为准；三状态门不晋级）
- 基线分支：`main`；基线提交：`520d2a5`（TASK-033 修复提交；其 CI run 39936328472：browser/ubuntu/macos 转绿，windows 失败）
- 授权来源：human_direct。所有者 2026-10-23 指示“完成各 task 尚未完成的内容，做完之后登记同步，然后 git 同步提交”；同步链路的 CI 全绿属未完成项。
- 人工负责人：龙锦轩（LJX）；执行者：Cano
- 修改预算（逐路径允许清单）：`tests/test_lab_server.py`（仅 test_case_page_and_route_figure_are_served_same_origin 的 JS MIME 断言）、`docs/tasks/TASK-034-js-mime-guard-platform-variance.md`、`docs/reports/REPORT-034-js-mime-guard-platform-variance.md`、`docs/tasks/README.md`、`docs/reports/README.md`、`STATE.md`、`PROGRESS.md`、`docs/reports/REPORT-033-lyw-handout-raw-bytes-in-git.md`（补 CI 实测追记一行）
- 关联ADR：无新增

## 目标

消除 Windows 上 `test_case_page_and_route_figure_are_served_same_origin` 因 Python `mimetypes` 平台差异（`.js` → `application/javascript`，Linux/macOS 为 `text/javascript`）造成的必然失败；守卫意图（JS 以合法 MIME 同源提供）不变；不改服务端、不重启 8766。

## 背景与已核实事实

| 来源 | 事实 / 对本任务的影响 |
| --- | --- |
| CI run 39936328472（520d2a5） | windows-latest 失败：`AssertionError: 'text/javascript' not found in 'application/javascript' : /case-page.js`（tests/test_lab_server.py:135）；browser/ubuntu/macos 通过 |
| 失败历史 | 该缺陷随 TASK-024 新增 case-page.js 进入仓库，2704edd 首次 CI 接触即红（当时被 test 27 的 ubuntu/macos 失败掩盖归因） |
| cano 实测 | 本机 `mimetypes.guess_type('case-page.js')` → `('text/javascript', None)`，故本地从未复现 |
| 断言现状 | 测试对 4 个 `.js` 路径硬断言 `text/javascript` 子串；`text/javascript`（RFC 9239 标准）与 `application/javascript`（Windows 注册表遗留）均为浏览器接受的合法 JS MIME |

## 范围

### 允许项

- `tests/test_lab_server.py` 上述测试的 JS MIME 断言放宽为 `javascript` 子串（同时匹配两种合法值），并加平台差异注释。
- 本合同、同号 REPORT、双索引、STATE.md、PROGRESS.md 登记；REPORT-033 补一行 CI 实测追记。

### 禁止项

- 不修改 `scripts/serve_lab.py`（8766 无需重启）；不修改前端文件；不修改其余测试断言；不触碰冻结根与三个状态门。

### 涉及目录及文件职责

| 唯一职责 | 允许修改的精确路径 | 改动边界 |
| --- | --- | --- |
| 守卫平台差异修正 | `tests/test_lab_server.py` | 仅该测试 JS MIME 断言 |
| 任务与闭环 | 本合同、REPORT-034、双 README、STATE.md、PROGRESS.md、REPORT-033 追记 | 登记 |

## 非目标

不为其他 MIME 类型扩规则；不把断言改为完全不限（仍要求 `javascript` 子串）；不在服务端做 MIME 归一（如所有者希望服务端确定性输出，另行 TASK）；不推进任何状态门。

## 必须执行的操作

1. 修改该测试的 JS 断言为 `javascript` 子串并注释平台依据。
2. 登记（本合同、REPORT、双索引、STATE、PROGRESS、REPORT-033 追记）。
3. 验证：`python3 scripts/dev.py check` 全绿；`npm test` 不受影响；冻结根 0 差异；提交推送后 CI 四 job 通过。

## 验收标准

- [ ] `dev.py check` 全绿；冻结根 0 差异。
- [ ] 推送后 CI 四 job（browser + 三平台 public-check）全部通过。

## 停止条件

- 若修后 CI 仍有失败且根因不在本任务改动内 → 停止并如实登记。

## 报告要求

必须生成 docs/reports/REPORT-034-js-mime-guard-platform-variance.md，报告实际状态并更新 STATE/PROGRESS。不要自动执行下一 TASK。
