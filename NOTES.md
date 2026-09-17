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

## Day 2 — Combobox: ARIA, keyboard nav, live region

**Scope:** `role="combobox"` wiring, `aria-expanded`/`aria-controls`/
`aria-activedescendant`, arrow-key + Home/End/Enter/Escape navigation, and a
visually-hidden `role="status"` live region announcing the filtered result
count. Screen reader pass (VoiceOver/NVDA) still outstanding — noting that
honestly rather than claiming it's done.

**What was hard:** keeping the active (highlighted) option in sync with the
filtered list as it shrinks or grows on every keystroke. The active index is
a plain number into `filteredOptions`, so every time the query changes and
the array is rebuilt, that index has to be reset back to `-1` rather than
carried over — otherwise arrow-key state from before a keystroke can end up
pointing at the wrong option (or one that no longer exists) after filtering.
Also had to remember `event.preventDefault()` on the option's `onMouseDown`
(not `onClick`) so clicking an option doesn't blur the input first and close
the listbox before the click handler runs.

**What I got wrong first, and how I found it:** built the combobox against
the older ARIA 1.0 "split node" pattern — `role="combobox"` on a wrapper
`<div>`, `role="textbox"` explicitly on the `<input>` inside it. It looked
plausible and matched some outdated blog examples. It broke the E2E suite:
adding `role="combobox"` made Playwright's `getByRole('textbox', ...)`
selector stop finding the input, because an explicit `role="textbox"` on a
native `<input type="text">` still needs the browser's accessibility tree to
resolve correctly, and the split-role approach doesn't match the modern
WAI-ARIA APG combobox pattern. Re-read the current APG example, found the
pattern puts `role="combobox"` directly on the `<input>` (with all the
`aria-*` state on that same element, no wrapper), fixed it, and switched
the tests to select by `getByRole('combobox', ...)`. This is exactly the
kind of "confidently wrong ARIA" this project exists to catch, and it
surfaced immediately from test tooling rather than needing a screen reader
to notice — worth remembering that role-based test selectors double as a
cheap accessibility tree sanity check.

**Testing:** extended `e2e/combobox.spec.ts` from 4 to 7 tests — added
live-region announcement text, arrow-key navigation + Enter-to-select via
`aria-activedescendant`, and Escape-closes-without-changing-value. All
selectors go through `getByRole`/`getByLabel` now instead of CSS/ID
selectors, both because it's more resilient and because it forces the
markup to actually expose the right roles and accessible names.

**Process note:** this was the first component built on a feature branch
(`day2-combobox-aria`) instead of directly on `main`, per the new
branch-protection setup from the end of Day 1.

### Open bug: Windows Narrator double-announces the selected value

**Status:** open, tracked in the Day 2 PR. Not blocking the rest of Day 2,
but Day 2 isn't "screen-reader verified" until this is resolved or
consciously accepted as an AT limitation.

**Repro:** with Narrator running, focus the combobox, type a filter (e.g.
"ap"), arrow down to an option, press Enter. Narrator speaks the full
phrase describing the selected option (e.g. "Apple one of one selected")
**twice in a row**, back to back — not two different, complementary
announcements, the same phrase repeated.

**Ruled out so far:**
- Not `aria-selected` on the highlighted option — removed it entirely
  (it was wrongly marking the merely-*highlighted-while-navigating* option
  as selected, which was a real bug worth fixing on its own, matching the
  APG's autocomplete-list guidance more closely) and the double-speak
  persisted unchanged.
- Not a missing tree relationship between the input and its options —
  added `aria-owns={listboxId}` (only while open) alongside the existing
  `aria-controls`, in case Narrator's UIA mapping needed the ownership edge
  to resolve `aria-activedescendant`. No change in behavior.
- Not literal event-repetition — React 18 batches the `setInputValue` +
  `setIsOpen(false)` + `setActiveIndex(-1)` calls inside `handleSelect` into
  a single render, so it isn't three separate re-renders each re-announcing
  something.

**Leading theory:** in the single render that commits a selection, two
different accessibility-tree nodes both end up "saying" the same string at
the same instant — the `<input>`'s value changes to e.g. "Apple", and in
that exact same render the `<ul role="listbox">` item that was *also*
labeled "Apple" is removed from the DOM entirely (the whole listbox
unmounts when `isOpen` goes false). Windows' UI Automation layer likely
emits two separate change notifications in that instant — "this input's
value changed" and "this listbox item was removed" — and Narrator's
Enter-key confirmation logic seems to speak both, which sounds like one
phrase said twice because the underlying string is identical.

**Next experiment (not yet tried):** stagger the two mutations across two
frames instead of one — commit the input value change first, let it paint,
then remove the listbox on a subsequent tick (e.g. via
`requestAnimationFrame` or a short `setTimeout`) — so UIA emits the two
notifications far enough apart that Narrator doesn't bundle them into one
double-speak event. This is a guess based on how this class of AT
double-announcement is usually described, not a confirmed mechanism —
needs a real Narrator pass to verify either way, and needs to be weighed
against added complexity for what might just be a Narrator-specific
verbosity quirk (Narrator's combobox support is documented as weaker than
NVDA/JAWS for this exact pattern).
