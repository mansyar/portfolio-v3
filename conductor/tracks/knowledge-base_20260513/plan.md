# Track 2D — Knowledge Base Implementation Plan

## Phase 1: Content Collection Rename & MDX Migration

### Task 1.1: Rename content collection and schema

- [ ] Write failing test: `articles` collection exists in `src/content.config.ts` and loads MDX from `src/content/articles/`
- [ ] Rename `devopsAcademy` to `articles` in `src/content.config.ts`
- [ ] Rename `devopsAcademySchema` to `articleSchema` in `src/lib/content-schemas.ts`
- [ ] Change `category` from `z.enum(['Docker', 'Linux', 'CI/CD'])` to `z.string()` to support auto-discovery
- [ ] Update `export const collections` in `content.config.ts` to `{ projects, articles }`
- [ ] Update all test imports and references from `devopsAcademy` to `articles`/`articleSchema`
- [ ] Verify: `CI=true pnpm test` passes

### Task 1.2: Migrate and expand MDX articles

- [ ] Move `src/content/devops-academy/*.mdx` → `src/content/articles/`
- [ ] Update frontmatter `category` values to match new convention (e.g., `DevOps`)
- [ ] Write new article: `microservices-patterns.mdx` (category: `Software Engineering`)
- [ ] Write new article: `llm-fine-tuning.mdx` (category: `AI`)
- [ ] Write failing test: all 5 article files have valid frontmatter matching `articleSchema`
- [ ] Verify: `CI=true pnpm test` passes

### Task 1.3: Update static metadata and filesystem

- [ ] Rename `DEVOPS_METADATA` → `ARTICLES_METADATA` in `src/lib/projects-data.ts`, update references
- [ ] Update `FILE_SYSTEM` in `src/lib/constants.ts`: rename `DevOps_Academy` → `Knowledge_Base`
- [ ] Add subfolder entries per category under `E:\Knowledge_Base\`
- [ ] Place article file entries in their respective category subfolders
- [ ] Update `cat` command in `commands.ts` to use `ARTICLES_METADATA`
- [ ] Write failing tests for filesystem changes (new path resolves correctly)
- [ ] Verify: `CI=true pnpm test` passes

- [ ] Task: Conductor - User Manual Verification 'Phase 1: Content Collection Rename & MDX Migration' (Protocol in workflow.md)

## Phase 2: Build-Time MDX Compilation Pipeline

### Task 2.1: Create compile-articles script

- [ ] Create `scripts/compile-articles.mjs` (standalone, no Astro API dependency)
- [ ] Implement frontmatter parsing (manual YAML parse, or install `gray-matter`)
- [ ] Implement MDX body → HTML rendering using lightweight markdown renderer (e.g., `marked` — 1 package)
- [ ] Output JSON to `src/lib/generated/articles-content.json`
- [ ] Write failing test: script produces valid JSON with expected schema
- [ ] Verify script runs successfully: `node scripts/compile-articles.mjs`

### Task 2.2: Integrate pipeline into build

- [ ] Update `package.json` build script to `"build": "node scripts/compile-articles.mjs && astro build"`
- [ ] Add `src/lib/generated/` to `.gitignore`
- [ ] Write failing test: test file reads generated JSON and validates structure
- [ ] Verify: `CI=true pnpm build` produces the JSON file without errors

- [ ] Task: Conductor - User Manual Verification 'Phase 2: Build-Time MDX Compilation Pipeline' (Protocol in workflow.md)

## Phase 3: KnowledgeBase React Island

### Task 3.1: Create KnowledgeBase component shell

- [ ] Write failing test: KnowledgeBase renders with correct structure (sidebar, search bar, content pane)
- [ ] Create `src/components/apps/KnowledgeBase.tsx`
- [ ] Implement import of `articles-content.json` (metadata + content)
- [ ] Build layout: left sidebar (category nav + search), right pane (article list + detail)
- [ ] Style with XP blue/white color scheme, 3D borders, Tahoma fonts
- [ ] Verify: `CI=true pnpm test` passes

### Task 3.2: Implement category sidebar

- [ ] Write failing test: sidebar shows auto-discovered categories from article metadata (no hardcoded list)
- [ ] Extract unique `category` values from metadata
- [ ] Render category list with "All Articles" default selected
- [ ] Clicking a category filters article list
- [ ] Show "No articles in this category" empty state when category has no articles
- [ ] Style as XP tree view (indented, hover highlight)
- [ ] Verify: `CI=true pnpm test` passes

### Task 3.3: Implement article list and detail pane

- [ ] Write failing test: clicking an article renders its HTML content
- [ ] Write failing test: empty state shows when no article is selected
- [ ] Render article list with title, category badge, description excerpt
- [ ] Implement detail pane that displays pre-compiled HTML via `dangerouslySetInnerHTML`
- [ ] Show metadata header: title, category badge, last updated date
- [ ] Alternating row backgrounds with hover highlight
- [ ] Ensure content area is scrollable
- [ ] Show "Select an article to view" placeholder when no article selected
- [ ] Verify: `CI=true pnpm test` passes

### Task 3.4: Implement search bar

- [ ] Write failing test: search filters articles in real-time by title/description
- [ ] Write failing test: "No results" empty state shows when search matches nothing
- [ ] Add text input at top of sidebar
- [ ] Implement live filter matching title or description (case-insensitive)
- [ ] Search crosses category boundaries
- [ ] Clear search shows all articles
- [ ] Show "No articles match your search" message when no results
- [ ] Verify: `CI=true pnpm test` passes

### Task 3.5: Wire KnowledgeBase into WindowLayer

- [ ] Write failing test: KnowledgeBase appears when 'help' window is opened
- [ ] Add KnowledgeBase rendering in `WindowLayer.tsx` for `windowId === 'help'`
- [ ] Update window title to "Knowledge Base" in `DEFAULT_WINDOW_CONFIGS`
- [ ] Ensure desktop icon opens KnowledgeBase correctly
- [ ] Verify: `CI=true pnpm test` passes

- [ ] Task: Conductor - User Manual Verification 'Phase 3: KnowledgeBase React Island' (Protocol in workflow.md)
