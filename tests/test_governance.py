"""Governance contract tests, runnable from a clean Git checkout without private payloads."""
import pathlib
import re
import subprocess
import unittest

ROOT=pathlib.Path(__file__).resolve().parents[1]

class GovernanceContractTest(unittest.TestCase):
    def test_root_contracts_and_templates(self):
        for rel in ("README.md","AGENTS.md","PROJECT.md","ARCHITECTURE.md",
                    "STATE.md","PROGRESS.md","ROADMAP.md","CONTRIBUTING.md",
                    "docs/README.md","docs/tasks/TEMPLATE.md","docs/reports/TEMPLATE.md",
                    "docs/adr/TEMPLATE.md","docs/data-governance.md",
                    "docs/acceptance-criteria.md","docs/decisions-needed.md"):
            self.assertTrue((ROOT/rel).is_file(),rel)

    def test_task_report_pair_ids_and_slugs(self):
        t={p.name.replace("TASK-","",1) for p in (ROOT/"docs/tasks").glob("TASK-[0-9][0-9][0-9]-*.md")}
        r={p.name.replace("REPORT-","",1) for p in (ROOT/"docs/reports").glob("REPORT-[0-9][0-9][0-9]-*.md")}
        self.assertEqual(t,r)
        numbers=sorted(int(name.split("-",1)[0]) for name in t)
        self.assertEqual(numbers,list(range(1,len(t)+1)))

    def test_adrs_are_independent_and_sequential(self):
        numbers=sorted(int(p.name[:4]) for p in (ROOT/"docs/adr").glob("[0-9][0-9][0-9][0-9]-*.md"))
        self.assertEqual(numbers,[1,2,3,4])

    def test_active_project_identity(self):
        expected=("FlavoGlycoLab","flavoglycolab")
        self.assertIn(expected[0],(ROOT/"PROJECT.md").read_text(encoding="utf-8"))
        self.assertIn(expected[0],(ROOT/"README.md").read_text(encoding="utf-8"))
        pyproject=(ROOT/"pyproject.toml").read_text(encoding="utf-8")
        self.assertIn('name = "flavoglycolab"',pyproject)
        self.assertIn("flavoglycolab.evidence.catalog:main",pyproject)
        self.assertTrue((ROOT/"src/flavoglycolab/evidence/catalog.py").exists())
        self.assertFalse((ROOT/"src/futurehealth").exists())

    def test_active_code_does_not_import_prior_repos(self):
        paths=[ROOT/"pyproject.toml",ROOT/"metadata/active.json"]
        paths+=list((ROOT/"src/flavoglycolab").rglob("*.py"))
        for path in paths:
            body=path.read_text(encoding="utf-8")
            for needle in ("/home/ljx/FutureHealth", "/home/ljx/FlavoRetro",
                           "/home/ljx/CondRxnBench","from futurehealth",
                           "import futurehealth","from flavoretro",
                           "import flavoretro"):
                self.assertNotIn(needle,body,path)

    def test_restricted_data_not_in_git(self):
        tracked=subprocess.run(["git","-C",str(ROOT),"ls-files"],
                               capture_output=True,text=True,check=True).stdout.splitlines()
        restricted=("data/raw/","data/derived/","data/private/",
                    "reference/flavoretro-snapshot/data/",
                    "reference/flavoretro-snapshot/metadata/")
        self.assertEqual([p for p in tracked if p.startswith(restricted)],[])

    def test_template_minimum_content(self):
        task=(ROOT/"docs/tasks/TEMPLATE.md").read_text(encoding="utf-8")
        report=(ROOT/"docs/reports/TEMPLATE.md").read_text(encoding="utf-8")
        adr=(ROOT/"docs/adr/TEMPLATE.md").read_text(encoding="utf-8")
        for keyword in ("合同元数据","目标","范围","非目标","验收标准","停止条件"):
            self.assertIn(keyword,task)
        for keyword in ("对应任务","实际操作","验证","偏差","风险"):
            self.assertIn(keyword,report)
        for keyword in ("背景","决定","备选方案","影响与风险","复审条件"):
            self.assertIn(keyword,adr)

if __name__=="__main__":
    unittest.main()
