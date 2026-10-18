#!/usr/bin/env python3
"""从已提交的树生成公开快照；原仓库和受限数据保持只读。"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
import tarfile


ROOT = Path(__file__).resolve().parents[1]
CASE_PATH = "data/registries/case_admission.csv"
WITHHELD = "withheld_unlicensed"
# TASK-008 human_direct：三个精确PDF字节例外；出版方权利核验未代签。
PUBLIC_PDFS = {
    "data/raw/literature/Biotransformation of rutin to isoquercitrin using recombinant α-l-rhamnosidase from Bifidobacterium breve.pdf": "26ef2ba07b43ffe53d18cdc1808b517c26137dfdc07fdb336ea3bf8a5d4e86a5",
    "data/raw/literature/Combinatorial metabolic engineering of Bacillus subtilis enables the efficient biosynthesis of isoquercitrin from quercetin.pdf": "95f63a8c3d8a4d6d96fc9421eaae96297fc3e4c2f00c31f034b66cc7fbd22513",
    "data/raw/literature/Synergistic Catalysis of Glycosyltransferase and Sucrose Synthase to Produce Isoquercitrin Through Glycosylation of Quercetin.pdf": "0820ef04fbf00fd72fa2f9e81c396e0fe8c4afddaa1151947bf500f92db5e67f"
}
# 已核定的本地保留范围；未知文件仍由下方路径/内容守卫拒绝。
LOCAL_ONLY_PREFIXES = {
    "docs/p10ns/261017/": "本地老师汇报包及其第三方参考资源，不在公开范围",
}
LOCAL_ONLY_FILES = {
    "docs/research/附件1_2026年度“人工智能”虚拟仿真实验教学项目申报书(1).docx":
        "申报附件的再分发许可未核实，保留本地",
    "docs/research/附件2_2026年度“人工智能”虚拟仿真实验教学项目征集说明(1).pdf":
        "申报附件的再分发许可未核实，保留本地",
}
RESTRICTED_PREFIXES = (
    "data/raw/", "data/derived/", "data/private/",
    "reference/flavoretro-snapshot/data/",
    "reference/flavoretro-snapshot/metadata/",
)
RESTRICTED_SUFFIXES = {
    ".pdf", ".docx", ".pptx", ".xlsx", ".rdf", ".sdf", ".mol", ".rxn",
    ".sqlite", ".sqlite3", ".db", ".pt", ".pth", ".ckpt", ".onnx",
    ".safetensors", ".h5", ".hdf5", ".pkl", ".pickle", ".joblib",
    ".zip", ".tar", ".gz", ".bz2", ".xz", ".7z", ".bin",
}
CASE_FIELDS = [
    "admission_id", "item_kind", "name_or_case", "ref_id", "source_path",
    "source_sha256", "locator", "reference_doi_if_recorded", "historical_yield_raw",
    "yield_status", "identity_or_review_status", "admission_status",
    "human_review_status", "limitation", "provenance",
]
CREDENTIAL_PATTERNS = {
    "GitHub令牌": re.compile(rb"(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})"),
    "API密钥": re.compile(rb"\bsk-[A-Za-z0-9_-]{20,}"),
    "AWS密钥": re.compile(rb"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"),
    "私钥": re.compile(rb"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----"),
    "网址内凭据": re.compile(rb"https?://[^\s/\x22\x27]+:[^\s/\x22\x27]+@"),
    "字面凭据赋值": re.compile(
        rb"(?i)\b(?:api[_-]?key|auth[_-]?token|access[_-]?token|secret[_-]?key|password|passwd)"
        rb"\s*[=:]\s*[\x22\x27][^\x22\x27\s]{8,}[\x22\x27]"
    ),
}


class ExportError(Exception):
    """只返回路径和问题类别，不输出原始数值或凭据。"""


class ChineseParser(argparse.ArgumentParser):
    def format_help(self):
        return super().format_help().replace("usage:", "用法：", 1)

    def format_usage(self):
        return super().format_usage().replace("usage:", "用法：", 1)

    def error(self, message):
        self.print_usage(sys.stderr)
        self.exit(2, "参数无法解析，请使用 --help 查看用法。\n")


def git(*args: str) -> bytes:
    result = subprocess.run(
        ["git", "-C", str(ROOT), *args], capture_output=True, check=False,
    )
    if result.returncode:
        raise ExportError("Git读取失败；请确认引用有效且位于本项目仓库。")
    return result.stdout


def destination_path(value: str) -> Path:
    given = Path(value)
    destination = given if given.is_absolute() else ROOT / given
    if destination.is_symlink():
        raise ExportError("目标目录不得为符号链接。")
    destination = destination.resolve()
    allowed = ROOT / "temp"
    try:
        destination.relative_to(allowed)
    except ValueError as exc:
        raise ExportError("目标必须位于本项目的 temp/ 子目录内。") from exc
    if destination == allowed:
        raise ExportError("请在 temp/ 下指定独立的快照子目录。")
    if destination.exists() and (
        not destination.is_dir() or any(destination.iterdir())
    ):
        raise ExportError("目标路径已存在且不是空目录；拒绝覆盖。")
    return destination


def exclusion_reason(name: str) -> str | None:
    if name in LOCAL_ONLY_FILES:
        return LOCAL_ONLY_FILES[name]
    for prefix, reason in LOCAL_ONLY_PREFIXES.items():
        if name == prefix.rstrip("/") or name.startswith(prefix):
            return reason
    return None


def check_path(name: str) -> None:
    path = PurePosixPath(name)
    if path.is_absolute() or ".." in path.parts or ".git" in path.parts:
        raise ExportError(f"不安全的归档路径：{name}")
    if name in PUBLIC_PDFS:
        return
    if name.startswith(RESTRICTED_PREFIXES):
        raise ExportError(f"已提交树包含禁止公开的数据路径：{name}")
    if path.suffix.lower() in RESTRICTED_SUFFIXES:
        raise ExportError(f"已提交树包含未经许可的载荷类型：{name}")
    if path.name in {".env", "id_rsa", "id_ed25519", "credentials"} or (
        path.name.startswith(".env.") and path.suffix not in {".example", ".sample"}
    ):
        raise ExportError(f"已提交树包含凭据文件路径：{name}")


def check_content(name: str, body: bytes) -> None:
    if name in PUBLIC_PDFS:
        if not body.startswith(b"%PDF-") or hashlib.sha256(body).hexdigest() != PUBLIC_PDFS[name]:
            raise ExportError(f"指定PDF字节与批准基线不符：{name}")
        return
    if b"\0" in body:
        raise ExportError(f"公开范围不包含二进制载荷：{name}")
    try:
        body.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise ExportError(f"公开范围不包含非UTF-8载荷：{name}") from exc
    for category, pattern in CREDENTIAL_PATTERNS.items():
        if pattern.search(body):
            raise ExportError(f"发现疑似凭据，停止导出：{name}（{category}）")


def redact_cases(body: bytes) -> tuple[bytes, dict]:
    reader = csv.DictReader(io.StringIO(body.decode("utf-8-sig"), newline=""))
    if reader.fieldnames != CASE_FIELDS:
        raise ExportError("案例登记表字段变化，须复核公开范围后再导出。")
    rows = list(reader)
    if len(rows) != 22 or any(None in row or None in row.values() for row in rows):
        raise ExportError("案例登记表不符合22条完整登记的基线。")
    counts = {"redacted_numeric_yields": 0, "preserved_missing_yields": 0,
              "already_withheld_yields": 0}
    kinds = {"teaching_case": 0, "reaction_record": 0}
    for row in rows:
        kind = row["item_kind"]
        if kind not in kinds:
            raise ExportError("案例登记表出现未知案例类别。")
        kinds[kind] += 1
        if row["admission_status"] != "pending_teacher_review" or (
            row["human_review_status"] != "not_performed"
        ):
            raise ExportError("案例登记表审核状态已变化，须重新审计。")
        value, status = row["historical_yield_raw"], row["yield_status"]
        if status == "numeric" and kind == "reaction_record":
            if not re.fullmatch(r"[+-]?(?:\d+(?:\.\d*)?|\.\d+)", value.strip()):
                raise ExportError("产率列标记为数值但载荷未知；拒绝导出。")
            row["historical_yield_raw"] = WITHHELD
            row["yield_status"] = WITHHELD
            counts["redacted_numeric_yields"] += 1
        elif status == "missing" and not value and kind == "reaction_record":
            counts["preserved_missing_yields"] += 1
        elif status == WITHHELD and value == WITHHELD and kind == "reaction_record":
            counts["already_withheld_yields"] += 1
        elif not status and not value and kind == "teaching_case":
            continue
        else:
            raise ExportError("产率列出现未知状态或非空载荷；拒绝导出。")
    if kinds != {"teaching_case": 1, "reaction_record": 21} or (
        counts["redacted_numeric_yields"] + counts["already_withheld_yields"] != 11
        or counts["preserved_missing_yields"] != 10
    ):
        raise ExportError("案例分母或产率状态分母变化，须重新审计。")
    output = io.StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=CASE_FIELDS, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    public = output.getvalue().encode("utf-8-sig" if body.startswith(b"\xef\xbb\xbf") else "utf-8")
    return public, counts


def export(ref: str, target: str) -> dict:
    if Path(os.fsdecode(git("rev-parse", "--show-toplevel")).strip()).resolve() != ROOT:
        raise ExportError("脚本必须位于本项目Git根目录的 scripts/ 下。")
    destination = destination_path(target)
    commit = git("rev-parse", "--verify", "--end-of-options", ref + "^{commit}").decode().strip()
    if not re.fullmatch(r"(?:[0-9a-f]{40}|[0-9a-f]{64})", commit):
        raise ExportError("Git引用未解析为有效提交。")
    # 先审核整个已提交树；不读取工作树，也不复制Git对象或忽略文件。
    entries = git("ls-tree", "-r", "-z", commit).split(b"\0")
    expected = set()
    excluded = []
    for entry in filter(None, entries):
        info, raw_name = entry.split(b"\t", 1)
        mode, kind, _ = info.split(b" ")
        name = os.fsdecode(raw_name)
        reason = exclusion_reason(name)
        if reason is not None:
            excluded.append({"path": name, "reason": reason})
            continue
        check_path(name)
        if kind != b"blob" or mode not in {b"100644", b"100755"}:
            raise ExportError(f"公开范围不包含链接或子模块：{name}")
        expected.add(name)
    files = {}
    original_case = None
    counts = None
    archive_bytes = git("archive", "--format=tar", commit)
    with tarfile.open(fileobj=io.BytesIO(archive_bytes), mode="r:") as archive:
        for member in archive:
            if exclusion_reason(member.name) is not None:
                continue
            if member.isdir():
                continue
            check_path(member.name)
            if not member.isfile() or member.name in files:
                raise ExportError(f"归档中出现链接或重复文件：{member.name}")
            stream = archive.extractfile(member)
            if stream is None:
                raise ExportError(f"归档文件不可读取：{member.name}")
            body = stream.read()
            check_content(member.name, body)
            if member.name == CASE_PATH:
                original_case = body
                body, counts = redact_cases(body)
            files[member.name] = (body, member.mode)
    if set(files) != expected:
        raise ExportError("归档文件集与已提交树不一致；拒绝遗漏或增加文件。")
    if original_case is None or counts is None:
        raise ExportError("已提交树缺少案例登记表。")
    # 审核与脱敏全部完成后才写入；目标只含已核查的公开副本。
    destination_path(str(destination))
    destination.mkdir(parents=True, exist_ok=True)
    for name, (body, mode) in files.items():
        path = destination / name
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("xb") as handle:
            handle.write(body)
        path.chmod(0o755 if mode & 0o111 else 0o644)
    return {
        "ok": True, "message": "公开快照已导出；未初始化Git、联网或推送。",
        "source_commit": commit, "destination": str(destination), "file_count": len(files),
        "excluded_file_count": len(excluded), "excluded_files": excluded,
        **counts,
        "case_admission_original_sha256": hashlib.sha256(original_case).hexdigest(),
        "case_admission_public_sha256": hashlib.sha256(files[CASE_PATH][0]).hexdigest(),
    }


def main() -> int:
    parser = ChineseParser(
        description="导出本项目已提交的公开树，并在副本撤下未经许可的产率数值。",
        add_help=False,
    )
    parser._positionals.title = "位置参数"
    parser._optionals.title = "选项"
    parser.add_argument("destination", metavar="目标目录", help="本项目 temp/ 下的新建或空目录")
    parser.add_argument("--ref", default="HEAD", metavar="提交引用", help="只读取已提交树，默认 HEAD")
    parser.add_argument("-h", "--help", action="help", help="显示帮助并退出")
    args = parser.parse_args()
    try:
        result = export(args.ref, args.destination)
    except (ExportError, OSError, UnicodeError, ValueError, csv.Error, tarfile.TarError) as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
