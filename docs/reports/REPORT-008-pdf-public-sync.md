# REPORT-008：三篇PDF公开同步与提交身份修正

## 对应任务
- TASK文件：docs/tasks/TASK-008-pdf-public-sync.md
- 状态：执行中；基线main d6817ca，公开14cdfe8；结果提交pending。
- 授权来源：human_direct，所有者明确要求julius作者并选择“三篇PDF也要公开”。

## 改动文件与职责
- scripts/export_public_repository.py：PUBLIC_PDFS记录三篇精确路径/SHA，未知文件及变化字节仍拒绝。
- scripts/publish.py：git publish自动导出、公开历史审核、治理检查与普通推送；使用根仓库作者身份。
- .gitignore、tests/test_governance.py、tests/test_standalone.py、.github/workflows/governance.yml：只放行指定PDF，CI采用相同路径/SHA守卫。
- AGENTS/PROJECT/ARCHITECTURE/STATE/PROGRESS/README/ROADMAP、许可/数据治理和文档索引：登记human_direct范围例外及日常操作。
- 本TASK/REPORT；原候选008/009顺延009/010，仅改编号和活跃引用，未实施。
- 本地两处Git配置：作者julius，214170985+juliusloon@users.noreply.github.com；旧提交不改。

## 实际操作与观察
研究main与公开main无共同祖先，不能直接快进。已登记三个PDF精确SHA并保存171项保护文件基线；原PDF不改，11项案例数值仍仅在公开表脱敏。

## 验证
待执行本地完整测试、公开治理、历史审计、远端PDF字节与CI核验。

## 与任务合同的偏差
无；用户明确指令覆盖原始全raw禁入规则，仅为三个指定PDF登记例外。

## 数据、许可与审核门
公开授权来源为human_direct；出版方rights_verified=false，不把所有者指令写成出版社许可确认。三PDF不适用原创Apache/CC BY统一授权。research_evaluation未提升、22项teaching_case_review待审核、public_teaching_release=not_started。

## 已发现但未改的问题
旧提交Cano作者不因配置调整而改写；研究历史与公开历史仍独立，使用git publish同步允许树。

## 遗留风险、仓库与CI
推送/CI待执行；本地数据与历史保留，禁止force push与历史合入。

## 建议的下一TASK
候选009/010待分别授权，不自动执行。
