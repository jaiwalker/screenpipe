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
2. Keep 90–95 percent of the composition ink, warm bone, and trace grey.
   Neutral contrast, not accent color, should establish hierarchy.
3. Keep ordinary large CTAs neutral ink/white, especially on marketing pages.
   Use muted moss for one compact product action, selection, active navigation
   rail, caret, or calm ready state when the color explains that state. Do not
   color the CTA, rail, labels, and decorative geometry in the same view.
4. Use bright phosphor only while captured work is actively becoming memory,
   model context, or an executing agent step. Turn it off when execution stops.
5. Keep error, warning, success, privacy, and billing colors semantic. Do not
   replace them with moss or phosphor.
6. Use neutral borders for ordinary keyboard focus. Pair every colored state
   with text, an icon, geometry, or motion so it works without color.
7. Keep surfaces flat by default. Product elevation should be quiet: a hairline
   plus a low-opacity shadow with roughly 1–8px offset and no more than 24px
   blur. Larger marketing, popover, and dialog shadows are allowed only for
   genuinely floating surfaces. Avoid hard offsets, decorative shadows, and
   rounded corners.
8. Preserve compact hierarchy and progressive disclosure. Keep the real
   selected model visible anywhere model choice affects the result.

## Verification

- Check light and dark mode.
- Check desktop and mobile for website work.
- Check idle, hover, keyboard focus, selected, loading, completed, and error
  states that the component supports.
- Confirm the state remains understandable in grayscale.
- Confirm the largest CTA and largest surface still work with all accents
  removed. Accent should explain state, not supply basic hierarchy.
- Put before/after screenshots in visual PRs and keep the PR in draft until the
  visual direction is approved.

## Pitfalls

- Do not turn every green-looking state into one generic brand color.
- Do not copy a reference product's hue. Learn from its neutral-to-accent ratio,
  semantic roles, and elevation restraint, then apply screenpipe's own tokens.
- Do not leave phosphor on after a task completes.
- Do not use a full green wash, generic AI gradient, glow, or decorative shadow.
- Do not apply marketing-theme changes to account, admin, or product surfaces
  without inspecting those surfaces separately.
