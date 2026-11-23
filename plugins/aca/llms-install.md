# Installing the ACA (Automated Client Acquisition) MCP server (for AI agents such as Cline)

ACA (Automated Client Acquisition) is a **remote** MCP server. There is nothing to clone, build or run locally: you only add its URL to the client's MCP settings.

- Endpoint: `https://mcp.automatedclientacquisition.com/mcp`
- Transport: Streamable HTTP
- Authentication: OAuth. The user signs in with their ACA account (https://www.automatedclientacquisition.com) in the browser; no API key goes in the config.

## Cline

Add this entry to `cline_mcp_settings.json` (Cline: MCP Servers → Configure → "Configure MCP Servers"; Cline CLI: `~/.cline/data/settings/cline_mcp_settings.json`). Keep `"type": "streamableHttp"`; without it Cline assumes the older SSE transport.

```json
{
  "mcpServers": {
    "aca": {
      "type": "streamableHttp",
      "url": "https://mcp.automatedclientacquisition.com/mcp"
    }
  }
}
```

If the file already has other servers, add the `"aca"` entry inside the existing `mcpServers` object instead of replacing it.

After saving, Cline shows the server as needing authentication. Ask the user to click **Authenticate** next to the `aca` server (or follow the sign-in link Cline prints) and approve access to their ACA workspace. Do not ask the user for a password or token in chat.

## Other clients

- Claude Code: `claude mcp add --transport http aca https://mcp.automatedclientacquisition.com/mcp`
- Codex: `codex mcp add aca --url https://mcp.automatedclientacquisition.com/mcp`
- Claude, ChatGPT or Grok on the web: add `https://mcp.automatedclientacquisition.com/mcp` as a custom connector.

## Check it works

Ask: "What should I do next in ACA?" The `get_started` tool should return the workspace stage and up to three next steps.
