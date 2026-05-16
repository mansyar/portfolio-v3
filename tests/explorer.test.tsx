import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import type { ComponentType } from 'react';

let Explorer: ComponentType<{ windowId: import('@/stores/windows').WindowId }>;
let ExplorerToolbar: ComponentType<{
  onBack: () => void;
  onUp: () => void;
  canGoBack: boolean;
  canGoUp: boolean;
}>;
let ExplorerBreadcrumb: ComponentType<{
  segments: string[];
  onNavigate: (index: number) => void;
}>;
let ExplorerFileList: ComponentType<{
  path: string;
  onFileClick: (slug: string) => void;
  onFolderNavigate: (path: string) => void;
  selectedSlug: string | null;
}>;

beforeEach(async () => {
  cleanup();
  // Reset stores
  const stores = await import('@/stores/windows');
  // @ts-expect-error - intentional reset
  stores.$windows.set({});
  stores.$zCounter.set(100);
  stores.$activeWindow.set(null);
  const ExpMod = await import('@/components/apps/Explorer');
  Explorer = ExpMod.Explorer;
  const ToolbarMod = await import('@/components/apps/ExplorerToolbar');
  ExplorerToolbar = ToolbarMod.ExplorerToolbar;
  const BreadcrumbMod = await import('@/components/apps/ExplorerBreadcrumb');
  ExplorerBreadcrumb = BreadcrumbMod.ExplorerBreadcrumb;
  const FileListMod = await import('@/components/apps/ExplorerFileList');
  ExplorerFileList = FileListMod.ExplorerFileList;
});

describe('ExplorerToolbar', () => {
  it('should render back and up buttons', () => {
    render(<ExplorerToolbar onBack={() => {}} onUp={() => {}} canGoBack={false} canGoUp={false} />);
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Up')).toBeInTheDocument();
  });

  it('should disable back button when canGoBack is false', () => {
    render(<ExplorerToolbar onBack={() => {}} onUp={() => {}} canGoBack={false} canGoUp />);
    expect(screen.getByText('Back')).toBeDisabled();
    expect(screen.getByText('Up')).not.toBeDisabled();
  });

  it('should call onBack when back button clicked', () => {
    let called = false;
    render(
      <ExplorerToolbar
        onBack={() => {
          called = true;
        }}
        onUp={() => {}}
        canGoBack
        canGoUp
      />,
    );
    fireEvent.click(screen.getByText('Back'));
    expect(called).toBe(true);
  });

  it('should call onUp when up button clicked', () => {
    let called = false;
    render(
      <ExplorerToolbar
        onBack={() => {}}
        onUp={() => {
          called = true;
        }}
        canGoBack
        canGoUp
      />,
    );
    fireEvent.click(screen.getByText('Up'));
    expect(called).toBe(true);
  });
});

describe('ExplorerBreadcrumb', () => {
  it('should render path segments', () => {
    render(<ExplorerBreadcrumb segments={['C:', 'Software_Engineering']} onNavigate={() => {}} />);
    expect(screen.getByText('C:')).toBeInTheDocument();
    expect(screen.getByText('Software_Engineering')).toBeInTheDocument();
  });

  it('should call onNavigate with correct index when segment clicked', () => {
    let clickedIndex = -1;
    render(
      <ExplorerBreadcrumb
        segments={['C:', 'Software_Engineering', 'src']}
        onNavigate={(i) => {
          clickedIndex = i;
        }}
      />,
    );
    fireEvent.click(screen.getByText('Software_Engineering'));
    expect(clickedIndex).toBe(1);
  });

  it('should not render anything for empty segments', () => {
    const { container } = render(<ExplorerBreadcrumb segments={[]} onNavigate={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('ExplorerFileList', () => {
  it('should show drive icons at root path', () => {
    render(
      <ExplorerFileList
        path="\\"
        onFileClick={() => {}}
        onFolderNavigate={() => {}}
        selectedSlug={null}
      />,
    );
    // At root, we expect drive names
    expect(screen.getByText('C:')).toBeInTheDocument();
    expect(screen.getByText('D:')).toBeInTheDocument();
    expect(screen.getByText('E:')).toBeInTheDocument();
  });

  it('should show folder contents for a directory', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('explorer');
    render(
      <ExplorerFileList
        path="C:\\Software_Engineering"
        onFileClick={() => {}}
        onFolderNavigate={() => {}}
        selectedSlug={null}
      />,
    );
    expect(screen.getByText('icarus-server-manager.mdx')).toBeInTheDocument();
    expect(screen.getByText('chasing-chapters.mdx')).toBeInTheDocument();
    expect(screen.getByText('terminal-tactics.mdx')).toBeInTheDocument();
    expect(screen.getByText('simulacra.mdx')).toBeInTheDocument();
  });

  it('should show empty state for empty directory', () => {
    render(
      <ExplorerFileList
        path="Z:\\"
        onFileClick={() => {}}
        onFolderNavigate={() => {}}
        selectedSlug={null}
      />,
    );
    expect(screen.getByText('This folder is empty.')).toBeInTheDocument();
  });
});

import { ExplorerDetailPane } from '@/components/apps/ExplorerDetailPane';

describe('ExplorerDetailPane', () => {
  it('should render null when slug is null', () => {
    const { container } = render(<ExplorerDetailPane slug={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render project details for a valid slug', () => {
    render(<ExplorerDetailPane slug="icarus-server-manager" />);
    // Title appears in both header and bodyHtml — use getAllByText
    const titles = screen.getAllByText('Icarus Server Manager');
    expect(titles.length).toBeGreaterThanOrEqual(1);
    // Python appears as both language label and tech stack badge — use getAllByText
    const pythonElements = screen.getAllByText('Python');
    expect(pythonElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('PySide6')).toBeInTheDocument();
    expect(screen.getByText('View on GitHub')).toBeInTheDocument();
  });

  it('should render body HTML from projects-content.json', () => {
    render(<ExplorerDetailPane slug="icarus-server-manager" />);
    // bodyHtml content should be rendered
    expect(screen.getByText('Key Features')).toBeInTheDocument();
    expect(screen.getByText('Safe Launch')).toBeInTheDocument();
    expect(screen.getByText('Smart Backup')).toBeInTheDocument();
    expect(screen.getByText('Architecture')).toBeInTheDocument();
  });

  it('should render article details for an article slug', () => {
    render(<ExplorerDetailPane slug="docker-basics" />);
    expect(screen.getByText('Docker Basics')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
  });

  it('should render null for an unknown slug', () => {
    const { container } = render(<ExplorerDetailPane slug="nonexistent" />);
    expect(container.firstChild).toBeNull();
  });
});

describe('Projects Metadata', () => {
  it('should have metadata for all 5 projects', async () => {
    const { PROJECTS_METADATA } = await import('@/lib/projects-data');
    expect(Object.keys(PROJECTS_METADATA)).toHaveLength(5);
    expect(PROJECTS_METADATA['icarus-server-manager']).toBeDefined();
    expect(PROJECTS_METADATA['chasing-chapters']).toBeDefined();
    expect(PROJECTS_METADATA['tubular-bexus-osw']).toBeDefined();
    expect(PROJECTS_METADATA['terminal-tactics']).toBeDefined();
    expect(PROJECTS_METADATA['simulacra']).toBeDefined();
  });

  it('should have metadata for all 5 articles (renamed from DEVOPS_METADATA)', async () => {
    const { ARTICLES_METADATA } = await import('@/lib/projects-data');
    expect(Object.keys(ARTICLES_METADATA)).toHaveLength(5);
    expect(ARTICLES_METADATA['docker-basics']).toBeDefined();
    expect(ARTICLES_METADATA['linux-essentials']).toBeDefined();
    expect(ARTICLES_METADATA['ci-cd-pipeline']).toBeDefined();
    expect(ARTICLES_METADATA['microservices-patterns']).toBeDefined();
    expect(ARTICLES_METADATA['llm-fine-tuning']).toBeDefined();
  });
});

describe('Explorer (integration)', () => {
  it('should render when explorer window is open', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('explorer');
    render(<Explorer windowId="explorer" />);
    // Should render the toolbar
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Up')).toBeInTheDocument();
  });

  it('should show C: drive contents in full Explorer (default path)', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('explorer');
    render(<Explorer windowId="explorer" />);
    // Default path is C:\ so we see Software_Engineering folder
    expect(screen.getByText('Software_Engineering')).toBeInTheDocument();
  });

  it('should navigate when clicking a folder in the file list', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('explorer');
    render(<Explorer windowId="explorer" />);
    // Click on Software_Engineering folder
    fireEvent.click(screen.getByText('Software_Engineering'));
    // Should now show files inside
    expect(screen.getByText('icarus-server-manager.mdx')).toBeInTheDocument();
  });
});

describe('My Documents view', () => {
  it('should open with explorerPath = D:\\My_Documents', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('mydocs');
    const windows = stores.$windows.get();
    expect(windows.mydocs?.explorerPath).toBe('D:\\My_Documents');
  });

  it('should render Resume.pdf, Certs/, and Contact.txt in file list', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('mydocs');
    render(<Explorer windowId="mydocs" />);
    expect(screen.getByText('Resume.pdf')).toBeInTheDocument();
    expect(screen.getByText('Certs')).toBeInTheDocument();
    expect(screen.getByText('Contact.txt')).toBeInTheDocument();
  });

  it('should show "This folder is empty" when navigating into Certs/', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('mydocs');
    render(<Explorer windowId="mydocs" />);
    // Click on Certs folder
    fireEvent.click(screen.getByText('Certs'));
    expect(screen.getByText('This folder is empty.')).toBeInTheDocument();
  });

  it('should show contact metadata when clicking Contact.txt', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('mydocs');
    render(<Explorer windowId="mydocs" />);
    // Click on Contact.txt
    fireEvent.click(screen.getByText('Contact.txt'));
    // Should show contact details
    expect(screen.getByText('Muhammad Ansyar Rafi Putra')).toBeInTheDocument();
    expect(screen.getByText('Indonesia')).toBeInTheDocument();
    expect(screen.getByText('github.com/mansyar')).toBeInTheDocument();
  });

  it('should show correct breadcrumb segments for My Documents', () => {
    render(<ExplorerBreadcrumb segments={['D:', 'My_Documents']} onNavigate={() => {}} />);
    expect(screen.getByText('D:')).toBeInTheDocument();
    expect(screen.getByText('My_Documents')).toBeInTheDocument();
  });
});

describe('Recycle Bin view', () => {
  it('should open with explorerPath = \\Recycle_Bin', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('recyclebin');
    const windows = stores.$windows.get();
    expect(windows.recyclebin?.explorerPath).toBe('\\Recycle_Bin');
  });

  it('should show chasing-chapters (v1) in file list', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('recyclebin');
    render(<Explorer windowId="recyclebin" />);
    expect(screen.getByText('chasing-chapters (v1)')).toBeInTheDocument();
  });

  it('should show archive metadata when clicking a deleted item', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('recyclebin');
    render(<Explorer windowId="recyclebin" />);
    fireEvent.click(screen.getByText('chasing-chapters (v1)'));
    expect(screen.getByText('ARCHIVED')).toBeInTheDocument();
    expect(screen.getByText('Restore')).toBeInTheDocument();
    expect(screen.getByTitle('Cannot restore — Original location does not exist')).toBeDisabled();
  });

  it('should show correct breadcrumb segments for Recycle Bin', () => {
    render(<ExplorerBreadcrumb segments={['Recycle_Bin']} onNavigate={() => {}} />);
    expect(screen.getByText('Recycle_Bin')).toBeInTheDocument();
  });
});

describe('Resume.pdf click', () => {
  beforeEach(() => {
    // Mock window.open
    vi.stubGlobal('open', vi.fn());
  });

  it('should call window.open when clicking Resume.pdf', async () => {
    const stores = await import('@/stores/windows');
    stores.openWindow('mydocs');
    render(<Explorer windowId="mydocs" />);
    fireEvent.click(screen.getByText('Resume.pdf'));
    expect(window.open).toHaveBeenCalledWith('/resume.pdf', '_blank');
  });
});
