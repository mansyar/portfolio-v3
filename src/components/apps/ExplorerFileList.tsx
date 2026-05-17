import { memo } from 'react';
import { getChildren } from '@/lib/filesystem';
import type { FSNode } from '@/lib/constants';

interface ExplorerFileListProps {
  path: string;
  onFileClick: (slug: string) => void;
  onFolderNavigate: (path: string) => void;
  selectedSlug: string | null;
}

export const ExplorerFileList = memo(function ExplorerFileList({
  path,
  onFileClick,
  onFolderNavigate,
  selectedSlug,
}: ExplorerFileListProps) {
  const children = getChildren(path);

  if (children.length === 0) {
    return (
      <div className="xp-empty-folder" role="status">
        <span className="xp-empty-icon">📁</span>
        <span className="xp-empty-text">This folder is empty.</span>
      </div>
    );
  }

  const normalizedPath = path.endsWith('\\') ? path : path + '\\';
  const isRecycleBin = path === '\\Recycle_Bin' || path === '\\Recycle_Bin\\';

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
              parentPath={normalizedPath}
              isSelected={node.type === 'file' && (node as { slug?: string }).slug === selectedSlug}
              onFileClick={onFileClick}
              onFolderNavigate={onFolderNavigate}
              isDeleted={isRecycleBin}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

function FileListItem({
  node,
  parentPath,
  isSelected,
  onFileClick,
  onFolderNavigate,
  isDeleted = false,
}: {
  node: FSNode;
  parentPath: string;
  isSelected: boolean;
  onFileClick: (slug: string) => void;
  onFolderNavigate: (path: string) => void;
  isDeleted?: boolean;
}) {
  const isFile = node.type === 'file';
  const icon = isFile ? '/icons/file.svg' : '/icons/folder.svg';
  const typeLabel =
    isDeleted && isFile
      ? 'Deleted File'
      : node.type === 'drive'
        ? 'Local Disk'
        : node.type === 'folder'
          ? 'File Folder'
          : 'MDX File';

  const handleClick = () => {
    if (isFile) {
      onFileClick((node as { slug: string }).slug);
    } else {
      onFolderNavigate(parentPath + node.name);
    }
  };

  const rowClass = [
    'xp-file-row',
    isSelected ? 'xp-file-row-selected' : '',
    isDeleted ? 'xp-file-row-deleted' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr className={rowClass} onClick={handleClick} role="row" aria-selected={isSelected}>
      <td className="xp-col-icon">
        <img
          src={icon}
          alt=""
          width={16}
          height={16}
          className={`xp-file-icon${isDeleted ? ' xp-file-icon-deleted' : ''}`}
        />
      </td>
      <td className="xp-col-name">
        <span className={`xp-file-name${isDeleted ? ' xp-file-name-deleted' : ''}`}>
          {isDeleted ? <span className="xp-file-name-strikethrough">{node.name}</span> : node.name}
        </span>
      </td>
      <td className="xp-col-size">{isFile ? ((node as { size?: string }).size ?? '—') : ''}</td>
      <td className="xp-col-type">{typeLabel}</td>
      <td className="xp-col-date">—</td>
    </tr>
  );
}
