# TASK-015：HYK文献交接核对与候选内容补充

## 合同元数据
- 状态：Completed（限定的交接/非数值接入与工程验证）；日期：2026-10-20。
- 基线分支/提交：main / c90e0f7de2588d56fae4c3d23840323586afedbe。
- 授权来源：human_direct；所有者要求“根据这些新增内容和 HYK 的交接文件，按照计划补充现在的内容”，指定data/derived/extracted_from_literature/。
- 人工负责人：LJX；原摘录署名HYK；执行者Cano。代理核对不代替HYK签收或教师审定。
- 修改预算：本TASK/REPORT及索引；ARCHITECTURE/STATE/PROGRESS、README/docs/README；data/registries/publication_sources.csv仅更新全文可得性与限制；docs/cases/isoquercitrin/README.md；docs/p10ns/261019/{handoff_acceptance.md,data_gap_list.md,shenbaoshu_sections_LJX.md,申报阶段分工与执行方案_20261019-1026.md}；frontend/student/content/demo-content.json、ui.js、views/workbench.js；必要的现有浏览器守卫。
- 本地审计预算：temp/task-015/（保护指纹、PDF纯文本、交接清单与冲突、测试及截图）；不修改收到的derived、raw、private或冻结登记。沿用现有Playwright，无新依赖/模型调用/服务变更。
- 关联ADR：沿用0004/0006；无新科学政策。

## 目标
按T-H1、T-H2与交付A合同，登记实际到件、对齐三篇既存PDF并检查关键语义，补充来源可追溯的非数值路线说明和24步数据缺口。完整24步与D1定量仍依赖后续材料和教师准入。

## 背景与已核实事实
新增目录含7份Markdown、15张图；literature_extraction_table.md署名侯羽柯，日期2026-10-20，标注v2.0。活动来源仍写摘要级/摘录待交接。原表包含正文冲突的自行裁定、SI已获取声明和由数据声明推断原始数据不存在等内容，均需保留原件并另列核对意见。

## 范围
### 允许项
- 只读计算收到文件及原件SHA，核对DOI/页码/方法、关键差异；不默改原摘录。
- 接收表引用原目录唯一文件与SHA，不复制一份交接表；更新当前来源索引，保留旧TASK/REPORT历史事实。
- 编制data_gap_list.md代理检查稿，覆盖可行性§8.2最低字段、24步影响和降级触发；不冒充HYK交付或教师认可的T-H2定稿。
- 前端补充三路线的酶/宿主、供体、原文定位、定性证据与缺口；区分论文图与学生样品观测。仅原创非数值概述，不复制全文、图像、文献产率或待授权表格。
### 禁止项
- 改原件/输入、案例准入、source_registry/迁移/研究包；公开新增derived或第三方图文。
- 自动填入推荐条件、产率、标准曲线、动力学拟合或教师/课程批准。
- 自动补写ZYT/LYW交付、启用正式24步/评分、提交推送/发布、重启服务/改模型或对外发消息。

### 涉及目录及文件职责
| 目录职责 | 工件 | 本次用途 |
| --- | --- | --- |
| 原始交接 | data/derived/extracted_from_literature/ | 只读、Git忽略、本地候选输入 |
| 接收与缺口 | handoff_acceptance.md、data_gap_list.md | 到件事实与代理检查，保留责任/待决 |
| 前端 | demo-content.json、ui.js、views/workbench.js | 非数值来源解释、路线缺口显示 |
| 本地验证 | temp/task-015/ | 机器可查指纹、逐项检查、浏览器证据 |

## 非目标
全文翻译、补下载文献或SI、教师科学裁定、正式D1、完整24步、视频制作、公众发布。

## 必须执行的操作
1. 固定输入与受保护资产指纹，登记TASK和工件唯一归属。
2. 将7份摘录/15图与三个已登记PDF对齐，核对原文，保留冲突和SI原件缺失。
3. 更新H01、来源和案例说明，编制字段/24步缺口与保守降级。
4. 补充三路线非数值证据说明、来源定位及样品分析缺口；无观测守卫保持生效。
5. 默认/显式research工程检查、浏览器三路线/响应式、保护SHA和公开边界验证，REPORT/STATE闭环。

## 验收标准
- [x] AC1：22/22收到文件有路径/SHA；三个PDF与公开登记3/3相符；原输入与保护文件字节不变。
- [x] AC2：H01引用实际v2.0与指纹；3篇来源可得性和定位纠正；核对范围、冲突、SI未见原件及未检查项目明确记录，不将逐项数字摘录宣称全数科学复核通过。
- [x] AC3：缺口清单覆盖§8.2最低字段与01—24步；可补/待核/待授权/未见材料、责任人与降级可追溯；T-H2仍是代理准备稿。
- [x] AC4：实验台三路线展示对应文献定位及差异化证据缺口；无未经审核文献结果进入观测或推荐条件，observations=[]、quantitative_result=null、teacher_approved=false。
- [x] AC5：默认public及显式research工程检查、浏览器完整流程/响应式、Git边界和保护SHA通过；失败/遗留/未提交未发布如实报告。

## 验证
既有scripts/dev.py check、FLAVOGLYCOLAB_TEST_RESEARCH=1的unittest、npm test、Playwright原流程和本次来源/缺口交互检查。Browser plugin not available，使用既有Playwright。源文核对及指纹结果存temp/task-015/。

## 停止条件
原件SHA不符时停止对应来源接入；缺少许可/教师审核阻断图表和数值接入，允许继续非数值概述；24步/科学决策依赖缺失保留待决，不扩展执行范围。

## 报告要求
REPORT-015记录实际改动、每条AC的分母与证据、关键冲突、未复核范围、原件保护和三门状态；STATE更新当前事实，不自动开展下一TASK。
