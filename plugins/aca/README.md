# ACA for Claude, ChatGPT, Codex and Grok

**Run your outbound from the AI assistant you already use.** Ask *"Find leads that match my ICP"*, *"Draft a LinkedIn campaign for them"* or *"Why did my replies drop this week?"* and your assistant works directly in your ACA workspace: contacts, lead lists, campaigns, sequences, conversations and content.

- **One sign-in, no API keys.** Connect with OAuth; access is limited to the workspace you authorise.
- **31 skills** that know how ACA works: kickoff and ICP onboarding, finding and scoring leads, campaign strategy and copy, deliverability audits, reply scoring, pipeline status, content weeks and weekly optimisation.
- **You stay in control.** Campaigns and lead magnets are created as inactive drafts. Nothing is sent or activated until you do it in ACA.

## Install

**Claude Code**

```bash
claude plugin marketplace add Automated-Client-Acquisition/plugins
claude plugin install automated-client-acquisition@sartoux
```

**Codex:** `codex plugin marketplace add Automated-Client-Acquisition/plugins`, then install **Automated Client Acquisition**.

**Grok Build:** `/plugins` → Marketplace → add `Automated-Client-Acquisition/plugins` → **automated-client-acquisition**.

**Claude, ChatGPT or Grok on the web:** add the connector URL `https://mcp.automatedclientacquisition.com/mcp`. Step-by-step: [automatedclientacquisition.com/mcp](https://www.automatedclientacquisition.com/mcp).


**Cline and other MCP clients:** see [llms-install.md](llms-install.md) for the exact settings entry.

## Opt-outs

Everyone you reach through ACA can stop hearing from you:

- **Email:** every sequence email carries an unsubscribe link by default. One click stops all of that person's sequences and marks them unsubscribed, and ACA never enrolls unsubscribed, do-not-contact or bounced contacts in a sequence again.
- **Replies:** the skills treat any request to stop as final. Claude won't draft a follow-up, and it gives you the contact link to mark them Do not contact.
- **Lead lists and campaigns:** the skills leave suppressed contacts out and never recreate them to get around an opt-out.

## What it runs, and what it sends

The plugin contains Markdown skills and one remote connector setting. It runs no code on your computer. Your assistant talks to ACA's hosted server at `https://mcp.automatedclientacquisition.com/mcp` after you sign in to ACA and approve access. No credentials are stored in the plugin.

[Privacy](https://www.automatedclientacquisition.com/privacy) · [Terms](https://www.automatedclientacquisition.com/terms) · [Support](https://www.automatedclientacquisition.com/support)
