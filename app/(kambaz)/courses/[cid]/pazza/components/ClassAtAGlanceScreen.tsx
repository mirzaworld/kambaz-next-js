"use client";

import { useEffect, useState } from "react";
import "./components.css";

interface ClassAtAGlanceScreenProps {
  courseId: string;
}

interface Stats {
  totalPosts: number;
  unansweredQuestions: number;
  instructorResponses: number;
  studentResponses: number;
  unresolvedFollowups: number;
}

export default function ClassAtAGlanceScreen({ courseId }: ClassAtAGlanceScreenProps) {
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    unansweredQuestions: 0,
    instructorResponses: 0,
    studentResponses: 0,
    unresolvedFollowups: 0,
  });

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/courses/${courseId}/pazza/stats`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };

    const loadEnrollmentCount = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/courses/${courseId}/users`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Unable to load enrollment");
        }
        const users = await response.json();
        const students = (users || []).filter((user: { role?: string }) => user.role === "STUDENT");
        setEnrolledCount(students.length);
      } catch (error) {
        setEnrolledCount(0);
        console.error("Error loading enrollment count:", error);
      }
    };

    const loadTotalStudents = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/users`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Unable to load users");
        }
        const users = await response.json();
        const students = (users || []).filter((user: { role?: string }) => user.role === "STUDENT");
        setTotalStudents(students.length);
      } catch (error) {
        setTotalStudents(0);
        console.error("Error loading total students:", error);
      }
    };

    loadStats();
    loadEnrollmentCount();
    loadTotalStudents();
  }, [SERVER_URL, courseId]);

  const unreadPosts = 0; // Tracking unread posts would require additional state
  const hasNoUnreadPosts = unreadPosts === 0;
  const hasNoUnansweredQuestions = stats.unansweredQuestions === 0;
  const hasNoUnresolvedFollowups = stats.unresolvedFollowups === 0;

  const enrollmentPercentage = totalStudents > 0 ? (enrolledCount / totalStudents) * 100 : 0;

  return (
    <div className="pazza-class-at-glance-screen">
      <h2 className="glance-title">Class at a Glance</h2>
      <p className="glance-updated">Updated 10 seconds ago. <a href="#" className="glance-reload">Reload</a></p>

      <div className="glance-content">
        {/* Left Column - Status Items with Checkmarks */}
        <div className="glance-status-column">
          <div className="glance-status-item">
            <span className={`glance-checkmark ${hasNoUnreadPosts ? 'visible' : 'hidden'}`}>✓</span>
            <span className="glance-status-text">
              {hasNoUnreadPosts ? "no unread posts" : `${unreadPosts} unread post${unreadPosts !== 1 ? 's' : ''}`}
            </span>
          </div>

          <div className="glance-status-item">
            <span className={`glance-checkmark ${hasNoUnansweredQuestions ? 'visible' : 'hidden'}`}>✓</span>
            <span className="glance-status-text">
              {hasNoUnansweredQuestions ? "no unanswered questions" : `${stats.unansweredQuestions} unanswered question${stats.unansweredQuestions !== 1 ? 's' : ''}`}
            </span>
          </div>

          <div className="glance-status-item">
            <span className={`glance-checkmark ${hasNoUnresolvedFollowups ? 'visible' : 'hidden'}`}>✓</span>
            <span className="glance-status-text">
              {hasNoUnresolvedFollowups ? "no unanswered followups" : `${stats.unresolvedFollowups} unresolved followup${stats.unresolvedFollowups !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="glance-stats-column">
          <div className="glance-stat-row">
            <span className="glance-stat-label">total posts</span>
            <span className="glance-stat-value">{stats.totalPosts}</span>
          </div>

          <div className="glance-stat-row">
            <span className="glance-stat-label">instructor responses</span>
            <span className="glance-stat-value">{stats.instructorResponses}</span>
          </div>

          <div className="glance-stat-row">
            <span className="glance-stat-label">students' responses</span>
            <span className="glance-stat-value">{stats.studentResponses}</span>
          </div>
        </div>
      </div>

      {/* Student Enrollment Section */}
      <div className="glance-enrollment-section">
        <div className="glance-enrollment-header">
          <span className="glance-enrollment-title">Student Enrollment</span>
        </div>
        <div className="glance-enrollment-bar-container">
          <div 
            className="glance-enrollment-bar" 
            style={{ width: `${enrollmentPercentage}%` }}
          />
        </div>
        <div className="glance-enrollment-text">
          {enrolledCount} enrolled out of {totalStudents || "—"}
          <a href="#" className="glance-edit-link">Edit</a>
        </div>
      </div>
    </div>
  );
}