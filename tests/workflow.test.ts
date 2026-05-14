import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const WORKFLOW_PATH = resolve(__dirname, '..', '.github', 'workflows', 'deploy.yml');

function getWorkflowContent(): string {
  return readFileSync(WORKFLOW_PATH, 'utf-8');
}

describe('GitHub Actions Workflow — deploy.yml', () => {
  it('should exist at .github/workflows/deploy.yml', () => {
    expect(existsSync(WORKFLOW_PATH)).toBe(true);
  });

  it('should have workflow name "Deploy to Cloudflare Pages"', () => {
    const content = getWorkflowContent();
    expect(content).toContain('name: Deploy to Cloudflare Pages');
  });

  it('should trigger on push to main branch', () => {
    const content = getWorkflowContent();
    expect(content).toContain('push:');
    expect(content).toContain('branches: [main]');
  });

  it('should have a CRON schedule trigger at 00:00 UTC daily', () => {
    const content = getWorkflowContent();
    expect(content).toContain("cron: '0 0 * * *'");
  });

  it('should have a concurrency guard', () => {
    const content = getWorkflowContent();
    expect(content).toContain('concurrency:');
    expect(content).toContain('deploy-${{ github.ref }}');
  });

  it('should reference actions/checkout@v4', () => {
    const content = getWorkflowContent();
    expect(content).toContain('actions/checkout@v4');
  });

  it('should reference actions/setup-node@v4 with Node.js 22', () => {
    const content = getWorkflowContent();
    expect(content).toContain('actions/setup-node@v4');
    expect(content).toContain("node-version: '22'");
  });

  it('should reference pnpm/action-setup@v4', () => {
    const content = getWorkflowContent();
    expect(content).toContain('pnpm/action-setup@v4');
  });

  it('should install dependencies with frozen lockfile', () => {
    const content = getWorkflowContent();
    expect(content).toContain('pnpm install --frozen-lockfile');
  });

  it('should build with pnpm build', () => {
    const content = getWorkflowContent();
    expect(content).toContain('pnpm build');
  });

  it('should reference cloudflare/wrangler-action@v3', () => {
    const content = getWorkflowContent();
    expect(content).toContain('cloudflare/wrangler-action@v3');
  });

  it('should deploy with pages deploy command to luna-os-portfolio', () => {
    const content = getWorkflowContent();
    expect(content).toContain('pages deploy dist --project-name=luna-os-portfolio');
  });

  it('should pass CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID secrets', () => {
    const content = getWorkflowContent();
    expect(content).toContain('secrets.CLOUDFLARE_API_TOKEN');
    expect(content).toContain('secrets.CLOUDFLARE_ACCOUNT_ID');
  });

  it('should pass GITHUB_TOKEN to the build step', () => {
    const content = getWorkflowContent();
    expect(content).toContain('GITHUB_TOKEN');
    expect(content).toContain('secrets.GITHUB_TOKEN');
  });

  it('should have a ubuntu-latest runner', () => {
    const content = getWorkflowContent();
    expect(content).toContain('runs-on: ubuntu-latest');
  });
});
