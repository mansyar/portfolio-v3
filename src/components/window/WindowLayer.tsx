import { useEffect } from 'react';
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
import { WindowFrame } from './WindowFrame';
import type { WindowId } from '@/stores/windows';
import type { MouseEvent } from 'react';

const PLACEHOLDER_CONTENT: Record<string, string> = {
  explorer: 'My Computer — Coming Soon in Track 2A',
  mydocs: 'My Documents — Coming Soon in Track 2B',
  help: 'Help & Support — Coming Soon in Track 2C',
  cmd: 'Command Prompt — Coming Soon in Track 2D',
  taskmanager: 'Task Manager — Coming Soon in Track 2E',
  recyclebin: 'Recycle Bin — Coming Soon in Track 2F',
};

export function WindowLayer() {
  const windows = useStore($windows);
  const activeWindow = useStore($activeWindow);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      openWindow(customEvent.detail as WindowId);
    };
    window.addEventListener('luna:open-window', handler);
    return () => {
      window.removeEventListener('luna:open-window', handler);
    };
  }, []);

  const entries = Object.values(windows);

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
          onClose={() => closeWindow(state.id as WindowId)}
          onFocusRequest={() => focusWindow(state.id as WindowId)}
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
            {PLACEHOLDER_CONTENT[state.id] || `Window — ${state.title}`}
          </div>
        </WindowFrame>
      ))}
    </>
  );
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
