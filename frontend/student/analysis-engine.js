// TASK-026 结果分析台 · 纯函数计算引擎（无 DOM、无网络）。
// 所有数值均来自 data_query 记录的原文报告值或其白名单算式组合；
// 不提供任何自由输入入口，学生无法借此编造未观测数据。

const num = text => {
  const m = String(text ?? '').match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
};
const fmt = n => (n === null || n === undefined || !Number.isFinite(n) ? '—' : String(Number(n.toFixed(4))));

/** 仅提取明确的反应条件；未知不借用另一条记录或供体/终止条件。 */
export function extractConditions(conditionsText) {
  const raw = String(conditionsText ?? '');
  const reaction=raw.split(/[；;。]/).filter(part=>!/终止|灭活|淬灭|须回|不套|待核|未给/.test(part)).join('；');
  const temp = reaction.match(/(\d+(?:\.\d+)?)\s*°?C\b/i);
  const ph = reaction.match(/pH\s*(\d+(?:\.\d+)?)/i);
  const conc = reaction.match(/(?:槲皮素|芦丁|底物)\s*(\d+(?:\.\d+)?)\s*mM\b/i);
  const dur = reaction.match(/(\d+(?:\.\d+)?)\s*(h|hr|min)\b/i);
  const parsed = {
    temperature_c: temp ? Number(temp[1]) : null,
    ph: ph ? Number(ph[1]) : null,
    substrate_mm: conc ? Number(conc[1]) : null,
    duration_min: dur ? Number(dur[1]) * (/^min$/i.test(dur[2]) ? 1 : 60) : null,
  };
  return { parsed, raw };
}

const PLAN_FIELDS = [
  ['temperature', '温度（°C）'],
  ['ph', 'pH'],
  ['concentration', '底物浓度（mM）'],
  ['duration', '时长（min）'],
];
const REF_KEYS = { temperature: 'temperature_c', ph: 'ph', concentration: 'substrate_mm', duration: 'duration_min' };

/**
 * 学生方案条件 × 单条文献记录 的四态对照。
 * ✔ 一致 / △ 不同（给出两边值）/ ？ 原文未给 / — 不适用（plan 字段为空或非数）。
 */
export function comparePlanToRecord(plan, record) {
  // Method cards keep the actual recipe in value; result values are never recipes.
  const text=record?.category==='方法条件'?`${record.value??''}；${record.conditions??''}`:record?.conditions??'';
  const { parsed } = extractConditions(text);
  const fields = PLAN_FIELDS.map(([key, label]) => {
    const planRaw = String(plan?.[key] ?? '').trim();
    const planValue = planRaw === '' ? null : Number(planRaw);
    if (planValue === null || Number.isNaN(planValue)) return { key, label, status: '—', planValue: planRaw || null, refValue: null };
    const refValue = parsed[REF_KEYS[key]];
    if (refValue === null) return { key, label, status: '？', planValue, refValue: null };
    return { key, label, status: planValue === refValue ? '✔' : '△', planValue, refValue };
  });
  let summary = '条件组合一致，可直接引用为文献参照';
  if (fields.some(f => f.status === '△')) summary = '条件不同，只作参照';
  else if (fields.some(f => f.status === '？')) summary = '条件完整性不足，只作方向参照';
  else if (fields.some(f => f.status === '—')) summary = '条件组合一致，可直接引用为文献参照';
  return { fields, summary };
}

/**
 * 白名单计算表。inputs 只接受记录指针（recordId + 取数序位 pick）或公开常量（constant），
 * 全部在代码内完成；UI 仅提供下拉选择，不接受自定义数值。
 */
export const CALC_WHITELIST = [
  { id: 'CALC-R2-01', route: 'R2', title: '60 min 摩尔收率（18.25 ÷ 20）',
    inputs: [{ recordId: 'DQ-R2-02', role: '60 min 产物浓度', pick: 0 }, { recordId: 'DQ-R2-01', role: '底物浓度 20 mM', pick: 0 }],
    op: 'ratio', expression: 'DQ-R2-02 ÷ DQ-R2-01 底物浓度 = 91.25%', unit: '%（摩尔收率 · 60 min）',
    note: '底物 20 mM 取自 DQ-R2-01 条件；保留等体积与 1∶1 前提（原文边界）。' },
  { id: 'CALC-R2-02', route: 'R2', title: '240 min 摩尔收率（19.87 ÷ 20）',
    inputs: [{ recordId: 'DQ-R2-03', role: '240 min 产物浓度', pick: 0 }, { recordId: 'DQ-R2-01', role: '底物浓度 20 mM', pick: 0 }],
    op: 'ratio', expression: 'DQ-R2-03 ÷ DQ-R2-01 = 99.35%', unit: '%（摩尔收率 · 240 min）',
    note: '同上，等体积与 1∶1 前提须保留；不补画 90—240 min 曲线。' },
  { id: 'CALC-R1-01', route: 'R1', title: '双酶再生供体的增益（98.4 − 64.8）',
    inputs: [{ recordId: 'DQ-R1-03', role: '双酶同供体转化率', pick: 0 }, { recordId: 'DQ-R1-02', role: '仅 UGT＋UDP-Glc 转化率', pick: 0 }],
    op: 'diff', expression: 'DQ-R1-03 − DQ-R1-02 = 33.6 百分点', unit: '百分点（conversion 差）',
    note: '两组终点与完整配方须回原文 Table 1 匹配，不套 30 min。' },
  { id: 'CALC-R1-02', route: 'R1', title: '双酶加 UDP 的增益（98.4 − 96.8）',
    inputs: [{ recordId: 'DQ-R1-03', role: '双酶同供体转化率', pick: 0 }, { recordId: 'DQ-R1-04', role: '双酶＋0.25 mM UDP 转化率', pick: 0 }],
    op: 'diff', expression: 'DQ-R1-03 − DQ-R1-04 = 1.6 百分点', unit: '百分点（conversion 差）',
    note: '不同供体组合不可简单相加或换算，保留原文组别。' },
  { id: 'CALC-R1-03', route: 'R1', title: 'GmSUS 60→120 mU/mL 的浓度增量（0.45 − 0.23）',
    inputs: [{ recordId: 'DQ-R1-06', role: '120 mU/mL 目标物浓度', pick: 0 }, { recordId: 'DQ-R1-05', role: '60 mU/mL 目标物浓度', pick: 0 }],
    op: 'diff', expression: 'DQ-R1-06 − DQ-R1-05 = 0.22 mM', unit: 'mM（目标物浓度差）',
    note: '原文报告浓度；无重复值与误差，不计算显著性。' },
  { id: 'CALC-R1-04', route: 'R1', title: 'GmSUS 120→240 mU/mL 的浓度增量（0.53 − 0.45）',
    inputs: [{ recordId: 'DQ-R1-07', role: '240 mU/mL 目标物浓度', pick: 0 }, { recordId: 'DQ-R1-06', role: '120 mU/mL 目标物浓度', pick: 0 }],
    op: 'diff', expression: 'DQ-R1-07 − DQ-R1-06 = 0.08 mM', unit: 'mM（目标物浓度差）',
    note: '同上；酶量梯度其余条件按原文标准体系。' },
  { id: 'CALC-R3-01', route: 'R3', title: '摇瓶优化倍数（5.83 ÷ 0.37）',
    inputs: [{ recordId: 'DQ-R3-04', role: 'BS400G 摇瓶产物浓度', pick: 0 }, { recordId: 'DQ-R3-01', role: 'BSCG 起始菌株产物浓度', pick: 0 }],
    op: 'ratio-fold', expression: 'DQ-R3-04 ÷ DQ-R3-01 ≈ 15.8 倍', unit: '倍（产物浓度比）',
    note: '分母取 DQ-R3-01 的 BSCG 值 0.37 g/L；逐级比较不宣称统计显著。' },
  { id: 'CALC-R3-02', route: 'R3', title: '罐体产物摩尔浓度（35.6 g/L ÷ 464.38 g/mol）',
    inputs: [{ recordId: 'DQ-R3-06', role: '罐体产物浓度（第二报告值）', pick: 1 }, { constant: 464.38, role: '异槲皮苷分子量 MW' }],
    op: 'mw', expression: 'DQ-R3-06 的 35.6 g/L ÷ 464.38 g/mol ≈ 76.7 mmol/L', unit: 'mmol/L',
    note: 'MW 来源 PubChem CID 5280804（异槲皮苷）；yield 分母须先核对，不用 35.6 g/L 预测学生方案。' },
];

const LABELS = ['原文报告值 · 非本次观测', '计算值 · 由文献报告值得出', '待教师审定'];

function readValue(input, recordsById) {
  if (typeof input.constant === 'number') return input.constant;
  const record = recordsById?.[input.recordId];
  const numbers = String(record?.value ?? '').match(/-?\d+(?:\.\d+)?/g) ?? [];
  const picked = numbers[Math.min(input.pick ?? 0, Math.max(numbers.length - 1, 0))];
  return picked === undefined ? null : Number(picked);
}

/** 执行白名单计算；缺失记录或数值时返回 result:null，绝不编造。 */
export function compute(whitelistId, recordsById) {
  const item = CALC_WHITELIST.find(x => x.id === whitelistId);
  if (!item) throw Error(`未知计算项：${whitelistId}`);
  const [a, b] = item.inputs.map(input => readValue(input, recordsById));
  let i = 0;
  const substituted = item.op === 'mw'
    ? `${fmt(a)} g/L ÷ ${fmt(b)} g/mol × 1000`
    : item.expression.replace(/DQ-R[123]-\d{2}/g, () => fmt(i++ === 0 ? a : b));
  let result = null;
  if (a !== null && b !== null) {
    if (item.op === 'ratio') result = a / b * 100;
    if (item.op === 'ratio-fold') result = a / b;
    if (item.op === 'diff') result = a - b;
    if (item.op === 'mw') result = a / b * 1000;
    result = Number(result.toFixed(4));
  }
  return { id: item.id, title: item.title, expression: item.expression, substituted, result, unit: item.unit, note: item.note, labels: [...LABELS] };
}

/** 缺口清单（固定选项，不接受自由新增之外的数值内容）。 */
export const GAP_OPTIONS = ['缺标准曲线/校准链', '缺原始峰表或图谱积分', '缺重复测量值', '缺本方案实测数据', '其他'];
