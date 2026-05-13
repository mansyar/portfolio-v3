import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync, readFileSync, unlinkSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const scriptsDir = resolve(__dirname, '..', 'scripts');
const generatedDir = resolve(__dirname, '..', 'src', 'lib', 'generated');
const cacheFile = resolve(generatedDir, 'github-cache.json');

// ── Module imports (dynamic — script may not exist yet) ─────────────

describe('fetch-github-stats script file', () => {
  it('should exist at scripts/fetch-github-stats.mjs', () => {
    expect(existsSync(resolve(scriptsDir, 'fetch-github-stats.mjs'))).toBe(true);
  });
});

// ── parseRepoUrl ────────────────────────────────────────────────────

describe('parseRepoUrl()', () => {
  it('should parse a standard GitHub URL', async () => {
    const mod = await import('@/../scripts/fetch-github-stats.mjs');
    const result = mod.parseRepoUrl('https://github.com/ansyarr/icarus-server-manager');
    expect(result).toEqual({ owner: 'ansyarr', repo: 'icarus-server-manager' });
  });

  it('should handle .git suffix', async () => {
    const mod = await import('@/../scripts/fetch-github-stats.mjs');
    const result = mod.parseRepoUrl('https://github.com/ansyarr/test-repo.git');
    expect(result).toEqual({ owner: 'ansyarr', repo: 'test-repo' });
  });

  it('should return null for non-GitHub URLs', async () => {
    const mod = await import('@/../scripts/fetch-github-stats.mjs');
    expect(mod.parseRepoUrl('https://gitlab.com/owner/repo')).toBeNull();
    expect(mod.parseRepoUrl('not-a-url')).toBeNull();
  });
});

// ── Cache read/write ────────────────────────────────────────────────

describe('writeCache() and readCache()', () => {
  const testData = {
    'ansyarr/test-repo': {
      name: 'test-repo',
      stargazers_count: 42,
      pushed_at: '2026-04-15T10:00:00Z',
      default_branch: 'main',
      language: 'TypeScript',
      commits: 100,
    },
  };

  beforeAll(() => {
    // Ensure generated directory exists
    if (!existsSync(generatedDir)) {
      mkdirSync(generatedDir, { recursive: true });
    }
    // Clean up any existing cache file
    if (existsSync(cacheFile)) {
      unlinkSync(cacheFile);
    }
  });

  afterAll(() => {
    // Clean up
    if (existsSync(cacheFile)) {
      unlinkSync(cacheFile);
    }
  });

  it('writeCache should create a cache file with correct JSON', async () => {
    const mod = await import('@/../scripts/fetch-github-stats.mjs');
    mod.writeCache(testData);

    expect(existsSync(cacheFile)).toBe(true);
    const raw = readFileSync(cacheFile, 'utf-8');
    const data = JSON.parse(raw);
    expect((data['ansyarr/test-repo'] as { stargazers_count: number }).stargazers_count).toBe(42);
    expect((data['ansyarr/test-repo'] as { commits: number }).commits).toBe(100);
  });

  it('readCache should return parsed data from cache file', async () => {
    const mod = await import('@/../scripts/fetch-github-stats.mjs');
    const data = mod.readCache();
    expect(data).not.toBeNull();
    expect((data!['ansyarr/test-repo'] as { name: string }).name).toBe('test-repo');
  });

  it('readCache should return null when no cache file exists', async () => {
    // Delete cache
    if (existsSync(cacheFile)) {
      unlinkSync(cacheFile);
    }
    const mod = await import('@/../scripts/fetch-github-stats.mjs');
    const data = mod.readCache();
    expect(data).toBeNull();
  });
});

// ── extractReposFromProjects ────────────────────────────────────────

describe('extractReposFromProjects()', () => {
  it('should extract repo info from project MDX files', async () => {
    const mod = await import('@/../scripts/fetch-github-stats.mjs');
    const repos = mod.extractReposFromProjects();
    expect(repos.length).toBeGreaterThanOrEqual(3); // 3 projects

    // Should find ansyarr/icarus-server-manager
    const target = repos.find(
      (r: { owner: string; repo: string }) => r.repo === 'icarus-server-manager',
    );
    expect(target).toBeDefined();
    expect(target!.owner).toBe('ansyarr');
    expect(target!.slug).toBe('icarus-server-manager');
  });
});
