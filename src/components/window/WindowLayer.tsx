import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
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
    document.addEventListener('luna:open-window', handler);
    return () => {
      document.removeEventListener('luna:open-window', handler);
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
          onDragStart={(e: MouseEvent) => {
            // Drag initiation: only start if status is not 'maximized' or 'minimized'
            if (state.status !== 'maximized' && state.status !== 'minimized') {
              focusWindow(state.id as WindowId);
              startDrag(e, state.id as WindowId);
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
