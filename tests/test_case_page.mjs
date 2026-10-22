import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), 'utf8');
const content = JSON.parse(read('frontend/student/content/demo-content.json'));
const page = content.case_page;
const html = read('frontend/student/case.html');
const script = read('frontend/student/case-page.js');
const css = read('frontend/student/case-page.css');
const svg = read('frontend/student/assets/figures/route_map_v1.svg');

const standard = {
  S1: '异槲皮苷（isoquercitrin）是槲皮素的 3-O-β-D-葡萄糖苷，分子式 C21H20O12，相对分子质量 464.4。',
  S2: '三条路线指向同一产物，但反应方向不同：酶促糖基化是“加糖”，选择性水解是“剪糖”，工程菌路线是胞内转化。',
  S3: '本页所有产率、转化率均为各自文献体系内的报道值，不可跨路线比较，也不可跨路线换算。',
  S4: '没有实验数据覆盖的条件，页面显示“无对应实验数据”，不生成数值。',
  S5: 'AI 教学助手不制造实验观测，也不独立决定学生成绩。',
  S6: '本页所示原型功能状态以 2026-10-23 步骤状态表（L 交付）为准，分“可操作／仅占位／受阻”三种。',
};

test('case page projects the six handoff sentences verbatim', () => {
  assert.equal(page.standard_sentences.length, 6);
  for (const item of page.standard_sentences) {
    assert.equal(item.text, standard[item.id], item.id);
  }
  assert.equal(page.review_status, 'pending_teacher_review');
  assert.equal(page.figure.review_status, 'pending_teacher_review');
  assert.match(page.source_handoff.sha256, /^[0-9a-f]{64}$/);
});

test('five molecular identities and three routes stay separate', () => {
  assert.equal(page.molecules.length, 5);
  assert.deepEqual(page.molecules.map(item => item.name), ['异槲皮苷', '芦丁', '槲皮素', 'EMIQ', '位点异构糖苷']);
  assert.equal(page.route_cards.length, 3);
  assert.deepEqual(page.route_cards.map(card => card.id), ['R1', 'R2', 'R3']);
  for (const card of page.route_cards) {
    assert.ok(card.key_results.length >= 1, card.id);
    assert.match(card.key_results.join(' '), /Pei 等，2019|Zhang 等，2015|Niu 等，2024/, card.id);
  }
});

test('all reported numbers are labelled as literature reports, not observations', () => {
  assert.match(page.disclaimer, /不生成实验观测/);
  assert.match(page.disclaimer, /不排名路线/);
  assert.match(script, /原文报告 · 非本次观测 · 条件不可外推/);
  assert.match(script, /图中数值均为原文报告，不是本次实验观测/);
  assert.match(svg, /所有数值为原文报告，不是本次实验观测/);
  assert.match(svg, /教学设计示意 · 待教师审定/);
});

test('comparison table keeps ten evidence dimensions and five references', () => {
  assert.equal(page.comparison.rows.length, 10);
  assert.deepEqual(page.comparison.headers, ['维度', 'Pei 2019（酶促糖基化）', 'Zhang 2015（选择性水解）', 'Niu 2024（工程菌转化）']);
  assert.equal(page.references.length, 5);
  for (let i = 1; i <= 5; i++) assert.match(page.references[i - 1], new RegExp(`^\\[${i}\\]`));
  assert.match(page.reference_note, /尚未进入本仓库三篇论文源登记/);
  assert.match(page.reference_note, /不加载或再分发原文/);
});

test('AI and evidence boundaries are explicit', () => {
  assert.match(page.ai.tutor, /不制造实验观测/);
  assert.match(page.ai.tutor, /不独立决定最终成绩/);
  assert.match(page.ai.data_service, /仅在已核对且获准使用的数据范围内/);
  assert.equal(page.evidence_rules.length, 4);
  assert.match(page.evidence_rules.join(' '), /未测条件不生成数值/);
});

test('AI copy reflects the actual local Qwen demo without claiming a formal platform', () => {
  assert.match(page.ai.tutor, /本机演示/);
  assert.match(page.ai.tutor, /Qwen/);
  assert.match(page.ai.tutor, /未接入正式平台/);
  assert.doesNotMatch(page.ai.tutor, /未连接实时大模型|交互示例/);
  assert.match(script, /打开数据查询/);
});

test('case page has no external runtime dependency or client AI call', () => {
  for (const text of [html, script, css]) {
    assert.doesNotMatch(text, /<script[^>]+https?:|@import\s+url\(\s*['"]?https?:|fetch\(\s*['"]https?:/i);
  }
  assert.doesNotMatch(script, /api\/tutor/);
  assert.match(html, /src="\.\/case-page\.js"/);
  assert.match(html, /href="\.\/case-page\.css"/);
  assert.match(script, /fetch\('\.\/content\/demo-content\.json'\)/);
});

test('the figure is a same-origin SVG with verified identifiers', () => {
  assert.match(svg, /^(?:<\?xml[^>]*>\s*)?<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  for (const id of ['5280343', '5280804', '5280805', '8629', '439730']) assert.match(svg, new RegExp(id), id);
  assert.match(svg, /AtUGT78D2/);
  assert.match(svg, /α-L-鼠李糖苷酶/);
  assert.match(svg, /B\. subtilis 168/);
  assert.match(svg, /CC BY 4\.0/);
  assert.match(svg, /Springer/);
});
