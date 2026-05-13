import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import type { ComponentType } from 'react';

let KnowledgeBase: ComponentType<{ windowId: string }>;

beforeEach(async () => {
  cleanup();
  const mod = await import('@/components/apps/KnowledgeBase');
  KnowledgeBase = mod.KnowledgeBase;
});

describe('KnowledgeBase', () => {
  it('should render without crashing', () => {
    render(<KnowledgeBase windowId="help" />);
    expect(document.querySelector('.xp-knowledge-base')).toBeInTheDocument();
  });

  it('should have a left sidebar with category navigation', () => {
    render(<KnowledgeBase windowId="help" />);
    expect(document.querySelector('.xp-kb-sidebar')).toBeInTheDocument();
  });

  it('should have a search bar in the sidebar', () => {
    render(<KnowledgeBase windowId="help" />);
    const searchInput = document.querySelector('.xp-kb-search input') as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();
  });

  it('should have a right content pane with article list and detail area', () => {
    render(<KnowledgeBase windowId="help" />);
    expect(document.querySelector('.xp-kb-content')).toBeInTheDocument();
    expect(document.querySelector('.xp-kb-article-list')).toBeInTheDocument();
    expect(document.querySelector('.xp-kb-detail-pane')).toBeInTheDocument();
  });

  it('should display "All Articles" as default category', () => {
    render(<KnowledgeBase windowId="help" />);
    expect(screen.getByText('All Articles')).toBeInTheDocument();
  });

  it('should have XP styling classes on main container', () => {
    render(<KnowledgeBase windowId="help" />);
    const container = document.querySelector('.xp-knowledge-base');
    expect(container).toHaveClass('xp-knowledge-base');
  });
});
