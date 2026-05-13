/**
 * compile-projects.mjs
 *
 * Standalone build-time script (no Astro API dependency).
 * Reads project MDX files from src/content/projects/, parses frontmatter,
 * renders the body to HTML using marked, merges with GitHub API data from
 * github-cache.json, and outputs a JSON file at
 * src/lib/generated/projects-content.json.
 *
 * Usage: node scripts/compile-projects.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const PROJECTS_DIR = resolve(ROOT, 'src', 'content', 'projects');
const GENERATED_DIR = resolve(ROOT, 'src', 'lib', 'generated');
const OUTPUT_FILE = resolve(GENERATED_DIR, 'projects-content.json');
const CACHE_FILE = resolve(GENERATED_DIR, 'github-cache.json');

// ── Frontmatter parsing (manual — no gray-matter dependency) ────────

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) throw new Error('No frontmatter block found');
  const yamlBlock = match[1];
  const body = match[2].trim();

  const metadata = {};
  let currentKey = '';

  const lines = yamlBlock.split('\n');
  for (const line of lines) {
    const keyMatch = line.match(/^(\w+):\s*(.*)/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const rawValue = keyMatch[2].trim();
      metadata[currentKey] = parseYamlValue(rawValue);
    } else if (line.trim() && currentKey) {
      // Continuation of a multi-line value (like description)
      const existing = metadata[currentKey];
      if (typeof existing === 'string') {
        metadata[currentKey] = existing + ' ' + line.trim();
      } else if (Array.isArray(existing)) {
        // List continuation (for techStack)
        const itemMatch = line.trim().match(/^\s*-\s*(.*)/);
        if (itemMatch) {
          existing.push(itemMatch[1].trim());
        }
      }
    }
    // Handle list items (like techStack)
    const listMatch = line.match(/^\s*-\s*(.*)/);
    if (listMatch && currentKey && !line.match(/^(\w+):/)) {
      const itemValue = parseYamlValue(listMatch[1].trim());
      if (!Array.isArray(metadata[currentKey])) {
        metadata[currentKey] = [];
      }
      metadata[currentKey].push(itemValue);
    }
  }

  return { metadata, body };
}

function parseYamlValue(raw) {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw === 'null' || raw === '~') return null;

  // Quoted strings
  if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
    return raw.slice(1, -1);
  }

  // Numbers
  if (/^\d+$/.test(raw)) return parseInt(raw, 10);
  if (/^\d+\.\d+$/.test(raw)) return parseFloat(raw);

  return raw;
}

/**
 * Parse frontmatter specifically for project MDX files.
 * Handles multi-line techStack arrays in YAML format.
 */
function parseProjectFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) throw new Error('No frontmatter block found');
  const yamlBlock = match[1];
  const body = match[2].trim();

  const metadata = {};
  const lines = yamlBlock.split('\n');
  let currentKey = '';

  for (const line of lines) {
    const keyMatch = line.match(/^(\w+):\s*(.*)/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const rawValue = keyMatch[2].trim();
      if (rawValue === '' || rawValue === '|') {
        // Start of a multi-line value (like techStack with pipe)
        metadata[currentKey] = [];
      } else {
        metadata[currentKey] = parseYamlValue(rawValue);
      }
    } else {
      // Handle continuation lines
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('- ')) {
        // Array item (techStack entry)
        const itemValue = parseYamlValue(trimmed.slice(2).trim());
        if (!Array.isArray(metadata[currentKey])) {
          metadata[currentKey] = [];
        }
        metadata[currentKey].push(itemValue);
      } else if (typeof metadata[currentKey] === 'string') {
        // String continuation (description)
        metadata[currentKey] += ' ' + trimmed;
      }
    }
  }

  return { metadata, body };
}

// ── GitHub cache loading ─────────────────────────────────────────────

/**
 * Load GitHub cache data, mapping owner/repo to stats.
 */
function loadGithubCache() {
  if (!existsSync(CACHE_FILE)) {
    console.warn('⚠️  No GitHub cache found. Using hardcoded values from frontmatter.');
    return {};
  }
  const raw = readFileSync(CACHE_FILE, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Build a lookup from slug → GitHub data.
 */
function buildSlugLookup(githubCache) {
  const lookup = {};
  for (const [key, data] of Object.entries(githubCache)) {
    if (data.slug) {
      lookup[data.slug] = data;
    }
  }
  return lookup;
}

// ── Main ────────────────────────────────────────────────────────────

function main() {
  if (!existsSync(PROJECTS_DIR)) {
    console.error(`Error: Projects directory not found at ${PROJECTS_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.mdx'));
  if (files.length === 0) {
    console.error('Error: No MDX files found in projects directory');
    process.exit(1);
  }

  // Load GitHub cache
  const githubCache = loadGithubCache();
  const slugLookup = buildSlugLookup(githubCache);

  const output = {};

  for (const file of files) {
    const filePath = resolve(PROJECTS_DIR, file);
    const raw = readFileSync(filePath, 'utf-8');
    const { metadata: fm, body } = parseProjectFrontmatter(raw);

    const slug = fm.slug;
    if (!slug) {
      console.error(`Error: Missing slug in ${file}`);
      process.exit(1);
    }

    // Merge GitHub API data
    const githubData = slugLookup[slug];
    if (githubData) {
      fm.stars = githubData.stargazers_count;
      fm.lastCommit = githubData.pushed_at ? githubData.pushed_at.slice(0, 10) : fm.lastCommit;
      fm.commits = githubData.commits;
    }

    // Render body to HTML using marked
    const bodyHtml = marked.parse(body, { async: false });

    output[slug] = {
      frontmatter: {
        title: fm.title || '',
        slug: fm.slug || '',
        drive: fm.drive || '',
        description: fm.description || '',
        repoUrl: fm.repoUrl || '',
        language: fm.language || '',
        techStack: Array.isArray(fm.techStack) ? fm.techStack : [],
        stars: fm.stars || 0,
        lastCommit: fm.lastCommit || '',
        commits: fm.commits || 0,
        status: fm.status || '',
        icon: fm.icon || '',
      },
      bodyHtml,
    };
  }

  // Ensure output directory exists
  if (!existsSync(GENERATED_DIR)) {
    mkdirSync(GENERATED_DIR, { recursive: true });
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`✓ Compiled ${files.length} projects to ${OUTPUT_FILE}`);
}

main();
