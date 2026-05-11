import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import type { FC } from 'react';

interface WindowState {
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

let WindowFrame: FC<{ state: WindowState; isActive: boolean }>;

beforeEach(async () => {
  cleanup();
  const mod = await import('@/components/window/WindowFrame');
  WindowFrame = mod.WindowFrame;
});

function makeState(overrides: Partial<WindowState> = {}): WindowState {
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

describe('WindowFrame.tsx', () => {
  it('should render TitleBar with correct title', () => {
    render(<WindowFrame state={makeState({ title: 'My Computer' })} isActive={true} />);
    expect(screen.getByText('My Computer')).toBeInTheDocument();
  });

  it('should render TitleBar with correct icon', () => {
    render(<WindowFrame state={makeState({ icon: '/icons/my-computer.svg' })} isActive={true} />);
    const img = screen.getByAltText('My Computer');
    expect(img).toHaveAttribute('src', '/icons/my-computer.svg');
  });

  it('should render active TitleBar when isActive is true', () => {
    const { container } = render(<WindowFrame state={makeState()} isActive={true} />);
    const titlebar = container.querySelector('[data-testid="window-titlebar"]');
    expect(titlebar).toBeInTheDocument();
  });

  it('should render inactive TitleBar when isActive is false', () => {
    const { container } = render(<WindowFrame state={makeState()} isActive={false} />);
    const titlebar = container.querySelector('[data-testid="window-titlebar"]');
    expect(titlebar).toBeInTheDocument();
  });

  it('should render placeholder content for each window type', () => {
    const placeholders = [
      { id: 'explorer', text: 'My Computer' },
      { id: 'mydocs', text: 'My Documents' },
      { id: 'help', text: 'Help & Support' },
      { id: 'cmd', text: 'Command Prompt' },
      { id: 'taskmanager', text: 'Task Manager' },
      { id: 'recyclebin', text: 'Recycle Bin' },
    ];
    placeholders.forEach(({ id, text }) => {
      cleanup();
      render(<WindowFrame state={makeState({ id, title: text })} isActive={false} />);
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('should have position styles matching state', () => {
    const state = makeState({ x: 100, y: 200, width: 500, height: 400 });
    const { container } = render(<WindowFrame state={state} isActive={true} />);
    const frame = container.firstChild as HTMLElement;
    expect(frame.style.left).toBe('100px');
    expect(frame.style.top).toBe('200px');
    expect(frame.style.width).toBe('500px');
    expect(frame.style.height).toBe('400px');
  });

  it('should apply max z-index when isActive is true', () => {
    const state = makeState({ zIndex: 150 });
    const { container } = render(<WindowFrame state={state} isActive={true} />);
    const frame = container.firstChild as HTMLElement;
    expect(frame.style.zIndex).toBe('150');
  });
});
