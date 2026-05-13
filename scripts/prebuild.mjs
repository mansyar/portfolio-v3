/**
 * prebuild.mjs
 *
 * Orchestrator for all build-time pre-processing scripts.
 * Runs in order:
 *   1. fetch-github-stats.mjs  — fetch live GitHub API data
 *   2. compile-articles.mjs    — compile article MDX → JSON
 *   3. compile-projects.mjs    — compile project MDX → JSON (with GitHub data merge)
 *   4. generate-filesystem.mjs — build dynamic FILE_SYSTEM tree
 *
 * Usage (in package.json): "build": "node scripts/prebuild.mjs && astro build"
 */

import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const SCRIPTS = [
  { name: 'fetch-github-stats', file: 'scripts/fetch-github-stats.mjs', optional: true },
  { name: 'compile-articles', file: 'scripts/compile-articles.mjs', optional: false },
  { name: 'compile-projects', file: 'scripts/compile-projects.mjs', optional: false },
  { name: 'generate-filesystem', file: 'scripts/generate-filesystem.mjs', optional: false },
];

function runScript(script) {
  console.log(`\n━━━ [${script.name}] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  try {
    execSync(`node ${script.file}`, {
      cwd: ROOT,
      stdio: 'inherit',
    });
    console.log(`━━━ ✓ ${script.name} completed ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  } catch (err) {
    if (script.optional) {
      console.warn(`⚠️  ${script.name} failed but is optional. Continuing...\n`);
    } else {
      console.error(`❌ ${script.name} failed. Aborting build.\n`);
      process.exit(1);
    }
  }
}

console.log('\n══════════════════════════════════════════════');
console.log('  Pre-Build Pipeline');
console.log('══════════════════════════════════════════════\n');

for (const script of SCRIPTS) {
  runScript(script);
}

console.log('══════════════════════════════════════════════');
console.log('  All pre-build steps completed successfully.');
console.log('══════════════════════════════════════════════\n');
