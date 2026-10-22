# TASK-026：导师多角色评价闭环、文献参考数据分析、步骤布局重构与同阶段重置修复

## 合同元数据
- 任务ID：TASK-026（本仓库唯一、严格递增）
- 状态：Approved
- 基线分支：main（本地工作树）
- 基线提交：工作树当前 HEAD（015—025 未提交改动在工作树内）
- 授权来源：human_direct（所有者 2026-10-22 对话指令，五项要求逐项见「目标」）
- 人工负责人：所有者
- 执行者：Agent
- 修改预算（逐路径允许清单）：
  - `frontend/student/lab-state.js`、`learning-state.js`、`quest-state.js`、`app.js`、`views/inquiry.js`、`views/workbench.js`、`views/learning.js`、`views/inquiry-tools.js`、`styles.css`、`index.html`、`content/demo-content.json`
  - `frontend/student/case-page.js`、`data-page.js`（仅入口/兼容必要处）
  - `scripts/serve_lab.py`
  - `tests/test_workbench_state.mjs`、`tests/test_quest_state.mjs`、`tests/test_inquiry_browser.mjs`、`tests/test_lab_server.py`、`tests/test_data_profiles.py`（仅新增/更新守卫）
  - `docs/tasks/TASK-026-*.md`、`docs/reports/REPORT-026-*.md`、`STATE.md`、`ARCHITECTURE.md`（责任表增量行）
- 关联ADR：无新增；遵循 ADR0006 数据治理

## 目标
解决所有者点名的五件事，全部限定在现有 student 模块内：
1. **闭环与结果张力**：学生主线（拟定方案→规划条件→仿真操作→分析结果）此前无"结果"落点。引入**明确标注「文献报告·非本次观测·示意参考」**的参考数据（来源仅限已登记的 `data_query` 21 条与 `route_analysis` 4 组报告值，不新造数值），在阶段4建成"结果分析台"：学生方案条件 ↔ 文献报告值对照 + 指标可算性边界，由导师「文献分析员」角色引导。以多角色导师团（方案教练/条件规划师/操作仿真员/文献分析员/评价员）实现闭环，替代现行重复式引导。
2. **逐步评价与达标引导**：每步学生提交内容后，导师以该步 preset（本步知识点目标 + 评价要点）评价并持续引导；达标前"下一项"不放行（未配置模型时降级为自查声明流程，如实标注）。
3. **修复静默重置**：装配（addMaterial）、方案编辑（plan-form input）、保存方案（confirmPlan）三处不得再清除**同阶段**已完成主线记录；仅失效下游阶段并 bump `contextRevision`。路线确认对话框文案与实际行为对齐。
4. **视觉重构**：叙述说明文字改为成段文字（不再逐句框起标引用）；每步一个全屏页；主 panel 分左右两区——左区叙事/指导（过长可在区内翻页），右区为每步稳定出现的学生填写区。
5. **引导具体化与论文可达**：重写 24 步引导文案为具体、可执行的表述（重点：01 步"明确实验任务"）；新增导师对三篇论文的逐篇解读 preset；任务视图与对照视图均可直接打开对应论文 PDF 在线阅读面板（`/api/paper/{source_id}`），加载态与失败回退诚实显示。

科学/教学/公开三状态门不因此晋级；全部新增 AI 行为为「机器反馈」，页面固定标注待教师审定。

## 背景与已核实事实
- 重置 bug 三处实锤（探查 2026-10-22）：`lab-state.js` addMaterial 无条件 `clearDownstream(run,1)`；`app.js` plan-form input 处理器无条件 `resetLearning(run,2)`；`lab-state.js` confirmPlan 在 plan 变化时 `resetLearning(run,2)`。均导致同阶段 4 题被静默抹除。`invalidateAfterTaskEdit` 已有"不清同阶段"原则，三处为漏网。
- 参考数据唯一合法来源：`demo-content.json` 的 `data_query.records`（21 条，R1 9/R2 5/R3 7）与 `learning.route_analysis.reported_results`（4 组），均已是公开登记内容，带「原文报告·非本次观测」边界。
- PDF 端点 `/api/paper/{source_id}` 已实现且 TASK-022 验收；前端入口仅单路线探索视图一处，并排对照与阶段0幕三无 PDF 面板；"无法访问"主要是入口缺失与托管方式。
- 24 步现状：v5 六界面×4 步（网页现行）；LYW v2 科学 24 步（docs/p10ns/261019/24step_teaching_matrix_LYW_v2.md，每步含学生输入/AI作用/完成证据）为具体化改写的依据。
- 导师协议：`POST /api/tutor` 白名单 context、双守卫（QUANT_REQUEST/QUANT_OUTPUT）、SYSTEM ≤220 字、限流与并发信号量均在 serve_lab.py；AI 为可选本机演示，未配置须如实降级。

## 范围
### 允许项
- 上述预算清单内文件的代码/内容改动；demo-content.json 新增 `learning.tutor_presets`（每步 objective/rubric/论文解读）、`learning.reference_data`（阶段4参考数据集，字段级标注边界）。
- serve_lab.py 新增导师角色 preset 路由（role 白名单：coach/evaluator/literature_analyst）与评价响应协议（pass/guidance 结构）；context 白名单增量仅允许新增键的固定映射，不开放任意字段。
- 新增/更新 tests 守卫：同阶段重置回归、评价流程守卫、布局结构守卫。
### 禁止项
- 不改动 `data/raw/`、`data/derived/`、`data/private/`、`metadata/public_sources.json` 原件与 SHA；保护分母 199/199 不变。
- 不新造任何实验数值；参考数据只能引用已登记记录，页面必须带「文献报告·非本次观测·示意参考」标注。
- 不改三状态门；不实现真实仿真内核/正式评分/账户系统；不把 AI 评价标注为教师审定。
- 不提交/push（沿用当前工作树状态）；不重启 8766 服务。
- 不动 temp/261021-handout、docs/p10ns 交接原件。
### 涉及目录及文件职责
| 目录职责 | 文件 | 当前状态与拟改动 |
| --- | --- | --- |
| 流程状态真值 | lab-state.js / learning-state.js / quest-state.js | 修三处同阶段重置；语义=仅失效下游 |
| 应用编排/导师调用 | app.js | 评价闭环编排、结果分析台事件、布局分区渲染入口 |
| 任务视图/工作台视图 | views/inquiry.js、views/workbench.js | 左右两区单步布局、PDF 面板入口补齐、结果分析台视图 |
| 学习内容唯一投影 | content/demo-content.json | 24 步文案具体化；新增 tutor_presets、reference_data |
| 导师服务端 | scripts/serve_lab.py | 角色 preset 路由与评价协议；守卫不放宽 |
| 样式 | styles.css | 两区布局、区内翻页、成段叙事样式 |
| 测试守卫 | tests/*.mjs、tests/test_lab_server.py | 新增回归与流程守卫 |

## 非目标
- 不建设真实 D1 仿真、色谱模拟、正式成绩/量规上线。
- 不做 LLM 平台接入或容量测试；本机 Qwen 仍为可选演示。
- 不改动 case.html / data.html 的独立职责（入口链接必要处除外）。
- 不生成申报/视频材料。

## 必须执行的操作
1. 修复三处同阶段重置并补回归测试；路线确认文案对齐。
2. 设计（经子代理讨论）并在 demo-content.json 落地：24 步具体化文案 + tutor_presets + reference_data。
3. serve_lab.py 增加角色化导师 preset 与评价协议；保持 fail-closed。
4. 前端实现评价闭环（提交→评价→引导→达标放行/降级自查）、结果分析台、PDF 面板补齐、两区单步布局。
5. 全量工程验收并如实报告；更新 STATE/ARCHITECTURE；写 REPORT-026。

## 验收标准
- [ ] 代码/文档/数据路径与工件责任匹配。
- [ ] `python scripts/dev.py check` 通过；`npm test` 通过。
- [ ] 浏览器测试三视口通过、console 错误 0、外部请求 0；保护 199/199；PDF SHA 3/3。
- [ ] 回归：装配/方案编辑/保存方案后同阶段已完成记录保留；下游正确失效。
- [ ] 参考数据全部带「文献报告·非本次观测·示意参考」标注；无双守卫回归。
- [ ] 科学、教学、公开三个门分别登记，不越权。

## 验证
    cd /Volumes/cano/FlavoGlycoLab
    python scripts/dev.py check
    npm test
    node --experimental-vm-modules node_modules/.bin/...（以 tests 实际入口为准）
    保护基线：data/raw、data/derived、data/private、metadata 冻结登记字节前后一致（工具核对）

## 停止条件
- 哈希/来源冲突、PDF 端点行为退化、双守卫失效、需要教师才能做的教学裁定、范围溢出（如需真实仿真内核）。

## 报告要求
必须生成 docs/reports/REPORT-026-tutor-swarms-loop-ui-reset-fix.md，报告真实改动、验证分母、偏差与未解决问题，并更新 STATE.md、ARCHITECTURE.md。不自动执行下一 TASK。
