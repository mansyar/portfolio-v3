import { describe, it, expect, beforeEach } from 'vitest';
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
});
