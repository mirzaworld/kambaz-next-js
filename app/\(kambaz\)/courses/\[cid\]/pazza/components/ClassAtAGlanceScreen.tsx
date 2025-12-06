/**
 * CLASS AT A GLANCE SCREEN
 * Displays when no post is selected
 * Shows statistics about the course's Q&A activity:
 * - Unread posts
 * - Unanswered questions
 * - Total posts
 * - Instructor responses count
 * - Student responses count
 * - Enrolled students count
 */

"use client";

import { useEffect, useState } from "react";
import "./components.css";

interface Post {
  _id: string;
  type: "QUESTION" | "NOTE";
  authorRole: "STUDENT" | "INSTRUCTOR";
  hasStudentAnswer: boolean;
  hasInstructorAnswer: boolean;
}

interface ClassAtAGlanceScreenProps {
  posts: Post[];
}

export default function ClassAtAGlanceScreen({ posts }: ClassAtAGlanceScreenProps) {
  const [enrolledCount, setEnrolledCount] = useState(0);

  useEffect(() => {
    // In a real app, fetch enrolled students from API
    // For now, hardcode a placeholder
    setEnrolledCount(25);
  }, []);

  /**
   * Calculate statistics
   */
  const stats = {
    totalPosts: posts.length,
    questions: posts.filter((p) => p.type === "QUESTION").length,
    notes: posts.filter((p) => p.type === "NOTE").length,
    unanswered: posts.filter(
      (p) => p.type === "QUESTION" && !p.hasStudentAnswer && !p.hasInstructorAnswer
    ).length,
    instructorResponses: posts.filter((p) => p.hasInstructorAnswer).length,
    studentResponses: posts.filter((p) => p.hasStudentAnswer).length,
  };

  return (
    <div className="pazza-class-at-glance">
      <div className="pazza-class-title">CLASS AT A GLANCE</div>

      <div className="pazza-stats-grid">
        <div className="pazza-stat-card">
          <div className="pazza-stat-value">{stats.unanswered}</div>
          <div className="pazza-stat-label">Unanswered Questions</div>
        </div>

        <div className="pazza-stat-card">
          <div className="pazza-stat-value">{stats.totalPosts}</div>
          <div className="pazza-stat-label">Total Posts</div>
        </div>

        <div className="pazza-stat-card">
          <div className="pazza-stat-value">{stats.instructorResponses}</div>
          <div className="pazza-stat-label">Instructor Responses</div>
        </div>

        <div className="pazza-stat-card">
          <div className="pazza-stat-value">{stats.studentResponses}</div>
          <div className="pazza-stat-label">Student Responses</div>
        </div>

        <div className="pazza-stat-card">
          <div className="pazza-stat-value">{enrolledCount}</div>
          <div className="pazza-stat-label">Students Enrolled</div>
        </div>

        <div className="pazza-stat-card">
          <div className="pazza-stat-value">{stats.questions}</div>
          <div className="pazza-stat-label">Questions</div>
        </div>

        <div className="pazza-stat-card">
          <div className="pazza-stat-value">{stats.notes}</div>
          <div className="pazza-stat-label">Notes</div>
        </div>
      </div>
    </div>
  );
}
