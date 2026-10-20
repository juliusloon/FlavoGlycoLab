"""Public mode independence and explicit research failures in an isolated workspace."""
import hashlib
import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src'))
from flavoglycolab.evidence.catalog import DataUnavailable, EvidenceCatalog


class ProfileTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in ('metadata/active.json', 'data/registries/source_registry.csv', 'data/registries/case_admission.csv'):
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / name, path)
        pdf = self.root / 'data/raw/literature/source.pdf'
        pdf.parent.mkdir(parents=True)
        pdf.write_bytes(b'%PDF-1.4\npublic-test-fixture\n')
        (self.root / 'metadata/public_sources.json').write_text(json.dumps({'files': {
            'data/raw/literature/source.pdf': hashlib.sha256(pdf.read_bytes()).hexdigest()}}))

    def test_public_summary_needs_no_research_or_network(self):
        cat = EvidenceCatalog(self.root)
        summary = cat.summary(True)
        self.assertEqual(summary['profile'], 'public')
        self.assertEqual(summary['case_entries'], 22)
        self.assertIsNone(summary['record_count'])
        self.assertTrue(summary['source_integrity']['ok'])
        self.assertFalse((self.root / 'data/derived').exists())
        with self.assertRaisesRegex(DataUnavailable, 'cases'):
            cat.records()

    def test_missing_research_is_actionable_and_never_empty(self):
        with self.assertRaisesRegex(DataUnavailable, 'research_bundle.py import'):
            EvidenceCatalog(self.root, 'research').summary()

    def test_corrupt_research_fails_without_public_fallback(self):
        p = self.root / 'data/derived/v3/records.json'
        p.parent.mkdir(parents=True)
        p.write_text('[]')
        with self.assertRaisesRegex(ValueError, 'hash mismatch'):
            EvidenceCatalog(self.root, 'research').records()
        self.assertIsNone(EvidenceCatalog(self.root).summary()['record_count'])

    def test_missing_or_corrupt_public_source_is_not_success(self):
        p = self.root / 'data/raw/literature/source.pdf'
        p.write_bytes(b'changed')
        self.assertFalse(EvidenceCatalog(self.root).verify_sources()['ok'])
        p.unlink()
        self.assertFalse(EvidenceCatalog(self.root).verify_sources()['ok'])

    def test_absolute_and_symlink_escape_rejected(self):
        cat = EvidenceCatalog(self.root)
        with self.assertRaises(ValueError):
            cat.resolve_local(str(self.root / 'metadata/active.json'))
        try:
            (self.root / 'outside').symlink_to(ROOT, target_is_directory=True)
        except OSError:
            self.skipTest('此平台没有符号链接权限')
        with self.assertRaises(ValueError):
            cat.resolve_local('outside/STATE.md')

    def test_unknown_profile_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Unknown'):
            EvidenceCatalog(self.root, 'automatic-fallback')


if __name__ == '__main__':
    unittest.main()
