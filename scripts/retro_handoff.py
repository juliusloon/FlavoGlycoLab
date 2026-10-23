"""Validate an imported computation against this project's own public case contract.

No network, models, private sources, or paths outside this repository are needed.
The checksum detects corruption; it is not a signature or independent MCTS attestation.
"""
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

def digest_json(value):
    return hashlib.sha256(json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=True,allow_nan=False).encode()).hexdigest()

def exact_keys(obj, keys):
    if not isinstance(obj,dict) or set(obj) != set(keys.split()):
        raise ValueError('交接字段不符合协议。')

def validate_packet(packet, root=ROOT):
    exact_keys(packet, 'schema run route target selection witness literature observations quantitative_result teacher_approved independent_chemical_validation packet_sha256')
    if packet['schema'] != 'flavoretro.lab-handoff.v1':
        raise ValueError('不支持此交接版本。')
    if packet['observations'] != [] or packet['quantitative_result'] is not None or packet['teacher_approved'] is not False or packet['independent_chemical_validation'] is not False:
        raise ValueError('逆合成交接不得携带观测、数值结果或审核通过声明。')
    body={k:v for k,v in packet.items() if k!='packet_sha256'}
    if packet['packet_sha256'] != digest_json(body):
        raise ValueError('交接校验和不匹配。')
    contract=json.loads((root/'metadata/retrosynthesis.json').read_text(encoding='utf-8'))
    content=json.loads((root/'frontend/student/content/demo-content.json').read_text(encoding='utf-8'))
    sources={s['source_id']:s for s in content['sources']}
    if packet['target'] != contract['target']:
        raise ValueError('交接目标不是当前案例的精确异槲皮苷结构。')
    exact_keys(packet['run'],'id execution_source result_sha256 manifest_sha256')
    exact_keys(packet['route'],'id tree_sha256 steps closure')
    if not re.fullmatch(r'\d{8}T\d{6}-[a-f0-9]{32}',str(packet['run']['id'])) or packet['run']['execution_source'] != 'live_aizynthfinder_mcts':
        raise ValueError('需要真实搜索的运行索引。')
    for value in [packet['run']['result_sha256'],packet['run']['manifest_sha256'],packet['route']['id'],packet['route']['tree_sha256']]:
        if not isinstance(value,str) or not re.fullmatch(r'[a-f0-9]{64}',value):
            raise ValueError('运行指纹格式无效。')
    if type(packet['route']['steps']) is not int or not 1<=packet['route']['steps']<=10 or packet['route']['closure'] not in ['partial','surrogate']:
        raise ValueError('候选路线状态无效。')
    exact_keys(packet['selection'],'source_id route_id role source_reaction_id doi source_sha256')
    selected=packet['selection']; rule=contract['cases'].get(selected['source_id'])
    if not rule or selected != {k:rule[k] for k in selected}:
        raise ValueError('所选论文或计算来源不匹配本地案例。')
    exact_keys(packet['witness'],'product_smiles precursor_smiles')
    if packet['witness'] != {'product_smiles':rule['target_smiles'],'precursor_smiles':rule['precursor_smiles']}:
        raise ValueError('实际生成的转换与本地来源合同不一致。')
    if not isinstance(packet['literature'],list) or not 1<=len(packet['literature'])<=3:
        raise ValueError('文献角色列表无效。')
    seen=set()
    for item in packet['literature']:
        if not isinstance(item,dict): raise ValueError('文献角色无效。')
        sid=item.get('source_id'); source=sources.get(sid)
        if not source or sid in seen: raise ValueError('文献来源未知或重复。')
        seen.add(sid)
        if sid in contract['cases']:
            ref=contract['cases'][sid]
            expected={k:ref[k] for k in ['source_id','route_id','role','source_reaction_id','doi','source_sha256']}
            expected['mcts_action']=True
        else:
            expected={**contract['context'],'doi':source['doi'],'source_sha256':source['source_sha256']}
        if item != expected: raise ValueError('文献角色或源指纹不匹配。')
        if item['doi'] != source['doi'] or item['source_sha256'] != source['source_sha256']:
            raise ValueError('本地来源登记已变化。')
        original=root/source['source_path']
        if not original.is_file() or hashlib.sha256(original.read_bytes()).hexdigest()!=source['source_sha256']:
            raise ValueError('本地论文缺失或已变化。')
    if selected['source_id'] not in seen: raise ValueError('缺少主开发来源。')
    # Preserve the packet as an external computational claim. Local source matching
    # does not authenticate the upstream run or convert it into an observation.
    return {'packet':packet,'validation':'local_identity_source_and_checksum_match','upstream_run_independently_verified':False,'teacher_approved':False,'observations':[],'quantitative_result':None}
