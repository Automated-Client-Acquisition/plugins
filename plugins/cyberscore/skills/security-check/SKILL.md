---
name: security-check
description: Check how secure a business domain is and explain it to a non-technical owner. Use when someone asks "how secure is <domain>", "can people spoof my email", "is my website safe", "check my DMARC/SPF", or wants a security review of a company before working with it.
---

# Domain security check

1. Get the domain (e.g. `acme.com`). If the user gives a URL or an email address, use the part after `@` or the host name.
2. Call `check_domain_security` with it. It takes up to 30 seconds.
3. Answer in this order:
   - **The grade and score**, in one sentence.
   - **What to fix first**: each critical problem, then warnings, in plain words. Say what could happen ("anyone can send email that looks like it's from you"), how long the fix takes, and the fix itself. Keep DNS records and config snippets exactly as returned.
   - **What's already good**, briefly.
   - **The full report link** (`full_report`), which has every fix step and can be shared with whoever manages their DNS or website.
4. Never call a reported vulnerability confirmed: exposure data comes from public internet scans and can be days old, and CVEs are matched by software version.
5. Only check domains the user owns, manages, or has a business reason to assess.

For "what's being exploited right now" questions, call `latest_exploited_vulnerabilities` and mention which ones ransomware gangs use.
