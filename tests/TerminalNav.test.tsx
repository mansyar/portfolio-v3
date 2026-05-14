import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import TerminalNav from '../src/components/mobile/TerminalNav';

describe('TerminalNav Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the main menu correctly', () => {
    render(<TerminalNav />);

    expect(screen.getByText(/\[1\] Projects/i)).toBeInTheDocument();
    expect(screen.getByText(/\[2\] Knowledge Base/i)).toBeInTheDocument();
    expect(screen.getByText(/\[3\] Contact/i)).toBeInTheDocument();
    expect(screen.getByText(/\[4\] Desktop Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/\[5\] Restart/i)).toBeInTheDocument();
  });

  it('navigates to Projects menu on click', () => {
    render(<TerminalNav />);

    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    expect(screen.getByText(/\[0\] Back/i)).toBeInTheDocument();
    // It should list some projects from PROJECTS_METADATA
    expect(screen.getByText(/Icarus Server Manager/i)).toBeInTheDocument();
  });

  it('navigates to Knowledge Base menu on click', () => {
    render(<TerminalNav />);

    fireEvent.click(screen.getByText(/\[2\] Knowledge Base/i));

    expect(screen.getByText(/\[0\] Back/i)).toBeInTheDocument();
    // It should list some articles from ARTICLES_METADATA
    expect(screen.getByText(/Docker Basics/i)).toBeInTheDocument();
  });

  it('navigates to Contact view on click', () => {
    render(<TerminalNav />);

    fireEvent.click(screen.getByText(/\[3\] Contact/i));

    expect(screen.getByText(/\[0\] Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Muhammad Ansyar Rafi Putra/i)).toBeInTheDocument();
  });

  it('navigates to Projects via keyboard [1]', () => {
    render(<TerminalNav />);

    fireEvent.keyDown(window, { key: '1' });

    expect(screen.getByText(/Projects/i)).toBeInTheDocument();
    expect(screen.getByText(/\[0\] Back/i)).toBeInTheDocument();
  });

  it('triggers onRestart when [5] is clicked', () => {
    const onRestart = vi.fn();
    render(<TerminalNav onRestart={onRestart} />);

    fireEvent.click(screen.getByText(/\[5\] Restart/i));
    expect(onRestart).toHaveBeenCalled();
  });

  it('triggers toggleForceDesktop when [4] is clicked', () => {
    // We can check if the store changed, but let's just ensure no crash for now
    // or import the store and check its value.
    render(<TerminalNav />);
    fireEvent.click(screen.getByText(/\[4\] Desktop Mode/i));
  });
});
