import { describe, it, expect } from 'vitest';
import { calculateStats, formatResult } from './benchmark';

describe('benchmark helper', () => {
  describe('calculateStats', () => {
    it('should calculate average of run durations', () => {
      const result = calculateStats([10, 20, 30]);
      expect(result.average).toBe(20);
      expect(result.min).toBe(10);
      expect(result.max).toBe(30);
    });

    it('should handle a single run', () => {
      const result = calculateStats([42.5]);
      expect(result.average).toBe(42.5);
      expect(result.min).toBe(42.5);
      expect(result.max).toBe(42.5);
    });

    it('should return zeros for empty runs array', () => {
      const result = calculateStats([]);
      expect(result.average).toBe(0);
      expect(result.min).toBe(0);
      expect(result.max).toBe(0);
    });

    it('should round average to 2 decimal places', () => {
      const result = calculateStats([1.234, 2.345]);
      expect(result.average).toBe(1.79);
    });
  });

  describe('formatResult', () => {
    it('should format a benchmark result as a readable string', () => {
      const result = formatResult({
        label: 'Cold Run',
        runs: [10.5, 11.2, 10.8],
        average: 10.83,
        min: 10.5,
        max: 11.2,
      });
      expect(result).toContain('## Cold Run');
      expect(result).toContain('Average: 10.83');
    });
  });
});
