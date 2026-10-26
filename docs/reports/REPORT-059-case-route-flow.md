# REPORT-059：案例与路线四任务及总结页调整

## 对应任务
- TASK文件：[TASK-059](../tasks/TASK-059-case-route-flow.md)。
- 状态：Completed（2026-10-25，工程验收）。
- 基线：main / dcab65f，保留未提交的TASK-058成果。
- 结果提交：pending；授权来源human_direct及“直接实施并验收”答复。

## 改动文件与职责
| 文件 | 实际改动与职责 |
| --- | --- |
| frontend/student/views/inquiry.js、styles.css | 01目的/交付单页；02框内资料卡/工具与下方大画布；03阅读卡进笔记本，04独立决策视图；总结左完成/右判断及单个推进入口；沿用058删除的多余提示 |
| frontend/student/app.js | 来源/SMILES挂载到分子资料卡；初选不弹更换确认、不回到01；改选取消陈旧评价并保留04；总结先确认guided模式再进入体系配置 |
| frontend/student/lab-state.js | route=null、caseFlowVersion=2；初选/改选保留01—03及04草稿，后续依赖失效；恢复旧默认/新显式选择，保留论文笔记和AI暴露/独立历史 |
| frontend/student/learning-state.js、quest-state.js | 01—03记录/判定与路线解耦；04及以后仍有路线约束；无路线不能用通行词生成选择，选择题确定性核对保留 |
| frontend/student/paper-notebook.js、paper-notebook.css | 首页增加四个反应维度并保留既有研究/来源行，复用case_page的10行条件表；各论文页展示解读、原文结果/对照/缺口及笔记；首页来源按钮切到论文便签 |
| frontend/student/views/learning.js、views/pages.js | 兼容的学习门说明更新为共通前三步/04路线判断；未选择时总览明确显示空选择 |
| frontend/student/content/demo-content.json、metadata/tutor_presets.json | 只改学习01/03/04及评价01/04；01只明确目标/结果记录，03选项针对三路线共同关系，04目标与路线依据一致；科学/来源/案例数据不改 |
| tests/test_case_route_browser.mjs、package.json | 新增真实浏览器回归及npm入口，覆盖四步/笔记本/初选R1/R2/R3/改选/刷新/总结推进 |
| tests/test_quest_state.mjs、test_workbench_state.mjs、test_navigation.mjs | 更新旧默认路线夹具，加入空路线、共通学习、选择后保留、旧格式迁移及无选择通行词拒绝的状态回归 |
| tests/test_inquiry_browser.mjs、test_pages_browser.mjs、test_submission_browser.mjs | 原有全流程/跨页/异步守卫随实际选择入口更新，保留后续流程与失败/陈旧响应验证 |
| tests/test_governance.py、docs/adr/README.md | 精确ADR序号守卫增加0011，索引登记新决策 |
| TASK/REPORT、ADR0011、ARCHITECTURE、STATE/PROGRESS及两索引 | 事前范围、长期选择、事后实测、实时事实与里程碑；不改058历史报告 |

## 实际操作与观察
任务01明确实验目标；02资料卡/工具位于扩大的分子框内、结构来源位于资料卡；03阅读入口只进笔记本；04为路线决策；总结分开模式与下一阶段。新实验route=null，共通学习01—03不因初选/改选失效。状态选择见[ADR0011](../adr/0011-common-learning-before-route-selection.md)。

笔记本首页先对照起始底物、糖基变化、催化体系、糖供体，再查看研究方法、条件/对照、假说、证据、局限与定位；其后保留case.html既有10维条件/报告表，数值仍标为原文报告、非本次观测且不能直接排名。三路线卡打开对应PDF/解读/笔记，阅读不设置路线。总结不再列三份路线卡和三条路线学习进度，明确“参照练习”是模式、“配置反应体系”是下一阶段。

实际LAN维护：原8766由本项目手动PID3750202提供，既有systemd单元自10月23日处于failed。核实其cwd与完整启动参数均属本项目后，仅终止该进程、reset-failed并start既有单元；现为active，PID113468，启动时间2026-10-25 17:18:24（Asia/Shanghai）。unit、模型配置、端口、网络、服务代码均未改。此恢复加载了新preset；01/04通过复制检测的eval_preflight返回核实为新目标，model=null，未调用真实模型。

## 验证
Browser plugin not available；使用已有Playwright、Node22及Chromium1243，临时public服务禁用模型。证据仅/tmp/flavoglycolab-task-059/。

实际环境：Node22.23.2、Playwright既有安装、Chromium153.0.8010.12；主机默认Node18未使用。临时地址127.0.0.1:8781，8766仅独立核验新版本及通行词流程，真实模型调用0。

| 命令/检查 | 真实分母、结果与证据 |
| --- | --- |
| `PATH=/home/ljx/.local/bin:$PATH python3 scripts/dev.py check` | public配置Python79项（76通过/3显式research跳过）、Node92/92通过；public-check.log。5项新增状态回归覆盖本次路线语义，不把research缺失静默跳过 |
| `node tests/test_case_route_browser.mjs`（FRONTEND_URL=8781、QA_OUTPUT、CHROMIUM_EXECUTABLE已设置） | 219/219；R1/R2/R3均在1536宽首选，另768/R2及390/R3；5组逐项完成01→02→03→04→总结→guided体系配置；case-route/results.json |
| `node tests/test_inquiry_browser.mjs`（同环境） | 1708/1708；R1/1536×1024、R3/768×1024、R2/375×812，六阶段24步、后续路线失效/快照、键盘、失败/慢PDF、通行词等；inquiry/results.json |
| `node tests/test_pages_browser.mjs`（同环境） | 692/692，应用错误0、外部请求0；pages/results.json及pages.log |
| `node tests/test_submission_browser.mjs`（同环境） | 31/31，应用错误0；评价防重/取消/过期响应/刷新恢复和四回合分析通过；submission/results.json |
| 旧记录/独立历史 | Node守卫核验：旧提前R1不追认为决定、新04已选未提交可恢复、旧04真实提交保留、后续路线仍严格匹配；04改选草稿及首次独立历史保留 |
| 科学与预算外保护 | 297/297预算外tracked SHA不变；demo-content除01/03/04外深度相等、preset除01/04外深度相等；protection-and-lan.json |
| LAN静态/评价目标 | 11/11运行资产与本地字节一致；health可用；01/04的2项新preset通过eval_preflight核验，均model=null；lan-reload.json、lan-presets.json |
| LAN浏览器 | 10/10，lan-smoke.json记录真实8766的01—04、空选择、首次R3、总结→guided体系配置、零模型请求/无运行错误；通行词仅用于工程流程核验，不当作内容或教师批准 |
| 最终治理/差异检查 | 治理9/9；`git diff --check`通过；32条工作树变更路径均在058/059合同内（26条tracked、6条新文件，含058的TASK/REPORT），246个本地Markdown链接存在；final-governance.log、final-audit.json |

页面身份、非空、错误遮罩、控制台健康、截图、真实交互均核验。专项页面截图覆盖1536/768/390宽；实际查看01、02、笔记本首页、总结及窄屏02，确认目标文案、框内卡片/工具/来源、模型下方位置、对照矩阵、总结左右排列、按钮推进与响应式无横向溢出。未生成新视觉资产，沿用项目已有字体、颜色、按钮与间距系统。

完整/跨页/专项中仅记录4条headless Chromium `GL Driver Message … GPU stall due to ReadPixels`性能警告；应用console/page errors为0，未把这些驱动消息宣称为产品故障或隐去。

## 与任务合同的偏差
- 首轮旧Node守卫87项中67通过、20失败，涉及旧默认R1、路线前置学习全量失效及任务01旧文案假设。更新夹具/断言后91项中3项因夹具选择顺序/旧修订号/任务01coach_question失败，修正并增加旧版提前选择迁移后最终92/92通过；unit-initial.log保留首次结果。
- 初次专项因编辑时误将分页绑定函数与taskView边界拼接，缺少taskView导出，0项即在浏览器启动检查失败；已恢复分页绑定与独立导出，实际219项全部通过。未以语法检查代替浏览器检查。
- 首轮Python仅ADR精确序列仍止于0010导致1项失败；合同补充0011及相应守卫后通过。
- 首次完整浏览器进入后续路线更换时仍点击旧data-case/对照弹窗选择，超时；按新04唯一选择入口修正夹具，验证取消保留方案、确认保留共通3项/04草稿并失效后续，1708项通过。
- 评价preset只在启动时加载，合同补充必要的既有服务重载；实际发现unit失败而手动同项目进程在运行，按同项目精确PID恢复既有托管方式，没有修改服务配置或触及其他端口/应用。
- 旧TASK-058报告保留历史事实；其源码中03/04内容组织由本次直接授权继续调整。未提交或push，未扩展科学来源/数据/模型范围。

## 数据、许可与审核门
- research_evaluation：历史候选/计算与工程证据，无新增化学验证。
- teaching_case_review：22/22 pending_teacher_review；human_review_status=not_performed，0教师批准。
- public_teaching_release：not_started，public_release=false；来源许可与公开范围不变。

## 已发现但未改的问题
无本次范围内已知未解决功能问题。旧03的route_answers题目变为共通关系题，旧选项答案完整保留；若与新题不符，需要重新核对03，不能静默替学生改答案。其他已确认路线、论文笔记、真实独立历史及快照保留。旧题目完成不追认为新题审核通过。

## 遗留风险、仓库与CI
本次尚未提交/push，不触发远端CI。Chromium模拟视口与响应夹具不等于实体设备、真实模型、教师或公众发布验收。

临时8781服务在完成QA后停止；常驻8766已恢复原有systemd单元，最终is-active=active。未安装依赖或改动原始来源、私有配置；未宣称Safari/Firefox或实体终端已验收。

## 建议的下一TASK
不自动续作，新范围另行授权。

## 截图

![任务01：目标与交付](/tmp/flavoglycolab-task-059/case-route/1536-R1-01.png)
![任务02：分子画布及框内资料卡](/tmp/flavoglycolab-task-059/case-route/1536-R1-02.png)
![论文笔记本首页：三路线对照](/tmp/flavoglycolab-task-059/case-route/1536-R1-notebook.png)
![初始实验方案总结](/tmp/flavoglycolab-task-059/case-route/1536-R1-summary.png)
