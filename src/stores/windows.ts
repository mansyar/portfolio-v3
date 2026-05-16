import { atom, map, computed } from 'nanostores';

export type WindowId =
  | 'explorer'
  | 'mydocs'
  | 'help'
  | 'cmd'
  | 'taskmanager'
  | 'recyclebin'
  | 'pong'
  | 'minesweeper'
  | 'terminal-tactics';

export type WindowStatus = 'open' | 'minimized' | 'maximized' | 'closing';

export interface WindowState {
  id: WindowId;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  zIndex: number;
  status: WindowStatus;
  /** Current directory path for the explorer window */
  explorerPath?: string;
  /** Current working directory for the command prompt window */
  cmdPath?: string;
}

export interface WindowConfig {
  title: string;
  icon: string;
  width: number;
  height: number;
  x: number;
  y: number;
  minWidth: number;
  minHeight: number;
}

export const DEFAULT_WINDOW_CONFIGS: Record<WindowId, WindowConfig> = {
  explorer: {
    title: 'My Computer',
    icon: '/icons/my-computer.svg',
    width: 700,
    height: 500,
    x: 80,
    y: 60,
    minWidth: 400,
    minHeight: 300,
  },
  mydocs: {
    title: 'My Documents',
    icon: '/icons/my-documents.svg',
    width: 600,
    height: 450,
    x: 120,
    y: 80,
    minWidth: 350,
    minHeight: 250,
  },
  help: {
    title: 'Knowledge Base',
    icon: '/icons/help-support.svg',
    width: 750,
    height: 550,
    x: 60,
    y: 40,
    minWidth: 500,
    minHeight: 400,
  },
  cmd: {
    title: 'Command Prompt',
    icon: '/icons/command-prompt.svg',
    width: 680,
    height: 420,
    x: 100,
    y: 100,
    minWidth: 450,
    minHeight: 250,
  },
  taskmanager: {
    title: 'Task Manager',
    icon: '/icons/task-manager.svg',
    width: 500,
    height: 550,
    x: 200,
    y: 60,
    minWidth: 400,
    minHeight: 450,
  },
  recyclebin: {
    title: 'Recycle Bin',
    icon: '/icons/recycle-bin.svg',
    width: 550,
    height: 400,
    x: 150,
    y: 90,
    minWidth: 350,
    minHeight: 250,
  },
  pong: {
    title: 'Pong',
    icon: '/icons/pong.svg',
    width: 620,
    height: 460,
    x: 80,
    y: 60,
    minWidth: 450,
    minHeight: 320,
  },
  minesweeper: {
    title: 'Minesweeper',
    icon: '/icons/minesweeper.svg',
    width: 380,
    height: 450,
    x: 120,
    y: 80,
    minWidth: 315,
    minHeight: 380,
  },
  'terminal-tactics': {
    title: 'Terminal Tactics',
    icon: '/icons/terminal-tactics.svg',
    width: 1280,
    height: 960,
    x: 80,
    y: 20,
    minWidth: 800,
    minHeight: 600,
  },
};

// Type assertion required: the store starts empty but accepts all WindowId keys at runtime
export const $windows = map<Record<WindowId, WindowState>>({} as Record<WindowId, WindowState>);

export const $zCounter = atom<number>(100);

export const $activeWindow = atom<WindowId | null>(null);

export const $taskbarWindows = computed($windows, (windows) =>
  Object.values(windows).filter((w) => w.status !== undefined),
);

// --- Position Caches and Timeout Tracking ---

const prevPositions = new Map<WindowId, { x: number; y: number; width: number; height: number }>();
const closeTimeouts = new Map<WindowId, ReturnType<typeof setTimeout>>();

// --- Window Actions ---

function buildWindowState(id: WindowId, config: WindowConfig, zIndex: number): WindowState {
  return {
    id,
    title: config.title,
    icon: config.icon,
    x: config.x,
    y: config.y,
    width: config.width,
    height: config.height,
    minWidth: config.minWidth,
    minHeight: config.minHeight,
    zIndex,
    status: 'open',
    explorerPath:
      id === 'explorer'
        ? 'C:\\'
        : id === 'mydocs'
          ? 'D:\\My_Documents'
          : id === 'recyclebin'
            ? '\\Recycle_Bin'
            : undefined,
    cmdPath: id === 'cmd' ? 'C:\\' : undefined,
  };
}

export function openWindow(id: WindowId): void {
  const windows = $windows.get();
  if (windows[id]) return; // already open

  const config = DEFAULT_WINDOW_CONFIGS[id];
  const zIndex = $zCounter.get();
  $zCounter.set(zIndex + 1);

  const state = buildWindowState(id, config, zIndex);
  const next = { ...windows, [id]: state };
  $windows.set(next);

  $activeWindow.set(id);
}

export function closeWindow(id: WindowId): void {
  const windows = $windows.get();
  if (!windows[id]) return;

  // Cancel any pending close timeout for this window
  if (closeTimeouts.has(id)) {
    clearTimeout(closeTimeouts.get(id)!);
    closeTimeouts.delete(id);
  }

  // Set transitional 'closing' status for animation
  const closingState = { ...windows[id], status: 'closing' as const };
  $windows.set({ ...windows, [id]: closingState });

  // Remove after animation completes (120ms)
  closeTimeouts.set(
    id,
    setTimeout(() => {
      closeTimeouts.delete(id);
      const current = $windows.get();
      if (current[id]?.status === 'closing') {
        const next = { ...current };
        delete next[id];
        $windows.set(next);
        if ($activeWindow.get() === id) {
          $activeWindow.set(null);
        }
      }
    }, 120),
  );
}

export function minimizeWindow(id: WindowId): void {
  const windows = $windows.get();
  const state = windows[id];
  if (!state) return;

  // Cache current position for restore
  prevPositions.set(id, { x: state.x, y: state.y, width: state.width, height: state.height });

  const updated = { ...state, status: 'minimized' as const };
  $windows.set({ ...windows, [id]: updated });
}

export function maximizeWindow(id: WindowId): void {
  const windows = $windows.get();
  const state = windows[id];
  if (!state) return;

  // Cache current position/size
  prevPositions.set(id, { x: state.x, y: state.y, width: state.width, height: state.height });

  const updated = { ...state, status: 'maximized' as const };
  $windows.set({ ...windows, [id]: updated });
}

export function restoreWindow(id: WindowId): void {
  const windows = $windows.get();
  const state = windows[id];
  if (!state) return;
  if (state.status !== 'minimized' && state.status !== 'maximized') return;

  const cached = prevPositions.get(id);
  const restored = {
    ...state,
    status: 'open' as const,
    ...(cached ? { x: cached.x, y: cached.y, width: cached.width, height: cached.height } : {}),
  };
  $windows.set({ ...windows, [id]: restored });
}

export function focusWindow(id: WindowId): void {
  const windows = $windows.get();
  const state = windows[id];
  if (!state) return;

  const zIndex = $zCounter.get();
  const newZIndex = zIndex + 1;
  $zCounter.set(newZIndex);

  const updated = { ...state, zIndex: newZIndex };
  $windows.set({ ...windows, [id]: updated });

  $activeWindow.set(id);
}

export function moveWindow(id: WindowId, x: number, y: number): void {
  const windows = $windows.get();
  const state = windows[id];
  if (!state) return;

  // Viewport constraint: minimum 32px of any edge must remain visible
  // We store the raw position; the component will clamp rendering
  const updated = { ...state, x, y };
  $windows.set({ ...windows, [id]: updated });
}

export function resizeWindow(id: WindowId, width: number, height: number): void {
  const windows = $windows.get();
  const state = windows[id];
  if (!state) return;

  const clampedWidth = Math.max(width, state.minWidth);
  const clampedHeight = Math.max(height, state.minHeight);

  const updated = { ...state, width: clampedWidth, height: clampedHeight };
  $windows.set({ ...windows, [id]: updated });
}
