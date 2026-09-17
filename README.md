# Accessible Components Kit

Three hand-built, fully accessible UI components: a combobox, a modal, and
a sortable data table — built without any UI/headless library, to prove
out ARIA and keyboard-interaction patterns by hand.

**[Live demo →](your-deploy-url-here)**

## Why this project
Built as part of returning to frontend engineering after a short break.
AI coding assistants routinely get accessibility wrong — missing focus
traps, incorrect ARIA, no keyboard support — so this project is a
deliberate "prove I can do the part the tools skip" exercise.

## Stack
React, TypeScript, Vite. No component libraries.

## Components

### Combobox / autocomplete
- Pattern followed: [WAI-ARIA Editable Combobox With List Autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/)
- What was hard: keeping `aria-activedescendant` in sync with the visual
  highlight while the list is being filtered out from under it — the active
  index has to reset (or get re-clamped) every time the option list changes
  length, or it can point at a stale/out-of-range option.
- What I got wrong first, and how I found it: initially wired `role="combobox"`
  onto a wrapper `<div>` around the `<input>`, with `role="textbox"` on the
  input itself (the older ARIA 1.0-style split-node combobox pattern). This
  looked right until the E2E tests written against `getByRole('textbox')`
  started failing after adding `role="combobox"` — because an explicit
  `role="textbox"` on a native `<input>` competes with the input's own
  implicit role. Rechecked the current WAI-ARIA APG and found the pattern
  puts `role="combobox"` directly on the `<input>`, with `aria-expanded`,
  `aria-controls`, and `aria-activedescendant` all on that same element —
  no wrapper node needed. Fixed by moving all of that onto the input and
  dropping the wrapper.

### Modal
- Pattern followed: [WAI-ARIA Dialog](link)
- What was hard: _(fill in — e.g. handling focus when the trigger element
  unmounts)_
- What I got wrong first: _(fill in)_

### Data table
- Pattern followed: roving tabindex + [WAI-ARIA Table sort](link)
- What was hard: _(fill in)_
- What I got wrong first: _(fill in)_

## Testing approach
- Keyboard-only pass on every component (no mouse)
- Screen reader pass with [VoiceOver / NVDA] on every component
- Manual WCAG 2.1 AA check against a checklist (linked below)

## Running locally
\`\`\`
npm install
npm run dev
\`\`\`

## What I'd do differently / next steps
_(fill in after building — this section is often what an interviewer
actually asks about)_