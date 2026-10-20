# REPORT-013：协作者克隆即可运行与分层数据交付

## 对应任务
- TASK：[TASK-013-collaboration-ready.md](../tasks/TASK-013-collaboration-ready.md)。状态：Completed（工程协作交付）。
- 日期：2026-10-20；授权来源：human_direct。所有者要求直接修复三位成员pull后无法运行、缺私有数据且被引向服务器的问题。
- 基线main / 279d76b；实现分支codex/collaboration-ready；实现提交e4239e8、快照测试修复42fc987、验收记录d45353a、Windows编码修复f3826d6；均已普通推送public/main。结果提交包括上述实现及承载本报告的最终文档提交；不在文件内编造自身SHA。
- 执行者Cano；验收性质agent_task_audit，human_reviewed=false，不代表三位成员或教师的真人验收。

## 结果与实际操作

根因一：GitHub main停在TASK-009，frontend/student只有.gitkeep；本机TASK-010/011/012成品从未提交。根因二：旧active.json和默认测试要求不随Git分发的私有v3及历史原件；其中一项迁移测试还要求六个明确不分发的参考快照载荷。

现已把完整实验台/后端及必要历史合同报告纳入公开提交，新增跨平台`python scripts/dev.py`入口。默认public使用现存真实案例登记和三个公开PDF，既不下载也不冒充全量研究数据；record_count=null，观测仍空。日常开发无需所有者服务器/私有数据/旧模型/模型密钥。研究读取显式选择research，缺失输出离线包导入命令；损坏失败而非回退。

离线研究包已生成并在另一新克隆实际导入：117项现存非模型证据＋4项v3派生文件＝121。五项旧模型仍保全本地/保留登记，但非运行依赖、不随包交付。私有配置、审核材料、Git历史均排除。导入按本地固定清单验证整包SHA、路径、大小、每项SHA，完整预检后写入；相同字节重复导入不改写，冲突/未知文件/链接/越界/不完整包拒绝。工具不自动传输给成员。

三个公开PDF精确路径/SHA移到metadata/public_sources.json唯一维护，导出脚本PUBLIC_PDFS兼容加载；没有变更原件或权利状态。原生成装置图以精确PNG SHA加入已有导出守卫，未放宽其它二进制载荷。

## 改动文件与职责

以下覆盖相对于279d76b的实际改动，含作为本次交付依赖纳入的已有未提交成品。

| 工件 | 实际改动/职责 |
| --- | --- |
| README.md、CONTRIBUTING.md、docs/README.md | 以成员克隆/启动/检查为入口；分支与可选研究/AI说明 |
| PROJECT.md、AGENTS.md、ARCHITECTURE.md | 默认public规则、数据边界、工件唯一归属；直接授权不追认为科学审核 |
| STATE.md、PROGRESS.md | 当前事实与里程碑，去除旧“当前未提交”的误导；历史事实仍由旧REPORT保存 |
| LICENSES/README.md、docs/data-governance.md | 保留版权/教师/发布边界，更新分层数据规范与PDF唯一指纹入口 |
| docs/adr/0006-collaboration-data-profiles.md、docs/adr/README.md | 默认配置/可选研究包的长期决定及索引 |
| docs/operations/collaboration.md、docs/operations/lan-site.md、docs/design/workbench.md | 新成员操作与报错；纳入已有LAN和工作台设计说明，LAN不是成员必需依赖 |
| metadata/active.json、metadata/public_sources.json、metadata/research_bundle.json | 默认public/显式research；三个PDF指纹；四项v3派生固定指纹 |
| src/flavoglycolab/evidence/catalog.py | profile-aware读取、真实分母、缺失指引、SHA及路径拒绝，public不伪造records |
| scripts/dev.py、scripts/research_bundle.py | 跨平台启动/诊断/检查；内部离线研究包导出/预检/导入 |
| scripts/serve_lab.py、scripts/install_lan_service.py、ops/systemd/flavoglycolab-lan.service.in | 已有标准库同源后端与LAN用户服务成品纳入Git；本轮不重新安装/重启LAN服务 |
| scripts/export_public_repository.py | 读取PDF清单；精确原创装置图例外，其余载荷/凭据守卫保留 |
| frontend/student/index.html、app.js、lab-state.js、ui.js、styles.css、views/workbench.js、content/demo-content.json、assets/lab-bench.png、package.json、README.md | 已完成六阶段过程实验台完整交付；更新运行与QA文档，不重建产品设计 |
| package.json、package-lock.json、.gitignore | 固定Playwright1.64.1作为可选QA依赖；忽略node_modules/venv/构建物 |
| tests/test_data_profiles.py、tests/test_research_bundle.py | 7项配置/缺失/损坏/隔离/Windows编码与8项离线包正常/幂等/失败/冲突/链接测试 |
| tests/test_standalone.py、tests/test_migration_integrity.py、tests/test_governance.py | 默认公开分母、显式3项研究检查、18公开快照文件核验、ADR连续性 |
| tests/test_lab_server.py、tests/test_workbench_state.mjs、tests/test_workbench_browser.mjs、tests/test_frontend_scaffold.mjs | 纳入已有服务/状态/浏览器守卫；默认无AI、可移植依赖定位、旧入口兼容、Windows无符号链接权限时明确skip |
| .github/workflows/governance.yml | Windows/macOS/Linux默认运行与可选包CLI，Linux无密钥浏览器流程 |
| docs/tasks/TASK-010-website-scaffold.md、TASK-011-lan-deployment.md、TASK-012-interactive-workbench.md、TASK-013-collaboration-ready.md、README.md | 已有合同纳入Git及本次直接授权合同/索引 |
| docs/reports/REPORT-010-website-scaffold.md、REPORT-011-lan-deployment.md、REPORT-012-interactive-workbench.md、REPORT-013-collaboration-ready.md、README.md | 历史实际结果与本轮事实报告/索引，不将历史状态改写为当时已发布 |

原始/派生/private、原登记/迁移/参考字节未改；它们不因修改规范而自动公开。

## 验证

本地环境：Python3.13.13；独立克隆使用系统Python3.12.3，Node22.23.2，Playwright1.64.1 / Chromium153.0.8010.12。Browser plugin not available，按frontend-testing-debugging技能使用已有Playwright。验证流程：干净克隆启动→三路线选择/装配/方案/取样/无观测/反思→保存/恢复/导出，未配置AI时明确不可用并保留问题。

| AC / 方法 | 分母、结果、证据 |
| --- | --- |
| AC1 干净克隆默认运行 | clean-clone无data/derived与data/private；doctor成功，127.0.0.1:18767实际HTTP服务运行。clean-check.log、clean-http-and-missing-research.json |
| AC1 可选包式入口 | 独立venv实际pip install -e clean-clone成功；已安装CLI --workspace clean-clone --verify-sources成功。package-install.log、installed-cli.json |
| AC2 浏览器主流程 | 84/84通过；1536×1024/R1、768×1024/R3、375×812/R2，三路线六阶段、单位换算、错材料/取样拒绝、上游失效、持久化/重置、快照/比较、JSON导出、内容失败恢复、无AI/模型失败界面。正常路径页面/控制台错误0、浏览器外部请求0。browser/results.json及各阶段PNG |
| AC2 页面QA | 身份/非空/无错误覆盖层/主交互/截图/响应式均通过；同轮查看1536-route与375-analysis截图，无横向溢出；非视觉重设计，无概念图比对要求 |
| AC2/AC5 HTTP隔离 | 5运行资产/health成功，6仓库/私有/越界路径404，共11/11；health configured=false。clean-http-and-missing-research.json。服务边界11项unittest另通过 |
| AC3 public证据 | 3/3公开PDF固定SHA、22/22待审案例，record_count=null；无研究资产不影响public。缺research明确退出1，给出导入命令，不用空列表冒充。clean-check.log、clean-http-and-missing-research.json |
| AC3 研究包交接 | 导出121文件，12,294,560字节；新research-clone首次导入121、第二次0新增/121相同。research-export.json、research-import.json、research-reimport.json |
| AC3 导入后研究核验 | records=3059；来源registered=123/present=117/optional_absent=5/OS缺失1/errors=[]；SQLite只读PRAGMA integrity_check=ok。research-evidence.json、imported-research-check.log |
| AC4 默认Python | GitHub重新克隆最终代码46项：43通过、3项研究资产明确skip；不把skip称作已核验。github-clone-check.log；旧clean-check.log是增加编码回归前的45项 |
| AC4 显式研究Python | 最终代码在原工作区及新导入研究克隆均46/46通过，无skip。research-check-final.log、imported-research-check-final.log |
| AC4 JS状态 | 9/9通过，默认与research检查均包含；流程/快照/恢复/无观测导出。对应check.log |
| AC4 数据边界 | 7项profile＋8项研究包测试均通过；覆盖错整包SHA、错文件SHA、未知/越界/private路径、链接/重复/缺失、已有冲突及相同包幂等；拒绝分支未写入目标原件 |
| AC5 字节保护 | baseline.json登记的172/172 SHA一致；含raw/derived/private/登记/migrations/reference，不输出私有内容。protected-integrity.json |
| AC5 公开导出 | e4239e8已提交树147文件通过原公开导出与凭据/载荷守卫；已脱敏11值、原missing10保留，案例表原/导出SHA相同。public-export.json |
| AC6 远端/跨平台 | 已推送public/main；GitHub重新clone默认检查46项、JS9项通过。f3826d6的[Actions39369460723](https://github.com/juliusloon/FlavoGlycoLab/actions/runs/39369460723)四个job全部success：Ubuntu/Python3.10、Windows/Python3.12、macOS/Python3.12默认检查＋安装CLI；Linux三路线/三视口浏览器84项。github-ci-second.json、ci-success.log、github-clone-check.log |

证据均位于本地temp/task-013，不随公共Git交付；可复现命令与守卫随Git提供。另三个成员的实体机器/浏览器和真人回执未测，不把CI或同主机独立克隆当其本人测试。

## 研究包位置与交接

本地成品：`temp/task-013/flavoglycolab-research-v3.tar.gz`；SHA256：`6646374e34b4649526fda2b9ceee95349df78788e3425092d8d948d70754d205`；同目录`.sha256`旁文件。只按实际使用权限私下交接，不上传公共Git/Release/网页；未自动联系或发送给成员。普通前后端开发无需此包。

## 与任务合同的偏差、失败与修复

- 第一轮原工作区默认检查通过，但第一份真正干净克隆发现迁移测试仍要求六个未公开reference快照，出现6个子检查失败。根据既有migrations/mapping.csv的git_tracked=false边界修复；默认仍逐项核对18个公开文件SHA，24条/23唯一历史映射不改，六项私有快照由172保护指纹保全。修复后相同独立克隆默认检查通过。没有通过复制私有快照或按exists()静默跳过规避失败。
- 本轮确定五项external_model不是活动依赖，研究包验收分母明确117现存证据＋4派生，不再要求把122原件中的旧模型一起传给成员；原件不删除/改写，存在的模型损坏仍失败。TASK在实施包工具前按该分层细化验收，记录为技术选择，不是科学审批。
- 实现阶段初次apply_patch因同一文件delete/add重复目标被工具拒绝，未产生文件改动，分步完成；不影响来源字节。
- 使用已有Chromium可执行文件通过环境变量验证，而测试默认路径已移除个人home与历史temp。浏览器QA依赖固定于npm lock，运行依赖仍为标准库。

- 首次跨平台CI（d45353a，Actions39369253951）Linux/浏览器/macOS通过，Windows因重定向终端cp1252无法输出中文失败。修复CLI stdout/stderr为UTF-8、子进程UTF-8模式及服务JSON显式UTF-8读取，新增强制cp1252重定向的真实CLI回归（doctor/研究包帮助/默认证据/缺研究错误）。f3826d6重跑四个job全部通过，不用仅在CI设置环境变量掩盖成员本地问题。ci-first-failed.log、github-ci-first.json、ci-success.log保存失败与修复证据。
- 最后复核172项保护SHA及33个活跃文档相对链接通过；公开父链233个可达blob均通过载荷/凭据守卫，历史案例表一直保留11项脱敏/10项missing。对应final-local-verification.json、reachable-history-audit.json。该可达历史审查绑定d45353a，后续编码/报告变更仍逐文件审核，不把旧计数当最终全量blob数。

## 数据、许可与审核门

research_evaluation=历史候选，无本轮独立化学实验证明；teaching_case_review=22/22 pending_teacher_review，human_reviewed=false；public_teaching_release=not_started，public_release=false。所有数值结果null，模型未配置不冒充成功。公开PDF仍是TASK-008所有者范围决定，rights_verified=false；本轮未新增第三方原件公开或恢复脱敏值。研究包工具不授予版权、不向公共服务提供受限材料。

## 遗留风险、仓库与CI

当前main已经普通推送；功能提交f3826d6的跨平台/浏览器CI四个job全成功，最终文档闭环提交后正常推送；未force push、未推归档分支。最终HEAD可从GitHub main或本报告所在提交读取。原LAN服务本轮只读is-active=active，不做网络/模型/部署变更；跨物理设备、真实重启/容量、成员真实环境与课程试教仍未测。实际实时AI连接是历史TASK-012证据，本轮默认QA不调用真实模型，其失败fixture只验证界面。

## 建议的下一TASK

不自动启动。成员按协作说明更新并运行；科学/教师审定、真实定量观测、课程和申报交接仍按原门槛另行授权。
