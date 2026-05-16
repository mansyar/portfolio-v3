/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false,
      },
    },
    maxWorkers: 12,
    minWorkers: 4,
    fileParallelism: true,
    cache: {
      dir: './node_modules/.vitest-cache',
    },
    coverage: {
      provider: 'v8',
      exclude: ['src/lib/generated/', 'src/styles/', 'tests/helpers/', 'src/__test_modularity__/'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
