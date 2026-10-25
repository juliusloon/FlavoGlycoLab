# TASK-053：体验报告驱动的提交稳定性与分步分析

## 合同元数据
- 任务ID：TASK-053；状态：Completed（2026-10-25，工程自验完成）。
- 基线分支/提交：main / 92fe3f8；保留039—052既有未提交修改，改动前指纹与源码快照位于 /tmp/flavoglycolab-task-053。
- 授权来源：human_direct，用户2026-10-25提供完整24任务体验报告并明确要求“根据这一体验报告修改”。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/{app,learning-state,quest-state,lab-state,analysis-engine,molecule-viewer}.js、views/{inquiry,learning,workbench}.js、styles.css、必要的index.html/inquiry-tools.css；现有Node及浏览器守卫、package.json测试入口；本TASK/REPORT、STATE/PROGRESS、ARCHITECTURE、docs/design/interface-system.md、frontend/student/README.md。不新增运行依赖，不改科学内容原件。
- 关联ADR：沿用既有职责与ADR0010，不改变通行词授权语义。

## 目标与已核实事实
修复提交/编辑/异步评价与进度不一致、晚到请求重绘当前表单的风险；让分析四回合分步显示，改善路线选择、装配、分子高亮和导师上下文反馈。DQ-R1-01的温度/pH等存在value字段，原对照仅解析conditions，导致误报缺失。该修复限于读取既有记录，不重摘文献或扩充实验事实。

## 范围
### 允许项与职责
| 职责 | 文件 | 拟改动 |
| --- | --- | --- |
| 提交与进度 | learning-state.js、quest-state.js、app.js、views/inquiry.js | 一个在途评价对应一次提交；编辑取消；异步落地不重绘其他任务；刷新中断可恢复；达成/确定性未通过/服务降级与推进一致；草稿切题明确提示 |
| 分步分析与条件 | analysis-engine.js、views/workbench.js、app.js | 原有DQ条件合并读取、避免终止/供体条件误作反应条件；四回合页签及折叠取样；未提交参照理由/边界输入切页保留 |
| 方案与反馈 | lab-state.js、views/workbench.js、styles.css | 可选、分酶命名的酶活性浓度学生字段及mU/mL×mL=mU换算；旧记录迁移/导出；R3不强加酶单位；邻近装配按钮与成功状态 |
| 导学与可视化 | views/{inquiry,learning}.js、molecule-viewer.js、app.js、styles.css | 路线选中提示与提交前明确检查；可选路线文案；通行入口折叠且确认；糖基高亮反馈；导师带任务/当前草稿，独立判断保留提示与窄屏遮挡改善 |

### 禁止项、非目标
不修改data/raw/derived/private、registries、metadata、内容JSON、结构/图像原件、模型服务、依赖或常驻服务；不编造实验数值，不把学生酶量写为文献标准。不提交/push/发布，不升级科学/教师/公众三个门。不改变24任务科学答案与路线前置规则、admin7精确匹配和逐题放行。

## 必须执行与验收
1. 改动前保存工作树与保护文件指纹；复现风险并补有意义的回归。
2. 评价中显示loading并防重；切题/编辑后晚到回复不得清空当前输入或覆盖新提交；失败/降级/刷新能重试。选择题确定性核对优先，模型达成但确定性错误须明确可见且不可误放行。
3. 新任务不串草稿，旧任务恢复原文；分析四回合能键盘切换、完成状态同步、取样可折叠；未提交分析文字切页保留。
4. DQ-R1-01对照显示35°C/pH7.5，R2终止100°C/30min不可冒充反应温度/时长，缺失保持未知；酶量可不填，旧记录正常恢复，换算明确为学生设计值。
5. 路线选择、装配、通行确认、分子高亮、问导师上下文在桌面/手机可用；保持未观测/待审边界。
6. 执行python3 scripts/dev.py check、npm test、项目工作台及跨页浏览器回归、针对性Playwright（Browser plugin not available），核验保护SHA及8766静态资产匹配。测试拦截AI响应，不调用真实模型；截图/脚本/日志放/tmp/flavoglycolab-task-053。

## 停止条件
需改变受保护来源字节/科学真值、引入依赖、真实模型/服务变更、无法保全既有修改时停止该部分并报告；不得以算法推断补缺失条件。

## 报告要求
生成docs/reports/REPORT-053-experience-report-reliability.md，真实记录分母、失败重试与限制，更新STATE/PROGRESS当前事实，三个门分别登记、不自动开展下一TASK。


## 工程验收结果
已完成合同范围：Python78（75通过/3显式research跳过）、Node87、完整工作台1702、跨页692、异步评价专项31、含8766桌面/手机交互专项36均通过。363保护文件未变，8766静态资产11/11一致；三门不晋级。失败/修正、证据与限制见同号REPORT，未提交/push或启动下一TASK。
