"""Local-only, standard-library evidence catalog for FlavoGlycoLab.

Historical chemistry records are research candidates, not approved teaching results.
This module never looks up parent projects, old workspaces or network resources.
"""
from __future__ import annotations
import argparse
import csv
import hashlib
import json
from collections import Counter
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[3]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


class EvidenceCatalog:
    def __init__(self, workspace: str | Path = ROOT):
        self.root = Path(workspace).resolve()
        self.active = json.loads(self.resolve_local("metadata/active.json").read_text(encoding="utf-8"))
        if self.active.get("relative_path_policy") != "workspace_root":
            raise ValueError("Only workspace-relative datasets may be used")

    def resolve_local(self, relative_path: str) -> Path:
        candidate = (self.root / relative_path).resolve()
        try:
            candidate.relative_to(self.root)
        except ValueError as exc:
            raise ValueError(f"Cross-workspace access blocked: {relative_path}") from exc
        return candidate

    def records(self) -> list[dict[str, Any]]:
        path = self.resolve_local(self.active["records"])
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
        with self.resolve_local("data/registries/case_admission.csv").open(encoding="utf-8-sig", newline="") as fh:
            return list(csv.DictReader(fh))

    def verify_sources(self, hash_check: bool = True) -> dict[str, Any]:
        known_missing = {"data/raw/legacy/import_raw/.DS_Store"}
        errors = []
        skipped = []
        present = 0
        for row in self.registry():
            p = self.resolve_local(row["local_path"])
            if not p.is_file():
                (skipped if row["local_path"] in known_missing else errors).append(row["local_path"])
                continue
            present += 1
            if p.stat().st_size != int(row["size_bytes"]):
                errors.append("size mismatch: " + row["local_path"])
            if hash_check and sha256_file(p) != row["sha256"]:
                errors.append("SHA mismatch: " + row["local_path"])
        return {"registered": len(self.registry()), "present": present,
                "missing_os_metadata": skipped, "errors": errors, "ok": not errors}

    def summary(self, verify_sources: bool = False) -> dict[str, Any]:
        records = self.records()
        cases = self.cases()
        status = self.active.get("teaching_case_review")
        if status != "pending_teacher_review":
            raise ValueError("Unauthorized teaching status elevation")
        if any(r["admission_status"] != "pending_teacher_review" or
               r["human_review_status"] != "not_performed" for r in cases):
            raise ValueError("Teaching case admission requires real review")
        result = {"workspace": str(self.root), "project": "FlavoGlycoLab",
                  "resource_version": self.active["resource_version"],
                  "record_count": len(records), "by_kind": dict(Counter(r.get("kind") for r in records)),
                  "case_entries": len(cases), "approved_teaching_cases": 0,
                  "research_candidate_only": True, "public_release": False}
        if verify_sources:
            result["source_integrity"] = self.verify_sources()
        return result


def main() -> None:
    parser = argparse.ArgumentParser(description="Local FlavoGlycoLab research-evidence validator")
    parser.add_argument("--workspace", default=str(ROOT))
    parser.add_argument("--verify-sources", action="store_true")
    args = parser.parse_args()
    result = EvidenceCatalog(args.workspace).summary(args.verify_sources)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if "source_integrity" in result and not result["source_integrity"]["ok"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
