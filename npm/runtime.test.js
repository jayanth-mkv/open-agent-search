import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { commandFor } from './runtime.js';
test('MCP and HTTP select the pinned Python entry points and preserve arguments', () => {
  assert.deepEqual(commandFor(['mcp', '--help']), ['--python', '3.12', '--from', 'open-agent-search==1.0.4', 'oas-mcp', '--help']);
  assert.equal(commandFor(['serve'])[4], 'open-agent-search');
  assert.equal(commandFor([], 'mcp')[4], 'oas-mcp');
  assert.throws(() => commandFor(['unknown']), /Choose/);
});
test('metadata commands run without Python and missing uv fails clearly on stderr', () => {
  const cwd = new URL('..', import.meta.url);
  const version = spawnSync(process.execPath, ['npm/cli.js', '--version'], { cwd, encoding: 'utf8' });
  assert.equal(version.status, 0); assert.equal(version.stdout.trim(), '1.0.4');
  const missing = spawnSync(process.execPath, ['npm/cli.js', 'mcp'], { cwd, encoding: 'utf8', env: { ...process.env, OPEN_AGENT_SEARCH_UVX: '/nonexistent/oas-uvx' } });
  assert.equal(missing.status, 1); assert.equal(missing.stdout, ''); assert.match(missing.stderr, /needs uv/);
});
