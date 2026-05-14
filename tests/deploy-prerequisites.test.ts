import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const projectRoot = resolve(__dirname, '..');
const gitignorePath = resolve(projectRoot, '.gitignore');
const packageJsonPath = resolve(projectRoot, 'package.json');

describe('Deploy Prerequisites', () => {
  it('should have dist/ listed in .gitignore', () => {
    const content = readFileSync(gitignorePath, 'utf-8');
    const lines = content.split('\n').map((l) => l.trim());
    expect(lines).toContain('dist/');
  });

  it('should have packageManager field in package.json', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    expect(pkg).toHaveProperty('packageManager');
    expect(pkg.packageManager).toMatch(/^pnpm@/);
  });

  it('should have a build script that runs prebuild.mjs && astro build', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    expect(pkg.scripts.build).toBe('node scripts/prebuild.mjs && astro build');
  });

  it('should have generated JSON files un-excepted in .gitignore', () => {
    const gitignoreContent = readFileSync(gitignorePath, 'utf-8');
    // Only articles-content.json and projects-content.json need un-exceptions
    // (filesystem.json is always tracked as part of normal git operations)
    expect(gitignoreContent).toContain('!src/lib/generated/articles-content.json');
    expect(gitignoreContent).toContain('!src/lib/generated/projects-content.json');
  });

  it('should have fetch-github-stats.mjs consuming GITHUB_TOKEN', () => {
    const scriptPath = resolve(projectRoot, 'scripts', 'fetch-github-stats.mjs');
    const content = readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('GITHUB_TOKEN');
  });

  it('should build successfully with pnpm build', { timeout: 120_000 }, () => {
    const result = execSync('pnpm build', {
      cwd: projectRoot,
      encoding: 'utf-8',
      timeout: 120_000,
    });
    // pnpm build runs prebuild.mjs then astro build
    expect(result).toContain('astro');
    // Verify dist/ was created by the build
    expect(existsSync(resolve(projectRoot, 'dist'))).toBe(true);
  });
});
