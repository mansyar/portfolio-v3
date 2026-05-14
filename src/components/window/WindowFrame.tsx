import { TitleBar } from './TitleBar';
import type { WindowState } from '@/stores/windows';
import type { MouseEvent } from 'react';

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const RESIZE_HANDLES: { dir: ResizeDir; style: React.CSSProperties; cursor: string }[] = [
  { dir: 'n', style: { top: 0, left: 8, right: 8, height: 8 }, cursor: 'n-resize' },
  { dir: 's', style: { bottom: 0, left: 8, right: 8, height: 8 }, cursor: 's-resize' },
  { dir: 'e', style: { top: 8, right: 0, bottom: 8, width: 8 }, cursor: 'e-resize' },
  { dir: 'w', style: { top: 8, left: 0, bottom: 8, width: 8 }, cursor: 'w-resize' },
  { dir: 'ne', style: { top: 0, right: 0, width: 8, height: 8 }, cursor: 'ne-resize' },
  { dir: 'nw', style: { top: 0, left: 0, width: 8, height: 8 }, cursor: 'nw-resize' },
  { dir: 'se', style: { bottom: 0, right: 0, width: 8, height: 8 }, cursor: 'se-resize' },
  { dir: 'sw', style: { bottom: 0, left: 0, width: 8, height: 8 }, cursor: 'sw-resize' },
];

interface WindowFrameProps {
  state: WindowState;
  isActive: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  onDragStart?: (e: MouseEvent) => void;
  onResizeStart?: (e: MouseEvent, dir: ResizeDir) => void;
  onFocusRequest?: () => void;
  children?: React.ReactNode;
}

export function WindowFrame({
  state,
  isActive,
  onMinimize,
  onMaximize,
  onClose,
  onDragStart,
  onResizeStart,
  onFocusRequest,
  children,
}: WindowFrameProps) {
  const shadow = isActive ? '0 4px 16px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.2)';

  const animClass =
    state.status === 'open'
      ? 'window-open'
      : state.status === 'closing'
        ? 'window-closing'
        : state.status === 'minimized'
          ? 'window-minimized'
          : state.status === 'maximized'
            ? 'window-maximized'
            : '';

  return (
    <div
      role="dialog"
      aria-label={state.title}
      aria-modal="true"
      style={{
        position: 'absolute',
        left: state.x,
        top: state.y,
        width: state.width,
        height: state.height,
        zIndex: state.zIndex,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 8,
        boxShadow: shadow,
        border: '2px solid #0a6cd8',
        background: '#ece9d8',
        fontFamily: '"Tahoma", "Trebuchet MS", sans-serif',
        fontSize: 11,
        overflow: 'hidden',
        transition: 'transform 150ms ease-out, opacity 150ms ease-out',
        opacity: state.status === 'closing' || state.status === 'minimized' ? 0 : 1,
        transform:
          state.status === 'closing'
            ? 'scale(0.95)'
            : state.status === 'open'
              ? 'scale(1)'
              : state.status === 'minimized'
                ? 'translateY(100vh) scale(0.5)'
                : '',
      }}
      className={`xp-window-border ${animClass}`.trim()}
      onClick={onFocusRequest}
    >
      <TitleBar
        title={state.title}
        icon={state.icon}
        isActive={isActive}
        onMinimize={onMinimize ?? (() => {})}
        onMaximize={onMaximize ?? (() => {})}
        onClose={onClose ?? (() => {})}
        onMouseDown={onDragStart}
      />
      {/* Edge/Corner resize handles */}
      {RESIZE_HANDLES.map(({ dir, style, cursor }) => (
        <div
          key={dir}
          data-resize={dir}
          aria-hidden="true"
          style={{
            position: 'absolute',
            ...style,
            cursor,
            zIndex: 100,
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onResizeStart?.(e, dir);
          }}
        />
      ))}
      <div
        style={{
          flex: 1,
          padding: 8,
          overflow: 'auto',
          background: '#ffffff',
        }}
      >
        {children}
      </div>
    </div>
  );
}
