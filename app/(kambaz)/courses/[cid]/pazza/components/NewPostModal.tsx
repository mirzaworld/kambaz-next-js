"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Folder {
  _id: string;
  name: string;
}

interface NewPostModalProps {
  courseId: string;
  courseName?: string;
  folders?: Folder[];
  onSubmit?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  onPostCreated?: () => void;
}

export default function NewPostModal({ courseId, courseName, folders: foldersProp, onClose, onPostCreated, onSubmit, onCancel }: NewPostModalProps) {
  const currentUser = useSelector((state: any) => state.accountReducer?.currentUser);
  const [postType, setPostType] = useState<"QUESTION" | "NOTE">("QUESTION");
  const [visibility, setVisibility] = useState<"ENTIRE_CLASS" | "SELECTED_STUDENTS">("ENTIRE_CLASS");
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [folders, setFolders] = useState<Folder[]>(foldersProp || []);
  const [courseUsers, setCourseUsers] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  useEffect(() => {
    loadFolders();
    loadUsers();
  }, [courseId]);

  const loadFolders = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/courses/${courseId}/pazza/folders`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
        if (data.length > 0) {
          setSelectedFolders([data[0].name]);
        }
      }
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await fetch(`${SERVER_URL}/api/courses/${courseId}/users`, {
        credentials: "include",
      });
      if (response.ok) {
        const users = await response.json();
        const students = (users || []).filter((user: any) => user.role === "STUDENT");
        setCourseUsers(students);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleFolderToggle = (folderName: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderName) ? prev.filter((f) => f !== folderName) : [...prev, folderName]
    );
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const validateForm = (): string | null => {
    if (!currentUser) return "User not logged in";
    if (!summary.trim()) return "Summary is required";
    if (summary.length > 100) return "Summary must be 100 characters or less";
    if (!details.trim()) return "Details are required";
    if (selectedFolders.length === 0) return "Select at least one folder";
    if (visibility === "SELECTED_STUDENTS" && selectedUserIds.length === 0) {
      return "Select at least one student for limited visibility";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    try {
      setIsSubmitting(true);

      // Map FACULTY role to INSTRUCTOR for backend compatibility
      // Normalize role for API: USER -> STUDENT, FACULTY -> INSTRUCTOR
      let authorRole = currentUser.role;
      if (authorRole === "USER") authorRole = "STUDENT";
      if (authorRole === "FACULTY") authorRole = "INSTRUCTOR";

      const response = await fetch(`${SERVER_URL}/api/courses/${courseId}/pazza/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          authorId: currentUser._id,
          authorName: `${currentUser.firstName} ${currentUser.lastName}`,
          authorRole: authorRole,
          type: postType,
          summary,
          details,
          folders: selectedFolders,
          visibility,
          visibleToUserIds: visibility === "SELECTED_STUDENTS" ? selectedUserIds : [],
        }),
      });

      if (response.ok) {
        alert("Post created successfully!");
        if (onPostCreated) onPostCreated();
        if (onSubmit) onSubmit();
        if (onClose) onClose();
        if (onCancel) onCancel();
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(`Error creating post: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert(`Error creating post: ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    if (onCancel) onCancel();
  };

  return (
    <div className="pazza-modal-overlay" onClick={handleClose}>
      <div className="pazza-modal pazza-new-post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pazza-modal-header">
          <h2>New Post</h2>
          <button className="pazza-modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form className="pazza-new-post-form" onSubmit={handleSubmit}>
          {/* Post Type Section */}
          <div className="pazza-form-section">
            <label className="pazza-form-section-label">Post Type<span className="pazza-required">*</span></label>
            <div className="pazza-radio-group-horizontal">
              <label className="pazza-radio-label">
                <input
                  type="radio"
                  name="postType"
                  value="QUESTION"
                  checked={postType === "QUESTION"}
                  onChange={(e) => setPostType(e.target.value as "QUESTION" | "NOTE")}
                />
                <span className="pazza-radio-text">
                  <strong>Question</strong>
                  <span className="pazza-radio-description">if you need an answer</span>
                </span>
              </label>
              <label className="pazza-radio-label">
                <input
                  type="radio"
                  name="postType"
                  value="NOTE"
                  checked={postType === "NOTE"}
                  onChange={(e) => setPostType(e.target.value as "QUESTION" | "NOTE")}
                />
                <span className="pazza-radio-text">
                  <strong>Note</strong>
                  <span className="pazza-radio-description">if you don't need an answer</span>
                </span>
              </label>
              <label className="pazza-radio-label pazza-radio-disabled">
                <input
                  type="radio"
                  name="postType"
                  value="POLL"
                  disabled
                />
                <span className="pazza-radio-text">
                  <strong>Poll/In-Class Response</strong>
                  <span className="pazza-radio-description">if you need a vote</span>
                </span>
              </label>
            </div>
          </div>

          {/* Post To Section */}
          <div className="pazza-form-section">
            <label className="pazza-form-section-label">Post To<span className="pazza-required">*</span></label>
            <div className="pazza-radio-group-horizontal">
              <label className="pazza-radio-label">
                <input
                  type="radio"
                  name="visibility"
                  value="ENTIRE_CLASS"
                  checked={visibility === "ENTIRE_CLASS"}
                  onChange={(e) => setVisibility(e.target.value as "ENTIRE_CLASS" | "SELECTED_STUDENTS")}
                />
                <span className="pazza-radio-text">
                  <strong>Entire Class</strong>
                </span>
              </label>
              <label className="pazza-radio-label">
                <input
                  type="radio"
                  name="visibility"
                  value="SELECTED_STUDENTS"
                  checked={visibility === "SELECTED_STUDENTS"}
                  onChange={(e) => setVisibility(e.target.value as "ENTIRE_CLASS" | "SELECTED_STUDENTS")}
                />
                <span className="pazza-radio-text">
                  <strong>Individual Student(s) / Instructor(s)</strong>
                </span>
              </label>
            </div>
          </div>

          {/* Selected Students Section */}
          {visibility === "SELECTED_STUDENTS" && (
            <div className="pazza-form-section">
              <label className="pazza-form-section-label">Select Students</label>
              {isLoadingUsers ? (
                <div className="pazza-loading-message">Loading students...</div>
              ) : (
                <div className="pazza-users-checkbox-grid">
                  {courseUsers.map((user) => (
                    <label key={user._id} className="pazza-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user._id)}
                        onChange={() => handleUserToggle(user._id)}
                      />
                      <span>{user.firstName} {user.lastName}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Select Folders Section */}
          <div className="pazza-form-section">
            <label className="pazza-form-section-label">
              Select Folder(s)<span className="pazza-required">*</span>
            </label>
            <div className="pazza-folders-container">
              <div className="pazza-folders-tags">
                {folders.map((folder) => (
                  <button
                    key={folder._id}
                    type="button"
                    className={`pazza-folder-tag ${
                      selectedFolders.includes(folder.name) ? "pazza-folder-tag-selected" : ""
                    }`}
                    onClick={() => handleFolderToggle(folder.name)}
                  >
                    {folder.name}
                  </button>
                ))}
              </div>
              <a href="#" className="pazza-manage-folders-link">
                Manage and reorder folders
              </a>
            </div>
          </div>

          {/* Summary Section */}
          <div className="pazza-form-section">
            <label className="pazza-form-section-label">
              Summary<span className="pazza-required">*</span>
            </label>
            <input
              type="text"
              className="pazza-form-input"
              placeholder="Enter a one line summary, 100 characters or less"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={100}
            />
            <div className="pazza-form-helper-text">
              {summary.length}/100 characters
            </div>
          </div>

          {/* Details Section */}
          <div className="pazza-form-section">
            <label className="pazza-form-section-label">Details<span className="pazza-required">*</span></label>
            <div className="pazza-editor-tabs">
              <button type="button" className="pazza-editor-tab pazza-editor-tab-active">
                ⚪ Rich text editor
              </button>
              <button type="button" className="pazza-editor-tab">
                Plain text editor
              </button>
              <button type="button" className="pazza-editor-tab">
                Markdown editor
              </button>
            </div>
            <div className="pazza-rich-editor">
              <ReactQuill
                value={details}
                onChange={setDetails}
                theme="snow"
                placeholder="Enter post details..."
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline", "strike"],
                    [{ align: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    ["link", "image", "code-block"],
                    ["clean"],
                  ],
                }}
              />
            </div>
            <div className="pazza-editor-help">
              <button type="button" className="pazza-help-link">preview</button>
            </div>
          </div>

          {/* Posting Options Section */}
          <div className="pazza-form-section pazza-posting-options">
            <label className="pazza-form-section-label">Posting Options</label>
            <label className="pazza-checkbox-label">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
              <span>
                Send email notifications immediately (bypassing students' email preferences, if necessary)
              </span>
            </label>
            <div className="pazza-required-note">
              <span className="pazza-required">*</span> Required fields
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pazza-form-actions">
            <button
              type="submit"
              className="pazza-btn-post"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Posting..." 
                : postType === "QUESTION" 
                  ? `Post My Question to ${courseName || courseId}!` 
                  : `Post My Note to ${courseName || courseId}!`}
            </button>
            <button
              type="button"
              className="pazza-btn-draft"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Save Draft
            </button>
            <button
              type="button"
              className="pazza-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
