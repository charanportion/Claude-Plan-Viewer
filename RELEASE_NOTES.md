# v0.0.1 — Initial release

**Claude Plan Viewer** is a visual approval gate for Claude Code plans. Claude writes its plan to `.claude/plan.json`, the extension renders it as an interactive panel, and Claude Code **pauses until you click Approve** — or revises the plan when you click *Request changes* and give feedback.

## Features
- 📋 Structured plan panel — files (create/modify/delete), numbered steps with checkboxes, risks, and out-of-scope items.
- 🛑 Hard approval gate — Claude Code cannot start implementing until you approve *in the viewer*, even in auto-accept modes.
- 🔁 Feedback loop — "Request changes" sends your notes back into Claude's context; it revises the plan and the gate re-arms.
- 📝 Paper trail — every plan is a JSON file you can diff, commit, or review.
- 🔌 No servers, no APIs — the extension and the Claude Code hook talk through two small JSON files in `.claude/`.

## Install
1. Download `claude-plan-viewer-0.0.1.vsix` below and install it:
   ```bash
   code --install-extension claude-plan-viewer-0.0.1.vsix
   ```
   Reload the VSCode window afterward.
2. Wire up the Claude Code hooks in your project — see the [README](README.md#2-wire-up-claude-code-per-project) and the `claude-setup/` folder.

## Requirements
`jq` and `bash` on PATH (macOS/Linux; Windows via WSL or Git Bash), VSCode ≥ 1.85, Claude Code with hooks support.
