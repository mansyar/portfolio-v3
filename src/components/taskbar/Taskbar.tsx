import Clock from './Clock';

export default function Taskbar() {
  return (
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
        style={{
          background: 'var(--xp-start-btn-green)',
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

      {/* Spacer */}
      <div style={{ flex: 1 }} />

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
    </div>
  );
}
