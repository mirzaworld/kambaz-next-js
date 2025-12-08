"use client";

import { useEffect, useMemo, useState } from "react";

interface Post {
  _id: string;
  summary: string;
  details: string;
  type: "QUESTION" | "NOTE";
  authorName: string;
  authorRole: "STUDENT" | "INSTRUCTOR" | "FACULTY";
  authorId: string;
  folders: string[];
  viewCount: number;
  hasStudentAnswer: boolean;
  hasInstructorAnswer: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface Answer {
  _id: string;
  content: string;
  authorName: string;
  authorRole: "STUDENT" | "INSTRUCTOR" | "FACULTY";
  authorId: string;
  createdAt: string;
  updatedAt?: string;
}

interface Discussion {
  _id: string;
  content: string;
  authorName: string;
  authorRole: "STUDENT" | "INSTRUCTOR" | "FACULTY";
  authorId: string;
  parentDiscussionId: string | null;
  resolved: boolean;
  createdAt: string;
  updatedAt?: string;
  replies?: Discussion[];
}

interface PostDetailViewProps {
  selectedPost: Post | null;
  courseId: string;
  currentUser: any;
  onPostDeleted: () => void;
  onPostUpdated: () => void;
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
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showStudentEditor, setShowStudentEditor] = useState(false);
  const [showInstructorEditor, setShowInstructorEditor] = useState(false);
  const [studentAnswerContent, setStudentAnswerContent] = useState("");
  const [instructorAnswerContent, setInstructorAnswerContent] = useState("");

  const [newDiscussionContent, setNewDiscussionContent] = useState("");
  const [replyToDiscussion, setReplyToDiscussion] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  const [editingPost, setEditingPost] = useState(false);
  const [editPostSummary, setEditPostSummary] = useState("");
  const [editPostDetails, setEditPostDetails] = useState("");

  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editAnswerContent, setEditAnswerContent] = useState("");

  const [editingDiscussionId, setEditingDiscussionId] = useState<string | null>(null);
  const [editDiscussionContent, setEditDiscussionContent] = useState("");

  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  const isInstructor = useMemo(
    () => currentUser?.role === "INSTRUCTOR" || currentUser?.role === "FACULTY",
    [currentUser]
  );
  const isAuthor = useMemo(
    () => currentUser?._id && selectedPost?._id && currentUser._id === selectedPost.authorId,
    [currentUser, selectedPost]
  );

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
  }, [selectedPost?._id]);

  const loadPostContent = async () => {
    if (!selectedPost) return;
    try {
      setIsLoading(true);

      const answersResponse = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}/answers`,
        { credentials: "include" }
      );
      if (answersResponse.ok) {
        const answersData = await answersResponse.json();
        setAnswers(answersData || []);
      }

      const discussionsResponse = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}/discussions`,
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

  const handleSubmitStudentAnswer = async () => {
    if (!studentAnswerContent.trim() || !selectedPost || !currentUser) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            content: studentAnswerContent,
            authorId: currentUser._id,
            authorName: `${currentUser.firstName} ${currentUser.lastName}`,
            authorRole: "STUDENT",
          }),
        }
      );
      if (response.ok) {
        setStudentAnswerContent("");
        setShowStudentEditor(false);
        loadPostContent();
      }
    } catch (error) {
      console.error("Error submitting student answer:", error);
    }
  };

  const handleSubmitInstructorAnswer = async () => {
    if (!instructorAnswerContent.trim() || !selectedPost || !currentUser) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            content: instructorAnswerContent,
            authorId: currentUser._id,
            authorName: `${currentUser.firstName} ${currentUser.lastName}`,
            authorRole: "INSTRUCTOR",
          }),
        }
      );
      if (response.ok) {
        setInstructorAnswerContent("");
        setShowInstructorEditor(false);
        loadPostContent();
      }
    } catch (error) {
      console.error("Error submitting instructor answer:", error);
    }
  };

  const handleSubmitDiscussion = async () => {
    if (!newDiscussionContent.trim() || !selectedPost || !currentUser) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}/discussions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            content: newDiscussionContent,
            authorId: currentUser._id,
            authorName: `${currentUser.firstName} ${currentUser.lastName}`,
            authorRole: currentUser.role === "FACULTY" ? "INSTRUCTOR" : currentUser.role,
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
    if (!replyContent.trim() || !selectedPost || !currentUser) return;
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
            authorRole: currentUser.role === "FACULTY" ? "INSTRUCTOR" : currentUser.role,
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
    if (!selectedPost || !confirm("Delete this answer?")) return;
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
    if (!selectedPost || !confirm("Delete this post?")) return;
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}`,
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
    if (!selectedPost) return;
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
    if (!selectedPost || !confirm("Delete this discussion?")) return;
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
    if (!selectedPost) return;
    setEditPostSummary(selectedPost.summary);
    setEditPostDetails(selectedPost.details);
    setEditingPost(true);
    setShowActionsMenu(null);
  };

  const handleSavePostEdit = async () => {
    if (!selectedPost) return;
    const hasChanges =
      editPostSummary !== selectedPost.summary || editPostDetails !== selectedPost.details;
    if (!hasChanges) {
      setEditingPost(false);
      return;
    }
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ summary: editPostSummary, details: editPostDetails }),
        }
      );
      if (response.ok) {
        setEditingPost(false);
        onPostUpdated();
        loadPostContent();
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleStartEditAnswer = (answer: Answer) => {
    setEditingAnswerId(answer._id);
    setEditAnswerContent(answer.content);
    setShowActionsMenu(null);
  };

  const handleSaveAnswerEdit = async () => {
    if (!editingAnswerId) return;
    const original = answers.find((a) => a._id === editingAnswerId);
    if (original && original.content === editAnswerContent) {
      setEditingAnswerId(null);
      return;
    }
    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/answers/${editingAnswerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: editAnswerContent }),
        }
      );
      if (response.ok) {
        setEditingAnswerId(null);
        setEditAnswerContent("");
        loadPostContent();
      }
    } catch (error) {
      console.error("Error updating answer:", error);
    }
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

  if (!selectedPost) {
    return (
      <div className="pazza-post-detail-empty">
        <div className="pazza-empty-state">
          <h3>Select a post to view details</h3>
          <p>Choose a post from the list on the left to see its content</p>
        </div>
      </div>
    );
  }

  const studentAnswers = answers.filter((a) => a.authorRole === "STUDENT");
  const instructorAnswers = answers.filter((a) => a.authorRole === "INSTRUCTOR" || a.authorRole === "FACULTY");
  const canEditPost = isInstructor || isAuthor;
  const canEditAnswer = (answer: Answer) => isInstructor || answer.authorId === currentUser?._id;
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
                  <span className="pazza-discussion-author-name">{reply.authorName}</span>
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

  return (
    <div className="pazza-post-detail">
      <div className="pazza-post-detail-header">
        <div className="pazza-post-detail-title-section">
          <h1 className="pazza-post-detail-title">{selectedPost.summary}</h1>
          <div className="pazza-post-detail-tags">
            {selectedPost.folders.map((folder) => (
              <span key={folder} className="pazza-tag">
                {folder}
              </span>
            ))}
          </div>
          <div className="pazza-post-meta-row">
            <span className="pazza-post-author-name">{selectedPost.authorName}</span>
            <span className="pazza-post-author-role">({selectedPost.authorRole})</span>
            <span className="pazza-post-author-time">
              {new Date(selectedPost.createdAt).toLocaleString()}
            </span>
            <span className="pazza-post-views">{selectedPost.viewCount} views</span>
            {formatEdited(selectedPost.createdAt, selectedPost.updatedAt) && (
              <span className="pazza-edited-label">
                {formatEdited(selectedPost.createdAt, selectedPost.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {canEditPost && (
          <div className="pazza-post-actions">
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

      <div className="pazza-post-detail-body-new">
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
          <div className="pazza-post-content-html" dangerouslySetInnerHTML={{ __html: selectedPost.details }} />
        )}
      </div>

      {selectedPost.type === "QUESTION" && (
        <>
          <div className="pazza-answer-section">
            <h3 className="pazza-answer-section-title">Student's Answers</h3>
            {studentAnswers.length === 0 && !showStudentEditor && currentUser?.role === "STUDENT" && (
              <div className="pazza-no-answers">
                <p>No student answers yet.</p>
                <button className="pazza-add-answer-btn" onClick={() => setShowStudentEditor(true)}>
                  Add your answer
                </button>
              </div>
            )}

            {studentAnswers.map((answer) => {
              const canEdit = canEditAnswer(answer);
              return (
                <div key={answer._id} className="pazza-answer-box">
                  <div className="pazza-answer-header">
                    <div className="pazza-answer-author-info">
                      <span className="pazza-answer-author-name">{answer.authorName}</span>
                      <span className="pazza-answer-time">
                        {new Date(answer.createdAt).toLocaleString()}
                      </span>
                    </div>
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

                  {editingAnswerId === answer._id ? (
                    <div className="pazza-edit-block">
                      <textarea
                        className="pazza-discussion-textarea"
                        value={editAnswerContent}
                        onChange={(e) => setEditAnswerContent(e.target.value)}
                      />
                      <div className="pazza-editor-actions">
                        <button className="pazza-submit-btn" onClick={handleSaveAnswerEdit}>
                          Save
                        </button>
                        <button
                          className="pazza-cancel-btn"
                          onClick={() => {
                            setEditingAnswerId(null);
                            setEditAnswerContent("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
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

            {showStudentEditor && currentUser?.role === "STUDENT" && (
              <div className="pazza-edit-block">
                <textarea
                  className="pazza-discussion-textarea"
                  placeholder="Write your answer"
                  value={studentAnswerContent}
                  onChange={(e) => setStudentAnswerContent(e.target.value)}
                />
                <div className="pazza-editor-actions">
                  <button className="pazza-submit-btn" onClick={handleSubmitStudentAnswer}>
                    Submit
                  </button>
                  <button
                    className="pazza-cancel-btn"
                    onClick={() => {
                      setShowStudentEditor(false);
                      setStudentAnswerContent("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pazza-answer-section">
            <h3 className="pazza-answer-section-title">Instructor's Answers</h3>
            {instructorAnswers.length === 0 && !showInstructorEditor && isInstructor && (
              <div className="pazza-no-answers">
                <p>No instructor answers yet.</p>
                <button className="pazza-add-answer-btn" onClick={() => setShowInstructorEditor(true)}>
                  Add instructor answer
                </button>
              </div>
            )}

            {instructorAnswers.map((answer) => {
              const canEdit = canEditAnswer(answer);
              return (
                <div key={answer._id} className="pazza-answer-box">
                  <div className="pazza-answer-header">
                    <div className="pazza-answer-author-info">
                      <span className="pazza-answer-author-name">{answer.authorName}</span>
                      <span className="pazza-answer-time">
                        {new Date(answer.createdAt).toLocaleString()}
                      </span>
                    </div>
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

                  {editingAnswerId === answer._id ? (
                    <div className="pazza-edit-block">
                      <textarea
                        className="pazza-discussion-textarea"
                        value={editAnswerContent}
                        onChange={(e) => setEditAnswerContent(e.target.value)}
                      />
                      <div className="pazza-editor-actions">
                        <button className="pazza-submit-btn" onClick={handleSaveAnswerEdit}>
                          Save
                        </button>
                        <button
                          className="pazza-cancel-btn"
                          onClick={() => {
                            setEditingAnswerId(null);
                            setEditAnswerContent("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
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

            {showInstructorEditor && isInstructor && (
              <div className="pazza-edit-block">
                <textarea
                  className="pazza-discussion-textarea"
                  placeholder="Write instructor answer"
                  value={instructorAnswerContent}
                  onChange={(e) => setInstructorAnswerContent(e.target.value)}
                />
                <div className="pazza-editor-actions">
                  <button className="pazza-submit-btn" onClick={handleSubmitInstructorAnswer}>
                    Submit
                  </button>
                  <button
                    className="pazza-cancel-btn"
                    onClick={() => {
                      setShowInstructorEditor(false);
                      setInstructorAnswerContent("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pazza-discussions-section">
            <h3>Follow-up Discussions</h3>
            {discussions.length === 0 && <p className="pazza-no-discussions">No discussions yet</p>}
            {discussions.map((discussion) => {
              const canEdit = canEditDiscussion(discussion);
              return (
                <div key={discussion._id} className="pazza-discussion-item">
                  <div className="pazza-discussion-header">
                    <div className="pazza-discussion-author-row">
                      <span className="pazza-discussion-author-name">{discussion.authorName}</span>
                      <span className="pazza-discussion-time">
                        {new Date(discussion.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="pazza-discussion-controls">
                      <button
                        className={`pazza-discussion-status-btn ${discussion.resolved ? "active" : ""}`}
                        onClick={() => handleToggleResolved(discussion._id, discussion.resolved)}
                      >
                        Resolved
                      </button>
                      <button
                        className={`pazza-discussion-status-btn ${!discussion.resolved ? "active" : ""}`}
                        onClick={() => handleToggleResolved(discussion._id, discussion.resolved)}
                      >
                        Unresolved
                      </button>
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
                      <div className="pazza-discussion-content-text">{discussion.content}</div>
                      {formatEdited(discussion.createdAt, discussion.updatedAt) && (
                        <div className="pazza-edited-label">
                          {formatEdited(discussion.createdAt, discussion.updatedAt)}
                        </div>
                      )}
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
                        placeholder="Reply to the followup discussion"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <div className="pazza-editor-actions">
                        <button
                          className="pazza-submit-btn"
                          onClick={() => handleSubmitReply(discussion._id)}
                        >
                          Post
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
              <textarea
                className="pazza-discussion-textarea"
                placeholder="Start a new followup discussion"
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
