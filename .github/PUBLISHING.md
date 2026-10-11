# Publishing Open Agent Search

| Setting | Value |
| --- | --- |
| GitHub repository | `jayanth-mkv/open-agent-search` |
| npm account | `jayanth-mkv` |
| npm package | `open-agent-search` |
| PyPI account | `jayanth-mkv` |
| PyPI project | `open-agent-search` |
| Workflow filename | `release.yml` |
| npm environment | `npm` |
| PyPI environment | `pypi` |

The public author is Xplormity Collective. Registry account names identify publishing access, not authorship.

Both registries use GitHub OIDC. Configure their trusted publishers with the exact repository and `release.yml`; the environments differ as shown above. npm must allow publishing. Do not commit `.npmrc` or `.pypirc` credentials or add registry upload tokens to GitHub.

Keep package.json, pyproject.toml, uv.lock's project entry, npm/runtime.js, plugin manifests and MCP package pins at the same version. Push an annotated `vX.Y.Z` tag after checks pass. The release tests Node on Windows/macOS/Linux, tests Python, publishes the Python core, then publishes the npm launcher and public skill/plugin bundles.

The npm launcher requires Node.js 22+ and uv on PATH. uv installs managed Python 3.12 and the pinned Python package. The PyPI package is the implementation; npm does not replace it.

Use the release workflow's manual dispatch with an existing version tag to retry an unpublished version after fixing account settings. Never move an existing release tag. GitHub's Packages panel does not list external npm or PyPI packages; use README registry badges and GitHub release assets.
