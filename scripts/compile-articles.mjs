/**
 * compile-articles.mjs
 *
 * Standalone build-time script (no Astro API dependency).
 * Reads MDX files from src/content/articles/, parses frontmatter,
 * renders the body to HTML using marked, and outputs a JSON file
 * at src/lib/generated/articles-content.json.
 *
 * Usage: node scripts/compile-articles.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const ARTICLES_DIR = resolve(ROOT, 'src', 'content', 'articles');
const OUTPUT_DIR = resolve(ROOT, 'src', 'lib', 'generated');
const OUTPUT_FILE = resolve(OUTPUT_DIR, 'articles-content.json');

// ── Frontmatter parsing (manual — no gray-matter dependency) ────────

/**
 * Parse YAML-like frontmatter from an MDX file string.
 * Returns { metadata: Record<string, unknown>, body: string } or
 * throws if no frontmatter block is found.
 */
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
      }
    }
  }

  return { metadata, body };
}

/**
 * Parse a single YAML value: handle quoted strings, numbers, booleans.
 */
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

// ── Main ────────────────────────────────────────────────────────────

function main() {
  if (!existsSync(ARTICLES_DIR)) {
    console.error(`Error: Articles directory not found at ${ARTICLES_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'));
  if (files.length === 0) {
    console.error('Error: No MDX files found in articles directory');
    process.exit(1);
  }

  const metadata = {};
  const content = {};

  for (const file of files) {
    const filePath = resolve(ARTICLES_DIR, file);
    const raw = readFileSync(filePath, 'utf-8');
    const { metadata: fm, body } = parseFrontmatter(raw);

    const slug = fm.slug;
    if (!slug) {
      console.error(`Error: Missing slug in ${file}`);
      process.exit(1);
    }

    // Store metadata
    metadata[slug] = {
      title: fm.title || '',
      description: fm.description || '',
      category: fm.category || '',
      order: fm.order || 0,
      lastUpdated: fm.lastUpdated || '',
    };

    // Render body to HTML using marked
    const html = marked.parse(body, { async: false });
    content[slug] = html;
  }

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const output = JSON.stringify({ metadata, content }, null, 2);
  writeFileSync(OUTPUT_FILE, output, 'utf-8');

  console.log(`✓ Compiled ${files.length} articles to ${OUTPUT_FILE}`);
}

main();
