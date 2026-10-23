# 页面与界面组件规范

TASK-037，2026-10-24。适用于当前学生端，保留原生 HTML/CSS/ES 模块；无需前端构建器或新增运行依赖。页面只投影已有学习状态，不建立另一套科学、教学或学习完成真值。

## 页面矩阵

| 页面 | 地址（相对 student 服务根） | 职责与访问条件 |
| --- | --- | --- |
| 实验总览 | `index.html#/home`；根入口默认此页 | 当前练习续接、六阶段进度与资料入口 |
| 案例导入 | `index.html#/intro/1`—`/intro/3` | 每幕独立；只允许进入已解锁幕，可回访，不清答案 |
| 阶段操作 | `index.html#/stage/1`—`/stage/6` | 复用六阶段工作台；仍核对前序主线与原有操作前置条件 |
| 主线任务 | `index.html#/task/01`—`/task/24` | 当前任务的证据/填写两区；不允许地址绕过导入或主线顺序 |
| 论文对照 | `index.html#/papers?stage=0`—`stage=5` | 阅读任意阶段不修改实验当前阶段；`&tab=analysis` 显示结论反思 |
| 实验记录 | `index.html#/records` | 现有快照、对比与导出；记录不是成绩 |
| 案例页 | `case.html` | 原有只读案例与来源说明 |
| 数据查询 | `data.html?route=R1&q=3830` | 路线/来源/类别/关键词由 URL 恢复，保持文献报告值边界 |
| 界面规范与组件 | `components.html` | 共用组件的实际调用示例与交互验收入口 |

`#/resume` 是续接入口：优先进入最后访问且仍有权限的学习子页面，否则退回当前可访问阶段/导入。`#/case`、`#/data`、`#/about` 显式转至对应独立页面；`#/steps` 转总览，`#/ai` 转当前练习。未知地址显示恢复入口；已知但未解锁的地址显示原因，不清记录、不伪造完成。

## 导航与恢复

- 所有页面共享两行站点页头（品牌/工具与站点导航），通过当前页样式和 `aria-current="page"` 指示位置。手机导航自身横向滚动，正文不横向溢出。
- 学习页复用阶段导航、导入进度或当前阶段任务导航；不增加面包屑栏。
- 子页面有“返回上一页”和“继续当前练习”。有站内历史时使用浏览器历史；直接进入且无站内历史时返回实验总览。浏览器自身前进/后退同样有效。
- 任务和阶段地址随真实进入操作更新，通过原生 history/hash 导航。输入仍由既有草稿逻辑保存，切页不提交答案、不重置实验。
- `flavoglycolab.last-page.v1` 只保存学习页面路径，是界面偏好。恢复前重新按当前答案和操作条件检查权限，不能凭旧路径恢复已失效的完成状态。
- 原学习记录仍唯一保存在 `flavoglycolab.workbench.v1`，保留旧存档迁移、损坏不覆盖、跨标签页冲突保护。续接仅限当前浏览器和站点源。
- 进入新页面将主内容滚至顶部并聚焦主区域；叙事分页继续使用现有 sessionStorage 偏好。没有账号、跨设备恢复或网络同步。

## 唯一维护位置

| 层级 | 工件 | 约束 |
| --- | --- | --- |
| 视觉变量 | `frontend/student/design-tokens.css` | `--fg-*` 是唯一调色板/字号/间距/圆角/尺寸定义；旧变量为兼容别名 |
| 组件 HTML | `frontend/student/components.js` | 站点页头、页标题、按钮、输入字段、面板、状态、空状态、返回导航 |
| 组件外观与布局 | `frontend/student/components.css` | 所有页面最后加载；统一控件、两列、容器、表格、反馈与响应式 |
| 路由解析/权限/续接 | `frontend/student/navigation.js` | 纯函数，调用原状态规则；不写实验事实 |
| 总览与页面级导航 | `frontend/student/views/pages.js` | 只做内容投影；无第二套任务内容/进度数据 |
| 学习页编排 | `frontend/student/app.js` | 路由进入、持久化、事件、AI/PDF及旧工作台联接 |
| 组件展示 | `frontend/student/components.html`、`components-page.js` | 调用同一组件；示例只影响内存中的演示反馈 |
| 领域页面 | `views/inquiry.js`、`views/workbench.js`、案例/数据页脚本 | 专属布局/图示/证据表；禁止另建站点页头或调色板 |

## 视觉与分栏

| 项 | 统一规则 |
| --- | --- |
| 主色/文字/背景 | `#176b5b` / `#17352f` / `#f6f8f8`；白色内容面板 |
| 语义 | 绿：主操作/已保存；琥珀：待审/需处理；红：失败；颜色必须配文字 |
| 字体 | 系统无衬线和中文回退；无远程字体 |
| 字号 | 正文14px，控件13px，辅助12px；页面标题桌面30px、手机26px；科学图示可保留专用标注 |
| 间距 | 4、8、12、16、24、32、48px |
| 圆角 | 控件10px；内容面板16px；状态标签6px |
| 内容宽 | 资料/总览/记录/组件页最大1180px；桌面左右32px，手机16px |
| 实验外壳 | 桌面248px导航列＋弹性内容列，1000px以下210px；760px以下纵向排列 |
| 主辅布局 | `.fg-split` 主内容2份/辅助1份，辅助列最小280px；760px以下单列 |
| 证据与填写 | 保留任务内部两区；狭窄视口按原任务规则纵向排列 |
| 表格 | 外层独立滚动，页面本体不溢出；caption、th/scope保留语义 |

## 组件调用

普通页面在 HTML 内加载 `components.css`，提供 `<header data-site-header></header>`，再由模块挂载。学习页继续使用原 app 编排。

```js
import {
  mountSiteHeader, bindReturnNavigation, returnControl,
  pageHeader, panel, button, field, statusBadge, emptyState,
} from './components.js';

mountSiteHeader('data'); // home / bench / papers / case / data / records / components
bindReturnNavigation(); // 每个文档只绑定一次
main.innerHTML = returnControl()
  + pageHeader({title:'页面标题', description:'说明用途'})
  + panel({title:'内容', body:button({label:'继续练习', href:'./index.html#/resume'})});
```

| 函数/类 | 参数与规则 |
| --- | --- |
| `button` | `{label, href?, action?, variant?, disabled?, type?, iconName?}`；primary/secondary/quiet；链接导航、按钮动作；一组通常一个主动作 |
| `field` | `{label,name,value?,unit?,type?,attributes?}`；默认text；数字输入保留step="any"；attributes仅用于开发者固定的min/max/required等属性 |
| `pageHeader` | `{title,description?,actions?}`；actions只接收可信组件HTML |
| `panel` | `{title?,body?,id?}`；body只接收可信组件HTML |
| `statusBadge` | `(label,tone?)`；neutral/success/warning/danger |
| `emptyState` | `{title,description?,actions?,tone?}`；解释原因并提供恢复入口 |
| `.fg-container` / `.fg-split` | 页面容器/两区布局，不在每个页面重写尺寸 |
| `.field` / `.actions` | 对于select/textarea等复合表单，沿用同一标签和操作区样式 |
| `.fg-table-wrap` / `.fg-table` | 响应式表格容器/表格；列标题、行标题用scope |

普通文本参数由组件转义。`body`、`actions`、`attributes` 仅限源码构建的可信HTML/属性，不放入学生、模型、来源或URL原始输入。按钮事件由页面编排处理；组件库不持有实验状态、不调用AI、不自行保存答案。

## 状态与无障碍

- 加载、空、失败、未解锁分别解释；失败提供重试或返回入口。缺失值、原文报告、学生草稿和本次观测不混用。
- 有明确表单标签、键盘焦点、禁用态与 `role="status"`；紧急错误沿用 `role="alert"`。原生dialog支持Esc、焦点约束和关闭后回焦。
- 不仅以绿色文字表示可操作；按钮有边框/背景，普通链接保留下划线或明确导航形态。
- 页面主体使用main、单一内容标题；跳转入口保留skip-link。组件展示页的空状态是独立示例区域。
- 动效尊重 `prefers-reduced-motion` 及现有减少动态偏好。
- 不通过CSS隐藏科学/教师审定边界；机器检查永不自动晋级三个状态门。

## 扩展与验收

1. 在上述页面矩阵确认职责；新学习路由在 navigation.js 登记解析、合法枚举、权限与恢复。学习真值仍归原状态机。
2. 页面复用组件和token，只有领域特有布局留在专用CSS。新增运行文件同步 scripts/dev.py 清单。
3. 执行 `python3 scripts/dev.py check`、`npm test`、`npm run test:browser`、`npm run test:data-browser`、`npm run test:pages-browser`。浏览器QA需要项目锁定的可选Playwright依赖及可用浏览器。
4. 至少验证桌面/平板/手机的总览→导入→任务→回退→刷新→续接、锁定地址、论文跨阶段只读、数据筛选深链与组件对话框/表单。检查控制台、外部请求、横向溢出和保存恢复。
5. 审核来源和原件SHA不变，实际分母和未测事项写对应REPORT。组件展示可用于开发验收，但不等于教师或公众发布验收。
