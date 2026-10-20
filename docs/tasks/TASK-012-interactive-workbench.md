# TASK-012：以操作流程为核心的虚拟实验台重建

## 合同元数据
- 状态：Completed（工程验收）；日期2026-10-19。
- 授权来源：human_direct；龙锦轩要求以案例、路线和具体实验流程为核心“优化/重建”，并提供已有Qwen服务供实时AI接入。允许更新既有LAN网站及其项目专属服务；不是教师或科学审批。
- 基线：main；HEAD及已有未提交改动见temp/task-012/baseline.json；保护TASK-010/011历史交付证据。
- 人工负责人：龙锦轩；执行者：Cano。
- 修改预算：frontend/student/、scripts/serve_lab.py、scripts/install_lan_service.py、ops/systemd/flavoglycolab-lan.service.in、tests/test_workbench*、tests/test_lab_server.py、tests/test_frontend_scaffold.mjs（历史测试适用范围说明）、docs/design/workbench.md、docs/operations/lan-site.md、本合同/同号REPORT、README/STATE/ARCHITECTURE/PROGRESS与TASK/REPORT索引。私有模型配置仅data/private/runtime/tutor.json；过程证据temp/task-012/保留用于审计。
- 资源预算：沿用标准库Python和原生ES模块；不安装运行依赖、不占GPU、不改模型服务；沿用8766用户服务，必要时重启；图像生成只用于界面设计和原创装置视觉。模型仅短连接核验及用户主动辅导请求。
- 关联ADR：现有科学/发布政策不改；产品交互设计记docs/design/workbench.md。

## 目标
学生进入即看到实验工作台。把案例/路线选择、独立方案、材料装配、条件及对照、模拟操作、取样数据状态、结论与记录连接为可操作的连续流程；实时AI按当前上下文解释与追问。项目治理说明移出主导航，来源在需要时展开。

## 已核实事实
原网站六路由仅展示规划；未准入观测，quantitative_result=null，22案例均待教师审核。LAN8766服务已运行。用户提供已有Qwen模型qwen3.8-flash-next-iq3_s及私网兼容接口；连接效果待核验，密钥不得写入浏览器、Git、报告或日志。

## 范围
### 允许项
- 按路径选择真实改变材料/提示；使用规划中的非数值来源信息，明确待审。
- 实现流程状态机、输入校验、材料装配、步骤门槛、过程动画/取样、重置与本地保存、记录导出；学生输入是方案假设，操作动画不是化学预测。
- 比较方案/记录而非编造产率；没有真实观测时结果null，显示缺数据及补证任务。
- 同源后端为学生目录提供静态内容和受限AI辅导API；后端持有密钥、限定模型/上下文/长度/并发，拒绝无数据定量输出，不提供任意代理、文件/命令/科学审批工具。
- 桌面/移动/键盘、完整路径/错误路径/恢复/AI连接、现有LAN与资料隔离验证。
### 禁止项
- 修改冻结原件、案例登记、许可或教师状态；推断真实反应速率、产率、图谱、成绩和化学验收。
- 新增公网入口、用户身份系统、教师审批或调用其它工作区作为运行依赖；Git提交/push。
- 启动历史候选提案或下一TASK；本任务不自动完成原24步课程的科学/教学验收。

## 工件职责
| 职责 | 工件 |
| --- | --- |
| 产品结构与实现边界 | docs/design/workbench.md |
| 交互/状态/记录/AI视图 | frontend/student/ |
| 同源静态与AI边界 | scripts/serve_lab.py |
| 密钥 | data/private/runtime/tutor.json，私有且0600 |
| 托管与运维 | ops/systemd/、scripts/install_lan_service.py、docs/operations/lan-site.md |
| 验收 | tests/test_workbench*、tests/test_lab_server.py、temp/task-012/、REPORT-012 |

## 必须执行
1. 记录保护基线和设计合同，生成完整主界面与操作状态概念。
2. 先打通路线到记录的核心操作闭环，接入已有模型，明确无观测边界。
3. 验证状态机/持久化/输入与服务边界；浏览器走完整操作、AI和响应式路径；部署至既有LAN入口。
4. 对照概念与浏览器截图，保存验证分母、失败与限制；更新状态和报告。

## 验收标准
- [x] AC1：首页为实验台，案例/路线→操作→记录连续可用；无介绍型六页主导航。
- [x] AC2：三路线材料与提示差异可见；必需输入/装配/操作顺序校验有效，错误可恢复。
- [x] AC3：独立理由、条件、操作、取样、结论可保存/恢复/重置/导出；修改上游使下游失效，不继承旧结果。
- [x] AC4：结果始终区分过程演练和真实观测；无支持结果null，不产生虚构图谱/产率/正式分数。
- [x] AC5：已有Qwen实际连接与上下文辅导通过；密钥只在服务端，超范围拒绝、失败/超时可见且不伪装模型成功。
- [x] AC6：桌面/平板/移动无溢出；键盘和主流程可用；概念及最新截图直接比对、记录至少五项。
- [x] AC7：LAN持续托管、私有路径不可读、科学保护指纹不变、治理及相关测试通过；文档与状态真实。

## 验证
Python unittest（治理及服务边界）、Node状态机单测、Playwright完整交互/LAN/响应式；Browser插件未提供，使用既有Playwright与Chromium，版本和分母见REPORT。模型先做小量接口核验，再走浏览器真实请求，不做负载测试。

## 停止条件
模型不可达则隔离AI分支并说明，核心台继续；出现来源/许可冲突或需要科学判定时保留缺失；需要root、其它服务变更或公网发布则不扩展。

## 报告要求
REPORT-012-interactive-workbench.md记录实际交互、模型真实调用、测试、截图、失败、科学/教学/发布门、未提交状态；不得把过程演练写为已验证的化学仿真。
