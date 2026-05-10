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

  it('should include all mount point IDs', () => {
    expect(html).toContain('id="wallpaper-area"');
    expect(html).toContain('id="desktop-icons"');
    expect(html).toContain('id="taskbar"');
  });

  it('should include viewport meta tag', () => {
    expect(html).toContain('name="viewport"');
    expect(html).toContain('width=device-width');
  });

  it('should render wallpaper SVG art', () => {
    // The wallpaper produces SVG content (HTML comments stripped in build)
    expect(html).toContain('viewBox="0 0 1440 500"');
    expect(html).toContain('preserveAspectRatio="xMidYMax slice"');
    expect(html).toContain('#6b9e3a'); // green hill fill
    expect(html).toContain('linear-gradient'); // sky gradient
  });

  it('should render 5 desktop icons with correct labels', () => {
    expect(html).toContain('My Computer');
    expect(html).toContain('My Documents');
    expect(html).toContain('Help &amp; Support');
    expect(html).toContain('Command Prompt');
    expect(html).toContain('Recycle Bin');
  });

  it('should render desktop icons with data-window-id and data-window-label', () => {
    expect(html).toContain('data-window-id="explorer"');
    expect(html).toContain('data-window-id="mydocs"');
    expect(html).toContain('data-window-id="help"');
    expect(html).toContain('data-window-id="cmd"');
    expect(html).toContain('data-window-id="recyclebin"');
  });

  it('should render taskbar with Start button', () => {
    expect(html).toContain('Start');
    expect(html).toContain('xp-taskbar-border');
  });
});
