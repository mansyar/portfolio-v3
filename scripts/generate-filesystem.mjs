/**
 * generate-filesystem.mjs
 *
 * Standalone build-time script that generates a dynamic FILE_SYSTEM tree
 * from compiled JSON outputs (projects-content.json + articles-content.json).
 *
 * Avoids re-parsing raw MDX by consuming the already-compiled outputs.
 *
 * Usage: node scripts/generate-filesystem.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const GENERATED_DIR = resolve(ROOT, 'src', 'lib', 'generated');
const PROJECTS_FILE = resolve(GENERATED_DIR, 'projects-content.json');
const ARTICLES_FILE = resolve(GENERATED_DIR, 'articles-content.json');
const OUTPUT_FILE = resolve(GENERATED_DIR, 'filesystem.json');

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Load and parse a JSON file, returning the parsed data or null.
 */
function loadJson(filePath) {
  if (!existsSync(filePath)) {
    console.warn(`  ⚠️  File not found: ${filePath}`);
    return null;
  }
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

/**
 * Format a slug as a file name with .mdx extension.
 */
function toFileName(slug) {
  return `${slug}.mdx`;
}

/**
 * Estimate file size based on slug length.
 */
function estimateSize(slug) {
  const size = Math.max(1, Math.round(slug.length * 0.3));
  return `${size}.0 KB`;
}

// ── Tree Builders ────────────────────────────────────────────────────

/**
 * Build the C: and D: drive trees from projects-content.json.
 * C: → Software_Engineering (projects with drive: C)
 * D: → Systems_Data (projects with drive: D)
 */
function buildProjectDrives(projectsContent) {
  if (!projectsContent) return [];

  const cProjects = [];
  const dProjects = [];

  for (const [slug, entry] of Object.entries(projectsContent)) {
    const drive = entry.frontmatter.drive;
    const fileNode = {
      type: 'file',
      name: toFileName(slug),
      icon: '/icons/file.svg',
      slug,
      size: estimateSize(slug),
    };

    if (drive === 'C') {
      cProjects.push(fileNode);
    } else if (drive === 'D') {
      dProjects.push(fileNode);
    }
  }

  const drives = [];

  if (cProjects.length > 0) {
    drives.push({
      type: 'drive',
      name: 'C:',
      icon: '/icons/drive-c.svg',
      children: [
        {
          type: 'folder',
          name: 'Software_Engineering',
          icon: '/icons/folder.svg',
          children: cProjects,
        },
      ],
    });
  }

  if (dProjects.length > 0) {
    drives.push({
      type: 'drive',
      name: 'D:',
      icon: '/icons/drive-d.svg',
      children: [
        {
          type: 'folder',
          name: 'Systems_Data',
          icon: '/icons/folder.svg',
          children: dProjects,
        },
      ],
    });
  }

  return drives;
}

/**
 * Build the E: drive tree from articles-content.json.
 * E: → Knowledge_Base → {category}/ → article files
 */
function buildArticleDrive(articlesContent) {
  if (!articlesContent || !articlesContent.metadata) return null;

  const categoryFolders = {};

  for (const [slug, meta] of Object.entries(articlesContent.metadata)) {
    const category = meta.category || 'Uncategorized';
    if (!categoryFolders[category]) {
      categoryFolders[category] = [];
    }
    categoryFolders[category].push({
      type: 'file',
      name: toFileName(slug),
      icon: '/icons/file.svg',
      slug,
      size: estimateSize(slug),
    });
  }

  const children = Object.entries(categoryFolders).map(([category, files]) => ({
    type: 'folder',
    name: category.replace(/ /g, '_'),
    icon: '/icons/folder.svg',
    children: files,
  }));

  return {
    type: 'drive',
    name: 'E:',
    icon: '/icons/drive-e.svg',
    children: [
      {
        type: 'folder',
        name: 'Knowledge_Base',
        icon: '/icons/folder.svg',
        children,
      },
    ],
  };
}

// ── Main ────────────────────────────────────────────────────────────

function main() {
  console.log('\n📁 Generating FILE_SYSTEM tree...\n');

  const projectsContent = loadJson(PROJECTS_FILE);
  const articlesContent = loadJson(ARTICLES_FILE);

  const projectDrives = buildProjectDrives(projectsContent);
  const articleDrive = buildArticleDrive(articlesContent);

  const filesystem = [...projectDrives];
  if (articleDrive) {
    filesystem.push(articleDrive);
  }

  // Ensure output directory exists
  if (!existsSync(GENERATED_DIR)) {
    mkdirSync(GENERATED_DIR, { recursive: true });
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(filesystem, null, 2), 'utf-8');
  console.log(`✓ Generated filesystem.json with ${filesystem.length} drives`);
}

main();
