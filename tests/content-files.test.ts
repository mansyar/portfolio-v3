import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const projectsDir = resolve(__dirname, '..', 'src', 'content', 'projects');
const devopsDir = resolve(__dirname, '..', 'src', 'content', 'devops-academy');

const projectFiles = ['icarus-server-manager.mdx', 'chasing-chapters.mdx', 'tubular-bexus-osw.mdx'];

const devopsFiles = ['docker-basics.mdx', 'linux-essentials.mdx', 'ci-cd-pipeline.mdx'];

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

describe('DevOps Academy MDX Files', () => {
  it.each(devopsFiles)('devops file "%s" should exist', (file) => {
    expect(existsSync(resolve(devopsDir, file))).toBe(true);
  });

  it.each(devopsFiles)('devops file "%s" should have valid frontmatter', (file) => {
    const content = readFileSync(resolve(devopsDir, file), 'utf-8');
    const fm = parseFrontmatter(content);
    expect(fm.title).toBeTruthy();
    expect(fm.slug).toBeTruthy();
    expect(fm.category).toBeTruthy();
    expect(['Docker', 'Linux', 'CI/CD']).toContain(fm.category);
    expect(fm.description).toBeTruthy();
    expect(typeof fm.order).toBe('number');
  });
});
