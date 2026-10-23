# REPORT-032：论文卡在线阅读 PDF 可用性落地与两处文案删除（含 LAN 服务进程更新）

## 对应任务
- TASK文件：[TASK-032](../tasks/TASK-032-paper-pdf-online-reading.md)（原拟 TASK-029、短暂改名 031，因多会话并发撞号改定 032，历史见合同元数据）
- 状态：Completed（2026-10-23 联合全量验收补跑通过后收口；代码改动、8766 服务重启与端点验证此前已完成，收口仅改状态与验收表，未改代码）
- 基线提交与分支：`main` @ `2704edd2c0eda071a4b21a093a7e25689c580728`（工作树含 TASK-028 未提交改动，以及并行会话 TASK-030/031 进行中改动；本报告只登记本任务 span）
- 结果提交：已按所有者 2026-10-23 human_direct 指示随当日同步提交入库（收口登记与本提交同批）
- 授权来源：human_direct（所有者 2026-10-23 会话指令，原文见合同；并发协调方式经所有者当日选择："现在重启 8766，我改号 TASK-031（推荐）"——即立即重启、本任务改号让位、联合验收延后）

## 改动文件与职责

| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 论文视图渲染 | `frontend/student/views/inquiry.js` | paper-view（研究对话框"论文 PDF 与要点"）删除指定两处：`新标签页打开 PDF` 链接与 `PDF 按所有者指定公开（TASK-008 例外），出版方再利用权利未核验，请勿二次分发。` 整段；`在线阅读论文 PDF` 按钮与 `.paper-panel` 内嵌 iframe 保留；论文解读卡（:88 一带）未动 |
| 交互与提示文案 | `frontend/student/app.js` | togglePaper 三条消息去掉"新标签页（链接）"引用：无面板 toast、8 秒慢加载提示（→"加载较慢；若持续无显示，请稍后重试。"）、加载失败错误态（→"此入口暂未提供论文 PDF 在线阅读。"） |
| 浏览器工程守卫 | `tests/test_inquiry_browser.mjs` | 4 处同步：paperPanel 的 `.paper-scope` 断言改为对话框内计 0；成功态与降级态的 `.paper-actions a[href]` 断言 1→0；慢加载断言改含"稍后重试"且无回退链接；解读卡链接断言（计 1）未动 |
| 任务与闭环 | `docs/tasks/TASK-032-paper-pdf-online-reading.md`、本报告、`docs/tasks/README.md`、`docs/reports/README.md`、`STATE.md` | 登记 |
| 过程证据（不入 Git） | `temp/task-032/` | protected-before/after.json（170 文件快照）、precheck-8769.log |

注：`git diff` 中 app.js/inquiry.js/tests 还含并行会话 TASK-031（introShowAct 导入单幕两区）改动，不属于本任务；本任务实际改动以上表 span 为准。

## 实际操作与观察

1. 根因实测：8766 常驻进程 2026-10-19 21:40 启动（早于 TASK-022 论文端点），`curl -I http://127.0.0.1:8766/api/paper/Pei2019` → 404；该服务静态文件逐请求读盘，前端已是新版——形成"按钮在、点击必失败"。8767 为另一项目 flavoretro 进程，与本站无关。
2. 前端改动如上表；所有者点名两句为 paper-view 专属，删除后实测服务出的 inquiry.js 中 `新标签页打开 PDF` 0 次、`PDF 按所有者指定公开（TASK-008 例外）…请勿二次分发` 0 次（现存 1 次"请勿二次分发"属解读卡不同句子，见未改问题 1）。
3. 8769 预检（与 systemd 同款 `/usr/bin/python3 -I -u scripts/serve_lab.py`，Python 3.12.3）：`/api/health` 200 live、三份论文 HEAD 200 application/pdf、GET 首 5 字节 `%PDF-`、`/` 200。日志 `temp/task-032/precheck-8769.log`；其中 BrokenPipeError 为验证命令 `head -c` 提前断开连接所致，非服务缺陷。
4. 2026-10-23 15:35:21 CST 执行 `systemctl --user restart flavoglycolab-lan.service`；重启后：服务 active（新 PID 3626852）、`/api/health` 200、三份 HEAD 200 application/pdf、GET `%PDF-`、`/` 200。旧进程（2026-10-19 起）被替换。
5. 期间发现两个并行会话同树施工并两次 TASK 撞号（029、031），按所有者选择：本任务立即重启服务并改号 TASK-032，联合全量验收延后至 TASK-030/031 收口后补跑。

## 验证

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| 重启前 8766 端点 | `/api/paper/Pei2019` HEAD → 404（旧进程无端点） |
| 8769 预检（同款解释器） | health 200；3/3 HEAD 200 application/pdf；GET `%PDF-`；`/` 200；日志 temp/task-032/precheck-8769.log |
| 重启后 8766 端点 | 服务 active；health 200；Pei2019/Zhang2015/Niu2024 HEAD 3/3 application/pdf；GET `%PDF-`；`/` 200 |
| 服务出前端内容 | inquiry.js：点名两句 0 次；`在线阅读论文 PDF</button></div><div class="paper-panel"` 存在；`.paper-scope` 仅解读卡 1 处 |
| `npm test` | 69/69 通过（node 套件仅 import lab-state/learning-state/views/workbench，与两会话正在改的 app.js/inquiry.js 无耦合，结果可归属） |
| 保护快照 | 170 文件 sha256+size 前后 0 差异（temp/task-032/protected-before/after.json） |
| 联合补跑（2026-10-23 17:32—17:38，独立验证会话，最终组合树，验证服务 8771 起停） | `dev.py check` exit=0（Python OK skipped=3 显式 research 门禁，`test_task_report_pair_ids_and_slugs` ok）；`npm test` 69/69；`npm run test:browser` 975/975（Chromium 153.0.8010.12、Node v22.23.1、`FLAVOGLYCOLAB_LIVE_AI=1`、`CHROMIUM_EXECUTABLE=~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`）；`npm run test:data-browser` 68/68（consoleErrors 0、externals 0）。干净克隆验收仍未执行 |

## 与任务合同的偏差

- 任务编号 029→032（两次撞号让位，过程记录于合同元数据）。
- 验收顺序偏差：`dev.py check`/`test:browser`/`test:data-browser` 未在本任务内执行（所有者指示延后，避免与并行会话中间态混淆归因）；其余操作按合同执行。

## 数据、许可与审核门

- research_evaluation：不变（历史候选）；teaching_case_review：22/22 待审，教师批准 0；public_teaching_release：not_started。
- 三篇 PDF 出版方 rights_verified=false 不变；删除页面两句文案不改变 metadata/public_sources.json 登记、TASK-008 例外范围或许可状态；端点守卫（仅三份登记 id、启动 SHA 校验、降级 503）未改。

## 已发现但未改的问题

1. 论文解读卡（learning 视图）仍保留 `新标签页打开 ↗` 链接与"解读为导师机器整理 · 待教师审定；PDF 公开范围见 TASK-008 例外，请勿二次分发。"——不在所有者点名两句范围内，保留；是否随删由所有者决定。
2. docs/operations/lan-site.md"仓库、私有配置、PDF和来源原件均不经此服务提供"一句自 TASK-022 起与实际不符（`/api/paper` 按登记提供三份 PDF），未改。
3. iOS 等不支持 iframe 内嵌 PDF 渲染的浏览器兼容未处理（当前依赖浏览器原生 PDF 查看器；如需可另立任务引入本地 PDF.js）。
4. 多会话并发同树施工已造成两次 TASK 撞号与文件交错写入；建议后续任务串行化或约定编号分配方式。

## 遗留风险、仓库与CI

- 8766 已于 2026-10-23 15:35:21 CST 重启，当前进程加载的是已提交（TASK-027 版）serve_lab.py，工作树未改该文件；此前其他任务/合同中"8766未重启"的表述自本时刻起不再成立。
- 工作树含多个会话未提交改动（TASK-028/030/031/032），未 commit/未 push；CI 未运行。（2026-10-23 追记：本批改动已按所有者 human_direct 指示随当日同步提交入库。）
- 联合验收已于 2026-10-23 补跑通过（975+68，见验证表），浏览器端守卫视为已验证。

## 建议的下一TASK

- [已完成 2026-10-23] TASK-030/031 收口后联合执行 `dev.py check` + `npm test` + `test:browser` + `test:data-browser` 全部通过，本任务已转 Completed（仅改状态与验收表，未改代码）。
- 修正 lan-site.md 论文端点描述；解读卡两句是否删除由所有者决定；如需跨浏览器 PDF 兼容再议本地 PDF.js。
