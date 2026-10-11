<p align="center">
  <img src="docs/assets/logo.svg" width="132" alt="Open Agent Search logo">
</p>

<h1 align="center">Open Agent Search</h1>

<p align="center"><strong>One self-hostable search and content layer for AI agents and applications.</strong></p>

<p align="center">
  <a href="https://pypi.org/project/open-agent-search/"><img alt="PyPI" src="https://img.shields.io/pypi/v/open-agent-search"></a>
  <a href="https://www.python.org/"><img alt="Python 3.12+" src="https://img.shields.io/badge/Python-3.12%2B-3776AB?logo=python&logoColor=white"></a>
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/License-MIT-2EA44F"></a>
  <a href="https://jayanth-mkv.github.io/open-agent-search/"><img alt="Documentation" src="https://img.shields.io/badge/Docs-Open-6C5CE7"></a>
</p>

<p align="center">
  <a href="#what-is-open-agent-search">What is OAS?</a> ·
  <a href="#set-up-with-your-agent">Agent setup</a> ·
  <a href="#capabilities">Capabilities</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#search-surface">API surface</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

## Set up with your agent

Copy this prompt into your coding agent:

```text
Set up Open Agent Search for this project using
https://github.com/Jayanth-MKV/open-agent-search. Read its README and
skills/open-agent-search-setup/SKILL.md. Reuse uv if installed, otherwise
install it using the official uv instructions for my OS. Configure the
local stdio MCP server with the pinned package and managed Python version
from the repository's MCP manifest. Merge the server into this agent's
configuration without replacing existing servers. Install the
open-agent-search-setup and open-agent-search skills for this agent in
project scope. Verify the MCP connection and available tools, then try
one web search. Tell me if a client restart is needed. No API key is required.
```

## Installation commands

With [uv](https://docs.astral.sh/uv/getting-started/installation/) installed, run the MCP server in an isolated environment:

```sh
uvx --python 3.12 --from open-agent-search==1.0.3 oas-mcp
```

`uv` can download Python 3.12 when it is missing. The first run downloads dependencies; the client starts and stops this stdio process after configuration.

For a persistent PyPI installation and HTTP server:

```sh
uv tool install --python 3.12 open-agent-search==1.0.3
open-agent-search
```

The HTTP server listens on port 8000 on all interfaces. Use stdio for an agent that only needs local tools.

Install both skills for Codex in the current project:

```sh
npx --yes skills add Jayanth-MKV/open-agent-search --skill open-agent-search-setup open-agent-search --agent codex --copy --yes
```

Replace `codex` with `claude-code`, `cursor`, `opencode`, or your [supported agent](https://github.com/vercel-labs/skills#supported-agents). Add `--global` only for installation across projects. [Plugin and manual setup](docs/mcp/agent-skills.md). An npm launcher is planned; the PyPI commands above are available now.

In Claude Code 2.1.275+, install both skills and the MCP configuration in one step:

```text
/plugin install open-agent-search --marketplace Jayanth-MKV/open-agent-search --scope project
```

<p align="center">
  <img src="docs/assets/readme-architecture.svg" width="1000" alt="Open Agent Search architecture showing MCP clients and applications connecting through local MCP or HTTP service paths to one shared search and content layer and DDGS providers">
</p>

## What is Open Agent Search?

Open Agent Search (OAS) is an independent retrieval layer for AI agents and applications. It provides one consistent search and content surface across local and deployed integrations.

OAS replaces separate adapters for every search vertical with one consistent tool surface. Run it locally for a single coding agent or deploy the HTTP service for shared agent and application workloads.

Search sources, transports, and client integrations can evolve without changing the repository's core goal: give agents and applications a dependable retrieval boundary they can control.

## Connect MCP or HTTP

### Add search to Claude Code

```bash
claude mcp add oas -- uvx --python 3.12 --from open-agent-search==1.0.3 oas-mcp
```

Restart Claude Code, then ask it to search the web, news, images, videos, or books. The same `uvx` command works with Cursor, VS Code, Windsurf, OpenClaw, and other MCP clients.

<details>
<summary>Generic MCP configuration</summary>

```json
{
  "mcpServers": {
    "open-agent-search": {
      "command": "uvx",
      "args": ["--python", "3.12", "--from", "open-agent-search==1.0.3", "oas-mcp"]
    }
  }
}
```

</details>

### Run the HTTP API

```bash
uv tool install --python 3.12 open-agent-search==1.0.3
open-agent-search
```

Make a first search:

```bash
curl "http://localhost:8000/api/search/text?q=python+programming&max_results=5"
```

The server exposes REST endpoints at `http://localhost:8000`, interactive API docs at `/docs`, and streamable HTTP MCP at `/ai/mcp`.

## Capabilities

- **One search layer, multiple transports.** Use stdio MCP locally or serve REST and MCP over HTTP.
- **No provider API key required.** Search is powered by the `ddgs` library.
- **Self-hostable.** Run locally, in Docker, or deploy the HTTP service to Vercel.
- **Framework-independent.** The protocol surface works across major MCP clients and agent stacks.
- **Production-minded defaults.** Typed FastAPI routes, rate limiting, health checks, tests, and deployment guides are included.

<p align="center">
  <img src="docs/assets/readme-why.svg" width="92%" alt="Before and after Open Agent Search: six separate adapters become one search connection">
</p>

## Architecture

The local MCP command and the HTTP service share the same search and content capabilities. Choose the connection path that matches where the consuming agent or application runs.

### Two deployment paths

| Path | Command or endpoint | Best for |
| --- | --- | --- |
| Local MCP | `uvx --python 3.12 --from open-agent-search==1.0.3 oas-mcp` | Giving a desktop or coding agent search with no persistent server |
| HTTP service | `open-agent-search` | Applications, shared agent environments, REST clients, and remote MCP |

## Search surface

| Capability | REST endpoint | MCP availability |
| --- | --- | --- |
| Text search | `GET /api/search/text` | Yes |
| Image search | `GET /api/search/images` | Yes |
| Video search | `GET /api/search/videos` | Yes |
| News search | `GET /api/search/news` | Yes |
| Book search | `GET /api/search/books` | Yes |
| Unified search | `GET /api/search/all` | Yes |
| Fetch one page | `GET /api/content/fetch` | Yes |
| Fetch multiple pages | `POST /api/content/fetch-multiple` | Yes |

See the [API reference](https://jayanth-mkv.github.io/open-agent-search/api/endpoints/) and [MCP tool reference](https://jayanth-mkv.github.io/open-agent-search/api/mcp-tools/) for parameters and response shapes.

## Privacy model

OAS does not require an OAS account or a search-provider API key, and it can run on infrastructure you control. Search queries still have to reach upstream search providers through DDGS, so this project should not be treated as an anonymity network. Review your deployment logs, network policy, and upstream-provider terms for sensitive workloads.

## Install and deploy

### From source

```bash
git clone https://github.com/jayanth-mkv/open-agent-search.git
cd open-agent-search
uv sync
uv run open-agent-search
```

### Docker

```bash
docker compose up -d
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJayanth-MKV%2Fopen-agent-search&project-name=open-agent-search&repository-name=open-agent-search)

Deployment details: [Docker](https://jayanth-mkv.github.io/open-agent-search/deployment/docker/) · [Vercel](https://jayanth-mkv.github.io/open-agent-search/deployment/vercel/)

## Documentation

- [Installation](https://jayanth-mkv.github.io/open-agent-search/getting-started/installation/)
- [Quick start](https://jayanth-mkv.github.io/open-agent-search/getting-started/quickstart/)
- [MCP integrations](https://jayanth-mkv.github.io/open-agent-search/mcp/)
- [API endpoints](https://jayanth-mkv.github.io/open-agent-search/api/endpoints/)
- [Contributing](https://jayanth-mkv.github.io/open-agent-search/contributing/)

## Development

```bash
uv sync --group dev
uv run pytest
uv run ruff check .
```

Open Agent Search is currently beta software. Bug reports and focused pull requests are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)

Maintained by **Xplormity Collective**.
