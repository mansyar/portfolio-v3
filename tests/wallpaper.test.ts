import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const wallpaperPath = resolve(__dirname, '..', 'src', 'components', 'desktop', 'Wallpaper.astro');

describe('Wallpaper.astro', () => {
  it('should exist at the expected path', () => {
    // This test is expected to fail initially (Red phase)
    expect(existsSync(wallpaperPath)).toBe(true);
  });

  it('should accept optional imageSrc prop', () => {
    const source = readFileSync(wallpaperPath, 'utf-8');
    expect(source).toContain('imageSrc');
  });

  it('should render SVG/CSS rolling hills art', () => {
    const source = readFileSync(wallpaperPath, 'utf-8');
    // Should contain SVG-like art or CSS gradient art
    expect(source).toMatch(/svg|linear-gradient|radial-gradient/i);
  });

  it('should use full viewport coverage (w-screen × h-screen)', () => {
    const source = readFileSync(wallpaperPath, 'utf-8');
    // Tailwind's w-screen = 100vw, h-screen = 100vh
    expect(source).toMatch(/w-screen/);
    expect(source).toMatch(/h-screen/);
  });

  it('should have z-index of 0', () => {
    const source = readFileSync(wallpaperPath, 'utf-8');
    expect(source).toMatch(/z-0|z-index:\s*0/);
  });
});
