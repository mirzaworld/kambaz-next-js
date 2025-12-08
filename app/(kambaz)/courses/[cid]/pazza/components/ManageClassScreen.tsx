"use client";

import { useState, useEffect } from "react";
import "./components.css";

interface Folder {
  _id: string;
  name: string;
}

interface ManageClassScreenProps {
  courseId: string;
  folders: Folder[];
  currentUser: any;
  onClose: () => void;
  onFoldersUpdated: () => void;
}

export default function ManageClassScreen({
  courseId,
  folders,
  currentUser,
  onClose,
  onFoldersUpdated,
}: ManageClassScreenProps) {
  const [foldersList, setFoldersList] = useState<Folder[]>(folders);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  // Check if user has instructor privileges (faculty, admin, or ta)
  const isInstructor = ["FACULTY", "ADMIN", "TA"].includes(currentUser?.role?.toUpperCase() || "");

  // Redirect if not authorized
  useEffect(() => {
    if (!isInstructor) {
      console.warn("User is not authorized to manage class");
      onClose();
    }
  }, [isInstructor, onClose]);

  useEffect(() => {
    setFoldersList(folders);
    setSelectedFolderIds((prev) => prev.filter((id) => folders.some((f) => f._id === id)));
  }, [folders]);

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      alert("Please enter a folder name");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${SERVER_URL}/api/courses/${courseId}/pazza/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newFolderName }),
      });

      if (response.ok) {
        const newFolder = await response.json();
        setFoldersList([...foldersList, newFolder]);
        setNewFolderName("");
        onFoldersUpdated();
      }
    } catch (error) {
      console.error("Error adding folder:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (folderId: string) => {
    if (!editingFolderName.trim()) {
      alert("Please enter a folder name");
      return;
    }

    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/folders/${folderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: editingFolderName }),
        }
      );

      if (response.ok) {
        setFoldersList(
          foldersList.map((f) =>
            f._id === folderId ? { ...f, name: editingFolderName } : f
          )
        );
        setEditingFolderId(null);
        onFoldersUpdated();
      }
    } catch (error) {
      console.error("Error editing folder:", error);
    }
  };

  const handleDeleteFolders = async () => {
    if (selectedFolderIds.length === 0) {
      alert("Please select folders to delete");
      return;
    }

    if (!confirm(`Delete ${selectedFolderIds.length} folder(s)?`)) {
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/courses/${courseId}/pazza/folders`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ folderIds: selectedFolderIds }),
      });

      if (response.ok) {
        setFoldersList(
          foldersList.filter((f) => !selectedFolderIds.includes(f._id))
        );
        setSelectedFolderIds([]);
        onFoldersUpdated();
      }
    } catch (error) {
      console.error("Error deleting folders:", error);
    }
  };

  const handleToggleFolder = (folderId: string) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  return (
    <div className="pazza-modal-overlay" onClick={onClose}>
      <div className="pazza-modal pazza-manage-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pazza-modal-header">
          <h2>Manage Class Folders</h2>
          <button className="pazza-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="pazza-manage-content">
          <div className="pazza-manage-section">
            <h3>Current Folders</h3>
            <div className="pazza-folders-list">
              {foldersList.map((folder) => (
                <div key={folder._id} className="pazza-folder-item">
                  {editingFolderId === folder._id ? (
                    <div className="pazza-folder-edit">
                      <input
                        type="text"
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(folder._id)}
                        className="pazza-btn-small"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingFolderId(null)}
                        className="pazza-btn-small"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="pazza-folder-display">
                      <span>{folder.name}</span>
                      <button
                        onClick={() => {
                          setEditingFolderId(folder._id);
                          setEditingFolderName(folder.name);
                        }}
                        className="pazza-btn-small"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pazza-manage-section">
            <h3>Add Folder</h3>
            <div className="pazza-add-folder">
              <input
                type="text"
                placeholder="New folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <button
                onClick={handleAddFolder}
                className="pazza-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Folder"}
              </button>
            </div>
          </div>

          <div className="pazza-manage-section">
            <h3>Delete Folders</h3>
            <div className="pazza-delete-folders">
              {foldersList.map((folder) => (
                <label key={folder._id} className="pazza-checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedFolderIds.includes(folder._id)}
                    onChange={() => handleToggleFolder(folder._id)}
                  />
                  {folder.name}
                </label>
              ))}
            </div>
            {selectedFolderIds.length > 0 && (
              <button
                onClick={handleDeleteFolders}
                className="pazza-btn-danger"
              >
                Delete Selected Folders
              </button>
            )}
          </div>
        </div>

        <div className="pazza-modal-footer">
          <button onClick={onClose} className="pazza-btn-secondary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
