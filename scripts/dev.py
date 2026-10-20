#!/usr/bin/env python3
"""跨平台本地开发入口：Python 3.10+，运行不需要安装第三方依赖。"""
from __future__ import annotations

import argparse
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'src'))
from flavoglycolab.evidence.catalog import EvidenceCatalog


def doctor(profile='public'):
    try:
        if sys.version_info < (3, 10):
            raise ValueError('需要Python 3.10或以上。')
        summary = EvidenceCatalog(ROOT, profile).summary(verify_sources=True)
        if not summary['source_integrity']['ok']:
            raise ValueError(json.dumps(summary['source_integrity'], ensure_ascii=False))
        for name in ('index.html', 'app.js', 'lab-state.js', 'ui.js', 'styles.css',
                     'views/workbench.js', 'content/demo-content.json', 'assets/lab-bench.png'):
            if not (ROOT / 'frontend/student' / name).is_file():
                raise ValueError('运行资产缺失：frontend/student/' + name + '；请git pull --ff-only更新完整代码。')
        print(json.dumps({'ok': True, 'python': sys.version.split()[0], 'profile': profile,
                          'cases': summary['case_entries'], 'sources_present': summary['source_integrity']['present'],
                          'node_tests_available': shutil.which('node') is not None,
                          'tutor_config_present': (ROOT / 'data/private/runtime/tutor.json').is_file(),
                          'message': '本地流程可运行；实时AI为可选配置，无需访问所有者服务器。'}, ensure_ascii=False, indent=2), flush=True)
        return True
    except (OSError, ValueError, KeyError) as exc:
        print(json.dumps({'ok': False, 'error': str(exc)}, ensure_ascii=False), file=sys.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', nargs='?', default='serve', choices=['serve', 'doctor', 'check', 'evidence'])
    parser.add_argument('--profile', choices=['public', 'research'], default='public')
    parser.add_argument('--bind', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8767)
    args = parser.parse_args()
    if not doctor(args.profile):
        return 1
    if args.command == 'doctor':
        return 0
    if args.command == 'evidence':
        print(json.dumps(EvidenceCatalog(ROOT, args.profile).summary(True), ensure_ascii=False, indent=2))
        return 0
    if args.command == 'check':
        env = os.environ.copy()
        env['FLAVOGLYCOLAB_TEST_RESEARCH'] = '1' if args.profile == 'research' else '0'
        result = subprocess.run([sys.executable, '-m', 'unittest', 'discover', '-s', 'tests', '-v'], cwd=ROOT, env=env)
        if result.returncode:
            return result.returncode
        node = shutil.which('node')
        if node:
            return subprocess.run([node, '--test', 'tests/test_workbench_state.mjs'], cwd=ROOT).returncode
        print('Python检查已通过；未安装Node，跳过可选JS状态测试。完整CI会执行JS测试。')
        return 0
    spec = importlib.util.spec_from_file_location('lab_server', ROOT / 'scripts/serve_lab.py')
    lab = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(lab)
    try:
        with lab.LabServer((args.bind, args.port)) as server:
            print(f'浏览器打开 http://{args.bind}:{server.server_port}/ （Ctrl+C停止）', flush=True)
            server.serve_forever()
    except KeyboardInterrupt:
        print('\n已停止。')
    except OSError as exc:
        print(f'无法启动：{exc}；端口占用时可用 --port 8768。', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
