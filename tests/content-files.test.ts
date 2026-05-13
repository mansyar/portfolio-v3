import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

const projectsDir = resolve(__dirname, '..', 'src', 'content', 'projects');
const articlesDir = resolve(__dirname, '..', 'src', 'content', 'articles');

const projectFiles = ['icarus-server-manager.mdx', 'chasing-chapters.mdx', 'tubular-bexus-osw.mdx'];

const articleFiles = [
  'docker-basics.mdx',
  'linux-essentials.mdx',
  'ci-cd-pipeline.mdx',
  'microservices-patterns.mdx',
  'llm-fine-tuning.mdx',
];

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) throw new Error('No frontmatter found');
  const yaml = match[1];
  const result: Record<string, unknown> = {};
  let currentKey = '';
  let currentValue = '';
  const lines = yaml.split('\n');
  for (const line of lines) {
    const keyMatch = line.match(/^(\w+):\s*(.*)/);
    if (keyMatch) {
      if (currentKey) {
        result[currentKey] = parseValue(currentValue.trim());
      }
      currentKey = keyMatch[1];
      currentValue = keyMatch[2];
    } else if (line.startsWith('  ')) {
      currentValue += '\n' + line.trim();
    } else if (line.startsWith('- ')) {
      if (!result[currentKey]) {
        result[currentKey] = [];
      }
      (result[currentKey] as string[]).push(line.replace('- ', '').trim());
    }
  }
  if (currentKey) {
    result[currentKey] = parseValue(currentValue.trim());
  }
  return result;
}

function parseValue(value: string): unknown {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  return value;
}

describe('Project MDX Files', () => {
  it.each(projectFiles)('project file "%s" should exist', (file) => {
    expect(existsSync(resolve(projectsDir, file))).toBe(true);
  });

  it.each(projectFiles)('project file "%s" should have valid frontmatter', (file) => {
    const content = readFileSync(resolve(projectsDir, file), 'utf-8');
    const fm = parseFrontmatter(content);
    expect(fm.title).toBeTruthy();
    expect(fm.slug).toBeTruthy();
    expect(fm.drive).toBeTruthy();
    expect(['C', 'D']).toContain(fm.drive);
    expect(fm.description).toBeTruthy();
    expect(fm.repoUrl).toMatch(/^https?:\/\//);
    expect(fm.language).toBeTruthy();
    expect(fm.status).toBeTruthy();
  });

  it('icarus-server-manager should be on C: drive', () => {
    const content = readFileSync(resolve(projectsDir, 'icarus-server-manager.mdx'), 'utf-8');
    const fm = parseFrontmatter(content);
    expect(fm.drive).toBe('C');
    expect(typeof fm.stars).toBe('number');
    expect(typeof fm.commits).toBe('number');
  });

  it('chasing-chapters should be on C: drive', () => {
    const content = readFileSync(resolve(projectsDir, 'chasing-chapters.mdx'), 'utf-8');
    const fm = parseFrontmatter(content);
    expect(fm.drive).toBe('C');
  });

  it('tubular-bexus-osw should be on D: drive', () => {
    const content = readFileSync(resolve(projectsDir, 'tubular-bexus-osw.mdx'), 'utf-8');
    const fm = parseFrontmatter(content);
    expect(fm.drive).toBe('D');
  });
});

describe('Article MDX Files (migrated from devops-academy)', () => {
  it.each(articleFiles)('article file "%s" should exist in src/content/articles/', (file) => {
    expect(existsSync(resolve(articlesDir, file))).toBe(true);
  });

  it.each(articleFiles)(
    'article file "%s" should have valid frontmatter matching articleSchema',
    (file) => {
      const content = readFileSync(resolve(articlesDir, file), 'utf-8');
      const fm = parseFrontmatter(content);
      expect(fm.title).toBeTruthy();
      expect(fm.slug).toBeTruthy();
      expect(fm.category).toBeTruthy();
      expect(typeof fm.category).toBe('string');
      expect(fm.description).toBeTruthy();
      expect(typeof fm.order).toBe('number');
      expect(fm.lastUpdated).toBeTruthy();
    },
  );

  it('should have exactly 5 article files', () => {
    const files = readdirSync(articlesDir).filter((f: string) => f.endsWith('.mdx'));
    expect(files).toHaveLength(5);
  });

  it('docker-basics should have category DevOps', () => {
    const content = readFileSync(resolve(articlesDir, 'docker-basics.mdx'), 'utf-8');
    const fm = parseFrontmatter(content);
    expect(fm.category).toBe('DevOps');
  });

  it('linux-essentials should have category DevOps', () => {
    const content = readFileSync(resolve(articlesDir, 'linux-essentials.mdx'), 'utf-8');
    const fm = parseFrontmatter(content);
    expect(fm.category).toBe('DevOps');
  });

  it('ci-cd-pipeline should have category DevOps', () => {
    const content = readFileSync(resolve(articlesDir, 'ci-cd-pipeline.mdx'), 'utf-8');
    const fm = parseFrontmatter(content);
    expect(fm.category).toBe('DevOps');
  });

  it('microservices-patterns should have category Software Engineering', () => {
    const content = readFileSync(resolve(articlesDir, 'microservices-patterns.mdx'), 'utf-8');
    const fm = parseFrontmatter(content);
    expect(fm.category).toBe('Software Engineering');
  });

  it('llm-fine-tuning should have category AI', () => {
    const content = readFileSync(resolve(articlesDir, 'llm-fine-tuning.mdx'), 'utf-8');
    const fm = parseFrontmatter(content);
    expect(fm.category).toBe('AI');
  });
});
