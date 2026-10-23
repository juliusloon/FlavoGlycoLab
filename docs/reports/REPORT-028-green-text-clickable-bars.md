# REPORT-028：绿色文字可点元素改造为可点击 bar（含展开/收起箭头）

（全文简体中文；保留原始命令、字段、哈希和代码标识符。）

## 对应任务

- TASK文件：docs/tasks/TASK-028-green-text-clickable-bars.md
- 状态：Completed（工程验收完成；写入事故已当场修复并留证，见偏差节）
- 基线提交与分支：main，HEAD `2704edd2c0eda071a4b21a093a7e25689c580728`（TASK-015—027 已随该提交同步，启动时远程工作树 clean；本地 SMB 挂载侧 `git status` 的 228 项为 mode 位噪声、0 内容差异）
- 结果提交：pending（按合同不 Git 提交、不 push，工作树保留全部改动）
- 授权来源：human_direct（所有者 2026-10-23 会话明确指令“将整个网页的所有目前只通过改变文字颜色为绿色来表示其可点击的文字, 优化成可点击的bar, 加上展开/收起的>符号”；同会话“再检查，这些治理文件都存在”确认按本仓库治理补登实施）
- 执行者：Cano（编辑与验收均在远程 cano:/home/ljx/FlavoGlycoLab 文件系统直接进行；本地挂载卷 /Volumes/cano/FlavoGlycoLab 仅用于读取与同步核对）
- 过程证据：temp/task-028/（保护清单前后快照、styles.css/case-page.css 修复用原文副本、探针 probe-bars.mjs 与 probe-result.json、浏览器结果 browser-final/、8768 服务日志 serve-8768.log；Git 忽略）

## 改动文件与职责

冻结根（data/raw、data/derived、data/private、data/registries、metadata 全部登记+active.json+tutor_presets.json）零改动（保护清单 170 文件前后字节级 0 差异，见验证节）。

| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 主站视觉层 | frontend/student/styles.css | 文件末尾追加 14 行 TASK-028 规则块：`.task-goal/.task-sources/.task-example/.route-evidence/.analysis-fields` 五处 summary 改整行 bar（flex、背景 #f3f8f4、边框、圆角、hover #e8f2ea、`::before` 内容"▸"、`details[open]` 时旋转 90° 并加 margin-bottom）；`:is(main,dialog) a` 下划线（`.button/.text-button` 排除）；`.source-meta dd>a` 与 `.structure-source a` 改链接条（inline-flex+边框+↗ 伪元素）；`.topbar>a,.top-nav a` 下划线。均尊重既有 `html.reduce-motion *{transition:none!important}` 全局禁用 |
| 案例/数据页视觉层 | frontend/student/case-page.css | 文件末尾追加 3 行 TASK-028 规则块：`main a,.case-topbar nav a` 下划线（case.html/data.html 共用本文件，二者页头均为 .case-topbar） |
| 任务与闭环 | 本 TASK/REPORT、docs/tasks/README.md、docs/reports/README.md、STATE.md | 合同收口为 Completed、索引登记、STATE 当前状态更新 |
| 过程证据（不入 Git） | temp/task-028/ | 见对应任务行 |

JS/HTML/内容 JSON 零改动；`git diff --stat` 对两份 CSS 为纯新增（styles.css +14、case-page.css +3，0 删除）。

## 实际操作与观察

1. 站点审计（2026-10-23，远程逐文件核对）：绿色系文字可点元素=五处 summary（.task-goal、.task-sources、.task-example teal；.route-evidence teal；.analysis-fields --deep）+ ui.js `.source-meta dd>a` DOI 链接 + app.js `.structure-source a` ChEBI 链接 + case/data 页 `a{color:var(--green-dark)}`（无下划线）+ topbar/case-topbar 裸 teal 导航链接。范围外同类（不改动，见未改问题节）：.quest-all（无色）、.log-details（墨色粗体）、.paper-digest（无色）、.analysis-reported（棕色 #7b5420）、case 页 .source-meta summary（墨色）；已具非颜色提示的 .ref-sup（点线下划线）、.study-title a（带箭头图标）、.card-link（→）、全部 .button/.text-button。
2. 实施：styles.css、case-page.css 末尾追加 TASK-028 规则块（CSS-only，无 JS/HTML 改动）。
3. **写入事故与修复（如实登记）**：首次经 SMB 挂载卷以 `cat >>` 追加写入，两次均损坏目标文件——TASK-028 规则块落到文件头部，styles.css 的全局 reset 行（`*{box-sizing…}`）被覆盖、`.top-nav` 规则行首 2 字符被吃；case-page.css 的 `:root` 前 11 个变量行被覆盖。损坏模式为挂载卷追加写错位，`grep -c "TASK-028"`（计数=1）与 `wc -l` 双侧一致未能发现，最终由 `tail`/`head` 对照发现。修复：在远程文件系统用 `git show HEAD:` 取回原文（存 temp/task-028/*.css.orig），与规则块原子拼接重建，之后一切写入改为远程直接写。修复后 `git diff --stat` 为纯新增（17 insertions, 0 deletions）。
4. 验收环境适配：playwright 1.64.1 要求 Node ≥20（系统 /usr/bin/node 为 v18.19.1）→ 改用 nvm node v22.23.1；~/.cache/ms-playwright 无 1.64.1 所需 chromium_headless_shell-1248 构建 → 以 `CHROMIUM_EXECUTABLE` 指向现存 chromium-1243（实测浏览器版本 153.0.8010.12，与 STATE 记录的 Chromium153 口径一致）；`data/private/runtime/tutor.json` 存在（mtime 2026-10-19，早于 TASK-027 验收）→ 按 temp/task-027/l06/verification.txt 记录的既定口径以 `FLAVOGLYCOLAB_LIVE_AI=1` 运行（套件内 tutor 调用仍被页面级 route mock 拦截，非真实模型调用）。
5. 8768 验证服务：`~/miniforge3/envs/condrxnbench/bin/python scripts/dev.py --port 8768`（nohup 后台），health 200；套件结束后停止，端口释放（curl 000）。8766 LAN 服务全程未触碰、未重启；因 8766 直读 frontend/student，本次改动刷新浏览器后即对局域网用户生效（静态资产，无服务端代码改动）。
6. 专项探针（temp/task-028/probe-bars.mjs，pass:true，结果 probe-result.json）：真实流程过三幕导入门禁→任务卡，断言 task-goal bar 样式（flex/背景/边框/cursor）与"▸"、点击展开（[open]+::before transform 旋转矩阵）+再点收起、task-sources 展开、topbar 下划线、证据对话框"结论与反思"页签 analysis-fields bar（默认展开态旋转）与"并排对照"页签 study 链接下划线；合成 DOM 断言 .source-meta dd>a 链接条（inline-flex/边框/↗）；console 错误 0、page error 0。探针过程中修正两处探针自身问题：CSSOM 序列化子选择器带空格（匹配需归一化空白）、analysis 视图需点击 `[data-compare-route="analysis"]` 页签。
7. 治理收口：本 REPORT、TASK-028 状态 Completed、双索引登记、STATE 当前状态更新。docs/reports/README.md 此前缺 026/027 条目（本轮未越权补录，见未改问题节），本轮仅追加 028 条目。

## 验证

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `~/miniforge3/envs/condrxnbench/bin/python scripts/dev.py check`（远程 cano） | 中间态 74 项、1 失败=test_task_report_pair_ids_and_slugs（TASK-028 已落盘、REPORT-028 未落盘的预期配对检查）；收口复跑见下一行 |
| 收口复跑 `dev.py check`（远程 cano） | Ran 74 tests，**OK (skipped=3)**（均为显式 research 门禁）；TASK/REPORT 配对守卫 test_task_report_pair_ids_and_slugs 转绿 |
| `npm test`（node v22.23.1） | 69/69 pass，0 fail |
| `FRONTEND_URL=…:8768 QA_OUTPUT=temp/task-028/browser-final npm run test:browser`（FLAVOGLYCOLAB_LIVE_AI=1、CHROMIUM_EXECUTABLE=chromium-1243、Chromium 153.0.8010.12） | 644 checks，pass:true，console/外部请求 0 |
| `FRONTEND_URL=…:8768 QA_OUTPUT=temp/task-028/data-browser-final npm run test:data-browser` | 68 checks，consoleErrors 0，externals 0 |
| 专项探针 temp/task-028/probe-bars.mjs | pass:true；bar 呈现/展开/收起/▸旋转/链接条/下划线/console 0 全部断言通过（probe-result.json） |
| 保护清单 temp/task-028/snapshot_protected.py（task-027 脚本+metadata/tutor_presets.json 加严，170 文件，sha256+size，排除 ._\*/.DS_Store） | protected-before 与 protected-after 比对：170/170 字节级 0 差异，无新增/丢失文件 |
| `git diff --stat frontend/student/styles.css frontend/student/case-page.css` | 17 insertions(+), 0 deletions(-)（+14/+3），纯追加 |
| 服务边界 | 8768 验证服务已停止、端口释放；8766 LAN 服务未触碰未重启 |

## 与任务合同的偏差

1. 写入方式偏离（已修复、留证）：合同隐含沿用仓库既有"本地挂载编辑"路径，实际 SMB 挂载 `cat >>` 追加两次损坏目标文件（详见实际操作节第 3 条）；当场以 git HEAD 原文远程重建，最终改动与合同预算完全一致（两份 CSS 纯追加）。后续本仓库写入一律远程直接写，挂载卷只读核对。
2. 链接规则作用域从草拟的 `main a` 扩为 `:is(main,dialog) a`（含 `.button/.text-button` 排除同步扩展）：#evidence-dialog 等对话框位于 `<main>` 之外，其内 study 标题 DOI 链接需要覆盖；属允许清单内文件的最小必要修正，经探针验证。
3. 验收环境适配三项（node 22 替代系统 node 18、CHROMIUM_EXECUTABLE 指向现存 chromium-1243、FLAVOGLYCOLAB_LIVE_AI=1 按 TASK-027 既定口径）：不改测试与被测代码，仅为让合同验收命令在本机当前状态下可执行。
4. 合同"涉及目录及文件职责"未列出 temp/task-028/snapshot_protected.py 对 task-027 脚本的加严（+metadata/tutor_presets.json，169→170 文件口径）：仅影响过程证据快照脚本（Git 忽略），保护分母只会更严不更松。

## 数据、许可与审核门

- research_evaluation：不变，仍为研究候选；本次为纯呈现层修正，不产生任何数据或计算证据。
- teaching_case_review：不晋级。22/22 案例仍 pending_teacher_review，教师批准 0；本次改动不涉及任何科学内容、数值或教师审定状态。
- public_teaching_release：not_started，未变。三篇 PDF 公开例外范围不扩大；无新数据、无许可影响。

## 已发现但未改的问题

1. 非绿色的"无颜色/弱提示"可点元素未在本次范围：.quest-all summary（无颜色提示）、.log-details summary（墨色粗体、容器有卡片边框）、.paper-digest>summary（无颜色提示）、.analysis-reported summary（棕色）、case 页 .source-meta summary（墨色粗体）。如需统一 affordance，须新的 TASK。
2. tests/test_inquiry_browser.mjs:350 的"default public app does not require model credentials"检查假设运行环境无模型配置；本机 data/private/runtime/tutor.json 存在时必须按 TASK-027 口径以 FLAVOGLYCOLAB_LIVE_AI=1 运行。环境与检查假设耦合，建议后续任务提供显式配置隔离（如 serve_lab 配置路径覆盖参数）。
3. docs/reports/README.md 缺 REPORT-026、REPORT-027 索引条目（TASK-026/027 遗留）；本轮不越权补录，待负责人决定补录口径。
4. AutoClaw 工作区（会话工作区）中的 TASK-010 时代 frontend/student 骨架副本与本仓库现行结构已分叉；该副本上曾做过同类改造，未并入本仓库，保留为历史参考。
5. SMB 挂载卷追加写不可靠（两次损坏）；协作文档未警示该风险，建议在 docs/operations/collaboration.md 增补"编辑走远程或整文件写入"说明（须新的 TASK 批准）。

## 遗留风险、仓库与CI

- 仓库：main@`2704edd2c0eda071a4b21a093a7e25689c580728`；工作树含本 TASK 未提交改动（2 份 CSS、TASK/REPORT、双索引、STATE）与既有 015—027 提交后无其他改动；未 commit、未 push，CI 未触发。
- 8766 LAN 服务直读 frontend/student：局域网用户刷新后即见新样式（静态资产热生效）；无服务端改动，无需重启。
- temp/task-028/ 为 Git 忽略过程证据，不随仓库分发；不包含私有数据内容。
- 探针与套件均未产生真实模型调用（套件 tutor 调用为页面级 mock；探针无 AI 交互）。

## 建议的下一TASK

仅建议，不自动实施：统一全站剩余可点元素的非颜色 affordance（问题1清单）；为浏览器验收提供模型配置隔离开关（问题2）；补录 026/027 报告索引（问题3）。
