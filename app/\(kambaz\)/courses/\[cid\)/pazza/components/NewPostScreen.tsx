/**
 * NEW POST SCREEN
 * Modal for creating new posts (Questions or Notes)
 * Collects: type, visibility, folders, summary, details
 * Uses React Quill for rich text editing
 */

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import "./components.css";

// Dynamic import for react-quill (SSR compatibility)
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
  const { data: session } = useSession();
  const [postType, setPostType] = useState<"QUESTION" | "NOTE">("QUESTION");
  const [visibility, setVisibility] = useState<"ENTIRE_CLASS" | "SELECTED_STUDENTS">("ENTIRE_CLASS");
  const [selectedFolders, setSelectedFolders] = useState<string[]>(folders.length > 0 ? [folders[0].name] : []);
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
  const currentUser = session?.user as any;

  /**
   * Toggle folder selection
   */
  const handleFolderToggle = (folderName: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderName)
        ? prev.filter((f) => f !== folderName)
        : [...prev, folderName]
    );
  };

  /**
   * Validate form
   */
  const validateForm = (): string | null => {
    if (!summary.trim()) return "Summary is required";
    if (summary.length > 100) return "Summary must be 100 characters or less";
    if (!details.trim()) return "Details are required";
    if (selectedFolders.length === 0) return "At least one folder must be selected";
    return null;
  };

  /**
   * Submit form
   */
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
          visibleToUserIds: [],
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
          {/* Post Type Tabs */}
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

          {/* Visibility */}
          <div className="pazza-form-section">
            <label>Post To</label>
            <div className="pazza-radio-group">
              <label>
                <input
                  type="radio"
                  value="ENTIRE_CLASS"
                  checked={visibility === "ENTIRE_CLASS"}
                  onChange={(e) => setVisibility(e.target.value as any)}
                />
                Entire Class
              </label>
              <label>
                <input
                  type="radio"
                  value="SELECTED_STUDENTS"
                  checked={visibility === "SELECTED_STUDENTS"}
                  onChange={(e) => setVisibility(e.target.value as any)}
                />
                Selected Students (not implemented yet)
              </label>
            </div>
          </div>

          {/* Folders */}
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

          {/* Summary */}
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

          {/* Details */}
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

          {/* Buttons */}
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
