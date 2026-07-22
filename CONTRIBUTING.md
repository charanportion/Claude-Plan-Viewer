# Contributing to Claude Plan Viewer

Thanks for wanting to help! Contributions of all kinds are welcome — bug reports, docs, and code. This guide explains how to contribute **and** the security rules that keep the project safe for everyone who installs it.

## Ground rules (read this first)

This project runs code on other people's machines: a VSCode extension with filesystem access, and a bash hook that controls an AI agent's approval gate. A malicious or careless change has real blast radius. So:

- **All changes land through pull requests.** Nobody — including new maintainers — pushes directly to `main`.
- **Every PR is reviewed by a maintainer (CODEOWNER) before merge.** External contributors cannot self-merge.
- **CI must pass** (build, type-check, and shell lint) before a PR is mergeable.
- **We read every line of diff**, with particular attention to: filesystem paths, shell/exec calls, new dependencies, network calls, and anything touching `plan.json` / `plan-approval.json` handling or the approval logic.

If your change is large or changes the security model, please open an issue to discuss it first.

## How to contribute code

1. **Fork** the repository (external contributors work from a fork — you won't have push access to this repo, and that's by design).
2. **Clone** your fork and create a branch:
   ```bash
   git clone git@github.com:<you>/Claude-Plan-Viewer.git
   cd Claude-Plan-Viewer
   git checkout -b fix/short-description
   ```
3. **Install and build:**
   ```bash
   npm install
   npm run compile      # TypeScript type-check + build
   ```
4. **Test your change locally** — see "Running the extension locally" below.
5. **Commit** with a clear message describing *what* and *why*.
6. **Push** to your fork and **open a PR** against `main`. Fill in the PR template.

## Running the extension locally

- Open the repo in VSCode and press **F5** to launch an Extension Development Host, or
- Package and install:
  ```bash
  npm run package                                   # builds claude-plan-viewer-<version>.vsix
  code --install-extension claude-plan-viewer-*.vsix
  ```
- To exercise the full gate, wire the hooks into a test project per the [README](README.md#2-wire-up-claude-code-per-project) and drop a `plan.json` (see `claude-setup/plan.example.json`) into `.claude/`.

## What CI checks

Every PR runs (`.github/workflows/ci.yml`):

- `npm ci` — clean, lockfile-exact install.
- `npm run compile` — TypeScript compiles with no errors.
- `shellcheck` on `claude-setup/*.sh` — the hook script is linted.
- The `.vsix` is built and uploaded as a build artifact so reviewers can install exactly what your PR produces.

PRs from forks run with a **read-only token and no repository secrets** — this is intentional so that untrusted code can be built and checked without being able to do anything harmful. Do not add workflows that use `pull_request_target` or expose secrets to fork PRs.

## Coding conventions

- TypeScript, matching the existing style in `src/extension.ts`.
- Keep the extension dependency-free where possible — new runtime dependencies get extra scrutiny.
- The bash hook must stay POSIX-bash compatible and pass `shellcheck`.
- Don't introduce network calls without a clear, discussed reason.

## Reporting bugs and requesting features

Use the issue templates (**Issues → New issue**). For anything security-sensitive, **do not** open a public issue — follow [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE) that covers this project.
