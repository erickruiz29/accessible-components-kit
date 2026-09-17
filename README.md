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
- Pattern followed: [WAI-ARIA Combobox](link)
- What was hard: _(fill in — e.g. keeping `aria-activedescendant` in sync
  with visual highlight while filtering)_
- What I got wrong first, and how I found it: _(fill in — screen reader
  testing usually surfaces something specific here)_

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