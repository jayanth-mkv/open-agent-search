"""Prepare public npm, plugin and skill packages with synchronized versions."""

import json
import subprocess
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parents[1]
version = json.loads((root / "package.json").read_text())["version"]
dist = root / "dist"
dist.mkdir(exist_ok=True)
subprocess.run(["npm", "pack", "--pack-destination", "dist"], cwd=root, check=True)
subprocess.run(["python", "scripts/build_mcpb.py"], cwd=root, check=True)
files = [
    "README.md",
    "LICENSE",
    "plugin.json",
    "mcp.json",
    ".mcp.json",
    ".codex-plugin/plugin.json",
    ".claude-plugin/plugin.json",
]
files += [p.relative_to(root).as_posix() for p in (root / "skills").rglob("*") if p.is_file()]
for kind in ("plugin", "skills"):
    with ZipFile(dist / f"open-agent-search-{kind}-{version}.zip", "w", ZIP_DEFLATED) as archive:
        for name in files:
            if kind == "skills" and not name.startswith("skills/"):
                continue
            archive.write(root / name, name if kind == "plugin" else name.removeprefix("skills/"))
