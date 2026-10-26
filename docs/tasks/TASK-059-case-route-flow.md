# TASK-059：案例与路线四任务及总结页调整

## 合同元数据
- 任务ID：TASK-059；状态：Completed（2026-10-25，工程验收）。
- 基线分支/提交：main / dcab65f，包含已验收未提交的TASK-058工作树；不覆盖058历史记录。
- 授权来源：human_direct，所有者逐项提出五处内容/布局/路线状态修改，并在异步答复中明确“直接实施并验收”。人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/{app.js,lab-state.js,learning-state.js,quest-state.js,styles.css,paper-notebook.js,paper-notebook.css,navigation.js,ui.js}、frontend/student/views/{inquiry.js,learning.js,pages.js}、frontend/student/content/demo-content.json、metadata/tutor_presets.json；tests/{test_workbench_state.mjs,test_quest_state.mjs,test_navigation.mjs,test_inquiry_browser.mjs,test_pages_browser.mjs,test_submission_browser.mjs,test_lab_server.py}，允许新增tests/test_case_route_browser.mjs并在package.json登记入口；本TASK/同名REPORT、docs/adr/0011-common-learning-before-route-selection.md、ARCHITECTURE/STATE/PROGRESS及两索引。临时资料仅/tmp/flavoglycolab-task-059/。
- 沿用现有设计系统和公开内容；不生成新化学图/数据，不安装依赖。
- 必要守卫兼容补充：tests/test_governance.py将ADR顺序检查的精确列表扩至0011；docs/adr/README.md登记新决策，不改变其他治理约束。
- 部署技术补充：serve_lab.py仅启动时读取preset。为使已授权的新任务01/04评价目标在现有LAN原型生效，验收后允许仅重启flavoglycolab-lan.service并核对health/静态字节；不改unit、私有配置、网络或其他服务。这是实施所需技术动作，不声称新增教师批准。

## 目标与已核实事实
1. 任务01仅明确实验目的与需要记录的结果；合为单页，不提前要求完成结构辨析、路线比较或路线选择。
2. 任务02扩大分子画布，资料卡与聚焦/复位在画布上方悬浮，分子位于资料卡下方；来源与SMILES移入资料卡，响应式适配可用窗口。
3. 任务03三卡打开对应论文笔记本；解读集中于论文页，笔记本首页系统组织三路线对照，复用case_page与已有表格/来源定位。
4. 任务01—03与路线选择解耦，新实验route为空；04承担实际选择和理由。初选/未确认时改选不清空前三步；后续依赖路线的记录仍须合理失效，旧记录可恢复。
5. 总结页完成信息在左、initial-decision在右；区分参照练习模式与配置反应体系阶段，主入口明确推进。

## 范围与职责
沿用已有模块职责，内容与评价preset同步；学习记录仍为唯一完成真值，前三步共通、04及之后按选择路线判断。明确无路线的序列化/旧存档迁移与AI上下文，不以隐藏R1充当未选择。不改原始来源、许可、真实观测、教师审定或发布状态。

## 非目标与禁止项
不重构其他阶段，不部署公众站、不改常驻服务配置/模型配置、不调用真实模型、不修改科学观测/原件/模型/受限数据、不提交或push，不自动启动下一TASK。

## 必须执行与验收
- [x] 01单页，目标/交付具体且不包含后三步的学习要求；评价与说明一致。
- [x] 02五分子、糖基高亮/复位、来源/SMILES可用；桌面/窄屏无裁切/横向溢出。
- [x] 03阅读卡只打开笔记本对应页，无选择副作用；解读在笔记本，首页包含路线概览、字段对照与证据/条件边界。
- [x] 新实验01—03选择为空；04可首选R1/R2/R3及自由改选，前三步记录不变；刷新/旧记录/AI评价及后续路线失效有测试。
- [x] 总结布局符合要求；单个主入口明确“开始参照练习，配置反应体系”，实际进入正确阶段，无重复入口。
- [x] public工程检查与真实Chromium浏览器回归通过，检查正文/笔记本/状态/控制台/截图；来源/预算外文件SHA保持。
- [x] REPORT记录实测分母、失败与未测边界，更新STATE/PROGRESS与职责/ADR。

## 验证
Browser plugin not available，使用已有Node22与Playwright、Chromium1243。临时public服务禁用真实模型，复用工程/浏览器守卫并增加针对初选R2/R3不重走流程的交互回归，视口至少1536、768、390宽。截图/日志/基线清单在/tmp/flavoglycolab-task-059/；常驻8766只核对新静态资产。

## 停止条件
来源/许可/原件冲突、无法保全旧记录、未知并发改动、需新增依赖/模型/服务或科学数据时停止相应操作并报告。范围内故障定位修复，不放宽科学或发布门。

## 报告要求
生成docs/reports/REPORT-059-case-route-flow.md，记录真实差异、验证、失败、旧记录兼容和Git/CI；三个门各自保持原状态。
