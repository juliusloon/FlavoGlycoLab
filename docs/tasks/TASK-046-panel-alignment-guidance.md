# TASK-046：三栏对齐、方形入口与指导文字统一

## 合同元数据
- 任务ID：TASK-046
- 状态：Completed（2026-10-25，工程验收；见同号REPORT）
- 基线分支/提交：main / 92fe3f8；保留TASK-039—045既有未提交修改。
- 授权来源：human_direct，2026-10-25所有者明确提出四项界面调整：收起后去更多/三个入口方形、三栏顶部对齐、右栏与纯图标导师入口右边对齐、观察指引及相关指导文字统一。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/{styles.css,components.css,design-tokens.css,index.html,README.md,components-page.js}、views/inquiry.js；必要的app.js纯布局同步、components.js纯菜单收起处理；现有tests/{test_inquiry_browser.mjs,test_pages_browser.mjs}中受影响的显示断言；docs/design/interface-system.md、ARCHITECTURE.md、STATE.md、PROGRESS.md、本TASK/REPORT。不要求用满预算，不新增运行依赖。
- 关联ADR：沿用共享token/原生组件与独立导航折叠偏好。

## 目标
收起状态保留主线、历程、总览三个相同尺寸的方形图标入口，隐藏更多；桌面三栏顶边对齐，右侧答题卡与纯图标AI启动器右边对齐。任务01所有指导文字共用字号、行距、颜色和左起点，取消列表额外缩进、彩色角度胶囊、提示色块和混杂的强调样式。

## 背景与已核实事实
TASK-045已实现独立折叠/80px窄栏、左下菜单及正文无框。当前任务标题占据整个任务宽度，使右卡在标题下面；稳定滚动槽与导师独立定位也造成右边缘偏差。任务01的观察列表、角度chips、hint、目标提示与字段提示使用多套外观。本次仅改展示，不改科学文本或判定。

## 范围
### 允许项
- 收起时将两组恢复入口和左下总览入口统一为方形；隐藏更多，展开任一组后恢复现有菜单。
- 将任务标题放回正文列，调整共享顶边/滚动槽/右边距；保留正文无框、左右功能卡、右栏滚动与原表单功能。
- AI启动器删除可见文字，保留图标、无障碍名称、开关/回焦；与右卡使用相同右边缘。
- 任务01按既有字段重新组织指导文字为一个连续说明区，原文可读、不重复显示，字段保留可访问标签和原required/minlength。
- 必要时仅用布局测量同步浮动入口位置，不保存或改变学习状态。
- public实例与8766实页验证；临时测试不调用真实模型、不重启8766。
### 禁止项
- 不改demo-content.json、文献图/来源、原件、raw/derived/private、metadata/registries、migrations/reference或原交件。
- 不改答案、评分/门禁、状态机、AI协议、实际观测或三个状态门。
- 不新增依赖、不改后端/模型/常驻服务/系统配置、不提交/push，不自动启动后续任务。
### 文件职责
| 职责 | 文件 | 拟改动 |
| --- | --- | --- |
| 共用尺寸/外观 | design-tokens.css、styles.css、components.css | 方形尺寸、栏顶/右边缘、指导字体与间距 |
| 页面呈现 | index.html、views/inquiry.js | 纯图标导师、任务标题回正文列、指导统一与可访问表单 |
| 必要布局编排 | app.js、components.js | 只在静态CSS不足时作布局/菜单同步，不改状态真值 |
| 既有验证 | 两套浏览器测试 | 更新旧80px/角度chips等断言，保留功能合同 |
| 规范及闭环 | 组件示例/README/设计规范、ARCHITECTURE、TASK/REPORT/STATE/PROGRESS | 当前真实外观与验收 |

## 非目标
不改教学内容、不精简证据、不中断草稿、不重新设计后续任务或重绘原图。

## 必须执行的操作
1. 保存允许路径基线和冻结资产指纹，登记合同。
2. 实现四项展示要求，检查折叠/展开与键盘恢复。
3. 运行标准工程和相关浏览器回归；桌面/平板/手机专项测量三栏顶边、右边缘、三方形入口及任务01指导样式、输入/提交/导航；查看真实截图。
4. 核对原件/内容保护与8766静态字节，REPORT如实记录并更新STATE/PROGRESS。

## 验收标准
- [x] 收起后更多不可见，三个图标入口等尺寸且宽高比1:1；恢复导航与返回总览有效。
- [x] 桌面（宽度>900px）导入及24任务左/中/右顶边误差不超过1px；右卡与AI按钮右边误差不超过1px；≤900px沿用纵向主辅布局，手机无横向溢出。
- [x] AI启动器只有图标，保留可访问名称、开关与回焦。
- [x] 任务01指导文字统一为14px/常规字重/同色同左起点，无角度胶囊或提示背景；文字与原表单校验不丢失。
- [x] 工程与相关回归通过，原件/内容零变化，无新应用错误、外部运行请求或真实模型调用；三个状态门不晋级。

## 验证
`python3 scripts/dev.py check`、`npm test`、`npm run test:browser`、`npm run test:pages-browser`与临时专项；必要时运行数据页回归。Browser plugin not available，使用已有Playwright/Chromium。临时证据只存`/tmp/flavoglycolab-task-046/`。

## 停止条件
需要改冻结内容/状态机/科学事实、需要新依赖或服务操作、不能保全已有改动、无法区分既有与新增故障。未通过不得标Completed。

## 报告要求
生成docs/reports/REPORT-046-panel-alignment-guidance.md，记录实际改动/验证分母、失败/修正及未测限制；更新STATE/PROGRESS，不自动执行下一TASK。
