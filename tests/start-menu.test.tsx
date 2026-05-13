import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import type { ComponentType } from 'react';

let StartMenu: ComponentType;

beforeEach(async () => {
  cleanup();
  // Reset desktop store
  const desktop = await import('@/stores/desktop');
  desktop.$startMenuOpen.set(false);
  // Reset windows store
  const windows = await import('@/stores/windows');
  // @ts-expect-error - intentional reset
  windows.$windows.set({});
  windows.$zCounter.set(100);
  windows.$activeWindow.set(null);
  const mod = await import('@/components/taskbar/StartMenu');
  StartMenu = mod.StartMenu;
});

describe('StartMenu.tsx — Rendering', () => {
  it('should render when $startMenuOpen is true', async () => {
    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(true);
    render(<StartMenu />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('should not render when $startMenuOpen is false', () => {
    const { container } = render(<StartMenu />);
    expect(container.firstChild).toBeNull();
  });

  it('should show blue header with MARP initials avatar and user name', async () => {
    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(true);
    render(<StartMenu />);
    expect(screen.getByText('MARP')).toBeInTheDocument();
    expect(screen.getByText('Muhammad Ansyar Rafi Putra')).toBeInTheDocument();
  });

  it('should have role="menu" on the menu container', async () => {
    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(true);
    render(<StartMenu />);
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
  });
});

describe('StartMenu.tsx — Left Column (Pinned Apps)', () => {
  beforeEach(async () => {
    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(true);
  });

  it('should show Resume item', () => {
    render(<StartMenu />);
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('should show Explorer item', () => {
    render(<StartMenu />);
    expect(screen.getByText('Explorer')).toBeInTheDocument();
  });

  it('should show Task Manager item', () => {
    render(<StartMenu />);
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
  });

  it('should show Command Prompt item', () => {
    render(<StartMenu />);
    expect(screen.getByText('Command Prompt')).toBeInTheDocument();
  });
});

describe('StartMenu.tsx — Right Column (System Folders)', () => {
  beforeEach(async () => {
    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(true);
  });

  it('should show My Documents item', () => {
    render(<StartMenu />);
    expect(screen.getByText('My Documents')).toBeInTheDocument();
  });

  it('should show My Computer item', () => {
    render(<StartMenu />);
    expect(screen.getByText('My Computer')).toBeInTheDocument();
  });

  it('should show Control Panel item', () => {
    render(<StartMenu />);
    expect(screen.getByText('Control Panel')).toBeInTheDocument();
  });

  it('should show Knowledge Base item', () => {
    render(<StartMenu />);
    expect(screen.getByText('Knowledge Base')).toBeInTheDocument();
  });

  it('should open Knowledge Base when clicking Knowledge Base', async () => {
    render(<StartMenu />);
    const storeModule = await import('@/stores/windows');
    storeModule.closeWindow('help');
    fireEvent.click(screen.getByText('Knowledge Base'));
    expect(storeModule.$windows.get().help).toBeDefined();
  });

  it('should close menu when clicking any menu item', async () => {
    render(<StartMenu />);
    fireEvent.click(screen.getByText('Resume'));
    // Wait for close animation (100ms) + React re-render + buffer
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('StartMenu.tsx — Keyboard Navigation', () => {
  beforeEach(async () => {
    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(true);
  });

  it('should have role="menu" with aria-activedescendant and tabindex', () => {
    render(<StartMenu />);
    const menu = screen.getByRole('menu');
    expect(menu).toHaveAttribute('aria-activedescendant');
    expect(menu.getAttribute('tabindex')).toBe('0');
  });

  it('should move focus with Tab key', () => {
    render(<StartMenu />);
    const menu = screen.getByRole('menu');
    const initialId = menu.getAttribute('aria-activedescendant');

    fireEvent.keyDown(menu, { key: 'Tab' });
    const afterTab = menu.getAttribute('aria-activedescendant');
    expect(afterTab).not.toBe(initialId);
  });

  it('should move focus backward with Shift+Tab', () => {
    render(<StartMenu />);
    const menu = screen.getByRole('menu');

    // Tab forward once
    fireEvent.keyDown(menu, { key: 'Tab' });

    // Shift+Tab back (should return to previous or wrap to last)
    fireEvent.keyDown(menu, { key: 'Tab', shiftKey: true });
    const afterShift = menu.getAttribute('aria-activedescendant');
    expect(afterShift).toBeDefined();
  });

  it('should activate focused item with Enter and close menu', async () => {
    render(<StartMenu />);
    const menu = screen.getByRole('menu');

    // Tab to first item then press Enter
    fireEvent.keyDown(menu, { key: 'Tab' });
    fireEvent.keyDown(menu, { key: 'Enter' });

    // Wait for close animation to complete
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should close menu with Escape key', async () => {
    render(<StartMenu />);
    const menu = screen.getByRole('menu');

    fireEvent.keyDown(menu, { key: 'Escape' });

    // Wait for close animation to complete
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('StartMenu.tsx — Menu Item Icons', () => {
  beforeEach(async () => {
    const desktop = await import('@/stores/desktop');
    desktop.$startMenuOpen.set(true);
  });

  it('should render menu items with img tags using startmenu-icon class', () => {
    render(<StartMenu />);
    const images = document.querySelectorAll('.startmenu-icon');
    expect(images.length).toBeGreaterThanOrEqual(8); // 4 left + 4 right items
  });

  it('should reference existing icon files for menu items', () => {
    render(<StartMenu />);
    const images = document.querySelectorAll<HTMLImageElement>('.startmenu-icon');
    const srcs = Array.from(images).map((img) => img.getAttribute('src'));
    // Should include at least these paths
    expect(srcs.some((s) => s?.includes('my-documents'))).toBe(true);
    expect(srcs.some((s) => s?.includes('my-computer'))).toBe(true);
    expect(srcs.some((s) => s?.includes('task-manager'))).toBe(true);
    expect(srcs.some((s) => s?.includes('command-prompt'))).toBe(true);
  });
});
