# FlavoGlycoLab 当前状态

截至2026-10-20。TASK-013已完成协作交付并同步GitHub main；Windows/macOS/Linux检查及Linux浏览器CI四个job全部通过，远端结果见REPORT-013。本机已完成的TASK-010/011/012实验台已纳入公开提交，默认public不依赖私有数据或所有者服务器。当前仍是过程演练，真实观测、数值仿真、完整课程评分与公众教学发布未实现。

## 运行与协作

| 项 | 当前事实 |
| --- | --- |
| 代码仓库 | [juliusloon/FlavoGlycoLab](https://github.com/juliusloon/FlavoGlycoLab)，public；main沿用现有公开父链 |
| 当前TASK | 最近完成TASK-013：团队克隆/运行与分层数据交付；无在执行TASK |
| 本地入口 | `python scripts/dev.py`，默认127.0.0.1:8767，Python 3.10+标准库，无需Conda/npm/GPU/私有数据/模型密钥 |
| 默认工程检查 | `python scripts/dev.py check`；46项Python中43通过、3项研究资产明确跳过；Node可用时9项状态测试 |
| 本地干净克隆验收 | Python 3.12.3；默认46项（43通过/3研究skip），三路线×三视口浏览器84项，11项HTTP资产/私有路径检查通过，未配置AI可操作并保留明确报错 |
| 可选research | 导入离线包后显式选择；新克隆全量46项Python、9项JS、3059记录及117必需现存原件/SQLite核验通过 |
| 研究包 | 121文件＝117非模型原件＋4项v3派生；首次导入121、重复导入0/相同121。包约12.3 MB，SHA与本地路径见REPORT-013；未自动发送给成员 |
| 实时AI | 可选本机private/runtime/tutor.json；无配置不阻断流程；原LAN的Qwen接入历史验收见REPORT-012，当前未复做实时模型测量 |
| 练习保存 | 当前浏览器/站点源localStorage；最多12快照，可比较并导出；无账号或跨设备同步 |
| 原LAN托管 | flavoglycolab-lan.service，8766；本轮只读状态active，未调整常驻配置/模型/网卡/防火墙；唯一说明docs/operations/lan-site.md |
| 跨平台CI | 功能提交f3826d6，Actions39369460723四个job success；三平台Python/JS/安装CLI与Linux浏览器84项通过 |
| 数据/来源保护 | 本轮172项原件/派生/private/登记/迁移/参考文件SHA不变 |
| 日常Git | 当前main可普通提交/push；所有者远端public，成员克隆通常origin；不要推送旧研究归档分支 |

协作步骤唯一维护于[docs/operations/collaboration.md](docs/operations/collaboration.md)，现行规范[docs/data-governance.md](docs/data-governance.md)。此前公开仓库仅到TASK-009、前端未提交的问题由TASK-013解决；历史“无提交/push”只描述对应旧任务结束时的状态。

## 数据与审核门

| 层/状态 | 当前事实 |
| --- | --- |
| 默认public | metadata/active.json默认public；22条真实待审案例索引、123条来源元数据、三个指定PDF随Git提供；全量研究record_count=null |
| 完整本地原件 | 登记123，原本地工作区现存122；缺少1项OS元数据.DS_Store，非化学来源 |
| 研究包原件 | 117项现存非模型证据；5项external_model不随包交付且非运行依赖，允许缺失但存在时仍核对SHA |
| v3候选资源 | 3059条混合候选，不等于3059个实验；records.json原SHA不变 |
| 候选案例 | 1主案例＋21历史反应结构命中＝22条，全部pending_teacher_review；human_review_status=not_performed |
| 公开案例值 | 11项withheld_unlicensed；10项原缺失missing保留；原表在private历史副本保全 |
| P1待审材料 | 历史登记12项本地private custody，37项未移入；本轮未重新盘点/迁移 |
| research_evaluation | 历史研究候选与计算证据；不表示独立化学实验验证 |
| teaching_case_review | 22/22待审，教师批准0；工程守卫/AI回复不代签 |
| public_teaching_release | not_started；public_release=false，公开源码不代表教学服务验收 |
| 三篇公开PDF | TASK-008 human_direct精确例外；metadata/public_sources.json唯一登记路径/SHA，PUBLIC_PDFS兼容加载；出版方rights_verified=false |

原始/派生/private其余字节不入公共Git。受限离线包不是公开数据集，不包含旧模型、private、密钥或Git历史，不自动发送/上传。内部交接仍按实际使用权限，不追认第三方版权。程序只读本项目相对路径，导入落点也限定项目内。

## 当前模块

| 模块 | 当前能力与局限 |
| --- | --- |
| evidence | 默认公开案例/来源读取与三个PDF核验；显式research读取v3/核验历史原件，缺失或损坏明确失败 |
| frontend/student | 三路线、装配、条件/对照、过程演练/计划样品、缺数据审查、反思、快照/比较/导出，六阶段连续操作 |
| scripts/serve_lab.py | student限定资产及同源health/tutor；模型配置仅后端，不提供任意文件/命令工具 |
| chemistry/experiment/teaching | scaffold；无教师审定的身份/反应系统校验、真实D1/色谱、完整24步课程或正式评分 |
| platform/teacher | scaffold；无正式师生账户、审核工作流、成绩/公众教学服务 |

输入条件均为学生方案，动画时间不代表反应速度；样品为计划标签，没有真实测量，observations=[]、quantitative_result=null。来源非数值摘要不是独立全文审定，模型不修改方案/创建批准。

## 申报与未解决事项

- 所有者确认推荐资格、拟用化学生物学实验课程、校内2026-10-27截止及内部10-26定版；具体时刻、签章/提交安排和具名负责人待补。
- 异槲皮苷主案例身份、21命中的来源/方向/重复，以及Pei2019、Zhang2015、Niu2024条件/定量观测/再分发权限仍待逐条审定。
- 工程过程演练已可用；真实观测驱动仿真、分析、教师量规、完整24步、公众教学发布尚未完成。
- 2026-10-18主机/共享资源快照和规划预算仅作历史实施输入，当前未重测容量/带宽/并发或实际跨物理设备/主机开机。唯一基线docs/policy/ilab-2026/readiness-evidence-2026.md。
- 三名成员的实际设备/账号与真人验收未获得回执；研究包已经本地生成/新克隆实测，不声称已经发给成员或成员已经运行。
- 原研究历史保存在本地codex/archive-research-20261018及已核验bundle；35项历史汇报/附件本地保留，不混入公开父链。
- 历史文档准备/完整演示提案保留proposals目录；未被整份批准，不因本轮修复自动实施。后续任务须使用新的连续编号。

## 事实入口

[TASK-013](docs/tasks/TASK-013-collaboration-ready.md) / [REPORT-013](docs/reports/REPORT-013-collaboration-ready.md)维护本次验收；[REPORT-012](docs/reports/REPORT-012-interactive-workbench.md)保存原LAN/实时AI历史验收；其余历史见docs/reports。STATE仅保存当前事实，里程碑见PROGRESS。
