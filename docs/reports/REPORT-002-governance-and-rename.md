# REPORT-002：项目更名与治理架构本地化

## 对应任务
- 任务：docs/tasks/TASK-002-governance-and-rename.md
- 状态：Completed（限本地更名、治理文件与工程验收）
- 日期：2026-10-15
- 基线：main / 03519b1976020dea17451d7eaf8602e2a58f2c96
- 结果提交：本报告写入后提交到本地main；确切提交哈希以git log -1为准
- 授权来源：human_direct（所有者要求重命名并参考CondRxnBench管理架构）

## 实际改动和文件用途

| 所在目录/职责 | 实际变更 | 用途 |
| --- | --- | --- |
| 项目工作区 | /home/ljx/FutureHealth → /home/ljx/FlavoGlycoLab | 物理目录改名，无旧名兼容软链接 |
| 源代码 | src/futurehealth/ → src/flavoglycolab/ | 包名与可执行导入路径同步，保留原有业务数据读取功能 |
| 项目构建 | pyproject.toml、tests/test_standalone.py、tests/test_migration_integrity.py | 分发名称、CLI入口和回归测试更新 |
| 项目治理 | AGENTS.md、PROJECT.md、ARCHITECTURE.md、STATE.md、PROGRESS.md、ROADMAP.md、CONTRIBUTING.md | 事前授权纪律、长期范围、模块owner、当前状态和里程碑 |
| TASK合同 | docs/tasks/TEMPLATE.md、README.md、TASK-002-governance-and-rename.md | 同仓库独立编号、修改预算、停止条件与验收范围 |
| REPORT事实 | docs/reports/TEMPLATE.md、README.md、REPORT-001-standalone-data-foundation.md、本REPORT | 同号同短名结果归档；REPORT-001是历史事实回填而非当时已有的合同闭环 |
| ADR决定 | docs/adr/TEMPLATE.md、README.md、0001/0002/0003/0004 | 旧决策由docs/decision搬迁，保留旧名历史；新增更名与治理决策 |
| 规范/索引 | docs/README.md、data-governance.md、acceptance-criteria.md、decisions-needed.md | 来源与许可、教师准入和公开发布三门区分 |
| 贡献入口 | .github/pull_request_template.md、ISSUE_TEMPLATE/、workflows/governance.yml、.editorconfig、.gitattributes | 复用PR/Issue纪律和仅Git安全治理检查 |
| 治理验证 | tests/test_governance.py | 7条无需私有数据的治理合同断言，可在干净Git checkout运行 |
| 项目显示 | README.md、LICENSES/README.md、TASK-001历史合同说明 | 项目身份统一，历史Git和历史来源仍以当时名称记载 |
| 数据持有凭据 | migrations/standalone-data-custody.json | 仅顶层project字段改名，新增旧项目别名；路径/字节SHA的列表未改变 |

受限原件、第三方模型、原始候选数据位于本仓库私有忽略目录，未作为本次变更的Git payload；本次没有操作CondRxnBench、FlavoRetro及其Git历史。

## 实际操作
1. 直接读取CondRxnBench的AGENTS、PROJECT、STATE、ARCHITECTURE和TASK/REPORT/ADR真实模板与索引、CONTRIBUTING、编辑规范、GitHub issue/PR和workflows，移植的是管理规则而非其基准研究结论或历史TASK/REPORT。
2. 新名称定为FlavoGlycoLab（黄酮糖苷智能生物制造虚拟实验室），仓库目录与Python包同步更名；旧名FutureHealth保留在历史仓库提交、两份旧ADR及迁移历史事实中。
3. 明确三个互不自动晋级的科学/教学/公开状态门，并以ARCHITECTURE的Artifact Registry明确所有工件owner与active/scaffold区分。
4. 新建Task/Report/ADR本项目模板；TASK-001补事实REPORT-001；TASK-002写本次真实报告，长期决定ADR0003/0004。
5. 为不具备本地私有payload的Git checkout单设治理测试和GitHub Actions工作流。远端仓库未配置/推送，故CI尚未真实运行。

## 验证

| 命令/检查项 | 本次实际结果 |
| --- | --- |
| python3 -m unittest discover -s tests -v | 18/18通过，包含23个P0源的24条目标映射SHA |
| python3 -m unittest discover -s tests -p test_governance.py -v | 7/7通过，不需要受限本地数据 |
| 从 /tmp 设置PYTHONPATH运行 flavoglycolab.evidence.catalog | 成功，工作区明确为FlavoGlycoLab |
| --verify-sources | 123登记、122实存来源SHA通过、1个历史缺失的OS .DS_Store，不伪造 |
| data/derived/v3/records.json | 3059历史候选资源正常读取 |
| SQLite PRAGMA integrity_check（已有工程测试） | ok |
| Git受限路径守卫 | raw/derived/private均为ignore，受限模型和历史快照data/metadata不入Git |
| src/pyproject/metadata活动路径扫描 | 未发现旧项目绝对路径或旧包导入 |
| git diff --check | 通过（提交前） |
| 原研究仓库HEAD | CondRxnBench 0712ff7、FlavoRetro 993b22f，未执行修改 |

## 合同偏差
- 无业务功能越界；将治理入口扩展为GitHub issue/PR/workflow模板，但仅实施独立于私有数据的治理检查，不宣称远端CI验证。
- 已有TASK-001在治理模板出现之前完成，本次明确事后补对应REPORT；不伪造其事前合同遵守了之后才建立的模板。
- 原项目名在历史不可变的Git日志、迁移凭据和旧ADR文本中仍可出现，不能为了表面统一改写历史；活动运行代码/包/目录均已更名。

## 数据许可与三状态门
- research_evaluation：只引用历史科研候选，不能视作新化学独立验证；
- teaching_case_review：22项全pending_teacher_review、human_review_status=not_performed；
- public_teaching_release：not_started；受限数据和模型不会随Git公开。

## 发现但未处理
- 原macOS路径/Volumes/cano/FutureHealth可能需要用户重新映射至/Volumes/cano/FlavoGlycoLab；本次不操作用户Mac挂载管理。
- 旧项目名称和绝对路径的历史值在migrations、reference及历史ADR中仍可读，仅用于静态来源审计，不用于活动加载。
- 专业教师结构审定、定量D1数据、24步实验和平台部署均不存在。

## 遗留风险与仓库/CI
本次只验证本地分支；并未执行git push。CI定义作为静态文件新增，尚没有可报告的远端Actions执行结果。受限数据在本机存在但不随Git clone自动复制，完整科研数据本地自包含不代表公开克隆者可取得第三方原件。Git日志仍保留旧临时项目名。

## 推荐下一任务
TASK-003：异槲皮苷结构/反应方向/重点文献的教师与许可审定。尚未批准或执行。
