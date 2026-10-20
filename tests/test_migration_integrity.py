"""Integrity checks for historical P0 snapshots; no source checkout needed."""
import csv
from pathlib import Path
import hashlib
import os
import sqlite3
import unittest

ROOT = Path(__file__).resolve().parents[1]


def digest(path):
    h=hashlib.sha256()
    with path.open("rb") as f:
        for b in iter(lambda:f.read(1024*1024),b""):
            h.update(b)
    return h.hexdigest()


class MigrationIntegrityTest(unittest.TestCase):
    def test_snapshot_23_unique_and_all_actual_hashes(self):
        with (ROOT/"migrations/mapping.csv").open(encoding="utf-8-sig",newline="") as f:
            rows=[r for r in csv.DictReader(f) if r["decision"]=="CORE_REUSE"]
        self.assertEqual(len(rows),24)  # LICENSE also copied to top-level
        self.assertEqual(len(set(r["source_relative_path"] for r in rows)),23)
        for row in rows:
            with self.subTest(path=row["target_relative_path"]):
                p=ROOT/row["target_relative_path"]
                self.assertTrue(p.is_file())
                self.assertEqual(digest(p),row["sha256"])

    @unittest.skipUnless(os.environ.get("FLAVOGLYCOLAB_TEST_RESEARCH") == "1",
                         "SQLite是可选研究资产；显式启用research检查")
    def test_sqlite_index_local_read_only_integrity(self):
        p=ROOT/"data/derived/v3/index.sqlite"
        self.assertTrue(p.exists())
        conn=sqlite3.connect("file:"+str(p)+"?mode=ro",uri=True)
        try:
            self.assertEqual(conn.execute("PRAGMA integrity_check").fetchone()[0],"ok")
            tables={r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            self.assertTrue({"records","sources","outcomes","qc"}.issubset(tables))
        finally:
            conn.close()

    def test_active_paths_are_local_only(self):
        files=["README.md","pyproject.toml","metadata/active.json",
               "src/flavoglycolab/evidence/catalog.py","data/registries/case_admission.csv",
               "data/registries/source_registry.csv"]
        banned=["/home/ljx/FlavoRetro","/home/ljx/retro_synthesis",
                "import flavoretro", "from flavoretro"]
        for rel in files:
            text=(ROOT/rel).read_text(encoding="utf-8-sig")
            for b in banned:
                self.assertNotIn(b,text,rel)


if __name__=="__main__":
    unittest.main()
