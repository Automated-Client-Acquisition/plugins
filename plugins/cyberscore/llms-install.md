# Installing the CyberScore MCP server (for AI agents such as Cline)

CyberScore is a **remote** MCP server. There is nothing to clone, build or run locally: you only add its URL to the client's MCP settings.

- Endpoint: `https://www.cyberscorelab.com/api/mcp`
- Transport: Streamable HTTP
- Authentication: none. No account, API key or sign-in.

## Cline

Add this entry to `cline_mcp_settings.json` (Cline: MCP Servers → Configure → "Configure MCP Servers"; Cline CLI: `~/.cline/data/settings/cline_mcp_settings.json`). Keep `"type": "streamableHttp"`; without it Cline assumes the older SSE transport.

```json
{
  "mcpServers": {
    "cyberscore": {
      "type": "streamableHttp",
      "url": "https://www.cyberscorelab.com/api/mcp"
    }
  }
}
```

If the file already has other servers, add the `"cyberscore"` entry inside the existing `mcpServers` object instead of replacing it.

No further setup: the tools are available as soon as the server is enabled.

## Other clients

- Claude Code: `claude mcp add --transport http cyberscore https://www.cyberscorelab.com/api/mcp`
- Codex: `codex mcp add cyberscore --url https://www.cyberscorelab.com/api/mcp`
- Claude, ChatGPT or Grok on the web: add `https://www.cyberscorelab.com/api/mcp` as a custom connector.

## Check it works

Ask: "How secure is example.com?" The `check_domain_security` tool should return a grade from A to F with the problems to fix. `latest_exploited_vulnerabilities` lists the newest CISA known-exploited vulnerabilities.
