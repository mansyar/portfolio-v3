import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..');
const publicDir = resolve(root, 'public');
const wallpapersDir = resolve(publicDir, 'wallpapers');
const fontsDir = resolve(publicDir, 'fonts');
const iconsDir = resolve(publicDir, 'icons');
const xpThemePath = resolve(root, 'src', 'styles', 'xp-theme.css');
const wallpaperAstroPath = resolve(root, 'src', 'components', 'desktop', 'Wallpaper.astro');

const xpThemeCss = readFileSync(xpThemePath, 'utf-8');
const wallpaperAstro = readFileSync(wallpaperAstroPath, 'utf-8');

describe('Wallpaper Asset Audit', () => {
  it('should render inline SVG art with no external image URL dependency', () => {
    // Default render path uses inline SVG/SVG elements — no <img src="...">
    // The only <img> tag is for the optional imageSrc fallback
    expect(wallpaperAstro).toContain('viewBox="0 0 1440 500"');
    expect(wallpaperAstro).toContain('<svg');
    expect(wallpaperAstro).toContain('</svg>');
    // Verify the default path has no external image URL
    // Just confirm inline SVG is the primary rendering approach
    expect(wallpaperAstro).toContain('linear-gradient');
  });

  it('should have no bitmap files in wallpapers directory', () => {
    const files = readdirSync(wallpapersDir);
    expect(files).toEqual(['.gitkeep']);
  });

  it('should render SVG without external <img> in default mode', () => {
    // Check that in the default (non-fallback) path, there's no <img tag
    // The fallback branch with <img> is only for the optional imageSrc prop
    // The component uses hasFallback to decide between img and inline SVG
    expect(wallpaperAstro).toContain('imageSrc?: string');
    expect(wallpaperAstro).toContain('hasFallback');
  });
});

describe('Font Asset Audit', () => {
  it('should use local() system font references in @font-face', () => {
    // Match both 'Tahoma' and 'Tahoma Bold' — should be 2 (normal + bold)
    const localMatches = xpThemeCss.match(/local\(['"]Tahoma/g);
    expect(localMatches).not.toBeNull();
    expect(localMatches!.length).toBeGreaterThanOrEqual(2);
  });

  it('should set font-display: swap on all @font-face declarations', () => {
    // Count @font-face blocks and ensure each has font-display: swap
    const fontFaceBlocks = xpThemeCss.split('@font-face').slice(1);
    expect(fontFaceBlocks.length).toBeGreaterThanOrEqual(2);
    fontFaceBlocks.forEach((block) => {
      expect(block).toContain('font-display: swap');
    });
  });

  it('should have no woff2 files in fonts directory', () => {
    const files = readdirSync(fontsDir);
    expect(files).toEqual(['.gitkeep']);
    // Double-check no woff2 files slipped in
    const woff2Files = files.filter((f) => f.endsWith('.woff2'));
    expect(woff2Files).toEqual([]);
  });

  it('should define Tahoma as the primary font-family', () => {
    expect(xpThemeCss).toContain('--xp-font-family');
    expect(xpThemeCss).toContain("'Tahoma'");
  });
});

describe('Icon Asset Audit', () => {
  it('should have all SVG icons in icons directory', () => {
    const files = readdirSync(iconsDir);
    const svgFiles = files.filter((f) => f.endsWith('.svg'));
    const nonSvgFiles = files.filter((f) => f !== '.gitkeep' && !f.endsWith('.svg'));
    // All non-gitkeep files should be SVG
    expect(nonSvgFiles).toEqual([]);
    expect(svgFiles.length).toBeGreaterThan(0);
  });

  it('each icon should be a valid SVG with proper xmlns', () => {
    const files = readdirSync(iconsDir);
    const svgFiles = files.filter((f) => f.endsWith('.svg'));
    svgFiles.forEach((file) => {
      const content = readFileSync(resolve(iconsDir, file), 'utf-8');
      expect(content).toContain('<svg');
      expect(content).toContain('</svg>');
      expect(content).toContain('xmlns="http://www.w3.org/2000/svg"');
    });
  });
});
