# TASK-042：左侧主线任务与实验历程排版

## 合同元数据
- 任务ID：TASK-042
- 状态：Completed（2026-10-24，工程验证；见同号REPORT）
- 基线分支/提交：main / 92fe3f8；完整保留TASK-039—041既有未提交工作，TASK-041仍按原报告记录实施状态。
- 授权来源：human_direct，所有者本轮明确要求放大左栏字号、任务状态文字改短介绍、直接展示全部任务、删除底部重复任务/开始探究按钮，并把开始新实验移至实验历程标题右侧、添加图标。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/views/inquiry.js、views/workbench.js、styles.css、ui.js；tests/test_inquiry_browser.mjs中受影响的既有断言；docs/design/interface-system.md；本TASK/REPORT、STATE.md、PROGRESS.md。临时基线、脚本和截图仅存/tmp/flavoglycolab-task-042/。
- 关联ADR：沿用原生组件及单一学习状态，不新增依赖或架构决定。

## 目标
左栏直接展示本阶段四项任务，各有简短行动介绍；高亮/灰色、勾选、原生disabled及aria-current表达任务状态。已解锁项可直接打开/回看。任务及实验历程字号适合阅读，实验历程标题右侧提供带图标的新实验入口。

## 背景与已核实事实
当前questPanel只展示本阶段最多三项，其余在重复的details内；副行显示当前/下一任务，底部再次展示当前标题及CTA。主线标题14px，任务标题桌面12px/手机9px，阶段11px；手机还隐藏副行。全阶段共24任务，既有实验历程负责切换六阶段；本轮“全部任务”指取消当前details折叠，直接展示既有本阶段完整列表。

## 范围
### 允许项
- 任务列表展示本阶段全部任务；用与既有目标对应的24条简短介绍替代状态文字。
- 删除侧栏重复任务标题、开始/继续探究及查看全部任务入口；完成阶段仍可从现有任务末尾和实验历程进入操作区。
- 调整桌面/手机字号、间距、换行和触控尺寸，保留现有高亮、禁用和进度。
- 实验历程标题行右对齐开始新实验，复用原确认逻辑，加入轻量SVG图标。
- 按原始导入完成条件投影侧栏disabled，保持已有任务/阶段解锁规则。
- 验证public本机临时服务及现有8766静态页面，不重启常驻服务，不调用真实模型。
### 禁止项
- 不修改状态机、答案、学习完成规则、24步目标与顺序、科学内容/原件、metadata、registries、data、migrations、reference。
- 不新增依赖、后端/AI改动、Git提交/push、部署或审核门晋级。
### 文件职责
| 归属 | 文件 | 改动 |
| --- | --- | --- |
| 现有UI投影 | views/inquiry.js、views/workbench.js | 完整任务列表、短介绍及新实验标题行 |
| 样式/图标 | styles.css、ui.js | 响应式阅读尺寸及图标 |
| 工程守卫 | tests/test_inquiry_browser.mjs | 更新旧布局断言，保留全部流程测试 |
| 规范与闭环 | interface-system.md、TASK/REPORT、STATE/PROGRESS | 现行样式与真实结果 |

## 非目标
不重做右侧内容、全站视觉或教学流程，不关闭或代验收TASK-041。

## 必须执行的操作
1. 保存改动前文件、受保护资产与状态代码指纹。
2. 实现主线完整列表、介绍与实验历程标题行。
3. 执行标准检查、已有工作台/页面浏览器套件；专项覆盖六阶段/三路线、桌面及手机、任务解锁/回看、新实验取消/确认；查看截图。
4. 生成REPORT并更新STATE/PROGRESS，不自动开启下一TASK。

## 验收标准
- [x] 每阶段四项任务直接展示，短介绍可见，无当前/下一任务文字及重复CTA/details。
- [x] 标题18px、任务标题15px、短介绍13px、阶段14px；手机仍完整换行，无横向溢出。
- [x] 未解锁任务不可打开，完成导入后可点击已解锁任务，阶段转换与完成后回看可用。
- [x] 新实验位于实验历程标题右侧，带图标；取消保留草稿，确认清空当前草稿并保留已存记录。
- [x] 标准工程与受影响浏览器检查通过；保护字节零差异，三状态门不晋级。

## 验证
```bash
python3 scripts/dev.py check
npm test
FRONTEND_URL=http://127.0.0.1:8772/ npm run test:browser
FRONTEND_URL=http://127.0.0.1:8772/ npm run test:pages-browser
```
Browser plugin not available，使用已有Node22/Playwright；证据输出设为/tmp/flavoglycolab-task-042/。

## 停止条件
必须改动学习/科学规则或受保护资产；无法保留已有改动；需要新增依赖、真实模型或系统服务操作；不能区分既有/新增故障。失败不记Completed。

## 报告要求
生成docs/reports/REPORT-042-sidebar-task-typography.md，记录实际差异、验证分母、截图、失败/重试与未测边界，并更新STATE/PROGRESS。
