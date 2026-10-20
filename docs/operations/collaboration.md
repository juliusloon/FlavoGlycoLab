# 协作成员本地运行与数据使用

适用日期：2026-10-20，TASK-013。三位成员使用同一份流程。无需服务器账号、旧工作区、Conda、GPU或原始私有数据。先安装Git与Python 3.10+；Windows命令通常用`py`，macOS/Linux通常用`python3`替换下文的`python`。

## 更新与启动

首次获取：

```bash
git clone https://github.com/juliusloon/FlavoGlycoLab.git
cd FlavoGlycoLab
python scripts/dev.py
```

已有克隆，先保存自己的改动并检查当前分支，然后更新main：

```bash
git status
git switch main
git pull --ff-only
python scripts/dev.py
```

打开[本地实验台](http://127.0.0.1:8767/)。默认只监听本机，Ctrl+C停止。若端口占用，使用`python scripts/dev.py --port 8768`。不要直接双击index.html；ES模块与JSON需要HTTP服务。不要在仓库根运行通用静态服务器以免暴露私有文件；本入口只提供student资产与限定API。

`git pull --ff-only`提示分叉时保留分支及改动，按团队PR流程整合；不要执行`reset --hard`覆盖工作。如果文件仍只有.gitkeep，请核对仓库地址与分支，执行`git log -1 --oneline`并提交诊断。

## 检查、开发和分工

```bash
python scripts/dev.py doctor
python scripts/dev.py check
python scripts/dev.py evidence
git switch -c codex/你的任务短名
```

`doctor`检查Python、运行资产、三个公开文献SHA与22条待审案例；显示模型配置文件是否存在，不输出凭据。`check`运行全部默认Python检查；安装Node时同时执行JS状态测试，未安装时明确跳过JS。普通测试会明确跳过3项研究资产检查，不把跳过称为已核验。CI会单独运行JS和浏览器测试。

前端只改frontend/student；后端/证据入口改scripts与src/flavoglycolab；案例/文献审核交付到登记与对应TASK。成员先读PROJECT/STATE/ARCHITECTURE并登记自己的唯一TASK；PR说明实际测试及数据影响，防止三人同时覆盖同一权威文件。成员实际账号和任务分配以团队确认为准，不预填审批人。

可安装包式Python入口，但网页运行不需要安装：

```bash
python -m venv .venv
python -m pip install -e .
flavoglycolab-evidence --workspace . --verify-sources
```

上例创建venv后须先按本机方式激活：Windows PowerShell用`.venv\Scripts\Activate.ps1`，macOS/Linux用`source .venv/bin/activate`。也可直接使用venv内Python执行pip，避免系统环境混用。

## 哪些数据已经随Git提供

| 内容 | 获取方式 | 用途 |
| --- | --- | --- |
| 完整实验台、路线摘要、来源指纹 | git clone/pull | 三路线过程、方案/对照/标签、记录导出 |
| 22条真实待审案例索引、123条历史来源登记 | 同上 | 阅读/核对元数据；不表示历史原件全量随Git提供 |
| 三篇指定原始PDF | 同上，metadata/public_sources.json固定SHA | 阅读与来源核对；出版方rights_verified=false |
| 3059条历史研究记录、117项证据、SQLite等 | 仅做全量证据工作时使用下述研究包 | 历史候选研究，不能当审定教学观测 |
| 五项旧外部模型、权重/模板 | 不需要、不随包交付 | 本地过程实验台和证据核验均不依赖 |
| AI凭据、学生浏览器记录 | 各成员本机设置/保存 | 不纳入Git/数据交接包 |

默认public不是替代实验数据集：公开摘要的record_count=null，cases()读取22条既有索引；观测仍为空、产率仍null。研究读取必须显式选择research。

## 全量研究包离线交接（可选）

提供方在具备使用权限且数据齐全的项目工作区运行：

```bash
python scripts/research_bundle.py export
```

产生`temp/flavoglycolab-research-v3.tar.gz`及`.sha256`旁文件。把包和SHA通过团队获准的私有文件交接方式交给实际需要做研究的成员；不上传公共GitHub/Release/网页，不发送服务器账户或模型密钥。工具不自动上传、不联系成员；内部交接不改变许可状态。若团队缺乏对应使用权限，先完成授权，普通开发照常进行。

接收方在克隆根目录运行（用实际文件路径与提供方SHA替换示意值）：

```bash
python scripts/research_bundle.py import /path/to/flavoglycolab-research-v3.tar.gz --sha256 <提供方给出的64位SHA256>
python scripts/dev.py evidence --profile research
python scripts/dev.py check --profile research
```

Windows可使用带引号的本地盘符路径；不要把`<…>`示意文本原样复制。数据写回本项目的data/raw/legacy和data/derived/v3。包含117项证据＋4项v3文件；123条登记中5项旧模型允许缺失、1项.DS_Store明确历史缺失。原件SHA不变；完整预检后写入，已有相同文件跳过，有不同字节则整次拒绝且不覆盖。先保存冲突文件并核对来源，不能用空文件或改SHA绕过。

如直接调用Python API，使用`EvidenceCatalog(workspace, "research")`再调用records()；默认配置只提供cases()/registry()/公开文献校验。旧默认records()调用须相应迁移。

## 实时AI为可选功能

无配置时页面显示“模型尚未配置”，流程仍可完成。需要实时AI的成员须使用自己有权访问的模型接口；不需要访问所有者服务器，也不复用其密钥。在项目内创建`data/private/runtime/tutor.json`，填写base_url、model、api_key三个字段（均为字符串）；不要把该文件加入Git。POSIX系统设置权限0600；后端逐请求读取，浏览器只访问本机同源API。仅“配置存在”不证明模型实际可达。

GET `/api/health`应返回配置状态。配置错误/离线时导师明确报不可用，不能把静态指导或测试mock当真实模型回复。学生方案/对话会随主动请求发送至所配置的服务，使用团队获准接口。

## 可复现浏览器测试

仅浏览器QA需要Node 20+和npm，普通运行不需要。先保持一个无AI配置的本地实验台在8767运行，再在另一个终端执行：

```bash
npm ci
npx playwright install chromium
npm run test:browser
```

默认不调用任何真实模型；模拟的AI失败只测试报错界面，其余流程访问真实本地服务。在配置了AI的环境可显式设置`FLAVOGLYCOLAB_LIVE_AI=1`运行真实模型路径；此为另一个验收分母，不是默认CI要求。可用FRONTEND_URL、QA_OUTPUT、CHROMIUM_EXECUTABLE指定测试地址、输出或已有浏览器。测试不再依赖任何人home目录的绝对路径。

## 常见报错

| 现象 | 处理 |
| --- | --- |
| 提示缺少data/derived/v3/records.json | 日常启动用scripts/dev.py，默认public；仅研究任务导入研究包后选择research |
| 缺serve_lab.py、app.js或只有.gitkeep | 更新main；此前代码只在所有者本机，TASK-013已补齐交付 |
| 双击网页空白、JSON/CORS错误 | 用上述启动命令，通过http://127.0.0.1:8767访问 |
| AI未配置或模型不可达 | 本地操作照常；需要AI时配置自己可达的接口 |
| PDF或包SHA错误 | 保留文件并核对下载/版本；不要修改登记指纹消除报错 |
| FLAVOGLYCOLAB_TEST_RESEARCH=1后研究测试失败 | 核对研究包是否已完整导入；显式研究模式不会跳过缺失 |

反馈请附操作系统、Python版本、git提交号、doctor输出和完整报错；不要附密钥。LAN常驻服务另见[lan-site.md](lan-site.md)，与各成员本地运行互不依赖。
