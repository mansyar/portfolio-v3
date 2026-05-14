/**
 * Tests for the ARIA test utility helpers in tests/aria-helpers.ts.
 */
import { describe, it, expect } from 'vitest';
import {
  relativeLuminance,
  contrastRatio,
  expectWcagAa,
  expectReducedMotionOverride,
} from './aria-helpers';

describe('relativeLuminance()', () => {
  it('should return 0 for black (#000000)', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
  });

  it('should return approximately 1 for white (#ffffff)', () => {
    const l = relativeLuminance('#ffffff');
    expect(l).toBeCloseTo(1, 5);
  });

  it('should handle 3-digit hex colors', () => {
    const l = relativeLuminance('#fff');
    expect(l).toBeCloseTo(1, 5);
  });

  it('should throw for hex colors with wrong length', () => {
    expect(() => relativeLuminance('#12345')).toThrow('Invalid hex color');
  });

  it('should compute a reasonable luminance for #00ff41', () => {
    const l = relativeLuminance('#00ff41');
    // Green is bright — luminance should be high
    expect(l).toBeGreaterThan(0.5);
  });
});

describe('contrastRatio()', () => {
  it('should return 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('should return 1 for same color', () => {
    expect(contrastRatio('#ff0000', '#ff0000')).toBeCloseTo(1, 5);
  });

  it('should be commutative (order independent)', () => {
    const a = contrastRatio('#000000', '#ffffff');
    const b = contrastRatio('#ffffff', '#000000');
    expect(a).toBeCloseTo(b, 5);
  });
});

describe('expectWcagAa()', () => {
  it('should pass for black text on white background', () => {
    // This should not throw
    expect(() => expectWcagAa('#000000', '#ffffff')).not.toThrow();
  });

  it('should compute low contrast ratio for similar colors', () => {
    const ratio = contrastRatio('#cccccc', '#ffffff');
    expect(ratio).toBeLessThan(2);
  });
});

describe('expectReducedMotionOverride()', () => {
  it('should verify function signature (structural assertion)', () => {
    // This is a structural assertion helper
    expect(() => expectReducedMotionOverride('.test', 'animation', 'none')).not.toThrow();
  });
});

describe('contrast ratio computations', () => {
  it('should compute correct ratio for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('should compute correct ratio for white on black', () => {
    // Order independence
    const ratio = contrastRatio('#ffffff', '#000000');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('should handle 3-digit hex colors', () => {
    // #fff is white, #000 is black
    expect(contrastRatio('#fff', '#000')).toBeCloseTo(21, 0);
  });
});
