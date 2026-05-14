// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import MetaTags from '@/components/desktop/MetaTags.astro';

describe('MetaTags.astro', () => {
  let container: AstroContainer;

  beforeAll(async () => {
    container = await AstroContainer.create();
  });

  it('should render title tag with correct content', async () => {
    const result = await container.renderToString(MetaTags, {
      props: { title: 'Luna OS Portfolio', description: 'Test description' },
    });

    expect(result).toContain('<title>Luna OS Portfolio</title>');
  });

  it('should render meta description tag with correct content', async () => {
    const result = await container.renderToString(MetaTags, {
      props: { title: 'Test Title', description: 'A test meta description' },
    });

    expect(result).toContain('<meta name="description" content="A test meta description"');
  });

  it('should render Open Graph og:title tag', async () => {
    const result = await container.renderToString(MetaTags, {
      props: { title: 'Luna OS Portfolio', description: 'Test' },
    });

    expect(result).toContain('<meta property="og:title" content="Luna OS Portfolio"');
  });

  it('should render Open Graph og:description tag', async () => {
    const result = await container.renderToString(MetaTags, {
      props: { title: 'Test', description: 'My OG description' },
    });

    expect(result).toContain('<meta property="og:description" content="My OG description"');
  });

  it('should render Open Graph og:image tag with default path', async () => {
    const result = await container.renderToString(MetaTags, {
      props: { title: 'Test', description: 'Test' },
    });

    expect(result).toContain('<meta property="og:image" content="/og-preview.png"');
  });

  it('should render Open Graph og:type tag as website', async () => {
    const result = await container.renderToString(MetaTags, {
      props: { title: 'Test', description: 'Test' },
    });

    expect(result).toContain('<meta property="og:type" content="website"');
  });

  it('should accept custom ogImage prop and override default', async () => {
    const result = await container.renderToString(MetaTags, {
      props: {
        title: 'Test',
        description: 'Test',
        ogImage: '/custom-og.png',
      },
    });

    expect(result).toContain('<meta property="og:image" content="/custom-og.png"');
  });

  it('should render JSON-LD structured data with Person schema', async () => {
    const result = await container.renderToString(MetaTags, {
      props: { title: 'Test', description: 'Test' },
    });

    expect(result).toContain('application/ld+json');
    expect(result).toContain('"@context": "https://schema.org"');
    expect(result).toContain('"@type": "Person"');
    expect(result).toContain('"name": "Muhammad Ansyar Rafi Putra"');
    expect(result).toContain('"jobTitle": "Software Engineer"');
    expect(result).toContain('"url": "https://mansyar.dev"');
  });

  it('should render og:image with default value when no ogImage prop provided', async () => {
    const result = await container.renderToString(MetaTags, {
      props: { title: 'Test', description: 'Test' },
    });

    expect(result).toContain('og:image');
  });
});
