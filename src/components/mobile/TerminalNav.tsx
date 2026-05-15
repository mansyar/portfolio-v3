import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
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

const TRANSITION_DURATION_MS = 250;

const TerminalNav: React.FC<TerminalNavProps> = ({ onRestart }) => {
  const currentView = useStore($safeModeView);
  const selectedId = useStore($safeModeSlug);

  const [previousView, setPreviousView] = useState<SafeModeView | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  // Determine if user prefers reduced motion (cached via useMemo, unchanged during session)
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const navigateTo = useCallback(
    (view: SafeModeView) => {
      setPreviousView(currentView);
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
    return 'crossfade';
  };

  // Swipe gesture state (refs to avoid re-renders)
  const viewStackRef = useRef<HTMLDivElement>(null);
  const touchState = useRef({
    startX: 0,
    startY: 0,
    currentX: 0,
    isSwiping: false,
    lastOpacity: '',
  });

  // Swipe gesture handler (separate effect from keyboard for clean subscriptions)
  useEffect(() => {
    const el = viewStackRef.current;
    if (!el) return;

    // Compute the "back" view for the current view
    const getBackView = (): SafeModeView => {
      switch (currentView) {
        case 'projects':
        case 'contact':
          return 'main';
        case 'knowledge-base':
          return 'main';
        case 'project-detail':
          return 'projects';
        case 'article-detail':
          return 'knowledge-base';
        default:
          return 'main';
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchState.current.startX = touch.clientX;
      touchState.current.startY = touch.clientY;
      touchState.current.currentX = touch.clientX;
      // Only detect gesture if touch starts within 40px of the left edge
      touchState.current.isSwiping = touch.clientX <= 40;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchState.current.isSwiping) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchState.current.startX;
      const deltaY = touch.clientY - touchState.current.startY;

      // If mostly vertical, cancel the swipe (scrolling)
      if (Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
        touchState.current.isSwiping = false;
        el.style.opacity = touchState.current.lastOpacity;
        return;
      }

      // Only track rightward drag
      if (deltaX <= 0) return;

      touchState.current.currentX = touch.clientX;
      // Compute opacity: linear decrease from 1.0 at 0px drag to 0 at viewport width
      const maxDrag = window.innerWidth || 375;
      const opacity = Math.max(0, Math.min(1, 1 - deltaX / maxDrag));
      touchState.current.lastOpacity = el.style.opacity;
      el.style.opacity = String(opacity);
    };

    const handleTouchEnd = () => {
      if (!touchState.current.isSwiping) return;
      const deltaX = touchState.current.currentX - touchState.current.startX;

      if (deltaX > 80) {
        // Commit: navigate back instantly (no crossfade transition)
        touchState.current.isSwiping = false;
        el.style.opacity = '';
        const backView = getBackView();
        setPendingPushState();
        setSafeModeView(backView);
      } else {
        // Cancel: snap opacity back to 1.0
        touchState.current.isSwiping = false;
        el.style.transition = 'opacity 150ms ease-out';
        el.style.opacity = '1';
        // Clean up the transition after animation
        setTimeout(() => {
          el.style.transition = '';
        }, 160);
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentView]);

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
      ref={viewStackRef}
      className={`terminal-text p-2 max-w-3xl mx-auto h-full overflow-y-auto ${transitionClass}`}
      data-testid="view-stack"
    >
      {isTransitioning && previousView && (
        <div
          key={`outgoing-${previousView}`}
          className="view-outgoing content-dimming"
          aria-hidden="true"
        >
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
