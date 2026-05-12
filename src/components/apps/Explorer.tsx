import { useCallback, useState } from 'react';
import { useStore } from '@/lib/useStore';
import { $windows } from '@/stores/windows';
import type { WindowId } from '@/stores/windows';
import { getParent, splitPath } from '@/lib/filesystem';
import { ExplorerToolbar } from './ExplorerToolbar';
import { ExplorerBreadcrumb } from './ExplorerBreadcrumb';
import { ExplorerFileList } from './ExplorerFileList';

interface ExplorerProps {
  windowId: WindowId;
}

export function Explorer({ windowId }: ExplorerProps) {
  const windows = useStore($windows);
  const windowState = windows[windowId];
  const currentPath = windowState?.explorerPath ?? '\\';

  // History stack for the Back button
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const segments = splitPath(currentPath);
  const canGoBack = historyIndex > 0;
  const canGoUp = currentPath !== '\\';
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const navigateTo = useCallback(
    (path: string) => {
      const windows = $windows.get();
      const state = windows[windowId];
      if (!state) return;

      // Add current path to history before navigating
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(currentPath);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      const updated = { ...state, explorerPath: path };
      $windows.set({ ...windows, [windowId]: updated });
      setSelectedSlug(null);
    },
    [windowId, currentPath, history, historyIndex],
  );

  const handleBack = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const targetPath = history[newIndex];
    setHistoryIndex(newIndex);

    const windows = $windows.get();
    const state = windows[windowId];
    if (!state) return;

    const updated = { ...state, explorerPath: targetPath };
    $windows.set({ ...windows, [windowId]: updated });
    setSelectedSlug(null);
  }, [windowId, history, historyIndex]);

  const handleUp = useCallback(() => {
    const parent = getParent(currentPath);
    if (parent) navigateTo(parent);
  }, [currentPath, navigateTo]);

  const handleBreadcrumb = useCallback(
    (index: number) => {
      if (index === segments.length - 1) return; // already at this level
      const targetSegments = segments.slice(0, index + 1);
      const targetPath = targetSegments.join('\\') + '\\';
      navigateTo(targetPath);
    },
    [segments, navigateTo],
  );

  const handleFileClick = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);

  return (
    <div className="xp-explorer">
      <ExplorerToolbar
        onBack={handleBack}
        onUp={handleUp}
        canGoBack={canGoBack}
        canGoUp={canGoUp}
      />
      <div className="xp-address-bar">
        <ExplorerBreadcrumb segments={segments} onNavigate={handleBreadcrumb} />
      </div>
      <div className="xp-explorer-content">
        <ExplorerFileList
          path={currentPath}
          onFileClick={handleFileClick}
          selectedSlug={selectedSlug}
        />
      </div>
    </div>
  );
}
