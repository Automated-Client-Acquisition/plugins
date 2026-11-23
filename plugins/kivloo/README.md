# Kivloo for Claude, ChatGPT, Codex and Grok

Connect your AI assistant to your [Kivloo](https://kivloo.com) workspace. Draft HACCP plans, SOPs, workplace safety and maritime documents, build compliance checklists, and analyse your inspection and sensor records, with every finding linked to the record behind it.

## Install

**Claude Code**

```sh
claude plugin marketplace add Automated-Client-Acquisition/kivloo-plugins
claude plugin install kivloo@kivloo
```

**Codex**

```sh
codex plugin marketplace add Automated-Client-Acquisition/kivloo-plugins
codex plugin add kivloo@kivloo
```

**Grok Build**

```sh
grok plugin install "Automated-Client-Acquisition/kivloo-plugins#plugins/kivloo"
```

**Claude (web and desktop), ChatGPT and grok.com:** add a custom connector with this server URL:

```
https://kivloo.com/api/mcp
```

The first time you use it, your assistant asks you to sign in to Kivloo and allow access. Your workspace needs an active trial or subscription.

## What you can do

- **Documents:** draft HACCP plans, US FSMA food safety and traceability plans, SOPs, work instructions, risk assessments, method statements, OSHA programs, emergency and fire plans, and ship SMS procedures. Each one is saved to Kivloo as a draft of its own type.
- **Checklists:** build a checklist for any regulation or standard you name, with typed answers, readings, notes and photo fields. It is saved as a private template.
- **Analysis:** inspection completion, scores and deviations, corrective actions, and recorded sensor readings, filtered by date and site.
- **Traceability:** follow a recorded lot and see where the evidence ends.

Seven skills guide the assistant: haccp-plan, workplace-safety, maritime-compliance, sop-drafting, checklist-drafting, data-analysis and operations-review.

## Your team stays in charge

- Drafts and new checklists need review by a responsible person before use. Your assistant never approves, signs or publishes them, and never claims anything is compliant or certified.
- Your Kivloo permissions apply. Only workspace administrators can save documents and checklists.
- The assistant can't place orders, send messages or contact regulators.

## Privacy

Information your assistant requests from Kivloo is returned to that AI app and handled under its policies. You can see and revoke connected apps in Kivloo under **Settings → AI connections**. Access tokens that were already issued may keep working until they expire.

- Privacy policy: https://kivloo.com/privacy
- Terms: https://kivloo.com/terms
- Support: https://kivloo.com/contact

## License

The plugin files are MIT-licensed (see LICENSE). The license does not cover the Kivloo service itself.
