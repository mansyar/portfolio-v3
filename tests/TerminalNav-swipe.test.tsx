import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import TerminalNav from '../src/components/mobile/TerminalNav';
import { setSafeModeView, $safeModeView } from '../src/stores/safe-mode';

/** Create a TouchEvent-like object for fireEvent */
function createTouchEvent(params: { clientX: number; clientY: number }) {
  return {
    touches: [{ clientX: params.clientX, clientY: params.clientY }],
    changedTouches: [{ clientX: params.clientX, clientY: params.clientY }],
    preventDefault: () => {},
  };
}

describe('TerminalNav - Swipe Gesture', () => {
  beforeEach(() => {
    setSafeModeView('projects'); // Start on a "child" view so swipe-back has somewhere to go
  });

  afterEach(() => {
    cleanup();
  });

  it('touch start within 40px of left edge triggers gesture detection', () => {
    render(<TerminalNav />);
    const viewStack = screen.getByTestId('view-stack');

    // Simulate touch start at x=20 (within 40px of left edge)
    fireEvent.touchStart(viewStack, createTouchEvent({ clientX: 20, clientY: 200 }));

    // touch start within 40px should mark the swipe as active
    // The gesture should respond on subsequent touchmove
    fireEvent.touchMove(viewStack, createTouchEvent({ clientX: 60, clientY: 200 }));
    // Opacity should have decreased from 1.0
    expect(parseFloat(viewStack.style.opacity)).toBeLessThan(1);
  });

  it('touch start beyond 40px does NOT trigger gesture', () => {
    render(<TerminalNav />);
    const viewStack = screen.getByTestId('view-stack');

    // Simulate touch start at x=100 (beyond 40px from left edge)
    fireEvent.touchStart(viewStack, createTouchEvent({ clientX: 100, clientY: 200 }));
    fireEvent.touchMove(viewStack, createTouchEvent({ clientX: 140, clientY: 200 }));

    // Opacity should remain at 1.0 (no gesture)
    expect(viewStack.style.opacity).toBe('');
  });

  it('dragging right > 80px commits back navigation instantly', () => {
    render(<TerminalNav />);

    // Start touch at x=10 (near left edge)
    fireEvent.touchStart(
      screen.getByTestId('view-stack'),
      createTouchEvent({ clientX: 10, clientY: 200 }),
    );
    // Drag more than 80px to the right
    fireEvent.touchMove(
      screen.getByTestId('view-stack'),
      createTouchEvent({ clientX: 100, clientY: 200 }),
    );
    // End touch
    fireEvent.touchEnd(
      screen.getByTestId('view-stack'),
      createTouchEvent({ clientX: 100, clientY: 200 }),
    );

    // Should have navigated back to 'main'
    expect($safeModeView.get()).toBe('main');
  });

  it('dragging right <= 80px snaps back with no navigation', () => {
    render(<TerminalNav />);
    const viewStack = screen.getByTestId('view-stack');

    // Start touch at x=10
    fireEvent.touchStart(viewStack, createTouchEvent({ clientX: 10, clientY: 200 }));
    // Drag only 50px (less than 80px threshold)
    fireEvent.touchMove(viewStack, createTouchEvent({ clientX: 60, clientY: 200 }));
    // End touch
    fireEvent.touchEnd(viewStack, createTouchEvent({ clientX: 60, clientY: 200 }));

    // Should NOT have navigated — still on 'projects'
    expect($safeModeView.get()).toBe('projects');
  });

  it('vertical drag (scroll) is ignored — no opacity change, no navigation', () => {
    render(<TerminalNav />);
    const viewStack = screen.getByTestId('view-stack');

    // Start touch near left edge
    fireEvent.touchStart(viewStack, createTouchEvent({ clientX: 10, clientY: 200 }));
    // Drag mostly vertical (small X movement, large Y movement)
    fireEvent.touchMove(viewStack, createTouchEvent({ clientX: 20, clientY: 400 }));
    fireEvent.touchEnd(viewStack, createTouchEvent({ clientX: 20, clientY: 400 }));

    // No navigation — should still be on 'projects'
    expect($safeModeView.get()).toBe('projects');
    // Opacity should remain unchanged
    expect(viewStack.style.opacity).toBe('');
  });

  it('opacity decreases proportionally with drag distance', () => {
    render(<TerminalNav />);
    const viewStack = screen.getByTestId('view-stack');

    // Start touch at x=5
    fireEvent.touchStart(viewStack, createTouchEvent({ clientX: 5, clientY: 200 }));
    // Drag 40px to x=45
    fireEvent.touchMove(viewStack, createTouchEvent({ clientX: 45, clientY: 200 }));

    // Opacity should be less than 1 and greater than 0
    const opacity = parseFloat(viewStack.style.opacity);
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThan(1);
  });

  it('swipe-committed back does NOT fire a cross-fade transition (instant swap)', () => {
    render(<TerminalNav />);
    const viewStack = screen.getByTestId('view-stack');

    // Start touch at x=10
    fireEvent.touchStart(viewStack, createTouchEvent({ clientX: 10, clientY: 200 }));
    // Drag > 80px
    fireEvent.touchMove(viewStack, createTouchEvent({ clientX: 100, clientY: 200 }));
    fireEvent.touchEnd(viewStack, createTouchEvent({ clientX: 100, clientY: 200 }));

    // No crossfade class should be applied (instant navigation, no transition)
    expect(viewStack.className).not.toContain('crossfade');
  });

  it('gestures do NOT fire on non-touch devices (mouse events)', () => {
    render(<TerminalNav />);
    const viewStack = screen.getByTestId('view-stack');

    // Use mouse events instead of touch events
    fireEvent.mouseDown(viewStack, { clientX: 10, clientY: 200 });
    fireEvent.mouseMove(viewStack, { clientX: 100, clientY: 200 });
    fireEvent.mouseUp(viewStack, { clientX: 100, clientY: 200 });

    // No navigation from mouse events — should still be on 'projects'
    expect($safeModeView.get()).toBe('projects');
    // No opacity change
    expect(viewStack.style.opacity).toBe('');
  });
});
