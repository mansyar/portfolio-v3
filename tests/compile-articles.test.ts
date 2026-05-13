import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const scriptsDir = resolve(__dirname, '..', 'scripts');
const generatedDir = resolve(__dirname, '..', 'src', 'lib', 'generated');
const outputFile = resolve(generatedDir, 'articles-content.json');

describe('compile-articles script', () => {
  beforeAll(() => {
    // Run the compile script to generate output
    if (existsSync(resolve(scriptsDir, 'compile-articles.mjs'))) {
      try {
        execSync('node scripts/compile-articles.mjs', {
          cwd: resolve(__dirname, '..'),
          stdio: 'pipe',
        });
      } catch {
        // Script may not exist yet — that's fine, tests will fail
      }
    }
  });

  it('should have a compile-articles.mjs script file', () => {
    expect(existsSync(resolve(scriptsDir, 'compile-articles.mjs'))).toBe(true);
  });

  it('should generate articles-content.json at the correct path', () => {
    expect(existsSync(outputFile)).toBe(true);
  });

  it('should generate valid JSON with metadata and content keys', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    expect(data).toHaveProperty('metadata');
    expect(data).toHaveProperty('content');
  });

  it('should have metadata entries for all 5 articles', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    const slugs = Object.keys(data.metadata);
    expect(slugs).toHaveLength(5);
    expect(slugs).toContain('docker-basics');
    expect(slugs).toContain('linux-essentials');
    expect(slugs).toContain('ci-cd-pipeline');
    expect(slugs).toContain('microservices-patterns');
    expect(slugs).toContain('llm-fine-tuning');
  });

  it('should have correct metadata structure for each article', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    const entry = data.metadata['docker-basics'];
    expect(entry).toHaveProperty('title', 'Docker Basics');
    expect(entry).toHaveProperty('category', 'DevOps');
    expect(entry).toHaveProperty('order');
    expect(entry).toHaveProperty('description');
    expect(entry).toHaveProperty('lastUpdated');
  });

  it('should have HTML content for each article (non-empty string)', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    for (const slug of Object.keys(data.content)) {
      expect(typeof data.content[slug]).toBe('string');
      expect(data.content[slug].length).toBeGreaterThan(0);
    }
  });

  it('microservices-patterns should have Software Engineering category', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    expect(data.metadata['microservices-patterns'].category).toBe('Software Engineering');
  });

  it('llm-fine-tuning should have AI category', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    expect(data.metadata['llm-fine-tuning'].category).toBe('AI');
  });
});
