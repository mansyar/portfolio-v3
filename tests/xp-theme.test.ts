import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const themePath = resolve(__dirname, '..', 'src', 'styles', 'xp-theme.css');
const globalPath = resolve(__dirname, '..', 'src', 'styles', 'global.css');

describe('XP Theme CSS', () => {
  const css = readFileSync(themePath, 'utf-8');

  it('should define Luna Blue taskbar color', () => {
    expect(css).toContain('--xp-blue-taskbar');
  });

  it('should define titlebar gradient tokens', () => {
    expect(css).toContain('--xp-blue-titlebar-gradient-top');
    expect(css).toContain('--xp-blue-titlebar-gradient-bottom');
  });

  it('should define 3D border utilities', () => {
    expect(css).toContain('.xp-outset');
    expect(css).toContain('.xp-inset');
    expect(css).toContain('.xp-window-border');
  });

  it('should define font-face declarations for Tahoma', () => {
    expect(css).toContain('--xp-font-family');
    expect(css).toContain('Tahoma');
  });

  it('should define typography scale', () => {
    expect(css).toContain('--xp-font-size-xs');
    expect(css).toContain('--xp-font-size-sm');
    expect(css).toContain('--xp-font-size-base');
  });

  it('should define shadow tokens', () => {
    expect(css).toContain('--xp-shadow-sm');
    expect(css).toContain('--xp-shadow-md');
    expect(css).toContain('--xp-shadow-lg');
  });

  it('should define Safe Mode color tokens', () => {
    expect(css).toContain('--xp-safe-bg');
    expect(css).toContain('--xp-safe-text');
  });

  it('should define button styles', () => {
    expect(css).toContain('.xp-button');
  });

  it('should define desktop class', () => {
    expect(css).toContain('.xp-desktop');
  });
});

describe('Global CSS (Tailwind v4 integration)', () => {
  const css = readFileSync(globalPath, 'utf-8');

  it('should import xp-theme.css', () => {
    expect(css).toContain("@import './xp-theme.css'");
  });

  it('should import Tailwind CSS', () => {
    expect(css).toContain("@import 'tailwindcss'");
  });

  it('should define @theme block with Tailwind tokens', () => {
    expect(css).toContain('@theme');
    expect(css).toContain('--color-xp-taskbar');
    expect(css).toContain('--color-xp-desktop');
  });
});
