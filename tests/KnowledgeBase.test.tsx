import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import type { ComponentType } from 'react';

let KnowledgeBase: ComponentType<{ windowId: string }>;

beforeEach(async () => {
  cleanup();
  const mod = await import('@/components/apps/KnowledgeBase');
  KnowledgeBase = mod.KnowledgeBase;
});

describe('KnowledgeBase', () => {
  // ── Basic structure ───────────────────────────────────────────

  it('should render without crashing', () => {
    const { container } = render(<KnowledgeBase windowId="help" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('should have a left sidebar with category navigation', () => {
    const { container } = render(<KnowledgeBase windowId="help" />);
    const sidebar = container.querySelector('.w-56');
    expect(sidebar).toBeInTheDocument();
  });

  it('should have a search input', () => {
    render(<KnowledgeBase windowId="help" />);
    const searchInput = screen.getByPlaceholderText('Search articles...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should have a right content area', () => {
    const { container } = render(<KnowledgeBase windowId="help" />);
    const content = container.querySelector('.flex-1.flex-col');
    expect(content).toBeInTheDocument();
  });

  it('should display "All Articles" as default category', () => {
    render(<KnowledgeBase windowId="help" />);
    expect(screen.getByText('All Articles')).toBeInTheDocument();
  });

  // ── Task 3.2: Category sidebar ─────────────────────────────────

  it('should show auto-discovered categories from article metadata', () => {
    render(<KnowledgeBase windowId="help" />);
    const devops = screen.getAllByText('DevOps');
    expect(devops.length).toBeGreaterThan(0);
    expect(screen.getAllByText('Software Engineering').length).toBeGreaterThan(0);
    const ai = screen.getAllByText('AI');
    expect(ai.length).toBeGreaterThan(0);
  });

  it('should filter article list when a category is clicked', () => {
    render(<KnowledgeBase windowId="help" />);
    // Default shows all articles
    expect(screen.getByText('Docker Basics')).toBeInTheDocument();
    expect(screen.getByText('Microservices Patterns')).toBeInTheDocument();

    // Click on "AI" category (first matching element is the sidebar category)
    const aiCategories = screen.getAllByText('AI');
    fireEvent.click(aiCategories[0]);
    expect(screen.queryByText('Docker Basics')).not.toBeInTheDocument();
    expect(screen.getByText('LLM Fine-Tuning Guide')).toBeInTheDocument();
  });

  // ── Task 3.3: Article list and detail pane ────────────────────

  it('should show a placeholder when no article is selected', () => {
    render(<KnowledgeBase windowId="help" />);
    expect(screen.getByText('Select an article to view')).toBeInTheDocument();
  });

  it('should render HTML content when an article is clicked', () => {
    render(<KnowledgeBase windowId="help" />);
    fireEvent.click(screen.getByText('Docker Basics'));
    const detailPane = document.querySelector('.xp-kb-detail-body');
    expect(detailPane?.textContent).toContain('Docker is a platform');
  });

  it('should show metadata header in detail pane (title, category, date)', () => {
    render(<KnowledgeBase windowId="help" />);
    fireEvent.click(screen.getByText('Docker Basics'));
    // DevOps appears in detail pane header as a category badge
    const devopsEls = screen.getAllByText('DevOps');
    expect(devopsEls.length).toBeGreaterThan(0);
    expect(screen.getByText(/2026-05-13/)).toBeInTheDocument();
  });

  it('should have multiple article list items', () => {
    render(<KnowledgeBase windowId="help" />);
    const items = screen.getAllByText(
      /Docker Basics|Linux Essentials|CI\/CD Pipeline|Microservices Patterns|LLM Fine-Tuning Guide/,
    );
    expect(items.length).toBeGreaterThan(0);
  });

  // ── Task 3.4: Search bar ──────────────────────────────────────

  it('should filter articles in real-time by title when typing in search', () => {
    render(<KnowledgeBase windowId="help" />);
    const searchInput = screen.getByPlaceholderText('Search articles...');

    // Type to search for "Microservices"
    fireEvent.change(searchInput, { target: { value: 'Microservices' } });
    expect(screen.getByText('Microservices Patterns')).toBeInTheDocument();
    expect(screen.queryByText('Docker Basics')).not.toBeInTheDocument();
  });

  it('should show "No articles match your search" when search matches nothing', () => {
    render(<KnowledgeBase windowId="help" />);
    const searchInput = screen.getByPlaceholderText('Search articles...');

    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No articles match your search')).toBeInTheDocument();
  });

  it('should clear search to show all articles when input is empty', () => {
    render(<KnowledgeBase windowId="help" />);
    const searchInput = screen.getByPlaceholderText('Search articles...');

    // Search for something
    fireEvent.change(searchInput, { target: { value: 'Microservices' } });
    // Clear the search
    fireEvent.change(searchInput, { target: { value: '' } });
    // All articles should be visible again
    expect(screen.getByText('Docker Basics')).toBeInTheDocument();
    expect(screen.getByText('Microservices Patterns')).toBeInTheDocument();
    expect(screen.getByText('LLM Fine-Tuning Guide')).toBeInTheDocument();
  });

  it('should cross category boundaries when searching', () => {
    render(<KnowledgeBase windowId="help" />);
    const searchInput = screen.getByPlaceholderText('Search articles...');

    // First filter by AI category
    const aiCategories = screen.getAllByText('AI');
    fireEvent.click(aiCategories[0]);

    // Then search — should find matches across categories
    fireEvent.change(searchInput, { target: { value: 'Docker' } });
    expect(screen.getByText('Docker Basics')).toBeInTheDocument();
  });
});
