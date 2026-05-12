interface ExplorerToolbarProps {
  onBack: () => void;
  onUp: () => void;
  canGoBack: boolean;
  canGoUp: boolean;
}

export function ExplorerToolbar({ onBack, onUp, canGoBack, canGoUp }: ExplorerToolbarProps) {
  return (
    <div className="xp-toolbar" role="toolbar" aria-label="Explorer toolbar">
      <button
        className="xp-button xp-toolbar-btn"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Back"
        type="button"
      >
        Back
      </button>
      <button
        className="xp-button xp-toolbar-btn"
        onClick={onUp}
        disabled={!canGoUp}
        aria-label="Up"
        type="button"
      >
        Up
      </button>
    </div>
  );
}
