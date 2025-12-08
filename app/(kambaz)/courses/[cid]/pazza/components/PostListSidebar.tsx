"use client";

import { useMemo, useState } from "react";

interface Post {
  _id: string;
  courseId: string;
  authorId: string;
  summary: string;
  type: "QUESTION" | "NOTE";
  authorName: string;
  authorRole: "STUDENT" | "INSTRUCTOR";
  hasStudentAnswer: boolean;
  hasInstructorAnswer: boolean;
  createdAt: string;
  viewCount: number;
  details: string;
  folders: string[];
  isPinned?: boolean;
  visibility?: "ENTIRE_CLASS" | "SELECTED_STUDENTS";
}

interface PostListSidebarProps {
  posts: Post[];
  selectedPost: Post | null;
  onPostSelect: (post: Post) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  isLoading: boolean;
  onNewPost: () => void;
  onPinPosts?: (postIds: string[]) => void;
  onUnpinPosts?: (postIds: string[]) => void;
  currentUser?: any;
}

function getDateCategory(date: Date, now: Date) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const postDate = new Date(date);
  postDate.setHours(0, 0, 0, 0);

  if (postDate.getTime() === today.getTime()) return "TODAY";
  if (postDate.getTime() === yesterday.getTime()) return "YESTERDAY";
  
  const diffDays = (today.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays <= 7) return "LAST WEEK";
  
  return "OLDER";
}

function groupPosts(posts: Post[]) {
  const now = new Date();
  const groups: { [key: string]: Post[] } = {
    PINNED: [],
    TODAY: [],
    YESTERDAY: [],
    "LAST WEEK": [],
    OLDER: [],
  };

  for (const post of posts) {
    const cat = getDateCategory(new Date(post.createdAt), now);
    if (groups[cat]) {
      groups[cat].push(post);
    }
  }

  return groups;
}

const groupPostsBySection = (posts: Post[]) => {
  const now = new Date();
  const grouped: { [key: string]: Post[] } = {
    PINNED: [],
    TODAY: [],
    YESTERDAY: [],
    "LAST WEEK": [],
    OLDER: [],
  };

  posts.forEach((post) => {
    if (post.isPinned) {
      grouped.PINNED.push(post);
    } else {
      const section = getDateCategory(new Date(post.createdAt), now);
      if (grouped[section]) {
        grouped[section].push(post);
      }
    }
  });

  return grouped;
};

export default function PostListSidebar({
  posts,
  selectedPost,
  onPostSelect,
  onSearchChange,
  searchQuery,
  isLoading,
  onNewPost,
  onPinPosts,
  onUnpinPosts,
  currentUser,
}: PostListSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterBy, setFilterBy] = useState<"all" | "unread" | "updated" | "unresolved" | "following">("all");
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    PINNED: true,
    TODAY: true,
    YESTERDAY: true,
    "LAST WEEK": true,
  });
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const isInstructor = currentUser?.role === "INSTRUCTOR" || currentUser?.role === "FACULTY";

  const handleTogglePostSelection = (postId: string) => {
    setSelectedPostIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handlePinSelected = async () => {
    if (selectedPostIds.size > 0 && onPinPosts) {
      await onPinPosts(Array.from(selectedPostIds));
      setSelectedPostIds(new Set());
      setShowActionsMenu(false);
    }
  };

  const handleUnpinSelected = async () => {
    if (selectedPostIds.size > 0 && onUnpinPosts) {
      await onUnpinPosts(Array.from(selectedPostIds));
      setSelectedPostIds(new Set());
      setShowActionsMenu(false);
    }
  };

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterBy === "unresolved") {
      result = result.filter(
        (p) => p.type === "QUESTION" && !p.hasStudentAnswer && !p.hasInstructorAnswer
      );
    }

    return result;
  }, [posts, searchQuery, filterBy]);

  const grouped = groupPostsBySection(filteredPosts);
  const sectionOrder = ["PINNED", "TODAY", "YESTERDAY", "LAST WEEK", "OLDER"];

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!sidebarOpen) {
    return (
      <div className="pazza-post-list-sidebar pazza-sidebar-collapsed">
        <button
          className="pazza-sidebar-toggle"
          title="Show sidebar"
          onClick={() => setSidebarOpen(true)}
        >
          ◀
        </button>
      </div>
    );
  }

  return (
    <div className="pazza-post-list-sidebar">
      {/* Top Filter Bar */}
      <div className="pazza-sidebar-top-bar">
        <button
          className="pazza-sidebar-toggle"
          title="Hide sidebar"
          onClick={() => setSidebarOpen(false)}
        >
          ◀
        </button>
        <button
          className={`pazza-filter-button ${filterBy === "unread" ? "active" : ""}`}
          onClick={() => setFilterBy("unread")}
        >
          Unread
        </button>
        <button
          className={`pazza-filter-button ${filterBy === "updated" ? "active" : ""}`}
          onClick={() => setFilterBy("updated")}
        >
          Updated
        </button>
        <button
          className={`pazza-filter-button ${filterBy === "unresolved" ? "active" : ""}`}
          onClick={() => setFilterBy("unresolved")}
        >
          Unresolved
        </button>
        <button
          className={`pazza-filter-button ${filterBy === "following" ? "active" : ""}`}
          onClick={() => setFilterBy("following")}
        >
          Following
        </button>
        <button className="pazza-info-dropdown" title="More options">
          ℹ️
        </button>
      </div>

      {/* New Post and Search Row */}
      <div className="pazza-new-post-search-row">
        <button className="pazza-new-post-btn-inline" onClick={onNewPost}>
          📝 New Post
        </button>
        <input
          type="text"
          className="pazza-search-input-inline"
          placeholder="Search or add a post..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Show Actions with Pin/Unpin */}
      {isInstructor && (
        <div className="pazza-show-actions-row">
          <div className="pazza-actions-dropdown-container">
            <button 
              className="pazza-actions-btn"
              onClick={() => setShowActionsMenu(!showActionsMenu)}
            >
              Actions {selectedPostIds.size > 0 && `(${selectedPostIds.size})`} ▾
            </button>
            {showActionsMenu && selectedPostIds.size > 0 && (
              <div className="pazza-sidebar-actions-menu">
                <button className="pazza-sidebar-action-item" onClick={handlePinSelected}>
                  📌 Pin selected posts
                </button>
                <button className="pazza-sidebar-action-item" onClick={handleUnpinSelected}>
                  📌 Unpin selected posts
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="pazza-posts-list">
        {isLoading ? (
          <div className="pazza-loading">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="pazza-empty">No posts yet</div>
        ) : (
          sectionOrder.map((section) => {
            const sectionPosts = grouped[section] || [];
            if (sectionPosts.length === 0) return null;

            return (
              <div key={section} className="pazza-post-section">
                <div
                  className="pazza-section-header"
                  onClick={() => toggleSection(section)}
                >
                  <span className="pazza-section-toggle">
                    {openSections[section] !== false ? "▼" : "▶"}
                  </span>
                  <span className="pazza-section-label">{section}</span>
                  {section === "PINNED" && (
                    <span className="pazza-section-icon">📄</span>
                  )}
                </div>
                {(openSections[section] !== false) &&
                  sectionPosts.map((post) => (
                    <div
                      key={post._id}
                      className={`pazza-post-item ${
                        selectedPost?._id === post._id ? "selected" : ""
                      }`}
                    >
                      {isInstructor && (
                        <input
                          type="checkbox"
                          className="pazza-post-checkbox"
                          checked={selectedPostIds.has(post._id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleTogglePostSelection(post._id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <div 
                        className="pazza-post-content-area"
                        onClick={() => onPostSelect(post)}
                      >
                        <div className="pazza-post-badges">
                          {section === "PINNED" && (
                            <span className="pazza-badge pazza-badge-pinned">pinned</span>
                          )}
                          {post.authorRole === "INSTRUCTOR" && (
                            <span className="pazza-badge pazza-badge-instructor">instructor</span>
                          )}
                          {post.visibility === "SELECTED_STUDENTS" && (
                            <span className="pazza-badge pazza-badge-private">private</span>
                          )}
                        </div>
                        <div className="pazza-post-header">
                          <div className="pazza-post-title">{post.summary}</div>
                          <div className="pazza-post-time">
                            {new Date(post.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className="pazza-post-description">
                          {post.details 
                            ? post.details.replace(/<[^>]*>/g, '').slice(0, 80) + (post.details.length > 80 ? '...' : '')
                            : "No description"}
                        </div>
                        <div className="pazza-post-footer">
                          <span className="pazza-post-comments">
                            {post.hasInstructorAnswer ? "✓ Answered" : "0 comments"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
