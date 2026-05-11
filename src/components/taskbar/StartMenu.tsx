import { useState, useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/lib/useStore';
import { $startMenuOpen, closeStartMenu, triggerShutdown } from '@/stores/desktop';
import { openWindow } from '@/stores/windows';
import type { WindowId } from '@/stores/windows';

const CLOSE_ANIMATION_MS = 100;

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  windowId: WindowId;
}

const LEFT_ITEMS: MenuItem[] = [
  { id: 'resume', label: 'Resume', icon: '/icons/my-documents.svg', windowId: 'mydocs' },
  { id: 'explorer', label: 'Explorer', icon: '/icons/my-computer.svg', windowId: 'explorer' },
  {
    id: 'taskmgr',
    label: 'Task Manager',
    icon: '/icons/task-manager.svg',
    windowId: 'taskmanager',
  },
  { id: 'cmd', label: 'Command Prompt', icon: '/icons/command-prompt.svg', windowId: 'cmd' },
];

const RIGHT_ITEMS: MenuItem[] = [
  { id: 'mydocs', label: 'My Documents', icon: '/icons/my-documents.svg', windowId: 'mydocs' },
  { id: 'mycomputer', label: 'My Computer', icon: '/icons/my-computer.svg', windowId: 'explorer' },
  {
    id: 'controlpanel',
    label: 'Control Panel',
    icon: '/icons/task-manager.svg',
    windowId: 'taskmanager',
  },
  { id: 'help', label: 'Help & Support', icon: '/icons/help-support.svg', windowId: 'help' },
];

const ALL_ITEMS = [...LEFT_ITEMS, ...RIGHT_ITEMS];

export function StartMenu() {
  const isOpen = useStore($startMenuOpen);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [animClass, setAnimClass] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Track animation state based on isOpen transitions
  useEffect(() => {
    if (isOpen) {
      setIsRendering(true);
      // Use requestAnimationFrame to ensure the DOM is mounted before adding open animation
      requestAnimationFrame(() => {
        setAnimClass('start-menu-open');
      });
      setActiveIndex(0);
    } else if (isRendering) {
      // Start closing animation
      setAnimClass('start-menu-closing');
      // After animation completes, remove from DOM
      const timer = setTimeout(() => {
        setIsRendering(false);
        setAnimClass('');
      }, CLOSE_ANIMATION_MS);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeStartMenu();
      }
    };

    // Delay adding listener to avoid the same click that opened the menu
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeStartMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleItemClick = useCallback((windowId: WindowId) => {
    openWindow(windowId);
    closeStartMenu();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            setActiveIndex((prev) => (prev - 1 + ALL_ITEMS.length) % ALL_ITEMS.length);
          } else {
            setActiveIndex((prev) => (prev + 1) % ALL_ITEMS.length);
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (ALL_ITEMS[activeIndex]) {
            handleItemClick(ALL_ITEMS[activeIndex].windowId);
          }
          break;
      }
    },
    [activeIndex, handleItemClick],
  );

  if (!isRendering) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-activedescendant={`start-menu-item-${ALL_ITEMS[activeIndex]?.id ?? ''}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`start-menu${animClass ? ' ' + animClass : ''}`}
      style={{
        position: 'fixed',
        bottom: 'var(--xp-taskbar-height, 40px)',
        left: 0,
        width: 'var(--xp-startmenu-width, 320px)',
        background: 'var(--xp-start-left-bg, #ffffff)',
        fontFamily: 'var(--xp-font-family)',
        fontSize: 'var(--xp-font-size-xs, 11px)',
        boxShadow: 'var(--xp-shadow-lg, 4px 4px 12px rgba(0,0,0,0.5))',
        zIndex: 10000,
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--xp-start-header-blue)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#0a246a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 14,
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          MARP
        </div>
        <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 12 }}>
          Muhammad Ansyar Rafi Putra
        </span>
      </div>

      {/* Body — Two columns */}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {/* Left Column — Pinned Apps */}
        <div
          style={{
            flex: 1,
            background: 'var(--xp-start-left-bg, #ffffff)',
            padding: '4px 0',
          }}
        >
          {LEFT_ITEMS.map((item, i) => (
            <div
              key={item.id}
              id={`start-menu-item-${item.id}`}
              role="menuitem"
              tabIndex={-1}
              onClick={() => handleItemClick(item.windowId)}
              onMouseEnter={() => setActiveIndex(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                cursor: 'pointer',
                background: activeIndex === i ? 'var(--xp-blue-highlight, #316ac5)' : 'transparent',
                color: activeIndex === i ? '#ffffff' : 'var(--xp-button-text, #000000)',
              }}
            >
              <img src={item.icon} alt="" className="startmenu-icon" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Right Column — System Folders */}
        <div
          style={{
            flex: 1,
            background: 'var(--xp-start-right-bg, #d3e5fa)',
            padding: '4px 0',
          }}
        >
          {RIGHT_ITEMS.map((item, i) => {
            const globalIndex = LEFT_ITEMS.length + i;
            return (
              <div
                key={item.id}
                id={`start-menu-item-${item.id}`}
                role="menuitem"
                tabIndex={-1}
                onClick={() => handleItemClick(item.windowId)}
                onMouseEnter={() => setActiveIndex(globalIndex)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  background:
                    activeIndex === globalIndex
                      ? 'var(--xp-blue-highlight, #316ac5)'
                      : 'transparent',
                  color: activeIndex === globalIndex ? '#ffffff' : 'var(--xp-button-text, #000000)',
                }}
              >
                <img src={item.icon} alt="" className="startmenu-icon" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar — Divider + Shut Down */}
      <div
        style={{
          borderTop: '2px solid var(--xp-start-separator, #d6d2c2)',
          padding: '4px 8px',
          background: 'var(--xp-start-left-bg, #ffffff)',
        }}
      >
        <div
          role="menuitem"
          tabIndex={-1}
          onClick={() => {
            closeStartMenu();
            // Small delay to allow menu close animation before overlay appears
            setTimeout(() => triggerShutdown(), 150);
          }}
          onMouseEnter={() => setActiveIndex(ALL_ITEMS.length)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 8px',
            cursor: 'pointer',
            background:
              activeIndex === ALL_ITEMS.length
                ? 'var(--xp-blue-highlight, #316ac5)'
                : 'transparent',
            color: activeIndex === ALL_ITEMS.length ? '#ffffff' : 'var(--xp-button-text, #000000)',
          }}
        >
          {/* Power icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 1v6M3.5 3.5a5.5 5.5 0 1 0 7 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>Shut Down...</span>
        </div>
      </div>
    </div>
  );
}
