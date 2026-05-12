import { getChildren } from '@/lib/filesystem';
import type { FSNode } from '@/lib/constants';

interface ExplorerFileListProps {
  path: string;
  onFileClick: (slug: string) => void;
  selectedSlug: string | null;
}

export function ExplorerFileList({ path, onFileClick, selectedSlug }: ExplorerFileListProps) {
  const children = getChildren(path);

  if (children.length === 0) {
    return (
      <div className="xp-empty-folder" role="status">
        <span className="xp-empty-icon">📁</span>
        <span className="xp-empty-text">This folder is empty.</span>
      </div>
    );
  }

  return (
    <div className="xp-file-list" role="list" aria-label="File list">
      <table className="xp-file-table" role="grid">
        <thead>
          <tr className="xp-list-header">
            <th scope="col" className="xp-col-icon">
              Icon
            </th>
            <th scope="col" className="xp-col-name">
              Name
            </th>
            <th scope="col" className="xp-col-size">
              Size
            </th>
            <th scope="col" className="xp-col-type">
              Type
            </th>
            <th scope="col" className="xp-col-date">
              Date Modified
            </th>
          </tr>
        </thead>
        <tbody>
          {children.map((node) => (
            <FileListItem
              key={node.name}
              node={node}
              isSelected={node.type === 'file' && (node as { slug: string }).slug === selectedSlug}
              onFileClick={onFileClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FileListItem({
  node,
  isSelected,
  onFileClick,
}: {
  node: FSNode;
  isSelected: boolean;
  onFileClick: (slug: string) => void;
}) {
  const isFile = node.type === 'file';

  const handleClick = () => {
    if (isFile) {
      onFileClick((node as { slug: string }).slug);
    }
  };

  return (
    <tr
      className={`xp-file-row ${isSelected ? 'xp-file-row-selected' : ''}`}
      onClick={handleClick}
      role="row"
      aria-selected={isSelected}
    >
      <td className="xp-col-icon">
        <img
          src={isFile && node.type === 'file' ? '/icons/file.svg' : '/icons/folder.svg'}
          alt=""
          width={16}
          height={16}
          className="xp-file-icon"
        />
      </td>
      <td className="xp-col-name">
        <span className="xp-file-name">{node.name}</span>
      </td>
      <td className="xp-col-size">
        {isFile && node.type === 'file' ? ((node as { size?: string }).size ?? '—') : ''}
      </td>
      <td className="xp-col-type">
        {node.type === 'drive' ? 'Local Disk' : node.type === 'folder' ? 'File Folder' : 'MDX File'}
      </td>
      <td className="xp-col-date">—</td>
    </tr>
  );
}
