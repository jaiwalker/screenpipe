---
name: screenpipe-design
description: Use when implementing or reviewing screenpipe product or website UI so color, hierarchy, motion, shadows, and visual evidence follow the canonical design system.
---

# screenpipe design

Use `DESIGN.md` in the nearest screenpipe repository as the source of truth.
Read that file and the repository `AGENTS.md` before editing UI.

## Workflow

1. Name the semantic role before choosing a color: substrate, trace, ready or
   selected signal, live transformation, or semantic status.
2. Keep the composition mostly ink, warm bone, and trace grey.
3. Use muted moss for one primary action, selection, active navigation rails,
   carets, and other calm ready states.
4. Use bright phosphor only while captured work is actively becoming memory,
   model context, or an executing agent step. Turn it off when execution stops.
5. Keep error, warning, success, privacy, and billing colors semantic. Do not
   replace them with moss or phosphor.
6. Use neutral borders for ordinary keyboard focus. Pair every colored state
   with text, an icon, geometry, or motion so it works without color.
7. Keep surfaces flat by default. Elevated inputs, popovers, and dialogs may use
   a soft, low-opacity, mostly vertical shadow. Avoid hard offset shadows as the
   default and keep corners sharp.
8. Preserve compact hierarchy and progressive disclosure. Keep the real
   selected model visible anywhere model choice affects the result.

## Verification

- Check light and dark mode.
- Check desktop and mobile for website work.
- Check idle, hover, keyboard focus, selected, loading, completed, and error
  states that the component supports.
- Confirm the state remains understandable in grayscale.
- Put before/after screenshots in visual PRs and keep the PR in draft until the
  visual direction is approved.

## Pitfalls

- Do not turn every green-looking state into one generic brand color.
- Do not leave phosphor on after a task completes.
- Do not use a full green wash, generic AI gradient, glow, or decorative shadow.
- Do not apply marketing-theme changes to account, admin, or product surfaces
  without inspecting those surfaces separately.
