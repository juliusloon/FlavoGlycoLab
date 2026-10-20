# 许可范围（FlavoGlycoLab）

沿用所有者 2026-09-21 决定的分层许可（同 FlavoRetro / CondRxnBench）：代码、项目原创文档、数据三层分别处理。

## 代码与软件产物

本项目新写的源代码、脚本与配置以 [Apache License 2.0](../LICENSE) 许可。`reference/flavoretro-snapshot/` 中的代码副本来自 FlavoRetro（Apache-2.0），保持原许可不变。

## 项目原创文档

`docs/` 与治理文件采用 [CC BY 4.0（署名4.0国际）](https://creativecommons.org/licenses/by/4.0/deed.zh-hans)，[完整法律文本](https://creativecommons.org/licenses/by/4.0/legalcode.zh-hans)。第三方引用内容不因出现在原创文档中而被重新许可。

## 数据与第三方材料

- `data/private/` 与 `reference/flavoretro-snapshot/{data,metadata}/` 的数据保留各自来源许可，不因进入本仓库而被重新许可；逐文件许可门见 `migrations/mapping.csv` 的 license_gate 列。
- 许可未知或未过许可门的材料仅本地使用，禁止再分发；禁止进入发布包、公网或学生可直接访问的静态路径。
- 原始与受限数据不随 Git 再分发（`.gitignore` 强制排除）。
- 本地`data/registries/case_admission.csv`含未清理许可的历史来源数值；公开快照将11项数值标为`withheld_unlicensed`，保留10项原有`missing`，不公开其旧Git历史。本地原表与来源字节不修改。
- `data/registries/`公开的是来源定位、哈希、许可和待审身份等元数据，不包含可再分发教学数据的授权承诺。

## 边界声明

候选/未审核是数据状态描述，不构成任何化学事实的许可或担保。本仓库当前 0 项教师审定数据；case_admission.csv 全部行仅为待审登记。

## TASK-008公开范围例外（2026-10-18）

所有者明确指令“三篇PDF也要公开”。`data/raw/literature/`中的三个已提交PDF按`metadata/public_sources.json`登记的精确路径及SHA（导出脚本的`PUBLIC_PDFS`兼容读取）公开；其余raw/derived/private仍不公开。这是human_direct范围决定，出版方rights_verified=false，不追认为教师审定或全数据授权，PDF不适用本项目原创代码/文档许可。原件不改，原案例表仍脱敏。
