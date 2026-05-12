import { useState, useCallback } from 'react';
import { useStore } from '@/lib/useStore';
import { $windows } from '@/stores/windows';
import type { WindowId } from '@/stores/windows';

interface TaskManagerProps {
  windowId: string;
}

type TabId = 'processes' | 'performance';

const TABS: { id: TabId; label: string }[] = [
  { id: 'processes', label: 'Processes' },
  { id: 'performance', label: 'Performance' },
];

const TAB_STYLE_BASE: React.CSSProperties = {
  fontFamily: '"Tahoma", sans-serif',
  fontSize: 11,
  padding: '3px 12px',
  cursor: 'pointer',
  border: '1px solid #808080',
  borderBottom: '1px solid #808080',
  background: '#ECE9D8',
  marginRight: 2,
  outline: 'none',
  userSelect: 'none',
};

const TAB_ACTIVE_STYLE: React.CSSProperties = {
  ...TAB_STYLE_BASE,
  borderBottom: '1px solid #ECE9D8',
  background: '#ECE9D8',
  borderStyle: 'inset',
  fontWeight: 700,
};

const TAB_INACTIVE_STYLE: React.CSSProperties = {
  ...TAB_STYLE_BASE,
  borderStyle: 'outset',
  background: '#D4D0C8',
};

const CONTENT_STYLE: React.CSSProperties = {
  border: '1px solid #808080',
  borderTop: 'none',
  background: '#FFFFFF',
  flex: 1,
  overflow: 'auto',
  padding: 4,
};

export function TaskManager({ windowId }: TaskManagerProps) {
  // Hooks must be called before any early return (rules-of-hooks)
  const [activeTab, setActiveTab] = useState<TabId>('processes');

  const handleTabClick = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = TABS.findIndex((t) => t.id === activeTab);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % TABS.length;
        setActiveTab(TABS[nextIndex].id);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        setActiveTab(TABS[prevIndex].id);
      }
    },
    [activeTab],
  );

  const windows = useStore($windows);
  const windowState = windows[windowId as WindowId];
  if (!windowState) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#ECE9D8',
        fontFamily: '"Tahoma", sans-serif',
        fontSize: 11,
      }}
    >
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Task Manager tabs"
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          padding: '4px 4px 0 4px',
          background: '#ECE9D8',
          borderBottom: '1px solid #808080',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabClick(tab.id)}
              style={isActive ? TAB_ACTIVE_STYLE : TAB_INACTIVE_STYLE}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={CONTENT_STYLE}>
        <div
          role="tabpanel"
          id="panel-processes"
          aria-labelledby="tab-processes"
          aria-hidden={activeTab !== 'processes'}
          style={{ display: activeTab === 'processes' ? 'block' : 'none', height: '100%' }}
        >
          {/* Processes content will be added in Phase 2 */}
          {activeTab === 'processes' && <div>Processes tab content</div>}
        </div>

        <div
          role="tabpanel"
          id="panel-performance"
          aria-labelledby="tab-performance"
          aria-hidden={activeTab !== 'performance'}
          style={{ display: activeTab === 'performance' ? 'block' : 'none', height: '100%' }}
        >
          {/* Performance content will be added in Phase 3 */}
          {activeTab === 'performance' && <div>Performance tab content</div>}
        </div>
      </div>
    </div>
  );
}
