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

interface ProcessEntry {
  imageName: string;
  pid: number;
  cpu: number;
  memUsage: string;
  description: string;
}

const PROCESS_DATA: ProcessEntry[] = [
  {
    imageName: 'python.exe',
    pid: 1204,
    cpu: 12,
    memUsage: '45,320 K',
    description: 'Python Runtime',
  },
  {
    imageName: 'terraform.svc',
    pid: 892,
    cpu: 8,
    memUsage: '32,100 K',
    description: 'Infrastructure Manager',
  },
  {
    imageName: 'docker.exe',
    pid: 2048,
    cpu: 15,
    memUsage: '128,400 K',
    description: 'Container Runtime',
  },
  { imageName: 'react.dll', pid: 1567, cpu: 6, memUsage: '22,800 K', description: 'UI Framework' },
  {
    imageName: 'node.exe',
    pid: 3201,
    cpu: 10,
    memUsage: '67,500 K',
    description: 'JavaScript Runtime',
  },
  { imageName: 'git.exe', pid: 445, cpu: 2, memUsage: '8,200 K', description: 'Version Control' },
  {
    imageName: 'linux_kernel',
    pid: 1,
    cpu: 18,
    memUsage: '256,000 K',
    description: 'Operating System',
  },
  {
    imageName: 'ansible.svc',
    pid: 780,
    cpu: 5,
    memUsage: '15,600 K',
    description: 'Configuration Mgmt',
  },
];

const COLUMN_HEADERS = ['Image Name', 'PID', 'CPU', 'Mem Usage', 'Description'];

const CELL_STYLE: React.CSSProperties = {
  fontFamily: '"Tahoma", sans-serif',
  fontSize: 11,
  padding: '2px 6px',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid #D4D0C8',
};

const HEADER_CELL_STYLE: React.CSSProperties = {
  fontFamily: '"Tahoma", sans-serif',
  fontSize: 11,
  fontWeight: 700,
  padding: '3px 6px',
  whiteSpace: 'nowrap',
  borderRight: '1px solid #808080',
  borderBottom: '1px solid #808080',
  background: '#ECE9D8',
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
          {activeTab === 'processes' && (
            <div style={{ height: '100%', overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    {COLUMN_HEADERS.map((header) => (
                      <th key={header} style={HEADER_CELL_STYLE}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROCESS_DATA.map((proc) => (
                    <tr key={proc.pid} role="row">
                      <td style={CELL_STYLE}>{proc.imageName}</td>
                      <td style={CELL_STYLE}>{proc.pid}</td>
                      <td style={CELL_STYLE}>{proc.cpu}%</td>
                      <td style={CELL_STYLE}>{proc.memUsage}</td>
                      <td style={CELL_STYLE}>{proc.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
