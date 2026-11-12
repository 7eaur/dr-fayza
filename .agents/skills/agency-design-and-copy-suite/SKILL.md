---
name: agency-design-and-copy-suite
description: >-
  Comprehensive agency-grade website design, frontend engineering, React/Next.js
  optimization, UI/UX and accessibility audits, brand identity, conversion
  copywriting, landing pages, marketing psychology, UX microcopy, and human
  editorial polishing in Arabic or English. MUST activate whenever the user
  asks to design, build, redesign, review, or improve a website, UI, dashboard,
  mobile-responsive page, React component, visual identity, landing page,
  promotional content, ad copy, calls to action, or interface text—even if the
  user mentions only one section, a screenshot, or an existing design.
---

# Agency Design & Copy Suite — Master Router

> **Invariant:** Do not begin producing, changing, evaluating, or delivering a design or a piece of copy until you have read the applicable **entire** reference file(s). Read them as operational instructions, not optional inspiration. Do not claim that you performed a visual or technical check without real evidence.

## 1. Routing — mandatory before any execution

| User task / detectable signal | Required reference(s) | Typical application |
|---|---|---|
| Website, React, Next.js, code, forms, performance, CSS, interaction, accessibility | `references/01-vercel-web-and-react.md` | Build, refactor, troubleshoot, audit |
| UI look and feel, hero, layout, responsive design, brand, design-system, design critique, visual review | `references/02-frontend-and-ui-audit.md` | Art direction, identity, visual QA |
| Marketing site, landing page, headline, offer, ad, CTA, product/service copy, conversion, CRO | `references/03-copywriting-and-cro.md` | Page structure, persuasion, experimentation |
| Button/error/empty-state copy, notifications, onboarding, proofreading, humanizing, documentation | `references/04-ux-writing-and-humanize.md` | Microcopy, voice, editorial QA |
| **Complete agency website / redesign / launch** | **ALL FOUR REFERENCES** | Design, implementation, persuasive messaging, quality assurance |
| Audit of an existing website with live screens | **ALL FOUR REFERENCES** when marketing-facing | Inspect desktop/mobile, copy, states, code when accessible |
| Pure internal app/dashboard | 01 + 02 + 04, add 03 only if conversion/marketing claims | Product clarity and task performance |
| Social/ad writing without UI | 03 + 04; 02 if image/layout requested | Credible concise marketing |

When unsure whether a reference is relevant, **read it**. When the task changes midway, re-run routing and read any newly applicable file. If information is absent, declare the assumption; do not invent a logo, testimonial, credential, price, customer, claim, award, statistic, or screenshot.

## 2. Intake and context-first protocol

1. Identify the deliverable, audience, market, user task, language and direction (RTL/LTR), platform/stack, and constraints.
2. Read existing brand assets, design tokens, current UI, business facts, project files, screenshots, and prior approved decisions when accessible.
3. Separate facts supplied by client, facts verified from evidence, provisional assumptions, and unknowns.
4. Preserve existing functioning behavior and project architecture unless a redesign or migration is specifically requested.
5. For long-form website work, define: one business objective, one primary audience, one primary action, real value proposition, proof inventory, and section hierarchy.
6. For visual work, propose a distinctive creative direction with palette, type hierarchy, layout grammar, photography/illustration guidance, and motion principles **before** implementing.
7. For review work, inspect actual screenshots, DOM/code if available, keyboard/touch behavior, and responsive states; label unverified claims as unverified.

## 3. Execution order — non-skippable

**A. Discover**: brief -> evidence -> audience/task -> original assets -> constraints -> read routed references completely.

**B. Direct**: design concept, semantic content map, copy hierarchy, interaction map, tokens, breakpoints, and QA plan. Verify direction is specific to this organization rather than a default template.

**C. Create**: real hierarchy and content -> semantic HTML -> accessible controls -> responsive system -> performance-aware implementation -> explicit states -> accurate copy -> metadata.

**D. Critique**: revisit at least one mobile and one desktop width; test empty/loading/error/success/disabled/focus/hover/keyboard/reduced-motion; compare against the reference checklists; repair findings.

**E. Deliver**: output artifact/code or actionable findings, what was checked, known limitations, outstanding issues, and evidence. Do not exaggerate test coverage.

## 4. Mandatory gate — all applicable boxes must pass

Maintain this internal check table for every task; report unresolved failures if any. **Never silently skip a row.**

### Context & originality
- [ ] Sources and approved client facts were checked; uncertainty is disclosed.
- [ ] Read each relevant reference file **in full**, not merely its title or a summary.
- [ ] Audience, user objective, primary CTA, page purpose, and conversion goal are explicit where applicable.
- [ ] The design has a brief-specific visual idea, not generic gradient/glassmorphism/card spam.
- [ ] The actual original logo/brand tokens are preserved when provided.

### Accessibility & interaction
- [ ] Semantic landmarks, headings, labels, links/buttons, and image alternatives are correct.
- [ ] Contrast, visible focus, keyboard access, error association, and status announcements are checked.
- [ ] Touch targets, scrolling, focus management, RTL/LTR, and responsive behavior are checked.
- [ ] Loading, empty, error, offline/retry, success, and disabled states exist where relevant.
- [ ] Motion respects reduced-motion, does not obscure content, and avoids layout jank.

### Engineering & performance
- [ ] Review all relevant React/Next.js waterfall, bundle, server, client, render, and state rules.
- [ ] Independent requests are parallelized appropriately; no accidental N+1/waterfalls.
- [ ] Media is responsive, dimensioned, optimized, and not downloaded unnecessarily.
- [ ] Server-side permissions are checked server-side; secrets not embedded in clients.
- [ ] No unverified performance claims; measurements are distinguished from predictions.

### Copy, conversion & trust
- [ ] A clear value proposition is visible in the hero where applicable.
- [ ] Every section performs one meaningful user job and leads toward a relevant next action.
- [ ] Specific benefits, proof, objections, and CTA choices are aligned with the audience.
- [ ] Claims, scarcity, social proof, urgency, discounts, credentials, and numbers are substantiated.
- [ ] Microcopy tells users what happened, why it matters, and what action to take.
- [ ] Check both Arabic and English anti-cliché/AI-pattern lists in ref 04.
- [ ] Copy is idiomatic, readable aloud, respectful, culturally appropriate, and consistent with identity.

### Evidence-based review & delivery
- [ ] Desktop + phone layouts reviewed (visually if actual UI is available).
- [ ] All severe issues fixed or clearly itemized with severity and file/component location.
- [ ] User-visible output contains complete requested artifacts, not only proposals.
- [ ] Sources/assumptions/testing limits are stated; no fabricated checks or test results.

If a box cannot be checked due to missing code, deployment, image, or access, mark **NOT VERIFIED** and continue with the best supported result. A mandatory checklist is not permission to invent evidence.

## 5. Reporting / decision format

For new design: `Creative direction -> Information architecture -> Section-by-section content -> Implementation -> QA -> Remaining risks`.

For an audit: `Location -> Evidence -> Finding -> User impact -> Severity (Critical/High/Medium/Low) -> Recommended fix -> Verification`.

For copy: `Audience / promise / proof -> Main version -> Alternatives only when useful -> Claim verification -> CTA -> Human editorial pass`.

Use real `file:line` citations when source code line numbers are available; otherwise label by page/section. Distinguish issue severity from subjective design preferences.

## 6. Reference authority and update policy

The four references are original, operational, self-contained guidance synthesized from the source families identified in `SOURCE_MANIFEST.md`. **They are not verbatim, byte-for-byte reproductions of all upstream documents**; upstreams include additional files and runtime-fetched rulebooks. Do not describe the bundle as a full archive of upstream text. For a verbatim upstream audit or to track rule changes, consult the canonical URLs in that manifest and applicable licenses. Where source guidance conflicts, prefer security, accessibility, truthfulness, then documented user/brand requirements, then performance, then aesthetic taste.

Reference files:
1. `references/01-vercel-web-and-react.md`
2. `references/02-frontend-and-ui-audit.md`
3. `references/03-copywriting-and-cro.md`
4. `references/04-ux-writing-and-humanize.md`

No companion network service, packages, API keys, or external runtime dependencies are required to **use** this bundle.