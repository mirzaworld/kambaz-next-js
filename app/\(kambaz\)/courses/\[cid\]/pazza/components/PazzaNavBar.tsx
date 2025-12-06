/**
 * PAZZA NAVIGATION BAR
 * Fixed top bar showing:
 * - Pazza logo/title
 * - Course name
 * - Q&A and Manage Class tabs
 * - Current user name
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NewPostScreen from "./NewPostScreen";
import ManageClassScreen from "./ManageClassScreen";
import "./components.css";

interface Folder {
  _id: string;
  name: string;
}

interface PazzaNavBarProps {
  courseId: string;
  onPostCreated: () => void;
  folders: Folder[];
}

export default function PazzaNavBar({ courseId, onPostCreated, folders }: PazzaNavBarProps) {
  const { data: session } = useSession();
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"qa" | "manage">("qa");
  const [showNewPostScreen, setShowNewPostScreen] = useState(false);
  const [showManageClassScreen, setShowManageClassScreen] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
  const currentUser = session?.user as any;
  const isInstructor = currentUser?.role === "INSTRUCTOR";

  /**
   * Fetch course details to display name
   */
  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/courses`, {
        credentials: "include",
      });
      const courses = await response.json();
      const course = courses.find((c: any) => c._id === courseId);
      setCurrentCourse(course);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  /**
   * Handle New Post button click
   */
  const handleNewPostClick = () => {
    setShowNewPostScreen(true);
  };

  /**
   * Handle New Post submission
   */
  const handlePostSubmitted = () => {
    setShowNewPostScreen(false);
    onPostCreated();
  };

  /**
   * Handle Manage Class click (instructor only)
   */
  const handleManageClassClick = () => {
    setActiveTab("manage");
    setShowManageClassScreen(true);
  };

  /**
   * Handle close Manage Class
   */
  const handleCloseManageClass = () => {
    setShowManageClassScreen(false);
    setActiveTab("qa");
  };

  return (
    <>
      {/* Navigation Bar */}
      <div className="pazza-navbar">
        <div className="pazza-navbar-left">
          <div className="pazza-logo">📝 Pazza</div>
          <div className="pazza-course-name">
            Course: {currentCourse?.name || "Loading..."}
          </div>
        </div>

        <div className="pazza-navbar-tabs">
          <button
            className={`pazza-tab ${activeTab === "qa" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("qa");
              setShowManageClassScreen(false);
            }}
          >
            Q&A
          </button>

          {isInstructor && (
            <button
              className={`pazza-tab ${activeTab === "manage" ? "active" : ""}`}
              onClick={handleManageClassClick}
            >
              Manage Class
            </button>
          )}
        </div>

        <div className="pazza-navbar-right">
          <div className="pazza-user-name">
            {currentUser?.firstName} {currentUser?.lastName}
          </div>
          <div className="pazza-user-role">({currentUser?.role})</div>
        </div>
      </div>

      {/* New Post Button (visible in Q&A tab) */}
      {activeTab === "qa" && !showManageClassScreen && (
        <div className="pazza-action-bar">
          <button className="pazza-btn-new-post" onClick={handleNewPostClick}>
            ➕ New Post
          </button>
        </div>
      )}

      {/* Modals */}
      {showNewPostScreen && (
        <NewPostScreen
          courseId={courseId}
          folders={folders}
          onSubmit={handlePostSubmitted}
          onCancel={() => setShowNewPostScreen(false)}
        />
      )}

      {showManageClassScreen && isInstructor && (
        <ManageClassScreen
          courseId={courseId}
          folders={folders}
          onClose={handleCloseManageClass}
          onFoldersUpdated={() => {
            // Refetch folders in parent component
          }}
        />
      )}
    </>
  );
}
