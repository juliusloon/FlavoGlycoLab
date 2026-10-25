# REPORT-050：论文笔记本内容式阅读

## 对应任务
- TASK文件：docs/tasks/TASK-050-notebook-content-only.md
- 状态：Completed
- 基线提交与分支：main / 92fe3f8；以/tmp/flavoglycolab-task-050/baseline.json区分本轮与039—049既有未提交修改。
- 结果提交：pending；未提交/push。
- 授权来源：human_direct，2026-10-25用户本轮笔记本精简指令。

## 改动文件与职责
| 文件 | 实际改动及用途 |
| --- | --- |
| frontend/student/paper-notebook.js | 删除窗口header/副句、便签文字、每篇PDF长标签、常驻保存/权利句；四个不同SVG图标及完整aria/title；原文错误恢复按需显示，保存成功不显示文字；PDF生命周期接入 |
| frontend/student/paper-notebook.css | 便签轨道透明、宽度缩短，独立关闭按钮；白色阅读区与内边距、桌面双栏/手机纵排、原页和文本层布局 |
| frontend/student/paper-pdf-reader.js | 同源三PDF白底完整原页，canvas＋可选择文本层；逐页懒渲染、原比例/高DPI/resize、取消/回收/重试，无科学状态/AI访问 |
| frontend/student/vendor/pdfjs/ | 固定PDF.js 5.4.624主库/worker、LICENSE、文本层CSS及provenance.json；约1.52MB，Apache-2.0，不改npm/package或构建流程 |
| frontend/student/index.html | 删除已不存在header的labelledby，窗口改用aria-label；其他导师/入口保持原样 |
| scripts/dev.py | 新增阅读器/库/许可/指纹运行资产清单 |
| tests/test_inquiry_browser.mjs | iframe源断言改为原PDF渲染完成；故障/慢载的新标签页链接改为按需恢复区，其余三路线/24任务守卫保留 |
| README、interface-system、ARCHITECTURE、ADR0009、TASK/REPORT/STATE/PROGRESS | 当前呈现/职责/阅读器复审和实测事实 |

app.js、lab-state/learning-state/quest-state、views/inquiry.js、demo-content、科学元数据与原件无本轮改动。

## 实际操作与观察
1. 保存497项已有文件基线；281项科学/来源/既有vendor/原图/原交件及核心学习模块作为冻结核对分母。
2. 原生PDF iframe内部深色底不可由页面稳定控制，因此使用本地固定PDF.js读取既有受控端点，不改原PDF或服务端。主库/worker与官方npm包字节一致，仅.mjs改.js文件名以适配现有静态白名单；文本层CSS节选且仅选中色改为现有绿，修改性质和SHA独立登记。
3. 官方包SHA512与registry发布登记一致；保留[上游v5.4.624](https://github.com/mozilla/pdf.js/releases/tag/v5.4.624)、[官方渲染示例](https://mozilla.github.io/pdf.js/examples/)及本地LICENSE/provenance。运行没有CDN/外部依赖或npm安装前置，沿用原CSP且isEvalSupported=false/useWasm=false。
4. 便签对照/双酶/去糖/细胞四种图标，桌面宽48（选中52）×48px，手机宽38（选中42）×44px；下方透出背景，无轨道底板。窗口header/副句、PDF长标签/工具条/目录和两句指定常驻说明删除；无可见成功保存提示，保存失败仍准确提示。
5. 桌面PDF横24/底32px白色留边，手机横14/底24px；原页等比连续滚动、文字可选择。Pei5、Zhang8、Niu13共26页，五种public/LAN组合逐页核对。实际查看桌面/手机截图和Niu图4页的图表/公式，未裁切或改写原文，视觉与用户规格一致；台账fidelity-ledger.md。
6. 保留方向键/Home/End、Esc、关闭回焦、笔记本与导师切换、笔记保存/刷新和既有导出语义；从PDF正文自身按Esc也能关闭，不再由浏览器PDF插件处理按键。

## 验证
Browser plugin not available；已有Node22.23.1、Playwright、Chromium153.0.8010.12。临时127.0.0.1:8777禁用模型配置；8766只读取实页，未重启或发送AI请求。证据均在/tmp/flavoglycolab-task-050/，不入Git。

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| python3 scripts/dev.py check | Python78：75通过/3显式research跳过；Node80/80；check.log与收口check-closed.log |
| npm run test:browser | 1614/1614；三路线/三视口/24任务、旧记录/键盘/故障/慢载与开放探究通过；browser/results.json，正常错误/外联0 |
| npm run test:pages-browser | 692/692，errors0/externals0，4条既有WebGL性能warning；pages/results.json |
| notebook-qa.mjs | 419/419；public1536/900/375及原URL8766的1536/375。包括四图标/透明轨道、删除文案、原件26页×5组合=130次逐页绘制及白底/非空像素/文字层、选择文字/滚动、笔记保存/刷新、Esc/回焦、resize、PDF失败重试/保存失败。正常错误0、外联0、POST0；results.json/notebook-final.log |
| 生命周期专项 | 7/7；8766、DPR2：读取中关闭/重开、快速切换后取消、resize高密度绘制、正文Esc及错误恢复区状态；应用错误0；lifecycle-results.json |
| 原件/核心流程保护 | 281/281字节不变，三PDF SHA3/3与metadata/public_sources.json登记一致；protection.json |
| 8766资产 | index/笔记本JS与CSS/新阅读器/主库/worker/文本层CSS七项HTTP200、7/7与磁盘一致；原常驻进程无需重启 |
| 第三方完整性 | npm tar包SHA512核对；四个库/许可/CSS工件SHA4/4与provenance登记一致；主库/worker原字节保留 |
| Git | git diff --check无空白错误；未提交/push或运行远端CI |

## 与任务合同的偏差
无功能范围偏差。PDF.js文本层CSS加入允许清单，明确是上游规则节选/颜色适配，不声称与原完整CSS字节相同。

首轮419专项在完成418项后，将主动注入的503故障控制台消息误归入正常错误，最终总错误断言失败；区分故障夹具后重跑419全部通过，预期503一条单列expectedConsole。逐页像素检查主动调用getImageData产生130条Canvas读回性能提示，仅来自QA检查，不是应用错误/缺图；最终日志保留。没有为通过验收修改产品去压制警告。

## 数据、许可与审核门
- research_evaluation：仍候选；未新增实验或观测。
- teaching_case_review：22/22待审，0教师批准；删除展示语句不更改登记。
- public_teaching_release：not_started；未增加公众教学发布或PDF公开范围。
- 三PDF仍为TASK-008精确例外，出版方rights_verified=false；PDF.js Apache-2.0许可与原文版权各自保留。

## 已发现但未改的问题
只验收三篇既有PDF、Chromium及模拟视口，不宣称任意PDF/实体设备/Safari/Firefox已验证。阅读区按用户要求不提供内嵌工具栏/目录，原PDF在加载失败时可按需打开；浏览器缩放仍可使用。笔记仍为当前站点本地数据。

## 遗留风险、仓库与CI
保留039—049既有未提交工作。未改后端CSP、静态白名单、模型、常驻服务或系统配置；未调用真实模型、未提交/push/远端CI。临时QA服务收尾停止，8766刷新即可见。

## 建议的下一TASK
不自动启动。
