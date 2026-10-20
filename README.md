# FlavoGlycoLab｜黄酮糖苷智能生物制造虚拟实验室

以异槲皮苷为首个待审案例的教学建设项目。当前可运行三条候选路线的六阶段过程实验台：选择路线、装配材料、设计条件与对照、演练取样、检查数据缺失、写反思并导出记录。真实实验观测为空，不能给出产率或色谱，22条案例仍待教师审核。

## 克隆后直接运行

需要Git和Python 3.10+，无需原始私有数据、服务器账号、Conda、GPU或npm安装。

```bash
git clone https://github.com/juliusloon/FlavoGlycoLab.git
cd FlavoGlycoLab
python scripts/dev.py
```

浏览器打开[本地实验台](http://127.0.0.1:8767/)，Ctrl+C停止。Windows可用`py`，macOS/Linux可用`python3`替换`python`。请通过HTTP访问，不能双击index.html。端口占用时加`--port 8768`。

已有克隆先保存自己的改动，在main上运行`git pull --ff-only`，然后运行相同启动命令。此前实验台仅保存在所有者本机，TASK-013已补齐GitHub交付。

```bash
python scripts/dev.py doctor    # 检查环境、运行资产、公开来源SHA
python scripts/dev.py check     # 默认工程检查；研究资产检查明确跳过
python scripts/dev.py evidence  # 查看真实案例索引与公开来源核验
```

实时AI为可选功能：未配置时显示“模型尚未配置”，本地流程照常。浏览器练习只保存在当前站点的本地存储，请导出备份。运行和默认测试不需要访问所有者服务器。

**三位协作成员请按[协作与数据说明](docs/operations/collaboration.md)操作**：包括更新、分支、Windows/macOS命令、可选研究包导入、AI配置及报错处理。已有LAN常驻原型另见[运维说明](docs/operations/lan-site.md)。

## 数据规范

| 数据 | 默认是否提供 | 使用方式 |
| --- | --- | --- |
| 完整实验台与非数值路线摘要 | 是 | 运行即用，内容不是审定实验观测 |
| 22条待审案例、123条历史来源登记 | 是 | cases()/registry()读取元数据，教师批准0 |
| 三篇指定原始PDF | 是 | Git普通文件，metadata/public_sources.json固定路径/SHA；出版方rights_verified=false |
| 3059条历史研究候选、117项证据与SQLite等 | 可选离线研究包 | 需要全量证据工作时导入并显式选择research |
| 五项旧外部模型 | 否，不需要 | 不参与实验台或研究包的运行依赖 |
| 模型密钥、学生记录、受限private材料 | 否 | 本机私有配置/浏览器保存，不加入Git |

`metadata/active.json`默认选择public，只读取实际随Git提供的内容。公开摘要的研究record_count为null，绝不声称已加载3059记录。全量研究模式明确指定`--profile research`，缺包提供操作指引，SHA不符失败，不静默回退或伪造空数据。研究包的生成与导入见[协作说明](docs/operations/collaboration.md#全量研究包离线交接可选)。

旧数据政策中“运行和全量测试必须有本机私有证据池”的默认依赖已由[ADR 0006](docs/adr/0006-collaboration-data-profiles.md)替代。原件不可静默修改、许可/审核状态可追溯、三个状态门独立等规则继续执行，详见[数据规范](docs/data-governance.md)。内部研究包不公开上传。

## 当前能力与边界

截至2026-10-20，实验台、同源后端和可选Qwen辅导已实现。路线、装配和条件变更使下游记录失效，支持刷新恢复、最多12个快照、方案比较、JSON/Markdown导出。运行只使用本仓库；无CDN、构建器或外部工作区依赖。

全量历史池含3059条混合资源，不能称3059个实验；21条结构命中不能称21项独立酶法研究。公开案例表11项历史数值仍为withheld_unlicensed，10项原缺失保留missing。没有教师审定的定量观测、真实D1仿真、正式评分、师生账户或完整24步课程验收。

**公开源码不代表公众教学服务已验收发布。** research_evaluation仍为历史研究候选，teaching_case_review为22/22待审，public_teaching_release为not_started。机器测试通过不代替科学或教学审核。

当前校内10-27截止、内部10-26定版及分工以[申报执行方案](docs/p10ns/261019/申报阶段分工与执行方案_20261019-1026.md)与[实施基线](docs/policy/ilab-2026/readiness-evidence-2026.md)为准，不据此宣称其余申报交接已完成。

## 开发与验证

默认Python检查仅标准库；本机安装Node时还运行JS状态测试。仅浏览器QA需要以下依赖，普通运行不需要：

```bash
npm ci
npx playwright install chromium
npm run test:browser
```

保持无模型配置的本地实验台在8767运行后执行浏览器测试。CI覆盖Windows/macOS/Linux公开运行检查，以及Linux三路线/三视口的无密钥浏览器流程。可选研究检查通过`python scripts/dev.py check --profile research`启用。包式Python入口安装及详细操作见[协作说明](docs/operations/collaboration.md)。

默认从main创建`codex/`短期分支，通过PR协作。先读[PROJECT](PROJECT.md)、[STATE](STATE.md)、[ARCHITECTURE](ARCHITECTURE.md)，按[贡献规范](CONTRIBUTING.md)登记TASK及REPORT。成员在自己的克隆通常使用origin远端；所有者当前检出使用public远端，普通git push即可，勿推送旧研究归档分支。

## 许可与阅读入口

原创代码[Apache-2.0](LICENSE)，原创文档[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh-hans)。第三方PDF、原始数据与模型保留各自许可，不被本项目代码/文档许可覆盖；[许可说明](LICENSES/README.md)。三个公开PDF仍是TASK-008 human_direct的精确范围例外，其余受限原件/派生数据/private及旧研究历史不进入公共Git。

[当前状态](STATE.md) · [里程碑](PROGRESS.md) · [本次交付报告](docs/reports/REPORT-013-collaboration-ready.md) · [工作台设计](docs/design/workbench.md) · [路线规划](ROADMAP.md) · [文档索引](docs/README.md) · [问题反馈](https://github.com/juliusloon/FlavoGlycoLab/issues)

LJX的[第6/7栏技术准备稿](docs/p10ns/261019/shenbaoshu_sections_LJX.md)、[交付接收与接入清单](docs/p10ns/261019/handoff_acceptance.md)、[站会记录](docs/p10ns/261019/standup_log.md)及[双浏览器走查](docs/operations/browser-acceptance.md)由TASK-014维护；校内事务由两位指导老师负责。
