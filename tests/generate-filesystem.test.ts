import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const scriptsDir = resolve(__dirname, '..', 'scripts');
const generatedDir = resolve(__dirname, '..', 'src', 'lib', 'generated');
const outputFile = resolve(generatedDir, 'filesystem.json');

describe('generate-filesystem script', () => {
  beforeAll(() => {
    // Ensure the pre-build scripts have generated their outputs
    if (existsSync(resolve(scriptsDir, 'compile-articles.mjs'))) {
      try {
        execSync('node scripts/compile-articles.mjs', {
          cwd: resolve(__dirname, '..'),
          stdio: 'pipe',
        });
      } catch {
        // May fail if no articles
      }
    }
    if (existsSync(resolve(scriptsDir, 'compile-projects.mjs'))) {
      try {
        execSync('node scripts/compile-projects.mjs', {
          cwd: resolve(__dirname, '..'),
          stdio: 'pipe',
        });
      } catch {
        // May fail if no projects
      }
    }

    // Run the generate-filesystem script
    if (existsSync(resolve(scriptsDir, 'generate-filesystem.mjs'))) {
      try {
        execSync('node scripts/generate-filesystem.mjs', {
          cwd: resolve(__dirname, '..'),
          stdio: 'pipe',
        });
      } catch {
        // Script may fail — tests will indicate
      }
    }
  });

  it('should have a generate-filesystem.mjs script file', () => {
    expect(existsSync(resolve(scriptsDir, 'generate-filesystem.mjs'))).toBe(true);
  });

  it('should generate filesystem.json at the correct path', () => {
    expect(existsSync(outputFile)).toBe(true);
  });

  it('should contain C:, D:, E: drives', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(3);
    const names = data.map((d: { name: string }) => d.name);
    expect(names).toContain('C:');
    expect(names).toContain('D:');
    expect(names).toContain('E:');
  });

  it('should have correct type structure (FSDrive[])', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    for (const drive of data) {
      expect(drive.type).toBe('drive');
      expect(drive.name).toMatch(/^[C-E]:$/);
      expect(Array.isArray(drive.children)).toBe(true);
    }
  });

  it('C: drive should have Software_Engineering folder with project files', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    const cDrive = data.find((d: { name: string }) => d.name === 'C:');
    expect(cDrive).toBeDefined();
    expect(cDrive.children).toHaveLength(1);
    const swEng = cDrive.children[0];
    expect(swEng.type).toBe('folder');
    expect(swEng.name).toBe('Software_Engineering');
    const slugs = swEng.children.map((f: { slug: string }) => f.slug);
    expect(slugs).toContain('icarus-server-manager');
    expect(slugs).toContain('chasing-chapters');
  });

  it('D: drive should have Systems_Data and My_Documents folders with tubular-bexus-osw', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    const dDrive = data.find((d: { name: string }) => d.name === 'D:');
    expect(dDrive).toBeDefined();
    expect(dDrive.children).toHaveLength(2);
    const folderNames = dDrive.children.map((f: { name: string }) => f.name);
    expect(folderNames).toContain('Systems_Data');
    expect(folderNames).toContain('My_Documents');
    const sysData = dDrive.children.find((f: { name: string }) => f.name === 'Systems_Data');
    expect(sysData).toBeDefined();
    expect(sysData.type).toBe('folder');
    const slugs = sysData.children.map((f: { slug: string }) => f.slug);
    expect(slugs).toContain('tubular-bexus-osw');
  });

  it('E: drive should have Knowledge_Base folder with category subfolders', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    const eDrive = data.find((d: { name: string }) => d.name === 'E:');
    expect(eDrive).toBeDefined();
    const kb = eDrive.children[0];
    expect(kb.type).toBe('folder');
    expect(kb.name).toBe('Knowledge_Base');
    const folderNames = kb.children.map((f: { name: string }) => f.name);
    expect(folderNames).toContain('DevOps');
    expect(folderNames).toContain('Software_Engineering');
    expect(folderNames).toContain('AI');
  });

  it('E:\\Knowledge_Base\\DevOps should contain 3 article files', () => {
    const raw = readFileSync(outputFile, 'utf-8');
    const data = JSON.parse(raw);
    const eDrive = data.find((d: { name: string }) => d.name === 'E:');
    const kb = eDrive.children[0];
    const devops = kb.children.find((f: { name: string }) => f.name === 'DevOps');
    expect(devops).toBeDefined();
    const slugs = devops.children.map((f: { slug: string }) => f.slug);
    expect(slugs).toContain('docker-basics');
    expect(slugs).toContain('linux-essentials');
    expect(slugs).toContain('ci-cd-pipeline');
  });
});
