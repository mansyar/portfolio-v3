import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

const scriptPath = join(__dirname, '..', 'scripts', 'check-modularity.js');

describe('check-modularity script', () => {
  it('should pass on the current codebase', () => {
    const result = execSync(`node "${scriptPath}"`, {
      encoding: 'utf-8',
      cwd: join(__dirname, '..'),
    });
    expect(result).toContain('passed');
  });

  it('should fail on a file exceeding 500 lines', () => {
    const testDir = join(__dirname, '..', 'src', '__test_modularity__');
    const testFile = join(testDir, 'too-large.ts');

    try {
      // Create a test directory
      if (!existsSync(testDir)) {
        mkdirSync(testDir, { recursive: true });
      }

      // Create a file with 600 lines
      const lines = Array.from({ length: 600 }, (_, i) => `// line ${i + 1}`);
      writeFileSync(testFile, lines.join('\n'), 'utf-8');

      // Run the script and expect it to fail
      expect(() => {
        execSync(`node "${scriptPath}"`, {
          encoding: 'utf-8',
          cwd: join(__dirname, '..'),
        });
      }).toThrow();
    } finally {
      // Clean up
      if (existsSync(testDir)) {
        rmSync(testDir, { recursive: true, force: true });
      }
    }
  });
});
