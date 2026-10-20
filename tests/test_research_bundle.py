"""Offline delivery: no secret paths, no partial writes on validation failure."""
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('research_bundle', ROOT / 'scripts/research_bundle.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class BundleTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.root = self.base / 'workspace'
        self.root.mkdir()
        self.bodies = {'data/raw/legacy/evidence.txt': b'original evidence',
                       'data/derived/v3/records.json': b'[]'}
        self.plan = {n: {'sha256': hashlib.sha256(b).hexdigest(), 'size': len(b)} for n, b in self.bodies.items()}
        self.patcher = patch.object(module, 'expected_files', return_value=self.plan)
        self.patcher.start()
        self.addCleanup(self.patcher.stop)

    def archive(self, changes=None, extra=None, omit=None, duplicate=False):
        bundle = self.base / 'input.tar.gz'
        with tarfile.open(bundle, 'w:gz') as archive:
            bodies = {module.MANIFEST: json.dumps({'schema_version': 1, 'profile': 'research', 'files': self.plan}).encode(), **self.bodies}
            bodies.update(changes or {})
            for name, body in bodies.items():
                if name == omit:
                    continue
                info = tarfile.TarInfo(name)
                info.size = len(body)
                archive.addfile(info, io.BytesIO(body))
                if duplicate and name == 'data/raw/legacy/evidence.txt':
                    archive.addfile(info, io.BytesIO(body))
            if extra:
                archive.addfile(extra, io.BytesIO(b''))
        return bundle, module.sha256_file(bundle)

    def test_roundtrip_idempotent_and_excludes_private(self):
        for name, body in self.bodies.items():
            p = self.root / name
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(body)
        secret = self.root / 'data/private/runtime/tutor.json'
        secret.parent.mkdir(parents=True)
        secret.write_text('private-fixture')
        result = module.export_bundle(self.root, Path('temp/research.tar.gz'))
        other = self.base / 'other'
        other.mkdir()
        bundle = Path(result['archive'])
        with tarfile.open(bundle) as archive:
            self.assertEqual(set(archive.getnames()), set(self.plan) | {module.MANIFEST})
        self.assertEqual(module.import_bundle(other, bundle, result['sha256'])['imported'], 2)
        self.assertEqual(module.import_bundle(other, bundle, result['sha256'])['already_identical'], 2)
        self.assertFalse((other / 'data/private').exists())
        for name, body in self.bodies.items():
            self.assertEqual((other / name).read_bytes(), body)

    def test_wrong_archive_sha_no_write(self):
        bundle, _ = self.archive()
        with self.assertRaisesRegex(ValueError, '整包SHA'):
            module.import_bundle(self.root, bundle, '0' * 64)
        self.assertFalse((self.root / 'data').exists())

    def test_bad_file_hash_no_write(self):
        bundle, sha = self.archive(changes={'data/raw/legacy/evidence.txt': b'x' * len(self.bodies['data/raw/legacy/evidence.txt'])})
        with self.assertRaisesRegex(ValueError, 'SHA'):
            module.import_bundle(self.root, bundle, sha)
        self.assertFalse((self.root / 'data').exists())

    def test_extra_traversal_or_secret_path_rejected(self):
        for name in ('../escape.txt', '/absolute.txt', 'data/private/runtime/tutor.json', 'data/raw/unknown.txt'):
            with self.subTest(name=name):
                info = tarfile.TarInfo(name)
                bundle, sha = self.archive(extra=info)
                with self.assertRaises(ValueError):
                    module.import_bundle(self.root, bundle, sha)
                self.assertFalse((self.root / 'data').exists())

    def test_symlink_and_duplicate_and_incomplete_archive_rejected(self):
        link = tarfile.TarInfo('link')
        link.type = tarfile.SYMTYPE
        link.linkname = '../target'
        for kwargs in ({'extra': link}, {'duplicate': True}, {'omit': 'data/raw/legacy/evidence.txt'}):
            bundle, sha = self.archive(**kwargs)
            with self.assertRaises(ValueError):
                module.import_bundle(self.root, bundle, sha)
            self.assertFalse((self.root / 'data').exists())

    def test_conflict_preserves_original_and_imports_nothing(self):
        p = self.root / 'data/derived/v3/records.json'
        p.parent.mkdir(parents=True)
        p.write_bytes(b'existing-different-version')
        bundle, sha = self.archive()
        with self.assertRaisesRegex(ValueError, '冲突'):
            module.import_bundle(self.root, bundle, sha)
        self.assertEqual(p.read_bytes(), b'existing-different-version')
        self.assertFalse((self.root / 'data/raw').exists())

    def test_symlink_destination_rejected(self):
        external = self.base / 'external'
        external.mkdir()
        try:
            (self.root / 'data').symlink_to(external, target_is_directory=True)
        except OSError:
            self.skipTest('此平台没有符号链接权限')
        bundle, sha = self.archive()
        with self.assertRaisesRegex(ValueError, '符号链接'):
            module.import_bundle(self.root, bundle, sha)
        self.assertEqual(list(external.iterdir()), [])

    def test_export_refuses_overwrite(self):
        p = self.root / 'temp/keep.tar.gz'
        p.parent.mkdir()
        p.write_bytes(b'keep-original')
        with self.assertRaises(ValueError):
            module.export_bundle(self.root, p)
        self.assertEqual(p.read_bytes(), b'keep-original')


if __name__ == '__main__':
    unittest.main()
