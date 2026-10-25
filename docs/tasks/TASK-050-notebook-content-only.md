# TASK-050：论文笔记本内容式阅读

## 合同元数据
- 任务ID：TASK-050
- 状态：Completed
- 基线分支/提交：main / 92fe3f8；保留039—049已有未提交工作。
- 授权来源：human_direct，2026-10-25用户本轮明确要求删header、缩短为四个差异图标便签、删除页内原文标题及常驻说明，PDF白底/无工具栏/无目录并留白。
- 人工负责人：项目所有者；执行者：Cano。
- 修改预算：frontend/student/{paper-notebook.js,paper-notebook.css,paper-pdf-reader.js,README.md,index.html}、vendor/pdfjs/{pdf.min.js,pdf.worker.min.js,text-layer.css,LICENSE,provenance.json}；scripts/dev.py资产清单；tests/test_inquiry_browser.mjs中受影响PDF守卫；docs/{design/interface-system.md,adr/0009-paper-notebook-student-notes.md}、ARCHITECTURE/STATE/PROGRESS、本TASK/REPORT。不改package/后端/系统配置。
- 关联ADR：0009复审阅读器；PDF.js固定5.4.624，本地打包Apache-2.0，原发布字节仅改扩展名供现有静态服务加载，不用CDN或在线安装。

## 目标
论文笔记本只保留内容与紧凑图标便签。三篇论文白底连续阅读，PDF正文略内收，无浏览器工具栏/目录/深色底。笔记与键盘、Esc、回焦继续可用。

## 背景与已核实事实
现有原生PDF iframe内部由浏览器扩展管理，页面无法稳定改其深色底；用户要求对内部呈现可控，允许在同一学生端内使用固定本地PDF.js展示原PDF内容。已有来源/SHA/PDF端点保持唯一，不更改原件或公开范围。

## 范围
### 允许项
- 删除可见header标题/副句，保留独立关闭按钮及无障碍窗口名称。
- 四个左侧短便签只显示四种SVG图标，保留aria-label/title；便签条底部透明，无底板。
- 删除每篇PDF上方标签/常驻工具条、成功保存常驻文案与指定权利/待审短句；保存失败等真实操作错误仍可提示，后台许可/审定登记不变。
- 本地PDF.js canvas与可选择文本层，按原页比例完整显示，白底和内边距，无工具栏/目录；懒渲染、缩放适配、取消/重试/回收、原文回退链接按失败需要显示。
- 必要更新PDF工程断言及运行资产清单；工程/浏览器/8766实页验收，不调用真实模型、不重启常驻服务。
### 禁止项
- 不改原PDF/科学解读/答案/笔记语义或导入及24步门禁；不改raw/derived/private、metadata/registries、原图或原交件。
- 不引入运行外联/CDN/构建前置，不改后端CSP/静态白名单或服务配置，不提交/push，不晋级三个状态门。
### 工件职责
| 文件 | 职责 |
| --- | --- |
| paper-notebook.js/css | 窗口/便签/笔记交互与白底内容布局 |
| paper-pdf-reader.js | 固定同源PDF的解析、按页渲染/文本选择、尺寸及资源生命周期 |
| vendor/pdfjs | 固定许可/指纹登记的第三方库，不属项目原创代码 |
| 既有文档/测试 | 更新过时UI说明及PDF守卫，记录真实验证 |

## 非目标
不增加批注/下载管理/PDF编辑器、不生成论文截图替代原文，不修改论文内容或教师审核状态。

## 必须执行的操作
1. 基线及冻结来源SHA；登记合同。
2. 精简布局，原件只读地实现白底内容阅读；本地库保留LICENSE与来源指纹。
3. 桌面/平板/手机检查四图标、留白、三篇全文/文本层、滚动/尺寸、Esc/回焦、笔记保存及加载/保存失败。
4. 标准工程与相关浏览器回归、原件/8766字节核对，REPORT/STATE闭环。

## 验收标准
- [x] header标题/副句和每篇PDF长标签均消失；四短便签只有差异SVG图标，底部无底板。
- [x] 三篇原文均完整白底、无工具栏/目录，可滚动/选择文本，内容内收并留白色边距。
- [x] 两句常驻说明及成功保存提示消失；笔记保存/刷新/导出语义不变，真实失败有恢复。
- [x] Esc/关闭按钮/回焦/键盘便签有效；桌面/平板/手机无溢出/新增应用错误/运行外联。
- [x] 工程与相关回归通过，受保护资产与三PDF SHA不变，三状态门不晋级。

## 验证
python3 scripts/dev.py check；npm test；npm run test:browser；npm run test:pages-browser及本轮专项。Browser plugin not available，沿用现有Playwright/Chromium；临时证据在/tmp/flavoglycolab-task-050/。

## 停止条件
需要改原件/科学内容/后端或常驻服务、库缺少可再分发许可、无法保证原文完整性或保全其他工作时停止报告。

## 报告要求
REPORT-050-notebook-content-only.md记录真实改动、分母、失败及未测事项，更新STATE/PROGRESS；不自动开始下一TASK。
