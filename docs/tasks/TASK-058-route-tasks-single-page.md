# TASK-058：路线比较与路线选择分别合为单页

## 合同元数据
- 任务ID：TASK-058；状态：Completed（2026-10-25，工程验收）。
- 基线分支/提交：main / dcab65f；人工负责人：项目所有者；执行者：Cano。
- 授权来源：human_direct。所有者明确要求“比较三条路线也是三页合成一页”“选择路线并说明理由也是三页合成一页”，并删除“任务03 · 新任务，输入框已清空”“作出你的判断”等多余内容。
- 修改预算：frontend/student/views/inquiry.js、frontend/student/styles.css（仅删除失效提示样式）、tests/test_inquiry_browser.mjs、tests/test_submission_browser.mjs；本TASK及同名REPORT、docs/tasks/README.md、docs/reports/README.md、STATE.md、PROGRESS.md。临时脚本、保护清单、日志及截图只存/tmp/flavoglycolab-task-058/。
- 关联ADR：沿用既有页面/学习状态职责，无新增长期设计决定。

## 目标与已核实事实
任务03/04当前均将探究内容、路线卡和论文解读分成三页。将每项分别合为一个连续页面，保留既有内容、来源入口与答题交互；通用答题栏删除草稿载入/清空提示，选择题组保留可访问名称但不展示“作出你的判断”。研究、教师审定、公众教学发布三个门不晋级。

## 范围
### 允许项
- 仅调整现有taskView的03/04内容组合，取消这两项的分页；旧sessionStorage分页偏好不得隐藏合并内容。
- 删除通用答题栏的草稿状态文案及失效样式；使用隐藏legend保留选项组的可访问名称。
- 更新既有浏览器断言，核验两页的路线卡、论文展开、选择/提交/草稿/刷新和桌面及窄屏布局。
### 禁止项与非目标
- 不改学习状态机、门禁、AI/后端、其他任务分页、文献/科学内容或数据；不改原始来源、许可、教师审核事实。
- 不安装依赖、不调用真实模型、不重启常驻服务、不提交/push或自动启动下一TASK。
### 涉及目录及文件职责
| 职责 | 文件 | 拟改动 |
| --- | --- | --- |
| 现有任务投影 | views/inquiry.js、styles.css | 内容合页与提示删减；不增加状态真值 |
| 工程守卫 | 既有两份browser测试 | 按实际UI更新断言，保留草稿行为核验 |
| 治理闭环 | TASK/REPORT、两索引、STATE/PROGRESS | 事前范围、事后实测与当前事实 |

## 必须执行的操作与验收标准
- [x] 任务03/04各只有一页，无分页按钮；探究文字、三路线卡、三篇解读同页可见/可展开。
- [x] 通用答题栏不显示上述无关提示；选择题可访问名称、答题、路线选择、评价反馈及草稿保存可用。
- [x] 既有public工程检查、针对性浏览器与异步提交回归通过；桌面/窄屏无横向溢出、相关控制台错误。
- [x] 预算外原有tracked文件SHA保持；如实记录验证分母、失败、未测范围和Git状态，更新STATE/PROGRESS。

## 验证
Browser plugin not available，使用仓库已安装的Playwright与主机已有Node22。流程：现有学习记录进入任务03 → 同页查看三路线/展开论文 → 提交并进入任务04 → 选择路线、填写依据、刷新恢复。复用tests/test_submission_browser.mjs，必要时运行tests/test_inquiry_browser.mjs及public的python3 scripts/dev.py check；截图与日志在/tmp/flavoglycolab-task-058/。常驻8766仅核对静态文件，不重启。

## 停止条件
发现未知并发改动、原件SHA变化、需修改状态机/科学内容/服务配置或新增依赖时停止相应动作并报告。工程失败须定位，修复不得超出本合同。

## 报告要求
生成docs/reports/REPORT-058-route-tasks-single-page.md，记录实际改动、验证、偏差与未测边界；更新STATE/PROGRESS与索引。不自动实施下一任务。
