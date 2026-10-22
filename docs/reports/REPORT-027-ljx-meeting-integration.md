# REPORT-027：LJX 会后系统整合、AI 结果解析与逆合成可行性验证

（全文简体中文；保留原始命令、字段、哈希和代码标识符。）

## 对应任务
- TASK文件：docs/tasks/TASK-027-ljx-meeting-integration.md（2026-10-23 由 docs/tasks/proposals/ 移入正式目录，状态行已改为 Completed）
- 状态：Completed（工程验收完成；A07/A10 含如实标注的未满分项，见下）
- 基线提交与分支：main，HEAD c90e0f7de2588d56fae4c3d23840323586afedbe；实施基线含 220 个既有未提交文件（TASK-015—026，未覆盖）
- 结果提交：pending（按合同不 Git 提交、不 push，工作树保留全部改动）
- 授权来源：human_direct（所有者 2026-10-23 指令先设计 TASK-027，随后在同一对话指令实施 L01—L06）
- 执行者：Cano（远程验证在 cano:/home/ljx/FlavoGlycoLab，运行解释器 ~/miniforge3/envs/condrxnbench/bin/python；本地挂载卷 /Volumes/cano/FlavoGlycoLab 编辑）
- 过程证据：temp/task-027/（基线快照、保护清单、走查、L02—L06 切片、L06-fix 回归修复记录，Git 忽略）

## 改动文件与职责
按工作树实际改动逐文件填写；原始来源字节（data/raw、data/derived、data/private、data/registries、metadata 登记）零改动（保护清单 169 文件 0 差异，见验证节）。

| 所在目录与职责 | 文件 | 实际改动及用途 |
| --- | --- | --- |
| 流程/答案与模式状态 | frontend/student/lab-state.js | 新增两阶段状态机：`run.stageMode`（guided 参照练习/open 开放探究）、`run.guidedDone`（参照完成标记）、上下文修订号复用既有 `contextRevision` 使旧 AI 回复按修订失效；旧存档无 stageMode 字段按 guided 默认值迁移（fail-closed：非法枚举拒绝加载）；重来保留同阶段输入与快照；参照完成不显示虚构实验成功或产率 |
| 学习门禁 | frontend/student/learning-state.js、views/learning.js、views/inquiry.js | 三路线独立学习门禁：首篇任选、未完成本路线前置学习禁止进入参照练习、切换路线按本路线重新判定不继承他线结论；门禁提示类名 `.gate-hint`→`.learning-gate-hint`（修复缺陷4，见偏差节）；inquiry.js 箭头函数字面量渲染修复（缺陷1） |
| 编排与视图 | frontend/student/app.js、views/workbench.js、styles.css、index.html | plan-form 事件流接线（两阶段转换、警告三选、放弃回滚、重来对话框）；styles.css 追加 `.learning-gate-hint` 规则；仅最小改动，无整站重设计 |
| 内容与来源投影 | frontend/student/content/demo-content.json | 顶层新增 `feedback_rules`（唯一投影，13 条，九字段以上齐全：rule_id/route_id/parameter/stage_mode/rule_kind/source_id/source_locator/source_sha256/source_status/trigger/feedback_text/review_status 等）；每路线 locked_condition 种子＋qualitative_deviation/unknown_condition/invalid_input 及 R2 reference_conflict；无来源阈值 0 条、缺证据显式 unknown、不造 SHA |
| 文献参考计算 | frontend/student/analysis-engine.js | 仅引用/条件状态接口配合，计算白名单 8 项与守卫不变，不接受自由输入预测产率 |
| 导师与机器评价 | scripts/serve_lab.py、metadata/tutor_presets.json | 服务端聊天角色白名单新增 `result_analyst`（kind=analyze 协议）；四分区输出契约（文献事实/学生自述/机制假设/尚不可判断）；伪造来源/审核状态/"观测"一律 400；提示注入内容按数据不当指令执行；索要产率走证据守卫拒答＋给出对照建议；无配置/超时按真实降级返回 |
| 回归守卫 | tests/test_workbench_state.mjs、test_quest_state.mjs、test_analysis_engine.mjs、test_inquiry_browser.mjs、test_data_page_browser.mjs、test_lab_server.py | 新增两阶段、门禁、迁移、警告三选/回滚/重来、analyze 协议与守卫、开放模式渲染修复等用例；仅增加真实行为与边界用例 |
| 产品合同 | docs/design/workbench.md | 新增「逆合成融合可行性评估」节：静态回溯示意（来源逐节点/边标注）、三路线分类表（R1/R2=酶促转化、R3=工程菌途径，不统称化学逆合成）、动态四门槛（输入/授权/成本/证据）缺口表；同时记录 L02 状态合同、feedback_rules 字段合同、result_analyst 契约与 L03 规则增量 |
| 任务与闭环 | docs/tasks/TASK-027-ljx-meeting-integration.md（由 proposals/ 移入）、docs/tasks/README.md、STATE.md、PROGRESS.md、ARCHITECTURE.md、docs/p10ns/261019/handoff_acceptance.md、本 REPORT | 合同转正、索引与状态收口 |
| 过程证据（不入 Git） | temp/task-027/ | 基线 HEAD/工作树快照、保护清单（protected-before.json 169 文件，口径 sha256+size，mode 跨宿主不可比已剔除，见 protected-note.md）、三路线×六阶段走查（walkthrough/）、L04 对账（l04/reconciliation.md）、L06-fix 修复记录与回归（l06-fix/fix-notes.md）；均为 Git 忽略 |

## 实际操作与观察
- L01 走查：三路线×六阶段共 171 格逐项走查全部通过、console 错误 0、页面外部请求 0；确定主路线为 R1（Pei 2019）。走查发现的疑词/缺项按责任方转出（toast 遮挡、spiraeoside 命名、数据丰度不均等，见走查问题单 temp/task-027/walkthrough/L01-walkthrough.md），不代签科学结论。
- L02：学习门禁三路线独立判定、首篇任选、切换重判不继承；两阶段 stageMode guided/open 落地，guidedDone 标记参照完成，修订号复用既有 contextRevision 使陈旧 AI 回复失效；重来保留同阶段输入＋快照；旧存档 fail-closed 迁移。
- L03：result_analyst + kind=analyze 服务端协议落地；四分区输出；伪造来源/审核/观测 400；提示注入按数据处理；索要产率由证据守卫拒答并给对照建议；无模型配置时真实降级。AI 实测仅 1 次真实 analyze 调用（本机 tutor.json 存在，已记账），其余为协议级模拟验证。
- L04：21 条记录对账 ✓17/⚠4/✗0；4 组路线报告值与 PDF 一致；8 项白名单计算复算通过；三篇均无标准曲线/可积分峰/取样原始数据，峰比对与产率定量比较判定不可做；学生观测空、数值 null 核对通过；v3/records.json 3059 条与 21 条无关联（grep 'DQ-R' = 0）。
- L05：docs/design/workbench.md 新增逆合成节；结论=受限（仅静态教学引入）；动态四门槛均有实质缺口。
- L06 修复：走查发现的 4 个缺陷全部修复——(1) 箭头函数字面量渲染（`??render`→`??render()`）；(2) 警告"继续/放弃/重来"三按钮从不生效（监听器移到顶层绑定）；(3) 放弃不回滚草稿（新增 planBaseline/pendingPlanBefore 快照回滚）；(4) gate-hint 选择器冲突（类名改 .learning-gate-hint）。修复记录与探针见 temp/task-027/l06-fix/fix-notes.md。
- 10-26 阶段版说明：本次直接交付三路线全闭环的最终工程结果，未把新功能回写成 10-26 已有能力；10-26 的内部定版节点是否成立仍由负责人确认，本 REPORT 不构成申报定版。
- 交接：截至收口（2026-10-23）未收到 LYW/ZYT/HYK 实际交付文件或分支；走查问题单按责任方转出；不代签科学结论、不预填成员签收。

## A01—A11 验收逐项
| 验收项 | 分母与结果 | 结论 |
| --- | --- | --- |
| A01 基线 | 启动时快照实际 HEAD/工作树与保护清单（169 文件，sha256+size 口径）；三路线×六阶段 171/171 格走查通过，console/外联 0 | 达成 |
| A02 学习门禁 | 三篇均可作首篇、未完成本路线学习禁止绕过、不强制顺序读完；切换重判不继承；实验视图无重复理论考题；24 项映射无丢失 | 达成 |
| A03 两阶段 | 参照条件锁定/缺件阻断、参照完成解锁探究、警告后继续、放弃/重来、切换路线均有用例；参照完成不显示虚构成功或产率 | 达成 |
| A04 记录 | 旧存档迁移（fail-closed）、刷新、同阶段修改、上游改变、路线切换、陈旧 AI 回复失效均有实际用例；同阶段输入不清空 | 达成 |
| A05 定性规则 | feedback_rules 13 条覆盖三路线适用参数，九字段齐全；对照精确值/非法输入/未知条件/文献冲突各有用例；无来源阈值 0 条 | 达成 |
| A06 AI 解析 | 有效引导、无数据、条件冲突、索要产率、伪造来源、提示注入、上游失败 7 类以上用例有记录；角色上下文由后端白名单限定，双守卫不放宽；全部机器输出仍待教师审定 | 达成（真实模型仅 1 次 analyze 调用，其余为协议级模拟，如实标注） |
| A07 参考分析 | 21 条 ✓17/⚠4/✗0、4 组报告值与 PDF 一致、8 项白名单复算通过；**峰比对与产率定量比较不可做（三篇缺标准曲线/可积分峰/原始点数据，最终判定）**；学生观测空、数值 null 保留 | 达成（定量比较缺口为如实结论，非未做事项） |
| A08 逆合成 | 静态示意＋三路线分类表＋动态四门槛齐全；结论"受限（仅静态教学引入）"为有证据的受限结论 | 达成 |
| A09 系统 | 默认 public 运行；Python 74 OK（3 skip 为显式 research 门禁）＋node 69/69；unittest 39/39；npm 69/69；test:browser 644、test:data-browser 68、走查 73/73；console/外联 0；保护 169/169 字节一致；PDF SHA 3/3 | 达成 |
| A10 交接 | LJX 技术材料与实际接收位置可追溯；**截至 2026-10-23 未收到 LYW/ZYT/HYK 实际交付，真人/教师反馈未回执** | 部分达成（如实标注，不冒充成员验收） |
| A11 三状态门 | research_evaluation 仍为候选；teaching_case_review 不晋级（22/22 待审，教师批准 0）；public_teaching_release=not_started；未越权改门 | 达成 |

## 验证
| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python3 scripts/dev.py check`（远程 cano，condrxnbench 环境） | Python 74 OK，3 skip 均为显式 research 门禁；内置 node 状态测试 69/69 |
| `npm test` | 69/69 pass |
| `python3 -m unittest tests.test_lab_server` | 39/39 OK |
| `npm run test:browser`（FRONTEND_URL=8768） | 644 checks 全过，console 0、外部请求 0 |
| `npm run test:data-browser` | 68 checks 全过，console 0、外部请求 0 |
| 三路线全闭环走查（含 1 次真实 AI analyze 调用与降级路径） | 73/73，consoleErrors 0、pageErrors 0、externals 0（temp/task-027/l06-fix/） |
| 冻结保护清单（snapshot_protected.py） | 169 文件，启动口径 sha256+size，收尾比对 0 差异（data/raw、data/derived、data/private、data/registries、metadata 四登记＋active.json 全部未动） |
| 三篇公开 PDF 与登记 | metadata/public_sources.json 3/3 路径/SHA 匹配 |
| 服务边界 | 8768 验证服务已停止、端口释放；8766 LAN 服务未触碰 |

## 与任务合同的偏差
1. inquiry.js 类名最小偏离：L06 修复缺陷4 需改 `views/inquiry.js` 一处类名（`.gate-hint`→`.learning-gate-hint`），该文件不在当回合明示允许清单内（清单原文遗漏）。仅此一处最小必要改动，其余未越清单；已修复并在 fix-notes.md 披露。
2. 允许清单中 `docs/p10ns/261019/24step_status_LJX.md` 本次未改动（无新增需要），handoff_acceptance.md 只追加 LJX 接收状态段。
3. AI 实测范围：合同允许"无模型时只验离线/模拟协议与守卫，不声称实测模型解析"；本机 tutor.json 存在，实际仅 1 次真实 analyze 调用记账，其余为协议级模拟，未夸大为实测模型解析。

## 数据、许可与审核门
- research_evaluation：仍为研究候选。本次新增反馈规则、逆合成静态示意均为来源可追溯的教学候选；21 条对账只确认与原文一致，不表示独立化学实验验证；DQ-R2-03 派生换算登记为 conflict 未修复。
- teaching_case_review：不晋级。22/22 案例仍 pending_teacher_review，教师批准 0；全部机器输出（含 result_analyst 四分区解析）均为 agent_checked_candidate，页面固定"机器反馈 · 待教师审定"。
- public_teaching_release：not_started，未变。三 PDF 公开例外范围不扩大，rights_verified=false 不变。

## 已发现但未改的问题
1. DQ-R2-03「约 9.23 g/L」为派生换算混入 value 字段（原文未报告，grep 全文无命中），登记 conflict，待教师/负责人决定是否拆分计算层（temp/task-027/l04/reconciliation.md 问题1）。
2. 数据丰度不均：三路线文献报告值数量/类型差异大，走查问题单已按责任方转出。
3. 课堂并发风险：本机模型走查实测 55 s 超时、12 次/分限流可能触发降级，已在走查问题单标注（需部署侧容量决策，不在本任务范围）。
4. 走查 UI 问题（toast 遮挡、spiraeoside 命名等）按责任方转出，未越权代修。
5. 三篇均无标准曲线/原始峰数据 → 峰比对与产率定量比较不可做，为最终判定，不提出替代计算。
6. LYW/ZYT/HYK 实际交付未收到（见 handoff_acceptance.md 追加段），不预填成员签收。

## 遗留风险、仓库与CI
- Git：branch main，HEAD c90e0f7（未变）；工作树含 TASK-015—027 全部未提交改动（启动时既有 220 个未提交文件＋本任务新增）；未提交、未 push、未运行 CI。
- 本地受限数据：tutor.json 私有配置仅服务端读取；L04 对账临时远程文本在 cano /tmp，不含新增派生物入 Git。
- 迁移风险：无跨工作区依赖；程序只读本项目相对路径。
- 服务：8768 已杀；8766 未重启、未改动。

## 建议的下一TASK
- DQ-R2-03 conflict 处置与 quality_status 升级决策（需教师/负责人输入）。
- 等待并接入 LYW/ZYT/HYK 实际交付后的接入核对任务。
- 课堂并发与部署容量评估（需新的授权与运行环境事实）。
以上仅建议，不自动实施。
