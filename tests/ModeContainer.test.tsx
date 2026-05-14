// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import ModeContainer from '../src/components/desktop/ModeContainer';
import { $forceDesktop } from '../src/stores/desktop';
import React from 'react';

describe('ModeContainer', () => {
  beforeEach(() => {
    $forceDesktop.set(false);
  });

  it('renders children', () => {
    render(
      <ModeContainer>
        <div data-testid="child">Test</div>
      </ModeContainer>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('adds force-desktop class when store is true', async () => {
    const { container, rerender } = render(
      <ModeContainer>
        <div>Test</div>
      </ModeContainer>,
    );

    expect(container.firstChild).not.toHaveClass('force-desktop');

    await act(async () => {
      $forceDesktop.set(true);
    });

    rerender(
      <ModeContainer>
        <div>Test</div>
      </ModeContainer>,
    );

    expect(container.firstChild).toHaveClass('force-desktop');
  });
});
