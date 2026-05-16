import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/useStore';
import {
  $windows,
  $activeWindow,
  openWindow,
  closeWindow,
  focusWindow,
  minimizeWindow,
  maximizeWindow,
  restoreWindow,
  moveWindow,
  resizeWindow,
} from '@/stores/windows';
import { initUrlSync, setPendingPushState } from '@/stores/url-sync';
import { $startMenuOpen, closeStartMenu, $shuttingDown } from '@/stores/desktop';
import { WindowFrame } from './WindowFrame';
import type { WindowId } from '@/stores/windows';
import type { MouseEvent } from 'react';
import { Explorer } from '@/components/apps/Explorer';
import { CmdPrompt } from '@/components/apps/CmdPrompt';
import { TaskManager } from '@/components/apps/TaskManager';
import { KnowledgeBase } from '@/components/apps/KnowledgeBase';
import { Pong } from '@/components/apps/Pong';
import { Minesweeper } from '@/components/apps/Minesweeper';
import { GameLauncher } from '@/components/apps/GameLauncher';
import { GAME_LAUNCHER_URLS } from '@/lib/game-launcher-config';

// Reserved for future window types that don't have a component yet
const PLACEHOLDER_CONTENT: Record<string, string> = {};

/** Track the element that had focus before a window was opened */
let previousFocusElement: Element | null = null;

export function WindowLayer() {
  const windows = useStore($windows);
  const activeWindow = useStore($activeWindow);
  const prevWindowCountRef = useRef(Object.keys(windows).length);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      // Save current focus before opening a window
      previousFocusElement = document.activeElement;
      setPendingPushState();
      openWindow(customEvent.detail as WindowId);
    };
    window.addEventListener('luna:open-window', handler);
    return () => {
      window.removeEventListener('luna:open-window', handler);
    };
  }, []);

  useEffect(() => {
    const cleanup = initUrlSync();
    return () => {
      cleanup?.();
    };
  }, []);

  // Escape key handler: close Start Menu or active window
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      // Guard against Escape during shutdown sequence
      if ($shuttingDown.get()) return;

      // If Start Menu is open, close it
      if ($startMenuOpen.get()) {
        e.preventDefault();
        closeStartMenu();
        return;
      }

      // If active window exists, close it
      const active = $activeWindow.get();
      if (active) {
        e.preventDefault();
        setPendingPushState();
        closeWindow(active);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Focus-on-open: when a new window becomes active, focus its TitleBar
  const entries = Object.values(windows);
  const currentCount = entries.length;

  useEffect(() => {
    const prevCount = prevWindowCountRef.current;
    prevWindowCountRef.current = currentCount;

    // A window was just opened — focus its TitleBar
    if (currentCount > prevCount && activeWindow) {
      requestAnimationFrame(() => {
        const titlebar = document.querySelector(
          `[data-testid="window-titlebar"]`,
        ) as HTMLElement | null;
        if (titlebar) {
          // Focus the first button (minimize) in the TitleBar
          const firstButton = titlebar.querySelector('button');
          if (firstButton) {
            firstButton.focus();
          } else {
            titlebar.focus();
          }
        }
      });
    }

    // A window was just closed — restore previous focus
    if (currentCount < prevCount && previousFocusElement) {
      requestAnimationFrame(() => {
        const saved = previousFocusElement as HTMLElement | null;
        if (saved && document.contains(saved) && typeof saved.focus === 'function') {
          saved.focus();
        } else {
          // Fall back to Taskbar or first DesktopIcon
          const fallback = document.querySelector('.start-btn') as HTMLElement | null;
          fallback?.focus();
        }
        previousFocusElement = null;
      });
    }
  }, [currentCount, activeWindow]);

  if (entries.length === 0) return null;

  return (
    <>
      {entries.map((state) => (
        <WindowFrame
          key={state.id}
          state={state}
          isActive={activeWindow === state.id}
          onMinimize={() => minimizeWindow(state.id as WindowId)}
          onMaximize={() => {
            if (state.status === 'maximized') {
              restoreWindow(state.id as WindowId);
            } else {
              maximizeWindow(state.id as WindowId);
            }
          }}
          onClose={() => {
            setPendingPushState();
            closeWindow(state.id as WindowId);
          }}
          onFocusRequest={() => {
            setPendingPushState();
            focusWindow(state.id as WindowId);
          }}
          onDragStart={(e: MouseEvent) => {
            if (state.status !== 'maximized' && state.status !== 'minimized') {
              focusWindow(state.id as WindowId);
              startDrag(e, state.id as WindowId);
            }
          }}
          onResizeStart={(e: MouseEvent, dir) => {
            if (state.status !== 'maximized' && state.status !== 'minimized') {
              focusWindow(state.id as WindowId);
              startResize(e.nativeEvent, state.id as WindowId, dir);
            }
          }}
        >
          {renderContent(state.id as WindowId)}
        </WindowFrame>
      ))}
    </>
  );
}

function renderContent(id: WindowId) {
  if (id === 'explorer' || id === 'mydocs' || id === 'recyclebin') {
    return <Explorer windowId={id} />;
  }

  if (id === 'cmd') {
    return <CmdPrompt windowId={id} />;
  }

  if (id === 'taskmanager') {
    return <TaskManager windowId={id} />;
  }

  if (id === 'help') {
    return <KnowledgeBase windowId={id} />;
  }

  if (id === 'pong') {
    return <Pong windowId={id} />;
  }

  if (id === 'minesweeper') {
    return <Minesweeper windowId={id} />;
  }

  if (id === 'terminal-tactics') {
    return <GameLauncher src={GAME_LAUNCHER_URLS['terminal-tactics']} />;
  }

  const placeholder = PLACEHOLDER_CONTENT[id];
  if (placeholder) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#666',
          fontFamily: '"Tahoma", sans-serif',
          fontSize: 12,
          userSelect: 'none',
        }}
      >
        {placeholder}
      </div>
    );
  }

  return null;
}

function startDrag(e: MouseEvent, id: WindowId) {
  const startX = e.clientX;
  const startY = e.clientY;
  const windows = $windows.get();
  const state = windows[id];
  if (!state) return;

  const origX = state.x;
  const origY = state.y;

  const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
    const dx = moveEvent.clientX - startX;
    const dy = moveEvent.clientY - startY;
    const { innerWidth, innerHeight } = window;

    let newX = origX + dx;
    let newY = origY + dy;

    // Viewport constraint: minimum 32px of any edge must remain visible
    newX = Math.max(newX, -state.width + 32);
    newX = Math.min(newX, innerWidth - 32);
    newY = Math.max(newY, 0);
    newY = Math.min(newY, innerHeight - 32 - 40); // 40px taskbar

    moveWindow(id, newX, newY);
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function startResize(e: globalThis.MouseEvent, id: WindowId, dir: string) {
  const startX = e.clientX;
  const startY = e.clientY;
  const windows = $windows.get();
  const state = windows[id];
  if (!state) return;

  const origX = state.x;
  const origY = state.y;
  const origW = state.width;
  const origH = state.height;
  const isNorth = dir.includes('n');
  const isSouth = dir.includes('s');
  const isWest = dir.includes('w');
  const isEast = dir.includes('e');

  const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
    const dx = moveEvent.clientX - startX;
    const dy = moveEvent.clientY - startY;

    let newX = origX;
    let newY = origY;
    let newW = origW;
    let newH = origH;

    if (isEast) newW = Math.max(origW + dx, state.minWidth);
    if (isWest) {
      const candidateW = origW - dx;
      const clampedW = Math.max(candidateW, state.minWidth);
      newW = clampedW;
      newX = origX + (origW - clampedW);
    }
    if (isSouth) newH = Math.max(origH + dy, state.minHeight);
    if (isNorth) {
      const candidateH = origH - dy;
      const clampedH = Math.max(candidateH, state.minHeight);
      newH = clampedH;
      newY = origY + (origH - clampedH);
    }

    resizeWindow(id, newW, newH);
    if (newX !== origX || newY !== origY) {
      moveWindow(id, newX, newY);
    }
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}
