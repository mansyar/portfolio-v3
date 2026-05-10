import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import type { ComponentType } from 'react';

let Taskbar: ComponentType;

beforeEach(async () => {
  cleanup();
  const mod = await import('@/components/taskbar/Taskbar');
  Taskbar = mod.default;
});

describe('Taskbar.tsx', () => {
  it('should render a taskbar element', () => {
    const { container } = render(<Taskbar />);
    expect(container.firstChild).not.toBeNull();
  });

  it('should have role="toolbar" and aria-label="Taskbar"', () => {
    render(<Taskbar />);
    const toolbar = screen.getByRole('toolbar', { name: 'Taskbar' });
    expect(toolbar).toBeInTheDocument();
  });

  it('should render a green Start button with aria-label', () => {
    render(<Taskbar />);
    const startBtn = screen.getByRole('button', { name: 'Start' });
    expect(startBtn).toBeInTheDocument();
    expect(startBtn).toHaveTextContent('Start');
  });

  it('should render a Clock component in the system tray', () => {
    render(<Taskbar />);
    const toolbar = screen.getByRole('toolbar', { name: 'Taskbar' });
    expect(toolbar).toBeInTheDocument();
    expect(toolbar.textContent).toMatch(/\d{2}:\d{2}/);
  });
});
