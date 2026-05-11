import type { MouseEvent } from 'react';

interface TitleBarProps {
  title: string;
  icon: string;
  isActive: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onMouseDown?: (e: MouseEvent) => void;
}

export function TitleBar({
  title,
  icon,
  isActive,
  onMinimize,
  onMaximize,
  onClose,
  onMouseDown,
}: TitleBarProps) {
  const gradient = isActive
    ? 'linear-gradient(180deg, #0a6cd8 0%, #3c8ee8 8%, #5aa3f0 40%, #3c8ee8 88%, #0a6cd8 100%)'
    : 'linear-gradient(180deg, #6a7a9a 0%, #8a9aba 8%, #a0b0ca 40%, #8a9aba 88%, #6a7a9a 100%)';

  return (
    <div
      data-testid="window-titlebar"
      onMouseDown={onMouseDown}
      onDoubleClick={onMaximize}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 28,
        background: gradient,
        padding: '0 2px 0 4px',
        userSelect: 'none',
        cursor: 'default',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
    >
      {/* App Icon */}
      <img
        src={icon}
        alt={title}
        width={16}
        height={16}
        style={{ marginRight: 4, flexShrink: 0 }}
      />

      {/* Title Text */}
      <span
        style={{
          flex: 1,
          color: '#ffffff',
          fontFamily: 'inherit',
          fontSize: 12,
          fontWeight: 700,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </span>

      {/* Window Control Buttons */}
      <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        {/* Minimize */}
        <button
          aria-label="Minimize"
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          style={{
            width: 21,
            height: 21,
            padding: 0,
            border: '1px solid #ffffff',
            borderRadius: 3,
            background: 'linear-gradient(180deg, #f0f0f0 0%, #d4d4d4 50%, #b8b8b8 100%)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 'bold',
            color: '#000',
            lineHeight: 1,
          }}
        >
          ─
        </button>

        {/* Maximize */}
        <button
          aria-label="Maximize"
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          style={{
            width: 21,
            height: 21,
            padding: 0,
            border: '1px solid #ffffff',
            borderRadius: 3,
            background: 'linear-gradient(180deg, #f0f0f0 0%, #d4d4d4 50%, #b8b8b8 100%)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 'bold',
            color: '#000',
            lineHeight: 1,
          }}
        >
          □
        </button>

        {/* Close */}
        <button
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            width: 21,
            height: 21,
            padding: 0,
            border: '1px solid #ffffff',
            borderRadius: 3,
            background: 'linear-gradient(180deg, #e88a8a 0%, #d46a6a 50%, #c05050 100%)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 'bold',
            color: '#fff',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
