import { useStore } from '@/lib/useStore';
import {
  $taskbarWindows,
  $activeWindow,
  focusWindow,
  minimizeWindow,
  restoreWindow,
} from '@/stores/windows';
import type { WindowId } from '@/stores/windows';
import { $startMenuOpen, toggleStartMenu, $shuttingDown, cancelShutdown } from '@/stores/desktop';
import { Clock } from './Clock';
import { StartMenu } from './StartMenu';
import { ShutdownOverlay } from './ShutdownOverlay';

export function Taskbar() {
  const windows = useStore($taskbarWindows);
  const activeWindow = useStore($activeWindow);
  const startMenuOpen = useStore($startMenuOpen);
  const shuttingDown = useStore($shuttingDown);

  const handleClick = (id: WindowId) => {
    const state = windows.find((w) => w.id === id);
    if (!state) return;

    if (activeWindow === id && state.status !== 'minimized') {
      minimizeWindow(id);
    } else if (state.status === 'minimized') {
      restoreWindow(id);
      focusWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <>
      <div
        className="xp-taskbar-border"
        role="toolbar"
        aria-label="Taskbar"
        style={{
          background: 'var(--xp-taskbar-bg)',
          height: 'var(--xp-taskbar-height, 40px)',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'var(--xp-font-family)',
          fontSize: 'var(--xp-taskbar-font-size, 11px)',
        }}
      >
        {/* Start Button */}
        <button
          aria-label="Start"
          onClick={toggleStartMenu}
          className={startMenuOpen ? 'start-btn active' : 'start-btn'}
          style={{
            background: startMenuOpen
              ? 'linear-gradient(180deg, #2d8e33 0%, #47a84c 8%, #3b8f3f 92%, #1e7a24 100%)'
              : 'var(--xp-start-btn-green)',
            border: 'none',
            color: '#ffffff',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'bold',
            height: '100%',
            padding: '0 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          Start
        </button>

        {/* Window Buttons */}
        <div style={{ display: 'flex', flex: 1, gap: 2, padding: '0 4px', overflow: 'hidden' }}>
          {windows.map((w) => (
            <button
              key={w.id}
              onClick={() => handleClick(w.id as WindowId)}
              className={activeWindow === w.id ? 'taskbar-btn active' : 'taskbar-btn'}
              aria-label={w.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                height: '100%',
                padding: '0 8px',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 2,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                color: '#ffffff',
                background:
                  activeWindow === w.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                minWidth: 0,
                maxWidth: 180,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <img src={w.icon} alt="" width={16} height={16} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.title}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: '0 8px',
            color: '#ffffff',
            borderLeft: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Clock />
        </div>

        {/* Start Menu — mounted inside Taskbar, positioned above */}
        <StartMenu />
      </div>

      {/* Shutdown Overlay — rendered outside taskbar, covers full viewport */}
      {shuttingDown && <ShutdownOverlay onClose={cancelShutdown} />}
    </>
  );
}
