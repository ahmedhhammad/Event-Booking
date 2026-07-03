# Session Recap Maintenance

Goal: a new agent/session should understand the project by reading PROJECT_RECAP.md alone — not by re-reading the codebase.

After any meaningful change (new feature, bug fix, schema change, config change):

1. Open PROJECT_RECAP.md at the project root. Create it from the template below if missing.
2. Edit it in place — do not let it grow unbounded.
3. Sections, bullets only, no prose:
   - Current State — what works right now. Max 6 bullets.
   - Architecture — key folders/files and their purpose, one line each.
   - Recent Changes — last 5 changes, newest first, one line each. Drop the oldest when adding a new one.
   - Known Issues / TODO — short list, remove items once fixed.
   - Conventions — project-specific rules not obvious from code (naming, patterns, stack quirks).
4. One line per bullet. If it needs two lines, shorten it.
5. Skip this step for trivial changes (typos, formatting, comments).

Template:

```markdown
# Project Recap

## Current State
-

## Architecture
-

## Recent Changes
-

## Known Issues / TODO
-

## Conventions
-
```
