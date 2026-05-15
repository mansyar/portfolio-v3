import React, { useEffect, useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { CONTACT_METADATA } from '@/lib/projects-data';
import { toggleForceDesktop } from '@/stores/desktop';
import {
  $safeModeView,
  $safeModeSlug,
  setSafeModeView,
  setSafeModeSlug,
  type SafeModeView,
} from '@/stores/safe-mode';
import { setPendingPushState } from '@/stores/url-sync';
import projectsData from '@/lib/generated/projects-content.json';
import articlesData from '@/lib/generated/articles-content.json';

interface TerminalNavProps {
  onRestart?: () => void;
}

interface ProjectDataEntry {
  frontmatter: {
    title: string;
    language: string;
    stars: number;
    repoUrl: string;
    [key: string]: unknown;
  };
  bodyHtml: string;
}

interface ArticleMetadataEntry {
  title: string;
  category: string;
  lastUpdated: string;
  [key: string]: unknown;
}

type NavigationDirection = 'forward' | 'back';

/**
 * Determines whether a view transition is forward (parent → child) or back (child → parent).
 */
function getNavigationDirection(from: SafeModeView, to: SafeModeView): NavigationDirection {
  const parentChildMap: Partial<Record<SafeModeView, SafeModeView[]>> = {
    main: ['projects', 'knowledge-base', 'contact'],
    projects: ['project-detail'],
    'knowledge-base': ['article-detail'],
  };
  return (parentChildMap[from] ?? []).includes(to) ? 'forward' : 'back';
}

const TRANSITION_DURATION_MS = 250;

const TerminalNav: React.FC<TerminalNavProps> = ({ onRestart }) => {
  const currentView = useStore($safeModeView);
  const selectedId = useStore($safeModeSlug);

  const [previousView, setPreviousView] = useState<SafeModeView | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [navigatingForward, setNavigatingForward] = useState<boolean>(true);

  const projects = Object.entries(projectsData as Record<string, ProjectDataEntry>).map(
    ([slug, data]) => ({
      slug,
      ...data.frontmatter,
      bodyHtml: data.bodyHtml,
    }),
  );

  const articles = Object.entries(
    (articlesData as { metadata: Record<string, ArticleMetadataEntry> }).metadata,
  ).map(([slug, meta]) => ({
    slug,
    ...meta,
    bodyHtml: (articlesData as { content: Record<string, string> }).content[slug],
  }));

  // Determine if user prefers reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const navigateTo = useCallback(
    (view: SafeModeView) => {
      const direction = getNavigationDirection(currentView, view);
      setPreviousView(currentView);
      setNavigatingForward(direction === 'forward');
      setIsTransitioning(true);
      setPendingPushState();
      setSafeModeView(view);
    },
    [currentView],
  );

  // Clean up transition after animation completes
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(
      () => {
        setIsTransitioning(false);
        setPreviousView(null);
      },
      prefersReducedMotion ? 0 : TRANSITION_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, [currentView, isTransitioning, prefersReducedMotion]);

  // Compute CSS transition classes
  const getTransitionClass = (): string => {
    if (!isTransitioning || prefersReducedMotion) return '';
    if (navigatingForward) return 'slide-in-right';
    return 'slide-out-right slide-in-left';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentView === 'main') {
        if (e.key === '1') navigateTo('projects');
        if (e.key === '2') navigateTo('knowledge-base');
        if (e.key === '3') navigateTo('contact');
        if (e.key === '4') toggleForceDesktop();
        if (e.key === '5' && onRestart) onRestart();
      } else {
        if (e.key === '0') {
          if (currentView === 'project-detail') navigateTo('projects');
          else if (currentView === 'article-detail') navigateTo('knowledge-base');
          else navigateTo('main');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, onRestart, navigateTo]);

  const renderMain = () => (
    <div className="space-y-4">
      <h2 className="text-xl border-b border-[#00ff41] pb-2">Main Menu</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => navigateTo('projects')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [1] Projects
          </button>
        </li>
        <li>
          <button
            onClick={() => navigateTo('knowledge-base')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [2] Knowledge Base
          </button>
        </li>
        <li>
          <button
            onClick={() => navigateTo('contact')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [3] Contact
          </button>
        </li>
        <li>
          <button
            onClick={() => toggleForceDesktop()}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [4] Desktop Mode
          </button>
        </li>
        <li>
          <button
            onClick={() => onRestart?.()}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [5] Restart
          </button>
        </li>
      </ul>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      <h2 className="text-xl border-b border-[#00ff41] pb-2">Projects</h2>
      <ul className="space-y-2">
        {projects.map((p, idx) => (
          <li key={p.slug}>
            <button
              onClick={() => {
                setSafeModeSlug(p.slug);
                navigateTo('project-detail');
              }}
              className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
            >
              [{idx + 1}] {p.title}
            </button>
          </li>
        ))}
        <li className="mt-4 pt-4 border-t border-[#00ff41]">
          <button
            onClick={() => navigateTo('main')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [0] Back
          </button>
        </li>
      </ul>
    </div>
  );

  const renderKB = () => (
    <div className="space-y-4">
      <h2 className="text-xl border-b border-[#00ff41] pb-2">Knowledge Base</h2>
      <ul className="space-y-2">
        {articles.map((a, idx) => (
          <li key={a.slug}>
            <button
              onClick={() => {
                setSafeModeSlug(a.slug);
                navigateTo('article-detail');
              }}
              className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
            >
              [{idx + 1}] {a.title}
            </button>
          </li>
        ))}
        <li className="mt-4 pt-4 border-t border-[#00ff41]">
          <button
            onClick={() => navigateTo('main')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [0] Back
          </button>
        </li>
      </ul>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-4">
      <h2 className="text-xl border-b border-[#00ff41] pb-2">Contact</h2>
      <div className="space-y-2 py-2">
        <p>Name: {CONTACT_METADATA.name}</p>
        <p>Title: {CONTACT_METADATA.title}</p>
        <p>Email: {CONTACT_METADATA.email}</p>
        <p>GitHub: {CONTACT_METADATA.github}</p>
        <p>LinkedIn: {CONTACT_METADATA.linkedin}</p>
        <p>Location: {CONTACT_METADATA.location}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-[#00ff41]">
        <button
          onClick={() => navigateTo('main')}
          className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
        >
          [0] Back
        </button>
      </div>
    </div>
  );

  const renderProjectDetail = () => {
    const p = projects.find((proj) => proj.slug === selectedId);
    if (!p) return null;
    return (
      <div className="space-y-4">
        <h2 className="text-xl border-b border-[#00ff41] pb-2">{p.title}</h2>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 opacity-80 border-b border-[#00ff41]/30 pb-2">
            <p>Language: {p.language}</p>
            <p>Stars: {p.stars}</p>
            <p className="md:col-span-2">Repo: {p.repoUrl}</p>
          </div>
          <div
            className="prose prose-invert prose-green max-w-none 
              [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm 
              [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1
              [&_code]:bg-[#00ff41]/10 [&_code]:px-1 [&_pre]:p-2 [&_pre]:bg-black [&_pre]:border [&_pre]:border-[#00ff41]/20"
            dangerouslySetInnerHTML={{ __html: p.bodyHtml }}
          />
        </div>
        <div className="mt-4 pt-4 border-t border-[#00ff41]">
          <button
            onClick={() => navigateTo('projects')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [0] Back
          </button>
        </div>
      </div>
    );
  };

  const renderArticleDetail = () => {
    const a = articles.find((art) => art.slug === selectedId);
    if (!a) return null;
    return (
      <div className="space-y-4">
        <h2 className="text-xl border-b border-[#00ff41] pb-2">{a.title}</h2>
        <div className="space-y-4 py-2">
          <p className="opacity-80">
            Category: {a.category} | Updated: {a.lastUpdated}
          </p>
          <div
            className="prose prose-invert prose-green max-w-none 
              [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm 
              [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1
              [&_code]:bg-[#00ff41]/10 [&_code]:px-1 [&_pre]:p-2 [&_pre]:bg-black [&_pre]:border [&_pre]:border-[#00ff41]/20"
            dangerouslySetInnerHTML={{ __html: a.bodyHtml }}
          />
        </div>
        <div className="mt-4 pt-4 border-t border-[#00ff41]">
          <button
            onClick={() => navigateTo('knowledge-base')}
            className="hover:bg-[#00ff41] hover:text-black px-2 py-1 block w-full text-left"
          >
            [0] Back
          </button>
        </div>
      </div>
    );
  };

  const renderView = (view: SafeModeView) => {
    switch (view) {
      case 'main':
        return renderMain();
      case 'projects':
        return renderProjects();
      case 'knowledge-base':
        return renderKB();
      case 'contact':
        return renderContact();
      case 'project-detail':
        return renderProjectDetail();
      case 'article-detail':
        return renderArticleDetail();
      default:
        return null;
    }
  };

  const transitionClass = getTransitionClass();

  return (
    <div
      className={`terminal-text p-2 max-w-3xl mx-auto h-full overflow-y-auto ${transitionClass}`}
      data-testid="view-stack"
    >
      {isTransitioning && previousView && (
        <div key={`outgoing-${previousView}`} className="view-outgoing" aria-hidden="true">
          {renderView(previousView)}
        </div>
      )}
      <div key={`incoming-${currentView}`} className="view-incoming">
        {renderView(currentView)}
      </div>
    </div>
  );
};

export default TerminalNav;
