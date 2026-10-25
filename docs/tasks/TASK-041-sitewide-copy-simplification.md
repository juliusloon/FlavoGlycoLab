# TASK-041：全站精简展示与陈述式文案

## 合同元数据
- 任务ID：TASK-041
- 状态：Completed（2026-10-24，工程验证；见同号REPORT）
- 基线分支/提交：main / 92fe3f8；当前含TASK-039/040未提交工作，全部保留。
- 授权来源：human_direct，所有者明确要求“这一改动思路需要同样布置到其他所有页面中”。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/内views/*.js、components*.js/.css、case-page.js、data-page.js、retro-import.js、ui.js、app.js的展示字符串、四个页面HTML、styles.css和case/data-page.css；demo-content.json仅展示文案；现有tests/test_inquiry_browser.mjs、test_pages_browser.mjs、test_data_page_browser.mjs、test_case_page.mjs、test_navigation.mjs中受影响断言；docs/design/interface-system.md、本TASK/REPORT、STATE/PROGRESS。无需用完全部预算。
- 关联ADR：沿用原生HTML/CSS/ES模块、单一学习状态及既有工件责任，无新框架或运行文件。

## 目标
将TASK-040的原则应用于所有已实现页面及共用弹窗：正文以明确主语陈述，移除重复介绍、幕次/章节kicker、开发版本/状态代码与重复来源/审定标签；主要学习区域只展示内容、当前状态及必要操作。论文原文、来源定位、审核/许可事实仍可按需查询，不改变内容/数据本身的可信度。

## 背景与已核实事实
当前存在总览、三幕导入、24任务、六阶段、论文对照/结论、记录、案例、数据查询和开发组件页，以及设置/AI/确认/逆合成弹窗。重复噪声包括agent_checked_candidate、观测对象字段、S1—S6文案版本、每行待审、task05—24数字来源及正文旁来源解释。来源查询是数据页/论文页的实际职能，不机械删除其筛选器、DOI或引用。

## 范围
### 允许项
- 全站移除重复kicker、版本说明、开发实现说明、重复题目/来源编号与同区域重复状态；导入第二/三幕沿用第一幕清理。
- 各任务去数字引文及来源自查开发块；保留论文解读/PDF、比较入口、作答引导和现有分页。
- 用明确分子/组分/方案主语替换展示文案中的含糊“它/它们”；提问仍作提问，科学和教学语义不变。
- 案例原交件S1—S6、开发状态和来源版本集中到按需展开区；数据来源登记集中展开，记录卡保留实际来源/条件/原文定位，去每卡重复待审。
- 文献数值保留“原文报告·非本次观测”，缺数据、机器评价、保存/错误/门禁/删除确认等实际状态明确呈现。审核/许可元数据继续保留，不用CSS掩盖真实状态。
- 共享规范写入既有interface-system.md，复用现有控件；必要样式仅配合简化后的结构。
- 在/tmp保存本轮基线、证据与截图；测试用127.0.0.1:8771无模型临时实例，并核对所有者给定8766实际页面，不重启既有服务。
### 禁止项
- 不改raw/derived/private、metadata、registries、migrations、reference及原件字节。
- 不改lab-state/learning-state/quest-state/navigation/analysis-engine/data-query中的规则与状态；不改答案、任务顺序、量规、记录值/条件/单位、source_id/SHA/定位、授权及review_status/teacher_approved等事实字段。
- 不改三路线图示的科学连接/控件/流程，不编造观测、功效或推荐条件；原始成员交件与逐字S1—S6字段保留。
- 不新增依赖、真实模型请求、服务/网卡/防火墙操作、Git提交/push或公众教学发布。
### 文件职责
| 归属 | 工件 | 改动职责 |
| --- | --- | --- |
| 展示/编排 | frontend/student/views及各页脚本/HTML | 删除冗余呈现，压缩说明，保留行为与实际反馈 |
| 候选文案 | demo-content.json | 仅明确列出的展示字符串，来源和实证字段完整保留 |
| 组件/样式 | 已有components与页面CSS | 复用原生details与样式，不全局隐藏内容 |
| 验证 | 既有Node/浏览器测试 | 调整失效的展示断言，检验导航/筛选/保存/PDF/门禁/状态继续正确 |
| 长期规则/闭环 | interface-system.md、TASK/REPORT、STATE/PROGRESS | 保存全站文案原则、真实结果与限制 |

## 非目标
不重做视觉风格或布局，不建设新科学/教学/账户模块，不重新审核文献，不扩写新的生物活性或数值结论。

## 必须执行的操作
1. 按页面矩阵盘点，保存完整前端与受保护字段/资产基线。
2. 统一共享展示和说明，逐页整理正文；每页以内容和行动为中心。
3. 运行标准检查、工作台/跨页/数据浏览器套件；覆盖24任务、三幕/六阶段、论文/记录/案例/数据/组件及关键弹窗桌面/手机截图，并实际查看代表截图。
4. 逐字段对比受保护JSON/代码及原件SHA；生成REPORT，更新STATE/PROGRESS。

## 验收标准
- [x] 所有已实现页面及共用弹窗均经审查；共享冗余和开发字符串从学习默认区移除。
- [x] 展示文案主语明确，已有来源/许可/待审事实仍可查询；数值语义与缺数据反馈清晰。
- [x] 24任务、三幕/六阶段、论文/PDF、筛选深链、记录/导出、设置/逆合成、回退/刷新及门禁继续通过。
- [x] Python/Node及三套浏览器验证通过，桌面/手机无新增应用错误与横向溢出，实际查看截图。
- [x] 科学字段、状态机、原件与元数据保护零差异，三状态门不晋级。

## 验证
```bash
python3 scripts/dev.py check
npm test
FRONTEND_URL=http://127.0.0.1:8771/ npm run test:browser
FRONTEND_URL=http://127.0.0.1:8771/ npm run test:pages-browser
FRONTEND_URL=http://127.0.0.1:8771/ npm run test:data-browser
```
本机使用已有Node22和Chromium1243，Browser plugin not available，继续使用已有Playwright。输出统一置于/tmp/flavoglycolab-task-041/。

## 停止条件
需要改受保护事实/状态/原件；删文使数值或机器反馈被误认为真实观测/教师结论；不能安全保留原修改；必须新增依赖/权限或调用真实模型；无法区分既有和新增测试故障。

## 报告要求
生成同号REPORT，列逐页覆盖与逐文件差异、验证分母、失败/重试和未测边界；当前事实和里程碑归STATE/PROGRESS，不自动开启TASK-042。
