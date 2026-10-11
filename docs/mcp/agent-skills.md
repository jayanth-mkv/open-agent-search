# Agent skills and plugins

Use the copyable setup prompt at the top of the [repository README](https://github.com/Jayanth-MKV/open-agent-search#readme). The `open-agent-search-setup` skill connects the local MCP server; `open-agent-search` guides research and source citation.

## Standalone skills

Run in the project where your agent should have search access:

```sh
npx --yes skills add Jayanth-MKV/open-agent-search --skill open-agent-search-setup open-agent-search --agent codex --copy --yes
```

Replace `codex` with your [agent identifier](https://github.com/vercel-labs/skills#supported-agents). Add `--global` only if you want the skills across projects. `--copy` avoids symlink requirements on Windows. This installs instructions; configure the MCP connection separately.

Without Node.js, copy the two directories from the repository's `skills/` folder into your client's supported skills directory. Codex uses `.agents/skills/` in a project; Claude Code uses `.claude/skills/`. Preserve existing skills and reload the client if needed.

## Plugins

Plugins bundle both skills and the stdio MCP configuration. Use a plugin or standalone skills, rather than installing both copies.

Codex CLI:

```sh
codex plugin marketplace add Jayanth-MKV/open-agent-search
codex plugin add open-agent-search@open-agent-search
```

Claude Code:

```text
/plugin marketplace add Jayanth-MKV/open-agent-search
/plugin install open-agent-search@open-agent-search --scope project
```

Install [uv](https://docs.astral.sh/uv/getting-started/installation/) first, then run the setup skill. The plugin invokes the published Python package using managed Python 3.12. Initial startup downloads dependencies; subsequent launches reuse the cache. If `uvx` is not on the client's PATH, use its absolute path in your local MCP configuration.

For local development, use the absolute checkout directory as the marketplace source. Repository plugins are not automatically listed in hosted plugin directories. Formats: [portable plugins](https://developers.openai.com/plugins/build/plugins), [Claude Code plugins](https://code.claude.com/docs/en/plugins-reference).

## MCP without a plugin

Merge this server with your client's existing servers:

```json
{
  "mcpServers": {
    "open-agent-search": {
      "command": "uvx",
      "args": ["--python", "3.12", "--from", "open-agent-search==1.0.4", "oas-mcp"]
    }
  }
}
```

Clients may use a different configuration wrapper; follow the [client guides](index.md). This stdio process is managed by the agent and does not require a separately hosted HTTP service.

## Verify

Reload the client if necessary, connect the server, and list its tools. Confirm the eight documented search/fetch tools, then ask for one short web search with a non-sensitive query. MCP discovery can succeed while a provider search fails; report those results separately.

Search queries and fetched URLs are sent to upstream providers and websites. No paid search API key is needed. Do not include secrets or private document content in search queries.
