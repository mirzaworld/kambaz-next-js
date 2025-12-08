"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import "./components.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Discussion {
  _id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: "STUDENT" | "INSTRUCTOR";
  content: string;
  parentDiscussionId: string | null;
  resolved: boolean;
  createdAt: string;
  replies?: Discussion[];
}

interface DiscussionThreadProps {
  courseId: string;
  postId: string;
  discussions: Discussion[];
  currentUserId: string;
  currentUserRole: string;
  currentUserName: string;
  onDiscussionPosted: () => void;
}

export default function DiscussionThread({
  courseId,
  postId,
  discussions,
  currentUserId,
  currentUserRole,
  currentUserName,
  onDiscussionPosted,
}: DiscussionThreadProps) {
  const [newDiscussionContent, setNewDiscussionContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyContents, setReplyContents] = useState<Record<string, string>>({});
  const [editingDiscussionId, setEditingDiscussionId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  const handlePostDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      alert("You need to be signed in to post a discussion.");
      return;
    }

    if (!newDiscussionContent.trim()) {
      alert("Please enter a discussion");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${postId}/discussions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            authorId: currentUserId,
            authorName: currentUserName,
            authorRole: currentUserRole,
            content: newDiscussionContent,
          }),
        }
      );

      if (response.ok) {
        setNewDiscussionContent("");
        onDiscussionPosted();
      }
    } catch (error) {
      console.error("Error posting discussion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentDiscussionId: string) => {
    if (!currentUserId) {
      alert("You need to be signed in to reply.");
      return;
    }

    const content = replyContents[parentDiscussionId];
    if (!content || !content.trim()) {
      alert("Please enter a reply");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/discussions/${parentDiscussionId}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            authorId: currentUserId,
            authorName: currentUserName,
            authorRole: currentUserRole,
            content,
          }),
        }
      );

      if (response.ok) {
        setReplyContents((prev) => ({ ...prev, [parentDiscussionId]: "" }));
        onDiscussionPosted();
      }
    } catch (error) {
      console.error("Error replying to discussion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleResolved = async (discussionId: string, resolved: boolean) => {
    try {
      await fetch(`${SERVER_URL}/api/courses/${courseId}/pazza/discussions/${discussionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ resolved }),
      });
      onDiscussionPosted();
    } catch (error) {
      console.error("Error updating discussion:", error);
    }
  };

  const handleEditDiscussion = (discussion: Discussion) => {
    setEditingDiscussionId(discussion._id);
    setEditingContent(discussion.content);
  };

  const handleSaveDiscussion = async () => {
    if (!editingDiscussionId) return;
    if (!editingContent.trim()) {
      alert("Discussion content cannot be empty");
      return;
    }

    try {
      await fetch(`${SERVER_URL}/api/courses/${courseId}/pazza/discussions/${editingDiscussionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: editingContent }),
      });
      setEditingDiscussionId(null);
      setEditingContent("");
      onDiscussionPosted();
    } catch (error) {
      console.error("Error saving discussion:", error);
    }
  };

  const handleDeleteDiscussion = async (discussionId: string) => {
    if (!confirm("Delete this discussion and its replies?")) return;
    try {
      await fetch(`${SERVER_URL}/api/courses/${courseId}/pazza/discussions/${discussionId}`, {
        method: "DELETE",
        credentials: "include",
      });
      onDiscussionPosted();
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
  };

  const renderDiscussion = (discussion: Discussion, depth = 0) => {
    const canEdit = currentUserId === discussion.authorId || currentUserRole === "INSTRUCTOR";
    const isEditing = editingDiscussionId === discussion._id;
    const replyValue = replyContents[discussion._id] || "";

    return (
      <div key={discussion._id} className="pazza-discussion-item" style={{ marginLeft: depth * 16 }}>
        <div className="pazza-discussion-meta">
          <span className="pazza-discussion-author">
            {discussion.authorName} ({discussion.authorRole})
          </span>
          <span className="pazza-discussion-time">
            {new Date(discussion.createdAt).toLocaleString()}
          </span>
          <div className="pazza-discussion-status">
            <label>
              <input
                type="checkbox"
                checked={discussion.resolved}
                onChange={(e) => handleToggleResolved(discussion._id, e.target.checked)}
                disabled={!canEdit}
              />
              {discussion.resolved ? "✓ Resolved" : "⊘ Unresolved"}
            </label>
          </div>
        </div>

        {isEditing ? (
          <>
            <ReactQuill
              value={editingContent}
              onChange={setEditingContent}
              theme="snow"
              modules={{ toolbar: [["bold", "italic", "underline"], ["link"], [{ list: "ordered" }, { list: "bullet" }]] }}
            />
            <div className="pazza-inline-actions">
              <button className="pazza-btn-primary" onClick={handleSaveDiscussion} disabled={isSubmitting}>
                Save
              </button>
              <button className="pazza-btn-secondary" onClick={() => setEditingDiscussionId(null)}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div
            className="pazza-discussion-content"
            dangerouslySetInnerHTML={{ __html: discussion.content }}
          />
        )}

        <div className="pazza-inline-actions">
          <button
            className="pazza-btn-small"
            onClick={() => handleReplySubmit(discussion._id)}
            disabled={isSubmitting}
          >
            ↩ Reply
          </button>
          {canEdit && (
            <>
              <button className="pazza-btn-small" onClick={() => handleEditDiscussion(discussion)}>
                ✏️ Edit
              </button>
              <button
                className="pazza-btn-small pazza-btn-danger"
                onClick={() => handleDeleteDiscussion(discussion._id)}
              >
                🗑️ Delete
              </button>
            </>
          )}
        </div>

        <div className="pazza-reply-box">
          <ReactQuill
            value={replyValue}
            onChange={(value) => setReplyContents((prev) => ({ ...prev, [discussion._id]: value }))}
            theme="snow"
            placeholder="Reply to this discussion..."
            modules={{ toolbar: [["bold", "italic", "underline"], ["link"], [{ list: "ordered" }, { list: "bullet" }]] }}
          />
        </div>

        {discussion.replies && discussion.replies.length > 0 && (
          <div className="pazza-replies">
            {discussion.replies.map((reply) => renderDiscussion(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pazza-discussion-thread">
      <form className="pazza-new-discussion-form" onSubmit={handlePostDiscussion}>
        <ReactQuill
          value={newDiscussionContent}
          onChange={setNewDiscussionContent}
          theme="snow"
          placeholder="Start a new follow-up discussion..."
          modules={{
            toolbar: [
              ["bold", "italic", "underline"],
              ["link"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          }}
        />
        <div className="pazza-editor-actions">
          <button
            type="submit"
            className="pazza-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Discussion"}
          </button>
        </div>
      </form>

      <div className="pazza-discussions-list">
        {discussions.length === 0 ? (
          <div className="pazza-empty">No discussions yet</div>
        ) : (
          discussions.map((discussion) => renderDiscussion(discussion))
        )}
      </div>
    </div>
  );
}
