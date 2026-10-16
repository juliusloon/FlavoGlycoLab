# FlavoGlycoLab｜黄酮糖苷智能生物制造虚拟实验室

**面向健康相关黄酮糖苷酶法合成与生物制造的实验教学建设项目。当前处于可审计候选证据基础阶段。**

[当前状态](STATE.md) · [进展与验收](docs/reports/REPORT-003-progress-public-repository.md) · [路线规划](ROADMAP.md) · [可行性研究](docs/research/FlavoRetro_FutureHealth_Feasibility_20261015.md) · [贡献规范](CONTRIBUTING.md)

项目拟以异槲皮苷为首个待审案例，让学生设计方案、审查AI建议、依据真实实验观测分析酶法路线，并比较有证据的工程菌制造案例。实验数值须来自教师审定的观测和明确的适用范围，来源缺失时拒绝生成结果。

## 当前进展

截至2026-10-16，已完成独立证据基础和项目治理；唯一活动业务模块为本地只读证据目录。

| 建设内容 | 当前事实 |
| --- | --- |
| 来源登记与原件保护 | 123条登记，122项本地原件；缺少的1项为系统元数据`.DS_Store` |
| 候选证据池 | 本地3,059条混合候选资源及SQLite索引，未随公开仓库分发 |
| 教学案例 | 1个主案例与21条历史反应命中，22条全部待教师审核，批准数为0 |
| 工程与治理 | 相对路径读取、SHA校验、越界拒绝、TASK/REPORT/ADR及治理自动检查 |
| 真实观测驱动的D1仿真 | 未实现，尚无教师批准的教学定量数据 |
| 24步课程、对照、取样、分析与评分 | 规划中，尚无可运行教学闭环 |
| AI导师、师生门户、权限与会话 | 未实现，相关目录为占位结构 |
| iLab接入、试教、安全与公众服务 | 未开展，须独立验收 |

可行性研究中的MCTS、模型辅助搜索及研究网页属于历史FlavoRetro背景能力。本仓库的参考快照不作为运行依赖，也不代表这些功能已在FlavoGlycoLab提供。3,059条资源不是3,059个实验，21条结构命中不是21项独立酶法研究。

## 获取与检查

需要Python 3.10或以上；当前治理检查仅使用标准库。

```bash
git clone https://github.com/juliusloon/FlavoGlycoLab.git
cd FlavoGlycoLab
python3 -m unittest discover -s tests -p test_governance.py -v
```

公开克隆可以阅读代码、治理、来源登记及待审案例索引，执行上述治理检查。完整证据读取器及全量测试还需要依法取得的本地私有数据；公开仓库没有包含这些数据，也没有用演示数据代替它们。

在授权数据已归位的本地工作区运行：

```bash
PYTHONPATH=src python3 -m flavoglycolab.evidence.catalog --workspace . --verify-sources
python3 -m unittest discover -s tests -v
```

程序只读取当前项目内的相对路径，不回退到其他研究工作区。

## 公开范围与许可

公开内容包括原创代码、中文项目文档、来源元数据、待审登记和允许公开的历史代码参考。`data/raw/`、`data/derived/`、`data/private/`、第三方全文、模型权重与未经授权的观测不随Git分发。

公开案例表中11项尚无再分发许可的历史数值标为`withheld_unlicensed`；原有10项缺失仍为`missing`。本地原表和旧Git历史保留，公开仓库使用清理后的独立提交历史。生成方法与边界见[本轮报告](docs/reports/REPORT-003-progress-public-repository.md)和[导出脚本](scripts/export_public_repository.py)。

原创代码采用[Apache-2.0](LICENSE)，原创文档采用[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh-hans)；数据与第三方材料保留各自许可，详见[许可说明](LICENSES/README.md)。

**公开源码不代表公众教学服务已经发布。** 研究评价、教师案例审定和公众教学发布分别设门，当前教师批准为0，教学发布状态为`not_started`。

## 阅读与参与

- [PROJECT](PROJECT.md)：目标、非目标与科学/许可边界。
- [STATE](STATE.md)与[PROGRESS](PROGRESS.md)：当前事实和里程碑。
- [ARCHITECTURE](ARCHITECTURE.md)：模块与工件唯一责任归属。
- [文档索引](docs/README.md)：任务、报告、长期决策、案例及研究。
- [待决事项](docs/decisions-needed.md)：需要所有者、教师、平台和权利人确认的内容。
- [问题反馈](https://github.com/juliusloon/FlavoGlycoLab/issues)：工程问题、来源线索和设计讨论；请勿上传受限原件、个人数据或密钥。

后续优先关闭案例来源、真实观测和教师审核缺口；双轨申报可行性草案仍未批准，课程、AI及平台建设须另立TASK。贡献前请阅读[AGENTS](AGENTS.md)和[贡献规范](CONTRIBUTING.md)。
