# TASK-063：内容高度问答卡底部衔接与笔记本导师入口

## 合同元数据
- 任务ID：TASK-063；状态：Completed（2026-10-26）。
- 基线分支/提交：main / dcab65f；保留TASK-058—062及既有工作树改动。
- 授权来源：human_direct，所有者明确纠正“右侧问答卡按内容自然撑高，但是和下面的论文笔记本接起来对齐”，并要求笔记本页可见AI导师按钮。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/styles.css、app.js、index.html；tests/test_case_route_browser.mjs、tests/test_inquiry_browser.mjs仅更新受影响的既有布局/入口断言；ARCHITECTURE.md、docs/design/interface-system.md、frontend/student/README.md同步当前规范；本TASK/同名REPORT、STATE.md、PROGRESS.md、docs/tasks/README.md、docs/reports/README.md。临时脚本/基线/截图在/tmp/flavoglycolab-task-063/，不进入Git。
- 关联ADR：沿用既有界面/笔记职责，不新增状态真值或科学决定。

## 目标
桌面问答卡以底边为锚点，底边到论文笔记本按钮顶部保持16px；高度随内容增减且向上展开，窄屏保持流式。论文笔记本打开后AI导师入口可见、可点击，开关导师不重排正文。

## 背景与已核实事实
TASK-062已实现内容高度，但仍按上边对齐；只将导师面板放进原生浮层，启动按钮仍在body，被论文modal遮挡并失去交互。这两点不满足所有者本次澄清的意图。

## 范围
### 允许项
- 修改桌面右卡底部定位与最大高度，保留内容自然高度、长卡滚动及手机布局。
- 复用同一个AI导师按钮，确保在论文dialog上方显示/获得焦点，关闭后仍可再次唤起；不恢复已删除的论文内文字按钮。
- 更新受影响的几何断言，验证导入与主线、短/长内容、屏幕缩放和论文便签切换。
### 禁止项
- 不改科学内容、来源、PDF/分子资产、metadata/registries、raw/derived/private、学习状态机和模型协议。
- 不改既有论文排版，不安装依赖、不操作常驻服务、不提交/push，不覆盖前序改动。
### 涉及目录及文件职责
| 职责 | 文件 | 拟改动 |
| --- | --- | --- |
| 右卡布局 | styles.css及必要app.js布局测量 | 自然高度且底部衔接 |
| 导师浮层入口 | index.html、app.js、styles.css | 单一按钮跟随modal并显示在上层 |
| 工程守卫 | 预算内两套测试 | 同步底边几何和真实点击路径 |
| 规范与闭环 | 预算内文档 | 记录纠正、事实及验证 |

## 非目标
不改变问答、评价、教学解锁、科学/教学/公众发布状态。

## 必须执行的操作
1. 保存工作树指纹及目标源码，登记human_direct合同。
2. 实现底边锚定与可点击的论文页导师按钮。
3. 实际8766桌面/手机专项、受影响回归及public工程验证；核对保护SHA和服务字节。
4. 生成REPORT并更新STATE/PROGRESS、索引与必要规范。

## 验收标准
- [x] 桌面短/长问答卡底边到论文笔记本顶部恒为16px，卡片不被拉伸，内容可访问。
- [x] 导师开关前后正文/右卡几何不变，手机无横向溢出。
- [x] 从关闭状态打开笔记本后，导师按钮可见且可通过真实点击唤起导师；关闭导师后可再次点击，三论文便签均适用。
- [x] 关闭笔记本后入口和面板仍可使用，键盘/focus正常，无新增应用错误。
- [x] 保护SHA、静态资产和工程检查通过，三个审核门不晋级。

## 验证
Browser plugin not available，继续使用已有Playwright、Node22和缓存Chromium，不安装。目标流：实验页内容高度/底边 → 先打开笔记本 → 点击AI入口 → 关闭/重开导师 → 切换论文/关闭笔记本；在1536、1280和390宽度实测，相关浏览器回归及scripts/dev.py check验证。

## 停止条件
未知并发差异、预算外文件改变、需要科学/学习状态或服务改动、缺少依赖需安装时停止相应动作并报告。未通过不得标Completed。

## 报告要求
生成docs/reports/REPORT-063-bottom-card-notebook-tutor-entry.md，记录实际改动、验证分母、失败/纠正及边界；更新当前事实，不自动执行下一TASK。
