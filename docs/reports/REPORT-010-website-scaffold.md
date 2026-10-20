# REPORT-010：学生网站结构与导航骨架

## 对应任务
- TASK：[TASK-010-website-scaffold.md](../tasks/TASK-010-website-scaffold.md)
- 状态：Completed（本地网站骨架工程验收）
- 日期：2026-10-19；授权来源：human_direct，龙锦轩明确指令“开始网站骨架……开始执行”。
- 基线：main，279d76bfaaff053f30e840b9e68a1938caecd28a，初始工作树干净。
- 结果提交：pending；本任务未Git提交、推送或公开部署。
- 审核性质：agent_checked；human_reviewed=false；工程实现不替代教师审核。

## 改动文件与职责

| 文件/职责 | 实际改动 |
| --- | --- |
| frontend/student/index.html、app.js | 无构建依赖的shell、六个hash路由、404、导航与移动菜单、加载失败提示 |
| frontend/student/ui.js、styles.css | 转义与来源组件、统一线框图标、设计token、响应式/焦点样式 |
| frontend/student/views/home.js、case.js | 工作台入口；候选案例、三条路线、三篇来源元数据与待审字段 |
| frontend/student/views/steps.js | 六个界面阶段、24步选择、设计详情、跨阶段下一步；无实验控件或完成计数 |
| frontend/student/views/ai.js、information.js | 三阶段预置脚本、无数据提示、项目范围与独立状态门 |
| frontend/student/content/demo-content.json | 原创规划转述、来源标识/原位置/SHA/质量/许可/审核状态；无实验数值 |
| frontend/student/README.md | 只服务student目录的本地启动、页面边界与交接字段 |
| tests/test_frontend_scaffold.mjs | 有失败后果的导航、缺数据、来源与模型边界、实际浏览器行为守卫 |
| TASK/REPORT、索引、README/ARCHITECTURE/STATE/PROGRESS | 本次范围与事实闭环，不批准旧候选完整演示或文档准备 |

## 实际操作与观察

交付六个入口：实验室概览、案例与路线、24步流程、数据覆盖、AI示例、项目说明。24步仅能查看设计与预留位置，页面明确“尚未实现实验交互与评分”；不存在学习完成率。三个AI按钮切换原创脚本，明标“交互示例，未连接实时大模型”，无模型调用、输入收集、对话存储或成绩。

来源页只有规划转述、DOI和已登记原件SHA。页码/图表、科学条件、观测和许可保持待核；原件SHA不等于内容核验通过。三路线分别呈现底物、目标和来源，不混用结果。规划材料SHA逐字节复核。没有将PDF、文献图表、历史案例表或私有数据复制进网页。

观测内容为`observations=[]`、`quantitative_result=null`；数据页显示“无对应实验数据”，拒绝产率、浓度、色谱与时间曲线。当前未建设条件查询，也不把未实现的查询说成完整拒绝服务。

## 验证

本地服务：`python3 -m http.server 8765 --bind 127.0.0.1 --directory frontend/student`。仅student资产可读。Browser插件/技能未提供，使用Playwright1.64.1 + 现存Chromium153.0.8010.12，无新增浏览器下载；不是Chrome/Edge双浏览器验收。

| AC/方法 | 分母、实际结果、证据与限制 |
| --- | --- |
| AC1：实际加载与导航 | 6路由×3视口＝18组合全部通过；另测404返回、浏览器后退、键盘skip link与焦点；无空白或框架错误页。证据：temp/task-010/browser/results.json |
| AC2：案例/来源与字节 | 3路线/3来源均有待审、许可与定位缺口；3原件+1规划文件SHA逐项相符。工程来源检查不等于文献精读或科学核验 |
| AC3：步骤选择 | 6阶段/24唯一位置；24/24逐步点击核对动作、反馈位、依赖、待审与占位提示；跨04→05展开正确，24返回数据页。无实验交互/评分 |
| AC4：无数据 | 观测空数组、结果null、页面明确无对应实验数据，不将缺失填0；无图谱或产率输出。没有可验收的已测分支 |
| AC5：AI示例 | 3/3脚本可切换，实验中示例拒绝无依据产率；方向键/Home/End更新选中和面板关联；无模型请求 |
| AC6：布局/运行 | 1505×1045、768×1045、375×812的18路由组合均无水平溢出；长SHA展开亦通过；控制台错误0、破损资源0、外部请求0、本地存储0 |
| AC6：图像比对 | 内置Image Gen概念2张，原生1505×1045；同轮view_image查看两概念+最终截图；另查移动/案例/数据/AI。9个具体比较点见temp/task-010/fidelity-ledger.md；不是像素相等指标 |
| AC7：治理、保护、语法 | 治理8/8、JS语法8/8、受保护文件80/80原字节不变、46/46文档相对链接存在、git diff --check通过；证据：temp/task-010/governance.log、integrity.json。保护范围含注册表、原件/迁移登记/参考快照等既有tracked文件，排除本次允许修改的治理文档；没有检查所有ignored私有文件的字节 |

前端行为脚本合计53/53检查通过。运行方式：

```bash
PLAYWRIGHT_MODULE="$PWD/temp/task-010/qa/node_modules/playwright/index.mjs" \
CHROMIUM_EXECUTABLE="$HOME/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome" \
node tests/test_frontend_scaffold.mjs
```

Playwright是临时工程测试工具，仅装在ignored的temp/task-010/qa；应用没有npm运行依赖。上例浏览器路径是本轮测试环境记录，不是网页运行依赖。换环境可提供可用的`PLAYWRIGHT_MODULE`/`CHROMIUM_EXECUTABLE`。

### 视觉证据与文案检查

- 工程选定概念：temp/task-010/concept-home.png、concept-steps.png；内置image_gen生成，无CLI。提示词要求完整工作台、六入口、来源/缺数据/AI边界、精确中文文案、白/冷灰/绿配色，不使用论文图、结构式或假图表；详见会话原始调用与temp/task-010/design-spec.md。
- 最终渲染：temp/task-010/browser/final-home.png、final-steps.png；移动375-home.png、375-steps.png；其余各路由/视口截图同目录。
- 已按概念核验布局、字体层级、配色、图标、容器、间距和响应式；修正标题偏移、详情行距和flex压缩图标。首页可见文案逐项对照允许表，无无依据增加/遗漏。移动端新增“导航”为必要响应控件；键盘skip link是辅助文案。
- 必要偏差：删掉概念图中容易将三路线误解为连续反应的连接线；步骤页增加规划来源与阶段待审说明，完整截图略高于概念，仍以原生视口测试；详情使用已有规划的待交接措辞。无其余未修复的实质布局偏差。

## 与任务合同的偏差

范围无扩张，未执行旧候选完整演示合同。失败/修正：首次Playwright默认启动寻找1248版浏览器失败，改用本机1243缓存中的Chromium；首次截图定位器未考虑标题换行而超时，改为定位实际h1后正常截图。两者均为测试工具问题，保留事实；正式53项检查完整通过。

复跑与并发执行说明（2026-10-19，lead复核轮补充）：

- 执行轮结束时浏览器证据尚未落盘（`temp/task-010/browser/`当时不存在），上表53/53结论当时缺证据文件；lead以同命令复跑`tests/test_frontend_scaffold.mjs`：53/53通过（Chromium 153.0.8010.12，外部请求0、控制台错误0、存储0），治理8/8、JS语法8/8、`git diff --check`通过、受保护文件80/80字节不变，文档相对链接复查无缺失。证据目录`temp/task-010/browser/`（22件，含results.json与final-home/final-steps）由复跑生成，上表结论自此有证据支撑。
- 执行期间另一会话并行实施产生了重复的骨架文件写入（另一套命名布局），随后被本报告登记的实现整体覆盖；磁盘现状与"改动文件与职责"一致，无混合遗留文件。
- 字号实现为54/18/17/15px，design-spec初稿的52/16/15/14px为概念图近似读数；fidelity-ledger已按概念视觉层级修正记录，属读数口径差异，非布局偏差。
- 结果提交仍为pending；本轮未提交、未推送。

## 数据、许可与审核门

- research_evaluation：历史候选状态不变，本轮没有化学独立评价。
- teaching_case_review：22条仍pending_teacher_review，批准0；页面不更改准入登记。
- public_teaching_release：not_started；public_release=false；回环HTTP是开发预览，不是部署或公众开放。

## 已发现但未改的问题

科学证据卡/原文逐字段摘录/真实数据覆盖/教学量规尚待团队交接与教师审定。旧候选文档准备与完整演示提案继续未批准，不因本轮六入口完成而宣称其W-01/W-05或24步全部验收。Chrome、Edge、真实设备、现场展示、容量、安全和平台联调未测试。

## 遗留风险、仓库与CI

本轮未提交/推送，CI未运行；没有更改发布脚本、Git历史或第三方许可。80项受保护tracked文件字节未变（含三篇指定PDF）；本轮不读取私有候选数据。本地回环服务器仅为预览；停止方法见student README。

## 建议的下一TASK

待接收案例证据与教学矩阵后另行确定真实交互范围；不自动执行下一任务。
