"""Build a local MCP bundle with the pinned npm-to-Python launcher."""

import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parents[1]
package = json.loads((root / "package.json").read_text(encoding="utf-8"))
manifest = json.loads((root / "mcpb.json").read_text(encoding="utf-8"))
manifest["version"] = package["version"]
destination = root / "dist"
destination.mkdir(exist_ok=True)
with ZipFile(
    destination / f"open-agent-search-{package['version']}.mcpb", "w", ZIP_DEFLATED
) as bundle:
    bundle.writestr("manifest.json", json.dumps(manifest, indent=2) + "\n")
    # Include only the launcher and public metadata, never local configuration.
    for name in ["package.json", "npm/mcp.js", "npm/runtime.js", "LICENSE", "README.md"]:
        bundle.write(root / name, name)
print("Built local Open Agent Search MCP bundle (Node.js and uv required).")
