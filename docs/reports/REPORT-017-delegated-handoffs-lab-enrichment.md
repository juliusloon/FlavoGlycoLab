# REPORT-017：代理交接、实验内容与助手交互

## 对应任务
- TASK：[TASK-017](../tasks/TASK-017-delegated-handoffs-lab-enrichment.md)；状态：Completed（本地代理交接与工程接入），2026-10-21。
- 基线：main / c90e0f7de2588d56fae4c3d23840323586afedbe；完整保留TASK-015/016尚未提交的改动。
- 授权来源：human_direct；所有者明确要求subagents补齐LYW/ZYT交接、交LJX丰富虚拟实验并实现右侧AI侧栏拖动。
- 执行：Cano根代理负责LJX技术接入，lyw_handoff与zyt_handoff分别准备交付，ui_resize负责侧栏/样式及专项QA。没有成员/教师真人签发或签收。
- 结果提交：pending；未提交/push，未运行远端CI。

## 改动文件与职责

| 目录/职责 | 文件 | 实际改动 |
| --- | --- | --- |
| LYW代理交付 | docs/p10ns/261019/24step_table_3-6.md、shenbaoshu_sections_LYW.md、b2_script_v1.md、b2_shotlist.md | 24步与配套3-6(2)、B2可录制工作稿；没有代交后续3-5/3-7或成片 |
| ZYT代理交付 | docs/p10ns/261019/case_evidence_table.md、b1_script_v1.md、b1_storyboard.md | 五类身份、21候选、三路线字段及B1脚本/分镜；原文冲突与未决科学字段保留 |
| 接收事实 | docs/p10ns/261019/handoff_acceptance.md | H02—H05的版本/完整SHA、检查/接入/未决责任；更新H06依赖已由代理接入的范围 |
| 学习内容与状态 | frontend/student/content/demo-content.json、learning-state.js、lab-state.js | 24项题目/理由/来源/反馈、五类身份与来源链接；学习草稿、独立判断、失效、旧记录迁移与导出 |
| 工作台呈现与事件 | frontend/student/app.js、views/workbench.js、views/learning.js | 六阶段嵌入探究卡，输入保存、核对、学习记录显示；修复移动抽屉扩屏后的焦点限制 |
| 侧栏与布局 | frontend/student/index.html、sidebar-resize.js、styles.css | 分隔条/按钮、指针及键盘、取消/重置/偏好记忆；中央内容按可用宽度重排，隐藏文本不撑高页面 |
| 工程验证 | scripts/dev.py、tests/test_workbench_state.mjs、tests/test_workbench_browser.mjs | 新JS运行资产检查、学习状态回归、三路线24项练习/导出/失效、长期侧栏交互回归 |
| 产品/案例说明 | docs/design/workbench.md、frontend/student/README.md、docs/cases/isoquercitrin/README.md | 24项练习及正式科学课程的区别、职责/操作、候选身份歧义入口 |
| 治理/入口 | ARCHITECTURE.md、STATE.md、PROGRESS.md、README.md、docs/README.md、docs/tasks/README.md、docs/reports/README.md、本TASK/REPORT | 工件登记、现行事实、里程碑与索引闭环 |
| 本地工程证据 | temp/task-017/ | 基线差异/194项保护指纹、只读身份响应、代理检查、浏览器截图/日志；全部ignored |

既有publication_sources.csv、ui.js、TASK-015/016相关原始改动来自开始时的工作树，不计作本轮新增成果。scripts/serve_lab.py最终未改：学习扩展与宽度均由静态前端完成，AI沿用原受限上下文/API，不要求重启服务。

## 实际操作与观察

### 交接与内容

原排程10-20要求B1初稿、B2大纲及案例/24步推进，完整v1截止10-21。本轮直接补到候选v1，不追写20号已交，也不把其余申报分段/互审/录制自动勾完。

- LYW代理：24行、180分钟、100分拟议量规；每步5—13分钟，四组各45分钟、拟议分20/20/40/20，24条量规分项与满分逐一相等。正式量规未启用。B2为16镜连续180秒、4个AI相关镜头，拒绝数值分支12秒；3-6(2)三段齐全。
- ZYT代理：5类身份卡，4单分子的分子式/结构标识在PubChem和ChEBI机器比对一致；EMIQ为混合物，单一结构/固定质量不适用。21条候选与原登记逐项相符，5个源文件SHA一致；11项withheld_unlicensed和10项missing不变。14个语义字段×3路线＝42格；B1为11镜连续180秒。
- 实际发现PubChem的isoquercitrin与isoquercetin名称解析返回不同结构记录。采用论文明确的3-O-β-D-glucopyranoside定义再核对，保留名称歧义，不改原记录、不宣称任意别名可合并。新结构/质量响应留temp，页面只显示原创连接辨析与原源链接。
- 面向LJX接入：M1—M5进入身份速查，C01—C14进入路线/供体/证据提示，24步映射六阶段（8/2/6/1/3/4）。每项有选择或短答、理由、核对反馈；13—22的数据依赖部分审查所缺材料，不画曲线或给产率。
- 05/06首次发起AI请求前的提交单独保留。请求失败/守卫也算已发起请求，不追认为独立提交；未配置且未发送请求不伪记模型调用。学习任务不强制替代原六阶段流程，也不按“提交24项”自动验收课程。
- 修改路线清除全部当前学习答案，修改材料清除阶段2及后续，修改条件清除阶段3及后续；历史快照保留。JSON/Markdown导出包含学习自述/反馈及独立判断；旧浏览器v1记录可迁移。

### 侧栏与视觉

右栏分隔条可鼠标/触控拖动；左右键16像素步进、Shift为48像素，Home/End到边界，Enter/双击/按钮恢复默认，Escape或pointercancel取消。偏好独立保存；宽度280—600像素且随可用空间钳制，中央操作区至少420像素。950像素及以下保留导师抽屉；回桌面清除移动焦点限制。拖动不重绘表单，未提交理由和AI问题不丢。

探究卡使用可折叠题目、来源提示和明确的“草稿/已记录”标识；侧栏加宽后材料、条件和分析面板按中央空间重排。实际查看桌面探究卡、宽侧栏、951临界视口与375移动截图。发现隐藏legend使根文档多余纵向滚动，修复定位后页面高度与视口一致。

## 验证

Browser plugin not available，使用已有项目内Playwright 1.64.1与Chrome 155.0.8059.84，无新增依赖。QA使用当前源码、127.0.0.1:8769隔离入口，CONFIG指向不存在的测试配置，不读取模型密钥、不调用上游。不是新的干净克隆或远端CI。

| 检查/命令 | 分母、结果与证据 |
| --- | --- |
| `python scripts/dev.py check` | Python 46项：43通过、3研究资产按显式public规则跳过；Node 14/14通过。engineering-final.log |
| `npm run test:browser`，指定已有Playwright/Chrome及8769 | 191/191通过；R1 1536×1024、R3 768×1024、R2 375×812；三路线均完成24项学习动作、六阶段主流程、刷新/导出/失效；console/page error 0、外部请求0。browser/results.json、browser-stable-final.log |
| `node temp/task-017/resize-check.mjs` | 48/48通过；1536、1024、951、768、375布局，指针/键盘/ARIA、草稿、偏好刷新、取消/重置、抽屉扩屏焦点、真实浏览器CDP触控/取消；errors=[]。resize-results.json |
| 页面标识/非空/可见内容/错误覆盖/截图/交互 | 标题与两入口正确；原生页面无空白或错误覆盖；实际提交/提示/拖动与保存变化可见。resize-desktop-learning.png及browser/各阶段截图，均在本地 |
| 代理交付检查 | LYW24/24量规、24/24前端映射；ZYT5卡/21候选/42格；B1/B2各180秒；7文件最终SHA、26/26本地链接有效。lyw-validation.json、zyt-handoff-check.json、handoff-files.json、handoff-final.json |
| 保护与范围 | 194/194初始保护文件SHA不变，无raw/derived/private新跟踪载荷。protection-final.json；7稿SHA登记在handoff_acceptance |
| 既有8766服务只读核对 | index/app/learning-state/views-learning/sidebar-resize/content/styles七项HTTP字节7/7与当前源码相同；刷新现有页面可用，无服务重启或配置修改。lan-assets.json |
| `git diff --check` | 通过；未提交/push，未运行远端CI |

最终主浏览器命令：

```bash
PLAYWRIGHT_MODULE="$PWD/temp/task-013/clean-clone/node_modules/playwright/index.mjs" \
FRONTEND_URL=http://127.0.0.1:8769/ \
CHROMIUM_EXECUTABLE="$PWD/temp/task-014/browsers/chrome/opt/google/chrome/chrome" \
BROWSER_LABEL=Chrome QA_OUTPUT=temp/task-017/browser npm run test:browser
```

这些路径只用于本机QA复用；成员仍按package-lock安装QA依赖，运行不依赖temp或其它工作区。侧栏专项脚本是本地证据；长期回归已加入tests/test_workbench_browser.mjs。

## 与任务合同的偏差、失败与修正

- 首次Python治理检查在本REPORT建立前运行，42通过、3跳过、1因TASK/REPORT未配对失败；建立对应报告后最终43通过/3跳过，没有绕过检查。
- 首次浏览器启动发现根node_modules没有Playwright；改用已存在的项目内安装，无新增依赖。随后一次学习题提交导致页面重绘、收起已展开来源，测试仍点击隐藏来源而超时；调整测试顺序，先完成来源展开检查再提交题目。183项通过后加入8项长期侧栏回归，最终191项在稳定CSS上通过。
- 侧栏专项最初使用错误模块路径，随后951px断言抢在resize事件前读取；使用现有安装及两次rAF等待后复验，最终48项通过。另真实发现移动焦点限制与隐藏legend纵向溢出，均修改产品并复验。
- 子代理交叉检查补正08练习示例、14酶活单位、16定量材料、21宿主/外加底物措辞；学习存储拒绝非对象映射及额外grade/observations字段。B1未配置模型分支明确为分析页/未配置提示，API守卫仅按真实连接情况录制；最终交接SHA已更新。
- 原T-Z1的五张“单一结构/质量”要求不适用于EMIQ；其余四卡已机器核对但本TASK不交付新增公开结构数据包。21条科学方向/酶促性/独立研究去重缺证据继续待审。以上是明确降级，不称原任务卡的科学/真人验收全部完成。

## 数据、许可与审核门

- research_evaluation：历史研究候选及机器核对；不表示独立化学实验验证。
- teaching_case_review：22/22 pending_teacher_review、教师批准0；页面自查不是教师审定或成绩。文档100分是拟议量规，不进评分代码。
- public_teaching_release：not_started；未进行专项发布。三篇PDF精确例外及rights_verified=false不变；SI、第三方结构原响应、受限历史载荷均未入公共Git。

## 已发现但未改的问题

文献条件冲突、标准曲线/峰面积/稀释/重复点表和菌株标签问题继续见data_gap_list；没有教师审定观测，不能开展真实D1/积分/产率或正式菌株效果比较。成员真人确认、互审、教师量规、视频录制及成片、后续申报分段均未发生，不代填。此次未测试Edge、Windows/macOS或实体触屏；触控为Chrome CDP模拟，没有容量/公网或长时可用性验收。

## 遗留风险、仓库与CI

当前main与HEAD不变；TASK-015/016/017均未提交同步，保留所有者原工作。未修改服务API、模型配置、常驻进程、网卡或防火墙。浏览器练习仍只在当前源localStorage，不是账号/跨设备/教师记录。

## 建议的下一TASK

由真人核对代理交接、解决科学/许可/量规未决项，再按实际获批范围安排审定数据与视频制作；本轮未启动这些工作。
