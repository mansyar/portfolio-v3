import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const requiredDirectories = [
  // Component directories
  'src/components/desktop',
  'src/components/taskbar',
  'src/components/window',
  'src/components/apps',
  'src/components/mobile',
  // Content directories
  'src/content/projects',
  'src/content/devops-academy',
  // Infrastructure directories
  'src/layouts',
  'src/pages',
  'src/stores',
  'src/lib',
  'src/styles',
  // Public asset directories
  'public/fonts',
  'public/icons',
  'public/wallpapers',
  'public/sounds',
];

describe('Project Directory Structure', () => {
  it.each(requiredDirectories)('directory "%s" should exist', (dir) => {
    const fullPath = resolve(projectRoot, dir);
    expect(existsSync(fullPath)).toBe(true);
  });

  it('should have all required directories', () => {
    const missing = requiredDirectories.filter((dir) => !existsSync(resolve(projectRoot, dir)));
    expect(missing).toEqual([]);
  });
});
