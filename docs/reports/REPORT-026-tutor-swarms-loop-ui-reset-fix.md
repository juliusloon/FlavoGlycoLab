# REPORT-026：导师多角色评价闭环、文献参考数据分析、步骤布局重构与同阶段重置修复

- 任务ID：TASK-026（合同：docs/tasks/TASK-026-tutor-swarms-loop-ui-reset-fix.md）
- 状态：Completed
- 授权来源：human_direct（所有者 2026-10-22 对话指令）
- 执行者：Agent（含 3 个设计讨论子代理 + 3 个实施子代理）
- 报告日期：2026-10-22

## 事后真实改动

### 1. 同阶段静默重置修复（所有者点名 P0）
- `lab-state.js`：`addMaterial` 仅在材料实际变化时 `clearDownstream(run,2)`（清 09+，保留本阶段 05-08）；材料未变只 bump `contextRevision`。`confirmPlan` 方案变化时 `resetLearning(run,2)` 改为 `clearDownstream(run,3)`（只清 13+，保留 09-12）。
- `app.js` plan-form input 处理器：删除无条件 `resetLearning(run,2)`；已确认方案字段变化只清下游（13+）并重置 analysis；未确认编辑仅 bump revision。
- `index.html`：路线确认对话框文案与实际行为对齐（明确清空 01—24 主线进度）。
- 语义原则落码注释：装配/方案编辑只失效下游阶段，永不清同阶段已完成记录。
- 回归测试：`test_workbench_state.mjs` 新增 4 例（同材料重加保留、实际换材料、已确认方案修改、analysis 重置/hydrate 默认）。

### 2. 导师多角色评价闭环（agent swarm 落地）
- `metadata/tutor_presets.json`（新建，tracked）：24 步 preset（objective + rubric 2-3 条 + min_hits + paper_focus），全部教学语言、无实验数值，`review_status=agent_checked_candidate`。
- `scripts/serve_lab.py`：`POST /api/tutor` 扩展 `kind=evaluate` 协议（evaluation{task_id, eval_id, submission, context_revision}）；evaluator 独立 SYSTEM；确定性预检（照抄目标 Jaccard≥0.8 不烧模型直接判未达标）；span 逐字子串服务端校验；pass=required 全覆盖且命中≥min_hits；evaluate 独立限流 6/min/IP + 每 IP 单飞 429 + eval_id 缓存 50 条 TTL 10min；审计日志 `temp/tutor_eval_audit.jsonl`（无学生原文）；preset 启动校验 fail-closed（与 demo-content 步 id 集合对账，不一致 evaluate 一律 503，chat 不受影响）。双守卫不放宽：QUANT_REQUEST 兼扫 submission.note；QUANT_OUTPUT 逐条扫 guidance/span，命中整包作废。新增 literature_analyst 角色（论文阅读引导）。
- `learning-state.js`：hydrate 白名单新增 `eval`（非法形状只丢字段不丢条目）；`draftLearning`/`checkLearning` 同步清除旧评价。
- `quest-state.js`：`taskPassed` v2——有终态评价时开放题须 passed 放行、选择题额外锚定确定性答案（模型不可翻转）；无评价/evaluating/degraded 时保持原确定性语义，AI 不可用流程不卡死。
- `app.js`：提交成功自动评价一次（noteHash 相同复用旧判定不重发）；五重落地校验（evalId/route/revision/checkedAt/noteHash）；未达标面板一键"带着这些问题问导师"（预填 coach_question）；data-paper-ask 以 literature_analyst 角色发问。
- 实测（本机 Qwen3.8-flash）：任务 04 提交后真实返回 `pass:false` + 未命中要点 + 逐条 guidance，entry.eval 持久化，页面右栏评价面板正确渲染。

### 3. 结果分析台（"实验没有结果"张力 → 文献参考数据闭环）
- 新 `frontend/student/analysis-engine.js`（纯函数）：`extractConditions`（条件文本解析，解析不到=原文未给）、`comparePlanToRecord`（✔/△/？/— 四态对照 + 汇总口径）、`CALC_WHITELIST` 8 项白名单计算（R2 摩尔收率 91.25%/99.35%；R1 百分点差 33.6/1.6 pp 与浓度增量 0.22/0.08 mM；R3 梯度倍数 ≈15.8、单位换算 ≈76.7 mmol/L，MW 注明 PubChem CID 5280804）、`GAP_OPTIONS` 缺口清单。全部计算在代码内完成，结果卡三行标签：原文报告值·非本次观测 / 计算值·由文献报告值得出 / 待教师审定。
- `views/workbench.js` 阶段4重构为五回合：诚实声明（observations=[]）→ 选 1-3 张本路线 DQ 参照卡（理由≥8字）→ 条件四态对照表 → 白名单下拉计算 → 缺口勾选+边界说明（≥15字）。黑名单静态卡：本方案产率/转化率不可计算（无实测分子分母）。analysis-form 守卫不变。
- `lab-state.js`：`run.analysis` 状态（clearDownstream n≤3 时重置；hydrate 补默认）。
- `app.js` 五个 analysis 事件分支（选参照/重算对照/白名单计算去重/缺口/边界）。
- 新测试 `tests/test_analysis_engine.mjs`（解析、四态、8 项计算值）。

### 4. 视觉重构
- `views/inquiry.js` taskView 两区布局：全宽头（标题/矩阵条/目标折叠，**移除与 P1 重复的 prompt 段落**）+ 左 `.task-narrative`（P1 情境与指引成段文字 + 块末来源角标 ref-sup；P2 视觉证据；P3 论文与解读，仅 source_ids 非空时）+ 右 `.task-rail`（sticky 稳定填写区：题目复述/表单/评价面板/反馈/操作）。
- 区内翻页器 `.narr-pager`：纯 DOM hidden 切换、绝不触发 render()、状态存 sessionStorage、翻页移焦点、3Dmol 恢复时 dispatch resize。
- 叙述文字成段：幕一/幕二 act points 改为连续段落 + 块末来源行；任务视图引用降级为段末 [n] 角标（点开来源折叠区）。
- 响应式：≥1600 右栏 400px；≤900 单列 + 右栏 static；沿用既有断点。
- 工作台新增 `.bench-rail`（280px）承载阶段任务提醒（类名与结构不动，选择器兼容）。

### 5. 引导具体化 + 论文可达
- `demo-content.json`：24 步 prompt/note_prompt 全部具体化（做什么+可评价产出+参考什么），choices/answer/source_ids 等判定字段零改动；01 步明确"底物不同×催化剂不同"比较点+证据类型产出。新增 `learning.paper_digests`（三篇导师解读：one_line/阅读指引/key_points/DQ 指针，非数值）。
- PDF 展示：论文解读卡内"在线阅读论文 PDF"按钮内嵌 iframe 面板（HEAD 预检/加载态/8秒慢提示/失败回退）+ 新标签页链接；togglePaper 支持 .paper-view 与 .paper-digest 两种宿主。并排对照视图补 PDF 面板。有头浏览器实测 Pei2019 PDF 正常渲染；headless 下 iframe 空白为无头插件限制，不影响真实浏览器。

## 验证
- `python3 scripts/dev.py check`：62 项 Python，61 通过；唯一失败为 TASK/REPORT 配对（本报告落盘后消除，已复跑确认）。
- `npm test`：60/60。
- 浏览器端到端（Chromium153，8768，本机 Qwen 实况）：637/637 通过，console 错误 0、外部请求 0；含两区布局/翻页/解读卡/评价面板/分析台守卫。
- 服务端：`python3 -m unittest tests.test_lab_server` 27/27（1 平台 skip 为既有）。
- PDF 端点守卫通过（200/application/pdf/frame-ancestors 'self'、SHA 不符 503）；冻结目录内容零改动（git 内容 diff 仅 TASK-015 时期既有未提交修改与 WebDAV 权限噪声）。
- 视觉抽查截图存 `temp/task-026/`（v3/v4/v5/v6 系列）。
- 8766 LAN 服务未重启；未提交/push。

## 偏差与未解决
1. 评价判定质量依赖本机 Qwen，属 `agent_checked_candidate`；页面所有 AI 输出固定标注"机器反馈 · 待教师审定"，三状态门不晋级。
2. 条件对照解析不到字段一律"原文未给"，R1 Table 1/2 多数条件格预期为 ？（诚实降级，非缺陷）。
3. confirmPlan 中方案变化时 revision +2（两处 clearDownstream 叠加，幂等正确，未合并）。
4. headless 截图中 PDF iframe 不渲染为无头 Chromium 插件限制；真实浏览器已实测正常。
5. styles.css 曾遇 WebDAV `>>` 追加腐蚀，已用一次性截断写恢复并字节核验；对该卷禁止 shell 追加写。
6. 24 步文案改写为 agent 依据 LYW v2 起草，全部 `pending_teacher_review`，需教师逐项审定。

## 三状态门登记
- research_evaluation：不变（未新增任何实验数值；参考数据全部来自已登记 DQ 记录与 route_analysis）。
- teaching_case_review：22/22 仍待审；新增 preset/文案/解读均为 agent_checked_candidate，教师批准 0。
- public_teaching_release：not_started，未变。
