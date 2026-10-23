# TASK-028：绿色文字可点元素改造为可点击 bar（含展开/收起箭头）

## 合同元数据

- 任务ID：TASK-028（本仓库下一正式编号；批准实施前核对编号未被占用）
- 状态：Completed（2026-10-23 实施与工程验收完成；批准来源 human_direct；实际改动、验收分母、写入事故修复与偏差以 [REPORT-028](../reports/REPORT-028-green-text-clickable-bars.md) 为准；三状态门不晋级）
- 基线分支：`main`；基线提交：`2704edd2c0eda071a4b21a093a7e25689c580728`（TASK-015—027 已随该提交同步，远程工作树 clean；本地 SMB 挂载侧 `git status` 的 228 项为 mode 位噪声、0 内容差异，见 REPORT-028）
- 授权来源：human_direct（所有者 2026-10-23 会话明确指令："将整个网页的所有目前只通过改变文字颜色为绿色来表示其可点击的文字, 优化成可点击的bar, 加上展开/收起的>符号"；同会话指令"再检查，这些治理文件都存在"确认本工作按本仓库治理流程补登并实施）
- 人工负责人：龙锦轩（LJX）；执行者：Cano
- 修改预算（逐路径允许清单）：`frontend/student/styles.css`、`frontend/student/case-page.css`、`docs/tasks/TASK-028-green-text-clickable-bars.md`、`docs/reports/REPORT-028-green-text-clickable-bars.md`、`docs/tasks/README.md`、`docs/reports/README.md`、`STATE.md`、`temp/task-028/`（Git 忽略，过程证据）
- 关联ADR：无新增（沿用既有视觉体系的最小呈现修正，不构成跨任务设计决定）

## 目标

站内所有"仅以绿色系文字颜色提示可点击"的元素获得**非颜色的持久可点提示**：

1. 可展开/收起项（`details/summary`）的 summary 行变成整行可点击 bar，带展开/收起箭头（▸，展开时旋转 90°），含 hover 与既有全局 focus-visible 反馈；
2. 外部文献/数据库链接（DOI、ChEBI）呈现为显式链接条（边框 + ↗），站内导航与提示链接获得下划线。

纯 CSS 实现，不改 JS 行为、不改 HTML 结构、不改内容与数据；`html.reduce-motion` 下无过渡（沿用 styles.css 既有全局禁用）。

## 背景与已核实事实

| 来源 | 事实 / 对本任务的影响 |
| --- | --- |
| 所有者指令（2026-10-23） | 需求针对"整个网页"；现行受治理站点为 `/Volumes/cano/FlavoGlycoLab/frontend/student`（8766 LAN 服务直读，改动刷新即生效） |
| 会话前期实施 | 需求曾在一个 AutoClaw 工作区内的 TASK-010 时代骨架副本（`js/views` 旧结构）上实施过；该副本与仓库现行 `frontend/student`（TASK-011—027 演进后）结构不同，不并入本任务，作为偏差背景在 REPORT-028 如实登记 |
| 站点审计（2026-10-23） | 绿色/深绿 summary 共 5 处：`.task-goal`、`.task-sources`、`.task-example`、`.route-evidence`、`.analysis-fields`（--deep）；绿色外链：ui.js DOI 链接、app.js ChEBI 链接；case/data 页 `a{color:var(--green-dark)}` 无下划线；topbar/case-topbar 导航为裸 teal 文字链接 |
| 范围外同类元素（不改动，如实登记） | 非绿色 summary（`.quest-all` 无色、`.log-details` 墨色粗体、`.paper-digest` 无色、`.analysis-reported` 棕色、case 页 `.source-meta summary` 墨色）；已具非颜色提示的元素（`.ref-sup` 点线下划线、`.structure-source summary` 点线、`.card-link` 箭头、`.study-title a` 带图标、全部 `.button`/`.text-button` 类） |
| 测试与门 | `tests/test_inquiry_browser.mjs` 等只断言结构与文本，无样式断言；`html.reduce-motion *{transition:none!important}`（styles.css:20）自动覆盖新增过渡 |

## 范围

### 允许项

- 仅上述修改预算清单内文件；CSS 追加式修改（文件末尾新增带 TASK-028 注释的规则块），不重写既有行。
- temp/task-028/ 内只读快照、探针脚本与结果 JSON（Git 忽略）。

### 禁止项

- 不修改 `frontend/student/` 下任何 JS/HTML/内容 JSON；不修改 raw、derived、private、registries、metadata 全部；不触碰三个状态门；不 Git commit/push；不重启/调整 8766 LAN 服务或其他服务；不改 `.quest-all`/`.log-details`/`.paper-digest`/`.analysis-reported` 等范围外元素。

### 涉及目录及文件职责

| 唯一职责 | 允许修改的精确路径 | 拟改动边界 |
| --- | --- | --- |
| 主站视觉层 | `frontend/student/styles.css` | 文件末尾追加：5 处 summary 的 bar+▸ 规则；DOI/ChEBI 链接条；`main a`/topbar 链接下划线 |
| 案例/数据页视觉层 | `frontend/student/case-page.css` | 文件末尾追加：`main a` 与 `.case-topbar nav a` 下划线（case.html/data.html 共用） |
| 任务与闭环 | 本合同、同号 REPORT、`docs/tasks/README.md`、`docs/reports/README.md`、`STATE.md` | 登记本次任务入口与真实结果 |
| 过程证据（不入 Git） | `temp/task-028/` | 保护清单前后快照、探针脚本与结果、验证服务日志 |

## 非目标

不改交互逻辑、内容文案、学习记录/导师/AI 行为；不重设计全站视觉；不做移动端专门重排；不处理非绿色的"无颜色提示"可点元素（登记为已发现未改问题）；不推进任何状态门。

## 必须执行的操作

1. 改动前：temp/task-028/protected-before.json（冻结根 169 文件 + metadata/tutor_presets.json，sha256+size 口径，排除 `._*`/`.DS_Store`）。
2. styles.css、case-page.css 追加规则块；写入后按挂载卷纪律回读确认远程可见。
3. 远程验收：`python3 scripts/dev.py check`、`npm test`、启动 8768 验证服务后 `npm run test:browser`、`npm run test:data-browser`，结束后停止服务并确认端口释放。
4. 探针核验：bar 呈现、▸ 旋转、展开/收起、hover、链接条与下划线、console 错误 0（temp/task-028/probe-result.json）。
5. 改动后保护快照比对必须 0 差异；REPORT-028、STATE、双索引收口。

## 验收标准

- [ ] 5 处绿色/深绿 summary 呈现整行 bar + ▸，点击展开/收起正常，展开时箭头旋转 90°，hover/focus 反馈可见。
- [ ] DOI/ChEBI 链接呈链接条 + ↗；topbar、case-topbar、main 内链接具下划线等非颜色提示。
- [ ] `dev.py check`、`npm test`、`test:browser`、`test:data-browser` 全部通过，console 错误/页面外部请求 0。
- [ ] 保护清单（170 文件）前后字节级 0 差异；`git diff` 内容改动仅限 2 个 CSS 文件。
- [ ] 三状态门不变；REPORT/STATE/索引完成且与事实一致。

## 验证

    # 远程 cano（~/miniforge3/envs/condrxnbench/bin/python）
    python3 scripts/dev.py check
    npm test
    python3 scripts/dev.py --port 8768 &   # 验证服务，结束即停
    FRONTEND_URL=http://127.0.0.1:8768/ npm run test:browser
    FRONTEND_URL=http://127.0.0.1:8768/ npm run test:data-browser
    # 保护快照
    python temp/task-028/snapshot_protected.py . temp/task-028/protected-after.json

## 停止条件

- 任一验收命令失败且根因不在本次改动范围 → 停止、如实登记，不越界修测试。
- 若发现必须改 JS/HTML 才能达成目标 → 停止报告（超出 CSS-only 预算），由负责人决定是否重新定约。
- 保护清单出现非预期差异 → 立即停止并回滚本次 CSS 改动。

## 报告要求

生成 `docs/reports/REPORT-028-green-text-clickable-bars.md`（即使 Partial/Blocked），并更新 STATE.md 与 docs/tasks、docs/reports 索引。不自动启动下一 TASK。
