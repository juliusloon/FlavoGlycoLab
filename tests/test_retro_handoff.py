"""Engineering fixtures, not real search runs or experimental evidence."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('retro_contract',ROOT/'scripts/retro_handoff.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
spec=importlib.util.spec_from_file_location('retro_server',ROOT/'scripts/serve_lab.py')
server_module=importlib.util.module_from_spec(spec);spec.loader.exec_module(server_module)

def fixture(sid='Pei2019'):
    c=json.loads((ROOT/'metadata/retrosynthesis.json').read_text())
    rule=c['cases'][sid]
    selection={k:rule[k] for k in ['source_id','route_id','role','source_reaction_id','doi','source_sha256']}
    sources=json.loads((ROOT/'frontend/student/content/demo-content.json').read_text())['sources']
    literature=[{**{k:r[k] for k in selection},'mcts_action':True} for r in c['cases'].values()]
    s=next(s for s in sources if s['source_id']=='Niu2024')
    literature.append({**c['context'],'doi':s['doi'],'source_sha256':s['source_sha256']})
    p=dict(schema='flavoretro.lab-handoff.v1',run=dict(id='20000101T000000-'+'0'*32,execution_source='live_aizynthfinder_mcts',result_sha256='0'*64,manifest_sha256='0'*64),route=dict(id='0'*64,tree_sha256='0'*64,steps=1,closure='partial'),target=c['target'],selection=selection,witness=dict(product_smiles=rule['target_smiles'],precursor_smiles=rule['precursor_smiles']),literature=literature,observations=[],quantitative_result=None,teacher_approved=False,independent_chemical_validation=False)
    return signed(p)

def signed(p):
    p['packet_sha256']=module.digest_json({k:v for k,v in p.items() if k!='packet_sha256'})
    return p

class ImportContractTests(unittest.TestCase):
    def test_both_reaction_roles_and_separate_cell_context_are_accepted(self):
        for sid in ['Pei2019','Zhang2015']:
            value=module.validate_packet(fixture(sid))
            self.assertFalse(value['upstream_run_independently_verified'])
            self.assertEqual(value['observations'],[])
            self.assertFalse(value['packet']['literature'][-1]['mcts_action'])

    def test_semantic_tampering_is_rejected_even_with_new_checksum(self):
        mutations=[lambda p:p['target'].update(inchikey='wrong'),lambda p:p['selection'].update(doi='wrong'),lambda p:p['witness'].update(precursor_smiles=['O']),lambda p:p['literature'][-1].update(mcts_action=True),lambda p:p['literature'][0].update(source_sha256='0'*64),lambda p:p.update(teacher_approved=True),lambda p:p.update(observations=[1]),lambda p:p.update(quantitative_result=0),lambda p:p.update(extra='unknown'),lambda p:p['route'].update(steps=True)]
        for mutate in mutations:
            with self.subTest(mutation=mutate):
                p=fixture();mutate(p)
                with self.assertRaises(ValueError):module.validate_packet(signed(p))

    def test_corruption_and_unknown_version_fail_closed(self):
        p=fixture();p['run']['id']='changed'
        with self.assertRaises(ValueError):module.validate_packet(p)
        p=fixture();p['schema']='unknown'
        with self.assertRaises(ValueError):module.validate_packet(signed(p))

    def test_import_endpoint_uses_local_validation_and_same_origin_guard(self):
        import http.client,threading
        class Handler(server_module.LabHandler):
            def log_message(self,*args):pass
        srv=server_module.LabServer(('127.0.0.1',0),Handler)
        thread=threading.Thread(target=srv.serve_forever,daemon=True);thread.start()
        try:
            for origin,body,expected in [(None,fixture(),200),('https://example.invalid',fixture(),403),(None,{},400)]:
                connection=http.client.HTTPConnection('127.0.0.1',srv.server_port)
                headers={'Content-Type':'application/json'}
                if origin:headers['Origin']=origin
                connection.request('POST','/api/retro-import/validate',json.dumps(body),headers)
                response=connection.getresponse();response.read();self.assertEqual(response.status,expected);connection.close()
        finally:srv.shutdown();srv.server_close();thread.join()
