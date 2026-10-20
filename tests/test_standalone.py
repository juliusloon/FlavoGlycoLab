"""FlavoGlycoLab own data contracts: no external checkout required."""
import csv
import os
from pathlib import Path
import subprocess
import sys
import unittest
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
from flavoglycolab.evidence.catalog import EvidenceCatalog


class StandaloneCatalogTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.cat = EvidenceCatalog(ROOT)

    def test_local_active_manifest(self):
        m = self.cat.active
        self.assertEqual(m["relative_path_policy"], "workspace_root")
        self.assertEqual(self.cat.profile, "public")
        self.assertIsNone(m["records"])
        for key in ("source_registry", "case_registry", "public_sources"):
            self.assertFalse(Path(m[key]).is_absolute())
            self.assertTrue(self.cat.resolve_local(m[key]).exists())

    def test_22_cases_are_unreviewed(self):
        rows = self.cat.cases()
        self.assertEqual(len(rows), 22)
        self.assertEqual(sum(x["item_kind"] == "reaction_record" for x in rows), 21)
        self.assertTrue(all(x["admission_status"] == "pending_teacher_review"
                            and x["human_review_status"] == "not_performed" for x in rows))

    def test_registered_sources_local_hash(self):
        audit = self.cat.verify_sources(hash_check=True)
        self.assertTrue(audit["ok"], audit)
        self.assertEqual(audit["registered"], 3)
        self.assertEqual(audit["present"], 3)
        self.assertEqual(audit["missing_os_metadata"], [])

    def test_workspace_escape_blocked(self):
        with self.assertRaises(ValueError):
            self.cat.resolve_local("../../missing-outside.txt")

    def test_research_not_teaching(self):
        status = self.cat.summary()
        self.assertEqual(status["approved_teaching_cases"], 0)
        self.assertTrue(status["research_candidate_only"])
        self.assertFalse(status["public_release"])
        self.assertIsNone(status["record_count"])
        self.assertFalse(status["records_available"])

    def test_publications_have_no_fabricated_simulation_results(self):
        with (ROOT / "data/registries/publication_sources.csv").open(encoding="utf-8-sig") as fh:
            rows = list(csv.DictReader(fh))
        self.assertEqual(len(rows), 6)
        self.assertTrue(all(row["doi"] for row in rows))
        self.assertFalse((ROOT / "data/approved_simulation_data").exists())

    def test_restricted_not_tracked(self):
        import runpy
        allowed = runpy.run_path(str(ROOT / "scripts/export_public_repository.py"))["PUBLIC_PDFS"]
        paths = subprocess.run(["git", "-C", str(ROOT), "ls-files", "-z"], check=True,
                               capture_output=True, text=True).stdout.split("\0")
        self.assertFalse([p for p in paths if p.startswith(("data/raw/", "data/derived/",
                                                             "data/private/")) and p not in allowed])


@unittest.skipUnless(os.environ.get("FLAVOGLYCOLAB_TEST_RESEARCH") == "1",
                     "可选研究资产检查；使用python scripts/dev.py check --profile research显式启用")
class ResearchCatalogTest(unittest.TestCase):
    def test_research_manifest_and_record_count(self):
        cat = EvidenceCatalog(ROOT, "research")
        self.assertEqual(cat.profile, "research")
        self.assertEqual(len(cat.records()), 3059)
        self.assertEqual(cat.summary()["approved_teaching_cases"], 0)

    def test_required_research_sources(self):
        audit = EvidenceCatalog(ROOT, "research").verify_sources()
        self.assertTrue(audit["ok"], audit)
        self.assertEqual(audit["registered"], 123)
        # 117现存证据必须齐全，5项旧模型可缺；不跳过存在但损坏的模型。
        self.assertEqual(audit["present"] + len(audit["optional_absent"]), 122)
        self.assertEqual(audit["missing_os_metadata"], ["data/raw/legacy/import_raw/.DS_Store"])


if __name__ == "__main__":
    unittest.main()
