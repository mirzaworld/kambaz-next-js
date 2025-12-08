"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NewPostModal from "./NewPostModal";
import ManageClassModal from "./ManageClassModal";
import "./components.css";

interface Folder {
  _id: string;
  name: string;
}

interface PazzaNavBarProps {
  courseId: string;
  onPostCreated: () => void;
  onFoldersUpdated: () => void;
  folders: Folder[];
}

export default function PazzaNavBar({ courseId, onPostCreated, onFoldersUpdated, folders }: PazzaNavBarProps) {
  const currentUser = useSelector((state: any) => state.accountReducer?.currentUser);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"qa" | "manage">("qa");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showManageClassModal, setShowManageClassModal] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
  // Check if user has instructor privileges (faculty, admin, or ta)
  const isInstructor = ["FACULTY", "ADMIN", "TA"].includes(currentUser?.role?.toUpperCase() || "");

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

  const handleNewPostClick = () => {
    setShowNewPostModal(true);
  };

  const handlePostSubmitted = () => {
    setShowNewPostModal(false);
    onPostCreated();
  };

  const handleManageClassClick = () => {
    setActiveTab("manage");
    setShowManageClassModal(true);
  };

  const handleCloseManageClass = () => {
    setShowManageClassModal(false);
    setActiveTab("qa");
  };

  return (
    <>
      <div className="pazza-navbar">
        <div className="pazza-navbar-left">
          <div className="pazza-logo">📝 Pazza</div>
          <div className="pazza-course-name">Course: {currentCourse?.name || "Loading..."}</div>
        </div>

        <div className="pazza-navbar-tabs">
          <button
            className={`pazza-tab ${activeTab === "qa" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("qa");
              setShowManageClassModal(false);
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

      {activeTab === "qa" && !showManageClassModal && (
        <div className="pazza-action-bar">
          <button className="pazza-btn-new-post" onClick={handleNewPostClick}>
            ➕ New Post
          </button>
        </div>
      )}

      {showNewPostModal && (
        <NewPostModal
          courseId={courseId}
          folders={folders}
          onSubmit={handlePostSubmitted}
          onCancel={() => setShowNewPostModal(false)}
        />
      )}

      {showManageClassModal && isInstructor && (
        <ManageClassModal
          courseId={courseId}
          folders={folders}
          currentUser={currentUser}
          onClose={handleCloseManageClass}
          onFoldersUpdated={() => {
            onFoldersUpdated();
            setActiveTab("qa");
          }}
        />
      )}
    </>
  );
}
