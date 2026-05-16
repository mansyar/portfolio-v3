/**
 * Benchmark utility types and helpers for recording test suite execution times.
 *
 * Usage: Run `pnpm test` manually with a stopwatch (or shell `time` command),
 * then record results using these helpers for comparison.
 */

export interface BenchmarkResult {
  label: string;
  runs: number[];
  average: number;
  min: number;
  max: number;
}

/**
 * Calculates summary statistics from an array of duration values (in seconds or ms).
 */
export function calculateStats(runs: number[]): Omit<BenchmarkResult, 'label'> {
  if (runs.length === 0) {
    return { runs: [], average: 0, min: 0, max: 0 };
  }
  const average = runs.reduce((a, b) => a + b, 0) / runs.length;
  return {
    runs,
    average: Math.round(average * 100) / 100,
    min: Math.min(...runs),
    max: Math.max(...runs),
  };
}

/**
 * Formats a benchmark result as a human-readable string.
 */
export function formatResult(result: BenchmarkResult): string {
  return [
    `## ${result.label}`,
    `Runs: ${result.runs.join(', ')}`,
    `Average: ${result.average}`,
    `Min: ${result.min}`,
    `Max: ${result.max}`,
  ].join('\n');
}
