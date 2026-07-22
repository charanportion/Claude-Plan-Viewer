#!/bin/bash
# PostToolUse hook on Write|Edit. When .claude/plan.json is written, block
# until the Plan Viewer extension writes .claude/plan-approval.json
# (user clicked Approve / Request changes), then tell Claude what to do.

input=$(cat)
f=$(echo "$input" | jq -r '.tool_input.file_path // ""')
case "$f" in
  */.claude/plan.json) ;;
  *) exit 0 ;;
esac

approval="$(dirname "$f")/plan-approval.json"
rm -f "$approval"

# Poll just under the hook's 3600s timeout so we exit gracefully ourselves.
for _ in $(seq 1 3540); do
  if [ -f "$approval" ]; then
    status=$(jq -r '.status // ""' "$approval" 2>/dev/null)
    feedback=$(jq -r '.feedback // ""' "$approval" 2>/dev/null)
    case "$status" in
      approved)
        jq -n '{hookSpecificOutput:{hookEventName:"PostToolUse",additionalContext:"The user clicked Approve in the Plan Viewer. Proceed with implementation."}}'
        exit 0 ;;
      changes_requested)
        jq -n --arg fb "$feedback" '{decision:"block",reason:("The user clicked Request changes in the Plan Viewer. Do NOT implement anything. Feedback: " + (if $fb == "" then "(none given)" else $fb end) + " — revise the plan, overwrite .claude/plan.json, and wait for approval again.")}'
        exit 0 ;;
    esac
  fi
  sleep 1
done

jq -n '{decision:"block",reason:"The user has not responded in the Plan Viewer within the wait window. Do NOT proceed with implementation. Stop and ask the user to review and approve the plan; continue only after they confirm."}'
