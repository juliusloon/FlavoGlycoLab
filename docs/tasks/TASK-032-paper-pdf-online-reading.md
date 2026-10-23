# TASK-032：论文卡在线阅读 PDF 可用性落地与两处文案删除（含 LAN 服务进程更新）

## 合同元数据

- 任务ID：TASK-032（2026-10-23 多会话并发抢号：本任务原拟 TASK-029（15:25 建合同）与并行会话的 intro-single-act-two-zone 合同（15:22）撞号；该会话让出 029 后改号 031 又与本任务改名后的 031 撞号（其 15:33 改号），本任务按"编号唯一递增"改定为 TASK-032；TASK-030 已被并行会话 compare-tabs-side-by-side-only 占用）
- 状态：Completed（2026-10-23 联合全量验收补跑通过后收口：代码改动、8766 服务重启与端点验证完成，npm test 69/69、保护 170/170 零差异；`dev.py check`（exit=0，Python OK skipped=3，治理配对 ok）、`npm test` 69/69、`test:browser` 975/975、`test:data-browser` 68/68 已由独立验证会话于最终组合树补跑通过。实际改动、验收分母与偏差以 [REPORT-032](../reports/REPORT-032-paper-pdf-online-reading.md) 为准；三状态门不晋级）
- 基线分支：`main`；基线提交：`2704edd2c0eda071a4b21a093a7e25689c580728`（工作树含 TASK-028 未提交改动：styles.css、case-page.css、STATE.md、docs/tasks/README.md、docs/reports/README.md 及 TASK-028/REPORT-028 两份新文档；本任务不在其上回退或重写）
- 授权来源：human_direct（所有者 2026-10-23 会话明确指令："解决现在网页端没法直接展示 pdf 的问题. 我们先不改具体的排版, 但我需要在点击论文 card 时, 可以点击 '在线阅读论文 PDF' 实现 PDF 的展示. 你有最高的文件使用权限, 什么授权管理的我之后去负责, 先实现可行性."；同会话指令引用页面原文"新标签页打开 PDF"与"PDF 按所有者指定公开（TASK-008 例外），出版方再利用权利未核验，请勿二次分发。"并要求"上面两句话在网页删掉"）
- 人工负责人：龙锦轩（LJX）；执行者：Cano
- 修改预算（逐路径允许清单）：`frontend/student/views/inquiry.js`、`frontend/student/app.js`、`tests/test_inquiry_browser.mjs`、`docs/tasks/TASK-032-paper-pdf-online-reading.md`、`docs/reports/REPORT-032-paper-pdf-online-reading.md`、`docs/tasks/README.md`、`docs/reports/README.md`、`STATE.md`、`temp/task-032/`（Git 忽略，过程证据；原 temp/task-032/、task-031/ 快照已随改号迁移）
- 服务操作：`systemctl --user restart flavoglycolab-lan.service`（重启前先以服务同款解释器 `/usr/bin/python3` 在空闲端口 8769 预检当前 serve_lab.py 启动与论文端点；重启后按下方验收清单核验。依据 docs/operations/lan-site.md"修改Python服务代码后执行restart"的标准操作条款；8767 为另一项目 flavoretro 的进程，不触碰）
- 关联ADR：无新增（不构成跨任务设计决定）

## 目标

1. 删除"论文 PDF 与要点"区（研究对话框 `.paper-view`，views/inquiry.js）中的两处文案：`新标签页打开 PDF` 链接与 `PDF 按所有者指定公开（TASK-008 例外），出版方再利用权利未核验，请勿二次分发。` 整段。
2. 使"点击论文卡 → 在线阅读论文 PDF → 浏览器直接展示 PDF"在正式入口 8766 可用：根因是 8766 常驻进程为 2026-10-19 旧版（无 `/api/paper` 端点），磁盘前端却已是新版；重启服务进程加载当前 serve_lab.py 后端点生效。前端展示沿用既有同源 iframe 与端点守卫（仅三份登记 PDF、启动 SHA 校验、降级 503），不新增依赖。
3. 同步修正引用"新标签页"的提示文案（app.js 三处状态/错误消息）与对应测试守卫，保持诚实降级语义。

## 背景与已核实事实

| 来源 | 事实 / 对本任务的影响 |
| --- | --- |
| 实测 2026-10-23 | `curl -I http://127.0.0.1:8766/api/paper/Pei2019` → 404；`systemctl --user status` 显示该进程自 2026-10-19 21:40 运行（TASK-022 论文端点之前）；服务静态文件逐请求读盘（前端 JS 已是新版），形成"按钮在、点了必失败"的状态。这正是所有者所见"网页端没法直接展示 pdf" |
| serve_lab.py（已提交，工作树无改动） | `/api/paper/{source_id}` 仅服务 intro.papers 三个登记 id；启动按 metadata/public_sources.json 校验路径/SHA，失配降级 503；仅论文响应放宽 frame-ancestors 'self'；ROOT 由脚本自身路径解析，与工作目录无关 |
| views/inquiry.js:77 与 :143 | :77 论文解读卡（learning 视图）自带的"新标签页打开 ↗"与其余文案不在所有者引用范围，保持不动；:143 研究对话框 paper-view 为本次删除目标 |
| app.js:199/205/212 | 三条消息引用"新标签页（链接）"；删除 paper-view 回退链接后需改为不依赖该链接的中性文案；论文解读卡的回退链接仍在，共享消息改中性后对其同样成立 |
| tests/test_inquiry_browser.mjs | :119-121 断言对话框 `.paper-scope` 含 TASK-008；:129-131 与 :634 断言 `.paper-actions a[href="./api/paper/…"]` 计 1；:671 断言慢加载提示含"新标签页"。四处需随删除同步；:214 论文解读卡链接断言（计 1）不受影响 |
| 任务端点守卫（不变） | PDF 展示依赖浏览器原生 PDF 查看器渲染 iframe；端点字节流 `%PDF-` 由测试覆盖。出版方 rights_verified=false 的登记事实不变，页面文案删除不改变许可状态，二次分发约束由登记与治理文件继续承载 |

## 范围

### 允许项

- 仅上述修改预算清单内文件；inquiry.js 只删两处指定片段，app.js 只改三条消息文本，测试只改上述四处断言及其措辞。
- temp/task-032/ 内只读快照、预检与重启验证记录（Git 忽略）。
- 按合同元数据条款执行一次 8766 服务重启与重启后验证。

### 禁止项

- 不修改 PDF 原件、`metadata/public_sources.json`、raw/derived/private/registries 全部；不修改 serve_lab.py、styles.css、case-page.css、demo-content.json；不动论文解读卡（views/inquiry.js:77）文案；不 Git commit/push；不触碰三个状态门；不重启/调整 8767 或其它服务、模型、网卡、防火墙；不改 docs/operations/lan-site.md。

### 涉及目录及文件职责

| 唯一职责 | 允许修改的精确路径 | 拟改动边界 |
| --- | --- | --- |
| 论文视图渲染 | `frontend/student/views/inquiry.js` | 删除 paper-view 内新标签页链接与 paper-scope 两处片段 |
| 交互与提示文案 | `frontend/student/app.js` | togglePaper 三条消息去"新标签页"引用 |
| 浏览器工程守卫 | `tests/test_inquiry_browser.mjs` | 四处断言与措辞同步 |
| 任务与闭环 | 本合同、同号 REPORT、双索引、STATE.md | 登记本次任务入口与真实结果 |
| 过程证据（不入 Git） | `temp/task-032/` | 保护快照、8769 预检与 8766 重启验证记录 |

## 非目标

不改任何排版/布局样式；不改端点行为、守卫、协议与角色；不处理论文解读卡文案；不处理 iOS 等不支持 iframe 内嵌 PDF 的浏览器兼容（登记为未改问题）；不推进任何状态门。

## 必须执行的操作

1. 改动前：temp/task-032/protected-before.json（复用 temp/task-028/snapshot_protected.py 口径：冻结根 + metadata/tutor_presets.json，sha256+size）。
2. 按"范围"实施三文件改动。
3. 工程验收：`python3 scripts/dev.py check`、`npm test`、启动 8768 验证服务后 `npm run test:browser`、`npm run test:data-browser`，结束后停止服务并确认端口释放。
4. 服务预检：以 `/usr/bin/python3 -I -u scripts/serve_lab.py --bind 127.0.0.1 --port 8769` 启动，核验 `/api/health` 200、三份 `/api/paper/{id}` HEAD 200 且 Content-Type application/pdf、GET 首字节 `%PDF-`、`/` 200，然后停止该预检进程。
5. 重启 `flavoglycolab-lan.service`；重启后核验：服务 active、`/api/health` 200、三份论文 HEAD 200、GET `%PDF-`、`/` 200。
6. 改动后保护快照比对必须 0 差异；REPORT-029、STATE、双索引收口。

## 验收标准

- [ ] 研究对话框"论文 PDF 与要点"区不再出现"新标签页打开 PDF"与"请勿二次分发"两处文案；"在线阅读论文 PDF"按钮与内嵌面板保留。
- [ ] 8766 重启后 `/api/paper/{Pei2019,Zhang2015,Niu2024}` HEAD 200 + application/pdf + GET `%PDF-`；静态页 200；服务 active 无崩溃循环。
- [ ] `dev.py check`、`npm test`、`test:browser`、`test:data-browser` 全部通过。
- [ ] 保护清单前后字节级 0 差异；`git diff` 内容改动仅限三文件（app.js、inquiry.js、test_inquiry_browser.mjs）。
- [ ] 三状态门不变；REPORT/STATE/索引完成且与事实一致。

## 验证

    # 远程 cano（~/miniforge3/envs/condrxnbench/bin/python）
    python3 scripts/dev.py check
    npm test
    python3 scripts/dev.py --port 8768 &   # 验证服务，结束即停
    FRONTEND_URL=http://127.0.0.1:8768/ npm run test:browser
    FRONTEND_URL=http://127.0.0.1:8768/ npm run test:data-browser
    # 服务预检与重启（见"必须执行的操作"4—5）
    /usr/bin/python3 -I -u scripts/serve_lab.py --bind 127.0.0.1 --port 8769 &
    curl -sI http://127.0.0.1:8769/api/paper/Pei2019
    systemctl --user restart flavoglycolab-lan.service
    # 保护快照
    python temp/task-032/snapshot_protected.py . temp/task-032/protected-after.json

## 停止条件

- 任一验收命令失败且根因不在本次改动范围 → 停止、如实登记，不越界修测试。
- 8769 预检失败（启动崩溃、SHA 失配 503、字节不符）→ 不重启 8766，停止并报告。
- 重启后服务未恢复或端点异常 → 立即回滚（再次 restart 并排查；必要时按 lan-site.md 恢复流程处理）并报告。
- 保护清单出现非预期差异 → 立即停止并回滚本次改动。

## 报告要求

生成 `docs/reports/REPORT-032-paper-pdf-online-reading.md`（即使 Partial/Blocked），并更新 STATE.md 与 docs/tasks、docs/reports 索引。不自动启动下一 TASK。
