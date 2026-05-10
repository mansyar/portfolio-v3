import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..', '..');
const distDir = resolve(projectRoot, 'dist');
const indexHtml = resolve(distDir, 'index.html');

describe('Home Page Integration', () => {
  let html: string;

  beforeAll(() => {
    // Read the built output
    html = readFileSync(indexHtml, 'utf-8');
  });

  it('should render with correct title', () => {
    expect(html).toContain('<title>Luna OS Portfolio</title>');
  });

  it('should have XP theme CSS loaded via stylesheet', () => {
    expect(html).toContain('.css');
    expect(html).toContain('stylesheet');
  });

  it('should have full viewport container', () => {
    expect(html).toContain('class="xp-desktop');
  });

  it('should include placeholder mount points', () => {
    expect(html).toContain('id="wallpaper-area"');
    expect(html).toContain('id="desktop-icons"');
    expect(html).toContain('id="taskbar"');
  });

  it('should include viewport meta tag', () => {
    expect(html).toContain('name="viewport"');
    expect(html).toContain('width=device-width');
  });
});
