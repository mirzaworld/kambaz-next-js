"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import "./components.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface AnswerEditorProps {
  courseId: string;
  postId: string;
  authorRole: "STUDENT" | "INSTRUCTOR";
  onSubmit: () => void;
  answerId?: string;
  initialContent?: string;
  mode?: "create" | "edit";
  onCancel?: () => void;
  submitLabel?: string;
}

export default function AnswerEditor({
  courseId,
  postId,
  authorRole,
  onSubmit,
  answerId,
  initialContent = "",
  mode = "create",
  onCancel,
  submitLabel,
}: AnswerEditorProps) {
  const currentUser = useSelector((state: any) => state.account?.currentUser);
  const [content, setContent] = useState(initialContent || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  useEffect(() => {
    setContent(initialContent || "");
  }, [initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter an answer");
      return;
    }

    try {
      setIsSubmitting(true);

      const isEdit = mode === "edit" || Boolean(answerId);
      const url = isEdit
        ? `${SERVER_URL}/api/courses/${courseId}/pazza/answers/${answerId}`
        : `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${postId}/answers`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          isEdit
            ? { content }
            : {
                authorId: currentUser?._id,
                authorName: `${currentUser?.firstName} ${currentUser?.lastName}`,
                authorRole,
                content,
              }
        ),
      });

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
      <ReactQuill
        value={content}
        onChange={setContent}
        theme="snow"
        placeholder="Type your answer here..."
        modules={{
          toolbar: [["bold", "italic", "underline"], ["link"], [{ list: "ordered" }, { list: "bullet" }]],
        }}
      />
      <div className="pazza-editor-actions">
        <button type="submit" className="pazza-btn-primary" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "edit" || answerId
              ? "Saving..."
              : "Posting..."
            : submitLabel || (mode === "edit" || answerId ? "Save Answer" : "Post Answer")}
        </button>
        {onCancel && (
          <button type="button" className="pazza-btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
