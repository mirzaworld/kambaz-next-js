"use client";

import { useEffect, useState } from "react";

interface Folder {
  _id: string;
  name: string;
}

interface ManageClassModalProps {
  courseId: string;
  folders: Folder[];
  currentUser: any;
  onClose?: () => void;
  onFoldersUpdated: () => void;
}

export default function ManageClassModal({
  courseId,
  folders,
  currentUser,
  onClose,
  onFoldersUpdated,
}: ManageClassModalProps) {
  const [foldersList, setFoldersList] = useState<Folder[]>(folders);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  // Update folders list when parent passes new folders
  useEffect(() => {
    setFoldersList(folders);
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
      } else {
        const error = await response.json();
        alert(`Error creating folder: ${error.error || response.statusText}`);
      }
    } catch (error) {
      console.error("Error adding folder:", error);
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Delete this folder?")) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/folders/${folderId}`,
        { method: "DELETE", credentials: "include" }
      );

      if (response.ok) {
        setFoldersList(foldersList.filter((f) => f._id !== folderId));
        onFoldersUpdated();
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFolder = async (folderId: string) => {
    if (!editingFolderName.trim()) {
      alert("Please enter a folder name");
      return;
    }

    try {
      setIsSubmitting(true);
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
        setEditingFolderName("");
        onFoldersUpdated();
      }
    } catch (error) {
      console.error("Error editing folder:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncWithAssignments = async () => {
    if (!confirm("Sync folders with course assignments? This will create folders for each assignment.")) {
      return;
    }

    try {
      setIsSyncing(true);
      
      const syncResponse = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/sync-assignments`,
        { 
          method: "POST",
          credentials: "include" 
        }
      );
      
      if (!syncResponse.ok) {
        const error = await syncResponse.json();
        alert(`Failed to sync assignments: ${error.error || syncResponse.statusText}`);
        return;
      }

      const createdFolders = await syncResponse.json();
      
      if (createdFolders.length === 0) {
        alert("No new assignments to sync or all already exist as folders");
        onFoldersUpdated();
        return;
      }

      alert(`Successfully created ${createdFolders.length} folder(s) from assignments!`);
      onFoldersUpdated();
      
    } catch (error) {
      console.error("Error syncing folders with assignments:", error);
      alert(`Failed to sync folders with assignments: ${(error as Error).message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="pazza-manage-class-page">
      {/* Single Sub-tab for Manage Folders */}
      <div className="pazza-manage-subtabs">
        <button className="pazza-subtab active">
          Manage Folders
        </button>
      </div>

      <div className="pazza-manage-class-container">
        {/* Header Section */}
        <div className="pazza-manage-class-header">
          <h2>Configure Class Folders</h2>
          <p>Folders allow you to keep your class content organized. When students and instructors add a new post, they will be required to specify at least one folder for that post.</p>
        </div>

        {/* Create New Folders Section - right aligned */}
        <div className="pazza-manage-section" style={{ display: 'flex', alignItems: 'flex-end', gap: '32px' }}>
          <div style={{ flex: 1 }}>
            <h3>Create new folders:</h3>
            <div className="pazza-create-folder-controls">
              <input
                type="text"
                placeholder="Add a folder"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddFolder();
                  }
                }}
                disabled={isSubmitting}
                className="pazza-folder-input"
              />
              <button 
                onClick={handleAddFolder} 
                disabled={isSubmitting}
                className="pazza-add-folder-btn"
              >
                Add Folder
              </button>
            </div>
          </div>
        </div>

        {/* No extra section here - removed idle Cancel and sync checkbox */}

        {/* Manage Folders Section */}
        <div className="pazza-manage-section">
          <h3>Manage folders:</h3>
          
          {foldersList.length === 0 ? (
            <p className="pazza-no-folders">No folders yet</p>
          ) : (
            <div className="pazza-folders-table">
              {foldersList.map((folder) => (
                <div key={folder._id} className="pazza-folder-row" style={{gridTemplateColumns: '32px 1fr auto'}}>
                  {/* Checkbox for selection */}
                  <input
                    type="checkbox"
                    checked={selectedFolders.includes(folder._id)}
                    onChange={() => handleSelectFolder(folder._id)}
                    style={{marginRight: 8}}
                  />
                  {editingFolderId === folder._id ? (
                    <div className="pazza-folder-edit-row" style={{width: '100%'}}>
                      <input
                        type="text"
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        disabled={isSubmitting}
                        autoFocus
                        className="pazza-folder-edit-input"
                      />
                      <div className="pazza-folder-actions">
                        <button
                          onClick={() => handleEditFolder(folder._id)}
                          disabled={isSubmitting}
                          className="pazza-edit-action"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingFolderId(null);
                            setEditingFolderName("");
                          }}
                          disabled={isSubmitting}
                          className="pazza-cancel-action"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="pazza-folder-name-row">
                        <span className="pazza-folder-icon">≡</span>
                        <span className="pazza-folder-name">{folder.name}</span>
                      </div>
                      <div className="pazza-folder-actions">
                        <button
                          onClick={() => {
                            setEditingFolderId(folder._id);
                            setEditingFolderName(folder.name);
                          }}
                          disabled={isSubmitting}
                          className="pazza-edit-action"
                        >
                          ✎ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(folder._id)}
                          disabled={isSubmitting}
                          className="pazza-delete-action"
                        >
                          ✕ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pazza-manage-info">
            <h4>How do folders work?</h4>
            <p>
              Folders are a way of keeping your class content organized. They can only be created by instructors
              and by default are mandatory at the time of asking a new question. You, as an instructor, can create,
              edit or delete folders, as well as disable folders altogether.
            </p>
          </div>
        </div>

        {/* Sync Assignments Button */}
        <div className="pazza-sync-section">
          <button 
            onClick={handleSyncWithAssignments} 
            disabled={isSyncing || isSubmitting}
            className="pazza-sync-assignments-btn"
          >
            {isSyncing ? "Syncing..." : "📋 Sync Folders from Course Assignments"}
          </button>
        </div>
      </div>
    </div>
  );
}
