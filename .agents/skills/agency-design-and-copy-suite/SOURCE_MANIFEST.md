# Source provenance, scope and licensing

**Prepared:** 2026-11-09  
**Bundle ID:** `agency-design-and-copy-suite`  
**Type:** multi-file agent skill (one router, four self-contained authored references).

## Coverage and truthfulness

This package was designed after inspecting public GitHub repositories and representative skill/rule files. Its reference chapters provide detailed **newly authored operational guidance** covering the requested topics. They are **not identical full-text copies** of upstream source material, and this distribution must not be represented as containing every original upstream paragraph, example, revision or ancillary file. The added `scripts/sync_upstreams.py` can retrieve original source files directly from GitHub when Internet access is available. This distinction is intentional and appears in `SKILL.md` as well.

Some upstream skills are small **pointers**, not complete rulebooks. In particular, Vercel's `web-design-guidelines` and `writing-guidelines` skill entry points fetch external `command.md` documents at runtime. The `podo/design-agent-skills` repository is a *catalogue*: many entries are pointer stubs that install upstream skill implementations on demand. Failing to follow those upstream links would produce an incomplete reference.

## Requested mapping and verified repository equivalents

| Requested family | Verified public source | Actual skill / artifact | Local authored reference |
|---|---|---|---|
| Vercel web design | https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines | `SKILL.md` (router) | 01 |
| Vercel complete web rules | https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md | `command.md` (rulebook) | 01 |
| Vercel React engineering | https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices | `SKILL.md`, `AGENTS.md`, `rules/*.md` | 01 |
| Anthropic frontend design | https://github.com/anthropics/skills/tree/main/skills/frontend-design | `SKILL.md`, `LICENSE.txt` | 02 |
| podo “ui-audit” requested alias | https://github.com/podo/design-agent-skills/tree/main/skills/design-auditor | Closest named catalogue item: `design-auditor` (not `ui-audit`) | 02 |
| design-auditor full upstream | https://github.com/Ashutos1997/claude-design-auditor-skill | Upstream implementation; licensing must be checked separately | 02 |
| podo “brand-identity” requested alias | https://github.com/podo/design-agent-skills/tree/main/skills/brand-design-md | Closest identified branded design-spec skill: `brand-design-md` (not `brand-identity`) | 02 |
| brand-design-md full upstream | https://github.com/SpaceZephyr/brand-design-md | Upstream implementation; licensing must be checked separately | 02 |
| Corey marketing copy | https://github.com/coreyhaines31/marketingskills/tree/main/skills/copywriting | `SKILL.md`, `references/` | 03 |
| Corey marketing psychology | https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-psychology | `SKILL.md` | 03 |
| Vercel prose writing | https://github.com/vercel-labs/agent-skills/tree/main/skills/writing-guidelines | `SKILL.md` (router) | 04 |
| Vercel complete writing rules | https://github.com/vercel-labs/writing-guidelines/blob/main/command.md | `command.md` (rulebook) | 04 |
| podo UX writing | https://github.com/podo/design-agent-skills/tree/main/skills/ux-writing-skill | Catalogue item `ux-writing-skill`, full upstream skill named `ux-writing` | 04 |
| UX writing full upstream | https://github.com/content-designer/ux-writing-skill | Upstream implementation; licensing must be checked separately | 04 |
| podo humanize text | https://github.com/podo/design-agent-skills/tree/main/skills/humanize-text | Catalogue stub, not full text | 04 |
| humanize-text full upstream | https://github.com/gregorymm/humanize-text | `skills/humanize-text/SKILL.md` | 04 |

## Attribution and copyright

- `coreyhaines31/marketingskills`: MIT license, copyright Corey Haines (2025).
- `podo/design-agent-skills`: MIT license, copyright Giedrius Jaloveckas (2026).
- `vercel-labs/web-interface-guidelines`: MIT license, copyright Vercel Labs (2025).
- `vercel-labs/writing-guidelines`: MIT license, copyright Vercel Labs (2026).
- `vercel-labs/agent-skills/skills/react-best-practices/SKILL.md` declares MIT license.
- `anthropics/skills/skills/frontend-design` includes Apache License 2.0.
- The original upstream projects linked by podo may have independent license obligations. Do not presume podo's MIT permission automatically covers each upstream implementation.

This bundle does not include full upstream copyrighted files. If running the optional source fetcher, retain the upstream authors' copyrights and LICENSE files and review each license before redistribution.

## Snapshot limitations

The public sources may evolve. This bundle describes a reviewed November 2026 source family, not a guarantee that it contains future changes. Vercel's original entrypoints explicitly fetch their latest rulebook on each use. For strict provenance, fetch and pin an upstream SHA using the optional script, review the individual source files and run all applicable checks again. Actual UI verification also requires the target application's rendered behavior, which cannot be bundled generically.