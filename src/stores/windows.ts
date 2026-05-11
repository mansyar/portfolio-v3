import { atom, map, computed } from 'nanostores';

export type WindowId = 'explorer' | 'mydocs' | 'help' | 'cmd' | 'taskmanager' | 'recyclebin';

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
    title: 'Help & Support',
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
};

export const $windows = map<Record<WindowId, WindowState>>({} as Record<WindowId, WindowState>);

export const $zCounter = atom<number>(100);

export const $activeWindow = atom<WindowId | null>(null);

export const $taskbarWindows = computed($windows, (windows) =>
  Object.values(windows).filter((w) => w.status !== undefined),
);
