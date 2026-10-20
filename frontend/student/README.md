# 学生虚拟实验台

TASK-012已将六页展示骨架重建为连续工作空间。产品结构见[工作台设计](../../docs/design/workbench.md)，当前事实见[STATE](../../STATE.md)，访问和启停见[LAN运行说明](../../docs/operations/lan-site.md)。

## 使用流程
1. 在异槲皮苷案例中比较三条候选路线，独立写选择依据。
2. 为该路线加入底物、催化体系、供体方案；可纠错、移除和重配。
3. 录入自己的体积、底物浓度、温度、pH、时长、取样时点、对照和假设。投料换算只作单位算术。
4. 按检查→混合→启动演练→按计划取样操作，生成样品标签和日志。
5. 查看样品的缺数据状态，明确哪些结论无法成立。
6. 写结论、局限和下一步，保存练习；与历史快照比较或导出JSON/Markdown。

AI导师位于同一工作台，问题随当前步骤发送给已有Qwen模型。前端展示真实模型回复、系统证据拒绝或真实失败；三者明确区分。模型不操作仪器、不写入学生方案、不产生观测或教师成绩。

## 运行

从根目录运行`python scripts/dev.py`，浏览器打开[本机实验台](http://127.0.0.1:8767/)。Python 3.10+标准库，无需npm、私有数据或模型凭据；无AI配置显示“模型尚未配置”，流程可继续。Windows可用py，macOS/Linux可用python3。不要双击index.html。

获取/更新、默认检查、可选研究包和实时AI配置见[协作说明](../../docs/operations/collaboration.md)。LAN持续托管另见[运维说明](../../docs/operations/lan-site.md)。原生HTML/CSS/ES模块，无CDN/构建器。assets/lab-bench.png为原创生成装置示意，不是实验照片。

## 状态和文件职责
- app.js：应用编排、事件、持久化、同源AI交互。
- lab-state.js：流程门槛、校验、上游变化失效、记录与导出。
- views/workbench.js：六阶段和记录的纯视图。
- ui.js：转义、图标和来源详情。
- content/demo-content.json：非数值路线和来源元数据；原始身份/条件/教师真值仍由项目登记负责。
- styles.css：桌面三栏与手机流程条/导师抽屉。

仅在当前浏览器、当前站点源保存；两个网卡地址是不同浏览器存储源，不自动同步。最多12份练习快照；关闭页面保留，清空浏览器数据会删除，请自行导出。新实验需确认；损坏记录不会静默覆盖，JSON导出可包含原始损坏备份。另一标签页写入后暂停本页自动保存并提示刷新，避免互相覆盖。

## 验证

```bash
node --test tests/test_workbench_state.mjs
python3 -m unittest discover -s tests -p test_lab_server.py
```

浏览器QA依赖由仓库根package.json/package-lock.json管理，运行无模型配置的本地8767服务后执行：

```bash
npm ci
npx playwright install chromium
npm run test:browser
```

测试默认不调用真实模型，不依赖某个人home路径。可通过环境变量FRONTEND_URL、QA_OUTPUT、CHROMIUM_EXECUTABLE或FLAVOGLYCOLAB_LIVE_AI覆盖明确的测试选项；详见协作说明。旧test_frontend_scaffold.mjs转入当前工作台验证。

## 科学边界
这是可操作的过程演练。所有条件均为学生方案输入；暂无真实色谱、标准曲线、产率或动态反应模型，quantitative_result始终null。六阶段不能替代24步课程/教师审核/公众教学发布验收。
