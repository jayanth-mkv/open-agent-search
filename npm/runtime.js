import { spawn } from 'node:child_process';
export const VERSION = '1.0.4';
export function commandFor(args, forced) {
  const mode = forced || args[0];
  if (!['mcp', 'serve'].includes(mode)) throw new Error('Choose mcp or serve. Run open-agent-search --help for commands.');
  return ['--python', '3.12', '--from', `open-agent-search==${VERSION}`, mode === 'mcp' ? 'oas-mcp' : 'open-agent-search', ...(forced ? args : args.slice(1))];
}
export function run(args, forced) {
  if (args.includes('--version') || args.includes('-V')) { console.log(VERSION); return; }
  if (!forced && (!args.length || args[0] === '--help' || args[0] === '-h')) {
    console.log(`Open Agent Search ${VERSION}\n\nUsage: open-agent-search <mcp|serve>\n  mcp    Start the local stdio MCP server\n  serve  Start the HTTP API on port 8000 (all interfaces)\n\nRequires Node.js 22+ and uv (https://docs.astral.sh/uv/getting-started/installation/).\nuv downloads Python 3.12 and the pinned Python package when needed.\nThe first launch needs internet access. Search uses upstream providers; no API key is required.`);
    return;
  }
  let command;
  try { command = commandFor(args, forced); }
  catch (error) { console.error(error.message); process.exitCode = 2; return; }
  const child = spawn(process.env.OPEN_AGENT_SEARCH_UVX || 'uvx', command, { stdio: 'inherit' });
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
  child.on('error', error => {
    console.error(error.code === 'ENOENT' ? 'Open Agent Search needs uv. Install it: https://docs.astral.sh/uv/getting-started/installation/' : error.message);
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => { process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 143); });
}
