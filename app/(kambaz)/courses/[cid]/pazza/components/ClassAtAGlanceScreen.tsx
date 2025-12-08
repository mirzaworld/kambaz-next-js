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
  courseId: string;
}

export default function ClassAtAGlanceScreen({ posts, courseId }: ClassAtAGlanceScreenProps) {
  const [enrolledCount, setEnrolledCount] = useState(0);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  useEffect(() => {
    const loadEnrollmentCount = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/courses/${courseId}/users`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Unable to load enrollment");
        }
        const users = await response.json();
        setEnrolledCount((users || []).length);
      } catch (error) {
        setEnrolledCount(0);
        console.error("Error loading enrollment count:", error);
      }
    };

    loadEnrollmentCount();
  }, [SERVER_URL, courseId]);

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
