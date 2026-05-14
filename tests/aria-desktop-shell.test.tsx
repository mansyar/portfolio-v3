/**
 * Tests for missing ARIA attributes on Desktop Shell & Window System components.
 *
 * Red phase: These tests should fail initially because the ARIA attributes
 * haven't been implemented yet. They will pass after Phase 1 implementation.
 *
 * NOTE: This file tests Astro components (DesktopIcon, DesktopLayout) which
 * require the `node` environment. React component tests for Clock, Taskbar,
 * WindowFrame, and ShutdownOverlay live in their respective test files.
 */
// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// ─── DesktopIcon tests (Astro component) ───

describe('DesktopIcon.astro - ARIA attributes (MISSING)', () => {
  let container: AstroContainer;

  beforeAll(async () => {
    container = await AstroContainer.create();
  });

  it('should have role="button" on the desktop icon wrapper', async () => {
    const { default: DesktopIcon } = await import('@/components/desktop/DesktopIcon.astro');
    const result = await container.renderToString(DesktopIcon, {
      props: { icon: '/icons/test.svg', label: 'Test App', windowId: 'test-app' },
    });
    expect(result).toContain('role="button"');
  });

  it('should have aria-label matching the label prop', async () => {
    const { default: DesktopIcon } = await import('@/components/desktop/DesktopIcon.astro');
    const result = await container.renderToString(DesktopIcon, {
      props: { icon: '/icons/test.svg', label: 'My Computer', windowId: 'explorer' },
    });
    expect(result).toContain('aria-label="My Computer"');
  });

  it('should have tabindex="0" for keyboard focusability', async () => {
    const { default: DesktopIcon } = await import('@/components/desktop/DesktopIcon.astro');
    const result = await container.renderToString(DesktopIcon, {
      props: { icon: '/icons/test.svg', label: 'Test', windowId: 'test' },
    });
    expect(result).toContain('tabindex="0"');
  });

  it('should have an onkeydown handler for Enter/Space activation', async () => {
    const { default: DesktopIcon } = await import('@/components/desktop/DesktopIcon.astro');
    const result = await container.renderToString(DesktopIcon, {
      props: { icon: '/icons/test.svg', label: 'Test', windowId: 'explorer' },
    });
    // Should include a keyboard handler, checking for keydown or similar
    expect(result).toContain('onkeydown');
  });
});

// ─── DesktopLayout tests (Astro component) ───

describe('DesktopLayout.astro - ARIA attributes (MISSING)', () => {
  let container: AstroContainer;

  beforeAll(async () => {
    container = await AstroContainer.create();
  });

  it('should have role="group" on the desktop layout wrapper', async () => {
    const { default: DesktopLayout } = await import('@/layouts/DesktopLayout.astro');
    const result = await container.renderToString(DesktopLayout, {
      slots: { default: '<div>Content</div>' },
    });
    expect(result).toContain('role="group"');
  });

  it('should have aria-label="Luna OS Desktop"', async () => {
    const { default: DesktopLayout } = await import('@/layouts/DesktopLayout.astro');
    const result = await container.renderToString(DesktopLayout, {
      slots: { default: '<div>Content</div>' },
    });
    expect(result).toContain('aria-label="Luna OS Desktop"');
  });
});
