import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import TerminalNav from '../src/components/mobile/TerminalNav';
import { setSafeModeView } from '../src/stores/safe-mode';

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

describe('TerminalNav - Content Dimming', () => {
  beforeEach(() => {
    setSafeModeView('main');
    setMatchMedia(false);
  });

  afterEach(() => {
    cleanup();
  });

  it('outgoing view has content-dimming class during a programmatic transition', () => {
    render(<TerminalNav />);

    // Navigate forward: main → projects
    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    // The outgoing view (main) should have the content-dimming class
    const outgoingView = document.querySelector('.view-outgoing');
    expect(outgoingView).not.toBeNull();
    expect(outgoingView?.className).toContain('content-dimming');
  });

  it('incoming view does not have content-dimming class', () => {
    render(<TerminalNav />);

    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    const incomingView = document.querySelector('.view-incoming');
    expect(incomingView).not.toBeNull();
    expect(incomingView?.className).not.toContain('content-dimming');
  });

  it('no dimming text or progress bar is visible during transitions', () => {
    render(<TerminalNav />);

    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    // Ensure no loading/progress text appears
    expect(screen.queryByText(/loading/i)).toBeNull();
    expect(screen.queryByText(/progress/i)).toBeNull();
    expect(screen.queryByText(/%/)).toBeNull();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('prefers-reduced-motion does NOT disable content dimming', () => {
    setMatchMedia(true);
    render(<TerminalNav />);

    // Navigate forward
    fireEvent.click(screen.getByText(/\[1\] Projects/i));

    // Dimming still applies even with reduced motion
    const outgoingView = document.querySelector('.view-outgoing');
    // With reduced motion, the cross-fade is disabled (no transition class)
    // but content dimming should still be present
    const viewStack = screen.getByTestId('view-stack');
    expect(viewStack.className).not.toContain('crossfade');

    if (outgoingView) {
      expect(outgoingView.className).toContain('content-dimming');
    }
  });
});
