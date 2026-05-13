/**
 * fetch-github-stats.mjs
 *
 * Standalone build-time script that fetches GitHub repository statistics
 * (stars, last commit, language, commit count) for all project repos.
 *
 * On success: writes combined data to src/lib/generated/github-cache.json
 * On failure: reads cache file if exists, logs warning; if no cache, exits with non-zero
 *
 * Usage: node scripts/fetch-github-stats.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const PROJECTS_DIR = resolve(ROOT, 'src', 'content', 'projects');
const OUTPUT_DIR = resolve(ROOT, 'src', 'lib', 'generated');
const CACHE_FILE = resolve(OUTPUT_DIR, 'github-cache.json');

// ── Repo URL extraction ─────────────────────────────────────────────

/**
 * Parse repo owner and name from a GitHub URL.
 * @param {string} url - Full GitHub repo URL (e.g. "https://github.com/ansyarr/icarus-server-manager")
 * @returns {{ owner: string, repo: string } | null}
 */
export function parseRepoUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

/**
 * Extract unique repo owner/name pairs from project MDX files.
 * Reads frontmatter manually (no gray-matter dependency).
 * @returns {Array<{ owner: string, repo: string, slug: string }>}
 */
export function extractReposFromProjects() {
  if (!existsSync(PROJECTS_DIR)) {
    console.error(`Error: Projects directory not found at ${PROJECTS_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.mdx'));
  const repos = [];
  const seen = new Set();

  for (const file of files) {
    const filePath = resolve(PROJECTS_DIR, file);
    const raw = readFileSync(filePath, 'utf-8');
    const { metadata } = parseFrontmatter(raw);

    if (!metadata.repoUrl) continue;

    const parsed = parseRepoUrl(metadata.repoUrl);
    if (!parsed) continue;

    const key = `${parsed.owner}/${parsed.repo}`;
    if (!seen.has(key)) {
      seen.add(key);
      repos.push({ ...parsed, slug: metadata.slug || '' });
    }
  }

  return repos;
}

// ── Frontmatter parsing (manual — copied from compile-articles.mjs) ──

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { metadata: {}, body: '' };
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
      const existing = metadata[currentKey];
      if (typeof existing === 'string') {
        metadata[currentKey] = existing + ' ' + line.trim();
      }
    }
  }

  return { metadata, body };
}

function parseYamlValue(raw) {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw === 'null' || raw === '~') return null;
  if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
    return raw.slice(1, -1);
  }
  if (/^\d+$/.test(raw)) return parseInt(raw, 10);
  if (/^\d+\.\d+$/.test(raw)) return parseFloat(raw);
  return raw;
}

// ── GitHub API functions (inlined to avoid TS dependency) ────────────

function buildHeaders() {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'luna-os-portfolio/1.0',
  };
  const token = process.env.GITHUB_TOKEN || '';
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetch repo stats from GitHub API.
 */
async function fetchRepoStats(owner, repo) {
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { headers: buildHeaders(), signal: controller.signal });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} for ${owner}/${repo}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetch total commit count via Link header parsing.
 */
async function fetchRepoCommitCount(owner, repo) {
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=1&page=1`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { headers: buildHeaders(), signal: controller.signal });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} for ${owner}/${repo} commits`);
    }
    const linkHeader = response.headers.get('Link');
    if (!linkHeader) return 1;
    const match = linkHeader.match(/page=(\d+)>; rel="last"/);
    if (!match) return 1;
    return parseInt(match[1], 10);
  } finally {
    clearTimeout(timeout);
  }
}

// ── Core logic ──────────────────────────────────────────────────────

/**
 * Fetch GitHub stats for all project repos and write cache.
 * Exported for testing.
 *
 * @param {Array<{ owner: string, repo: string, slug: string }>} repos
 * @returns {Promise<Record<string, object>>} The fetched data keyed by "owner/repo"
 */
export async function fetchAllRepoStats(repos) {
  const results = {};

  for (const { owner, repo, slug } of repos) {
    const key = `${owner}/${repo}`;
    try {
      const stats = await fetchRepoStats(owner, repo);
      const commits = await fetchRepoCommitCount(owner, repo);
      results[key] = {
        name: stats.name,
        stargazers_count: stats.stargazers_count,
        pushed_at: stats.pushed_at,
        default_branch: stats.default_branch,
        language: stats.language,
        commits,
        slug,
      };
      console.log(
        `  ✓ ${key}: ${stats.stargazers_count} stars, last push ${stats.pushed_at}, ${commits} commits`,
      );
    } catch (err) {
      console.error(`  ✗ ${key}: ${err.message}`);
      throw err; // Re-throw to be handled by the caller
    }
  }

  return results;
}

/**
 * Write fetched data to cache file.
 * @param {Record<string, object>} data
 */
export function writeCache(data) {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✓ Cache written to ${CACHE_FILE}`);
}

/**
 * Read cached data from cache file.
 * @returns {Record<string, object> | null}
 */
export function readCache() {
  if (!existsSync(CACHE_FILE)) return null;
  const raw = readFileSync(CACHE_FILE, 'utf-8');
  return JSON.parse(raw);
}

// ── Main entry point ────────────────────────────────────────────────

async function main() {
  console.log('\n📡 Fetching GitHub stats...\n');

  /** @type {Array<{ owner: string, repo: string, slug: string }>} */
  let repos;
  try {
    repos = extractReposFromProjects();
  } catch (err) {
    console.error(`Error reading projects: ${err.message}`);
    process.exit(1);
  }

  if (repos.length === 0) {
    console.error('Error: No project repos found in MDX files');
    process.exit(1);
  }

  try {
    const data = await fetchAllRepoStats(repos);
    writeCache(data);
    console.log('\n✅ GitHub stats fetched successfully.\n');
  } catch (err) {
    // Try cache fallback
    const cached = readCache();
    if (cached) {
      console.warn(`\n⚠️  GitHub API error: ${err.message}`);
      console.warn('⚠️  Using cached data from previous build.\n');
    } else {
      console.error(`\n❌ GitHub API error: ${err.message}`);
      console.error('❌ No cache available. Exiting.\n');
      process.exit(1);
    }
  }
}

// Run if called directly
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  main();
}

export { main };
