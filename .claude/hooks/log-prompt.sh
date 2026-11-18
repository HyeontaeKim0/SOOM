#!/bin/bash
# UserPromptSubmit hook: 사용자 프롬프트를 .claude/prompt-log/YYYY-MM-DD.md 에 append
set -euo pipefail

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
dir="$root/.claude/prompt-log"
mkdir -p "$dir"

prompt="$(jq -r '.prompt // empty')"
[ -z "$prompt" ] && exit 0

file="$dir/$(date +%F).md"
[ -f "$file" ] || printf '# Prompt Log %s\n' "$(date +%F)" > "$file"

{
  printf '\n## %s\n\n' "$(date +%H:%M:%S)"
  printf '%s\n' "$prompt"
} >> "$file"
