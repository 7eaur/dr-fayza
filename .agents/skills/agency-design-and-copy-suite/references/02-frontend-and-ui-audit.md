# Reference 02 — Frontend design, brand and UI audit

Read ALL parts before any visual redesign. The studio standard is a distinctive clinic-specific design rather than repetitive templates. Use only approved branding and medical claims.


---

# Anthropic frontend design guidance (Apache-2.0)
**Upstream:** https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md

---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
license: Complete terms in LICENSE.txt
---

# Frontend Design

Approach this as the design lead at a design studio known for giving every client a distinct visual identity that is not mistaken for anyone else's. This client has already rejected proposals that felt cliché or templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take aesthetic risk if justified.

## Ground your designs in the subject matter

If the brief does not identify what the product or subject matter is, identify it yourself before designing, and confirm with the client. You can come up with one concrete subject, the design's audience, and the design's primary job, as a proposal. If there's any information in your memory about the client's preferences or context about what they're building, use that as a hint. The subject's industry, subject matter, materials, and vernacular are where distinctive visual choices come from — a design for a toy for girls aged 8–11 will be very aesthetically different from a dashboard for financial analysts. Build with the brief's real content and subject matter throughout.

## Design principles

For web designs, the hero is the first thing viewers will see. Open with the most characteristic thing in the subject's world, in the form that is most appropriate: a headline, an image, an animation, a live demo, an interactive moment, or other treatments. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the default treatment, so only use it if that's truly the best option.

Typography carries the personality of the page. You don't need a different typeface for display or headline text and body content: use one family or two, and if two, make them clearly distinct.

Choose your typefaces deliberately, not the default families you would reach for on any other project, and set a clear type scale following the default guidance of The Elements of Typographic Style with intentional weights, widths, and spacing. When type is used as a headline or visual element, use the type treatment itself as an active part of the design, not a neutral delivery vehicle for the content.

Default to line lengths of less than 80 characters. Serif typefaces can have slightly longer line lengths; give serif body text slightly more line-height than a sans-serif.

Avoid these default typographic treatments; they are the commonest tells of a generated page:
- Accenting just a single word or phrase in a headline, like putting one word in italic/bold or a different color.
- Using all caps for labels.
- Adding unnecessary typographic labels above content.

Visual structure is information. Structural devices like outlines, borders, numbering, eyebrows, dividers, labels, etc., encode useful information about the content rather than decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence — like a stepped process or a timeline. Before adding numbered markers, check the content really is a sequence.

Use non-user-triggered motion sparingly and deliberately, only to draw attention. A single orchestrated moment — one page-load sequence or one reveal — lands better than scattered effects; fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated. Motion that answers a person's action (opening, expanding, confirming) is welcome when it shows what changed.

Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy and placeholder content. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.

## Process: plan, review against the brief, build, critique

For calibration, AI-generated design right now clusters around some traits:
1. a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta or warm-clay accent (often near #D97757 — Anthropic's own Claude-interaction accent, so on a user's brief it reads as a tell);
2. a near-black background with a single bright acid-green or vermilion accent;
3. a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns;
4. the SaaS-card kit: content chopped into identical rounded cards, one border-radius on everything regardless of hierarchy, the same soft grey shadow (rgba(0,0,0,.1)) under each, and gradient washes as decoration;
5. template chrome that appears whatever the subject: a tracked-out ALL-CAPS eyebrow label above every heading; meta strings joined with middle dots ('A · B · C'); labels built as 'WORD — fragment' with a spaced em dash; tinted near-black (#0B0B0B, #111) standing in for black; a monospace face for small data labels; a '→' appended to link and button text.

All traits are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. As with a hired human designer, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.

Work in two passes. First, brainstorm a short design plan based on the client's design brief: create a compact token system with color, type, layout, and principles.
- Color: describe the core base palette as 4–6 named hex values.
- Type: the typefaces and their roles.
- Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Include alignment guidance; should the content be left aligned, center aligned, justified?
- Principles: the high-level guidance for what makes this page unique.

Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you start to write the code, following the revised plan.

When writing the code, be careful of structuring your CSS selector specificities. It's easy to generate CSS classes that cancel each other out (especially with a type-based selector like .section and an element-based selector like .cta). This can happen often with padding/margin between sections.

## Restraint and self-critique

Spend your boldness in one place. Let one element be the memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected, visually accessible, harmonious color palettes. Critique your own work as you build, taking screenshots to review if your environment supports it — a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creatives have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.

## More on writing in design

Words appear in a design for one reason: to make it easier to understand and use. They are design content, not decoration. Bring the same intentionality and minimalism to copywriting that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's perspective. Name things by what users will understand in simple language, not by how the system is built. A user manages notifications, not webhook config. Describe what something is or does in plain terms rather than selling it. Being specific and legible to new users is always better than being clever.

Use active voice as default. A CTA says exactly what happens when it is used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the tone conversational: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each written element do exactly one job.



## Mandatory 19-axis audit checklist
1. **Typography and legibility**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
2. **Brand palette and contrast**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
3. **Spacing and alignment**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
4. **Information hierarchy**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
5. **Component consistency**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
6. **WCAG access**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
7. **Forms and error guidance**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
8. **Motion and animation**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
9. **Theming and dark mode**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
10. **Responsive layouts**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
11. **Loading/empty/error/success**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
12. **UX writing**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
13. **Localization and RTL**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
14. **Elevation and surfaces**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
15. **Iconography and imagery**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
16. **Navigation and IA**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
17. **Design tokens**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
18. **Ethical design and dark patterns**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.
19. **Nielsen heuristics**: inspect actual viewport and code, cite route, component, user impact and severity; mark unverified when not measured.


---

# Podo design-auditor routing pointer (MIT)
**Upstream:** https://github.com/podo/design-agent-skills/blob/main/skills/design-auditor/SKILL.md

---
name: design-auditor
description: |
  Audits designs across 19 professional categories including typography, color/contrast, spacing, visual hierarchy, consistency, WCAG, forms, motion, dark mode, responsive, loading/empty/error states, microcopy, i18n/RTL, elevation, iconography, navigation, design tokens, ethical design/dark patterns, and Nielsen heuristics. Scores 0-100 with severity-ranked issues.
triggers:
  - "design audit"
  - "design score"
  - "19 categories"
  - "design-auditor"
  - "design quality check"
das:
  type: skill
  category: interaction-polish
  upstream: "https://github.com/Ashutos1997/claude-design-auditor-skill"
  upstream_path: "SKILL.md"
  version: latest
  install: true
---

# design-auditor

> Catalogue stub — full skill: [Ashutos1997/claude-design-auditor-skill](https://github.com/Ashutos1997/claude-design-auditor-skill)

<!-- das:install:start — generated from stub.yaml by `npm run generate`; edit stub.yaml, not this block -->
## Decision tree

1. **Is the full skill already installed?**
   - Global: `f=~/.agents/skills/design-auditor/SKILL.md; [ -f "$f" ] && ! grep -q "^das:" "$f" && echo "installed" || echo "pointer"`
   - Project: `f=.agents/skills/design-auditor/SKILL.md; [ -f "$f" ] && ! grep -q "^das:" "$f" && echo "installed" || echo "pointer"`
   - `installed` → the skill is installed as `design-auditor`, invoke it and proceed
   - `pointer` → go to step 2

2. **Detect scope, then install:**

   ```bash
   [ -e ~/.agents/skills/design-auditor ] && echo "global" || echo "project"
   ```

   **Global:**
   ```bash
   npx skills add Ashutos1997/claude-design-auditor-skill --skill design-auditor -g -y
   ```

   **Project:**
   ```bash
   npx skills add Ashutos1997/claude-design-auditor-skill --skill design-auditor -y
   ```
   > **Claude Code:** send a command as a chat message starting with `!` to run it without leaving the conversation.

**Heads-up**

- **Requires:** Figma MCP server (optional, only to audit Figma links; without it the skill asks for a screenshot or code)
- **License:** no LICENSE file in the repo
<!-- das:install:end -->

## Invoke after install

- Skill name: `design-auditor`
- Trigger phrases: "design audit", "design score", "19 categories", "design-auditor", "design quality check"

## What it does

Comprehensive design audit skill that evaluates designs across 19 professional categories: typography, color/contrast, spacing, visual hierarchy, consistency, WCAG accessibility, forms, motion/animation, dark mode, responsive design, loading states, empty states, error states, microcopy, i18n/RTL support, elevation/shadows, iconography, navigation, design tokens, ethical design and dark patterns, and Nielsen heuristics. Produces a 0-100 score with issues ranked by severity so the most impactful problems surface first. Audits code (HTML, CSS, React, Vue, Tailwind) and screenshots, and Figma links when the Figma MCP server is connected. Replies in English or Korean to match the request. The upstream SKILL.md is large (about 160 KB), so expect a heavy context load when it triggers.

## When NOT to use

- Accessibility-only audits — use `fixing-accessibility` for a focused WCAG pass
- WCAG-specific compliance documentation — use `wcag-audit-patterns`



---

# Podo brand-design routing pointer (MIT)
**Upstream:** https://github.com/podo/design-agent-skills/blob/main/skills/brand-design-md/SKILL.md

---
name: brand-design-md
description: |
  Looks up the design spec (a DESIGN.md of colors, type weights, letter-spacing, radii,
  shadows) for well-known brands such as Stripe, Linear, Apple, Figma, Notion and Nike
  from getdesign.md at runtime, then applies it to your project. The installed skill is
  written in Chinese but accepts English brand names.
triggers:
  - "brand tokens"
  - "brand design"
  - "match Stripe design"
  - "62 brands"
  - "brand-design-md"
das:
  type: skill
  category: design-systems
  upstream: "https://github.com/SpaceZephyr/brand-design-md"
  upstream_path: "SKILL.md"
  version: latest
  install: true
---

# brand-design-md

> Catalogue stub — full skill: [SpaceZephyr/brand-design-md](https://github.com/SpaceZephyr/brand-design-md)

<!-- das:install:start — generated from stub.yaml by `npm run generate`; edit stub.yaml, not this block -->
## Decision tree

1. **Is the full skill already installed?**
   - Global: `f=~/.agents/skills/brand-design-md/SKILL.md; [ -f "$f" ] && ! grep -q "^das:" "$f" && echo "installed" || echo "pointer"`
   - Project: `f=.agents/skills/brand-design-md/SKILL.md; [ -f "$f" ] && ! grep -q "^das:" "$f" && echo "installed" || echo "pointer"`
   - `installed` → the skill is installed as `brand-design-md`, invoke it and proceed
   - `pointer` → go to step 2

2. **Detect scope, then install:**

   ```bash
   [ -e ~/.agents/skills/brand-design-md ] && echo "global" || echo "project"
   ```

   **Global:**
   ```bash
   npx skills add SpaceZephyr/brand-design-md --skill brand-design-md -g -y
   ```

   **Project:**
   ```bash
   npx skills add SpaceZephyr/brand-design-md --skill brand-design-md -y
   ```
   > **Claude Code:** send a command as a chat message starting with `!` to run it without leaving the conversation.

**Heads-up**

- **Requires:** Node.js and network access at use time (the skill runs `npx getdesign@latest add <brand>`, which downloads and executes an unpinned third-party npm package)
- **License:** no LICENSE file
<!-- das:install:end -->

## Invoke after install

- Skill name: `brand-design-md`
- Trigger phrases: "brand tokens", "brand design", "match Stripe design", "62 brands", "brand-design-md"

## What it does

Maps a brand name (Chinese or English, e.g. "做成 Stripe 的感觉", "make it feel like Linear") to a slug in its brand registry, runs `npx getdesign@latest add <slug>` in a temp directory to fetch that brand's `DESIGN.md` from getdesign.md, and then generates UI code that follows the exact values in it (colors, type scale, spacing, border-radius, shadows). It can blend several brands ("Notion colors + Linear typography"). Useful for demos, pitch material or brand-matched prototypes without manual research.

Two things to know before using it: the skill's own instructions are written in Chinese, and it executes an unpinned third-party npm package (`getdesign@latest`) at use time, so it needs Node.js and network access.

## When NOT to use

- When you need to develop a custom brand identity from scratch (this skill matches existing brands, not creates new ones)
- When none of the registry brands match your target (use `design-consultation` to build a bespoke system)
- When brand token accuracy is legally or contractually sensitive (always verify tokens against official brand guidelines)
- When running an unpinned `npx` package at use time is not acceptable in your environment


> Source caveat: Podo routes to separate external upstreams; this reference includes the Podo pointers and the 19-axis operational checklist, not unlicensed third-party private/runtime material. Never execute unpinned upstream scripts.
