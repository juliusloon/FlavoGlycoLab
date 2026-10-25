# TASK-048：AI实验导师浮窗精简

## 合同元数据
- 任务ID：TASK-048
- 状态：Completed
- 基线分支/提交：main / 92fe3f8；保留039—047已有工作，047仍由原任务收口。
- 授权来源：human_direct，2026-10-25用户明确要求删除导师两处演示说明、区分当前任务按钮、移除提示/参考内容上方分割线。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/{index.html,app.js,styles.css,README.md}、tests/test_data_page_browser.mjs、本TASK/REPORT、STATE.md、PROGRESS.md；不增加依赖。
- 关联ADR：无新增。

## 目标
导师已配置时仅显示“Qwen · 实时辅导”，删除固定演示角标；当前阶段/主线显示独立按钮，可返回对应任务；提示区上方不再显示分割线。

## 背景与已核实事实
两处文案分别来自index.html与app.js健康状态逻辑；当前上下文为strong纯文字，提示按钮位于带border-top的tutor-bottom。Browser plugin not available，使用现有Playwright验证。

## 范围
### 允许项
- 在既有student模块内删除两处指定展示文案与闲置样式，保留未配置/故障状态。
- 将当前任务文字改为独立按钮，沿用既有任务/阶段入口；保留论文阅读上下文。
- 移除提示区顶部边框，同步已有文档与被替代的浏览器断言；允许修正导师浮层自身的控件遮挡。
- 验证桌面/手机实际页面、8766静态资产与冻结资产；不调用真实模型。
### 禁止项
- 不修改科学内容、原件、raw/derived/private、metadata/registries、迁移/参考/原交件。
- 不修改后端、模型配置、学习完成/答案/评分与三个状态门，不重启服务，不提交/push。
- 不接管TASK-047，不覆盖其已有改动。
### 涉及目录及文件职责
| 职责 | 文件 | 拟改动 |
| --- | --- | --- |
| 导师浮窗及状态投影 | frontend/student/index.html、app.js、styles.css | 指定文案、上下文按钮、提示区边框 |
| 使用说明及工程守卫 | frontend/student/README.md、tests/test_data_page_browser.mjs | 当前展示说明、替换旧角标断言 |
| 闭环 | 本TASK/REPORT、STATE.md、PROGRESS.md | 如实登记本次改动及验收 |

## 非目标
不改变平台接入、科学/教学审核事实，不重做整站或任务内容。

## 必须执行的操作
1. 保存已有文件与保护SHA基线。
2. 实施三处界面调整并同步已有断言/说明。
3. 验证流程：任务01→打开AI导师→检查文案/按钮/分割线→点提示预填→点击当前任务按钮返回；覆盖桌面及手机、已配置/未配置/故障状态。
4. 执行相关工程检查，核对保护资产与8766，REPORT收口并更新STATE/PROGRESS。

## 验收标准
- [x] 导师浮窗不再出现两处演示说明；已配置仅显示Qwen · 实时辅导，降级状态准确。
- [x] 当前任务按钮与正文有明确边框/背景区分，键盘可用，可返回当前任务；阅读上下文仍显示。
- [x] 提示/参考区域上方边框为0；提示预填、输入草稿、关闭/回焦正常。
- [x] 桌面/手机无浮窗横向溢出、应用异常或新增外联；既有相关检查通过，冻结资产不变。
- [x] 三状态门保持候选/22项待教师审定/not_started。

## 验证
npm test；python3 scripts/dev.py check；npm run test:data-browser；临时Playwright专项（证据/tmp/flavoglycolab-task-048/）。仅模拟健康状态，不调用真实模型。

## 停止条件
需要改动冻结数据、后端/模型/服务，范围溢出，或不能保全已有工作时停止并报告。

## 报告要求
生成docs/reports/REPORT-048-tutor-panel-cleanup.md，记录真实结果与未测项；更新STATE/PROGRESS，不自动开始下一TASK。
