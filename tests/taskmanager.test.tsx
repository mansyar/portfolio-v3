import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import type { FC } from 'react';

let TaskManager: FC<{ windowId: string }>;

beforeEach(async () => {
  cleanup();
  // Reset stores
  const stores = await import('@/stores/windows');
  // @ts-expect-error - intentional reset
  stores.$windows.set({});
  stores.$zCounter.set(100);
  stores.$activeWindow.set(null);
  const mod = await import('@/components/apps/TaskManager');
  TaskManager = mod.TaskManager;
});

afterEach(() => {
  cleanup();
});

describe('TaskManager component', () => {
  it('should render two tabs: Processes and Performance', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('taskmanager');

    render(<TaskManager windowId="taskmanager" />);

    expect(screen.getByText('Processes')).toBeDefined();
    expect(screen.getByText('Performance')).toBeDefined();
  });

  it('should show Processes content by default', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('taskmanager');

    render(<TaskManager windowId="taskmanager" />);

    // Processes tab panel should be visible by default
    const processesPanel = screen.getByRole('tabpanel', { name: 'Processes' });
    expect(processesPanel).toBeDefined();
    expect(processesPanel.getAttribute('aria-hidden')).toBe('false');
  });

  it('should switch to Performance tab when clicked', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('taskmanager');

    render(<TaskManager windowId="taskmanager" />);

    const perfTab = screen.getByRole('tab', { name: 'Performance' });
    fireEvent.click(perfTab);

    // Performance tab should be selected
    expect(perfTab.getAttribute('aria-selected')).toBe('true');

    // Performance panel should now be visible
    const perfPanel = screen.getByRole('tabpanel', { name: 'Performance' });
    expect(perfPanel).toBeDefined();
    expect(perfPanel.getAttribute('aria-hidden')).toBe('false');

    // Processes tab should now be deselected
    const processesTab = screen.getByRole('tab', { name: 'Processes' });
    expect(processesTab.getAttribute('aria-selected')).toBe('false');
  });

  it('should switch back to Processes tab when clicked', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('taskmanager');

    render(<TaskManager windowId="taskmanager" />);

    const perfTab = screen.getByRole('tab', { name: 'Performance' });
    fireEvent.click(perfTab);

    const processesTab = screen.getByRole('tab', { name: 'Processes' });
    fireEvent.click(processesTab);

    // Processes tab should be selected again
    expect(processesTab.getAttribute('aria-selected')).toBe('true');
    // Processes panel should be visible
    const processesPanel = screen.getByRole('tabpanel', { name: 'Processes' });
    expect(processesPanel.getAttribute('aria-hidden')).toBe('false');
  });

  it('should have XP-style raised/pressed tab appearance', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('taskmanager');

    const { container } = render(<TaskManager windowId="taskmanager" />);

    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(2);

    // Active tab should have pressed appearance (inset border style)
    const activeTab = screen.getByRole('tab', { name: 'Processes' });
    expect(activeTab.getAttribute('aria-selected')).toBe('true');

    // Inactive tab should not be selected
    const inactiveTab = screen.getByRole('tab', { name: 'Performance' });
    expect(inactiveTab.getAttribute('aria-selected')).toBe('false');
  });

  it('should navigate tabs with keyboard Left/Right arrow keys', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('taskmanager');

    render(<TaskManager windowId="taskmanager" />);

    const tablist = screen.getByRole('tablist');
    tablist.focus();

    // Press Right arrow to go to Performance tab
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Performance' }).getAttribute('aria-selected')).toBe(
      'true',
    );

    // Press Left arrow to go back to Processes tab
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'Processes' }).getAttribute('aria-selected')).toBe(
      'true',
    );
  });
});
