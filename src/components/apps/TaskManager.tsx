import { useState, useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/lib/useStore';
import { $windows } from '@/stores/windows';
import type { WindowId } from '@/stores/windows';
import { CanvasGraph } from './CanvasGraph';
import {
  PROCESS_DATA,
  CPU_PERF_BASE,
  MEM_PERF_BASE,
  initCpuPerfData,
  initMemPerfData,
} from '@/lib/task-manager-data';
import type { ProcessEntry } from '@/lib/task-manager-data';

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
  const [cpuValues, setCpuValues] = useState<number[]>(() => PROCESS_DATA.map((p) => p.cpu));
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [warningProcess, setWarningProcess] = useState<ProcessEntry | null>(null);
  const [perfCpuData, setPerfCpuData] = useState<number[]>(() => initCpuPerfData());
  const [perfMemData, setPerfMemData] = useState<number[]>(() => initMemPerfData());
  const cpuRefs = useRef<(HTMLTableCellElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuValues((prev) =>
        prev.map((val) => {
          const delta = (Math.random() - 0.5) * 6; // ±3%
          const newVal = val + delta;
          return Math.round(Math.max(0, Math.min(100, newVal)));
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Performance data update every 1s
  useEffect(() => {
    const interval = setInterval(() => {
      setPerfCpuData((prev) => {
        const delta = (Math.random() - 0.5) * 4; // ±2%
        const newVal = Math.max(0, Math.min(100, CPU_PERF_BASE + delta));
        return [...prev.slice(1), newVal];
      });
      setPerfMemData((prev) => {
        const delta = (Math.random() - 0.5) * 4; // ±2%
        const newVal = Math.max(0, Math.min(100, MEM_PERF_BASE + delta));
        return [...prev.slice(1), newVal];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update DOM directly for CPU cells to avoid full re-renders
  useEffect(() => {
    cpuRefs.current.forEach((cell, i) => {
      if (cell) {
        cell.textContent = cpuValues[i] + '%';
      }
    });
  }, [cpuValues]);

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

  const handleRowClick = useCallback((pid: number) => {
    setSelectedPid(pid);
  }, []);

  const handleEndProcess = useCallback(() => {
    if (selectedPid === null) return;
    const proc = PROCESS_DATA.find((p) => p.pid === selectedPid);
    if (proc) {
      setWarningProcess(proc);
    }
  }, [selectedPid]);

  const handleDismissWarning = useCallback(() => {
    setWarningProcess(null);
  }, []);

  const windows = useStore($windows);
  const windowState = windows[windowId as WindowId];
  if (!windowState) return null;

  const width = windowState.width;

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
      <div style={{ ...CONTENT_STYLE, position: 'relative' }}>
        <div
          role="tabpanel"
          id="panel-processes"
          aria-labelledby="tab-processes"
          aria-hidden={activeTab !== 'processes'}
          style={{
            display: activeTab === 'processes' ? 'flex' : 'none',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          {activeTab === 'processes' && (
            <>
              <div style={{ flex: 1, overflow: 'auto' }}>
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
                    {PROCESS_DATA.map((proc, i) => {
                      const isSelected = selectedPid === proc.pid;
                      return (
                        <tr
                          key={proc.pid}
                          role="row"
                          data-selected={isSelected ? 'true' : 'false'}
                          onClick={() => handleRowClick(proc.pid)}
                          style={{
                            background: isSelected ? '#0A246A' : 'transparent',
                            color: isSelected ? '#FFFFFF' : '#000000',
                            cursor: 'pointer',
                          }}
                        >
                          <td style={CELL_STYLE}>{proc.imageName}</td>
                          <td style={CELL_STYLE}>{proc.pid}</td>
                          <td
                            style={CELL_STYLE}
                            ref={(el) => {
                              cpuRefs.current[i] = el;
                            }}
                          >
                            {cpuValues[i]}%
                          </td>
                          <td style={CELL_STYLE}>{proc.memUsage}</td>
                          <td style={CELL_STYLE}>{proc.description}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom bar with End Process button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: '4px 4px 0 4px',
                  borderTop: '1px solid #D4D0C8',
                  background: '#ECE9D8',
                }}
              >
                <button
                  type="button"
                  disabled={selectedPid === null}
                  onClick={handleEndProcess}
                  style={{
                    fontFamily: '"Tahoma", sans-serif',
                    fontSize: 11,
                    padding: '2px 16px',
                    cursor: selectedPid === null ? 'default' : 'pointer',
                    border: '1px solid #808080',
                    background: selectedPid === null ? '#D4D0C8' : '#ECE9D8',
                    color: selectedPid === null ? '#808080' : '#000000',
                    outline: 'none',
                  }}
                >
                  End Process
                </button>
              </div>
            </>
          )}
        </div>

        <div
          role="tabpanel"
          id="panel-performance"
          aria-labelledby="tab-performance"
          aria-hidden={activeTab !== 'performance'}
          style={{ display: activeTab === 'performance' ? 'block' : 'none', height: '100%' }}
        >
          {activeTab === 'performance' && (
            <div style={{ padding: 4 }}>
              <CanvasGraph
                label="Skills Utilization"
                width={width - 28}
                height={150}
                data={perfCpuData}
              />
              <CanvasGraph
                label="Knowledge Base"
                width={width - 28}
                height={150}
                data={perfMemData}
              />
            </div>
          )}
        </div>

        {/* Warning Dialog Overlay */}
        {warningProcess && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.3)',
              zIndex: 10,
            }}
          >
            <div
              style={{
                background: '#ECE9D8',
                border: '2px solid #0A246A',
                borderTop: '2px solid #0A84FF',
                padding: 0,
                width: 350,
                fontFamily: '"Tahoma", sans-serif',
                fontSize: 11,
                boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              {/* Dialog Title Bar */}
              <div
                style={{
                  background:
                    'linear-gradient(180deg, #0A246A 0%, #3A6EA5 8%, #5A8EC5 40%, #3A6EA5 88%, #0A246A 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  padding: '3px 6px',
                  fontSize: 12,
                }}
              >
                Task Manager Warning
              </div>

              {/* Dialog Body */}
              <div style={{ padding: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flexShrink: 0, width: 32, height: 32 }}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="15"
                      fill="#FFE000"
                      stroke="#C8A000"
                      strokeWidth="1.5"
                    />
                    <rect x="14.5" y="8" width="3" height="12" rx="1" fill="#000000" />
                    <circle cx="16" cy="23" r="1.5" fill="#000000" />
                  </svg>
                </div>
                <div>
                  WARNING: Terminating the process &apos;{warningProcess.imageName}&apos; can cause
                  unwanted behavior including loss of data and system instability. The process will
                  not be given a chance to save its data. Are you sure you want to terminate this
                  process?
                </div>
              </div>

              {/* Dialog Buttons */}
              <div
                style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '0 0 8px 0' }}
              >
                <button
                  type="button"
                  onClick={handleDismissWarning}
                  style={{
                    fontFamily: '"Tahoma", sans-serif',
                    fontSize: 11,
                    padding: '2px 20px',
                    border: '1px solid #808080',
                    background: '#ECE9D8',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={handleDismissWarning}
                  style={{
                    fontFamily: '"Tahoma", sans-serif',
                    fontSize: 11,
                    padding: '2px 20px',
                    border: '1px solid #808080',
                    background: '#ECE9D8',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
