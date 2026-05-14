// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import React from 'react';
import ReactDOM from 'react-dom/server';
import IndexPage from '@/pages/index.astro';

describe('Noscript Fallback', () => {
  let html: string;

  beforeAll(async () => {
    const container = await AstroContainer.create();

    container.addServerRenderer({
      name: '@astrojs/react',
      renderer: {
        name: '@astrojs/react',
        /* eslint-disable @typescript-eslint/no-explicit-any */
        check: async (Component: unknown) => {
          if (typeof Component === 'object' && Component !== null) {
            const $$typeof = (Component as Record<string, unknown>).$$typeof;
            if (
              typeof $$typeof === 'symbol' &&
              $$typeof.toString().toLowerCase().includes('react')
            ) {
              return true;
            }
          }
          return typeof Component === 'function';
        },
        renderToStaticMarkup: async (Component: any, props: any, children: any) => {
          const newChildren = children?.default ?? children;
          const vnode = React.createElement(Component, props, newChildren);
          const html = ReactDOM.renderToString(vnode);
          return { html, attrs: {} };
        },
        /* eslint-enable @typescript-eslint/no-explicit-any */
        supportsAstroStaticSlot: true,
      },
    });

    container.addClientRenderer({
      name: '@astrojs/react',
      entrypoint: '@astrojs/react/client.js',
    });

    html = await container.renderToString(IndexPage);
  });

  it('should render a <noscript> block', () => {
    expect(html).toContain('<noscript>');
    expect(html).toContain('</noscript>');
  });

  it('should contain links to all 3 portfolio projects', () => {
    expect(html).toContain('Chasing Chapters');
    expect(html).toContain('Tubular Bexus OSW');
    expect(html).toContain('Icarus Server Manager');
  });

  it('should link to correct GitHub repository URLs', () => {
    expect(html).toContain('https://github.com/mansyar/chasing-chapters-v2');
    expect(html).toContain('https://github.com/mansyar/tubular-bexus-osw');
    expect(html).toContain('https://github.com/mansyar/icarus-server-manager');
  });

  it('should use proper anchor tags for links', () => {
    // Extract noscript content
    const noscriptMatch = html.match(/<noscript>([\s\S]*?)<\/noscript>/);
    expect(noscriptMatch).not.toBeNull();
    if (noscriptMatch) {
      expect(noscriptMatch[1]).toMatch(/<a\s+href=/);
    }
  });
});
