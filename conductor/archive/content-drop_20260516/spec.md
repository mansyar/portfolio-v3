# Specification: Track 6C — Content Drop

**Track ID:** `content-drop_20260516`
**Type:** Feature
**Status:** Approved

## Overview

Expand the portfolio's substance with new project write-ups, knowledge base articles, a redesigned professional resume PDF, and certification entries. This track adds genuine depth for recruiters evaluating the candidate — transforming the portfolio from a shell into a rich body of work.

## References

- [ROADMAP_v1.1 §Track 6C](../../docs/ROADMAP_v1.1.md#track-6c--content-drop)
- [PRD §4 — File System & Content Mapping](../../docs/PRD.md#4-file-system--content-mapping)
- [PRD §5.3 — Knowledge Base](../../docs/PRD.md#53-knowledge-base)
- [TDD §4.1 — Content Collection Schemas](../../docs/TDD.md#41-content-collection-schemas)

## Functional Requirements

### FR1 — Projects: Add 2 New MDX Files

Create two new project MDX files on `C:\Software_Engineering`:

**1. Terminal Tactics** (`terminal-tactics`)

- Type: Released game project
- GitHub: `https://github.com/mansyar/terminal-tactics`
- Drive: C (Software Engineering)
- Status: `active`
- Body: Write substantive content describing the game, its architecture, tech stack, and development journey

**2. Simulacra** (`simulacra`)

- Type: In-development project
- GitHub: `https://github.com/mansyar/simulacra`
- Drive: C (Software Engineering)
- Status: `wip`
- Body: Write substantive content describing the project concept, current state, and architecture

**Updates required:**

- Add entries to static `FILE_SYSTEM` in `src/lib/constants.ts` under `C:\Software_Engineering`
- Add metadata entries to `src/lib/projects-data.ts` (`PROJECTS_METADATA`)
- Verify dynamic generator `scripts/generate-filesystem.mjs` auto-discovers from compiled JSON
- Write tests verifying frontmatter schema for both new entries

### FR2 — Knowledge Base: Add 3 New Articles

Create three new article MDX files under the **Software Engineering** category on `E:\Knowledge_Base`:

| Article                                         | Slug                       | Order | Description                                                                                                           |
| ----------------------------------------------- | -------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------- |
| Agent-Assisted Coding (Spec-Driven Development) | `agent-assisted-coding`    | 2     | Conductor methodology, spec-first development, AI-assisted workflows, and best practices for agent-driven development |
| Test-Driven Development (TDD)                   | `tdd`                      | 3     | Red-Green-Refactor cycle, testing best practices, coverage thresholds, and integrating TDD into development workflows |
| Database Design Patterns                        | `database-design-patterns` | 4     | SQL vs NoSQL trade-offs, indexing strategies, normalization forms, sharding patterns, and real-world design decisions |

**Updates required:**

- Create MDX files in `src/content/articles/` with full frontmatter and substantive body content
- Verify `scripts/compile-articles.mjs` picks up new articles → `articles-content.json`
- Update static `FILE_SYSTEM` `E:\Knowledge_Base\Software_Engineering` folder
- Write tests verifying frontmatter schema for all new entries

### FR3 — Resume PDF Redesign

- Redesign the existing placeholder resume at `public/resume.pdf` with professional formatting
- Content (provided by user):
  - **Name:** Muhammad Ansyar Rafi Putra, MSc
  - **Contact:** ansyar.work@gmail.com, Melbourne, Victoria, Australia
  - **Links:** LinkedIn, GitHub
  - **Professional Summary:** Highly motivated engineer with experience in software development, data engineering, and instruction
  - **Work Experience:**
    - Data Engineer — G2Academy (2023)
    - DevSecOps Engineer — G2Academy (2023-2024)
    - DevSecOps Manager — Tata Informasi Asia (2024)
    - Data Engineer — G2Academy (2024-2025)
    - Data Engineering & Analysis Instructor — G2Academy (2024-Present)
  - **Top Skills:** React, Next.js, Python, TypeScript, Tailwind CSS, Kubernetes, CI/CD, PostgreSQL, etc.
  - **Education:** Bandung Institute of Technology (ITB) — Aeronautics and Astronautics; Lulea Technology University — Master of Spacecraft Design
  - **Certifications:** ACA Cloud Computing Associate, ACP Cloud Computing Professional (Alibaba Cloud)
- Verify "My Documents → Resume.pdf" opens correctly in new browser tab

### FR4 — Certifications

Add certification entries to `D:\My_Documents\Certs\` folder. Each cert is represented as a file entry in the filesystem with a unique slug that routes to a cert detail view in ExplorerDetailPane.

| Slug                  | Name                             | Issuer        | Issued   | Expires  | Credential ID       |
| --------------------- | -------------------------------- | ------------- | -------- | -------- | ------------------- |
| `acp-cloud-computing` | ACP Cloud Computing Professional | Alibaba Cloud | Mar 2024 | Mar 2026 | IACP01240300114319  |
| `aca-cloud-computing` | ACA Cloud Computing Associate    | Alibaba Cloud | Feb 2024 | Feb 2026 | IACA01240200111019L |

**Slug Routing Convention:** ExplorerDetailPane will route cert slugs (`acp-cloud-computing`, `aca-cloud-computing`) via special-cased lookup against `CERTIFICATIONS_METADATA` — following the same pattern as Contact.txt (`CONTACT_METADATA`) and Recycle Bin items (`RECYCLE_BIN_METADATA`).

**Updates required:**

- Add cert data exports to `src/lib/projects-data.ts` (`CERTIFICATIONS_METADATA` keyed by slug)
- Populate `D:\My_Documents\Certs\` folder entries in `src/lib/constants.ts` with file-type entries using these slugs
- Update `scripts/generate-filesystem.mjs` with static Certs folder population
- Create cert detail view in ExplorerDetailPane for cert items showing name, issuer, date, credential URL (special-cased by slug)
- **Update existing test** `tests/explorer.test.tsx` — the "This folder is empty" assertion for Certs must be replaced with assertions for the new cert entries

### FR5 — Build Pipeline & Documentation

- Re-run `scripts/prebuild.mjs` to regenerate all content JSON files
- Verify `pnpm build` completes with zero errors
- Update docs:
  - **PRD.md §4** — File System & Content Mapping: add new projects (C: drive), articles (E: drive), certs (D:\My_Documents\Certs); update Certs description from "empty placeholder" to populated entries
  - **PRD.md §7** — Success Metrics: bump version to v2.1, add content volume metrics (8 articles, 5 projects, 2 certs)
  - **TDD.md §4.1** — Content Collection Schemas: reflect new article count (8 total) and categories; fix pre-existing `lastUpdated` type mismatch if applicable

## Out of Scope

- Additional projects beyond Terminal Tactics and Simulacra
- Additional articles beyond the 3 specified

## Acceptance Criteria

```
✅ 2 new project MDX files (Terminal Tactics, Simulacra) render correctly in Explorer and CMD `cat`
✅ 3 new Knowledge Base articles appear in Software Engineering category and render correctly
✅ All content is deep-linkable via URL state (content in detail pane matches slug)
✅ Resume PDF at /resume.pdf opens in new browser tab from My Documents
✅ Certs folder (D:\My_Documents\Certs) displays 2 Alibaba Cloud cert entries with metadata
✅ pnpm build completes with no errors
✅ All existing tests continue to pass
✅ All src/ files under 500 lines
```

## Key Files to Create

```
src/content/projects/terminal-tactics.mdx — New project MDX entry
src/content/projects/simulacra.mdx — New project MDX entry
src/content/articles/agent-assisted-coding.mdx — New article MDX entry
src/content/articles/tdd.mdx — New article MDX entry
src/content/articles/database-design-patterns.mdx — New article MDX entry
public/resume.pdf — Redesigned professional resume PDF
tests/content-files.test.ts (modified) — New frontmatter schema tests
tests/content-schemas.test.ts (modified) — New validation tests
```

## Key Files to Modify

```
src/lib/constants.ts — Updated filesystem tree (projects, articles, certs)
src/lib/projects-data.ts — Updated PROJECTS_METADATA, ARTICLES_METADATA, new CERTIFICATIONS_METADATA
scripts/generate-filesystem.mjs — Updated content generator (certs)
src/components/apps/ExplorerDetailPane.tsx — Cert detail view for cert items
docs/PRD.md — §4 File System & Content Mapping
docs/TDD.md — §4.1 Content Collection Schemas
```
