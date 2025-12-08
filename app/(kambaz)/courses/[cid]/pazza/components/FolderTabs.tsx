"use client";


interface Folder {
  _id: string;
  name: string;
}

interface FolderTabsProps {
  folders: Folder[];
  activeFolder: string;
  onFolderChange: (folderName: string) => void;
}

export default function FolderTabs({ folders, activeFolder, onFolderChange }: FolderTabsProps) {
  const specialFolders = ["LIVE Q&A", "Drafts"];
  const regularFolders = folders.filter((f) => !specialFolders.includes(f.name));

  return (
    <div className="pazza-folder-tabs">
      {specialFolders.map((folder) => (
        <button
          key={folder}
          className={`pazza-folder-tab ${activeFolder === folder ? "active" : ""}`}
          onClick={() => onFolderChange(folder)}
        >
          <span className="pazza-folder-icon">📁</span>
          {folder}
        </button>
      ))}

      {regularFolders.map((folder) => (
        <button
          key={folder._id}
          className={`pazza-folder-tab ${activeFolder === folder.name ? "active" : ""}`}
          onClick={() => onFolderChange(folder.name)}
        >
          <span className="pazza-folder-icon">📁</span>
          {folder.name}
        </button>
      ))}
    </div>
  );
}
