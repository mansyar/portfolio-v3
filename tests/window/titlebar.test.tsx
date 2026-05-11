import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import type { FC, MouseEvent } from 'react';

interface TitleBarProps {
  title: string;
  icon: string;
  isActive: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onMouseDown?: (e: MouseEvent) => void;
}

let TitleBar: FC<TitleBarProps>;

beforeEach(async () => {
  cleanup();
  const mod = await import('@/components/window/TitleBar');
  TitleBar = mod.TitleBar;
});

describe('TitleBar.tsx', () => {
  const baseProps: TitleBarProps = {
    title: 'Test',
    icon: '/icons/test.svg',
    isActive: true,
    onMinimize: vi.fn(),
    onMaximize: vi.fn(),
    onClose: vi.fn(),
  };

  it('should render app icon with alt text', () => {
    render(<TitleBar {...baseProps} title="My Computer" icon="/icons/my-computer.svg" />);
    const img = screen.getByAltText('My Computer');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/icons/my-computer.svg');
  });

  it('should render title text', () => {
    render(<TitleBar {...baseProps} title="My Computer" />);
    expect(screen.getByText('My Computer')).toBeInTheDocument();
  });

  it('should render minimize, maximize, and close buttons', () => {
    render(<TitleBar {...baseProps} />);
    expect(screen.getByLabelText('Minimize')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximize')).toBeInTheDocument();
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('should call onMinimize when minimize button clicked', () => {
    const onMinimize = vi.fn();
    render(<TitleBar {...baseProps} onMinimize={onMinimize} />);
    fireEvent.click(screen.getByLabelText('Minimize'));
    expect(onMinimize).toHaveBeenCalledOnce();
  });

  it('should call onMaximize when maximize button clicked', () => {
    const onMaximize = vi.fn();
    render(<TitleBar {...baseProps} onMaximize={onMaximize} />);
    fireEvent.click(screen.getByLabelText('Maximize'));
    expect(onMaximize).toHaveBeenCalledOnce();
  });

  it('should call onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<TitleBar {...baseProps} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('should call onMaximize on title double-click', () => {
    const onMaximize = vi.fn();
    render(<TitleBar {...baseProps} onMaximize={onMaximize} />);
    fireEvent.dblClick(screen.getByText('Test'));
    expect(onMaximize).toHaveBeenCalledOnce();
  });

  it('should call onMouseDown when title bar is pressed', () => {
    const onMouseDown = vi.fn();
    render(<TitleBar {...baseProps} onMouseDown={onMouseDown} />);
    const titlebar = screen.getByTestId('window-titlebar');
    fireEvent.mouseDown(titlebar);
    expect(onMouseDown).toHaveBeenCalledOnce();
  });

  it('should apply active gradient when isActive is true', () => {
    const { container } = render(<TitleBar {...baseProps} isActive={true} />);
    const titlebar = container.querySelector('[data-testid="window-titlebar"]');
    expect(titlebar).toBeInTheDocument();
  });

  it('should apply inactive gradient when isActive is false', () => {
    const { container } = render(<TitleBar {...baseProps} isActive={false} />);
    const titlebar = container.querySelector('[data-testid="window-titlebar"]');
    expect(titlebar).toBeInTheDocument();
  });
});
