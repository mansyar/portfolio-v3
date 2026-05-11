// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import DesktopIcon from '@/components/desktop/DesktopIcon.astro';

describe('DesktopIcon.astro', () => {
  let container: AstroContainer;

  beforeAll(async () => {
    container = await AstroContainer.create();
  });

  it('should render successfully with required props', async () => {
    const result = await container.renderToString(DesktopIcon, {
      props: {
        icon: '/icons/test.svg',
        label: 'Test App',
        windowId: 'test-app',
      },
    });

    expect(result).not.toBeNull();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should include data-window-id attribute', async () => {
    const result = await container.renderToString(DesktopIcon, {
      props: {
        icon: '/icons/test.svg',
        label: 'Test App',
        windowId: 'test-app',
      },
    });

    expect(result).toContain('data-window-id="test-app"');
  });

  it('should include data-window-label attribute', async () => {
    const result = await container.renderToString(DesktopIcon, {
      props: {
        icon: '/icons/test.svg',
        label: 'My App',
        windowId: 'my-app',
      },
    });

    expect(result).toContain('data-window-label="My App"');
  });

  it('should render an img tag with the correct icon src', async () => {
    const result = await container.renderToString(DesktopIcon, {
      props: {
        icon: '/icons/test.svg',
        label: 'Test',
        windowId: 'test',
      },
    });

    expect(result).toContain('<img');
    expect(result).toContain('src="/icons/test.svg"');
  });

  it('should render the label text in a span', async () => {
    const result = await container.renderToString(DesktopIcon, {
      props: {
        icon: '/icons/test.svg',
        label: 'Test App',
        windowId: 'test-app',
      },
    });

    expect(result).toContain('>Test App<');
  });

  it('should reflect icon, label, and windowId props in rendered HTML', async () => {
    const result = await container.renderToString(DesktopIcon, {
      props: {
        icon: '/icons/custom.svg',
        label: 'Custom App',
        windowId: 'custom',
      },
    });

    expect(result).toContain('src="/icons/custom.svg"');
    expect(result).toContain('data-window-id="custom"');
    expect(result).toContain('>Custom App<');
  });

  it('should include onclick handler dispatching luna:open-window event', async () => {
    const result = await container.renderToString(DesktopIcon, {
      props: {
        icon: '/icons/test.svg',
        label: 'Test',
        windowId: 'explorer',
      },
    });

    expect(result).toContain('CustomEvent');
    expect(result).toContain('luna:open-window');
    expect(result).toContain('explorer');
  });

  it('should include double-click visual feedback class', async () => {
    const result = await container.renderToString(DesktopIcon, {
      props: {
        icon: '/icons/test.svg',
        label: 'Test',
        windowId: 'test',
      },
    });

    expect(result).toContain('ondblclick');
  });
});
