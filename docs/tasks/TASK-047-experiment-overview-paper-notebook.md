# TASK-047：实验速览与常驻论文笔记本

## 合同元数据
- 任务ID：TASK-047
- 状态：Completed
- 基线分支/提交：main / 92fe3f8；保留039—046既有未提交工作，不代签046验收。
- 授权来源：human_direct，2026-10-25用户本轮两项界面实施要求。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/{app.js,index.html,styles.css,lab-state.js,paper-notebook.js,paper-notebook.css,README.md,views/inquiry.js}；必要的scripts/dev.py运行资产清单；tests/{test_inquiry_browser.mjs,test_pages_browser.mjs,test_workbench_state.mjs,test_quest_state.mjs,test_navigation.mjs,test_governance.py}；docs/design/interface-system.md、docs/adr/{0009-paper-notebook-student-notes.md,README.md}、ARCHITECTURE.md、STATE.md、PROGRESS.md及本TASK/REPORT。不新增运行依赖。
- 关联ADR：沿用ADR0008原生dialog及单一学生记录，ADR0009明确笔记与学习完成状态分离。

## 目标
导入第三页保留三张研究卡，右侧展示六阶段完整虚拟实验流程并直接进入主线，不再以打开论文计数解锁。论文对照与详细阅读收拢到任务01的“论文与解读”和可随时打开的居中笔记本；左侧四个便签分别为对照和三篇PDF＋笔记。用户重复的第四项“第一篇”按第三篇实现。

## 背景与已核实事实
原导入通过introProgress中papers.length>=1门控；任务正文含三篇解读卡，已有同源PDF端点、原生对照弹窗及AI入口。046仍在收口，既有代码/文档视作基线，不覆盖。全部科学内容继续复用demo-content.json；不改变来源/报告值/教师审核状态。

## 范围
### 允许项
- 在现有学生端修改导入展示及唯一对应的论文点击门槛；前两幕判断及24任务门禁保留。
- 新增独立居中原生dialog、常驻笔记本图标、四个便签，含键盘导航、Esc/关闭按钮/回焦、响应式布局及PDF失败回退。
- 任务01三张解读卡与阶段对照共用笔记本入口，其他现有对照/路线选择能力保留。
- paperNotes随run保存、读取、历史/JSON与Markdown导出；仅学生自述，最多三篇各8000字符，不触发答案通过、AI请求或实验结果。
- public工程检查、既有浏览器回归及8766实页/静态字节核对；不调用真实模型、不重启常驻服务。
### 禁止项
- 不改demo-content科学内容、原图、原件、raw/derived/private、metadata/registries、migrations/reference或原交件。
- 不改变前两幕判断、24步答案/评分、科学数值、AI服务协议或三个状态门。
- 不新增依赖、模型/后端/系统配置，不提交/push，不自动执行后续TASK。
### 涉及目录及文件职责
| 职责 | 文件 | 拟改动 |
| --- | --- | --- |
| 导入与任务投影 | views/inquiry.js | 六阶段速览、任务01阅读入口与对照复用 |
| 独立阅读浮窗 | paper-notebook.js/css、index.html | 四便签、PDF/笔记、可访问交互与响应式 |
| 编排与学生记录 | app.js、lab-state.js | 入口/导师上下文、笔记保存与兼容读取/导出、论文门槛调整 |
| 工程/闭环 | tests、dev.py及现有规范/TASK/REPORT/STATE/PROGRESS | 更新被替代的门槛断言、验收与当前事实 |

## 非目标
不重做整站、不增加科学材料、生成观测、正式评分、教师审批、跨设备同步或公开教学发布。

## 必须执行的操作
1. 保存既有修改基线和冻结资产SHA；登记合同。
2. 按现有白/绿共享token及原生控件实现用户指定布局，不新增位图资产。
3. 验证无需打开论文可进入任务01，前两幕及后续门禁正常；笔记跨便签/关闭/刷新/路线/新实验隔离与导出正确。
4. 检查桌面/平板/手机、键盘/中文输入、Esc/回焦、PDF成功/失败、导师入口、无新增外联/应用错误；查看截图。
5. 工程及相关浏览器回归，核对冻结资产与8766，REPORT收口并更新STATE/PROGRESS。

## 验收标准
- [x] 导入第三页保留三卡，显示完整六阶段速览，旧阅读提示/计数/路线0/4消失；未打开论文即可开始主线。
- [x] 任务01“论文与解读”结合三张阅读卡和阶段对照入口。
- [x] 常驻图标展开居中大窗口，左四便签，三篇PDF/笔记一一对应；Esc/按钮关闭且回焦，不丢主任务草稿。
- [x] 笔记按当前实验独立保存及导出，不改变主线完成、AI使用记录、真实观测或成绩；旧记录兼容。
- [x] 三种视口无页面溢出；PDF失败有准确提示和回退；相关工程/回归通过，冻结资产零差异。
- [x] research_evaluation候选、teaching_case_review 22/22待审、public_teaching_release not_started均不晋级。

## 验证
python3 scripts/dev.py check；npm test；npm run test:browser；npm run test:pages-browser；临时Playwright专项（Browser plugin not available）。证据存/tmp/flavoglycolab-task-047/。

## 停止条件
需修改冻结科学内容/原件、需新依赖或常驻服务操作、不能保全其他任务修改、无法区分新增与基线故障时停止并报告。

## 报告要求
生成docs/reports/REPORT-047-experiment-overview-paper-notebook.md；如实记录分母、失败/修正及未测事项，更新STATE/PROGRESS，不自动开启下一TASK。
