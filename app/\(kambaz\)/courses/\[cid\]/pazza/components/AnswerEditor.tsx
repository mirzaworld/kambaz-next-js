/**
 * ANSWER EDITOR
 * Rich text editor for posting answers to questions
 * Used by both students and instructors
 */

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import "./components.css";

interface AnswerEditorProps {
  courseId: string;
  postId: string;
  authorRole: "STUDENT" | "INSTRUCTOR";
  onSubmit: () => void;
}

export default function AnswerEditor({
  courseId,
  postId,
  authorRole,
  onSubmit,
}: AnswerEditorProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
  const currentUser = session?.user as any;

  /**
   * Submit answer
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter an answer");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${postId}/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            authorId: currentUser?._id,
            authorName: `${currentUser?.firstName} ${currentUser?.lastName}`,
            authorRole,
            content,
          }),
        }
      );

      if (response.ok) {
        setContent("");
        onSubmit();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error posting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="pazza-answer-editor" onSubmit={handleSubmit}>
      <textarea
        className="pazza-editor-textarea"
        placeholder="Type your answer here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
      />
      <div className="pazza-editor-actions">
        <button
          type="submit"
          className="pazza-btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post Answer"}
        </button>
      </div>
    </form>
  );
}
