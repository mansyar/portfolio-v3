# Track 2D — Knowledge Base: Specification

## Overview

Build the **Knowledge Base** application: an MDX article browser styled as a classic Windows XP Help/Knowledge Base pane. This track renames the existing `devopsAcademy` content collection to `articles`, broadens its scope to include Software Engineering, AI, DevOps (and more), creates the `KnowledgeBase.tsx` React island with category sidebar and search, adds a build-time MDX-to-HTML compilation pipeline for full article body rendering, and wires everything into the window manager.

**Depends on:** Track 2A (Explorer + Content) — provides the virtual filesystem, content collection infrastructure, and content schemas.

---

## Functional Requirements

### FR1: Content Collection Rename & Broadening

- **FR1.1:** Rename the `devopsAcademy` content collection to `articles` in `src/content.config.ts`
- **FR1.2:** Rename the `devopsAcademySchema` to `articleSchema` in `src/lib/content-schemas.ts`
- **FR1.3:** Change `category` from `z.enum(['Docker', 'Linux', 'CI/CD'])` to `z.string()` to support any category value (enables auto-discovery from MDX frontmatter)
- **FR1.4:** Move MDX files from `src/content/devops-academy/` to `src/content/articles/`
- **FR1.5:** Update `projects-data.ts` references from `DEVOPS_METADATA` to `ARTICLES_METADATA`

### FR2: Virtual Filesystem Update

- **FR2.1:** Rename `E:\DevOps_Academy` folder to `E:\Knowledge_Base` in the static `FILE_SYSTEM` tree (`src/lib/constants.ts`)
- **FR2.2:** Add subfolder entries per article category (e.g., `E:\Knowledge_Base\DevOps`, `E:\Knowledge_Base\Software_Engineering`, `E:\Knowledge_Base\AI`)
- **FR2.3:** Each subfolder contains file entries for articles in that category

### FR3: MDX Articles

- **FR3.1:** Retain existing 3 stub articles (`docker-basics`, `linux-essentials`, `ci-cd-pipeline`) relocated under `src/content/articles/`
- **FR3.2:** Write 2 new articles:
  - 1 Software Engineering article
  - 1 AI/Machine Learning article (or another topic of choice)
- **FR3.3:** All articles use the `articleSchema` with: `title`, `slug`, `category`, `order`, `description`, `lastUpdated`
- **FR3.4:** Each article has meaningful MDX body content (not just frontmatter)

### FR4: Build-Time MDX-to-HTML Pipeline

- **FR4.1:** Create `scripts/compile-articles.mjs` — a standalone Node.js script (runs before `astro build`, cannot use Astro APIs) that:
  - Reads all `.mdx` files from `src/content/articles/` directly via `fs`
  - Parses frontmatter (YAML) and body content using a lightweight approach (e.g., `gray-matter` for frontmatter or manual YAML parsing)
  - Renders the MDX body to an HTML string using a lightweight markdown-to-HTML renderer (prefer `marked` — 1 package — or a simple custom renderer for headings, paragraphs, code blocks, lists, links)
  - Outputs `src/lib/generated/articles-content.json`
- **FR4.2:** The JSON schema:
  ```json
  {
    "metadata": {
      "<slug>": { "title": "", "description": "", "category": "", "order": 0, "lastUpdated": "" }
    },
    "content": {
      "<slug>": "<rendered HTML string>"
    }
  }
  ```
- **FR4.3:** Update `package.json` build script to prepend the compilation step:
  `"build": "node scripts/compile-articles.mjs && astro build"`
- **FR4.4:** Add `src/lib/generated/` to `.gitignore`
- **FR4.5:** The compiled JSON is the primary data source for the Knowledge Base app (metadata + full HTML content). The separate `ARTICLES_METADATA` in `projects-data.ts` is retained as a secondary static source for the Explorer detail pane and CMD `cat` command — both derive from the same MDX files but through different mechanisms. This dual source is acceptable for v1; future tracks may unify. Both must be updated when adding/editing articles.

### FR5: KnowledgeBase React Island

- **FR5.1:** Create `src/components/apps/KnowledgeBase.tsx` — React island accepting `windowId` prop
- **FR5.2:** **Layout structure:**
  - Left sidebar: category tree (auto-discovered from article metadata)
  - Right content pane: article list + detail view
  - Top search bar: live text filter across article titles and descriptions
- **FR5.3:** **Category sidebar:**
  - Dynamically derived from unique `category` values across all articles
  - Clicking a category filters the article list to that category
  - "All Articles" option shows all (default selected)
  - Styled as classic XP tree view (indented, expandable feel)
- **FR5.4:** **Article list:**
  - Displays article title, category badge, and description excerpt
  - Clicking an article loads its full HTML content in the detail pane
  - Visually styled with alternating row backgrounds and hover highlight
- **FR5.5:** **Detail pane:**
  - Renders the pre-compiled HTML article body via `dangerouslySetInnerHTML`
  - Displays metadata header: title, category, last updated date
  - Scrollable content area
- **FR5.6:** **Search bar:**
  - Text input at the top of the sidebar
  - Filters article list in real-time as user types (matches title or description)
  - Crosses category boundaries — shows matching articles from all categories
  - Clears to show all articles when empty
- **FR5.7:** Styled to match the classic XP Knowledge Base pane aesthetic:
  - Blue/white color scheme
  - XP 3D borders (outset/inset)
  - Tahoma 11px/12px fonts
  - Inset search input
  - Classic XP scrollbar styling

### FR6: CMD Commands Update

- **FR6.1:** Update `cat` command in `src/lib/commands.ts` to use `ARTICLES_METADATA` (renamed from `DEVOPS_METADATA`)
- **FR6.2:** Ensure `cat` still displays article metadata correctly

### FR7: Window Wiring

- **FR7.1:** Wire `KnowledgeBase` component into `WindowLayer.tsx` for `windowId === 'help'`
- **FR7.2:** Ensure the desktop icon double-click on "Knowledge Base" opens the window
- **FR7.3:** Update window title from "Help & Support" to "Knowledge Base" in `DEFAULT_WINDOW_CONFIGS`

---

## Non-Functional Requirements

- **NFR1:** Minimize new npm dependencies. The compile script should use a lightweight markdown renderer (e.g., `marked` — single package). Avoid heavy pipelines like `unified` + `remark-*` + `rehype-*` (5+ packages) since articles are plain markdown without JSX components.
- **NFR2:** The compiled articles JSON must be deterministic — same MDX files → same output every build.
- **NFR3:** KnowledgeBase component must stay under 500 lines (modularity rule).
- **NFR4:** Article HTML content is sanitized (no script injection from MDX body).
- **NFR5:** Performance: Searching/text filtering should be instant (< 50ms perceived) for the expected article count (< 50).

---

## Acceptance Criteria

```
✅ Content collection renamed from devopsAcademy to articles with broadened categories
✅ Existing 3 stub articles migrated to src/content/articles/ and still work
✅ 2 new MDX articles added (Software Engineering + AI)
✅ E:\Knowledge_Base appears in Explorer with subfolders per category
✅ scripts/compile-articles.mjs runs before astro build and generates articles-content.json
✅ pnpm build produces the compiled JSON without errors
✅ KnowledgeBase window opens from desktop icon
✅ Left sidebar shows auto-discovered categories from article frontmatter (no hardcoded list)
✅ Clicking a category filters the article list
✅ Clicking an article renders its pre-compiled HTML content
✅ Search bar filters articles in real-time by title/description
✅ Search crosses category boundaries
✅ Empty state shown when category has no articles
✅ "No results" message when search matches nothing
✅ Layout matches classic XP Knowledge Base aesthetic (blue/white, 3D borders, Tahoma)
✅ CMD cat command still works and shows article metadata
✅ All existing tests still pass
✅ All src/ files remain under 500 lines (modularity check)
```
