# REPORT-031：导入三幕改为单幕两区顺序呈现（左内容 · 右问题）

- 任务：[TASK-031](../tasks/TASK-031-intro-single-act-two-zone.md)（human_direct）
- 状态：**Completed（原会话自验收口，2026-10-23 17:4x CST）**。本报告含两段事实：§1 原执行会话（031，Cano）的实现与自验；§2 暂停期间 TASK-029 会话的代登记记录（保留为历史，其验证分母为当时组合树状态，与本任务终态一致）。
- 基线：`main`@`2704edd2c0eda071a4b21a093a7e25689c580728`（工作树共享，含 TASK-028/029/032 在途改动；本任务与 029/032 的改动同树共存，最终组合树已一并验证）
- 授权来源：human_direct（所有者 2026-10-23 指令「导入三幕不要从上到下，改成和后面任务一样：先只展示第一幕，右边是问题，完成之后进入下一幕」；同日指示暂停验收等待并行会话收尾、随后 continue）

## §1 原会话实现与自验（最终事实）

### 实际改动

| 文件 | 改动 |
| --- | --- |
| `frontend/student/views/inquiry.js` | `explorationScene` 重写为单幕两区：任一时刻仅渲染当前幕（左叙事 + 右 `task-rail` 问题/门禁），删除 `.act-locked` 纵向堆叠占位；幕三保留 `.gate-row` 供论文对话框关闭后的门禁重渲染钩子；幕一保留 3Dmol、幕三三张论文卡移入左区（窄列单列横排） |
| `frontend/student/app.js` | 新增内存态 `introShowAct`（不入 localStorage）：答对幕一/二停在本幕显示成功反馈＋「进入下一幕」按钮，`intro-advance` 点击后回默认显示 `progress.step` 幕；openTask/goStage/replay-intro/新实验路径重置；答错 retry 语义不变 |
| `frontend/student/styles.css` | 末尾追加 TASK-031 规则块（约 20 行）：rail 内问题/门禁布局、幕三论文卡窄列单列横排、≤620px 全宽堆叠 |
| `tests/test_inquiry_browser.mjs` | 导入断言改单幕顺序语义：`completeIntro`（开场仅幕一且无占位 → 答对出反馈+`intro-advance` → 点击换幕 → 幕二答对推进 → 幕三门禁）、开场检查、幕三检查（`.intro-act` 同屏为 1） |
| 未改 | `lab-state.js`（状态机零字节改动）、`demo-content.json`、`index.html`、PROGRESS.md |

### 原会话自验（2026-10-23 17:12—17:39，最终组合树）

| 检查 | 命令 | 结果 |
| --- | --- | --- |
| Python 全套 | `python3 scripts/dev.py check` | exit=0，OK（skipped=3 显式 research 门禁），治理配对恢复全绿 |
| Node 单测 | `npm test` | 69/69 |
| 工作台浏览器合同 | `npm run test:browser`（Chromium 153.0.8010.12，`FRONTEND_URL=http://127.0.0.1:8768/`、`FLAVOGLYCOLAB_LIVE_AI=1`、`CHROMIUM_EXECUTABLE=~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`） | **975/975**（含本任务改写的 completeIntro/开场/幕三断言，三视口×三路线；console/外联 0） |
| 数据页浏览器合同 | `npm run test:data-browser`（同环境） | 68 checks、consoleErrors 0、externals 0 |
| 冻结根保护 | `temp/task-031/snapshot_protected.py` 前后比对（170 文件，sha256+size，排除 `._*`/.DS_Store） | **0 差异** |
| 服务卫生 | 8768 验证服务起停两次 | 已停止、端口释放；8766 未触碰（其 15:35 重启属 TASK-032） |
| 证据 | `temp/task-031/`（Git 忽略） | protected-before/after.json、dev-check.log、serve-8768(-2).log、test-browser.log、test-data-browser.log、shots.mjs、intro-act1(-retry/-done)/act2/act3.png 五张截图 |

### 过程偏差（如实登记）

1. **temp/task-031 一度丢失**：原会话 15:2x 曾建 temp/task-029→030→031（随两次让号改名）并存有 15:2x 的 170 文件保护基线；17:09 恢复核时时目录已不存在（谁清理的无法归因，不作断言；TASK-029 会话代登记时也记录了「该目录未创建」的观察）。收口时以**收口窗口内的新前后快照对**替代：验证全程只读，前后 0 差异证明本窗口对冻结根无写入；15:2x—17:0x 之间窗口的清白由 TASK-029（保护170/170）与 TASK-032（保护170/170）各自报告覆盖。
2. **注释标签遗漏一处**：代登记统一改注为 TASK-031 时遗漏 `app.js:16` 的行尾注释（仍标 TASK-029），收口时补正为 TASK-031（纯注释，node --check 通过）。
3. **浏览器套件两次启动失败**：`CHROMIUM_EXECUTABLE=chromium-1243` 与 `…/chrome-linux/chrome` 均非有效路径，第三次以 `…/chrome-linux64/chrome` 全路径成功；已记入本报告供后续会话直接复用。
4. **对 TASK-032 的顺带覆盖**：本轮 975+68 为 032 报告中「待并行会话收口后补跑」的联合全量验收提供了实际分母（同树最终状态），032 收口可直接引用。

### 非目标与未做项

- 已完成幕的回看导航（stepper 仅进度指示）——合同登记的未做项，维持未做。
- ≤900px 沿用 task-view 单列堆叠，无专门移动端重排；overflow 检查由三视口套件覆盖。
- 三状态门不晋级：research_evaluation 候选、teaching_case_review 22/22 待审、public_teaching_release not_started。

## §2 代登记历史（TASK-029 会话，2026-10-23 17:05，保留存档）

> 以下为暂停期间 TASK-029 会话按所有者「continue」指示代登记的内容，验证分母为 16:47—17:03 的组合树；其改动事实与 §1 一致，验证结论已被 §1 的最终自验覆盖。

- 组合树实测：`npm run test:browser` **975/975**（含本任务断言）、`npm test` 69/69、`npm run test:data-browser` 68/68；`dev.py check` 当时唯一失败为「031 有合同无报告」的治理配对项（即该代登记补上的缺口，本报告落盘后 dev.py check 已全绿）。
- 代登记时统一修正四处代码注释标签（inquiry.js:29、app.js:236、app.js:319、styles.css:285）TASK-029→TASK-031（§1 偏差 2 为其遗漏处的补正）。
- 代登记边界：原会话暂停未自行收口；本报告当时标注 Partial（代登记），现由 §1 取代为 Completed。
