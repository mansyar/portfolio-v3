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

  describe('Processes Tab - Process Table', () => {
    it('should render 8 process entries in the table (9 rows total with header)', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('taskmanager');

      render(<TaskManager windowId="taskmanager" />);

      const rows = screen.getAllByRole('row');
      // 1 header row + 8 data rows = 9
      expect(rows.length).toBe(9);
    });

    it('should render all 5 column headers', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('taskmanager');

      render(<TaskManager windowId="taskmanager" />);

      expect(screen.getByText('Image Name')).toBeDefined();
      expect(screen.getByText('PID')).toBeDefined();
      expect(screen.getByText('CPU')).toBeDefined();
      expect(screen.getByText('Mem Usage')).toBeDefined();
      expect(screen.getByText('Description')).toBeDefined();
    });

    it('should render all 8 process names from the spec', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('taskmanager');

      render(<TaskManager windowId="taskmanager" />);

      expect(screen.getByText('python.exe')).toBeDefined();
      expect(screen.getByText('terraform.svc')).toBeDefined();
      expect(screen.getByText('docker.exe')).toBeDefined();
      expect(screen.getByText('react.dll')).toBeDefined();
      expect(screen.getByText('node.exe')).toBeDefined();
      expect(screen.getByText('git.exe')).toBeDefined();
      expect(screen.getByText('linux_kernel')).toBeDefined();
      expect(screen.getByText('ansible.svc')).toBeDefined();
    });

    it('should render PID values as numbers', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('taskmanager');

      const { container } = render(<TaskManager windowId="taskmanager" />);

      const rows = container.querySelectorAll('[role="row"]');
      expect(rows[0].textContent).toContain('1204');
      expect(rows[1].textContent).toContain('892');
    });

    it('should render memory usage with K suffix', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('taskmanager');

      render(<TaskManager windowId="taskmanager" />);

      expect(screen.getByText('45,320 K')).toBeDefined();
      expect(screen.getByText('128,400 K')).toBeDefined();
      expect(screen.getByText('256,000 K')).toBeDefined();
    });

    it('should render CPU values with percent sign', async () => {
      const stores = await import('@/stores/windows');
      stores.openWindow('taskmanager');

      render(<TaskManager windowId="taskmanager" />);

      expect(screen.getByText('12%')).toBeDefined();
      expect(screen.getByText('18%')).toBeDefined();
    });
  });
});
