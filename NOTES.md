# Build Notes

Working log kept day-by-day while things are fresh, per the plan in
PROJECT_SPEC.md. This feeds the "what was hard / what I got wrong" sections
of the final README write-up — it's not the README itself.

## Day 1 — Combobox: structure + filtering

**Scope:** controlled text input, filtered listbox popup, click-to-select.
Deliberately no ARIA roles/states, no keyboard navigation, no live region yet
— that's Day 2. Also stood up the project toolchain and Playwright E2E
testing infra ahead of schedule (not in the original day-by-day plan, but
needed before writing more component code).

**Decisions made:**
- Exact-pinned every dependency version (no `^`/`~` ranges) — Vite 8.3.0,
  React 18.3.1, TypeScript 7.0.2, @playwright/test 1.63.0, etc. Chose React
  18 over the latest 19 for a more battle-tested major to build interview
  code on. Chose TypeScript 7.0 (the new Go-based native compiler) over the
  safer 5.9 line for speed, accepting it's newer and less ecosystem-tested.
- Filtering is a plain case-insensitive substring match (`includes`), not a
  prefix match or fuzzy match — simplest thing that works for a 40-item
  static list.
- Data model is a flat `string[]` (fruit names) rather than `{id, label}`
  objects — fine while the value and the display text are the same thing;
  will need to revisit if a future combobox needs distinct IDs vs. labels.

**What was hard:** nothing yet at this stage — Day 1 is intentionally the
"no accessibility" version to give Day 2 something concrete to compare
against. The interesting difficulty (ARIA state sync, keyboard focus vs.
visual highlight) hasn't been hit yet.

**What I got wrong first, and how I found it:** N/A for Day 1 — no
screen reader or keyboard testing has been done yet, so nothing has been
caught. Revisit this note after Day 2's screen reader pass.

**Testing:** Verified manually first (Playwright driven headlessly to
confirm filtering + click-select + zero console errors), then ported that
into a committed spec at `e2e/combobox.spec.ts` (4 tests, all passing)
instead of leaving it as a one-off check. `npm run test:e2e` runs it,
`npm run test:e2e:ui` opens Playwright's interactive UI mode.

**Process note:** started using feature branches + PRs into `main` starting
Day 2, with branch protection enabled on GitHub (PRs required, no direct
pushes, 0 required approvals since this is a solo repo). Day 1's work was
committed directly to `main` before this was set up.
