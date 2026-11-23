#!/usr/bin/env bash
# Attach every configured domain (apex + www) to the linked Vercel project.
#
#   ./scripts/add-domains.sh            # dry run, prints only
#   ./scripts/add-domains.sh --apply    # actually adds them
#
# Reads the domain list from lib/brands.ts so the two cannot drift, and the
# project/team from .vercel/project.json (run `vercel link` first).
#
# Uses the REST API rather than `vercel domains add`, because the CLI exits
# non-zero even on success and swallows the real reason on failure.
#
# Adding a domain does NOT change DNS. Vercel shows each as "Invalid
# Configuration" until the records point at it — run `node scripts/dns-plan.mjs`.

set -euo pipefail
cd "$(dirname "$0")/.."

APPLY="${1:-}"

[ -f .vercel/project.json ] || { echo "not linked — run: npx vercel link" >&2; exit 1; }
PID=$(python3 -c "import json;print(json.load(open('.vercel/project.json'))['projectId'])")
TID=$(python3 -c "import json;print(json.load(open('.vercel/project.json'))['orgId'])")

TOKEN="${VERCEL_TOKEN:-$(grep '^VERCEL_TOKEN=' .env.local 2>/dev/null | cut -d= -f2- || true)}"
[ -n "$TOKEN" ] || { echo "VERCEL_TOKEN not set and not in .env.local" >&2; exit 1; }

DOMAINS=$(grep -oE '^\s*domain: "[^"]+"' lib/brands.ts | grep -oE '[a-z0-9.-]+\.[a-z]+')
COUNT=$(printf '%s\n' "$DOMAINS" | wc -l | tr -d ' ')

echo "Project: $PID"
echo "Domains: $COUNT apex + $COUNT www = $((COUNT * 2)) total"
[ "$APPLY" != "--apply" ] && echo "MODE:    dry run (pass --apply to execute)"
echo

added=0; existed=0; failed=0
for d in $DOMAINS; do
  for host in "$d" "www.$d"; do
    if [ "$APPLY" != "--apply" ]; then
      echo "  would add  $host"
      continue
    fi
    resp=$(curl -s -m 60 -X POST \
      "https://api.vercel.com/v10/projects/$PID/domains?teamId=$TID" \
      -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
      -d "{\"name\":\"$host\"}")
    code=$(printf '%s' "$resp" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('error',{}).get('code','ok'))" 2>/dev/null || echo parse_error)
    case "$code" in
      ok)                  echo "  added     $host"; added=$((added+1)) ;;
      domain_already_in_use|domain_taken)
                           echo "  exists    $host"; existed=$((existed+1)) ;;
      *)                   msg=$(printf '%s' "$resp" | python3 -c "import sys,json;print(json.load(sys.stdin).get('error',{}).get('message','?')[:90])" 2>/dev/null || echo "$resp")
                           echo "  FAILED    $host — $code: $msg"; failed=$((failed+1)) ;;
    esac
  done
done

if [ "$APPLY" = "--apply" ]; then
  echo
  echo "added=$added  already-present=$existed  failed=$failed"
  echo "Next: node scripts/dns-plan.mjs   # exact DNS records, grouped by provider"
fi
