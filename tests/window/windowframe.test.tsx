import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

interface LocalWindowState {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  zIndex: number;
  status: string;
}

function makeState(overrides: Partial<LocalWindowState> = {}): LocalWindowState {
  return {
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
    ...overrides,
  };
}

async function renderWF(props: Record<string, unknown>) {
  cleanup();
  const mod = await import('@/components/window/WindowFrame');
  // @ts-expect-error — dynamic props for testing flexibility
  return render(<mod.WindowFrame {...props} />);
}

describe('WindowFrame.tsx', () => {
  it('should render TitleBar with correct title', async () => {
    await renderWF({ state: makeState({ title: 'My Computer' }), isActive: true });
    expect(screen.getByText('My Computer')).toBeInTheDocument();
  });

  it('should render TitleBar with correct icon', async () => {
    await renderWF({ state: makeState({ icon: '/icons/my-computer.svg' }), isActive: true });
    const img = screen.getByAltText('My Computer');
    expect(img).toHaveAttribute('src', '/icons/my-computer.svg');
  });

  it('should render active TitleBar when isActive is true', async () => {
    const { container } = await renderWF({ state: makeState(), isActive: true });
    const titlebar = container.querySelector('[data-testid="window-titlebar"]');
    expect(titlebar).toBeInTheDocument();
  });

  it('should render inactive TitleBar when isActive is false', async () => {
    const { container } = await renderWF({ state: makeState(), isActive: false });
    const titlebar = container.querySelector('[data-testid="window-titlebar"]');
    expect(titlebar).toBeInTheDocument();
  });

  it('should render placeholder content for each window type', async () => {
    const placeholders = [
      { id: 'explorer', text: 'My Computer' },
      { id: 'mydocs', text: 'My Documents' },
      { id: 'help', text: 'Help & Support' },
      { id: 'cmd', text: 'Command Prompt' },
      { id: 'taskmanager', text: 'Task Manager' },
      { id: 'recyclebin', text: 'Recycle Bin' },
    ];
    for (const { id, text } of placeholders) {
      const { unmount } = await renderWF({
        state: makeState({ id, title: text }),
        isActive: false,
      });
      expect(screen.getByText(text)).toBeInTheDocument();
      unmount();
    }
  });

  it('should have position styles matching state', async () => {
    const state = makeState({ x: 100, y: 200, width: 500, height: 400 });
    const { container } = await renderWF({ state, isActive: true });
    const frame = container.firstChild as HTMLElement;
    expect(frame.style.left).toBe('100px');
    expect(frame.style.top).toBe('200px');
    expect(frame.style.width).toBe('500px');
    expect(frame.style.height).toBe('400px');
  });

  it('should apply z-index from state', async () => {
    const state = makeState({ zIndex: 150 });
    const { container } = await renderWF({ state, isActive: true });
    const frame = container.firstChild as HTMLElement;
    expect(frame.style.zIndex).toBe('150');
  });

  describe('Window Transitions', () => {
    it('should apply open animation class for status="open"', async () => {
      const { container } = await renderWF({
        state: makeState({ status: 'open' }),
        isActive: true,
      });
      const frame = container.firstChild as HTMLElement;
      expect(frame.className).toContain('window-open');
    });

    it('should apply closing animation class for status="closing"', async () => {
      const { container } = await renderWF({
        state: makeState({ status: 'closing' }),
        isActive: true,
      });
      const frame = container.firstChild as HTMLElement;
      expect(frame.className).toContain('window-closing');
    });

    it('should apply minimized class for status="minimized"', async () => {
      const { container } = await renderWF({
        state: makeState({ status: 'minimized' }),
        isActive: true,
      });
      const frame = container.firstChild as HTMLElement;
      expect(frame.className).toContain('window-minimized');
    });

    it('should apply maximized class for status="maximized"', async () => {
      const { container } = await renderWF({
        state: makeState({ status: 'maximized' }),
        isActive: true,
      });
      const frame = container.firstChild as HTMLElement;
      expect(frame.className).toContain('window-maximized');
    });
  });

  it('should call onFocusRequest when the frame is clicked', async () => {
    const onFocusRequest = vi.fn();
    const { container } = await renderWF({ state: makeState(), isActive: true, onFocusRequest });
    const frame = container.firstChild as HTMLElement;
    fireEvent.click(frame);
    expect(onFocusRequest).toHaveBeenCalledOnce();
  });

  it('should accept and wire callback props to TitleBar', async () => {
    await renderWF({
      state: makeState(),
      isActive: true,
      onMinimize: vi.fn(),
      onMaximize: vi.fn(),
      onClose: vi.fn(),
    });
    expect(screen.getByLabelText('Minimize')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximize')).toBeInTheDocument();
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  describe('Edge/Corner Resize', () => {
    it('should render 8 resize handle zones', async () => {
      const { container } = await renderWF({ state: makeState(), isActive: true });
      const handles = container.querySelectorAll('[data-resize]');
      expect(handles.length).toBe(8);
    });

    it('should have resize handles with correct direction attributes', async () => {
      const { container } = await renderWF({ state: makeState(), isActive: true });
      const directions = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
      directions.forEach((dir) => {
        const handle = container.querySelector(`[data-resize="${dir}"]`);
        expect(handle).toBeInTheDocument();
      });
    });

    it('should apply correct cursor style for each resize direction', async () => {
      const { container } = await renderWF({ state: makeState(), isActive: true });
      expect(container.querySelector('[data-resize="n"]')).toHaveStyle('cursor: n-resize');
      expect(container.querySelector('[data-resize="s"]')).toHaveStyle('cursor: s-resize');
      expect(container.querySelector('[data-resize="e"]')).toHaveStyle('cursor: e-resize');
      expect(container.querySelector('[data-resize="w"]')).toHaveStyle('cursor: w-resize');
      expect(container.querySelector('[data-resize="ne"]')).toHaveStyle('cursor: ne-resize');
      expect(container.querySelector('[data-resize="nw"]')).toHaveStyle('cursor: nw-resize');
      expect(container.querySelector('[data-resize="se"]')).toHaveStyle('cursor: se-resize');
      expect(container.querySelector('[data-resize="sw"]')).toHaveStyle('cursor: sw-resize');
    });
  });
});
