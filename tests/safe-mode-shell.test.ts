// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import SafeModeShell from '@/layouts/SafeModeShell.astro';

describe('SafeModeShell Layout', () => {
  it('should render the shell with CRT effects and terminal styling', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SafeModeShell, {
      slots: {
        default: '<span>Test Content</span>',
      },
    });

    expect(html).toContain('crt-effects');
    expect(html).toContain('crt-scanlines');
    expect(html).toContain('crt-curvature');
    expect(html).toContain('bg-black');
    expect(html).toContain('text-[#00ff41]');
    expect(html).toContain('font-mono');
    expect(html).toContain('Test Content');
  });
});
