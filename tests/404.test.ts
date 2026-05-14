// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import NotFoundPage from '@/pages/404.astro';

const pagePath = resolve(__dirname, '..', 'src', 'pages', '404.astro');
const pageContent = readFileSync(pagePath, 'utf-8');

describe('404 BSOD Page — File & CSS', () => {
  it('should exist as a valid file', () => {
    expect(existsSync(pagePath)).toBe(true);
  });

  it('should have BSOD-style blue background (#0000aa) in CSS', () => {
    expect(pageContent).toContain('background: #0000aa');
  });

  it('should have monospace font-family for BSOD authenticity', () => {
    expect(pageContent).toContain('monospace');
    expect(pageContent).toContain('Courier New');
  });

  it('should define STOP: 0x000000FE in the template', () => {
    expect(pageContent).toContain('STOP: 0x000000FE');
    expect(pageContent).toContain('PORTFOLIO_NOT_FOUND');
  });

  it('should have a "Press any key to restart" link', () => {
    expect(pageContent).toContain('Press any key to restart');
    expect(pageContent).toContain('href="/"');
  });

  it('should have keyboard-accessible restart link (anchor tag)', () => {
    expect(pageContent).toMatch(/<a[^>]*href\s*=\s*"\/"[^>]*>/);
  });
});

describe('404 BSOD Page — Rendered Output', () => {
  let container: AstroContainer;

  beforeAll(async () => {
    container = await AstroContainer.create();
  });

  it('should render STOP error code', async () => {
    const result = await container.renderToString(NotFoundPage);

    expect(result).toContain('STOP: 0x000000FE');
    expect(result).toContain('PORTFOLIO_NOT_FOUND');
  });

  it('should have a "Press any key to restart" link pointing to /', async () => {
    const result = await container.renderToString(NotFoundPage);

    expect(result).toContain('Press any key to restart');
    expect(result).toContain('href="/"');
  });

  it('should render restart link as an anchor tag for keyboard accessibility', async () => {
    const result = await container.renderToString(NotFoundPage);

    expect(result).toMatch(/<a[^>]*href="\/"[^>]*>/);
  });
});
