import { memo } from 'react';

interface ExplorerBreadcrumbProps {
  segments: string[];
  onNavigate: (index: number) => void;
}

export const ExplorerBreadcrumb = memo(function ExplorerBreadcrumb({
  segments,
  onNavigate,
}: ExplorerBreadcrumbProps) {
  if (segments.length === 0) return null;

  return (
    <nav className="xp-breadcrumb" aria-label="Current path">
      {segments.map((segment, index) => (
        <span key={`${segment}-${index}`} className="xp-breadcrumb-segment">
          <button className="xp-breadcrumb-link" onClick={() => onNavigate(index)} type="button">
            {segment}
          </button>
          {index < segments.length - 1 && <span className="xp-breadcrumb-separator">{' \\ '}</span>}
        </span>
      ))}
    </nav>
  );
});
