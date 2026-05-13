import { useState, useMemo } from 'react';

import articlesData from '@/lib/generated/articles-content.json';

interface ArticleMeta {
  title: string;
  description: string;
  category: string;
  order: number;
  lastUpdated: string;
}

interface ArticlesData {
  metadata: Record<string, ArticleMeta>;
  content: Record<string, string>;
}

const typedData = articlesData as ArticlesData;

interface KnowledgeBaseProps {
  windowId: string;
}

export function KnowledgeBase({ windowId }: KnowledgeBaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    for (const meta of Object.values(typedData.metadata)) {
      cats.add(meta.category);
    }
    return ['All Articles', ...Array.from(cats).sort()];
  }, []);

  const filteredArticles = useMemo(() => {
    let articles = Object.entries(typedData.metadata);

    // Filter by search query — search crosses category boundaries
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      articles = articles.filter(
        ([, meta]) =>
          meta.title.toLowerCase().includes(q) || meta.description.toLowerCase().includes(q),
      );
    } else if (selectedCategory && selectedCategory !== 'All Articles') {
      // Only filter by category when no search query is active
      articles = articles.filter(([, meta]) => meta.category === selectedCategory);
    }

    return articles.sort(([, a], [, b]) => a.order - b.order);
  }, [selectedCategory, searchQuery]);

  const selectedMeta = selectedArticle ? typedData.metadata[selectedArticle] : null;
  const selectedHtml = selectedArticle ? typedData.content[selectedArticle] : null;

  return (
    <div className="xp-knowledge-base" data-window-id={windowId}>
      <div className="xp-kb-sidebar">
        <div className="xp-kb-search">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="xp-kb-categories">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`xp-kb-category-item${selectedCategory === cat || (cat === 'All Articles' && !selectedCategory) ? ' xp-kb-category-active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat === 'All Articles' ? null : cat);
                setSelectedArticle(null);
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
      <div className="xp-kb-content">
        <div className="xp-kb-article-list">
          {filteredArticles.length === 0 ? (
            <div className="xp-kb-list-empty">
              {searchQuery.trim()
                ? 'No articles match your search'
                : 'No articles in this category'}
            </div>
          ) : (
            filteredArticles.map(([slug, meta], index) => (
              <div
                key={slug}
                className={`xp-kb-list-item${selectedArticle === slug ? ' xp-kb-list-item-active' : ''}${index % 2 === 1 ? ' xp-kb-list-item-alt' : ''}`}
                onClick={() => setSelectedArticle(slug)}
              >
                <div className="xp-kb-list-title">{meta.title}</div>
                <div className="xp-kb-list-category">{meta.category}</div>
                <div className="xp-kb-list-desc">{meta.description}</div>
              </div>
            ))
          )}
        </div>
        <div className="xp-kb-detail-pane">
          {!selectedMeta ? (
            <div className="xp-kb-detail-placeholder">Select an article to view</div>
          ) : (
            <div className="xp-kb-detail-content">
              <div className="xp-kb-detail-header">
                <h2 className="xp-kb-detail-title">{selectedMeta.title}</h2>
                <div className="xp-kb-detail-meta">
                  <span className="xp-kb-detail-category">{selectedMeta.category}</span>
                  <span className="xp-kb-detail-date">
                    Last updated: {selectedMeta.lastUpdated}
                  </span>
                </div>
              </div>
              <div
                className="xp-kb-detail-body"
                dangerouslySetInnerHTML={{ __html: selectedHtml ?? '' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
