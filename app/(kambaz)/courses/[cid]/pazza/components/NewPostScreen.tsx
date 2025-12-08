"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import "./components.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Folder {
  _id: string;
  name: string;
}

interface NewPostScreenProps {
  courseId: string;
  folders: Folder[];
  onSubmit: () => void;
  onCancel: () => void;
}

export default function NewPostScreen({
  courseId,
  folders,
  onSubmit,
  onCancel,
}: NewPostScreenProps) {
  const currentUser = useSelector((state: any) => state.account?.currentUser);
  const [postType, setPostType] = useState<"QUESTION" | "NOTE">("QUESTION");
  const [visibility, setVisibility] = useState<"ENTIRE_CLASS" | "SELECTED_STUDENTS">("ENTIRE_CLASS");
  const [selectedFolders, setSelectedFolders] = useState<string[]>(folders.length > 0 ? [folders[0].name] : []);
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseUsers, setCourseUsers] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  useEffect(() => {
    if (selectedFolders.length === 0 && folders.length > 0) {
      setSelectedFolders([folders[0].name]);
    }
  }, [folders]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const response = await fetch(`${SERVER_URL}/api/courses/${courseId}/users`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Unable to load course roster");
        }
        const users = await response.json();
        const students = (users || []).filter((user: any) => user.role === "STUDENT");
        setCourseUsers(students);
      } catch (error: any) {
        setUsersError(error.message || "Failed to load students");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, [courseId]);

  const handleVisibilityChange = (value: "ENTIRE_CLASS" | "SELECTED_STUDENTS") => {
    setVisibility(value);
    if (value === "ENTIRE_CLASS") {
      setSelectedUserIds([]);
    }
  };

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleFolderToggle = (folderName: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderName)
        ? prev.filter((f) => f !== folderName)
        : [...prev, folderName]
    );
  };

  const validateForm = (): string | null => {
    if (!summary.trim()) return "Summary is required";
    if (summary.length > 100) return "Summary must be 100 characters or less";
    if (!details.trim()) return "Details are required";
    if (selectedFolders.length === 0) return "At least one folder must be selected";
    if (visibility === "SELECTED_STUDENTS" && selectedUserIds.length === 0)
      return "Select at least one student for limited visibility";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${SERVER_URL}/api/courses/${courseId}/pazza/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          authorId: currentUser?._id,
          authorName: `${currentUser?.firstName} ${currentUser?.lastName}`,
          authorRole: currentUser?.role,
          type: postType,
          summary,
          details,
          folders: selectedFolders,
          visibility,
          visibleToUserIds: visibility === "SELECTED_STUDENTS" ? selectedUserIds : [],
        }),
      });

      if (response.ok) {
        onSubmit();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error posting:", error);
      alert("Error posting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pazza-modal-overlay" onClick={onCancel}>
      <div className="pazza-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pazza-modal-header">
          <h2>Create New Post</h2>
          <button className="pazza-modal-close" onClick={onCancel}>×</button>
        </div>

        <form className="pazza-new-post-form" onSubmit={handleSubmit}>
          <div className="pazza-form-section">
            <label>Post Type</label>
            <div className="pazza-tabs">
              <button
                type="button"
                className={`pazza-tab ${postType === "QUESTION" ? "active" : ""}`}
                onClick={() => setPostType("QUESTION")}
              >
                Question
              </button>
              <button
                type="button"
                className={`pazza-tab ${postType === "NOTE" ? "active" : ""}`}
                onClick={() => setPostType("NOTE")}
              >
                Note
              </button>
            </div>
          </div>

          <div className="pazza-form-section">
            <label>Post To</label>
            <div className="pazza-radio-group">
              <label>
                <input
                  type="radio"
                  value="ENTIRE_CLASS"
                  checked={visibility === "ENTIRE_CLASS"}
                  onChange={(e) => handleVisibilityChange(e.target.value as any)}
                />
                Entire Class
              </label>
              <label>
                <input
                  type="radio"
                  value="SELECTED_STUDENTS"
                  checked={visibility === "SELECTED_STUDENTS"}
                  onChange={(e) => handleVisibilityChange(e.target.value as any)}
                />
                Selected Students
              </label>
            </div>
          </div>

          {visibility === "SELECTED_STUDENTS" && (
            <div className="pazza-form-section">
              <label>Select Students</label>
              {isLoadingUsers ? (
                <div className="pazza-loading">Loading students...</div>
              ) : usersError ? (
                <div className="pazza-error">{usersError}</div>
              ) : courseUsers.length === 0 ? (
                <div className="pazza-empty">No students enrolled yet.</div>
              ) : (
                <div className="pazza-checkbox-group pazza-users-list">
                  {courseUsers.map((user) => (
                    <label key={user._id}>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user._id)}
                        onChange={() => handleToggleUser(user._id)}
                      />
                      {user.firstName} {user.lastName}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pazza-form-section">
            <label>Select Folders (at least 1)</label>
            <div className="pazza-checkbox-group">
              {folders.map((folder) => (
                <label key={folder._id}>
                  <input
                    type="checkbox"
                    checked={selectedFolders.includes(folder.name)}
                    onChange={() => handleFolderToggle(folder.name)}
                  />
                  {folder.name}
                </label>
              ))}
            </div>
          </div>

          <div className="pazza-form-section">
            <label>Summary (max 100 characters)</label>
            <input
              type="text"
              className="pazza-form-input"
              placeholder="Enter a one-line summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={100}
            />
            <div className="pazza-char-count">{summary.length}/100</div>
          </div>

          <div className="pazza-form-section">
            <label>Details</label>
            <ReactQuill
              value={details}
              onChange={setDetails}
              theme="snow"
              placeholder="Enter post details..."
              modules={{
                toolbar: [
                  ["bold", "italic", "underline"],
                  ["link"],
                  [{ list: "ordered" }, { list: "bullet" }],
                ],
              }}
            />
          </div>

          <div className="pazza-form-actions">
            <button
              type="submit"
              className="pazza-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : `Post My ${postType === "QUESTION" ? "Question" : "Note"}`}
            </button>
            <button
              type="button"
              className="pazza-btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
