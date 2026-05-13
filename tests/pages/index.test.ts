// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import React from 'react';
import ReactDOM from 'react-dom/server';
import IndexPage from '@/pages/index.astro';

describe('Home Page Integration', () => {
  let html: string;

  beforeAll(async () => {
    const container = await AstroContainer.create();

    // Manually register React renderer since @astrojs/react/server.js
    // depends on virtual modules only available in Astro's full Vite pipeline.
    // This provides a minimal SSR renderer using ReactDOM.
    container.addServerRenderer({
      name: '@astrojs/react',
      renderer: {
        name: '@astrojs/react',
        /* eslint-disable @typescript-eslint/no-explicit-any */
        check: async (Component: unknown) => {
          // Accept React components: functions, forwardRef objects, lazy wrappers
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

  it('should render with correct title', async () => {
    expect(html).toContain('<title>Luna OS Portfolio</title>');
  });

  it('should have XP desktop class on body', async () => {
    expect(html).toContain('class="xp-desktop');
  });

  it('should include all mount point IDs', () => {
    expect(html).toContain('id="wallpaper-area"');
    expect(html).toContain('id="desktop-icons"');
    expect(html).toContain('id="window-layer"');
    expect(html).toContain('id="taskbar"');
  });

  it('should mount WindowLayer with client:only react directive', () => {
    expect(html).toContain('client="only"');
    expect(html).toContain('WindowLayer');
    expect(html).toContain('window-layer');
  });

  it('should include viewport meta tag', () => {
    expect(html).toContain('name="viewport"');
    expect(html).toContain('width=device-width');
  });

  it('should render wallpaper SVG art', () => {
    expect(html).toContain('viewBox="0 0 1440 500"');
    expect(html).toContain('preserveAspectRatio="xMidYMax slice"');
    expect(html).toContain('#6b9e3a');
    expect(html).toContain('linear-gradient');
  });

  it('should render 5 desktop icons with correct labels', () => {
    expect(html).toContain('My Computer');
    expect(html).toContain('My Documents');
    expect(html).toContain('Knowledge Base');
    expect(html).toContain('Command Prompt');
    expect(html).toContain('Recycle Bin');
  });

  it('should render desktop icons with data-window-id', () => {
    expect(html).toContain('data-window-id="explorer"');
    expect(html).toContain('data-window-id="mydocs"');
    expect(html).toContain('data-window-id="help"');
    expect(html).toContain('data-window-id="cmd"');
    expect(html).toContain('data-window-id="recyclebin"');
  });

  it('should mount Taskbar as client:only react island', () => {
    expect(html).toContain('Taskbar');
    expect(html).toContain('client="only"');
  });
});
