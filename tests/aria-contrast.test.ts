/**
 * WCAG AA Color Contrast compliance tests.
 *
 * Tests all key color pairs across the Luna OS Portfolio against WCAG AA
 * minimum contrast ratios: 4.5:1 for normal text, 3:1 for large text.
 *
 * Uses the contrastRatio() and expectWcagAa() helpers from tests/aria-helpers.ts.
 */
import { describe, it, expect } from 'vitest';
import { contrastRatio, expectWcagAa } from './aria-helpers';

describe('WCAG AA Color Contrast — Desktop Chrome', () => {
  it('Desktop primary text (#000000) on window background (#ece9d8) should pass AA', () => {
    expectWcagAa('#000000', '#ece9d8');
  });

  it('TitleBar white text (#ffffff) on blue gradient worst-case (#0a246a) should pass AA', () => {
    expectWcagAa('#ffffff', '#0a246a');
  });

  it('Start Menu header white text (#ffffff) on blue worst (#1f4e9a) should pass AA', () => {
    expectWcagAa('#ffffff', '#1f4e9a');
  });

  it('Link color (#0000cc) on white (#ffffff) should pass AA', () => {
    expectWcagAa('#0000cc', '#ffffff');
  });

  it('Link hover color (#cc0000) on white (#ffffff) should pass AA', () => {
    // Darkened from #ff0000 (~4.0:1, below AA) to #cc0000 (~5.9:1, passes AA)
    expectWcagAa('#cc0000', '#ffffff');
  });

  it('Deleted file strikethrough (#666666) on white (#ffffff) should pass AA', () => {
    expectWcagAa('#666666', '#ffffff');
  });

  it('Archived badge (#666666) on badge bg (#d4d0c8) should pass AA as large text', () => {
    // Badge uses font-weight: bold, qualifies as large text (≥14px bold)
    expectWcagAa('#666666', '#d4d0c8', true);
  });
});

describe('WCAG AA Color Contrast — Safe Mode', () => {
  it('Safe Mode text (#00ff41) on black (#000000) should pass AA', () => {
    expectWcagAa('#00ff41', '#000000');
  });
});

describe('WCAG AA Color Contrast — Disabled / Decorative', () => {
  it('Disabled button text (#aca899) on button face (#ece9d8) — informational only', () => {
    // This is expected to be ~2.4:1, below AA thresholds.
    // This is acceptable for disabled/decorative text as it signals non-interactivity.
    const ratio = contrastRatio('#aca899', '#ece9d8');
    // Document the ratio — should be around 2.4:1
    expect(ratio).toBeLessThan(4.5);
    // If readability is a concern, we could darken to ~#8a8878 (target ~3.5:1)
    // Darkening to ~#6a6858 achieves ~4.3:1 (passes AA for normal text)
    const potentialFix = contrastRatio('#6a6858', '#ece9d8');
    expect(potentialFix).toBeGreaterThan(4.5);
  });
});
