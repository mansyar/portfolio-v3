import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const iconPath = resolve(__dirname, '..', 'src', 'components', 'desktop', 'DesktopIcon.astro');

describe('DesktopIcon.astro', () => {
  it('should exist at the expected path', () => {
    // This test is expected to fail initially (Red phase)
    expect(existsSync(iconPath)).toBe(true);
  });

  it('should accept icon, label, and windowId props', () => {
    const source = readFileSync(iconPath, 'utf-8');
    expect(source).toContain('icon');
    expect(source).toContain('label');
    expect(source).toContain('windowId');
  });

  it('should render an SVG icon with text label below it', () => {
    const source = readFileSync(iconPath, 'utf-8');
    expect(source).toMatch(/svg|img/);
    expect(source).toContain('label');
  });

  it('should include data-window-id attribute', () => {
    const source = readFileSync(iconPath, 'utf-8');
    expect(source).toContain('data-window-id');
  });

  it('should include data-window-label attribute', () => {
    const source = readFileSync(iconPath, 'utf-8');
    expect(source).toContain('data-window-label');
  });

  it('should reference XP icon styling tokens', () => {
    const source = readFileSync(iconPath, 'utf-8');
    expect(source).toMatch(/xp-icon-text-color|xp-icon-text-shadow|xp-blue-highlight/i);
  });

  it('should use 48px icon size', () => {
    const source = readFileSync(iconPath, 'utf-8');
    expect(source).toMatch(/48|xp-icon-size/);
  });
});
