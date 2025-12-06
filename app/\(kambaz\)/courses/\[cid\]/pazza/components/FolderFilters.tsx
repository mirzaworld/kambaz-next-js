/**
 * FOLDER FILTERS
 * Displays folder buttons that allow filtering posts by category
 * Only one folder can be selected at a time
 * Selected folder appears highlighted
 */

"use client";

import "./components.css";

interface Folder {
  _id: string;
  name: string;
}

interface FolderFiltersProps {
  folders: Folder[];
  selectedFolder: string;
  onFolderChange: (folderName: string) => void;
}

export default function FolderFilters({
  folders,
  selectedFolder,
  onFolderChange,
}: FolderFiltersProps) {
  return (
    <div className="pazza-folder-filters">
      {folders.map((folder) => (
        <button
          key={folder._id}
          className={`pazza-folder-btn ${selectedFolder === folder.name ? "active" : ""}`}
          onClick={() => onFolderChange(folder.name)}
        >
          {folder.name}
        </button>
      ))}
    </div>
  );
}
