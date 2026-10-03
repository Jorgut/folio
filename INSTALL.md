# Folio · Cross-Platform Install Guide

This file explains how to install or use Folio across agent platforms, coding assistants, and general-purpose LLM tools.

---

## 1. Minimum contract

For Folio to work, the host should have access to this folder and at least these files:

- `SKILL.md` — full instructions
- `SKILL.min.md` — minimal fallback instructions
- `README.md` — human-facing guide
- `INSTALL.md` — install and troubleshooting guide
- `manifest.json` — machine-readable release metadata
- `VERSION` — local version number
- `CHANGELOG.md` — release history
- `index.html` — starter template
- `design/`, `engines/`, `scripts/`, `templates/` — support files

If the host cannot load directory-based skills, you can still use Folio by pasting `SKILL.min.md` or selected sections of `SKILL.md` into system/project instructions.

---

## 2. Recommended install locations

| Platform | Recommended location |
|----------|----------------------|
| Claude Code | `~/.claude/skills/folio/` |
| OpenCode / compatible | `~/.config/opencode/skills/folio/` |
| Codex / Codex-like agent | Tool-specific skill or prompt workspace |
| Generic LLM tool | Any local repo path the model can read |

---

## 3. Entry files by platform capability

### A. Native skill support

Use:

- `SKILL.md` as the primary entry file
- `README.md` as optional human docs

Requirements:

- Folder-level access
- Frontmatter-aware loaders preferred
- Ability to reference local support files

### B. Prompt-only support

Use:

- `SKILL.min.md` first
- `SKILL.md` only when the tool can handle larger context safely

Good fit for:

- Custom GPT instructions
- System prompt fields
- Project instructions
- Tools that do not scan skill directories automatically

### C. Repo-reference support

If the host can inspect local files but has no skill format:

1. Attach or mount the full repo
2. Tell the model to treat `SKILL.md` as the operating manual
3. Tell the model to use `index.html` as the base template

---

## 4. Path handling

Some tools will not resolve `<SKILL_ROOT>` automatically.

In those tools, replace:

```bash
<SKILL_ROOT>
```

with the absolute path to this folder, for example:

```bash
/Users/aj/.claude/skills/folio
```

---

## 5. First-run prompt

If you just want the tool to start working with Folio, use:

> Use the attached Folio skill instructions and repo as a presentation engine. Create an 8-slide deck about [topic], keep it clean and modern, and export HTML first.

### Codex explicit-invocation hook

The skill file cannot execute code merely by being named. In Codex, an optional `UserPromptSubmit` hook can check the version as soon as a prompt **starts with** `/folio` or `$folio`. It does not install updates, and ordinary discussion of Folio does not trigger it. The agent still follows the `SKILL.md` first-action check for implicit skill use and on hosts without hooks.

Enable Codex hooks in `~/.codex/config.toml`:

```toml
[features]
hooks = true
```

Add this entry under `hooks` in `~/.codex/hooks.json`, replacing `/absolute/path/to/folio` with the installed folder:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /absolute/path/to/folio/scripts/codex-prompt-hook.mjs",
            "timeout": 20,
            "statusMessage": "Checking Folio version"
          }
        ]
      }
    ]
  }
}
```

Merge this into an existing hooks file rather than replacing other hooks. Restart Codex and approve the hook if the client requests trust. This integration is Codex-specific; other hosts need their own equivalent trigger. A network failure must not prevent the Folio task from continuing.

---

## 6. Update architecture

Folio ships with a cross-platform update core, but hosts trigger it differently.

### Core files

- `manifest.json` — canonical release metadata
- `VERSION` — local version number
- `CHANGELOG.md` — release notes
- `scripts/check-update.mjs` — checks for newer release metadata safely
- `scripts/self-update.mjs` — performs a user-confirmed upgrade when possible

### Trigger rules

| Host capability | Recommended behavior |
|----------------|----------------------|
| Startup hook + script execution + network | Optionally check when Folio loads; check again at task entry using the 30-minute cache |
| Script execution + network, but no startup hook | Run `check-update.mjs` as the first action of every Folio task |
| No script execution or no network | State that the check was skipped and continue normally |

### Upgrade rules

- Never silently overwrite the local skill
- Always ask the user before running `self-update.mjs`
- Show concrete release highlights from remote metadata before asking the user to upgrade
- If the install is not a git clone, manual replacement may be required
- If the working tree is dirty, refuse auto-upgrade until the user resolves local changes

---

## 7. Troubleshooting

### Skill not showing up

- Restart the client
- Start a new session
- Confirm the folder name is `folio`
- Confirm `SKILL.md` exists at the folder root
- Confirm the loader can parse YAML frontmatter

### Tool says this is not a skill repo

Check these first:

- `SKILL.md` exists
- `SKILL.md` contains frontmatter metadata
- The tool can access the repo contents, not just the repo URL
- The tool is reading the local clone, not guessing from the repository name

### Commands fail because of `<SKILL_ROOT>`

Replace `<SKILL_ROOT>` with the absolute folder path.

### Tool cannot load large instructions

Use `SKILL.min.md` instead of the full `SKILL.md`.

### Auto-update check did not run

Possible reasons:

- The host has no startup hook support
- The host can read the skill but cannot execute scripts
- Network access is blocked
- The host only uses Folio as prompt context, not as an executable skill

In those cases, run manually:

```bash
node scripts/check-update.mjs
```

---

## 8. Packaging checklist

If you distribute Folio to another platform, keep these files together:

- `SKILL.md`
- `SKILL.min.md`
- `README.md`
- `INSTALL.md`
- `manifest.json`
- `VERSION`
- `CHANGELOG.md`
- `index.html`
- `design/`
- `engines/`
- `scripts/`
- `templates/`

That bundle gives the best chance of working across native skill loaders, prompt-only systems, and repo-aware coding agents.
