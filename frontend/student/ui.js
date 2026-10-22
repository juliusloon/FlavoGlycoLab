export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

const paths = {
  home: '<path d="m3 10 9-7 9 7v11h-6v-8H9v8H3Z"/>',
  case: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h2"/>',
  steps: '<circle cx="4" cy="6" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="18" r="1.5"/><path d="M10 6h10M10 12h10M10 18h10"/>',
  data: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  ai: '<path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-6 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>',
  about: '<path d="M5 3h9l5 5v13H5ZM14 3v6h5M9 13h6M9 17h6"/>',
  arrow: '<path d="m9 5 7 7-7 7"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
};

export function icon(name, extraClass = '') {
  return `<svg class="icon ${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.about}</svg>`;
}

export function pageHeading(title, description) {
  return `<div class="page-heading"><h1>${escapeHTML(title)}</h1><p>${escapeHTML(description)}</p></div>`;
}

export function sourceDetails(source) {
  return `<details class="source-details"><summary>来源与交接状态</summary><dl class="source-meta">
    <div><dt>来源标识</dt><dd>${escapeHTML(source.source_id)}</dd></div>
    <div><dt>文献</dt><dd><a href="https://doi.org/${escapeHTML(source.doi)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.label)} · DOI ${escapeHTML(source.doi)}（新窗口）</a></dd></div>
    <div><dt>原文定位</dt><dd>${escapeHTML(source.source_locator ?? '页码／图表号待逐项摘录')}</dd></div>
    <div><dt>原件SHA-256</dt><dd class="hash">${escapeHTML(source.source_sha256)}</dd></div>
    <div><dt>核对状态</dt><dd>${escapeHTML(source.quality_status)}</dd></div>
    <div><dt>摘录交接</dt><dd>${escapeHTML(source.handoff_status ?? '待交接')}</dd></div>
    <div><dt>许可状态</dt><dd>${escapeHTML(source.license_status)}</dd></div>
    <div><dt>审核状态</dt><dd>待教师审定；原件指纹不代表科学核验通过</dd></div>
  </dl></details>`;
}
