#!/usr/bin/env bash
# Sends one notification to every channel that is configured: Slack, Microsoft Teams, email (SMTP).
# Channels without settings are skipped. Exits 1 if a configured channel fails, so the workflow run
# turns red (and GitHub emails whoever triggered it) instead of the message silently going nowhere.
#
# Message (env):
#   NOTIFY_STATUS  success | info | warning | failure   (sets colour and emoji)
#   NOTIFY_TITLE   one line
#   NOTIFY_BODY    plain text, may be multi-line
#   NOTIFY_URL     link to the run / commits (optional)
#
# Channels (env, from repository secrets; all optional):
#   SLACK_WEBHOOK_URL   Slack incoming webhook
#   TEAMS_WEBHOOK_URL   Teams channel webhook (Workflows "Post to a channel when a webhook request is
#                       received", or a legacy incoming webhook)
#   SMTP_URL            e.g. smtp://smtp.office365.com:587 (STARTTLS) or smtps://smtp.gmail.com:465
#   SMTP_USERNAME / SMTP_PASSWORD
#   NOTIFY_EMAIL_FROM   sender address (defaults to SMTP_USERNAME)
#   NOTIFY_EMAIL_TO     comma-separated recipients
set -uo pipefail

status="${NOTIFY_STATUS:-info}"
title="${NOTIFY_TITLE:?NOTIFY_TITLE is required}"
body="${NOTIFY_BODY:-}"
url="${NOTIFY_URL:-}"
repo="${GITHUB_REPOSITORY:-complymgmt_lite}"

case "$status" in
  success) color="#2EB67D"; emoji="✅" ;;
  warning) color="#ECB22E"; emoji="🚨" ;;
  failure) color="#E01E5A"; emoji="❌" ;;
  *)       color="#1D9BD1"; emoji="ℹ️" ;;
esac
# The title may already start with its own emoji (🔥 for a force push)
case "$title" in [[:alnum:]]*) title="$emoji $title" ;; esac

sent=0; failed=0
ok()   { echo "notify: sent to $1"; sent=$((sent + 1)); }
fail() { echo "::warning::notify: $1 failed: $2"; failed=$((failed + 1)); }

post_json() { # post_json <name> <url> <json>
  local code
  code="$(curl -sS -o "$RUNNER_TEMP/notify-resp.txt" -w '%{http_code}' --max-time 20 \
    -H 'Content-Type: application/json' -d "$3" "$2" 2>&1)" || { fail "$1" "$code"; return; }
  case "$code" in 2*) ok "$1" ;; *) fail "$1" "HTTP $code $(head -c 300 "$RUNNER_TEMP/notify-resp.txt")" ;; esac
}

if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
  post_json Slack "$SLACK_WEBHOOK_URL" "$(jq -n --arg t "$title" --arg b "$body" --arg u "$url" --arg c "$color" '
    {text: $t, attachments: [{color: $c, text: ($b + (if $u != "" then "\n<" + $u + "|Open in GitHub>" else "" end))}]}')"
fi

if [ -n "${TEAMS_WEBHOOK_URL:-}" ]; then
  post_json Teams "$TEAMS_WEBHOOK_URL" "$(jq -n --arg t "$title" --arg b "$body" --arg u "$url" --arg s "$status" '
    {type: "message", attachments: [{contentType: "application/vnd.microsoft.card.adaptive", content: {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json", type: "AdaptiveCard", version: "1.4",
      msteams: {width: "Full"},
      body: [
        {type: "TextBlock", text: $t, weight: "Bolder", size: "Medium", wrap: true,
         color: ({success: "Good", warning: "Warning", failure: "Attention"}[$s] // "Default")},
        {type: "TextBlock", text: $b, wrap: true, fontType: "Monospace"}
      ],
      actions: (if $u != "" then [{type: "Action.OpenUrl", title: "Open in GitHub", url: $u}] else [] end)
    }}]}')"
fi

if [ -n "${SMTP_URL:-}" ] && [ -n "${NOTIFY_EMAIL_TO:-}" ]; then
  from="${NOTIFY_EMAIL_FROM:-${SMTP_USERNAME:-}}"
  mail="$RUNNER_TEMP/notify-mail.txt"
  rcpts=()
  IFS=',' read -ra to_list <<<"$NOTIFY_EMAIL_TO"
  for r in "${to_list[@]}"; do r="$(echo "$r" | xargs)"; [ -n "$r" ] && rcpts+=(--mail-rcpt "$r"); done
  # RFC 2047 so emoji in the subject survive
  subject="=?UTF-8?B?$(printf '[%s] %s' "${repo#*/}" "$title" | base64 -w0)?="
  {
    printf 'From: %s\r\nTo: %s\r\nSubject: %s\r\nDate: %s\r\nMIME-Version: 1.0\r\n' \
      "$from" "$NOTIFY_EMAIL_TO" "$subject" "$(LC_ALL=C date -R)"
    printf 'Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n'
    printf '%s\n' "$body"
    [ -n "$url" ] && printf '\n%s\n' "$url"
  } > "$mail"
  auth=()
  [ -n "${SMTP_USERNAME:-}" ] && auth=(--user "$SMTP_USERNAME:${SMTP_PASSWORD:-}")
  if out="$(curl -sS --max-time 30 --ssl-reqd --url "$SMTP_URL" "${auth[@]}" \
      --mail-from "$from" "${rcpts[@]}" --upload-file "$mail" 2>&1)"; then
    ok "email ($NOTIFY_EMAIL_TO)"
  else
    fail email "$out"
  fi
fi

if [ $((sent + failed)) -eq 0 ]; then
  echo "::notice::No notification channel is configured (SLACK_WEBHOOK_URL, TEAMS_WEBHOOK_URL or SMTP_URL + NOTIFY_EMAIL_TO)."
  echo "Would have sent: $title"; echo "$body"
  exit 0
fi
[ "$failed" -eq 0 ]
