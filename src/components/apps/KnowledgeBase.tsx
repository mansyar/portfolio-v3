import { useState, useMemo } from 'react';

// Generated at build time by scripts/compile-articles.mjs
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
    // Main container: full-height flex row with XP Knowledge Base blue/white scheme
    <div
      role="region"
      aria-label="Knowledge Base"
      className="flex h-full font-['Tahoma','sans-serif'] text-xs"
      data-window-id={windowId}
    >
      {/* ─── Left Sidebar: Search + Categories ─── */}
      <div className="w-56 min-w-56 bg-[#d3e5fa] border-r-2 border-[#0046d5] flex flex-col overflow-hidden">
        {/* Search bar */}
        <div className="p-2 border-b border-[#b6cce0]">
          <input
            type="text"
            placeholder="Search articles..."
            aria-label="Search articles"
            role="searchbox"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2 py-1 text-xs border-2 border-[#7f9db9] bg-white
              focus:outline-none focus:border-[#0046d5] font-['Tahoma','sans-serif']"
          />
        </div>

        {/* Category list */}
        <div
          role="navigation"
          aria-label="Article categories"
          className="flex-1 overflow-y-auto py-1"
        >
          {categories.map((cat) => {
            const isActive =
              selectedCategory === cat || (cat === 'All Articles' && !selectedCategory);
            return (
              <div
                key={cat}
                role="button"
                tabIndex={0}
                className={`px-3 py-1 cursor-pointer select-none text-xs
                  ${isActive ? 'bg-[#0046d5] text-white' : 'text-black hover:bg-[#b6cce0]'}`}
                onClick={() => {
                  setSelectedCategory(cat === 'All Articles' ? null : cat);
                  setSelectedArticle(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCategory(cat === 'All Articles' ? null : cat);
                    setSelectedArticle(null);
                  }
                }}
              >
                {cat}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Right Content Pane: Article List + Detail ─── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Article list */}
        <div className="h-1/2 min-h-32 overflow-y-auto border-b-2 border-[#b6cce0]">
          {filteredArticles.length === 0 ? (
            <div className="p-4 text-center text-gray-500 italic">
              {searchQuery.trim()
                ? 'No articles match your search'
                : 'No articles in this category'}
            </div>
          ) : (
            filteredArticles.map(([slug, meta], index) => (
              <div
                key={slug}
                role="button"
                tabIndex={0}
                className={`px-3 py-2 cursor-pointer select-none border-b border-[#e0e0e0]
                  ${selectedArticle === slug ? 'bg-[#0046d5] text-white' : index % 2 === 1 ? 'bg-[#f0f4fa]' : 'bg-white'}
                  ${selectedArticle !== slug ? 'hover:bg-[#b6cce0]' : ''}`}
                onClick={() => setSelectedArticle(slug)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedArticle(slug);
                  }
                }}
              >
                <div className="font-bold text-xs">{meta.title}</div>
                <div className="text-[10px] mt-0.5 opacity-75">{meta.category}</div>
                <div className="text-[10px] mt-0.5 text-gray-600 line-clamp-2">
                  {meta.description}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail pane */}
        <div className="flex-1 overflow-y-auto p-3 bg-white">
          {!selectedMeta ? (
            <div className="p-4 text-center text-gray-500 italic">Select an article to view</div>
          ) : (
            <div className="max-w-full">
              {/* Metadata header */}
              <div className="mb-3 pb-2 border-b border-[#b6cce0]">
                <h2 className="text-sm font-bold text-[#0046d5] m-0">{selectedMeta.title}</h2>
                <div className="flex gap-2 mt-1 text-[10px] text-gray-600">
                  <span className="bg-[#0046d5] text-white px-1.5 py-0.5 text-[10px]">
                    {selectedMeta.category}
                  </span>
                  <span>Last updated: {selectedMeta.lastUpdated}</span>
                </div>
              </div>

              {/* Rendered HTML content */}
              <div
                className="xp-kb-detail-body text-xs leading-relaxed [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1
                  [&_h3]:text-xs [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1
                  [&_p]:mb-2 [&_ul]:mb-2 [&_ul]:pl-5 [&_li]:mb-0.5
                  [&_pre]:bg-[#f0f0f0] [&_pre]:p-2 [&_pre]:mb-2 [&_pre]:border [&_pre]:border-[#ccc]
                  [&_code]:text-xs [&_strong]:font-bold"
                dangerouslySetInnerHTML={{ __html: selectedHtml ?? '' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
