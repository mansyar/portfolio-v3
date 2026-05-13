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
            'ansyarr/icarus-server-manager': {
              name: 'icarus-server-manager',
              stargazers_count: 142,
              pushed_at: '2026-04-15T10:00:00Z',
              default_branch: 'main',
              language: 'TypeScript',
              commits: 384,
            },
            'ansyarr/chasing-chapters': {
              name: 'chasing-chapters',
              stargazers_count: 89,
              pushed_at: '2026-03-28T10:00:00Z',
              default_branch: 'main',
              language: 'Python',
              commits: 256,
            },
            'ansyarr/tubular-bexus-osw': {
              name: 'tubular-bexus-osw',
              stargazers_count: 67,
              pushed_at: '2026-04-10T10:00:00Z',
              default_branch: 'main',
              language: 'Rust',
              commits: 192,
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
    expect(entry.frontmatter.language).toBe('TypeScript');
    expect(entry.frontmatter.stars).toBe(142);
    expect(entry.frontmatter.lastCommit).toBe('2026-04-15');
    expect(entry.frontmatter.commits).toBe(384);
  });

  it('should have GitHub API data merged into frontmatter (stars, lastCommit, commits)', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    // Verify GitHub data overwrites hardcoded values
    const entry = data['icarus-server-manager'];
    expect(entry.frontmatter.stars).toBe(142);
    expect(entry.frontmatter.commits).toBe(384);
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
    expect(entry.frontmatter.techStack).toContain('Node.js');
    expect(entry.frontmatter.techStack).toContain('Docker');
  });

  it('should have all 3 projects with correct slugs', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    const slugs = Object.keys(data);
    expect(slugs).toHaveLength(3);
    expect(slugs).toContain('icarus-server-manager');
    expect(slugs).toContain('chasing-chapters');
    expect(slugs).toContain('tubular-bexus-osw');
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
