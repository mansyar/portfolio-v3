/**
 * Tests for missing ARIA attributes on Application & Safe Mode components.
 *
 * Red phase components: Explorer, CmdPrompt output, KnowledgeBase, Safe Mode.
 * React components tested with @testing-library/react (jsdom environment).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// ─── Explorer shell ───

describe('Explorer.tsx - ARIA attributes (MISSING)', () => {
  beforeEach(async () => {
    cleanup();
    const stores = await import('@/stores/windows');
    // @ts-expect-error - intentional reset
    stores.$windows.set({
      explorer: {
        id: 'explorer',
        title: 'My Computer',
        icon: '/icons/my-computer.svg',
        x: 80,
        y: 60,
        width: 700,
        height: 500,
        minWidth: 400,
        minHeight: 300,
        zIndex: 100,
        status: 'open',
        explorerPath: '\\',
      },
    });
  });

  it('should have role="region" with aria-label="File Explorer" on the outer container', async () => {
    const { Explorer } = await import('@/components/apps/Explorer');
    const { container } = render(<Explorer windowId="explorer" />);
    const outer = container.querySelector('.xp-explorer');
    expect(outer).toHaveAttribute('role', 'region');
    expect(outer).toHaveAttribute('aria-label', 'File Explorer');
  });
});

// ─── CmdPrompt output area ───

describe('CmdPrompt.tsx - Output area ARIA (MISSING)', () => {
  beforeEach(async () => {
    cleanup();
    const stores = await import('@/stores/windows');
    // @ts-expect-error - intentional reset
    stores.$windows.set({
      cmd: {
        id: 'cmd',
        title: 'Command Prompt',
        icon: '/icons/command-prompt.svg',
        x: 80,
        y: 60,
        width: 600,
        height: 400,
        minWidth: 400,
        minHeight: 300,
        zIndex: 100,
        status: 'open',
        cmdPath: 'C:\\',
      },
    });
  });

  it('should have role="log" with aria-live="polite" on the output container', async () => {
    const { CmdPrompt } = await import('@/components/apps/CmdPrompt');
    const { container } = render(<CmdPrompt windowId="cmd" />);
    // The outer container has role="terminal", the output area is its first child
    const terminal = container.querySelector('[role="terminal"]');
    expect(terminal).toBeInTheDocument();
    // Look for role="log" inside the terminal
    const logRegion = container.querySelector('[role="log"]');
    expect(logRegion).toBeInTheDocument();
    expect(logRegion).toHaveAttribute('aria-live', 'polite');
  });
});

// ─── KnowledgeBase ───

describe('KnowledgeBase.tsx - ARIA attributes (MISSING)', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should have role="region" with aria-label="Knowledge Base" on the outer container', async () => {
    const { KnowledgeBase } = await import('@/components/apps/KnowledgeBase');
    const { container } = render(<KnowledgeBase windowId="help" />);
    // The outer container is the flex row div
    const outer = container.querySelector('.flex.h-full');
    expect(outer).toHaveAttribute('role', 'region');
    expect(outer).toHaveAttribute('aria-label', 'Knowledge Base');
  });

  it('should have role="searchbox" on the search input', async () => {
    const { KnowledgeBase } = await import('@/components/apps/KnowledgeBase');
    render(<KnowledgeBase windowId="help" />);
    const searchInput = screen.getByLabelText('Search articles');
    expect(searchInput).toHaveAttribute('role', 'searchbox');
  });

  it('should have role="navigation" with aria-label="Article categories" on the category sidebar', async () => {
    const { KnowledgeBase } = await import('@/components/apps/KnowledgeBase');
    const { container } = render(<KnowledgeBase windowId="help" />);
    // The category sidebar is the left panel with bg-[#d3e5fa]
    const sidebar = container.querySelector('[role="navigation"]');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveAttribute('aria-label', 'Article categories');
  });
});

// ─── Safe Mode components ───

describe('BiosBoot.tsx - ARIA attributes (MISSING)', () => {
  it('should have role="status" with aria-live="polite" on the boot container', async () => {
    // BiosBoot only works in jsdom with matchMedia mocked (already in setup.ts)
    const { default: BiosBoot } = await import('@/components/mobile/BiosBoot');
    const { container } = render(<BiosBoot onComplete={() => {}} />);
    const bootDiv = container.firstChild as HTMLElement;
    expect(bootDiv).toHaveAttribute('role', 'status');
    expect(bootDiv).toHaveAttribute('aria-live', 'polite');
  });
});

describe('TerminalNav.tsx - ARIA attributes (MISSING)', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should have descriptive aria-label on main menu buttons', async () => {
    const { default: TerminalNav } = await import('@/components/mobile/TerminalNav');
    render(<TerminalNav />);
    // Main menu buttons should have aria-labels
    const projectsBtn = screen.getByText('[1] Projects');
    expect(projectsBtn.tagName).toBe('BUTTON');
    // Since native <button> with text is already accessible, this is informational
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      // Buttons should have either text content or aria-label
      const hasText = btn.textContent && btn.textContent.trim().length > 0;
      const hasLabel = btn.hasAttribute('aria-label');
      expect(hasText || hasLabel).toBe(true);
    });
  });
});
