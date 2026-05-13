import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const scriptsDir = resolve(__dirname, '..', 'scripts');
const packageJsonPath = resolve(__dirname, '..', 'package.json');

describe('prebuild.mjs orchestrator', () => {
  it('should have a prebuild.mjs script file', () => {
    expect(existsSync(resolve(scriptsDir, 'prebuild.mjs'))).toBe(true);
  });

  it('should reference all 4 sub-scripts', () => {
    const content = readFileSync(resolve(scriptsDir, 'prebuild.mjs'), 'utf-8');
    expect(content).toContain('fetch-github-stats');
    expect(content).toContain('compile-articles');
    expect(content).toContain('compile-projects');
    expect(content).toContain('generate-filesystem');
  });

  it('should exit with non-zero on critical script failure', () => {
    const content = readFileSync(resolve(scriptsDir, 'prebuild.mjs'), 'utf-8');
    expect(content).toContain('process.exit(1)');
  });
});

describe('package.json build command', () => {
  it('should run prebuild.mjs before astro build', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    expect(pkg.scripts.build).toBe('node scripts/prebuild.mjs && astro build');
  });
});
