#!/usr/bin/env python3
"""Install only this project's persistent user-level LAN workbench service."""
from pathlib import Path
import os
import socket
import subprocess


ROOT = Path(__file__).resolve().parents[1]
UNIT_NAME = "flavoglycolab-lan.service"
MARKER = "# Managed by FlavoGlycoLab scripts/install_lan_service.py"


def systemctl(*arguments, check=True):
    return subprocess.run(
        ["systemctl", "--user", *arguments],
        text=True, capture_output=True, check=check,
    )


def main():
    site = ROOT / "frontend/student"
    if not (site / "index.html").is_file():
        raise SystemExit("缺少student/index.html，未安装服务。")
    if not (ROOT / "scripts/serve_lab.py").is_file():
        raise SystemExit("缺少工作台服务入口，未安装服务。")
    # Keep the deployment root free of symlinks; runtime also checks resolved paths.
    if site.is_symlink() or any(path.is_symlink() for path in site.rglob("*")):
        raise SystemExit("student含符号链接，先核对资产边界；未安装服务。")
    config_root = Path(os.environ.get("XDG_CONFIG_HOME", str(Path.home() / ".config")))
    destination = config_root / "systemd/user" / UNIT_NAME
    if destination.is_symlink():
        raise SystemExit("同名服务配置是符号链接，未覆盖。")
    existing = destination.read_text() if destination.exists() else None
    if existing is not None and not existing.startswith(MARKER + "\n"):
        raise SystemExit("同名服务不属于本安装器，未覆盖。")
    running = systemctl("is-active", "--quiet", UNIT_NAME, check=False).returncode == 0
    if not running:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
                probe.bind(("0.0.0.0", 8766))
        except OSError as error:
            raise SystemExit(f"8766端口不可用，未安装服务：{error}") from error
    workspace = str(ROOT).replace("%", "%%")
    if "\n" in workspace or "\r" in workspace:
        raise SystemExit("项目路径含换行，未安装服务。")
    unit = (ROOT / "ops/systemd/flavoglycolab-lan.service.in").read_text().replace("@WORKSPACE@", workspace)
    changed = existing != unit
    if changed:
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(unit)
        destination.chmod(0o600)
    subprocess.run(["systemd-analyze", "--user", "verify", str(destination)], check=True)
    systemctl("daemon-reload")
    systemctl("enable", "--now", UNIT_NAME)
    if running and changed:
        systemctl("restart", UNIT_NAME)
    systemctl("is-active", "--quiet", UNIT_NAME)
    print(f"active/enabled: {UNIT_NAME}; HTTP 8766; student资产根；配置：{destination}")


if __name__ == "__main__":
    main()
