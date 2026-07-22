# Security Policy

## Why this matters for this project

Claude Plan Viewer is not a passive document viewer. It ships two things that run on a contributor's or user's machine with real privileges:

- **A VSCode extension** with filesystem read/write access to the workspace.
- **A bash hook** (`claude-setup/wait-plan-approval.sh`) that runs inside Claude Code and can block, unblock, or redirect what an AI agent does next.

Because of this, a malicious change to either could tamper with files, exfiltrate workspace contents, or subvert the approval gate itself. We review every contribution with that threat model in mind. See [CONTRIBUTING.md](CONTRIBUTING.md) for what that review looks like.

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.0.x   | ✅        |

## Reporting a vulnerability

**Do not open a public issue for security problems.**

Report privately through GitHub's built-in flow:

1. Go to the **Security** tab of this repository.
2. Click **Report a vulnerability** (GitHub Private Vulnerability Reporting).
3. Describe the issue, the impact, and steps to reproduce.

You'll get a private advisory thread with the maintainers. We aim to acknowledge within **5 days** and to ship or coordinate a fix before any public disclosure.

If you are unsure whether something is a security issue, treat it as one and report privately first.

## What to include

- The affected component (extension, hook script, or setup docs).
- What an attacker could achieve (read files? bypass the approval gate? run code?).
- A minimal reproduction if you have one.

## Scope

In scope: code execution, approval-gate bypass, path traversal, unsafe handling of `plan.json` / `plan-approval.json` content, and dependency vulnerabilities.

Out of scope: issues that require an already-compromised machine, or social-engineering a maintainer into merging malicious code (that's what our review process defends against — but please still tell us if you find a gap in it).
