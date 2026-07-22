<!-- Thanks for contributing! Please fill this in so reviewers can move fast and safely. -->

## What does this PR do?

<!-- Describe the change and why it's needed. Link any related issue: Closes #123 -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Docs
- [ ] Build / CI / tooling
- [ ] Other:

## Security checklist

<!-- This project runs code on users' machines. Confirm each item. -->

- [ ] No new runtime dependencies (or they're justified in the description)
- [ ] No new network calls (or they're justified in the description)
- [ ] No new shell/`exec`/`child_process` usage (or it's justified and input is validated)
- [ ] File paths are handled safely (no unvalidated paths from `plan.json` used for writes)
- [ ] I did not add or modify GitHub Actions in a way that exposes secrets to fork PRs
- [ ] The approval-gate logic still requires an explicit user click to proceed

## How I tested this

<!-- e.g. ran in Extension Development Host, exercised approve + request-changes flows, ran the hook script tests -->

## Checklist

- [ ] `npm run compile` passes locally
- [ ] `shellcheck claude-setup/*.sh` passes (if I touched the hook)
- [ ] I read [CONTRIBUTING.md](../CONTRIBUTING.md)
