# REPORT-015：HYK文献交接核对与候选内容补充

## 对应任务

- [TASK-015](../tasks/TASK-015-literature-handoff-integration.md)；状态Completed，限交接核对、非数值内容接入与工程验证。
- 基线：main / c90e0f7de2588d56fae4c3d23840323586afedbe；结果提交pending，改动留本地工作树，未commit/push。
- 授权来源human_direct：所有者指定新增文献目录，要求根据内容和HYK交接按计划补充。
- 决策来源decision_origin=agent_task_audit，human_reviewed=false。原摘录署名HYK不等于教师人审；本轮不代签T-H1/T-H2科学验收。

## 改动文件与职责

| 目录职责 | 实际文件 | 改动 |
| --- | --- | --- |
| 事前/事后合同 | TASK-015、本文及两目录README | 唯一编号、授权/预算、验收/限制与索引 |
| 来源可得性 | data/registries/publication_sources.csv | 仅三行可得性/准入限制更新；Pei/Zhang由摘要级改为本地全文/摘录已见，其余三行不变 |
| 文献接收 | docs/p10ns/261019/handoff_acceptance.md | H01实到v2.0、原路径/完整SHA、需补项/责任/时刻未知；不复制原表 |
| 数据缺口 | docs/p10ns/261019/data_gap_list.md | 15类最低字段、12项重点核对意见、01—24步影响、接入/降级；明确为代理准备稿 |
| 案例与申报 | docs/cases/isoquercitrin/README.md、shenbaoshu_sections_LJX.md、申报阶段分工与执行方案_20261019-1026.md | 更新全文/接收事实及D1依赖；不改历史合同或同事交付状态 |
| 前端摘要 | frontend/student/content/demo-content.json | 原创非数值酶/宿主/供体/方向、论文材料与差异化缺口；来源页码、交接与许可状态 |
| 前端显示 | frontend/student/ui.js、views/workbench.js | 实际定位/交接；路线与分析阶段可展开对应文献证据与缺口，论文与学生样品分开 |
| 浏览器守卫 | tests/test_workbench_browser.mjs | 逐路线展开检查、来源定位、窄屏/长SHA和样品无观测守卫 |
| 当前状态/入口 | ARCHITECTURE、STATE、PROGRESS、README、docs/README | 工件唯一职责、已完成范围、缺件与未同步事实 |

本地不入Git的审计工件位于temp/task-015/：baseline.json、handoff-audit.json、paper-1/2/3.txt、检查日志、verification.json、link-check.json、lan-content-check.json、browser/截图/results.json、无密钥clean-runtime/。收到的7份Markdown与15图只读保留于原data/derived目录，不拷贝到public资产。

## 实际操作与观察

1. 固定196份受保护文件，含新增22份输入。三个PDF 3/3匹配metadata/public_sources.json原SHA。未修改raw/derived/private、source_registry、case_admission、metadata、migrations或reference。
2. 清点51个正文编号项（A16/B16/C19）和7个SI项；正文51/51为八字段且有提取日期。A-16/B-17/C-19的缺定位明确保留，不补造B-06编号。条件、单位/数值真实性未全部逐值复核。
3. 完成12项重点核对L01—L12，原值/原文定位在本地handoff-audit.json。Pei配比表摘录组合数/范围遗漏，相对速率措辞有歧义，补料方法定位不全；Zhang的溶剂/动力学来源冲突及终点/图示范围应分开；Niu数据声明被过度解释，SI原件未到、补料时点基准及生长代价仍待核。原摘录不改，活动说明只按已核范围补正，不追认摘录人裁定为教师结论。
4. 核看三个出版社页面。Niu[正文页面](https://link.springer.com/article/10.1186/s12934-024-02390-5)列CC BY 4.0与SI链接；[Pei](https://link.springer.com/article/10.1007/s10600-019-02712-9)、[Zhang](https://link.springer.com/article/10.1007/s10529-015-1792-6)列权限申请入口，未取得本轮新增图表授权。未下载/核读SI或图数字化，链接存在不能当作已收到原件；Niu具体载荷/第三方信用行仍须逐项核查。
5. 按T-H2最低字段和24步设计编制缺口代理稿，更新H01及技术底稿D1依赖；未虚构其余交付、站会或真人签收。
6. 前端只补定性来源说明，不自动推荐文献条件、不输出文献结果或导入图像。计划样品继续无观测，可独立查看本路线论文报告的材料与缺口。

## 验证

| AC / 方法 | 分母与实际结果 | 本地证据 / 局限 |
| --- | --- | --- |
| AC1 输入/保护SHA | 22/22输入、196/196保护文件不变；3/3 PDF登记相符 | baseline.json、verification.json；允许修改的publication_sources可得性索引单列 |
| AC2 交接与核对 | H01已收到/需补充；51正文＋7SI清点，51/51字段形状/日期；12/12重点检查有结论 | handoff-audit.json；发现冲突也是检查结论，不表示科学通过；未全数逐值复核/图读数/SI核读 |
| AC3 缺口覆盖 | §8.2拆分15/15字段类、设计01—24的24/24影响覆盖，含责任/降级 | data_gap_list.md、verification.json；不代记同事定稿或24步实质交互验收 |
| AC4 内容/浏览器 | 三路线来源/缺口3/3相符；观测空/结果null/教师批准false；Chrome102/102通过 | browser/results.json；三路线分别配三视口，未测九种全组合 |
| AC5 默认public | python scripts/dev.py check：46项Python中43通过/3研究skip，JS9/9 | check-public.log；默认不需私有来源 |
| AC5 显式research | python scripts/dev.py check --profile research：Python46/46，JS9/9 | check-research.log；使用本机研究资产，不推称新克隆自动拥有 |
| AC5 边界/链接/治理 | 19/19改动文件经现有check_path/check_content；101/101相对链接、治理8/8与git diff --check通过 | verification.json、link-check.json、check-governance.log；未commit/push/远端CI |
| 原LAN只读确认 | HTTP取content JSON、ui.js、views/workbench.js，3/3 SHA与工作树一致 | lan-content-check.json；未重启/修改服务，无真实AI调用 |

浏览器环境：Browser plugin not available，使用现有Playwright1.64.1及项目temp内已解压Google Chrome155.0.8059.84。隔离服务http://127.0.0.1:8875/不含私有模型配置，测试结束关闭，8766常驻服务未改。

核心浏览器命令（相对项目根，先运行隔离服务）：

```bash
PLAYWRIGHT_MODULE="$PWD/temp/task-013/clean-clone/node_modules/playwright/index.mjs" \
CHROMIUM_EXECUTABLE="$PWD/temp/task-014/browsers/chrome/opt/google/chrome/chrome" \
BROWSER_LABEL=Chrome FRONTEND_URL=http://127.0.0.1:8875/ \
QA_OUTPUT=temp/task-015/browser node tests/test_workbench_browser.mjs
```

新机器可用package-lock安装QA工具并指定自己的Chrome路径；普通运行不依赖历史QA目录。

### 浏览器检查与交互证据

目标流程：选路线→展开文献/三篇来源→装配/方案→操作/计划取样→分析对照论文与无观测样品→反思/保存/导出/上游失效。

| 检查 | 结果 |
| --- | --- |
| 页面身份、非空、错误覆盖层 | 三会话均为隔离实验台，六阶段可操作；无空白/框架错误覆盖 |
| 控制台与外部请求 | 正常路径错误0、外部请求0；预设模型失败/内容503独立，不计真实AI成功 |
| 视口与截图 | 1536×1024/R1、768×1024/R3、375×812/R2；含展开证据/长SHA，无横向溢出 |
| 交互与记录 | 路线切换对应说明；文献不产生样品观测；刷新/保存/比较/导出/上游失效/错误恢复通过 |

截图已实际查看：temp/task-015/browser/1536-literature.png为R1供体/体外体系，375-analysis.png为R2“无对应实验数据”及独立文献缺口；768-literature.png对应R3。视口模拟不等于实体设备验收。

## 与任务合同的偏差

范围无扩张。首次Playwright默认启动缺chromium_headless_shell-1248而失败，browser-launch-error.log保留；显式指定TASK-014已解压官方Chrome后102项通过，没有新装依赖。源码补丁曾定位失败、报告补丁曾格式失败，均未应用对应补丁；随后按实际文件修正，最终diff/验证通过。Python/JS工程检查未失败。

## 数据、许可与审核门

- research_evaluation：历史候选＋代理重点语义核对，非独立化学实验验证。
- teaching_case_review：22/22 pending_teacher_review，教师批准0，human_reviewed=false；H01接收与T-H2代理准备稿不代签。
- public_teaching_release：not_started、public_release=false。新增derived/图表/数值未公开，原三PDF例外与rights_verified=false不改。
- observations=[]、quantitative_result=null、teacher_approved=false；零、缺失、未提供、冲突、未知分别保留。

## 已发现但未改的问题

原HYK摘录保留原字节，数值遗漏/自行裁定/SI到件和数据不存在的推断由HYK以新版本修订。原文冲突由科学负责人决定。尚缺SI原件/信用行、标准曲线、原始峰面积/时序、完整结构证据、教师审定观测、LYW正式24步与评分量规。论文报告值未来能否成为独立D1子集须另行准入，不因本轮未开放而宣布永不可用。

## 遗留风险、仓库与CI

本轮在当前main工作树，未提交/推送/新跑远端CI；既往品牌/跨平台结果仅作历史证据。原LAN三项静态资产已反映本轮内容；未测实时AI对新增说明的答复、Edge回归、实体设备、容量/并发或公众教学服务。

## 建议的下一TASK

待HYK修订/提供SI定位、ZYT案例证据与LYW步骤/反馈到件，核对教师支持域后决定离散数据子集和24步范围；本轮未自动启动后续工作。
