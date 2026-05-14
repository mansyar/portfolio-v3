import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const themePath = resolve(__dirname, '..', 'src', 'styles', 'xp-safe-mode.css');

describe('Safe Mode Visuals (Track 4A)', () => {
  const css = readFileSync(themePath, 'utf-8');

  it('should define Safe Mode high-contrast tokens', () => {
    expect(css).toContain('--safe-mode-bg: #000000');
    expect(css).toContain('--safe-mode-text: #00ff41');
    expect(css).toContain('--safe-mode-text-dim: #008b1a');
    expect(css).toContain('--safe-mode-text-bright: #00ff41');
  });

  it('should define CRT utility classes', () => {
    expect(css).toContain('.crt-effects');
    expect(css).toContain('.crt-scanlines');
    expect(css).toContain('.crt-curvature');
  });

  it('should define font stack for Safe Mode', () => {
    expect(css).toContain('--safe-mode-font:');
    expect(css).toContain('monospace');
  });
});
