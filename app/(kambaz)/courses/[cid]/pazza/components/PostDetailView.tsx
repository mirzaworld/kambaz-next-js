"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Post {
  _id: string;
  summary: string;
  details: string;
  type: "QUESTION" | "NOTE";
  authorName: string;
  authorRole: "STUDENT" | "USER" | "INSTRUCTOR" | "FACULTY" | "TA" | "ADMIN";
  authorId: string;
  folders: string[];
  viewCount: number;
  hasStudentAnswer: boolean;
  hasInstructorAnswer: boolean;
  createdAt: string;
  updatedAt?: string;
  goodQuestionCount?: number;
  goodQuestionBy?: string[];
  isPinned: boolean;
  visibility: "ENTIRE_CLASS" | "SELECTED_STUDENTS";
  visibleToUserIds?: string[];
}

interface Answer {
  _id: string;
  content: string;
  authorName: string;
  authorRole: "STUDENT" | "USER" | "INSTRUCTOR" | "FACULTY" | "TA" | "ADMIN";
  authorId: string;
  createdAt: string;
  updatedAt?: string;
  goodAnswerCount?: number;
  goodAnswerBy?: string[];
}

interface Discussion {
  _id: string;
  content: string;
  authorName: string;
  authorRole: "STUDENT" | "USER" | "INSTRUCTOR" | "FACULTY" | "TA" | "ADMIN";
  authorId: string;
  parentDiscussionId: string | null;
  resolved: boolean;
  createdAt: string;
  updatedAt?: string;
  replies?: Discussion[];
  helpfulCount?: number;
  helpfulBy?: string[];
}

interface PostDetailViewProps {
  selectedPost: Post | null;
  courseId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentUser: any;
  onPostDeleted: () => void;
  onPostUpdated: (updated?: Partial<Post> & { _id?: string }) => void;
}

function formatEdited(createdAt?: string, updatedAt?: string) {
  if (!updatedAt || !createdAt) return null;
  if (new Date(updatedAt).getTime() === new Date(createdAt).getTime()) return null;
  return `edited • ${new Date(updatedAt).toLocaleString()}`;
}

export default function PostDetailView({
  selectedPost,
  courseId,
  currentUser,
  onPostDeleted,
  onPostUpdated,
}: PostDetailViewProps) {
  // Helper to format role for display
  const formatRoleDisplay = (role: string) => {
    // Normalize USER and STUDENT to "STUDENT" for display
    if (role === "USER" || role === "STUDENT") return "STUDENT";
    // Display other roles as-is
    return role;
  };

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [postMeta, setPostMeta] = useState<Partial<Post>>({});

  const [showStudentEditor, setShowStudentEditor] = useState(false);
  const [showInstructorEditor, setShowInstructorEditor] = useState(false);
  const [studentAnswerContent, setStudentAnswerContent] = useState("");
  const [instructorAnswerContent, setInstructorAnswerContent] = useState("");
  const [studentEditorMode, setStudentEditorMode] = useState("rich"); // rich, plain, markdown
  const [instructorEditorMode, setInstructorEditorMode] = useState("rich"); // rich, plain, markdown
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);

  const [newDiscussionContent, setNewDiscussionContent] = useState("");
  const [replyToDiscussion, setReplyToDiscussion] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  const [editingPost, setEditingPost] = useState(false);
  const [editPostSummary, setEditPostSummary] = useState("");
  const [editPostDetails, setEditPostDetails] = useState("");

  const [editingDiscussionId, setEditingDiscussionId] = useState<string | null>(null);
  const [editDiscussionContent, setEditDiscussionContent] = useState("");

  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");
  const [votedPosts, setVotedPosts] = useState<Set<string>>(new Set());
  const [votedAnswers, setVotedAnswers] = useState<Set<string>>(new Set());
  const [votedDiscussions, setVotedDiscussions] = useState<Set<string>>(new Set());

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  const isInstructor = useMemo(
    () => currentUser?.role === "INSTRUCTOR" || currentUser?.role === "FACULTY",
    [currentUser]
  );
  const isAuthor = useMemo(
    () => currentUser?._id && selectedPost?._id && currentUser._id === selectedPost.authorId,
    [currentUser, selectedPost]
  );

    const effectivePost = useMemo(() => {
      if (!selectedPost) return null;
      return { ...selectedPost, ...postMeta } as Post;
    }, [selectedPost, postMeta]);

    const questionNumber = useMemo(() => {
      if (!effectivePost?._id) return 1;
      const hashSource = effectivePost._id.replace(/[^a-zA-Z0-9]/g, "");
      const hash = Math.abs(
        hashSource.split("").reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 7)
      );
      return (hash % 10000000) + 1;
    }, [effectivePost?._id]);

    const questionHandle = useMemo(() => {
      if (!effectivePost?._id) return "";
      return effectivePost._id.slice(-3).toLowerCase();
    }, [effectivePost?._id]);

    const primaryTimestamp = useMemo(() => {
      if (!effectivePost) return null;
      const hasEdit = effectivePost.updatedAt && new Date(effectivePost.updatedAt).getTime() !== new Date(effectivePost.createdAt).getTime();
      const ts = hasEdit ? effectivePost.updatedAt : effectivePost.createdAt;
      return {
        label: hasEdit ? "edited" : "created",
        text: new Date(ts as string).toLocaleString(),
      };
    }, [effectivePost]);

  useEffect(() => {
    if (selectedPost) {
      loadPostContent();
      setEditingPost(false);
      setShowActionsMenu(null);
      setEditingAnswerId(null);
      setEditingDiscussionId(null);
      setEditingReplyId(null);
      setShowStudentEditor(false);
      setShowInstructorEditor(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPost?._id]);

  const loadPostContent = async () => {
    if (!effectivePost) return;
    try {
      setIsLoading(true);

      // Fetch the post itself to get updated flags (hasInstructorAnswer, hasStudentAnswer)
      const postResponse = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${effectivePost._id}`,
        { credentials: "include" }
      );
      if (postResponse.ok) {
        const updatedPost = await postResponse.json();
        // Update the post metadata with latest flags
        setPostMeta((prev) => ({
          ...prev,
          hasInstructorAnswer: updatedPost.hasInstructorAnswer,
          hasStudentAnswer: updatedPost.hasStudentAnswer,
        }));
        // Also notify parent component to update the post in the list
        onPostUpdated({
          _id: effectivePost._id,
          hasInstructorAnswer: updatedPost.hasInstructorAnswer,
          hasStudentAnswer: updatedPost.hasStudentAnswer,
        });
      }

      const answersResponse = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${effectivePost._id}/answers`,
        { credentials: "include" }
      );
      if (answersResponse.ok) {
        const answersData = await answersResponse.json();
        setAnswers(answersData || []);
      }

      const discussionsResponse = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${effectivePost._id}/discussions`,
        { credentials: "include" }
      );
      if (discussionsResponse.ok) {
        const discussionsData = await discussionsResponse.json();
        setDiscussions(discussionsData || []);
      }
    } catch (error) {
      console.error("Error loading post content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePin = async () => {
    if (!effectivePost) return;
    try {
      const endpoint = effectivePost.isPinned 
        ? `${SERVER_URL}/api/courses/${courseId}/pazza/posts/unpin`
        : `${SERVER_URL}/api/courses/${courseId}/pazza/posts/pin`;
      
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postIds: [effectivePost._id] }),
      });
      
      if (response.ok) {
        const newPinnedState = !effectivePost.isPinned;
        setPostMeta((prev) => ({ ...prev, isPinned: newPinnedState }));
        onPostUpdated({ _id: effectivePost._id, isPinned: newPinnedState });
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const handleToggleLock = async () => {
    if (!effectivePost) return;
    try {
      const newVisibility = effectivePost.visibility === "ENTIRE_CLASS" 
        ? "SELECTED_STUDENTS" 
        : "ENTIRE_CLASS";
      
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${effectivePost._id}/visibility`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ 
            visibility: newVisibility,
            visibleToUserIds: newVisibility === "SELECTED_STUDENTS" ? [effectivePost.authorId] : []
          }),
        }
      );
      
      if (response.ok) {
        setPostMeta((prev) => ({ ...prev, visibility: newVisibility }));
        onPostUpdated({ _id: effectivePost._id, visibility: newVisibility });
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleToggleGoodQuestion = async () => {
    if (!effectivePost || !currentUser) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${effectivePost._id}/good-question`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        const updated = await response.json();
        setVotedPosts(prev => {
          const newSet = new Set(prev);
          if ((updated.goodQuestionBy || []).includes(currentUser._id)) {
            newSet.add(effectivePost._id);
          } else {
            newSet.delete(effectivePost._id);
          }
          return newSet;
        });
        setPostMeta((prev) => ({
          ...prev,
          goodQuestionCount: updated.goodQuestionCount,
          goodQuestionBy: updated.goodQuestionBy,
        }));
        onPostUpdated({
          _id: effectivePost._id,
          goodQuestionCount: updated.goodQuestionCount,
          goodQuestionBy: updated.goodQuestionBy,
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleToggleGoodAnswer = async (answerId: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/answers/${answerId}/good-answer`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        const updated = await response.json();
        setVotedAnswers(prev => {
          const newSet = new Set(prev);
          if ((updated.goodAnswerBy || []).includes(currentUser._id)) {
            newSet.add(answerId);
          } else {
            newSet.delete(answerId);
          }
          return newSet;
        });
        loadPostContent();
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleToggleHelpful = async (discussionId: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/discussions/${discussionId}/helpful`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        const updated = await response.json();
        setVotedDiscussions(prev => {
          const newSet = new Set(prev);
          if ((updated.helpfulBy || []).includes(currentUser._id)) {
            newSet.add(discussionId);
          } else {
            newSet.delete(discussionId);
          }
          return newSet;
        });
        loadPostContent();
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleSubmitStudentAnswer = async () => {
    if (!studentAnswerContent.trim() || !effectivePost || !currentUser) return;
    try {
      // If editing, update existing answer; otherwise create a new one
      const isEditing = Boolean(editingAnswerId);
      const endpoint = isEditing
        ? `${SERVER_URL}/api/courses/${courseId}/pazza/answers/${editingAnswerId}`
        : `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${effectivePost._id}/answers`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: studentAnswerContent,
          authorId: currentUser._id,
          authorName: `${currentUser.firstName} ${currentUser.lastName}`,
          authorRole: "STUDENT",
        }),
      });

      if (response.ok) {
        setStudentAnswerContent("");
        setShowStudentEditor(false);
        setEditingAnswerId(null);
        loadPostContent();
      }
    } catch (error) {
      console.error("Error submitting student answer:", error);
    }
  };

  const handleSubmitInstructorAnswer = async () => {
    if (!instructorAnswerContent.trim() || !effectivePost || !currentUser) {
      console.warn("Submit blocked:", { content: instructorAnswerContent.trim(), selectedPost: !!effectivePost, currentUser: !!currentUser });
      return;
    }
    try {
      // If editing, update existing answer; otherwise create a new one
      const isEditing = Boolean(editingAnswerId);
      const endpoint = isEditing
        ? `${SERVER_URL}/api/courses/${courseId}/pazza/answers/${editingAnswerId}`
        : `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${effectivePost._id}/answers`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: instructorAnswerContent,
          authorId: currentUser._id,
          authorName: `${currentUser.firstName} ${currentUser.lastName}`,
          authorRole: "INSTRUCTOR",
        }),
      });
      console.log("Instructor answer response:", response.status, response.ok);
      if (response.ok) {
        setInstructorAnswerContent("");
        setShowInstructorEditor(false);
        setEditingAnswerId(null);
        loadPostContent();
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
      }
    } catch (error) {
      console.error("Error submitting instructor answer:", error);
    }
  };

  const handleSubmitDiscussion = async () => {
    if (!newDiscussionContent.trim() || !effectivePost || !currentUser) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${effectivePost._id}/discussions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            content: newDiscussionContent,
            authorId: currentUser._id,
            authorName: `${currentUser.firstName} ${currentUser.lastName}`,
            authorRole: currentUser.role === "FACULTY" ? "INSTRUCTOR" : (currentUser.role === "USER" ? "STUDENT" : currentUser.role),
          }),
        }
      );
      if (response.ok) {
        setNewDiscussionContent("");
        loadPostContent();
      }
    } catch (error) {
      console.error("Error submitting discussion:", error);
    }
  };

  const handleSubmitReply = async (discussionId: string) => {
    if (!replyContent.trim() || !effectivePost || !currentUser) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/discussions/${discussionId}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            content: replyContent,
            authorId: currentUser._id,
            authorName: `${currentUser.firstName} ${currentUser.lastName}`,
            authorRole: currentUser.role === "FACULTY" ? "INSTRUCTOR" : (currentUser.role === "USER" ? "STUDENT" : currentUser.role),
          }),
        }
      );
      if (response.ok) {
        setReplyContent("");
        setReplyToDiscussion(null);
        loadPostContent();
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!effectivePost || !confirm("Delete this answer?")) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/answers/${answerId}`,
        { method: "DELETE", credentials: "include" }
      );
      if (response.ok) {
        loadPostContent();
        onPostUpdated();
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!effectivePost || !confirm("Delete this post?")) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${effectivePost._id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (response.ok) {
        setShowActionsMenu(null);
        onPostDeleted();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleToggleResolved = async (discussionId: string, currentResolved: boolean) => {
    if (!effectivePost) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/discussions/${discussionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ resolved: !currentResolved }),
        }
      );
      if (response.ok) {
        loadPostContent();
      }
    } catch (error) {
      console.error("Error toggling resolved:", error);
    }
  };

  const handleDeleteDiscussion = async (discussionId: string) => {
    if (!effectivePost || !confirm("Delete this discussion?")) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/discussions/${discussionId}`,
        { method: "DELETE", credentials: "include" }
      );
      if (response.ok) {
        loadPostContent();
      }
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
  };

  const handleStartEditPost = () => {
    if (!effectivePost) return;
    setEditPostSummary(effectivePost.summary);
    // Strip HTML tags from details for editing
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = effectivePost.details;
    setEditPostDetails(tempDiv.textContent || tempDiv.innerText || effectivePost.details);
    setEditingPost(true);
    setShowActionsMenu(null);
  };

  const handleSavePostEdit = async () => {
    if (!effectivePost) return;
    const hasChanges =
      editPostSummary !== effectivePost.summary || editPostDetails !== effectivePost.details;
    if (!hasChanges) {
      setEditingPost(false);
      return;
    }
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${effectivePost._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ summary: editPostSummary, details: editPostDetails }),
        }
      );
      if (response.ok) {
        const updatedPost = await response.json();
        setEditingPost(false);
        // Update postMeta with new summary and details to reflect changes immediately
        setPostMeta((prev) => ({
          ...prev,
          summary: updatedPost.summary,
          details: updatedPost.details,
          updatedAt: updatedPost.updatedAt,
        }));
        // Notify parent to update sidebar
        onPostUpdated({
          _id: effectivePost._id,
          summary: updatedPost.summary,
          details: updatedPost.details,
          updatedAt: updatedPost.updatedAt,
        });
        loadPostContent();
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleStartEditAnswer = (answer: Answer) => {
    // Open rich editor for editing this answer
    setEditingAnswerId(answer._id);
    if (answer.authorRole === "STUDENT") {
      setStudentAnswerContent(answer.content);
      setShowStudentEditor(true);
    } else if (answer.authorRole === "INSTRUCTOR" || answer.authorRole === "FACULTY") {
      setInstructorAnswerContent(answer.content);
      setShowInstructorEditor(true);
    }
    setShowActionsMenu(null);
  };

  const handleStartEditDiscussion = (discussion: Discussion) => {
    setEditingDiscussionId(discussion._id);
    setEditDiscussionContent(discussion.content);
    setShowActionsMenu(null);
  };

  const handleSaveDiscussionEdit = async () => {
    if (!editingDiscussionId) return;
    const original = discussions.find((d) => d._id === editingDiscussionId);
    if (original && original.content === editDiscussionContent) {
      setEditingDiscussionId(null);
      return;
    }
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/discussions/${editingDiscussionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: editDiscussionContent }),
        }
      );
      if (response.ok) {
        setEditingDiscussionId(null);
        setEditDiscussionContent("");
        loadPostContent();
      }
    } catch (error) {
      console.error("Error updating discussion:", error);
    }
  };

  const handleStartEditReply = (reply: Discussion) => {
    setEditingReplyId(reply._id);
    setEditReplyContent(reply.content);
    setShowActionsMenu(null);
  };

  const handleSaveReplyEdit = async () => {
    if (!editingReplyId) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/discussions/${editingReplyId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: editReplyContent }),
        }
      );
      if (response.ok) {
        setEditingReplyId(null);
        setEditReplyContent("");
        loadPostContent();
      }
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  };

  if (!effectivePost) {
    return null;
  }

  const studentAnswers = answers.filter((a) => a.authorRole === "STUDENT" || a.authorRole === "USER");
  const instructorAnswers = answers.filter((a) => a.authorRole === "INSTRUCTOR" || a.authorRole === "FACULTY");
  const canEditPost = isInstructor || isAuthor;
  const canEditAnswer = (answer: Answer) => isInstructor || (answer.authorId === currentUser?._id && !isInstructor);
  const canEditPostAsStudent = isAuthor && !isInstructor;
  const canEditDiscussion = (discussion: Discussion) =>
    isInstructor || discussion.authorId === currentUser?._id;

  const renderReplies = (replyList?: Discussion[]) => {
    if (!replyList || replyList.length === 0) return null;
    return (
      <div className="pazza-discussion-replies">
        {replyList.map((reply) => {
          const canEdit = canEditDiscussion(reply);
          return (
            <div key={reply._id} className="pazza-discussion-reply">
              <div className="pazza-discussion-header">
                <div className="pazza-discussion-author-row">
                  <span className="pazza-discussion-author-name">
                    {reply.authorName}
                    <span className="pazza-role-badge"> ({formatRoleDisplay(reply.authorRole)})</span>
                  </span>
                  <span className="pazza-discussion-time">
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                </div>
                {canEdit && (
                  <div className="pazza-discussion-actions-dropdown">
                    <button
                      className="pazza-actions-dropdown-btn"
                      onClick={() =>
                        setShowActionsMenu(showActionsMenu === reply._id ? null : reply._id)
                      }
                    >
                      Actions ▾
                    </button>
                    {showActionsMenu === reply._id && (
                      <div className="pazza-actions-dropdown-menu">
                        <button
                          className="pazza-actions-dropdown-item"
                          onClick={() => handleStartEditReply(reply)}
                        >
                          Edit
                        </button>
                        <button
                          className="pazza-actions-dropdown-item pazza-actions-delete"
                          onClick={() => handleDeleteDiscussion(reply._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editingReplyId === reply._id ? (
                <div className="pazza-edit-block">
                  <textarea
                    className="pazza-discussion-textarea"
                    value={editReplyContent}
                    onChange={(e) => setEditReplyContent(e.target.value)}
                  />
                  <div className="pazza-editor-actions">
                    <button className="pazza-submit-btn" onClick={handleSaveReplyEdit}>
                      Save
                    </button>
                    <button
                      className="pazza-cancel-btn"
                      onClick={() => {
                        setEditingReplyId(null);
                        setEditReplyContent("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="pazza-discussion-content-text">{reply.content}</div>
                  {formatEdited(reply.createdAt, reply.updatedAt) && (
                    <div className="pazza-edited-label">
                      {formatEdited(reply.createdAt, reply.updatedAt)}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!effectivePost) return null;

  return (
    <div className="pazza-post-detail">
      {/* POST SECTION */}
      <div className="pazza-post-section">
        {/* Post Header */}
        <div className="pazza-post-header">
          <div className="pazza-post-header-left">
            <span className="pazza-post-number">
              {effectivePost.type === "QUESTION" ? "?" : "📝"} {effectivePost.type === "QUESTION" ? "question" : "note"} @{questionHandle} • #{questionNumber}
            </span>
          </div>
          <div className="pazza-post-header-right">
            <button 
              className={`pazza-icon-btn ${effectivePost.isPinned ? "active" : ""}`}
              onClick={handleTogglePin}
              title={effectivePost.isPinned ? "Unpin post" : "Pin post"}
            >
              <span className={effectivePost.isPinned ? "star-filled" : "star-outline"}>★</span>
            </button>
            {(currentUser && (effectivePost.authorId === currentUser._id || ["FACULTY", "ADMIN", "TA", "INSTRUCTOR"].includes(currentUser.role))) && (
              <button 
                className={`pazza-icon-btn ${effectivePost.visibility === "SELECTED_STUDENTS" ? "active" : ""}`}
                onClick={handleToggleLock}
                title={effectivePost.visibility === "SELECTED_STUDENTS" ? "Make public" : "Make private"}
              >
                <span>🔒</span>
              </button>
            )}
            <span className="pazza-view-count">
              <span>👁</span> {effectivePost.viewCount} views
            </span>
          </div>
        </div>

        {/* Post Body */}
        <div className="pazza-post-body">
          {editingPost ? (
            <div className="pazza-edit-block">
              <label className="pazza-edit-label">Summary</label>
              <input
                className="pazza-input"
                value={editPostSummary}
                onChange={(e) => setEditPostSummary(e.target.value)}
                placeholder="Post summary"
              />
              <label className="pazza-edit-label">Description</label>
              <textarea
                className="pazza-discussion-textarea"
                value={editPostDetails}
                onChange={(e) => setEditPostDetails(e.target.value)}
              />
              <div className="pazza-editor-actions">
                <button className="pazza-submit-btn" onClick={handleSavePostEdit}>
                  Save
                </button>
                <button className="pazza-cancel-btn" onClick={() => setEditingPost(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="pazza-post-title-row">
                <h2 className="pazza-post-title">{effectivePost.summary}</h2>
                {(isInstructor || canEditPostAsStudent) && (
                  <div className="pazza-post-actions-dropdown">
                    <button
                      className="pazza-actions-dropdown-btn"
                      onClick={() => setShowActionsMenu(showActionsMenu === "post" ? null : "post")}
                    >
                      Actions ▾
                    </button>
                    {showActionsMenu === "post" && (
                      <div className="pazza-actions-dropdown-menu">
                        <button className="pazza-actions-dropdown-item" onClick={handleStartEditPost}>
                          Edit
                        </button>
                        <button
                          className="pazza-actions-dropdown-item pazza-actions-delete"
                          onClick={handleDeletePost}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="pazza-post-content" dangerouslySetInnerHTML={{ __html: effectivePost.details }} />
              
              <div className="pazza-post-tags">
                {effectivePost.folders.map((folder) => (
                  <span key={folder} className="pazza-tag">
                    {folder}
                  </span>
                ))}
              </div>

              <div className="pazza-post-meta">
                <span className="pazza-post-author">{effectivePost.authorName} ({formatRoleDisplay(effectivePost.authorRole)})</span>
                {primaryTimestamp && (
                  <span className="pazza-post-time">
                    {primaryTimestamp.label} • {primaryTimestamp.text}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Post Footer */}
        {!editingPost && (
          <div className="pazza-post-footer">
            <button className="pazza-edit-btn" onClick={handleStartEditPost}>
              Edit
            </button>
            <button 
              className={`pazza-good-question-btn ${votedPosts.has(effectivePost._id) ? "voted" : ""}`}
              onClick={handleToggleGoodQuestion}
            >
              good question • {effectivePost.goodQuestionCount || 0}
            </button>
          </div>
        )}
      </div>

      {/* STUDENT ANSWERS SECTION */}
      {effectivePost.type === "QUESTION" && (
        <>
          <div className="pazza-student-answers-wrapper">
            <div className="pazza-section-header">
              <span className="pazza-section-icon">👩‍🎓</span>
              <h3 className="pazza-section-title">student&apos;s answers</h3>
              <span className="pazza-section-subtitle">answers contributed by students</span>
            </div>

            {studentAnswers.length === 0 && !showStudentEditor && (
              <div className="pazza-no-answer">
                <p>No student has answered this question yet.</p>
                {!isInstructor && currentUser && (
                  <button
                    className="pazza-submit-answer-btn"
                    onClick={() => {
                      setEditingAnswerId(null);
                      setStudentAnswerContent("");
                      setStudentEditorMode("rich");
                      setShowStudentEditor(true);
                    }}
                  >
                    Submit a Student Answer
                  </button>
                )}
              </div>
            )}

            {studentAnswers.length > 0 && (
              <>
                {studentAnswers.map((answer) => {
                  const canEdit = canEditAnswer(answer);
                  return (
                    <div key={answer._id} className="pazza-student-answer-item">
                      <div className="pazza-answer-header-row">
                        <span className="pazza-answer-author">
                          {answer.authorName}
                          <span className="pazza-role-badge"> ({formatRoleDisplay(answer.authorRole)})</span>
                        </span>
                        <span className="pazza-answer-time">
                          {new Date(answer.createdAt).toLocaleString()}
                        </span>
                        {canEdit && (
                          <div className="pazza-answer-actions-dropdown">
                            <button
                              className="pazza-actions-dropdown-btn"
                              onClick={() =>
                                setShowActionsMenu(showActionsMenu === answer._id ? null : answer._id)
                              }
                            >
                              Actions ▾
                            </button>
                            {showActionsMenu === answer._id && (
                              <div className="pazza-actions-dropdown-menu">
                                <button
                                  className="pazza-actions-dropdown-item"
                                  onClick={() => handleStartEditAnswer(answer)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="pazza-actions-dropdown-item pazza-actions-delete"
                                  onClick={() => handleDeleteAnswer(answer._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {editingAnswerId === answer._id ? null : (
                        <>
                          <div
                            className="pazza-answer-content"
                            dangerouslySetInnerHTML={{ __html: answer.content }}
                          />
                          {formatEdited(answer.createdAt, answer.updatedAt) && (
                            <div className="pazza-edited-label">
                              {formatEdited(answer.createdAt, answer.updatedAt)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}

                {!isInstructor && !showStudentEditor && (
                  <button
                    className="pazza-submit-btn"
                    onClick={() => {
                      setEditingAnswerId(null);
                      setStudentAnswerContent("");
                      setStudentEditorMode("rich");
                      setShowStudentEditor(true);
                    }}
                  >
                    Post another answer
                  </button>
                )}
              </>
            )}

            {!isInstructor && showStudentEditor && (
              <div className="pazza-student-answer-section">
                <div className="pazza-editor-options">
                  <div className="pazza-editor-mode-options">
                    <label>
                      <input
                        type="radio"
                        name="studentEditorMode"
                        value="rich"
                        checked={studentEditorMode === "rich"}
                        onChange={(e) => setStudentEditorMode(e.target.value)}
                      />
                      Rich text editor
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="studentEditorMode"
                        value="plain"
                        checked={studentEditorMode === "plain"}
                        onChange={(e) => setStudentEditorMode(e.target.value)}
                      />
                      Plain text editor
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="studentEditorMode"
                        value="markdown"
                        checked={studentEditorMode === "markdown"}
                        onChange={(e) => setStudentEditorMode(e.target.value)}
                      />
                      Markdown editor
                    </label>
                  </div>
                </div>

                <div className="pazza-rich-text-editor">
                  {studentEditorMode === "rich" ? (
                    <ReactQuill
                      value={studentAnswerContent}
                      onChange={setStudentAnswerContent}
                      theme="snow"
                      placeholder="Type your answer here..."
                      modules={{
                        toolbar: [
                          ["bold", "italic", "underline", "strike"],
                          [{ align: [] }],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ indent: "-1" }, { indent: "+1" }],
                          ["link", "image"],
                          ["clean"],
                        ],
                      }}
                    />
                  ) : (
                    <textarea
                      value={studentAnswerContent}
                      onChange={(e) => setStudentAnswerContent(e.target.value)}
                      className="pazza-plain-textarea"
                      placeholder="Type your answer here..."
                      rows={10}
                    />
                  )}
                </div>

                <div className="pazza-editor-actions">
                  <button
                    className="pazza-submit-btn"
                    onClick={handleSubmitStudentAnswer}
                    disabled={!studentAnswerContent.trim()}
                  >
                    {editingAnswerId ? "Save" : "Submit"}
                  </button>
                  <button
                    className="pazza-draft-btn"
                    onClick={handleSubmitStudentAnswer}
                    disabled={!studentAnswerContent.trim()}
                  >
                    Save Draft
                  </button>
                  <button
                    className="pazza-cancel-btn"
                    onClick={() => {
                      setShowStudentEditor(false);
                      setStudentAnswerContent("");
                      setStudentEditorMode("rich");
                      setEditingAnswerId(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* INSTRUCTOR'S ANSWER SECTION */}
          <div className="pazza-instructor-answer-section">
            <div className="pazza-section-header">
              <span className="pazza-section-icon">💡</span>
              <h3 className="pazza-section-title">the instructors&apos; answer</h3>
              <span className="pazza-section-subtitle">where instructors collectively construct a single answer</span>
            </div>

            {instructorAnswers.length === 0 && !showInstructorEditor ? (
              <div className="pazza-no-answer">
                <p>The instructor has not responded or answered to this post.</p>
                {isInstructor && (
                  <button
                    className="pazza-submit-answer-btn"
                    onClick={() => setShowInstructorEditor(true)}
                  >
                    Submit an Instructor&apos;s Answer
                  </button>
                )}
              </div>
            ) : null}

            {showInstructorEditor && (
              <div className="pazza-instructor-answer-section-editor">
                <div className="pazza-editor-options">
                  <div className="pazza-editor-mode-options">
                    <label>
                      <input 
                        type="radio" 
                        name="instructorEditorMode" 
                        value="rich" 
                        checked={instructorEditorMode === "rich"}
                        onChange={(e) => setInstructorEditorMode(e.target.value)}
                      />
                      Rich text editor
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="instructorEditorMode" 
                        value="plain" 
                        checked={instructorEditorMode === "plain"}
                        onChange={(e) => setInstructorEditorMode(e.target.value)}
                      />
                      Plain text editor
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="instructorEditorMode" 
                        value="markdown" 
                        checked={instructorEditorMode === "markdown"}
                        onChange={(e) => setInstructorEditorMode(e.target.value)}
                      />
                      Markdown editor
                    </label>
                  </div>
                </div>

                <div className="pazza-rich-text-editor">
                  {instructorEditorMode === "rich" ? (
                    <ReactQuill
                      value={instructorAnswerContent}
                      onChange={setInstructorAnswerContent}
                      theme="snow"
                      placeholder="Type your answer here..."
                      modules={{
                        toolbar: [
                          ["bold", "italic", "underline", "strike"],
                          [{ align: [] }],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ indent: "-1" }, { indent: "+1" }],
                          ["link", "image"],
                          ["clean"],
                        ],
                      }}
                    />
                  ) : (
                    <textarea
                      value={instructorAnswerContent}
                      onChange={(e) => setInstructorAnswerContent(e.target.value)}
                      className="pazza-plain-textarea"
                      placeholder="Type your answer here..."
                      rows={10}
                    />
                  )}
                </div>
                <div className="pazza-editor-actions">
                  <button 
                    className="pazza-submit-btn" 
                    onClick={handleSubmitInstructorAnswer}
                    disabled={!instructorAnswerContent.trim()}
                  >
                    {editingAnswerId ? "Save" : "Submit"}
                  </button>
                  <button 
                    className="pazza-draft-btn" 
                    onClick={handleSubmitInstructorAnswer}
                    disabled={!instructorAnswerContent.trim()}
                  >
                    Save Draft
                  </button>
                  <button 
                    className="pazza-cancel-btn" 
                    onClick={() => {
                      setShowInstructorEditor(false);
                      setInstructorAnswerContent("");
                      setInstructorEditorMode("rich");
                      setEditingAnswerId(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {instructorAnswers.length > 0 && (
              <>
                {instructorAnswers.map((answer) => {
                  const canEdit = canEditAnswer(answer);
                  return (
                    <div key={answer._id} className="pazza-instructor-answer-item">
                      <div className="pazza-answer-header-row">
                        <span className="pazza-answer-author">
                          {answer.authorName}
                          <span className="pazza-role-badge"> ({formatRoleDisplay(answer.authorRole)})</span>
                        </span>
                        <span className="pazza-answer-time">
                          {new Date(answer.createdAt).toLocaleString()}
                        </span>
                        {canEdit && (
                          <div className="pazza-answer-actions-dropdown">
                            <button
                              className="pazza-actions-dropdown-btn"
                              onClick={() =>
                                setShowActionsMenu(showActionsMenu === answer._id ? null : answer._id)
                              }
                            >
                              Actions ▾
                            </button>
                            {showActionsMenu === answer._id && (
                              <div className="pazza-actions-dropdown-menu">
                                <button
                                  className="pazza-actions-dropdown-item"
                                  onClick={() => handleStartEditAnswer(answer)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="pazza-actions-dropdown-item pazza-actions-delete"
                                  onClick={() => handleDeleteAnswer(answer._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {editingAnswerId === answer._id ? null : (
                        <>
                          <div
                            className="pazza-answer-content"
                            dangerouslySetInnerHTML={{ __html: answer.content }}
                          />
                          {formatEdited(answer.createdAt, answer.updatedAt) && (
                            <div className="pazza-edited-label">
                              {formatEdited(answer.createdAt, answer.updatedAt)}
                            </div>
                          )}
                          <div className="pazza-answer-footer">
                            <button 
                              className={`pazza-good-answer-btn ${votedAnswers.has(answer._id) ? "voted" : ""}`}
                              onClick={() => handleToggleGoodAnswer(answer._id)}
                            >
                              good answer • {answer.goodAnswerCount || 0}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {isInstructor && !showInstructorEditor && (
                  <button 
                    className="pazza-submit-btn" 
                    onClick={() => {
                      setEditingAnswerId(null);
                      setInstructorAnswerContent("");
                      setInstructorEditorMode("rich");
                      setShowInstructorEditor(true);
                    }}
                  >
                    Post another answer
                  </button>
                )}
              </>
            )}
          </div>

          {/* FOLLOWUP DISCUSSIONS SECTION */}
          <div className="pazza-discussions-section">
            <div className="pazza-section-header">
              <span className="pazza-section-icon">💬</span>
              <h3 className="pazza-section-title">followup discussions</h3>
              <span className="pazza-section-subtitle">for lingering questions and comments</span>
            </div>

            {discussions.length === 0 && (
              <p className="pazza-no-discussions">No followup discussions yet</p>
            )}

            {discussions.map((discussion) => {
              const canEdit = canEditDiscussion(discussion);
              return (
                <div key={discussion._id} className="pazza-discussion-item">
                  <div className="pazza-discussion-header-row">
                    <span className="pazza-discussion-author">
                      {discussion.authorName}
                      <span className="pazza-role-badge"> ({formatRoleDisplay(discussion.authorRole)})</span>
                    </span>
                    <span className="pazza-discussion-time">
                      {new Date(discussion.createdAt).toLocaleString()}
                    </span>
                    <div className="pazza-discussion-status-btns">
                      <button
                        className={`pazza-status-btn ${discussion.resolved ? "active" : ""}`}
                        onClick={() => handleToggleResolved(discussion._id, discussion.resolved)}
                      >
                        Resolved
                      </button>
                      <button
                        className={`pazza-status-btn ${!discussion.resolved ? "active" : ""}`}
                        onClick={() => handleToggleResolved(discussion._id, discussion.resolved)}
                      >
                        Unresolved
                      </button>
                    </div>
                    {canEdit && (
                      <div className="pazza-discussion-actions-dropdown">
                        <button
                          className="pazza-actions-dropdown-btn"
                          onClick={() =>
                            setShowActionsMenu(
                              showActionsMenu === discussion._id ? null : discussion._id
                            )
                          }
                        >
                          Actions ▾
                        </button>
                        {showActionsMenu === discussion._id && (
                          <div className="pazza-actions-dropdown-menu">
                            <button
                              className="pazza-actions-dropdown-item"
                              onClick={() => handleStartEditDiscussion(discussion)}
                            >
                              Edit
                            </button>
                            <button
                              className="pazza-actions-dropdown-item pazza-actions-delete"
                              onClick={() => handleDeleteDiscussion(discussion._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {editingDiscussionId === discussion._id ? (
                    <div className="pazza-edit-block">
                      <textarea
                        className="pazza-discussion-textarea"
                        value={editDiscussionContent}
                        onChange={(e) => setEditDiscussionContent(e.target.value)}
                      />
                      <div className="pazza-editor-actions">
                        <button className="pazza-submit-btn" onClick={handleSaveDiscussionEdit}>
                          Save
                        </button>
                        <button
                          className="pazza-cancel-btn"
                          onClick={() => {
                            setEditingDiscussionId(null);
                            setEditDiscussionContent("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="pazza-discussion-content">{discussion.content}</div>
                      {formatEdited(discussion.createdAt, discussion.updatedAt) && (
                        <div className="pazza-edited-label">
                          {formatEdited(discussion.createdAt, discussion.updatedAt)}
                        </div>
                      )}
                      <button 
                        className={`pazza-helpful-btn ${votedDiscussions.has(discussion._id) ? "voted" : ""}`}
                        onClick={() => handleToggleHelpful(discussion._id)}
                      >
                        👍 Helpful {discussion.helpfulCount || 0}
                      </button>
                    </>
                  )}

                  <button
                    className="pazza-reply-btn"
                    onClick={() =>
                      setReplyToDiscussion(
                        replyToDiscussion === discussion._id ? null : discussion._id
                      )
                    }
                  >
                    Reply
                  </button>

                  {replyToDiscussion === discussion._id && (
                    <div className="pazza-reply-editor">
                      <textarea
                        className="pazza-discussion-textarea"
                        placeholder="Compose a new followup discussion"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <div className="pazza-editor-actions">
                        <button
                          className="pazza-submit-btn"
                          onClick={() => handleSubmitReply(discussion._id)}
                        >
                          Submit
                        </button>
                        <button
                          className="pazza-cancel-btn"
                          onClick={() => {
                            setReplyToDiscussion(null);
                            setReplyContent("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {renderReplies(discussion.replies)}
                </div>
              );
            })}

            <div className="pazza-new-discussion">
              <h4 className="pazza-new-discussion-title">Start a new followup discussion</h4>
              <textarea
                className="pazza-discussion-textarea"
                placeholder="Compose a new followup discussion"
                value={newDiscussionContent}
                onChange={(e) => setNewDiscussionContent(e.target.value)}
              />
              <div className="pazza-editor-actions">
                <button className="pazza-submit-btn" onClick={handleSubmitDiscussion}>
                  Submit
                </button>
                <button
                  className="pazza-cancel-btn"
                  onClick={() => setNewDiscussionContent("")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {isLoading && <div className="pazza-loading">Loading...</div>}
    </div>
  );
}
