const main = document.querySelector('#case-main');
const e = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const list = (items, className = '') => `<ul class="${className}">${items.map(item => `<li>${e(item)}</li>`).join('')}</ul>`;

try {
  const response = await fetch('./content/demo-content.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const content = await response.json();
  const page = content.case_page;
  if (!page) throw new Error('缺少 case_page 内容块');

  const sourceLabel = id => content.sources.find(source => source.source_id === id)?.label ?? id;
  const sourceBadge = id => `<span class="badge source">${e(sourceLabel(id))}</span>`;
  const reviewBadge = text => `<span class="badge review">${e(text)}</span>`;
  const section = (id, kicker, title, body) => `
    <section class="case-section" id="${e(id)}" aria-labelledby="${e(id)}-title">
      <p class="section-kicker">${e(kicker)}</p>
      <h2 id="${e(id)}-title">${e(title)}</h2>
      ${body}
    </section>`;

  const figure = `
    <figure class="case-figure">
      <img src="${e(page.figure.src)}" alt="${e(page.figure.alt)}" width="1800" height="1240" loading="eager">
      <figcaption>${e(page.figure.caption)}<br><span class="muted">图中数值均为原文报告，不是本次实验观测；R1/R2 图表展示待 Springer 授权。</span></figcaption>
    </figure>`;

  const standards = `
    <div class="standard-grid">
      ${page.standard_sentences.map(item => `
        <article class="standard-card">
          <p class="standard-id">${e(item.id)} · ${e(item.label)}</p>
          <p>${e(item.text)}</p>
        </article>`).join('')}
    </div>`;

  const target = `
    <div class="target-card">
      <div>
        <p class="target-name">${e(page.target.name)} <span>${e(page.target.english_name)}</span></p>
        <p class="target-formula">${e(page.target.formula)} · 相对分子质量 ${e(page.target.mass)}</p>
        <p>${e(page.target.definition)}</p>
      </div>
      <p class="note">${e(page.target.ms_note)} ${page.target.source_ids.map(sourceBadge).join(' ')}</p>
    </div>`;

  const molecules = `
    <div class="table-wrap">
      <table class="data-table molecule-table">
        <caption>五个必须分清的分子。目标分子行以浅绿标出；结构标识均来自公开数据库或文献定位，待教师审定。</caption>
        <thead><tr><th scope="col">分子</th><th scope="col">一句话辨别</th><th scope="col">与本案例关系</th><th scope="col">参考定位</th></tr></thead>
        <tbody>
          ${page.molecules.map(molecule => `
            <tr class="${molecule.is_target ? 'is-target' : ''}">
              <th scope="row">${e(molecule.name)}<span class="english">${e(molecule.english)}</span></th>
              <td>${e(molecule.distinction)}</td>
              <td>${e(molecule.relation)}</td>
              <td class="reference-cell">${e(molecule.reference)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="callout">${e(page.molecule_note)}</p>`;

  const routes = `
    <div class="route-grid">
      ${page.route_cards.map(card => `
        <article class="route-card route-${e(card.id.toLowerCase())}">
          <header>
            <h3>${e(card.name)}</h3>
            <div class="badge-row">${sourceBadge(card.source_id)}${reviewBadge('待教师审定')}</div>
          </header>
          <dl>
            <dt>反应方向</dt><dd>${e(card.direction)}</dd>
            <dt>催化体系</dt><dd>${e(card.system)}</dd>
            <dt>关键结果</dt><dd>${list(card.key_results)}<span class="report-note">原文报告 · 非本次观测 · 条件不可外推</span></dd>
            <dt>对照</dt><dd>${e(card.controls)}</dd>
            <dt>数据缺口</dt><dd>${e(card.gaps)}</dd>
            <dt>许可状态</dt><dd>${e(card.license)}</dd>
          </dl>
        </article>`).join('')}
    </div>`;

  const comparison = `
    <p class="callout">${e(page.comparison.note)}</p>
    <div class="table-wrap">
      <table class="data-table comparison-table">
        <caption>三路线横向对照（复用实际案例证据表第四部分；不可跨路线比较或换算）</caption>
        <thead><tr>${page.comparison.headers.map(header => `<th scope="col">${e(header)}</th>`).join('')}</tr></thead>
        <tbody>
          ${page.comparison.rows.map(row => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${e(cell)}</th>` : `<td>${e(cell)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  const evidenceRules = `<ol class="rule-list">${page.evidence_rules.map(rule => `<li>${e(rule)}</li>`).join('')}</ol>`;

  const ai = `
    <div class="two-column">
      <article class="plain-card"><h3>AI 教学助手（本机演示）</h3><p>${e(page.ai.tutor)}</p></article>
      <article class="plain-card"><h3>数据查询页</h3><p>${e(page.ai.data_service)}</p><a class="card-link" href="./data.html">打开数据查询 →</a></article>
    </div>`;

  const status = `
    <div class="two-column">
      <article class="plain-card"><h3>本周已有</h3>${list(page.status.existing)}</article>
      <article class="plain-card pending"><h3>拟建／待确认</h3>${list(page.status.pending)}</article>
    </div>
    <p class="muted">状态截至 ${e(page.status.as_of)}。已有与拟建分开写，不把未实现功能表现成已运行。</p>`;

  const references = `
    <ol class="reference-list">${page.references.map(reference => `<li>${e(reference.replace(/^\[\d+\]\s*/, ''))}</li>`).join('')}</ol>
    <p class="note">${e(page.reference_note)}</p>`;

  main.innerHTML = `
    <header class="case-hero">
      <p class="hero-kicker">案例页 · 文案 v1 · 2026-10-22</p>
      <h1>${e(page.title)}</h1>
      <p class="hero-lead">${e(page.lead)}</p>
      <div class="badge-row">${reviewBadge('全部内容待教师审定')}${reviewBadge('教学原型')}<span class="badge neutral">S1—S6 标准句</span></div>
    </header>
    <p class="disclaimer" role="note">${e(page.disclaimer)}</p>
    ${section('figure', '先看全图', '三条路线与一个共同产物', figure)}
    ${section('standards', '统一口径', '案例页与视频共用的标准句', standards)}
    ${section('target', '目标分子', '异槲皮苷与它的近缘分子', target + molecules)}
    ${section('routes', '三条路线', '同一产物，三种完全不同的反应方向', routes)}
    ${section('comparison', '横向对照', '把差异放在同一张表里，但不跨路线换算', comparison)}
    ${section('evidence', '证据说明', '四类标注与无数据原则', evidenceRules)}
    ${section('ai', 'AI 与数据分工', '助手不制造观测，数据服务只覆盖已核对范围', ai)}
    ${section('status', '已有与拟建', '截至 2026-10-22 的实际状态', status)}
    ${section('references', '参考文献', 'GB/T 7714', references)}
    <details class="source-meta">
      <summary>来源与版本</summary>
      <p>文案来源：ZYT《case_page_copy_v1_20261022.md》，SHA-256 <code>${e(page.source_handoff.sha256)}</code>。图1 来源：${e(page.figure.src)}（ZYT 路线图文字稿 v1，L 制图）。</p>
      <p>本页为静态 UI 投影，不写入学习记录、不调用 AI、不读取私有数据。</p>
    </details>`;
} catch (error) {
  main.innerHTML = `<div class="case-error" role="alert"><h1>案例页暂时无法读取</h1><p>${e(error.message)}</p><p>请通过本地开发服务打开本页，或返回 <a href="./index.html">虚拟探究实验</a>。</p></div>`;
}
