"""Workspace-local public metadata and optional historical research evidence."""
from __future__ import annotations

import argparse
from collections import Counter
import csv
import hashlib
import json
from pathlib import Path
import sys
from typing import Any

ROOT = Path(__file__).resolve().parents[3]


def configure_console() -> None:
    """Keep Chinese CLI output valid when Windows redirects a legacy-codepage pipe."""
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="backslashreplace")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


class DataUnavailable(ValueError):
    """An explicitly selected optional dataset is absent, not an empty dataset."""


class EvidenceCatalog:
    def __init__(self, workspace: str | Path = ROOT, profile: str | None = None):
        self.root = Path(workspace).resolve()
        manifest = json.loads(self.resolve_local("metadata/active.json").read_text(encoding="utf-8"))
        if manifest.get("relative_path_policy") != "workspace_root":
            raise ValueError("Only workspace-relative datasets may be used")
        self.profile = profile or manifest["default_profile"]
        if self.profile not in manifest["profiles"]:
            raise ValueError("Unknown data profile")
        self.active = {**manifest, **manifest["profiles"][self.profile]}

    def resolve_local(self, relative_path: str) -> Path:
        if Path(relative_path).is_absolute():
            raise ValueError("Absolute dataset paths are not allowed")
        candidate = (self.root / relative_path).resolve()
        try:
            candidate.relative_to(self.root)
        except ValueError as exc:
            raise ValueError(f"Cross-workspace access blocked: {relative_path}") from exc
        return candidate

    def records(self) -> list[dict[str, Any]]:
        if self.profile != "research":
            raise DataUnavailable("public提供真实案例索引，不含全量研究记录；请使用cases()。全量研究须显式选择--profile research。")
        path = self.resolve_local(self.active["records"])
        if not path.is_file():
            raise DataUnavailable("尚未导入可选研究包。日常开发不需要它；详见docs/operations/collaboration.md。取得团队研究包后运行：python scripts/research_bundle.py import 包路径 --sha256 提供方给出的SHA256")
        if sha256_file(path) != self.active["records_sha256"]:
            raise ValueError("Source record hash mismatch")
        data = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(data, list):
            raise ValueError("records must be a list")
        return data

    def registry(self) -> list[dict[str, str]]:
        with self.resolve_local(self.active["source_registry"]).open(encoding="utf-8-sig", newline="") as fh:
            return list(csv.DictReader(fh))

    def cases(self) -> list[dict[str, str]]:
        with self.resolve_local(self.active["case_registry"]).open(encoding="utf-8-sig", newline="") as fh:
            return list(csv.DictReader(fh))

    def public_sources(self) -> dict[str, str]:
        return json.loads(self.resolve_local(self.active["public_sources"]).read_text(encoding="utf-8"))["files"]

    def verify_sources(self, hash_check: bool = True) -> dict[str, Any]:
        if self.profile == "public":
            rows = [{"local_path": path, "sha256": sha} for path, sha in self.public_sources().items()]
            known_missing, optional_roles = set(), set()
        else:
            rows = self.registry()
            known_missing = set(self.active["missing_nonchemical_source"])
            optional_roles = set(self.active["optional_source_roles"])
        errors, skipped, optional_absent = [], [], []
        present = 0
        for row in rows:
            p = self.resolve_local(row["local_path"])
            if not p.is_file():
                if row["local_path"] in known_missing:
                    skipped.append(row["local_path"])
                elif row.get("source_role") in optional_roles:
                    optional_absent.append(row["local_path"])
                else:
                    errors.append("missing: " + row["local_path"])
                continue
            present += 1
            if "size_bytes" in row and p.stat().st_size != int(row["size_bytes"]):
                errors.append("size mismatch: " + row["local_path"])
            if hash_check and sha256_file(p) != row["sha256"]:
                errors.append("SHA mismatch: " + row["local_path"])
        return {"profile": self.profile, "registered": len(rows), "present": present,
                "missing_os_metadata": skipped, "optional_absent": optional_absent,
                "errors": errors, "ok": not errors}

    def summary(self, verify_sources: bool = False) -> dict[str, Any]:
        records = self.records() if self.profile == "research" else None
        cases = self.cases()
        if self.active.get("teaching_case_review") != "pending_teacher_review":
            raise ValueError("Unauthorized teaching status elevation")
        if any(r["admission_status"] != "pending_teacher_review" or
               r["human_review_status"] != "not_performed" for r in cases):
            raise ValueError("Teaching case admission requires real review")
        result = {"workspace": str(self.root), "project": "FlavoGlycoLab", "profile": self.profile,
                  "resource_version": self.active["resource_version"],
                  "records_available": records is not None,
                  "record_count": len(records) if records is not None else None,
                  "by_kind": dict(Counter(r.get("kind") for r in records)) if records is not None else {},
                  "case_entries": len(cases), "approved_teaching_cases": 0,
                  "research_candidate_only": True, "public_release": False}
        if verify_sources:
            result["source_integrity"] = self.verify_sources()
        return result


def main() -> None:
    configure_console()
    parser = argparse.ArgumentParser(description="公开案例索引（默认）或可选本地研究证据核验")
    parser.add_argument("--workspace", default=".")
    parser.add_argument("--profile", choices=("public", "research"))
    parser.add_argument("--verify-sources", action="store_true")
    args = parser.parse_args()
    try:
        result = EvidenceCatalog(args.workspace, args.profile).summary(args.verify_sources)
    except (OSError, ValueError, KeyError) as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False))
        raise SystemExit(1) from None
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if "source_integrity" in result and not result["source_integrity"]["ok"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
