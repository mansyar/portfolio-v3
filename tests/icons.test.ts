import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const iconsDir = resolve(__dirname, '..', 'public', 'icons');

const driveIcons = ['drive-c.svg', 'drive-d.svg', 'drive-e.svg'];

const explorerIcons = ['file.svg', 'folder.svg', 'folder-open.svg'];

describe('Drive icon SVGs (32×32, Phase 0)', () => {
  it.each(driveIcons)('drive icon "%s" should exist', (icon) => {
    const iconPath = resolve(iconsDir, icon);
    expect(existsSync(iconPath)).toBe(true);
  });

  it.each(driveIcons)('drive icon "%s" should be a valid SVG', (icon) => {
    const content = readFileSync(resolve(iconsDir, icon), 'utf-8');
    expect(content).toContain('<svg');
    expect(content).toContain('</svg>');
    expect(content).toContain('xmlns="http://www.w3.org/2000/svg"');
  });
});

describe('Explorer list icon SVGs (16×16, Phase 0)', () => {
  it.each(explorerIcons)('explorer icon "%s" should exist', (icon) => {
    const iconPath = resolve(iconsDir, icon);
    expect(existsSync(iconPath)).toBe(true);
  });

  it.each(explorerIcons)('explorer icon "%s" should be a valid SVG', (icon) => {
    const content = readFileSync(resolve(iconsDir, icon), 'utf-8');
    expect(content).toContain('<svg');
    expect(content).toContain('</svg>');
    expect(content).toContain('xmlns="http://www.w3.org/2000/svg"');
  });
});
