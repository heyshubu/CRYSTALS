---
name: project-memory-and-help
description: Master skill for this project. (1) Persists project context across sessions via memory/STATE.md + daily logs, loaded automatically at the start of every session. (2) After every backend module is finished, writes a HELP/ doc (and PDF) explaining what the module does and exactly how the React frontend should consume it — since the backend (Spring Boot) and frontend (React) are being built by different people. Use at the start of any session, on "what did we do last time" / "continue", whenever a module/feature/endpoint is completed, and on session-end cues like "that's it for today".
---

# Project Memory & Frontend Help Docs

Two jobs, one skill:
1. Carry context across sessions without re-reading the whole project every time.
2. Every time a backend module is finished, write a plain-English doc in `HELP/` telling the React dev exactly how to wire it up — because they aren't reading the Spring Boot code.

## Folder layout

```
memory/
  STATE.md            <- only file read automatically every session. Edited in place, stays small.
  2026-08-30.md         <- one per day. Append-only. Read on-demand only.
HELP/
  _template.md          <- structure every module doc follows
  auth-module.md         <- source doc, one per finished module
  auth-module.pdf        <- generated from the .md, this is what gets handed to the frontend dev
```

Create `memory/`, `HELP/`, and `HELP/_template.md` (from section 3 below) if they don't exist yet.

---

## 1. Session start — every time, automatically

1. Read `memory/STATE.md`. That's the whole default load.
2. If today's `memory/YYYY-MM-DD.md` already exists, read that too.
3. Give a short (1-3 line) recap of where things stand, then proceed with the task.
4. Only search further (specific past daily logs, or a `HELP/` doc) if the task genuinely needs it. Never open everything "just in case."

## 2. While working — log to memory/

When a discrete unit of work finishes — an endpoint built, a bug fixed, an approach chosen or rejected — append it to today's `memory/YYYY-MM-DD.md`. Log as you go, not in one pass at the end.

Rules:
- Bullets, not prose.
- Every entry earns its "why," not just its "what."
- Skip routine reads, no-op edits, dead ends — no line needed.
- Group same-day entries under a subheading per feature.

Then update `memory/STATE.md` **in place** (edited, never appended) — active work, ~6 recent decisions, known issues, last session summary, and a "deep history index" of one-line pointers to old daily logs or HELP docs. Prune sections past ~6-8 items; when STATE.md passes ~100 lines, prune harder rather than let it grow. Keep it readable in a few seconds — detail lives in the daily files, not in STATE.md itself.

## 3. When a module is finished — write HELP/<module>.md and .pdf

Trigger: a module, feature, or set of endpoints is done and working (not on every prompt — on completion). If it's unclear whether something counts as "done," ask.

Steps:
1. Pull context from today's (and, if relevant, past) memory logs — don't re-derive from scratch.
2. Write `HELP/<module-slug>.md` (kebab-case) following this template:

```
# <Module Name>

## What this module does
Plain-English summary. Not code — what it's *for*, in a sentence or two.

## What was built
- Key classes/services/controllers, one line each on their role.
- DB entities/tables touched or added.
- Any business rules worth flagging (validation, edge cases, why a particular approach was chosen over another).

## API Endpoints
For each endpoint:
- `METHOD /path`
- Auth required? What header/token?
- Request body (JSON shape, with field types and which are optional)
- Success response (JSON shape + status code)
- Error responses (status code + shape, for each realistic failure case — validation error, not found, unauthorized, etc.)

## Example request/response
One realistic curl or JSON example per endpoint. Real-looking values, not `foo`/`bar`.

## Frontend implementation notes
This is the most important section — written for someone who has NOT read the backend code:
- What order to call things in, if multi-step (e.g. request OTP → verify OTP → get token).
- What to store client-side and where (e.g. token in memory vs storage) and how long it's valid.
- What loading/error states the UI needs to handle, mapped to the specific error responses above.
- Anything non-obvious: pagination shape, date/number formats, enum values and what they mean, rate limits.

## Open items / not yet implemented
Anything the frontend should know is still pending, so they don't build against something half-finished.
```

3. Convert `HELP/<module-slug>.md` to `HELP/<module-slug>.pdf`. Use whatever PDF tooling is available in this environment (e.g. `pandoc <module-slug>.md -o <module-slug>.pdf`, or an equivalent markdown-to-PDF tool/library). If no PDF tool is available, say so plainly and leave the `.md` as the deliverable rather than silently skipping it.
4. Add one pointer line under STATE.md's "Deep history index" (e.g. `Auth module → HELP/auth-module.md`). Don't copy the doc's content into STATE.md.

If a module gets meaningfully changed later (endpoint added, contract changed), update the existing `HELP/<module-slug>.md` and regenerate the PDF — don't create a second doc for the same module.

## Hard rules

- Session start reads `STATE.md` (+ today's file, if present). Nothing else, by default.
- HELP docs are written on module completion, not per-prompt — they document a finished, working piece, not work-in-progress.
- Frontend implementation notes assume zero backend knowledge — no "as you can see in the service layer," no unexplained internal jargon. The React dev only ever reads the HELP doc, never the Spring Boot code.
- `STATE.md` is edited in place, not appended to. Daily files and HELP docs are the permanent record.
- No secrets, API keys, tokens, or customer/PII data anywhere in `memory/` or `HELP/` — assume both get committed, and example values in HELP docs are fake/realistic, never real data.
