import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import TerminalNav from '../src/components/mobile/TerminalNav';
import { setSafeModeView } from '../src/stores/safe-mode';

/**
 * Helper to mock window.matchMedia for prefers-reduced-motion testing.
 * @param reducedMotion - Whether prefers-reduced-motion: reduce matches
 */
function setMatchMedia(reducedMotion: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('TerminalNav - Slide Transitions', () => {
  beforeEach(() => {
    setSafeModeView('main');
    setMatchMedia(false);
  });

  afterEach(() => {
    cleanup();
  });

  it('forward navigation applies slide-in-right class on incoming view (200ms)', () => {
    render(<TerminalNav />);

    // Navigate forward: main → projects
    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    // The view-stack container should have the slide-in-right class
    const viewStack = screen.getByTestId('view-stack');
    expect(viewStack.className).toContain('slide-in-right');
  });

  it('back navigation renders outgoing with slide-out-right and incoming with slide-in-left (150ms)', () => {
    render(<TerminalNav />);

    // Navigate forward first: main → projects
    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    // Navigate back: projects → main
    fireEvent.click(screen.getByText(/\[0\] Back/i));

    const viewStack = screen.getByTestId('view-stack');
    // Outgoing view (projects) slides out to the right
    expect(viewStack.className).toContain('slide-out-right');
    // Incoming view (main) slides in from the left
    expect(viewStack.className).toContain('slide-in-left');
  });

  it('prefers-reduced-motion: reduce disables all transition classes (instant swap)', () => {
    setMatchMedia(true);
    render(<TerminalNav />);

    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    const viewStack = screen.getByTestId('view-stack');
    // No transition-related CSS classes should be present
    expect(viewStack.className).not.toContain('slide-in-right');
    expect(viewStack.className).not.toContain('slide-out-right');
    expect(viewStack.className).not.toContain('slide-in-left');
    expect(viewStack.className).not.toContain('slide-out-left');
  });

  it('navigatingForward state is true for parent-to-child (forward) navigation', () => {
    render(<TerminalNav />);

    // main → projects is forward navigation
    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    const viewStack = screen.getByTestId('view-stack');
    // Forward navigation applies slide-in-right (not slide-in-left)
    expect(viewStack.className).toContain('slide-in-right');
    expect(viewStack.className).not.toContain('slide-in-left');
  });

  it('navigatingForward state is false for child-to-parent (back) navigation', () => {
    render(<TerminalNav />);

    // Navigate forward first
    fireEvent.click(screen.getByText(/\[1\] Projects/i));
    // Navigate back: projects → main
    fireEvent.click(screen.getByText(/\[0\] Back/i));

    const viewStack = screen.getByTestId('view-stack');
    // Back navigation applies slide-out-right + slide-in-left, not slide-in-right
    expect(viewStack.className).toContain('slide-out-right');
    expect(viewStack.className).toContain('slide-in-left');
    expect(viewStack.className).not.toContain('slide-in-right');
  });

  it('both outgoing and incoming views are rendered simultaneously during transition', () => {
    render(<TerminalNav />);

    // Navigate forward: main → projects
    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    const viewStack = screen.getByTestId('view-stack');
    expect(viewStack.className).toContain('slide-in-right');

    // Navigate back: projects → main
    fireEvent.click(screen.getByText(/\[0\] Back/i));

    // During a back transition, both views should be in the DOM
    // The main menu (incoming) should be visible
    expect(screen.getByText(/Main Menu/i)).toBeInTheDocument();
    // The projects view (outgoing) should also still be in the DOM
    // Note: "Projects" text appears both in outgoing (<h2>Projects</h2>)
    // and incoming ([1] Projects button), so we expect multiple matches
    const projectsElements = screen.getAllByText(/Projects/i);
    expect(projectsElements.length).toBeGreaterThanOrEqual(2);
  });
});
