"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AnswerEditor from "./AnswerEditor";
import EditPostScreen from "./EditPostScreen";
import "./components.css";

interface Post {
  _id: string;
  authorId: string;
  authorName: string;
  authorRole: "STUDENT" | "INSTRUCTOR";
  type: "QUESTION" | "NOTE";
  summary: string;
  details: string;
  folders: string[];
  viewCount: number;
  hasStudentAnswer: boolean;
  hasInstructorAnswer: boolean;
  createdAt: string;
}

interface Answer {
  _id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: "STUDENT" | "INSTRUCTOR";
  content: string;
  createdAt: string;
}

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

interface PostScreenProps {
  selectedPost: Post | null;
  allPosts: Post[];
  courseId: string;
  onPostDeleted: () => void;
  onPostUpdated: () => void;
}

export default function PostScreen({
  selectedPost,
  allPosts,
  courseId,
  onPostDeleted,
  onPostUpdated,
}: PostScreenProps) {
  const currentUser = useSelector((state: any) => state.account?.currentUser);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editingAnswerContent, setEditingAnswerContent] = useState("");
  const [showEditScreen, setShowEditScreen] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
  const currentUserName = `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || "User";

  useEffect(() => {
    if (selectedPost) {
      loadPostContent();
    }
  }, [selectedPost?._id]);

  const fetchRepliesRecursive = async (discussionId: string): Promise<Discussion[]> => {
    const replyRes = await fetch(
      `${SERVER_URL}/api/courses/${courseId}/pazza/discussions/${discussionId}/replies`,
      { credentials: "include" }
    );
    if (!replyRes.ok) return [];
    const replies = await replyRes.json();

    const withNested = await Promise.all(
      (replies || []).map(async (reply: Discussion) => ({
        ...reply,
        replies: await fetchRepliesRecursive(reply._id),
      }))
    );
    return withNested;
  };

  const loadPostContent = async () => {
    if (!selectedPost) return;

    try {
      setIsLoadingContent(true);

      const answersResponse = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}/answers`,
        { credentials: "include" }
      );
      const answersData = await answersResponse.json();
      setAnswers(answersData || []);

      const discussionsResponse = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}/discussions`,
        { credentials: "include" }
      );
      const discussionsData = await discussionsResponse.json();

      const discussionsWithReplies = await Promise.all(
        (discussionsData || []).map(async (discussion: Discussion) => ({
          ...discussion,
          replies: await fetchRepliesRecursive(discussion._id),
        }))
      );
      setDiscussions(discussionsWithReplies || []);
    } catch (error) {
      console.error("Error loading post content:", error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleAnswerPosted = () => {
    loadPostContent();
    onPostUpdated();
  };

  const handleAnswerSaved = async () => {
    setEditingAnswerId(null);
    setEditingAnswerContent("");
    await loadPostContent();
    onPostUpdated();
  };

  const handleDiscussionPosted = () => {
    loadPostContent();
  };
  const handleDeleteAnswer = async (answer: Answer) => {
    if (!confirm("Are you sure you want to delete this answer?")) return;

    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/answers/${answer._id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (response.ok) {
        setEditingAnswerId(null);
        setEditingAnswerContent("");
        await loadPostContent();
        onPostUpdated();
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  const handleStartEditAnswer = (answer: Answer) => {
    setEditingAnswerId(answer._id);
    setEditingAnswerContent(answer.content);
  };

  const handleDiscussionUpdated = () => {
    loadPostContent();
  };

  const handleCancelEdit = () => {
    setEditingAnswerId(null);
    setEditingAnswerContent("");
  };

  const handleDeletePost = async () => {
    if (!selectedPost || !confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        onPostDeleted();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handlePostEdited = async () => {
    setShowEditScreen(false);
    await loadPostContent();
    onPostUpdated();
  };

  if (!selectedPost) {
    return (
      <div className="pazza-empty-state">
        <h3>Select a post to view details</h3>
        <p>Choose a post from the list to see its content</p>
      </div>
    );
  }

  const studentAnswer = answers.find((a) => a.authorRole === "STUDENT");
  const instructorAnswer = answers.find((a) => a.authorRole === "INSTRUCTOR");
  const topLevelDiscussions = discussions.filter((d) => d.parentDiscussionId === null);

  return (
    <div className="pazza-post-screen">
      <div className="pazza-post-header">
        <h2 className="pazza-post-title">{selectedPost.summary}</h2>
        <div className="pazza-post-metadata">
          <span className="pazza-folder">{selectedPost.folders[0]}</span>
          <span className="pazza-author">
            By: {selectedPost.authorName} ({selectedPost.authorRole})
          </span>
          <span className="pazza-viewcount">{selectedPost.viewCount} views</span>

          {(currentUser?._id === selectedPost.authorId || currentUser?.role === "INSTRUCTOR") && (
            <div className="pazza-post-actions">
              <button className="pazza-btn-small" onClick={() => setShowEditScreen(true)}>
                ✏️ Edit
              </button>
              <button className="pazza-btn-small pazza-btn-danger" onClick={handleDeletePost}>
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pazza-post-body">
        <div
          className="pazza-post-details"
          dangerouslySetInnerHTML={{ __html: selectedPost.details }}
        />
      </div>

      <div className="pazza-divider"></div>

      {studentAnswer && (
        <div className="pazza-answer-section">
          <h4 className="pazza-section-title">STUDENT'S ANSWERS</h4>
          <div className="pazza-answer-item">
            <div className="pazza-answer-meta">
              <span className="pazza-answer-author">
                {studentAnswer.authorName} ({studentAnswer.authorRole})
              </span>
              <span className="pazza-answer-time">
                {new Date(studentAnswer.createdAt).toLocaleString()}
              </span>
              {(currentUser?._id === studentAnswer.authorId || currentUser?.role === "INSTRUCTOR") && (
                <div className="pazza-answer-actions">
                  <button
                    className="pazza-btn-small"
                    onClick={() => handleStartEditAnswer(studentAnswer)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="pazza-btn-small pazza-btn-danger"
                    onClick={() => handleDeleteAnswer(studentAnswer)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
            {editingAnswerId === studentAnswer._id ? (
              <AnswerEditor
                courseId={courseId}
                postId={selectedPost._id}
                authorRole="STUDENT"
                answerId={studentAnswer._id}
                initialContent={editingAnswerContent}
                mode="edit"
                onSubmit={handleAnswerSaved}
                onCancel={handleCancelEdit}
                submitLabel="Save Student Answer"
              />
            ) : (
              <div
                className="pazza-answer-content"
                dangerouslySetInnerHTML={{ __html: studentAnswer.content }}
              />
            )}
          </div>
        </div>
      )}

      {selectedPost.type === "QUESTION" && !studentAnswer && currentUser?.role === "STUDENT" && (
        <div className="pazza-post-answer-form">
          <h4>POST AN ANSWER</h4>
          <AnswerEditor
            courseId={courseId}
            postId={selectedPost._id}
            authorRole="STUDENT"
            onSubmit={handleAnswerPosted}
          />
        </div>
      )}

      {instructorAnswer && (
        <div className="pazza-answer-section">
          <h4 className="pazza-section-title">INSTRUCTOR'S ANSWERS</h4>
          <div className="pazza-answer-item">
            <div className="pazza-answer-meta">
              <span className="pazza-answer-author">
                {instructorAnswer.authorName} ({instructorAnswer.authorRole})
              </span>
              <span className="pazza-answer-time">
                {new Date(instructorAnswer.createdAt).toLocaleString()}
              </span>
              {(currentUser?._id === instructorAnswer.authorId || currentUser?.role === "INSTRUCTOR") && (
                <div className="pazza-answer-actions">
                  <button
                    className="pazza-btn-small"
                    onClick={() => handleStartEditAnswer(instructorAnswer)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="pazza-btn-small pazza-btn-danger"
                    onClick={() => handleDeleteAnswer(instructorAnswer)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
            {editingAnswerId === instructorAnswer._id ? (
              <AnswerEditor
                courseId={courseId}
                postId={selectedPost._id}
                authorRole="INSTRUCTOR"
                answerId={instructorAnswer._id}
                initialContent={editingAnswerContent}
                mode="edit"
                onSubmit={handleAnswerSaved}
                onCancel={handleCancelEdit}
                submitLabel="Save Instructor Answer"
              />
            ) : (
              <div
                className="pazza-answer-content"
                dangerouslySetInnerHTML={{ __html: instructorAnswer.content }}
              />
            )}
          </div>
        </div>
      )}

      {selectedPost.type === "QUESTION" && !instructorAnswer && currentUser?.role === "INSTRUCTOR" && (
        <div className="pazza-post-answer-form">
          <h4>POST AN ANSWER</h4>
          <AnswerEditor
            courseId={courseId}
            postId={selectedPost._id}
            authorRole="INSTRUCTOR"
            onSubmit={handleAnswerPosted}
          />
        </div>
      )}

      <div className="pazza-divider"></div>

      {selectedPost.type === "QUESTION" && (
        <div className="pazza-discussions-section">
          <h4 className="pazza-section-title">FOLLOW UP DISCUSSIONS</h4>
          <div className="pazza-discussions-list">
            {topLevelDiscussions.length === 0 ? (
              <p className="pazza-no-discussions">No discussions yet</p>
            ) : (
              topLevelDiscussions.map((discussion) => (
                <div key={discussion._id} className="pazza-discussion-item">
                  <div className="pazza-discussion-author">
                    {discussion.authorName} ({discussion.authorRole})
                  </div>
                  <div className="pazza-discussion-content">{discussion.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showEditScreen && (
        <EditPostScreen
          courseId={courseId}
          postToEdit={selectedPost}
          currentUserId={currentUser?._id || ""}
          currentUserRole={currentUser?.role || ""}
          onClose={() => setShowEditScreen(false)}
          onPostEdited={handlePostEdited}
        />
      )}
    </div>
  );
}
