import { escapeHTML as e, icon } from '../ui.js';
import {isAdminPass} from '../learning-state.js';

// These tools organize student reasoning. They never create observations or grades.
const categories = [
  ['structure', '结构命中'],
  ['paper', '文献报告'],
  ['sample', '样品测量'],
  ['review', '教师审定'],
];
const evidenceExamples = [
  {
    id: 'structure',
    title: '数据库里的相同产物',
    description: '一条反应记录的产物结构与异槲皮苷一致。',
    reason: '结构一致建立候选关联；还需查反应方向、体系和原研究。',
  },
  {
    id: 'paper',
    title: '论文中的制备实验',
    description: '方法与图表记载了芦丁转化为异槲皮苷的研究。',
    reason: '原文支持特定条件下的报告，当前学生样品仍需独立测量。',
  },
  {
    id: 'sample',
    title: '能对应到样品的信号',
    description: '某次实验的原始信号、样品编号与采样记录相互对应。',
    reason: '这类材料建立样品与测量的关联；定量还需标曲、稀释等依据。',
  },
  {
    id: 'review',
    title: '有责任人的审定记录',
    description: '具名教师在带日期与版本的记录中确认了某案例的教学范围。',
    reason: '可追溯的人工审定才是教学准入依据；机器检查不能代签。',
  },
];
const hypothesisFields = [
  { key: 'change', label: '改变什么', prefix: '改变', placeholder: '只选一个准备比较的因素' },
  { key: 'keep', label: '保持什么', prefix: '保持', placeholder: '列出需要固定的条件和对照' },
  { key: 'observe', label: '观察什么', prefix: '观察', placeholder: '需要取得哪种可测证据' },
  { key: 'refute', label: '如何证伪', prefix: '证伪', placeholder: '什么结果会让你放弃假设' },
];
const chainNodes = [
  {
    id: 'operation', title: '操作记录', status: '可提供流程记录', available: true,
    detail: '演练能显示操作顺序。只有实际执行后才会留下相应操作记录；流程记录没有测量含义，不能证明产物已经生成。',
    next: '先问：我掌握的是操作记录，还是样品信号？',
  },
  {
    id: 'measurement', title: '样品测量', status: '需补齐', available: false,
    detail: '当前样品只有计划标签，尚未关联真实测量。需要样品编号、原始信号、鉴定依据和可追溯的取样记录。',
    next: '缺少测量时，保留“未知”，不能填零。',
  },
  {
    id: 'calibration', title: '标曲与稀释', status: '需补齐', available: false,
    detail: '从信号到浓度，需要可用的标准曲线、有效范围、单位及样品稀释链。论文中有一张图，也不等于这些材料已经齐备。',
    next: '即使出现信号，也要先核定量依据是否适用于该样品。',
  },
  {
    id: 'conclusion', title: '产率结论', status: '暂不能得出', available: false,
    detail: '产率需要产物定量、投料及计量基准；还应核对副产物、采样与物料损失。当前证据不足，不能从文献报告或动画完成情况推算本次样品产率。',
    next: '证据不足时应保留未知，并提出补证方案。',
  },
];

function evidenceSorter() {
  return `<section class="inquiry-tool evidence-sorter" data-inquiry-tool="17" aria-labelledby="sorter-title">
    <div class="inquiry-tool-heading"><h2 id="sorter-title">把证据放到合适的位置</h2><span class="inquiry-tool-progress" data-sort-progress>0 / 4 已辨清</span></div>
    <p class="inquiry-tool-note">以下均为分类练习片段，不表示本项目已取得样品测量或教师批准。</p>
    <div class="evidence-sort-rows">${evidenceExamples.map((example, index) => `<div class="evidence-sort-row" data-example="${example.id}">
      <span class="inquiry-tool-number">${index + 1}</span>
      <div class="evidence-sort-description"><strong>${example.title}</strong><p>${example.description}</p></div>
      <label class="evidence-sort-select"><span class="sr-only">为“${example.title}”选择证据类型</span><select data-evidence-category aria-describedby="sort-feedback-${example.id}"><option value="">选择类型</option>${categories.map(([id, label]) => `<option value="${id}">${label}</option>`).join('')}</select></label>
      <p class="evidence-sort-feedback" id="sort-feedback-${example.id}" data-sort-feedback role="status" hidden></p>
    </div>`).join('')}</div>
  </section>`;
}

function readHypothesis(note = '') {
  const values = {};
  for (const field of hypothesisFields) {
    const expression = new RegExp(`(?:^|[；\\n])${field.prefix}：([^；\\n]*)`);
    values[field.key] = note.match(expression)?.[1]?.trim() ?? '';
  }
  return values;
}

function hypothesisBuilder(entry = {}) {
  const values = readHypothesis(entry.note);
  return `<section class="inquiry-tool hypothesis-builder" data-inquiry-tool="09" aria-labelledby="hypothesis-builder-title">
    <div class="inquiry-tool-heading"><h2 id="hypothesis-builder-title">搭建一个能被检验的假设</h2><span class="inquiry-tool-progress">由你决定比较什么</span></div>
    <div class="hypothesis-builder-grid">${hypothesisFields.map((field, index) => `<label class="hypothesis-builder-field"><span><b>${index + 1}</b>${field.label}</span><input type="text" data-hypothesis-field="${field.key}" value="${e(values[field.key])}" maxlength="180" required placeholder="${field.placeholder}"></label>`).join('')}</div>
    <div class="inquiry-tool-actions"><button type="button" class="button secondary" data-build-hypothesis>带入我的假设 ${icon('arrow')}</button><p>带入后仍可改写，再提交自查。</p></div>
    <p class="inquiry-tool-result" data-hypothesis-feedback role="status" hidden></p>
  </section>`;
}

function evidenceChain() {
  return `<section class="inquiry-tool evidence-chain-tool" data-inquiry-tool="20" aria-labelledby="evidence-chain-title">
    <div class="inquiry-tool-heading"><h2 id="evidence-chain-title">从操作到结论，还差什么？</h2><span class="inquiry-tool-progress">点选节点检查依据</span></div>
    <div class="evidence-chain-nodes" role="group" aria-label="检查证据链">${chainNodes.map((node, index) => `<button type="button" class="evidence-chain-node ${index === 0 ? 'active' : ''}" data-chain-node="${node.id}" aria-pressed="${index === 0}" aria-controls="evidence-chain-detail"><span class="chain-node-number">${index + 1}</span><strong>${node.title}</strong><small class="${node.available ? 'available' : 'needed'}">${node.status}</small>${index < chainNodes.length - 1 ? icon('arrow', 'chain-connector') : ''}</button>`).join('')}</div>
    <div class="evidence-chain-detail" id="evidence-chain-detail" aria-live="polite"><p data-chain-explanation>${chainNodes[0].detail}</p><strong data-chain-next>${chainNodes[0].next}</strong></div>
    <div class="chain-decision"><p>有人建议“根据文献报告直接给出本次样品产率”。你的决定是：</p><div class="chain-decision-options" role="group" aria-label="对超范围建议作出决定"><button type="button" data-chain-decision="reject" aria-pressed="false">拒绝推断，先补证据</button><button type="button" data-chain-decision="estimate" aria-pressed="false">按文献报告估一个值</button></div><p class="inquiry-tool-result" data-chain-feedback role="status" hidden></p></div>
  </section>`;
}

export function inquiryTool(taskId, entry = {}) {
  if (taskId === '17') return evidenceSorter();
  if (taskId === '09') return hypothesisBuilder(entry);
  if (taskId === '20') return evidenceChain();
  return '';
}

export function bindInquiryTools(root, { onDraftNote } = {}) {
  if (!root?.querySelectorAll) return;
  root.querySelectorAll('[data-inquiry-tool]').forEach(tool => {
    // A root can be rebound after another region changes without duplicating handlers.
    if (tool.dataset.inquiryBound === 'true') return;
    tool.dataset.inquiryBound = 'true';
    if (tool.dataset.inquiryTool === '17') {
      tool.querySelectorAll('[data-evidence-category]').forEach(select => {
        select.addEventListener('change', () => {
          const row = select.closest('[data-example]');
          const example = evidenceExamples.find(item => item.id === row.dataset.example);
          const feedback = row.querySelector('[data-sort-feedback]');
          if (!select.value) {
            delete row.dataset.correct;
            feedback.hidden = true;
            feedback.textContent = '';
          } else {
            const correct = select.value === example.id;
            row.dataset.correct = String(correct);
            feedback.hidden = false;
            feedback.textContent = `${correct ? '分类符合依据。' : '再检查证据的来源。'}${example.reason}`;
          }
          const count = tool.querySelectorAll('[data-correct="true"]').length;
          tool.querySelector('[data-sort-progress]').textContent = `${count} / 4 已辨清`;
        });
      });
    }
    if (tool.dataset.inquiryTool === '09') {
      const result = tool.querySelector('[data-hypothesis-feedback]');
      tool.querySelectorAll('[data-hypothesis-field]').forEach(input => {
        input.addEventListener('input', () => {
          input.setCustomValidity('');
          result.hidden = true;
        });
      });
      tool.querySelector('[data-build-hypothesis]').addEventListener('click', () => {
        const fields = hypothesisFields.map(field => ({
          ...field,
          input: tool.querySelector(`[data-hypothesis-field="${field.key}"]`),
        }));
        if(fields.some(field=>isAdminPass(field.input.value))){
          onDraftNote?.('admin7');result.hidden=false;result.textContent='通行词已带入回答，可提交放行。';return;
        }
        for (const field of fields) {
          field.input.setCustomValidity(field.input.value.trim() ? '' : `请写下“${field.label}”。`);
          if (!field.input.reportValidity()) return;
        }
        const note = fields.map(field => `${field.prefix}：${field.input.value.trim()}`).join('；');
        if (typeof onDraftNote === 'function') {
          onDraftNote(note);
          result.hidden = false;
          result.textContent = '假设已带入回答，核对表述后提交自查。';
        } else {
          result.hidden = false;
          result.textContent = '请将四项判断写入下方回答，再提交自查。';
        }
      });
    }
    if (tool.dataset.inquiryTool === '20') {
      tool.querySelectorAll('[data-chain-node]').forEach(button => {
        button.addEventListener('click', () => {
          const node = chainNodes.find(item => item.id === button.dataset.chainNode);
          tool.querySelectorAll('[data-chain-node]').forEach(item => {
            const selected = item === button;
            item.classList.toggle('active', selected);
            item.setAttribute('aria-pressed', String(selected));
          });
          tool.querySelector('[data-chain-explanation]').textContent = node.detail;
          tool.querySelector('[data-chain-next]').textContent = node.next;
        });
      });
      tool.querySelectorAll('[data-chain-decision]').forEach(button => {
        button.addEventListener('click', () => {
          const rejected = button.dataset.chainDecision === 'reject';
          tool.querySelectorAll('[data-chain-decision]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
          const result = tool.querySelector('[data-chain-feedback]');
          result.hidden = false;
          result.dataset.correct = String(rejected);
          result.textContent = rejected
            ? '拒绝推断符合当前证据范围。在下方说明你准备补齐哪一环，再提交自己的判断。'
            : '文献报告不等于本次样品测量。请重新检查样品测量与定量依据，再作决定。';
        });
      });
    }
  });
}
