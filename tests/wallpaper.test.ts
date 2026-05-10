// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Wallpaper from '@/components/desktop/Wallpaper.astro';

describe('Wallpaper.astro', () => {
  it('should render successfully without props', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Wallpaper);

    expect(result).not.toBeNull();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should render SVG rolling hills art (viewBox present)', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Wallpaper);

    expect(result).toContain('viewBox="0 0 1440 500"');
    expect(result).toContain('preserveAspectRatio="xMidYMax slice"');
  });

  it('should render sky gradient', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Wallpaper);

    expect(result).toContain('linear-gradient');
  });

  it('should use full viewport coverage (w-screen × h-screen)', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Wallpaper);

    expect(result).toContain('w-screen');
    expect(result).toContain('h-screen');
  });

  it('should have z-index: 0 on the wrapping element', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Wallpaper);

    expect(result).toContain('z-index: 0');
  });

  it('should accept and render optional imageSrc prop', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Wallpaper, {
      props: {
        imageSrc: '/custom-wallpaper.jpg',
      },
    });

    expect(result).toContain('src="/custom-wallpaper.jpg"');
    expect(result).toContain('<img');
  });
});
