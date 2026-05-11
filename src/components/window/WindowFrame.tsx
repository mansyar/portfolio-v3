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

interface WindowFrameProps {
  state: WindowState;
  isActive: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  onDragStart?: (e: MouseEvent) => void;
  children?: React.ReactNode;
}

export function WindowFrame({
  state,
  isActive,
  onMinimize,
  onMaximize,
  onClose,
  onDragStart,
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
