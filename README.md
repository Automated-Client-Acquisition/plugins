# Sartoux Group plugins

Plugins for **Claude Code, Codex and Grok Build**, one marketplace for every product. Each plugin bundles the product's connector and the skills that know how to use it.

## Add the marketplace once

```bash
# Claude Code
claude plugin marketplace add Automated-Client-Acquisition/plugins

# Codex
codex plugin marketplace add Automated-Client-Acquisition/plugins
```

Grok Build: `/plugins` → Marketplace → add `Automated-Client-Acquisition/plugins`.

Then install the plugins for the products you use.

## By product

### ACA (Automated Client Acquisition)
B2B outbound: leads, LinkedIn and email campaigns, inbox, content. [automatedclientacquisition.com](https://www.automatedclientacquisition.com)

| Plugin | What it does | Install (Claude Code) |
|---|---|---|
| [`aca`](plugins/aca) | Run outbound from your assistant: find and score leads, draft campaigns, check deliverability, triage replies, plan content. 31 skills + the ACA connector (OAuth). | `claude plugin install aca@sartoux` |
| [`aca-outbound-domain-sites`](plugins/aca-outbound-domain-sites) | Add-on: give every cold-email sending domain its own landing page, deployed and DNS-pointed without breaking mail. | `claude plugin install aca-outbound-domain-sites@sartoux` |

### Kivloo
Food safety, traceability and workplace safety. [kivloo.com](https://kivloo.com)

| Plugin | What it does | Install (Claude Code) |
|---|---|---|
| [`kivloo`](plugins/kivloo) | Draft HACCP plans, SOPs and compliance checklists, analyse inspections and sensor records, trace lots. Kivloo connector (OAuth) + skills. | `claude plugin install kivloo@sartoux` |

### Funnel Farming
Direct-response funnels built with Claude: info products, advertorials, VSLs, webinars, challenges and local businesses. The Funnel Farming plugin comes with the Funnel Farming pack and installs from the buyers' private repository. [funnel-farming.com](https://funnel-farming.com)

### CyberScore
Free outside-in security checks for small businesses. [cyberscorelab.com](https://www.cyberscorelab.com)

| Plugin | What it does | Install (Claude Code) |
|---|---|---|
| [`cyberscore`](plugins/cyberscore) | Grade any domain's security A–F with plain-English fixes, and list vulnerabilities being exploited now. Free connector, no sign-in. | `claude plugin install cyberscore@sartoux` |

## Using Claude, ChatGPT or Grok on the web?

Web chats use connectors, not plugins. Add the product's connector URL in your assistant's connector settings:

| Product | Connector URL | Sign-in |
|---|---|---|
| ACA | `https://mcp.automatedclientacquisition.com/mcp` | OAuth |
| Kivloo | `https://kivloo.com/api/mcp` | OAuth (active trial or subscription) |
| CyberScore | `https://www.cyberscorelab.com/api/mcp` | None |

## Security

Every plugin here ships Markdown skills and remote connector settings only, except `aca-outbound-domain-sites`, whose skill includes scripts and a site template it uses to build and deploy your domain sites (see its README). Each plugin's README says exactly what it runs and what it sends.

Published by Sartoux Group, Amelia House, Crescent Road, Worthing, BN11 1QR, England (company number 12340219). Licences are in each plugin folder.
