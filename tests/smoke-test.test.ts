import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const scriptPath = resolve(__dirname, '..', 'scripts', 'smoke-test.mjs');

describe('Smoke Test Script — smoke-test.mjs', () => {
  it('should exist at scripts/smoke-test.mjs', () => {
    expect(existsSync(scriptPath)).toBe(true);
  });

  it('should reference the correct production URL', () => {
    const content = readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('portfolio-os.ansyar-world.top');
  });

  it('should check for HTTP 200 response status', () => {
    const content = readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('response.status === 200');
  });

  it('should check for text/html content-type', () => {
    const content = readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('text/html');
  });

  it('should check for strict-transport-security header', () => {
    const content = readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('strict-transport-security');
  });

  it('should check title tag contains expected keywords', () => {
    const content = readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('Luna');
    expect(content).toContain('Portfolio');
  });

  it('should use native fetch (Node.js 18+)', () => {
    const content = readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('fetch(');
  });

  it('should exit with non-zero code on failure', () => {
    const content = readFileSync(scriptPath, 'utf-8');
    expect(content).toContain('process.exit(exitCode)');
  });
});
