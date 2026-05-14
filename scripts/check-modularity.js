#!/usr/bin/env node
/**
 * File Modularity Checker
 *
 * Fails if any file in `src/` exceeds 500 lines (excluding .gitkeep).
 * Usage: node scripts/check-modularity.js
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, resolve, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const projectRoot = resolve(__dirname, '..');
const srcDir = join(projectRoot, 'src');
const MAX_LINES = 500;

function getAllFiles(dir) {
  const files = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return files;
}

function checkModularity() {
  const files = getAllFiles(srcDir);
  const violations = [];

  for (const file of files) {
    const filename = relative(projectRoot, file);

    // 1. Skip hidden files (starting with .)
    if (file.split(/[\\/]/).pop().startsWith('.')) continue;

    // 2. Skip generated directory
    if (filename.includes('src' + join('/', 'lib', 'generated'))) continue;

    // 3. Only check source code and style files
    const isSourceFile = /\.(ts|tsx|astro|css)$/.test(file);
    if (!isSourceFile) continue;

    const content = readFileSync(file, 'utf-8');
    const lineCount = content.split('\n').length;

    if (lineCount > MAX_LINES) {
      violations.push({
        file: filename,
        lines: lineCount,
      });
    }
  }

  return violations;
}

// --- Main ---
const violations = checkModularity();

if (violations.length > 0) {
  console.error(
    `\n❌ Modularity check FAILED: ${violations.length} file(s) exceed ${MAX_LINES} lines.\n`,
  );
  for (const v of violations) {
    console.error(`   ${v.file} (${v.lines} lines)`);
  }
  console.error('\n');
  process.exit(1);
} else {
  console.log(`✅ Modularity check passed: All files under ${MAX_LINES} lines.`);
  process.exit(0);
}
