# CyberScore for Claude, ChatGPT, Codex and Grok

**Find out in 30 seconds if a business can be spoofed, hacked or phished, right from your AI assistant.** Ask *"How secure is acme.com?"* and get an A–F grade, the problems that matter most first, plain-English explanations and copy-paste fixes, with a link to the full report you can forward to whoever runs the DNS or website.

What it checks, from the outside, the way an attacker would look:

- **Email spoofing:** SPF, DMARC and DKIM, so nobody can send invoices "from" your domain.
- **Website security:** HTTPS redirects, certificate health, outdated TLS, security headers, and files that should never be public.
- **Exposed services:** what internet-wide scanners already publish about the domain's servers (open databases, remote desktop, reported CVEs).
- **What attackers use right now:** the newest vulnerabilities CISA confirms are exploited in the wild.

Free. No account, no API key, no setup.


## Install from the Sartoux marketplace

```bash
claude plugin marketplace add Automated-Client-Acquisition/plugins
claude plugin install cyberscore@sartoux
```


**Cline and other MCP clients:** see [llms-install.md](llms-install.md) for the exact settings entry.

## Install

**Claude (web/desktop):** Settings → Connectors → Add custom connector → `https://www.cyberscorelab.com/api/mcp`

**Claude Code**

```bash
claude mcp add --transport http cyberscore https://www.cyberscorelab.com/api/mcp
```

**Codex**

```bash
codex mcp add cyberscore --url https://www.cyberscorelab.com/api/mcp
```

**ChatGPT:** Settings → Apps & Connectors → add `https://www.cyberscorelab.com/api/mcp` (no authentication).

**Grok:** grok.com → Connectors → New Connector → Custom → the URL above. Grok Build: `grok mcp add --transport http cyberscore https://www.cyberscorelab.com/api/mcp`.

## What it runs, and what it sends

This plugin contains one skill and points your assistant at CyberScore's hosted server (`https://www.cyberscorelab.com/api/mcp`). It runs no code on your computer and needs no credentials.

When you ask for a check, the server receives only the domain name. It reads public DNS and email records, the website's certificate and response headers, public certificate-transparency logs and public internet-scan data (Shodan InternetDB), and requests a few standard URLs on the website as a browser could. Results are cached for 10 minutes. No personal data is collected: the server logs only the domain checked and its grade. Tools: `check_domain_security`, `latest_exploited_vulnerabilities` (both read-only).

[cyberscorelab.com](https://www.cyberscorelab.com) · [Contact](https://www.cyberscorelab.com/contact) · [Privacy](https://www.cyberscorelab.com/privacy) · [Terms](https://www.cyberscorelab.com/terms)
