/**
 * LIST OF POSTS SIDEBAR
 * Left sidebar showing:
 * - Toggle button to collapse/expand sidebar
 * - Search field
 * - Posts grouped by date (TODAY, YESTERDAY, LAST WEEK, etc.)
 * - Click post to select and view details
 */

"use client";

import { useMemo } from "react";
import "./components.css";

interface Post {
  _id: string;
  summary: string;
  details: string;
  authorName: string;
  authorRole: "STUDENT" | "INSTRUCTOR";
  type: "QUESTION" | "NOTE";
  createdAt: string;
}

interface ListOfPostsSidebarProps {
  posts: Post[];
  selectedPost: Post | null;
  onPostSelect: (post: Post) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isLoading: boolean;
}

/**
 * Group posts by date ranges
 * Returns: { TODAY: [], YESTERDAY: [], LAST_WEEK: [], ...WEEKS }
 */
function groupPostsByDate(posts: Post[]) {
  const groups: { [key: string]: Post[] } = {
    TODAY: [],
    YESTERDAY: [],
    LAST_WEEK: [],
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const weekAgoStart = new Date(todayStart);
  weekAgoStart.setDate(weekAgoStart.getDate() - 7);

  posts.forEach((post) => {
    const postDate = new Date(post.createdAt);
    const postDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());

    if (postDay.getTime() === todayStart.getTime()) {
      groups.TODAY.push(post);
    } else if (postDay.getTime() === yesterdayStart.getTime()) {
      groups.YESTERDAY.push(post);
    } else if (postDay > weekAgoStart) {
      groups.LAST_WEEK.push(post);
    } else {
      // Group by week
      const weekStart = new Date(postDate);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
      weekStart.setDate(diff);

      const monthStart = (weekStart.getMonth() + 1).toString().padStart(2, "0");
      const dateStart = weekStart.getDate().toString().padStart(2, "0");
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const monthEnd = (weekEnd.getMonth() + 1).toString().padStart(2, "0");
      const dateEnd = weekEnd.getDate().toString().padStart(2, "0");

      const weekKey = `${monthStart}/${dateStart} - ${monthEnd}/${dateEnd}`;

      if (!groups[weekKey]) {
        groups[weekKey] = [];
      }
      groups[weekKey].push(post);
    }
  });

  return groups;
}

export default function ListOfPostsSidebar({
  posts,
  selectedPost,
  onPostSelect,
  searchQuery,
  onSearchChange,
  isCollapsed,
  onToggleCollapse,
  isLoading,
}: ListOfPostsSidebarProps) {
  const groupedPosts = useMemo(() => groupPostsByDate(posts), [posts]);

  /**
   * Get preview text (first 60 characters of post details)
   */
  const getPreview = (details: string) => {
    const cleanText = details.replace(/<[^>]*>/g, ""); // Remove HTML tags
    return cleanText.length > 60 ? cleanText.substring(0, 60) + "..." : cleanText;
  };

  /**
   * Format time as HH:MM AM/PM
   */
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  /**
   * Get post type icon
   */
  const getTypeIcon = (type: string) => {
    return type === "QUESTION" ? "❓" : "📌";
  };

  if (isCollapsed) {
    return (
      <div className="pazza-sidebar-collapsed">
        <button className="pazza-sidebar-toggle" onClick={onToggleCollapse} title="Expand">
          ▶
        </button>
      </div>
    );
  }

  return (
    <div className="pazza-sidebar-content">
      {/* Toggle Button */}
      <div className="pazza-sidebar-header">
        <button className="pazza-sidebar-toggle" onClick={onToggleCollapse} title="Collapse">
          ◀
        </button>
      </div>

      {/* Search Field */}
      <div className="pazza-search-container">
        <input
          type="text"
          className="pazza-search-input"
          placeholder="Search or add a post..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Posts List */}
      <div className="pazza-posts-list">
        {isLoading ? (
          <div className="pazza-loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="pazza-empty">No posts yet</div>
        ) : (
          <>
            {/* TODAY */}
            {groupedPosts.TODAY && groupedPosts.TODAY.length > 0 && (
              <div className="pazza-date-group">
                <div className="pazza-date-label">TODAY</div>
                {groupedPosts.TODAY.map((post) => (
                  <div
                    key={post._id}
                    className={`pazza-post-item ${selectedPost?._id === post._id ? "selected" : ""}`}
                    onClick={() => onPostSelect(post)}
                  >
                    <div className="pazza-post-type">{getTypeIcon(post.type)}</div>
                    <div className="pazza-post-content">
                      <div className="pazza-post-title">{post.summary}</div>
                      <div className="pazza-post-preview">{getPreview(post.details)}</div>
                      <div className="pazza-post-meta">
                        by {post.authorName} ({post.authorRole}) - {formatTime(post.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* YESTERDAY */}
            {groupedPosts.YESTERDAY && groupedPosts.YESTERDAY.length > 0 && (
              <div className="pazza-date-group">
                <div className="pazza-date-label">YESTERDAY</div>
                {groupedPosts.YESTERDAY.map((post) => (
                  <div
                    key={post._id}
                    className={`pazza-post-item ${selectedPost?._id === post._id ? "selected" : ""}`}
                    onClick={() => onPostSelect(post)}
                  >
                    <div className="pazza-post-type">{getTypeIcon(post.type)}</div>
                    <div className="pazza-post-content">
                      <div className="pazza-post-title">{post.summary}</div>
                      <div className="pazza-post-preview">{getPreview(post.details)}</div>
                      <div className="pazza-post-meta">
                        by {post.authorName} ({post.authorRole}) - {formatTime(post.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* LAST WEEK */}
            {groupedPosts.LAST_WEEK && groupedPosts.LAST_WEEK.length > 0 && (
              <div className="pazza-date-group">
                <div className="pazza-date-label">LAST WEEK</div>
                {groupedPosts.LAST_WEEK.map((post) => (
                  <div
                    key={post._id}
                    className={`pazza-post-item ${selectedPost?._id === post._id ? "selected" : ""}`}
                    onClick={() => onPostSelect(post)}
                  >
                    <div className="pazza-post-type">{getTypeIcon(post.type)}</div>
                    <div className="pazza-post-content">
                      <div className="pazza-post-title">{post.summary}</div>
                      <div className="pazza-post-preview">{getPreview(post.details)}</div>
                      <div className="pazza-post-meta">
                        by {post.authorName} ({post.authorRole}) - {formatTime(post.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* OLDER WEEKS */}
            {Object.entries(groupedPosts).map(([weekKey, weekPosts]) => {
              if (["TODAY", "YESTERDAY", "LAST_WEEK"].includes(weekKey)) {
                return null; // Skip already rendered groups
              }
              return (
                <div key={weekKey} className="pazza-date-group">
                  <div className="pazza-date-label">{weekKey}</div>
                  {(weekPosts as Post[]).map((post) => (
                    <div
                      key={post._id}
                      className={`pazza-post-item ${selectedPost?._id === post._id ? "selected" : ""}`}
                      onClick={() => onPostSelect(post)}
                    >
                      <div className="pazza-post-type">{getTypeIcon(post.type)}</div>
                      <div className="pazza-post-content">
                        <div className="pazza-post-title">{post.summary}</div>
                        <div className="pazza-post-preview">{getPreview(post.details)}</div>
                        <div className="pazza-post-meta">
                          by {post.authorName} ({post.authorRole}) - {formatTime(post.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
