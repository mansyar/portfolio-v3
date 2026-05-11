import { TitleBar } from './TitleBar';
import type { MouseEvent } from 'react';

interface WindowState {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  zIndex: number;
  status: string;
}

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
  children,
}: WindowFrameProps) {
  const shadow = isActive ? '0 4px 16px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.2)';

  return (
    <div
      style={{
        position: 'absolute',
        left: state.x,
        top: state.y,
        width: state.width,
        height: state.height,
        zIndex: state.zIndex,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 8,
        boxShadow: shadow,
        border: '2px solid #0a6cd8',
        background: '#ece9d8',
        fontFamily: '"Tahoma", "Trebuchet MS", sans-serif',
        fontSize: 11,
        overflow: 'hidden',
      }}
      className="xp-window-border"
      onClick={() => {}}
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
