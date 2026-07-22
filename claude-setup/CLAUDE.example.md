# Add this to your project's CLAUDE.md

Copy the section below into your project's `CLAUDE.md` so Claude Code also writes
`plan.json` for plans presented as plain text (outside plan mode). Plan-mode plans
are covered by the hooks in `settings.example.json` regardless.

---

## Plan File Contract

Whenever you present a plan (plan mode or otherwise), in addition to your
normal response, write the plan to `.claude/plan.json` matching this schema:

```
{ "summary": string,
  "files": [{ "path": string, "action": "create"|"modify"|"delete", "why": string }],
  "steps": [{ "id": string, "title": string, "file": string }],
  "risks": string[],
  "out_of_scope": string[] }
```

Use the Write tool to create the file. Overwrite any existing plan.json.
