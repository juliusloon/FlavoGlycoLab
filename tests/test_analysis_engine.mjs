import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { extractConditions, comparePlanToRecord, CALC_WHITELIST, compute, GAP_OPTIONS } from '../frontend/student/analysis-engine.js';

const content = JSON.parse(fs.readFileSync(new URL('../frontend/student/content/demo-content.json', import.meta.url), 'utf8'));
const byId = Object.fromEntries(content.data_query.records.map(r => [r.id, r]));

test('extractConditions parses temperature, pH, substrate and duration; missing fields stay null', () => {
  const full = extractConditions('pH 6.5；55 °C；芦丁 20 mM；反应 240 min；其余按原文。');
  assert.deepEqual(full.parsed, { temperature_c: 55, ph: 6.5, substrate_mm: 20, duration_min: 240 });
  const hours = extractConditions('35 °C；pH 7.5；16 h 补料批次。');
  assert.equal(hours.parsed.duration_min, 960);
  const none = extractConditions('按原文方法段整理；无定量条件。');
  assert.deepEqual(none.parsed, { temperature_c: null, ph: null, substrate_mm: null, duration_min: null });
  assert.equal(none.raw, '按原文方法段整理；无定量条件。');
});

test('comparePlanToRecord resolves all four statuses and summaries', () => {
  const record = { conditions: 'pH 7.0；30 °C；底物 1.5 mM；60 min。' };
  const allMatch = comparePlanToRecord({ temperature: '30', ph: '7', concentration: '1.5', duration: '60' }, record);
  assert.ok(allMatch.fields.every(f => f.status === '✔'));
  assert.equal(allMatch.summary, '条件组合一致，可直接引用为文献参照');
  const differ = comparePlanToRecord({ temperature: '35', ph: '7', concentration: '1.5', duration: '60' }, record);
  assert.equal(differ.fields[0].status, '△');
  assert.equal(differ.fields[0].planValue, 35);
  assert.equal(differ.fields[0].refValue, 30);
  assert.equal(differ.summary, '条件不同，只作参照');
  const unknown = comparePlanToRecord({ temperature: '30', ph: '', concentration: '1.5', duration: '60' }, record);
  assert.equal(unknown.fields[1].status, '—');
  assert.equal(unknown.summary, '条件组合一致，可直接引用为文献参照');
  const sparse = comparePlanToRecord({ temperature: '30', ph: '7', concentration: '1.5', duration: '60' }, { conditions: '终点与完整配方须回原文匹配。' });
  assert.ok(sparse.fields.every(f => f.status === '？'));
  assert.equal(sparse.summary, '条件完整性不足，只作方向参照');
});

test('compute evaluates all eight whitelist calculations from reported record values', () => {
  const expected = {
    'CALC-R2-01': 91.25, 'CALC-R2-02': 99.35,
    'CALC-R1-01': 33.6, 'CALC-R1-02': 1.6, 'CALC-R1-03': 0.22, 'CALC-R1-04': 0.08,
    'CALC-R3-01': 15.8, 'CALC-R3-02': 76.7,
  };
  for (const item of CALC_WHITELIST) {
    const result = compute(item.id, byId);
    assert.ok(Math.abs(result.result - expected[item.id]) <= 0.05, `${item.id}: ${result.result}`);
    assert.equal(result.unit, item.unit);
    assert.deepEqual(result.labels, ['原文报告值 · 非本次观测', '计算值 · 由文献报告值得出', '待教师审定']);
    assert.ok(result.substituted.length > 0);
  }
  assert.ok(compute('CALC-R3-02', byId).note.includes('PubChem CID 5280804'));
  assert.throws(() => compute('CALC-X-99', byId), /未知计算项/);
});

test('GAP_OPTIONS stays the fixed five-item gap list', () => {
  assert.deepEqual(GAP_OPTIONS, ['缺标准曲线/校准链', '缺原始峰表或图谱积分', '缺重复测量值', '缺本方案实测数据', '其他']);
});

test('method card values supply reaction conditions without donor or quench contamination',()=>{
  const r1=comparePlanToRecord({temperature:'35',ph:'7.5',concentration:'1.25',duration:'30'},byId['DQ-R1-01']);
  assert.ok(r1.fields.every(f=>f.status==='✔'));
  const r2=comparePlanToRecord({temperature:'55',ph:'6.5',concentration:'20',duration:'60'},byId['DQ-R2-01']);
  assert.deepEqual(r2.fields.map(f=>f.refValue),[55,6.5,20,null]);
  const donor=comparePlanToRecord({concentration:'1.25',duration:'30'},byId['DQ-R1-02']);
  assert.equal(donor.fields.find(f=>f.key==='concentration').refValue,null);
  assert.equal(donor.fields.find(f=>f.key==='duration').refValue,null);
  assert.deepEqual(extractConditions('100 °C 加热 30 min 终止；UDP 0.25 mM').parsed,{temperature_c:null,ph:null,substrate_mm:null,duration_min:null});
});
