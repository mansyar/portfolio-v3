import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const scriptsDir = resolve(__dirname, '..', 'scripts');
const generatedDir = resolve(__dirname, '..', 'src', 'lib', 'generated');
const outputFile = resolve(generatedDir, 'projects-content.json');
const cacheFile = resolve(generatedDir, 'github-cache.json');

describe('compile-projects script', () => {
  beforeAll(() => {
    // Ensure github-cache.json exists for the compile script to merge
    if (!existsSync(cacheFile)) {
      if (!existsSync(generatedDir)) {
        mkdirSync(generatedDir, { recursive: true });
      }
      writeFileSync(
        cacheFile,
        JSON.stringify(
          {
            'mansyar/icarus-server-manager': {
              name: 'icarus-server-manager',
              stargazers_count: 0,
              pushed_at: '2026-03-21T02:12:37Z',
              default_branch: 'main',
              language: 'Python',
              commits: 406,
            },
            'mansyar/chasing-chapters-v2': {
              name: 'chasing-chapters-v2',
              stargazers_count: 0,
              pushed_at: '2026-01-19T09:01:47Z',
              default_branch: 'main',
              language: 'TypeScript',
              commits: 90,
            },
            'mansyar/tubular-bexus-osw': {
              name: 'tubular-bexus-osw',
              stargazers_count: 0,
              pushed_at: '2018-01-16T13:44:54Z',
              default_branch: 'master',
              language: null,
              commits: 1,
            },
            'mansyar/terminal-tactics': {
              name: 'terminal-tactics',
              stargazers_count: 0,
              pushed_at: '2026-05-01T10:00:00Z',
              default_branch: 'main',
              language: 'TypeScript',
              commits: 120,
            },
          },
          null,
          2,
        ),
        'utf-8',
      );
    }

    // Run the compile script
    if (existsSync(resolve(scriptsDir, 'compile-projects.mjs'))) {
      try {
        execSync('node scripts/compile-projects.mjs', {
          cwd: resolve(__dirname, '..'),
          stdio: 'pipe',
        });
      } catch {
        // Script may fail — that's fine, tests will fail gracefully
      }
    }
  });

  it('should have a compile-projects.mjs script file', () => {
    expect(existsSync(resolve(scriptsDir, 'compile-projects.mjs'))).toBe(true);
  });

  it('should generate projects-content.json at the correct path', () => {
    expect(existsSync(outputFile)).toBe(true);
  });

  it('should generate valid JSON with frontmatter and bodyHtml per slug', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    expect(data).toHaveProperty('icarus-server-manager');
    expect(data).toHaveProperty('chasing-chapters');
    expect(data).toHaveProperty('tubular-bexus-osw');
    expect(data).toHaveProperty('terminal-tactics');
  });

  it('should have correct metadata structure for icarus-server-manager', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    const entry = data['icarus-server-manager'];
    expect(entry).toHaveProperty('frontmatter');
    expect(entry).toHaveProperty('bodyHtml');
    expect(entry.frontmatter.title).toBe('Icarus Server Manager');
    expect(entry.frontmatter.slug).toBe('icarus-server-manager');
    expect(entry.frontmatter.drive).toBe('C');
    expect(entry.frontmatter.language).toBe('Python');
    expect(entry.frontmatter.stars).toBe(0);
    expect(entry.frontmatter.lastCommit).toBe('2026-03-21');
    expect(entry.frontmatter.commits).toBe(406);
  });

  it('should have GitHub API data merged into frontmatter (stars, lastCommit, commits)', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    // Verify GitHub data overwrites hardcoded values
    const entry = data['icarus-server-manager'];
    expect(entry.frontmatter.stars).toBe(0);
    expect(entry.frontmatter.commits).toBe(406);
    expect(typeof entry.frontmatter.lastCommit).toBe('string');
  });

  it('should have bodyHtml rendered as valid HTML string (non-empty, contains tags)', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    for (const slug of Object.keys(data)) {
      const { bodyHtml } = data[slug];
      expect(typeof bodyHtml).toBe('string');
      expect(bodyHtml.length).toBeGreaterThan(0);
      // Should contain HTML tags
      expect(bodyHtml).toMatch(/<\/?[a-z][\s\S]*>/i);
    }
  });

  it('should include techStack as array in frontmatter', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    const entry = data['icarus-server-manager'];
    expect(Array.isArray(entry.frontmatter.techStack)).toBe(true);
    expect(entry.frontmatter.techStack).toContain('Python');
    expect(entry.frontmatter.techStack).toContain('PySide6');
  });

  it('should have all 4 projects with correct slugs', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    const slugs = Object.keys(data);
    expect(slugs).toHaveLength(4);
    expect(slugs).toContain('icarus-server-manager');
    expect(slugs).toContain('chasing-chapters');
    expect(slugs).toContain('tubular-bexus-osw');
    expect(slugs).toContain('terminal-tactics');
  });

  it('should include repoUrl, status, and icon fields in frontmatter', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    const entry = data['icarus-server-manager'].frontmatter;
    expect(entry).toHaveProperty('repoUrl');
    expect(entry).toHaveProperty('status', 'active');
    expect(entry).toHaveProperty('icon', 'server');
  });
});
