# Accessible Components Kit — Week 1

## Overview
A small library of three UI components built from scratch (no headless UI
libraries, no Radix/Reach/etc.) in React + TypeScript, each with full
keyboard support, correct ARIA semantics, and verified screen reader
behavior. This is the first project in a 5-week portfolio rebuild
(accessibility → performance → AI-assisted → testing → async/state).

## Goals
- Demonstrate accessibility competence that AI-generated code typically gets
  wrong: focus management, ARIA roles/states, keyboard interaction patterns.
- Produce a self-contained repo with a README write-up strong enough to
  stand alone as an interview talking point.
- Establish the stack (React + TypeScript) and conventions carried into
  Weeks 2–5.

## In scope
1. **Combobox / autocomplete**
   - Text input with a filtered, ARIA-compliant listbox popup
   - Arrow key navigation, Enter to select, Escape to close
   - `role="combobox"`, `aria-expanded`, `aria-activedescendant`,
     `aria-controls` wired correctly
   - Announces result count changes to screen readers (live region)

2. **Modal with focus trapping**
   - Focus moves into the modal on open, returns to the trigger on close
   - Tab/Shift+Tab cycles within the modal only (no escape to background)
   - Escape key closes; click-outside closes
   - `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
   - Background content gets `inert` or `aria-hidden` while open

3. **Sortable, keyboard-navigable data table**
   - Column headers act as sort buttons (`aria-sort` on `<th>`)
   - Arrow-key cell navigation (roving tabindex pattern)
   - Sort state announced via live region
   - Works with a dataset of at least 20 rows to make sort meaningful

## Out of scope (explicitly not doing this week)
- Styling polish / design system — functional, clean, not "designed"
- Mobile touch gesture support
- Server-side data / pagination (client-side array is fine)
- Automated a11y tests (axe, jest-axe) — that's Week 3–4's testing project;
  manual verification only for now

## Technical requirements
- React + TypeScript, Vite for tooling
- No component libraries or headless UI primitives — the point is doing
  the ARIA/focus work by hand
- Each component in its own folder with its own README section
- One demo page that renders all three so it's easy to link/screen-record

## Acceptance criteria ("done" for each component)
- [ ] Fully operable by keyboard alone, no mouse
- [ ] Fully operable by screen reader (tested with VoiceOver or NVDA —
      not just "should work")
- [ ] Passes a manual WCAG 2.1 AA keyboard/focus/ARIA check
- [ ] No console warnings/errors
- [ ] README subsection documenting: which pattern you followed (WAI-ARIA
      Authoring Practices), what was hard, what you got wrong on the first
      pass and fixed

## Day-by-day plan
| Day | Focus |
|---|---|
| 1 | Repo setup, demo shell, build combobox structure + filtering logic |
| 2 | Combobox: ARIA wiring, keyboard nav, live region, screen reader test |
| 3 | Modal: focus trap, ARIA, keyboard behavior, screen reader test |
| 4 | Data table: roving tabindex, sort logic, `aria-sort` |
| 5 | Data table: screen reader test, fix issues found across all three |
| 6 | Write README (the "tricky parts" section — do this while it's fresh) |
| 7 | Buffer / record a short demo clip or GIF for the README |

If Days 4–5 slip, ship combobox + modal polished and note the table as
"in progress, ETA Week 2" rather than rushing a broken third component.

## Deliverables
- Public GitHub repo
- Live demo (Vercel/Netlify)
- README with the write-up described above