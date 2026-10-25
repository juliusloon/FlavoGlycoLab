# TASK-039：学生端聚焦模式与24步高密度工作区

## 合同元数据
- 任务ID：TASK-039
- 状态：Completed（工程验收，2026-10-24；见同号REPORT）
- 基线分支：main
- 基线提交：92fe3f8
- 授权来源：human_direct。所有者明确要求收敛页头、设置内开发者模式、右下AI、24步排版及D01内容，并要求AgentSwarm与独立视觉验收。
- 人工负责人：项目所有者；执行者：Kimi及分工子Agent；2026-10-24由Cano按所有者“continue this session from another agent”明确指令接续收口，独立Agent复核代码与视觉。不代签教师审定。
- 修改预算：`frontend/student/`内共享页头、设置、样式、任务投影、组件展示与README；相关`tests/`；`docs/design/interface-system.md`；本TASK/REPORT及ARCHITECTURE/STATE/PROGRESS。无需新增运行依赖或运行文件。
- 关联ADR：沿用原生HTML/CSS/ES模块、hash子页面和单一学习状态，不新增框架或第二份学习真值。

## 目标
默认主导航仅保留实验总览和探究实验；实验记录独立位于右上；论文对照、案例、数据查询、界面规范及开发用逆合成导入归入“设置→开发者模式”。AI入口固定右下且不挤压正文。全部24步使用宽左导航、流式主区和非重复定位；仅D01（01—04）精简内容，D02/D03内部可视化不改。

## 背景与已核实事实
TASK-037建立双行页头、1180px容器和248px侧栏；当前任务与阶段页同时存在共享返回、局部任务条、任务topline和矩阵开发信息。任务右侧既有区域是作答区而非AI栏。原生应用无构建器，学习状态与内容登记已有工程守卫。

## 范围
### 允许项
- 共享页头与设置、学习页body级AI启动器、容器与侧栏尺寸、24步共享任务外壳、D01显示投影、相应测试和规范。
- 桌面外边距16px；左栏`clamp(272px,20vw,336px)`；总览最大1200px，其余内容页流式。主线任务与实验历程标题统一14px/600。
- 移除任务/阶段/导入顶部重复返回与局部导航、任务topline、大号编号、界面N/6及“实际任务与来源”开发块。保留下一项/完成探究等真实流程按钮。
- D01去除数字引用和开发来源/自查块；01观察指引、比较角度和必要提示仅在右侧显示一次，不显示ChEBI标签。总览移除开发资料导航卡。

### 禁止项
- 不修改`content/demo-content.json`、状态机、科学数据、metadata、migrations、reference、原始来源、私有模型配置或服务端。
- 不改D02（05—08）/D03（09—12）内部可视化、控件、文案或科学语义；不改`assemblyView`、`planView`、`lockedField`、`amountPreview`、`inquiry-tools.css`和09工具内部。
- 不删除底层来源/审核字段，不把待审内容改为已审定，不生成观测、数值、成绩或许可。
- 不新增依赖，不提交/push，不操作LAN 8766、模型、系统服务、网络或防火墙，不自动启动下一TASK。

### 涉及目录及文件职责
| 目录职责 | 文件 | 当前状态与拟改动 |
| --- | --- | --- |
| 共享页头与设置 | `components.js/.css`、`index.html`、`app.js` | 单行主导航、共享设置二级开发入口、独立记录、body级AI；保留路由和事件能力 |
| 24步外壳与D01 | `styles.css`、`design-tokens.css`、`views/inquiry.js`、`views/workbench.js` | 流式宽度、宽左栏、去重复导航与D01提示归位；阶段view内部不动 |
| 总览与组件/独立页 | `views/pages.js`、`components-page.js`、`case-page.css`、`data-page.css` | 去除开发资料重复入口和旧限宽说明 |
| 工程守卫 | `tests/test_navigation.mjs`、`test_pages_browser.mjs`、`test_data_query.mjs`、`test_inquiry_browser.mjs` | 测试先行，覆盖新结构、24步截图与AI几何 |
| 设计与事实闭环 | `docs/design/interface-system.md`、`frontend/student/README.md`、ARCHITECTURE/STATE/PROGRESS、本TASK/REPORT | 只登记现行规则和真实验证结果 |

## 非目标
不重新设计品牌、字体或科学可视化；不实施TASK-036，不新增账户、开发者权限、科学数据、教学评分、真实仿真、公众发布或跨设备记录。

## 必须执行的操作
1. 保存修改前标准检查与浏览器证据，两个实施Agent按互不重叠的文件所有权并行工作，测试先写并观察合理失败。
2. 共享页头改为总览/探究两项，右上记录和设置；设置内以原生二级区域承托四项开发入口及工作台逆合成导入，所有独立页仍可访问。
3. 全部24步移除重复定位与开发矩阵；左侧只保留快速任务导航；AI固定右下且开关不改变主区尺寸。
4. D01按用户指向精简，01指引和比较角度放右侧；其他任务只做共享格式调整。
5. 完成标准测试、24步桌面/手机截图、独立Agent整体视觉验收；失败须修复复核，不以截图存在代替通过。

## 验收标准
- [x] 默认页头/设置/记录/AI入口符合上述信息架构，所有既有URL、深链、门禁、草稿、回退/刷新和导出可用。
- [x] 24步无重复顶部导航和指定开发文案；左栏无当前任务长自然段，两个左栏标题字号一致；01指引只在右侧一次且无ChEBI展示。
- [x] 桌面16px外边距、左栏272—336px、主区无旧1180/1600/1080强制限宽；AI关闭无AI空白列，移动无页面横向溢出。
- [x] D02/D03内部控件、内容和顺序不变；科学边界与三门状态不因此改变。
- [x] `python scripts/dev.py check`、`npm test`、`npm run test:browser`、`npm run test:pages-browser`、`npm run test:data-browser`实际通过；console错误/外部请求不新增。
- [x] 独立Agent实际检查1536×1024与375×812全部48张任务截图及关键页面/交互，并记录结论与未测边界。

## 验证
```bash
python scripts/dev.py check
npm test
FRONTEND_URL=http://127.0.0.1:8770/ npm run test:browser
FRONTEND_URL=http://127.0.0.1:8770/ npm run test:pages-browser
FRONTEND_URL=http://127.0.0.1:8770/ npm run test:data-browser
```
浏览器证据和截图放`/tmp/flavoglycolab-task-039*`，不作为公开资产。测试服务只用127.0.0.1:8770。

## 停止条件
基线测试异常且无法区分既有问题；出现其他成员冲突且不能安全保留；必须修改D02/D03内部、状态机、科学/教学门或受保护数据才能满足；同一根因连续三次修复无效；任何测试或视觉验收仍红时不得记Completed。

## 报告要求
生成`docs/reports/REPORT-039-student-focused-workspace.md`，逐文件记录真实改动、验证分母、失败/重试、独立视觉验收和未测边界，更新STATE/PROGRESS；三门独立登记，不自动开始TASK-040。
