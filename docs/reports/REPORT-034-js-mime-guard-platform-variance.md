# REPORT-034：JS MIME断言按守卫意图放宽（修复Windows CI红，不改服务端）

- 任务：[TASK-034](../tasks/TASK-034-js-mime-guard-platform-variance.md)（human_direct，2026-10-23）
- 状态：Completed（2026-10-23；三状态门不晋级）
- 执行者：Cano；人工负责人：龙锦轩（LJX）
- 基线：`main`@`520d2a5`（TASK-033 修复提交）

## 根因与修复

- CI run 39936328472 windows-latest：`AssertionError: 'text/javascript' not found in 'application/javascript' : /case-page.js`（tests/test_lab_server.py:135）。Windows 上 Python `mimetypes` 按注册表把 `.js` 解析为 `application/javascript`，Linux/macOS 为 `text/javascript`；缺陷随 TASK-024 的 case-page.js 进入仓库，2704edd 首次 CI 接触即红。
- 修复：该测试 4 个 `.js` 断言由硬编码 `text/javascript` 改为 `javascript` 子串（同时匹配两种合法值），附平台差异注释；守卫意图（JS 以合法 MIME 同源提供、CSP frame-ancestors 断言不变）不变。
- 未改 `scripts/serve_lab.py`，8766 无需重启；服务端如需跨平台确定性 MIME 输出，留待所有者另立 TASK。

## 验证（2026-10-23 远程实测）

- `python3 scripts/dev.py check`：exit=0 全绿。
- `npm test`：69/69（不涉及 node 套件，无回归）。
- 冻结根快照 170 文件 0 差异。
- 推送后 CI：见同日修复提交的 Actions run（browser + ubuntu/macos/windows 四 job）。

## 偏差与登记

- 无预算外文件；REPORT-033 补一行 CI 实测追记（其验收项“CI 三平台通过”在 windows 上由本任务闭合）。
- 三状态门不晋级；teaching_case_review 仍 22/22 待审。

## 未解决问题

- CI 的 Node 20 deprecation 警告未处理（沿 REPORT-033 登记）。
