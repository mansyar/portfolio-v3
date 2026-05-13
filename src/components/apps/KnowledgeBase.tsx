/**
 * KnowledgeBase — MDX article browser with category sidebar and XP styling.
 *
 * Data source: pre-compiled articles-content.json (generated at build time).
 * The JSON is imported directly; at build time it's bundled by Vite.
 */

export interface ArticleMeta {
  title: string;
  description: string;
  category: string;
  order: number;
  lastUpdated: string;
}

interface KnowledgeBaseProps {
  windowId: string;
}

export function KnowledgeBase({ windowId }: KnowledgeBaseProps) {
  return (
    <div className="xp-knowledge-base" data-window-id={windowId}>
      <div className="xp-kb-sidebar">
        <div className="xp-kb-search">
          <input type="text" placeholder="Search articles..." />
        </div>
        <div className="xp-kb-categories">
          <div className="xp-kb-category-item xp-kb-category-active">All Articles</div>
        </div>
      </div>
      <div className="xp-kb-content">
        <div className="xp-kb-article-list">
          <div className="xp-kb-list-placeholder">Select a category to view articles</div>
        </div>
        <div className="xp-kb-detail-pane">
          <div className="xp-kb-detail-placeholder">Select an article to view</div>
        </div>
      </div>
    </div>
  );
}
