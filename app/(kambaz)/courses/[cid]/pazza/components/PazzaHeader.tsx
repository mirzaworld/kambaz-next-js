"use client";

import { useState } from "react";

interface PazzaHeaderProps {
  courseId: string;
  courseInfo: any;
  currentUser: any;
  activeTab: "qa" | "resources" | "statistics" | "manage";
  onTabChange: (tab: "qa" | "resources" | "statistics" | "manage") => void;
  onNewPost?: () => void;
}

export default function PazzaHeader({
  courseId,
  courseInfo,
  currentUser,
  activeTab,
  onTabChange,
  onNewPost,
}: PazzaHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check if user has instructor privileges (faculty, admin, or ta only)
  const isInstructor = ["FACULTY", "ADMIN", "TA"].includes(currentUser?.role?.toUpperCase() || "");
  const userName = `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim();

  // Debug logging
  console.log("PazzaHeader - Current User:", currentUser);
  console.log("PazzaHeader - User Role:", currentUser?.role);
  console.log("PazzaHeader - Is Instructor:", isInstructor);
  console.log("PazzaHeader - User Name:", userName);

  return (
    <>
      <div className="pazza-header-bar">
        <div className="pazza-header-content">
          {/* Logo */}
          <div className="pazza-logo">pazza</div>

          {/* Course Info */}
          <div className="pazza-course-info">
            <span className="pazza-course-code">{courseInfo?.number || courseId}</span>
          </div>

          {/* Navigation Tabs */}
          <div className="pazza-nav-tabs">
            <button
              className={`pazza-nav-tab ${activeTab === "qa" ? "active" : ""}`}
              onClick={() => onTabChange("qa")}
            >
              Q & A
            </button>
            <button
              className={`pazza-nav-tab ${activeTab === "resources" ? "active" : ""}`}
              onClick={() => onTabChange("resources")}
            >
              Resources
            </button>
            <button
              className={`pazza-nav-tab ${activeTab === "statistics" ? "active" : ""}`}
              onClick={() => onTabChange("statistics")}
            >
              Statistics
            </button>
            {isInstructor && (
              <button
                className={`pazza-nav-tab ${activeTab === "manage" ? "active" : ""}`}
                onClick={() => onTabChange("manage")}
              >
                Manage Class
              </button>
            )}
          </div>

          {/* Right Section: New Post + User Menu */}
          <div className="pazza-header-actions">
            <button
              className="pazza-new-post-btn"
              onClick={() => onNewPost?.()}
            >
              + New Post
            </button>

            <div className="pazza-user-section">
              <button
                className="pazza-user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="pazza-user-avatar">
                  {(currentUser?.firstName?.charAt(0) || "U").toUpperCase()}
                </span>
                <span className="pazza-user-name">
                  {userName || currentUser?.username || "User"}
                </span>
              </button>

              {showUserMenu && (
                <div className="pazza-user-dropdown">
                  <div className="pazza-dropdown-item">
                    Profile ({currentUser?.role || "User"})
                  </div>
                  <div className="pazza-dropdown-item">Settings</div>
                  <div className="pazza-dropdown-divider"></div>
                  <div
                    className="pazza-dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
