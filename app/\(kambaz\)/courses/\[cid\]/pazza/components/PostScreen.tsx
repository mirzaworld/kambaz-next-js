/**
 * POST SCREEN
 * Right column showing:
 * - Post details (title, author, content)
 * - Answers (student and instructor)
 * - Follow-up discussions
 * - Option to post answers or discussions (based on user role)
 * OR
 * - Class at a Glance statistics (when no post selected)
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ClassAtAGlanceScreen from "./ClassAtAGlanceScreen";
import AnswerEditor from "./AnswerEditor";
import DiscussionThread from "./DiscussionThread";
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
  const { data: session } = useSession();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
  const currentUser = session?.user as any;

  /**
   * When selected post changes, load answers and discussions
   */
  useEffect(() => {
    if (selectedPost) {
      loadPostContent();
    }
  }, [selectedPost?._id]);

  /**
   * Load answers and discussions for selected post
   */
  const loadPostContent = async () => {
    if (!selectedPost) return;

    try {
      setIsLoadingContent(true);

      // Load answers
      const answersResponse = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}/answers`,
        { credentials: "include" }
      );
      const answersData = await answersResponse.json();
      setAnswers(answersData || []);

      // Load discussions
      const discussionsResponse = await fetch(
        `${SERVER_URL}/api/courses/${courseId}/pazza/posts/${selectedPost._id}/discussions`,
        { credentials: "include" }
      );
      const discussionsData = await discussionsResponse.json();
      setDiscussions(discussionsData || []);
    } catch (error) {
      console.error("Error loading post content:", error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  /**
   * Handle answer posted
   */
  const handleAnswerPosted = () => {
    loadPostContent();
    onPostUpdated();
  };

  /**
   * Handle discussion posted
   */
  const handleDiscussionPosted = () => {
    loadPostContent();
  };

  /**
   * Delete post
   */
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

  // Show Class at a Glance if no post selected
  if (!selectedPost) {
    return <ClassAtAGlanceScreen posts={allPosts} />;
  }

  const studentAnswer = answers.find((a) => a.authorRole === "STUDENT");
  const instructorAnswer = answers.find((a) => a.authorRole === "INSTRUCTOR");
  const topLevelDiscussions = discussions.filter((d) => d.parentDiscussionId === null);

  return (
    <div className="pazza-post-screen">
      {/* Post Header */}
      <div className="pazza-post-header">
        <h2 className="pazza-post-title">{selectedPost.summary}</h2>
        <div className="pazza-post-metadata">
          <span className="pazza-folder">{selectedPost.folders[0]}</span>
          <span className="pazza-author">
            By: {selectedPost.authorName} ({selectedPost.authorRole})
          </span>
          <span className="pazza-viewcount">{selectedPost.viewCount} views</span>

          {/* Edit/Delete buttons (only for author or instructors) */}
          {(currentUser?._id === selectedPost.authorId || currentUser?.role === "INSTRUCTOR") && (
            <div className="pazza-post-actions">
              <button className="pazza-btn-small">✏️ Edit</button>
              <button className="pazza-btn-small pazza-btn-danger" onClick={handleDeletePost}>
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="pazza-post-body">
        <div
          className="pazza-post-details"
          dangerouslySetInnerHTML={{ __html: selectedPost.details }}
        />
      </div>

      {/* Divider */}
      <div className="pazza-divider"></div>

      {/* Student's Answers */}
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
                  <button className="pazza-btn-small">✏️ Edit</button>
                  <button className="pazza-btn-small pazza-btn-danger">🗑️ Delete</button>
                </div>
              )}
            </div>
            <div
              className="pazza-answer-content"
              dangerouslySetInnerHTML={{ __html: studentAnswer.content }}
            />
          </div>
        </div>
      )}

      {/* Post Answer Editor (if question and no answers) */}
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

      {/* Instructor's Answer */}
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
                  <button className="pazza-btn-small">✏️ Edit</button>
                  <button className="pazza-btn-small pazza-btn-danger">🗑️ Delete</button>
                </div>
              )}
            </div>
            <div
              className="pazza-answer-content"
              dangerouslySetInnerHTML={{ __html: instructorAnswer.content }}
            />
          </div>
        </div>
      )}

      {/* Post Instructor Answer Editor (if question and instructor) */}
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

      {/* Follow Up Discussions */}
      {selectedPost.type === "QUESTION" && (
        <div className="pazza-discussions-section">
          <h4 className="pazza-section-title">FOLLOW UP DISCUSSIONS</h4>

          {/* New Discussion Form */}
          <DiscussionThread
            courseId={courseId}
            postId={selectedPost._id}
            discussions={topLevelDiscussions}
            currentUserId={currentUser?._id}
            currentUserRole={currentUser?.role}
            onDiscussionPosted={handleDiscussionPosted}
          />
        </div>
      )}
    </div>
  );
}
