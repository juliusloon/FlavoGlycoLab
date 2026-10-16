# TASK-001：FlavoGlycoLab独立数据与证据基础

状态：Executed，验收以实际测试结果为准。
日期：2026-10-15。
批准：所有者直接指示FlavoGlycoLab独立于旧项目，包括所有必要数据；新任务序号从001开始。

## 范围

复核现有23个P0迁移的本地哈希、Git隔离、P1科学审核门和22个案例待审状态。按许可隔离要求，复制可得的122个登记来源原件、v3记录及SQLite派生索引至项目私有区；缺失的.DS_Store作操作系统元数据缺口登记，不伪造来源文件。P1中受控复制的候选证据仍非教学批准。

建立仅从本项目相对路径读取的配置和标准库证据入口。脱离旧仓库工作目录验证文件及来源SHA，拒绝越界目录输入。新教学服务、仿真、评分、课程、AI导师、iLab、公开发布尚未在本TASK实现。

## 验收材料

migrations/standalone-data-custody.json、metadata/active.json、src/flavoglycolab/evidence/catalog.py、tests/test_standalone.py、docs/decision/ADR-0002-standalone-data.md。

研究结果仍为candidate，案例teacher_review=0，Git不得包含受限来源和模型。下一任务为FlavoGlycoLab的TASK-002，不沿用历史研究项目的编号。
