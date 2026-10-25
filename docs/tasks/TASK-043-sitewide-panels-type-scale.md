# TASK-043：阶段图标、独立面板与全站字号统一

## 合同元数据
- 任务ID：TASK-043
- 状态：Completed（2026-10-24，工程验证；见同号REPORT）
- 基线分支/提交：main / 92fe3f8；保留TASK-039—042既有未提交改动，TASK-041当前已按其报告完成。
- 授权来源：human_direct，所有者本轮明确要求01—06阶段序号改为对应图标、中右面板分开、页头收窄、左栏字号略缩并统一全站文字尺寸。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/ui.js、views/workbench.js、views/pages.js、components-page.js中现有字号/布局规范展示字符串；design-tokens.css、components.css、styles.css、case-page.css、data-page.css、inquiry-tools.css的展示样式；tests/test_inquiry_browser.mjs、test_pages_browser.mjs中受影响的现有断言；docs/design/interface-system.md、本TASK/REPORT、STATE/PROGRESS。无需用完预算。
- 关联ADR：沿用原生ES模块与共享token/组件，不新增框架或运行文件。

## 目标
六阶段导航用明确对应的本地SVG代替可见序号；中间叙事/证据与右侧问题/填写分别为独立面板。桌面页头约56px、手机约48px。统一字号层级：左栏标题16px、任务14px、简介12px、阶段13px；正文14px、辅助12px、控件13px、面板标题16px、页面标题24px（手机22px）。全部既有页面与共用弹窗使用同一套层级。

## 背景与已核实事实
TASK-042侧栏标题18px、任务15px、简介13px、阶段14px；本轮所有者说明图标原意为阶段01—06的序号替换。共享页头由components.css维护，高度token为72px。任务/导入已有task-view两个区域，中栏尚无完整面板边界，右栏存在多个内层卡。页面包含总览、三幕、24任务、六阶段、论文/记录/案例/数据/组件及原生弹窗。

## 范围
### 允许项
- 在ui.js唯一登记六阶段图标映射，供实验历程及总览阶段列表复用；保留可读阶段名称、aria-current、disabled及原事件属性。
- 删除误加在实验历程标题前的历史图标；标题右侧新实验位置保留，沿用确认逻辑。
- 通过共享token和现有CSS统一文字大小，将旧8—11px辅助字提升至12px；主标题、面板标题、正文、控件与辅助字按用途统一；科学SVG/分子图内专用标注及品牌图形可保留。
- 给task-narrative/intro-act与task-rail独立边界、背景、圆角与16px间距；去右栏重复外框/内边距，保留问题、输入、反馈和分页。
- 收窄共享页头并同步实验可用高度；手机保留独立纵向面板，不遮挡导航/输入/导师。
- public临时实例验证，不调用真实模型；8766只核对静态资产与查看页面，不重启。
### 禁止项
- 不改任务顺序/目标/答案、教学规则、状态机、app.js、导航算法、数据/科学内容及教师/许可事实。
- 不改raw/derived/private、registries、metadata、migrations、reference或原始交件。
- 不新增依赖、后端/模型/系统服务改动、Git提交/push或公众发布。
### 文件职责
| 职责 | 文件 | 变动 |
| --- | --- | --- |
| 图标/只读投影 | ui.js、views/workbench.js、views/pages.js | 统一六阶段图标，保留行为 |
| 全站外观 | 现有token/共享与领域CSS | 收窄页头、统一语义字号、中右独立面板 |
| 既有验证 | test_inquiry_browser.mjs、test_pages_browser.mjs | 更新旧字号断言并保持全部流程覆盖 |
| 规范与闭环 | interface-system.md、TASK/REPORT、STATE/PROGRESS | 当前规范与真实结果 |

## 非目标
不重新设计科学图示、不改AI职责或状态真值、不加入新内容/功能/页面。

## 必须执行的操作
1. 保存当前允许文件基线及受保护资产/代码指纹，登记合同。
2. 实现阶段图标与共享字号/页头，再完成中右面板外观。
3. 运行标准工程与工作台/跨页/数据浏览器检查；桌面/平板/手机逐页查看面板、字号、页头、图标和溢出，并实点任务/阶段/新实验。
4. 核对保护零差异，生成REPORT，更新STATE/PROGRESS，不自动开始下一任务。

## 验收标准
- [x] 阶段列表六个对应图标，无可见01—06序号，名称、门禁和阶段切换有效。
- [x] 导入三幕及24任务中右两块有独立面板边界/16px间距，窄屏自然堆叠，内容/控件完整。
- [x] 全站共享页头桌面56px/手机48px左右，主导航/记录/设置保持一行可达。
- [x] 左栏缩小一个字号层级，各页面与弹窗按统一token呈现标题/正文/辅助/控件；无8—11px普通辅助文字。
- [x] 标准工程与三套浏览器检查通过，截图实际查看；无新应用错误或横向溢出，原件/规则不变，三状态门不晋级。

## 验证
```bash
python3 scripts/dev.py check
npm test
FRONTEND_URL=http://127.0.0.1:8772/ npm run test:browser
FRONTEND_URL=http://127.0.0.1:8772/ npm run test:pages-browser
FRONTEND_URL=http://127.0.0.1:8772/ npm run test:data-browser
```
Browser plugin not available，沿用已有Node22/Playwright/Chromium。所有临时日志、脚本、基线和截图存/tmp/flavoglycolab-task-043/。

## 停止条件
需要改科学事实/学习规则/受保护原件；不能保留既有修改；必须新增依赖或真实模型/系统服务操作；无法区分既有与新增故障。失败不得标Completed。

## 报告要求
生成docs/reports/REPORT-043-sitewide-panels-type-scale.md，写真实差异、验证分母、失败/重试与未测限制；更新STATE/PROGRESS。
