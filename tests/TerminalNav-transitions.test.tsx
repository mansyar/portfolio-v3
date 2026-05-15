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

describe('TerminalNav - Cross-Fade Transitions', () => {
  beforeEach(() => {
    setSafeModeView('main');
    setMatchMedia(false);
  });

  afterEach(() => {
    cleanup();
  });

  it('applies crossfade class on forward programmatic navigation', () => {
    render(<TerminalNav />);

    // Navigate forward: main → projects
    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    // The view-stack container should have the crossfade class
    const viewStack = screen.getByTestId('view-stack');
    expect(viewStack.className).toContain('crossfade');
  });

  it('applies crossfade class on back navigation', () => {
    render(<TerminalNav />);

    // Navigate forward first: main → projects
    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    // Navigate back: projects → main
    fireEvent.click(screen.getByText(/\[0\] Back/i));

    const viewStack = screen.getByTestId('view-stack');
    expect(viewStack.className).toContain('crossfade');
  });

  it('prefers-reduced-motion: reduce disables crossfade (instant swap)', () => {
    setMatchMedia(true);
    render(<TerminalNav />);

    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    const viewStack = screen.getByTestId('view-stack');
    // No crossfade class when reduced motion is active
    expect(viewStack.className).not.toContain('crossfade');
  });

  it('both outgoing and incoming views are rendered simultaneously during crossfade', () => {
    render(<TerminalNav />);

    // Navigate forward: main → projects
    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    const viewStack = screen.getByTestId('view-stack');
    expect(viewStack.className).toContain('crossfade');

    // Navigate back: projects → main
    fireEvent.click(screen.getByText(/\[0\] Back/i));

    // During a crossfade transition, both views should be in the DOM
    expect(screen.getByText(/Main Menu/i)).toBeInTheDocument();
    // "Projects" text appears both in outgoing (<h2>Projects</h2>)
    // and incoming ([1] Projects button), so expect multiple matches
    const projectsElements = screen.getAllByText(/Projects/i);
    expect(projectsElements.length).toBeGreaterThanOrEqual(2);
  });
});
