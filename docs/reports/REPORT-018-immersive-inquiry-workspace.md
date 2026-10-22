# REPORT-018：分子与三案例驱动的沉浸式探究工作空间

## 对应任务

- TASK文件：[TASK-018-immersive-inquiry-workspace.md](../tasks/TASK-018-immersive-inquiry-workspace.md)
- 状态：Completed（工程交互范围；科学、教师、公众发布门不晋级）
- 日期：2026-10-21
- 基线与结果：当前工作树；结果仍为 `pending`，本轮未提交、未 push、未运行 CI。
- 授权来源：human_direct。保留 TASK-015/016/017 的未提交工作，不启动后续 TASK。

## 改动文件与职责

| 所在目录与职责 | 文件/目录 | 实际改动及用途 |
| --- | --- | --- |
| 学生空间编排 | `frontend/student/index.html`、`styles.css`、`app.js` | 重排为分子开场、三路线、主线任务、实验历程、记录/设置与按需 AI 浮窗；响应式布局；Enter 发送、Shift+Enter 换行与 IME 安全；窄屏将收起导师入口置于顶部工具栏，避免覆盖操作按钮。 |
| 探究内容与主线 | `frontend/student/views/inquiry.js`、`quest-state.js`、`views/inquiry-tools.js`、`inquiry-tools.css` | 负责异槲皮苷开场、三篇论文/三种路线、8 项顺序主线、阶段对照、04/06/08 互动工具；错误客观题留关，短答标为自述待复核。 |
| 过程与记录状态 | `frontend/student/lab-state.js`、`learning-state.js`、`views/workbench.js`、`views/learning.js` | 保留六阶段操作、保存/刷新/导出与上游失效；路线往返、上下文修订号和 AI 请求事实防止陈旧答复或不当追认。 |
| 分子资产 | `frontend/student/molecule-viewer.js`、`assets/molecules/`、`vendor/3dmol/` | 同源离线 3Dmol 交互、二维降级、SMILES、糖基高亮；ChEBI 68352 与 PubChem 5280804 交叉核对，RDKit 几何明确标为计算构象；附来源指纹和 ChEBI CC BY 4.0、3Dmol BSD-3-Clause 许可。 |
| 内容与工程守卫 | `frontend/student/content/demo-content.json`、`scripts/dev.py`、`package.json`、`tests/` | 新增三路线×六阶段的非数值方案/条件语义/假说/证据/缺口；加入主线状态测试和整页浏览器入口。 |
| 文档 | `docs/design/workbench.md`、`frontend/student/README.md`、`ARCHITECTURE.md`、`docs/README.md`、`docs/tasks/README.md`、`docs/reports/README.md` | 更新产品入口、工件责任和本任务索引；`temp/task-018/` 保存本地设计与验收证据，不进入公开发布材料。 |

## 实际操作与观察

- 入口先呈现异槲皮苷结构；可旋转、缩放、复位并突出糖基，展开后显示三种机制类别示意。示意图是原创机制块图，不冒充论文原图或结构证据。
- 选择路线前可以比较论文；只有明确选择才进入路线。第 05 题的理由用于最终确认，不重复填写第二份理由。
- 左上常驻当前及邻近任务，左下显示六阶段历程；中央一次处理一个任务或阶段工作台。设置、实验记录、来源对照均有入口。
- 三篇论文在每个阶段提供方案、非数值条件语义、待检验假说、证据定位和缺口；不填充未经审定的温度、产率、动力学或测量结果。
- AI 默认收起；打开后为浮窗。发送逻辑保留上下文修订号，路线切换或草稿变化时旧请求不能覆盖新内容；定量问题走证据守卫。
- 首次在窄屏验收中发现导师入口遮住提交后的“下一项任务”，已改为移动顶部紧凑入口并回归验证；桌面仍为右下浮动入口。

## 验证

| 执行命令/检查 | 分母、结果和证据 |
| --- | --- |
| `python scripts/dev.py check` | Python 46 项：43 通过、3 项研究资产按显式规则跳过；默认 public 配置成功；日志见 `temp/task-018/check.log`。 |
| `npm test`（等价 Node 状态检查） | 27/27 通过：原 18 项工作台状态与新增 9 项主线状态。 |
| `tests/test_inquiry_browser.mjs` 完整浏览器回归 | 403/403；Chrome 155，1536/768/375 三视口、三路线、六阶段、24 题、错误阻断、记录/导出、浮窗、键盘、失败夹具；正常页面错误 0、自动外部请求 0；`temp/task-018/browser-final/results.json`。 |
| 工具整页专项 | 51/51；R1 真实完成 01—08，桌面/375 窄屏；04/06/08 工具、无 CSP、无外联、错误 0；`temp/task-018/tools-integration/result.json`。 |
| 真实 AI 专项 | 10/10；真实 8766 接口恰好 2 次 POST，Enter 发送、Shift+Enter 不发送、普通解释与定量证据守卫均通过；错误 0；`temp/task-018/live-ai/results.json`。 |
| 状态/异步专项 | 6/6；旧记录前序门、路线往返、AI 请求事实、迟到响应与重确认行为通过；`temp/task-018/molecule/state-review-final.json`。 |
| 分子专项 | 结构/来源/渲染、WebGL 失败二维降级等 7 项通过；证据在 `temp/task-018/molecule/`。 |
| 受保护字节 | 199/199 SHA 一致，差异 0、缺失 0；`temp/task-018/protected-final.json`。 |
| 8766 既有服务资产 | 登记 13/13 逐字节一致，差异 0；核验期间未重启或修改服务；`temp/task-018/lan-assets-final.json`。 |
| 窄屏遮挡专项 | 375×812 下导师入口位于顶部栏（40×40），提交后的下一项按钮与入口不相交；开闭浮窗无页面错误；截图 `temp/task-018/browser-final/375-launcher-no-overlap.png`。 |
| 视觉对照 | 规格与实际截图的布局、颜色、字号、分子/机制示意、任务 HUD、AI 浮窗、响应式五项核对见 `temp/task-018/fidelity-ledger.md`。内置 image_gen 返回 HTTP 404，未取得概念图，未声称生成图匹配。 |

## 与任务合同的偏差

- image_gen 概念图调用返回 HTTP 404；没有改用未经授权的 CLI，按用户明确布局和代码原生视觉规格继续实施，实际截图作为核对依据。
- Browser plugin 不可用，沿用项目已有 Playwright 与本地 Chrome；没有安装系统包。
- 移动入口的小修发生在最终窄屏回归中，属于 AC5 可用性修复，不扩展科学或后端范围。

## 数据、许可与审核门

- `research_evaluation`：仍为历史候选与计算结构/来源核对，不能表示独立化学实验验证。
- `teaching_case_review`：22/22 案例仍 `pending_teacher_review`，教师批准 0；主线自查、三路线文本和 AI 回复不代替教师审定。
- `public_teaching_release`：`not_started`；本任务未做发布许可、权限、安全、容量或平台验收。
- 没有真实样品观测、色谱、标准曲线、产率或正式成绩；量化结果保持缺失/null。三篇 PDF 的既有 TASK-008 公开例外和 rights_verified=false 事实不变；新增分子资产的许可证见其 README。

## 已发现但未改的问题

- 三篇文献的实验条件、原始测量链、路线泛化与案例身份仍需逐条教师/专业审核；界面只能展示来源定位和缺口。
- 3D 构象由 RDKit 计算，不是实测构象；WebGL 性能仍可能出现浏览器级 ReadPixels 警告，不影响二维降级与功能验收。
- localStorage 是当前浏览器本地记录，无账号、跨设备同步或正式教学成绩服务。
- 代理浏览器验收不等同真人课程验收、Windows/macOS/实体移动设备验收；CI 未在本任务重跑。

## 遗留风险、仓库与 CI

- 当前工作树包含 TASK-015/016/017/018 的未提交文件及既有本地修改；本任务未提交、未 push、未改 8766 服务/模型/GPU/网卡/防火墙。
- 临时证据位于 `temp/task-018/`，受限原件、研究池、SI 和模型密钥仍不进入 Git 或 student 运行资产。
- 本报告第一次工程检查曾因报告尚未创建而失败；创建报告后重新运行 `python scripts/dev.py check` 已通过，失败事实保留于本地过程记录，不作为成功分母隐藏。

## 建议的下一 TASK

仅建议后续由教师/专业人员审定三篇文献条件、结构身份与教学量规，再另行批准科学案例准入和正式课程验收任务。本轮不自动启动下一 TASK。
