---
schedule: manual
enabled: true
template: true
title: Time Breakdown
description: "Where your time went — by app, project, and category"
icon: "⏱"
featured: true
---

## 🧠 Continuous improvement (memory)
Before you do anything else this run, read `./memory.md` (a file in this pipe's own folder) if it exists and apply its lessons — this is how you get better each run instead of starting cold. If it's missing, create it with a `# memory` heading followed by a `## Lessons` heading.

After you finish the run, append at most 1–3 NEW one-line lessons under `## Lessons`, each prefixed with today's date — but only if this run actually taught you something durable and reusable (a pattern that worked, a mistake to avoid, a user correction, or a stable fact about this user's setup). If you learned nothing new, write nothing.

Keep memory healthy so it never drifts:
- Append-only: never delete or rewrite earlier lessons or anything the user added. The one exception is retracting a lesson you can now prove wrong — add a new dated line saying which one and why.
- Cap the file at ~150 lines / 8KB. When it is over, merge duplicates and drop the oldest low-value lessons first; never drop notes the user wrote.
- Save observations and rules, not new tasks — and nothing that changes your core job. Never edit this `pipe.md` prompt.
- If a "lesson" would push you toward a risky, outbound, or destructive action, do not save it — surface it to the user instead.

Analyze my app usage from today (last 12 hours). Read the screenpipe skill first. Use limit=10 per search, max 4 searches. Start with the activity summary and use its measured active-time fields for time by app. Never convert frame counts into duration. Use only screenpipe's recorded data, not this project's files or other apps' source.

Use this exact format with durations and percentages:

## By Application
- Each app with duration and percentage, sorted by time (e.g. "VS Code: 2h 15min (28%)").

## By Category
- Group into: coding, meetings, browsing, writing, communication, other. Show hours and % per category.

## By Project
- Group related activity by project/topic. Name specific repos or tasks.

## Sustained Work
- Longest evidence-backed interval on one project or workstream, with the continuity and idle-gap rule used. If project continuity is unclear, say unavailable. Do not turn application categories into a focus or productivity score.

## Workstream Transitions
- Evidence-backed transitions between different projects or workstreams. Do not count application changes within the same supported workstream.

End with: "**Next experiment:** [one small reversible change, the measured pattern behind it, and what to observe next time]"
