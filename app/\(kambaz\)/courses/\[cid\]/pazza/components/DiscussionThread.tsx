/**
 * DISCUSSION THREAD
 * Displays follow-up discussions with nested replies
 * Allows posting new discussions and replies
 */

"use client";

import { useState } from "react";
import "./components.css";

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
}

interface DiscussionThreadProps {
  courseId: string;
  postId: string;
  discussions: Discussion[];
  currentUserId: string;
  currentUserRole: string;
  onDiscussionPosted: () => void;
}

export default function DiscussionThread({
  courseId,
  postId,
  discussions,
  currentUserId,
  currentUserRole,
  onDiscussionPosted,
}: DiscussionThreadProps) {
  const [newDiscussionContent, setNewDiscussionContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  /**
   * Post new discussion
   */
  const handlePostDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();

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
            authorName: "User", // Should come from session
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

  return (
    <div className="pazza-discussion-thread">
      {/* Post New Discussion Form */}
      <form className="pazza-new-discussion-form" onSubmit={handlePostDiscussion}>
        <textarea
          className="pazza-editor-textarea"
          placeholder="Start a new follow-up discussion..."
          value={newDiscussionContent}
          onChange={(e) => setNewDiscussionContent(e.target.value)}
          rows={3}
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

      {/* Discussions List */}
      <div className="pazza-discussions-list">
        {discussions.length === 0 ? (
          <div className="pazza-empty">No discussions yet</div>
        ) : (
          discussions.map((discussion) => (
            <div key={discussion._id} className="pazza-discussion-item">
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
                      readOnly
                    />
                    {discussion.resolved ? "✓ Resolved" : "⊘ Unresolved"}
                  </label>
                </div>
              </div>
              <div
                className="pazza-discussion-content"
                dangerouslySetInnerHTML={{ __html: discussion.content }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
