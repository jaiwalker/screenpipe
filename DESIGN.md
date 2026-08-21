
# Screenpipe Design Guide

## Philosophy

**"Escher monochrome with controlled phosphor intelligence"**

Screenpipe turns the trace of human work into memory, models, and agents. The
visual system should feel like a mathematical print becoming executable:
precise, recursive, slightly uncanny, and still controlled by the person whose
work created it.

Black and warm bone are the substrate. Muted moss is the everyday signal;
phosphor is the live intelligence signal. Moss can guide ordinary actions and
selection without washing the interface green. Bright phosphor appears only
while captured work is actively becoming model context or an agent is executing
an explicit action. Sharp corners, clean typography, and Escher-inspired
mathematical abstractions remain the core identity.

---

## Core Values

| Value | Description |
|-------|-------------|
| **Privacy First** | Local-first execution and data by default, cloud optional |
| **Human Agency** | Preserve ownership, control, and a visible path back to source material |
| **Open Source** | Inspect, modify, own, clean abstractions and readable codebase |
| **Simplicity** | Clean, minimal interface, powerful abstractions |
| **Radical optimism** | There is no such thing as impossible |
| **Progressive disclosure** | Easy, simple for non technical users but power users can still go deep |

---

## Typography

### Font Stack

| Purpose | Font | Fallbacks |
|---------|------|-----------|
| **Headings (sans)** | Space Grotesk | system-ui, sans-serif |
| **Body (serif)** | Crimson Text | Baskerville, Times New Roman, serif |
| **Code (mono)** | IBM Plex Mono | monospace |

### Usage Patterns

- **Headings**: Space Grotesk, lowercase preferred
- **Body text**: Crimson Text for readability
- **Code/technical**: IBM Plex Mono
- **Buttons**: UPPERCASE with tracking-wide
- **Labels**: lowercase, medium weight

---

## Narrative model

| Visual role | Meaning |
| --- | --- |
| Bone | Human experience and source material |
| Trace grey | Captured evidence and intermediate structure |
| Moss | A calm actionable, selected, or ready state |
| Phosphor | Intelligence actively transforming or executing |
| Ink | The local system, recursion, and durable infrastructure |

The public story is preserving, multiplying, and executing human intelligence.
Do not frame the product as erasing people. Screenpipe handles intimate context,
so agency, ownership, and a visible path back to source material are part of the
interface, not legal footnotes.

## Colors

### Palette

| Token | Hex | Use |
| --- | --- | --- |
| Ink | `#050505` | Foreground, structure, dark background |
| Bone | `#F2EFE6` | Main light background and human/source state |
| Trace | `#78786F` | Secondary evidence and inactive structure |
| Moss | `hsl(72 34% 34%)` | Primary action, selection, caret, and active rail on light surfaces |
| Moss dark | `hsl(72 34% 50%)` | The same signal on dark surfaces |
| Phosphor | `#C7FF3E` | A transformation or execution that is active now |
| Phosphor strong | `#4A6B00` | Small live-transformation text and borders on bone |

The default ratio is roughly 75 percent ink/bone, 20 percent trace neutrals,
up to 5 percent muted moss, and one small phosphor focal point when work is
actively executing. Existing app and website surfaces can adopt this
incrementally. Do not perform a global color sweep without checking every state
in light and dark mode.

### Accessibility

- Use ink text on phosphor fills.
- Use white on light-mode moss fills and ink on dark-mode moss fills.
- Do not use bright phosphor for small text on bone. Use phosphor strong.
- Pair color with a label, icon, shape, or state change. Meaning must never rely
  on color alone.
- Keep error, warning, success, privacy, and billing states explicit in text.
  Phosphor is not a generic success color.

### Signal hierarchy

| Signal | Use | Examples |
| --- | --- | --- |
| Neutral ink/trace | Structure and ordinary focus | input borders, keyboard focus ring, secondary buttons |
| Muted moss | Ready, actionable, or selected | primary CTA, active navigation rail, caret, selected card |
| Bright phosphor | Active transformation or execution | streaming agent step, capture becoming memory, active pipeline node |

### Where phosphor belongs

- The boundary where capture becomes memory or model context
- The active step in an agent or automation pipeline
- A single focal point in a recursive or tessellated composition

Phosphor must go out when the work stops. Ready, completed, selected, and
ordinary focus states return to moss or neutral ink/trace.

### Where moss belongs

- A user-triggered primary action
- The active navigation rail or selected row
- A text caret or small ready-state marker
- A restrained chart hover or focus mark when no transformation is running

### Where phosphor does not belong

- Every button, icon, link, or heading
- Large decorative backgrounds
- Generic badges or marketing emphasis
- Status decoration without a meaningful transformation
- Ordinary selection, focus, or completed states
- Rainbow, aurora, or generic AI gradients

---

## Geometry

### Border Radius

```
--radius: 0
```

**All corners are sharp.** No rounded corners anywhere.

### Borders

- Width: 1px solid
- Style: Sharp, binary (on/off)
- No decorative gradients. A restrained transition may be used only when it
  communicates metamorphosis or state progression.

### Shadows

**Flat by default — use 1px borders for separation.** Subtle shadows are
allowed to lift floating / elevated surfaces (chat input, overlays, popovers,
dialogs) off the background. Keep them soft, low-opacity, and mostly vertical;
avoid hard offset shadows as a default. Never round corners to sell the lift —
corners stay sharp.

---

## Components

### Buttons

```
- Font: UPPERCASE, tracking-wide
- Border: 1px solid
- Corners: Sharp (0px radius)
- Transition: 150ms
- Hover: Color inversion
- Moss fill: the default colored treatment for one primary action
- Phosphor fill: reserved for an action that is executing a capture-to-model or
  model-to-agent transformation now
```

### Cards

```
- Border: 1px solid
- Shadow: None
- Corners: Sharp
- Padding: 24px (p-6)
```

### Inputs

```
- Style: Command-line aesthetic
- Font: Monospace (IBM Plex Mono)
- Border: 1px solid
- Height: 40px (h-10)
- Focus: Border color change
```

### Dialogs

```
- Border: 1px solid
- Shadow: Subtle lift allowed (elevated surface)
- Animation: 150ms fade
- Title: lowercase
```

---

## Motion & Animation

### Principles

- **Fast**: 150ms standard duration
- **Minimal**: Only essential state changes
- **Causal**: Motion should show what changed, what triggered it, and where it went

### Timing

| Animation | Duration |
|-----------|----------|
| Button hover | 150ms |
| Dialog open/close | 150ms |
| Accordion | 200ms |
| Page transitions | 150ms |

### Iteration

Do at least 10 iterations on your animations, at every turn criticise your own design and improve it until it matches the unique brand style

Take screenshots of modern apps with great design you find on internet and use it as inspiration for the UX but apply screenpipe brand style to it.

---

## Brand Voice

### Tone

- Lowercase, casual, direct
- Minimal technical details but power users can go deep
- No marketing fluff
- Show source, trigger, action, destination, and user control where relevant
- Avoid surveillance language and claims that remove human agency

---

## Design Checklist

When creating new UI components:

- [ ] Using Space Grotesk for headings
- [ ] Using Crimson Text for body (or IBM Plex Mono for technical)
- [ ] 1px solid border
- [ ] Flat by default; subtle shadows OK only to lift floating/elevated surfaces
- [ ] 0px border radius (sharp corners) — always, even on shadowed surfaces
- [ ] Composition remains mostly ink, bone, and trace grey
- [ ] Moss is limited to the primary action, selection, caret, or active rail
- [ ] Every phosphor use marks transformation or execution happening now
- [ ] Phosphor disappears when execution stops
- [ ] Bright phosphor uses ink foreground
- [ ] Small colored text on bone uses phosphor strong
- [ ] State is understandable without color
- [ ] 150ms transitions
- [ ] UPPERCASE for buttons, lowercase for titles
- [ ] Hover state: color inversion
- [ ] Focus ring: 1px solid with offset
- [ ] Always send screenshot of the new UI in PR bodies or design suggestions in ASCII, if you have access to AI image generation you can also leverage it 

---

## Key Files

| Purpose | Location |
|---------|----------|
| Design tokens | `apps/screenpipe-app-tauri/app/globals.css` |
| Tailwind config | `apps/screenpipe-app-tauri/tailwind.config.ts` |
| Color constants | `apps/screenpipe-app-tauri/lib/constants/colors.ts` |
| UI components | `apps/screenpipe-app-tauri/components/ui/*.tsx` |
| Website tokens | website repo: `app/globals.css` and `tailwind.config.ts` |

---
