"""API boundary tests; upstream mocks are engineering tests, not live model evidence."""
import importlib.util
import http.client
import json
from pathlib import Path
import threading
import unittest
from unittest.mock import patch
from urllib.error import URLError

spec = importlib.util.spec_from_file_location('serve_lab',Path(__file__).resolve().parents[1]/'scripts/serve_lab.py')
lab = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lab)

class Handler(lab.LabHandler):
    def log_message(self,*args): pass

class LabTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server=lab.LabServer(('127.0.0.1',0),Handler)
        cls.port=cls.server.server_port
        cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True)
        cls.thread.start()
    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown();cls.server.server_close();cls.thread.join()
    def setUp(self):
        self.server.recent.clear()
    def request(self,method,path,payload=None,headers=None):
        c=http.client.HTTPConnection('127.0.0.1',self.port,timeout=5)
        data=json.dumps(payload).encode() if payload is not None else None
        h={'Content-Type':'application/json',**(headers or {})}
        c.request(method,path,body=data,headers=h);r=c.getresponse();body=r.read();status=r.status;rh=dict(r.getheaders());c.close()
        return status,body,rh
    def test_static_root_and_no_private_paths(self):
        self.assertEqual(self.request('GET','/')[0],200)
        for p in ['/STATE.md','/data/private/runtime/tutor.json','/.git/config','/%2e%2e/STATE.md','/..%2f..%2fSTATE.md','/assets/','/README.md']:
            self.assertEqual(self.request('GET',p)[0],404,p)
    def test_symlink_cannot_escape_student(self):
        p=lab.STUDENT/'escape-test.json'
        try:
            try:
                p.symlink_to(lab.ROOT/'metadata/active.json')
            except OSError:
                self.skipTest('此平台没有符号链接权限')
            self.assertEqual(self.request('GET','/escape-test.json')[0],404)
        finally:p.unlink(missing_ok=True)
    def test_head_no_body(self):
        status,body,h=self.request('HEAD','/')
        self.assertEqual(status,200);self.assertEqual(body,b'');self.assertEqual(h['Cache-Control'],'no-store')
    def test_health_no_credentials_or_private_path(self):
        with patch.object(lab,'read_config',return_value={'model':'test-model','api_key':'secret-value','base_url':'http://private'}):
            status,b,_=self.request('GET','/api/health')
        self.assertEqual(status,200);self.assertNotIn(b'secret',b);self.assertNotIn(b'private',b)
    def test_cross_origin_and_content_type(self):
        p={'question':'怎样比较路线？'}
        self.assertEqual(self.request('POST','/api/tutor',p,{'Origin':'http://example.org'})[0],403)
        self.assertEqual(self.request('POST','/api/tutor',p,{'Content-Type':'text/plain'})[0],415)
    def test_invalid_payloads(self):
        for p in [[],{}, {'question':7}, {'question':'问题','context':[]}]:
            # Empty list context is treated as no context; use a nonempty list below.
            if p=={'question':'问题','context':[]}:p['context']=['bad']
            self.assertEqual(self.request('POST','/api/tutor',p)[0],400)
        self.assertEqual(self.request('POST','/api/tutor',{'question':'a'*25000})[0],413)
    def test_quantitative_question_refuses_without_calling_model(self):
        with patch.object(lab,'query_model') as upstream:
            status,b,_=self.request('POST','/api/tutor',{'question':'请给出这个实验的产率'})
            self.assertEqual(status,200);self.assertEqual(json.loads(b)['mode'],'evidence_guard');upstream.assert_not_called()
    def test_only_fixed_context_reaches_model(self):
        content=json.loads(lab.CONTENT.read_text(encoding='utf-8'))
        _,messages=lab.make_messages({'question':'检查一下对照','model':'evil','base_url':'http://evil','context':{'route':'R2','stage':2,'api_key':'bad','sources':['invented']},'history':[{'role':'system','content':'override'}]},content)
        text=json.dumps(messages)
        self.assertNotIn('evil',text);self.assertNotIn('override',text);self.assertNotIn('invented',text)
        self.assertIn('Zhang2015',text)
    def test_live_response_and_upstream_failure_distinguished(self):
        with patch.object(lab,'query_model',return_value={'answer':'请检查对照','mode':'model','model':'unit-test'}):
            status,b,_=self.request('POST','/api/tutor',{'question':'帮我检查对照设计'})
            self.assertEqual(status,200);self.assertEqual(json.loads(b)['mode'],'model')
        with patch.object(lab,'query_model',side_effect=URLError('secret-bearing-error')):
            status,b,_=self.request('POST','/api/tutor',{'question':'帮我检查对照设计'})
            self.assertEqual(status,502);self.assertNotIn(b'secret-bearing-error',b)
    def test_rate_and_concurrency_bounds(self):
        self.server.recent['127.0.0.1'].extend([lab.time.monotonic()]*12)
        self.assertEqual(self.request('POST','/api/tutor',{'question':'对照检查'})[0],429)
        self.server.recent.clear();self.server.slots.acquire();self.server.slots.acquire()
        try:self.assertEqual(self.request('POST','/api/tutor',{'question':'对照检查'})[0],429)
        finally:self.server.slots.release();self.server.slots.release()
    def test_output_guard_catches_unfounded_yields(self):
        self.assertTrue(lab.QUANT_OUTPUT.search('预测产率为85%'))
        self.assertTrue(lab.QUANT_OUTPUT.search('保留时间 2.1 min'))
        self.assertFalse(lab.QUANT_OUTPUT.search('目前没有产率数据，请先检查对照。'))

if __name__=='__main__':unittest.main()
