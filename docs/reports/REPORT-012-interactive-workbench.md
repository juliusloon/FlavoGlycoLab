# REPORT-012：以操作流程为核心的虚拟实验台重建

## 对应任务
- TASK文件：docs/tasks/TASK-012-interactive-workbench.md。
- 状态：Completed（工程过程原型与已有模型接入验收；非科学/课程/公众发布验收）。
- 基线：main，279d76bfaaff053f30e840b9e68a1938caecd28a；此前TASK-010/011未提交工作保留。
- 结果提交：pending；未提交/push，未运行远端CI。
- 授权：human_direct；所有者要求以案例、路线、实验台与交互AI为核心优化/重建，并提供已有Qwen服务配置。

## 改动文件与职责
| 工件 | 实际改动 |
| --- | --- |
| frontend/student/index.html、styles.css、app.js | 两入口/三栏工作空间、六阶段操作、本地持久化、键盘/移动导师与同源模型请求 |
| frontend/student/lab-state.js | 状态机、三路线材料规则、输入/顺序检查、上游失效、版本快照、恢复/导出 |
| frontend/student/views/workbench.js | 六阶段与实验记录视图；删除五个旧展示页视图 |
| frontend/student/content/demo-content.json | 保留非数值案例/路线/来源；移除未使用24步占位与AI预置脚本，不改变来源SHA或审定状态 |
| frontend/student/assets/lab-bench.png | 从生成概念单独生成装置照片式示意，无实验数值或原件复制 |
| frontend/student/package.json、README.md | ES模块声明（无安装依赖）与当前使用/验证说明 |
| scripts/serve_lab.py | 标准库静态服务、health、限定tutor代理、服务器端凭据、同源/长度/频率/并发/输出守卫 |
| ops/systemd/flavoglycolab-lan.service.in、scripts/install_lan_service.py | 沿用8766常驻方式，服务入口升级，保留同名归属/幂等检查 |
| data/private/runtime/tutor.json | 新增私有模型配置0600，Git忽略，未暴露到浏览器或日志 |
| tests/test_workbench_state.mjs、test_workbench_browser.mjs、test_lab_server.py | 流程、实际浏览器与服务边界测试；旧test_frontend_scaffold.mjs转入当前回归 |
| docs/design/workbench.md、docs/operations/lan-site.md | 唯一产品设计、24步需求映射和运行/模型配置说明 |
| STATE/ARCHITECTURE/PROGRESS/README、TASK/REPORT索引 | 当前状态、工件责任与历史界限 |

## 实际操作与观察
- 已能从三路线选择走到体系装配、方案、混合/流程演练/取样、缺数据分析、反思与记录导出。独立理由先填写；误选材料、无效取样计划和越序操作被阻止。
- 温度/pH/投料/时点是学生自定方案，不是推荐或已测条件；浓度×体积仅单位换算。动画持续2.2秒只为演示顺序，不对应化学反应时间。样品为计划标签，观测与结果始终null。
- 新实验需确认；自动保存、已保存快照、JSON/Markdown导出、方案比较、损坏存储保全、上游变化失效已实施。每浏览器源独立，最多12快照，无账户/跨设备同步/正式成绩。
- Qwen由用户提供既有服务。本轮真实模型探针及浏览器请求均收到mode=model，不使用预置脚本冒充。缺数据定量提问返回mode=evidence_guard，输出数字产率守卫与模型故障分别标识。
- 服务器固定上游，浏览器没有模型密钥和直接外联；导师不能替学生操作、写方案或作教师审批。模型说明/建议不成为科学证据。

## 验证
| 检查/命令 | 分母、结果、证据与限制 |
| --- | --- |
| `node --test tests/test_workbench_state.mjs` | 9/9：路线分支、顺序、输入、失效、快照、恢复及null导出；temp/task-012/state-tests.log |
| `python3 -m unittest discover -s tests -p test_lab_server.py` | 11/11：私有路径/符号链接/HEAD/凭据隔离/同源/格式/定量拒绝/上下文白名单/上游失败/频率并发/输出守卫；server-tests.log；该组上游使用mock，不作为真实模型证据 |
| Playwright完整流程 | 回环8767和真实LAN10.70.160.64:8766各81/81；1536×1024 R1、768×1024 R3、375×812 R2，完整六阶段、错误恢复、AI、持久化、快照/比较/导出。browser/results.json、lan-browser/results.json；正常路径0控制台/页面错误、0浏览器外部请求 |
| 补充浏览器检查 | 8/8：键盘跳转、来源展开无溢出、学生HTML输入转义、多标签冲突、手机步骤置顶及导师焦点/关闭；extra-checks.json |
| 实时模型 | models接口识别用户指定模型；直接探针mode=model约1.24秒，浏览器实际mode=model并返回上下文回答；model-probe.json及lan-browser/live-ai.json。仅一次探针时长，不是延迟/容量基准 |
| 两接口HTTP | 每接口9资产字节匹配，共18/18；拒绝路径10/10；health配置状态2/2。deployment.json。第二接口未另跑完整浏览器，未从另一物理客户端验证 |
| 后台恢复 | 主进程终止后PID2143631→2144245、NRestarts0→1、HTTP恢复；active/enabled，Linger=yes；重复安装PID不变。deployment.json。未实际重启共享主机 |
| 来源与保密 | 107/107原有保护文件字节不变，3篇PDF+规划文档4/4SHA匹配；student资产密钥命中0，配置0600且Git忽略。deployment.json；未改科学原件或准入 |
| 治理/语法 | 治理8/8，governance.log；Python两入口编译、原生JS语法与git diff --check通过 |
| 视觉 | 两张概念和最新LAN截图同轮view_image核查，原生1536×1024；布局、文案、字体、配色、资产、控件、响应式逐项比对，见fidelity-ledger.md。Browser插件未提供，使用已有Playwright Chromium153.0.8010.12；不声称其它浏览器兼容验收 |

### 验收条目对应
AC1对应两入口及三路线完整流程；AC2对应状态机/浏览器的材料与顺序纠错；AC3对应恢复、失效、重置、快照、比较和导出；AC4对应null观测/分析与定量守卫；AC5对应真实模型探针、浏览器辅导及服务边界；AC6对应三视口/键盘补充与视觉记录；AC7对应双接口、恢复、保护SHA及治理闭环。7/7条目达到本合同工程范围，均不解释为化学或教学审批。

主要命令：`FRONTEND_URL=http://10.70.160.64:8766/ QA_OUTPUT=temp/task-012/lan-browser PLAYWRIGHT_MODULE="$PWD/temp/task-010/qa/node_modules/playwright/index.mjs" node tests/test_workbench_browser.mjs`；浏览器可执行文件为既有Chromium1243目录中的153.0.8010.12。QA依赖不进入运行服务。

选定概念与最终截图：temp/task-012/concept-route.png、concept-bench.png；temp/task-012/lan-browser/1536-route.png、1536-bench-ai.png；手机阶段开头mobile-top.png。内置imagegen生成两概念及独立装置PNG，提示围绕纯白/青色三栏、六阶段、真实输入/状态与无数据限制；实施规范和允许文案在design-spec.md，最终提示与生成调用保留在会话。未以静态截图替代操作。


## 与任务合同的偏差、失败与修复
- 首次浏览器流程发现通用点击处理器在原生表单提交前重绘，导致提交未触发；修复为只处理明确action按钮，正常submit保留。
- 新增手机记录页的新实验按钮后，测试的旧全局定位产生多匹配；收紧到main区域。原生dialog关闭事件异步导致测试过早读状态，改为等待新状态成立。保留这些失败，不将其计为成功。手机阶段跳转曾保留旧滚动位置，已改为置顶且流程条显示当前阶段，额外键盘/移动检查通过。
- 历史展示页测试已不适用，用新工作台回归替代并保留旧命令入口；旧REPORT-010/011与temp/task-010/011证据不改。
- 主视觉统一两张概念的三栏、白/灰/青配色及原生控件。去掉生成概念的虚构头像/模式选择、对路线科学描述的扩写；用真实保存状态、AI状态和工程操作反馈替换。装置只作原创示意，模型配置不等于教师批准。

## 数据、许可与审核门
- research_evaluation：仍为历史候选，未独立验证化学泛化。
- teaching_case_review：22/22 pending_teacher_review、批准0；没有被过程测试或模型调用提升。
- public_teaching_release：not_started，public_release=false；当前只是明确授权的LAN原型。
- 原始来源、登记、private/derived证据不变；唯一新增private内容是模型配置。三PDF原公开例外与rights_verified=false不变。

## 已发现但未改的问题、遗留风险与CI
真实数据驱动的反应/分析仿真、已审定24步课程、教师量规、账号/成绩、正式安全容量/iLab接入均未完成。模型可能提出需核对的化学建议；提示和正则守卫不构成全面科学真实性证明。当前演练不模拟反应动力学。未做其它物理客户端、真正主机重启或真实授课效果验证。无Git提交/push/远端CI。

## 下一任务建议
在当前操作台内接入经教师核验且许可适用的条件—观测/分析数据和评价量规，替换明确缺数据分支；不因本次工程完成自动启动。
