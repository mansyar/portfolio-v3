# Track 2D — Knowledge Base Implementation Plan

## Phase 1: Content Collection Rename & MDX Migration [checkpoint: 6afafa8]

### Task 1.1: Rename content collection and schema [7d6705b]

- [x] Write failing test: `articles` collection exists in `src/content.config.ts` and loads MDX from `src/content/articles/`
- [x] Rename `devopsAcademy` to `articles` in `src/content.config.ts`
- [x] Rename `devopsAcademySchema` to `articleSchema` in `src/lib/content-schemas.ts`
- [x] Change `category` from `z.enum(['Docker', 'Linux', 'CI/CD'])` to `z.string()` to support auto-discovery
- [x] Update `export const collections` in `content.config.ts` to `{ projects, articles }`
- [x] Update all test imports and references from `devopsAcademy` to `articles`/`articleSchema`
- [x] Verify: `CI=true pnpm test` passes

### Task 1.2: Migrate and expand MDX articles [e28953b]

- [x] Move `src/content/devops-academy/*.mdx` → `src/content/articles/`
- [x] Update frontmatter `category` values to match new convention (e.g., `DevOps`)
- [x] Write new article: `microservices-patterns.mdx` (category: `Software Engineering`)
- [x] Write new article: `llm-fine-tuning.mdx` (category: `AI`)
- [x] Write failing test: all 5 article files have valid frontmatter matching `articleSchema`
- [x] Verify: `CI=true pnpm test` passes

### Task 1.3: Update static metadata and filesystem [762a4a0]

- [x] Rename `DEVOPS_METADATA` → `ARTICLES_METADATA` in `src/lib/projects-data.ts`, update references
- [x] Update `FILE_SYSTEM` in `src/lib/constants.ts`: rename `DevOps_Academy` → `Knowledge_Base`
- [x] Add subfolder entries per category under `E:\Knowledge_Base\`
- [x] Place article file entries in their respective category subfolders
- [x] Update `cat` command in `commands.ts` to use `ARTICLES_METADATA`
- [x] Write failing tests for filesystem changes (new path resolves correctly)
- [x] Verify: `CI=true pnpm test` passes

- [x] Task: Conductor - User Manual Verification 'Phase 1: Content Collection Rename & MDX Migration' (Protocol in workflow.md)

## Phase 2: Build-Time MDX Compilation Pipeline

### Task 2.1: Create compile-articles script [d052d71]

- [x] Create `scripts/compile-articles.mjs` (standalone, no Astro API dependency)
- [x] Implement frontmatter parsing (manual YAML parse, no gray-matter needed)
- [x] Implement MDX body → HTML rendering using `marked` (1 package)
- [x] Output JSON to `src/lib/generated/articles-content.json`
- [x] Write failing test: script produces valid JSON with expected schema
- [x] Verify script runs successfully: `node scripts/compile-articles.mjs`

### Task 2.2: Integrate pipeline into build [b8a80a9]

- [x] Update `package.json` build script to `"build": "node scripts/compile-articles.mjs && astro build"`
- [x] Add `src/lib/generated/` to `.gitignore`
- [x] Write failing test: test file reads generated JSON and validates structure
- [x] Verify: `CI=true pnpm build` produces the JSON file without errors

- [ ] Task: Conductor - User Manual Verification 'Phase 2: Build-Time MDX Compilation Pipeline' (Protocol in workflow.md)

## Phase 3: KnowledgeBase React Island [checkpoint: 6efced0]

### Task 3.1: Create KnowledgeBase component shell [836a3b9]

- [x] Write failing test: KnowledgeBase renders with correct structure (sidebar, search bar, content pane)
- [x] Create `src/components/apps/KnowledgeBase.tsx`
- [x] Build layout: left sidebar (category nav + search), right pane (article list + detail)
- [x] Verify: `CI=true pnpm test` passes

### Task 3.2: Implement category sidebar [db8e1b6]

- [x] Write failing test: sidebar shows auto-discovered categories from article metadata (no hardcoded list)
- [x] Extract unique `category` values from metadata
- [x] Render category list with "All Articles" default selected
- [x] Clicking a category filters article list
- [x] Show "No articles in this category" empty state when category has no articles
- [x] Style as XP tree view (indented, hover highlight)
- [x] Verify: `CI=true pnpm test` passes

### Task 3.3: Implement article list and detail pane [db8e1b6]

- [x] Write failing test: clicking an article renders its HTML content
- [x] Write failing test: empty state shows when no article is selected
- [x] Render article list with title, category badge, description excerpt
- [x] Implement detail pane that displays pre-compiled HTML via `dangerouslySetInnerHTML`
- [x] Show metadata header: title, category badge, last updated date
- [x] Alternating row backgrounds with hover highlight
- [x] Ensure content area is scrollable
- [x] Show "Select an article to view" placeholder when no article selected
- [x] Verify: `CI=true pnpm test` passes

### Task 3.4: Implement search bar [db8e1b6]

- [x] Write failing test: search filters articles in real-time by title/description
- [x] Write failing test: "No results" empty state shows when search matches nothing
- [x] Add text input at top of sidebar
- [x] Implement live filter matching title or description (case-insensitive)
- [x] Search crosses category boundaries
- [x] Clear search shows all articles
- [x] Show "No articles match your search" message when no results
- [x] Verify: `CI=true pnpm test` passes

### Task 3.5: Wire KnowledgeBase into WindowLayer [db8e1b6]

- [x] Write failing test: KnowledgeBase appears when 'help' window is opened
- [x] Add KnowledgeBase rendering in `WindowLayer.tsx` for `windowId === 'help'`
- [x] Update window title to "Knowledge Base" in `DEFAULT_WINDOW_CONFIGS`
- [x] Ensure desktop icon opens KnowledgeBase correctly
- [x] Verify: `CI=true pnpm test` passes

- [x] Task: Conductor - User Manual Verification 'Phase 3: KnowledgeBase React Island' (Protocol in workflow.md)
