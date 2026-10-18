#!/usr/bin/env python3
"""将研究HEAD的允许文件同步到独立公开main；从根目录运行git publish。"""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

import export_public_repository as policy

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "temp/public-repository"


def git(repo, *args):
    return subprocess.check_output(["git", "-C", str(repo), *args]).decode().strip()


def audit_public():
    """复核所有公开refs与拟提交树，防止把研究父链或原案例表带入。"""
    commits = git(PUBLIC, "rev-list", "--all").splitlines()
    research = set(git(ROOT, "rev-list", "--branches").splitlines())
    if research.intersection(commits):
        raise policy.ExportError("公开父链包含本地研究提交，停止同步。")
    pairs = set()
    for ref in [*commits, git(PUBLIC, "write-tree")]:
        raw = subprocess.check_output(["git", "-C", str(PUBLIC), "ls-tree", "-r", "-z", ref])
        for entry in filter(None, raw.split(b"\0")):
            info, name = entry.split(b"\t", 1)
            mode, kind, oid = info.decode().split()
            name = name.decode()
            policy.check_path(name)
            if policy.exclusion_reason(name) or kind != "blob" or mode not in ("100644", "100755"):
                raise policy.ExportError(f"公开历史含非公开文件：{name}")
            pairs.add((name, oid))
    for name, oid in pairs:
        body = subprocess.check_output(["git", "-C", str(PUBLIC), "cat-file", "blob", oid])
        policy.check_content(name, body)
        if name == policy.CASE_PATH and policy.redact_cases(body)[1]["redacted_numeric_yields"]:
            raise policy.ExportError("公开历史含未脱敏案例表。")
    return {"existing_public_commits": len(commits), "audited_path_blob_pairs": len(pairs)}


def publish(message):
    if git(ROOT, "status", "--porcelain"):
        raise policy.ExportError("研究工作区存在未提交修改，请先提交再执行git publish。")
    source = git(ROOT, "rev-parse", "HEAD")
    name = git(ROOT, "config", "user.name")
    email = git(ROOT, "config", "user.email")
    url = git(ROOT, "remote", "get-url", "public")
    (ROOT / "temp").mkdir(exist_ok=True)
    snapshot = Path(tempfile.mkdtemp(prefix="public-export-", dir=ROOT / "temp"))
    exported = policy.export(source, str(snapshot))
    if not PUBLIC.exists():
        subprocess.run(["git", "clone", "--single-branch", "--branch", "main", url, str(PUBLIC)], check=True)
    if git(PUBLIC, "remote", "get-url", "origin") != url:
        raise policy.ExportError("公开检出origin与研究仓库public地址不同，停止同步。")
    if git(PUBLIC, "status", "--porcelain") or git(PUBLIC, "branch", "--show-current") != "main":
        raise policy.ExportError("公开检出不在干净main，停止覆盖。")
    git(PUBLIC, "fetch", "origin", "main")
    ahead = int(git(PUBLIC, "rev-list", "--count", "origin/main..HEAD"))
    if ahead:
        raise policy.ExportError("公开检出含未推送提交，停止覆盖；请核查后在该检出普通push。")
    git(PUBLIC, "merge", "--ff-only", "origin/main")
    before = git(PUBLIC, "rev-parse", "HEAD")
    files = {p.relative_to(snapshot).as_posix() for p in snapshot.rglob("*") if p.is_file()}
    tracked = subprocess.check_output(["git", "-C", str(PUBLIC), "ls-files", "-z"])
    for raw in filter(None, tracked.split(b"\0")):
        rel = raw.decode()
        if rel not in files:
            (PUBLIC / rel).unlink()
    for rel in files:
        target = PUBLIC / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(snapshot / rel, target)
    git(PUBLIC, "add", "-A")
    for rel in files:
        body = subprocess.check_output(["git", "-C", str(PUBLIC), "show", ":" + rel])
        if body != (snapshot / rel).read_bytes():
            raise policy.ExportError(f"公开暂存区字节变化：{rel}")
    audited = audit_public()
    subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_governance.py", "-v"], cwd=PUBLIC, check=True)
    changed = bool(git(PUBLIC, "diff", "--cached", "--name-only"))
    if changed:
        git(PUBLIC, "-c", "user.name=" + name, "-c", "user.email=" + email,
            "commit", "-m", message or "公开同步：" + source[:12])
        git(PUBLIC, "push", "origin", "HEAD:refs/heads/main")
    head = git(PUBLIC, "rev-parse", "HEAD")
    remote = git(PUBLIC, "ls-remote", "origin", "refs/heads/main").split()[0]
    if head != remote:
        raise policy.ExportError("远端main与公开检出不一致，请核查并行更新。")
    return {"source_commit": source, "public_commit": head, "previous_public_commit": before,
            "changed": changed, "author_name": name, "published_files": len(files),
            "published_pdfs": len(policy.PUBLIC_PDFS), "excluded_files": exported["excluded_file_count"], **audited}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--message", help="公开提交说明")
    args = parser.parse_args()
    try:
        print(json.dumps(publish(args.message), ensure_ascii=False, indent=2))
    except (policy.ExportError, subprocess.CalledProcessError, OSError) as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
