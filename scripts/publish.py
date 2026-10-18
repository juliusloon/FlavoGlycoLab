#!/usr/bin/env python3
"""兼容旧git publish入口；当前main直接普通推送public/main。"""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print("当前main已支持普通Git推送，请先git commit，再执行git push。", file=sys.stderr)
        sys.exit(2)
    branch = subprocess.check_output(["git", "-C", str(ROOT), "branch", "--show-current"], text=True).strip()
    if branch != "main":
        print("兼容入口仅推送main；归档分支不公开。", file=sys.stderr)
        sys.exit(1)
    sys.exit(subprocess.run(["git", "-C", str(ROOT), "push", "-u", "public", "main"]).returncode)
