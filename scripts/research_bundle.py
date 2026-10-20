#!/usr/bin/env python3
"""内部研究包离线交接；不联网，不包含密钥、private、旧模型或Git历史。"""
from __future__ import annotations

import argparse
import json
from pathlib import Path, PurePosixPath
import re
import shutil
import sys
import tarfile
import tempfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src'))
from flavoglycolab.evidence.catalog import EvidenceCatalog, sha256_file

MANIFEST = 'bundle-manifest.json'


def local_target(root, name):
    path = PurePosixPath(name)
    if (path.is_absolute() or '..' in path.parts or '\\' in name or ':' in name
            or str(path) != name or name in ('', '.')):
        raise ValueError('不安全的包路径：' + name)
    target = root
    for part in path.parts:
        target = target / part
        if target.is_symlink():
            raise ValueError('拒绝符号链接路径：' + name)
    target.resolve().relative_to(root.resolve())
    return target


def expected_files(root):
    cat = EvidenceCatalog(root, 'research')
    plan = {}
    missing = set(cat.active['missing_nonchemical_source'])
    optional_roles = set(cat.active['optional_source_roles'])
    for row in cat.registry():
        name = row['local_path']
        if name in missing or row['source_role'] in optional_roles:
            continue
        if not name.startswith('data/raw/legacy/'):
            raise ValueError('登记表存在未定义的研究包来源：' + name)
        plan[name] = {'sha256': row['sha256'], 'size': int(row['size_bytes'])}
    derived = json.loads((root / 'metadata/research_bundle.json').read_text(encoding='utf-8'))
    for name, item in derived['files'].items():
        if not name.startswith('data/derived/v3/'):
            raise ValueError('派生清单路径不符合合同')
        plan[name] = item
    for name in plan:
        local_target(root, name)
    return plan


def check_file(path, item):
    if not path.is_file() or path.stat().st_size != item['size'] or sha256_file(path) != item['sha256']:
        raise ValueError('文件缺失或SHA/长度冲突：' + str(path.name))


def export_bundle(root, output):
    root = root.resolve()
    output = output if output.is_absolute() else root / output
    relative = output.absolute().relative_to(root).as_posix()
    output = local_target(root, relative)
    if not relative.startswith('temp/') or output.exists():
        raise ValueError('导出必须写到本项目temp/下的新文件，拒绝覆盖。')
    plan = expected_files(root)
    for name, item in plan.items():
        check_file(local_target(root, name), item)
    output.parent.mkdir(parents=True, exist_ok=True)
    # Exclusive creation preserves an existing delivery if two exporters race.
    stream = output.open('xb')
    try:
        with stream, tarfile.open(fileobj=stream, mode='w:gz') as archive:
            body = json.dumps({'schema_version': 1, 'profile': 'research', 'files': plan,
                               'scope': 'restricted_team_research', 'rights_verified': False,
                               'teacher_approved': False}, ensure_ascii=False, sort_keys=True).encode()
            import io
            info = tarfile.TarInfo(MANIFEST)
            info.size = len(body)
            archive.addfile(info, io.BytesIO(body))
            for name in sorted(plan):
                path = local_target(root, name)
                info = tarfile.TarInfo(name)
                info.size = plan[name]['size']
                info.mode = 0o600
                with path.open('rb') as source:
                    archive.addfile(info, source)
        result = {'ok': True, 'archive': str(output), 'sha256': sha256_file(output),
                  'files': len(plan), 'size_bytes': output.stat().st_size,
                  'omitted_external_models': 5, 'public_upload_allowed': False}
        output.with_suffix(output.suffix + '.sha256').write_text(result['sha256'] + '\n', encoding='ascii')
        return result
    except Exception:
        output.unlink(missing_ok=True)
        raise


def import_bundle(root, bundle, expected_sha):
    root = root.resolve()
    if not re.fullmatch('[a-fA-F0-9]{64}', expected_sha) or sha256_file(bundle) != expected_sha.lower():
        raise ValueError('整包SHA不匹配；请向提供方核对，未导入任何文件。')
    plan = expected_files(root)
    temp = root / 'temp'
    if temp.is_symlink():
        raise ValueError('temp不得为符号链接')
    temp.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='research-import-', dir=temp) as stage_dir:
        stage = Path(stage_dir)
        seen = set()
        with tarfile.open(bundle, 'r:gz') as archive:
            # Iterate with a strict count bound; never extractall or trust tar paths/modes.
            for member in archive:
                name = member.name
                if name in seen or len(seen) >= len(plan) + 1 or not member.isfile() or member.issparse():
                    raise ValueError('包内有重复、链接或未知载荷。')
                seen.add(name)
                if name == MANIFEST:
                    if member.size > 200000:
                        raise ValueError('清单过大')
                    with archive.extractfile(member) as stream:
                        manifest = json.load(stream)
                    if not isinstance(manifest, dict) or manifest.get('schema_version') != 1 or manifest.get('profile') != 'research' or manifest.get('files') != plan:
                        raise ValueError('包清单不符合本地固定指纹。')
                    continue
                if name not in plan or member.size != plan[name]['size']:
                    raise ValueError('包内有未知路径或错误长度：' + name)
                target = local_target(stage, name)
                target.parent.mkdir(parents=True, exist_ok=True)
                with archive.extractfile(member) as source, target.open('xb') as dest:
                    shutil.copyfileobj(source, dest, length=1024 * 1024)
                check_file(target, plan[name])
        if seen != set(plan) | {MANIFEST}:
            raise ValueError('研究包文件不全；未导入任何文件。')
        # Preflight every destination before the first persistent write.
        unchanged, targets = 0, []
        for name, item in plan.items():
            target = local_target(root, name)
            for parent in target.parents:
                if parent == root:
                    break
                if parent.exists() and not parent.is_dir():
                    raise ValueError('目标父路径不是目录：' + name)
            if target.exists():
                check_file(target, item)
                unchanged += 1
            else:
                targets.append((name, target))
        created = []
        try:
            for name, target in targets:
                local_target(root, name)
                target.parent.mkdir(parents=True, exist_ok=True)
                with target.open('xb') as dest:
                    created.append(target)
                    with (stage / name).open('rb') as source:
                        shutil.copyfileobj(source, dest, length=1024 * 1024)
                target.chmod(0o600)
        except Exception:
            for target in created:
                target.unlink(missing_ok=True)
            raise
    return {'ok': True, 'imported': len(targets), 'already_identical': unchanged,
            'files': len(plan), 'message': '原件未改写；未导入密钥、private或旧模型。'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    export = sub.add_parser('export', help='提供方在数据齐全的本地工作区生成包，不自动发送')
    export.add_argument('--output', type=Path, default=Path('temp/flavoglycolab-research-v3.tar.gz'))
    load = sub.add_parser('import', help='接收方离线导入')
    load.add_argument('bundle', type=Path)
    load.add_argument('--sha256', required=True, help='由提供方另行给出的整包SHA256')
    args = parser.parse_args()
    try:
        result = export_bundle(ROOT, args.output) if args.command == 'export' else import_bundle(ROOT, args.bundle, args.sha256)
    except (OSError, ValueError, KeyError, tarfile.TarError) as exc:
        print(json.dumps({'ok': False, 'error': str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
