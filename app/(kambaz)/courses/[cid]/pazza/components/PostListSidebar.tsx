"use client";

import { useMemo, useState } from "react";

interface Post {
  _id: string;
  courseId: string;
  authorId: string;
  summary: string;
  type: "QUESTION" | "NOTE";
  authorName: string;
  authorRole: "STUDENT" | "USER" | "INSTRUCTOR" | "FACULTY" | "TA" | "ADMIN";
  hasStudentAnswer: boolean;
  hasInstructorAnswer: boolean;
  createdAt: string;
  viewCount: number;
  details: string;
  folders: string[];
  isPinned?: boolean;
  visibility?: "ENTIRE_CLASS" | "SELECTED_STUDENTS";
  goodQuestionCount?: number;
  hasGoodAnswer?: boolean;
}

interface PostListSidebarProps {
  posts: Post[];
  selectedPost: Post | null;
  onPostSelect: (post: Post) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  isLoading: boolean;
  onNewPost: () => void;
  currentUser?: any;
  sidebarOpen: boolean;
  onToggleSidebar: (open: boolean) => void;
}

const startOfWeek = (date: Date) => {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = (day + 6) % 7; // Monday as start of week
  copy.setDate(copy.getDate() - diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const formatWeekRangeLabel = (date: Date) => {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const formatOptions: Intl.DateTimeFormatOptions = { month: "numeric", day: "numeric" };
  const startLabel = start.toLocaleDateString(undefined, formatOptions);
  const endLabel = end.toLocaleDateString(undefined, formatOptions);

  return `${startLabel} - ${endLabel}`;
};

export default function PostListSidebar({
  posts,
  selectedPost,
  onPostSelect,
  onSearchChange,
  searchQuery,
  isLoading,
  onNewPost,
  currentUser,
  sidebarOpen,
  onToggleSidebar,
}: PostListSidebarProps) {
  const [filterBy, setFilterBy] = useState<"all" | "unread" | "updated" | "unresolved" | "following">("all");
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    "PINNED POST": true,
    TODAY: true,
    YESTERDAY: true,
    "LAST WEEK": true,
  });
  const isInstructor = currentUser?.role === "INSTRUCTOR" || currentUser?.role === "FACULTY";

  const startOfToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const startOfYesterday = useMemo(() => {
    const yesterday = new Date(startOfToday);
    yesterday.setDate(startOfToday.getDate() - 1);
    return yesterday;
  }, [startOfToday]);

  const startOfCurrentWeek = useMemo(() => startOfWeek(new Date()), []);

  const startOfLastWeek = useMemo(() => {
    const copy = new Date(startOfCurrentWeek);
    copy.setDate(copy.getDate() - 7);
    return copy;
  }, [startOfCurrentWeek]);

  const endOfLastWeek = useMemo(() => {
    const end = new Date(startOfCurrentWeek);
    end.setMilliseconds(-1);
    return end;
  }, [startOfCurrentWeek]);

  const groupedData = useMemo(() => {
    const now = new Date();
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const pinnedPosts = sorted.filter((p) => p.isPinned);
    let result = sorted.filter((p) => !p.isPinned);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const plainDetails = (p.details || "").replace(/<[^>]*>/g, "").toLowerCase();
        return (
          p.summary.toLowerCase().includes(query) ||
          p.authorName.toLowerCase().includes(query) ||
          plainDetails.includes(query)
        );
      });
    }

    if (filterBy === "unresolved") {
      result = result.filter(
        (p) => p.type === "QUESTION" && !p.hasStudentAnswer && !p.hasInstructorAnswer
      );
    }

    const groups: Record<string, Post[]> = {};
    const sortKeyBySection: Record<string, number> = {};

    if (pinnedPosts.length) {
      groups["PINNED POST"] = pinnedPosts;
      sortKeyBySection["PINNED POST"] = Number.MAX_SAFE_INTEGER;
    }

    result.forEach((post) => {
      const postDate = new Date(post.createdAt);
      let sectionLabel = "OLDER";
      let sortKey = startOfWeek(postDate).getTime();

      if (postDate >= startOfToday) {
        sectionLabel = "TODAY";
        sortKey = startOfToday.getTime();
      } else if (postDate >= startOfYesterday) {
        sectionLabel = "YESTERDAY";
        sortKey = startOfYesterday.getTime();
      } else if (postDate >= startOfLastWeek && postDate <= endOfLastWeek) {
        sectionLabel = "LAST WEEK";
        sortKey = startOfLastWeek.getTime();
      } else {
        const weekStart = startOfWeek(postDate);
        sectionLabel = formatWeekRangeLabel(weekStart);
        sortKey = weekStart.getTime();
      }

      if (!groups[sectionLabel]) {
        groups[sectionLabel] = [];
        sortKeyBySection[sectionLabel] = sortKey;
      }

      groups[sectionLabel].push(post);
    });

    const baseOrder = ["PINNED POST", "TODAY", "YESTERDAY", "LAST WEEK"]
      .filter((section) => groups[section]);

    const weekSections = Object.keys(groups)
      .filter((section) => !baseOrder.includes(section))
      .sort((a, b) => (sortKeyBySection[b] || 0) - (sortKeyBySection[a] || 0));

    const sectionOrder = [...baseOrder, ...weekSections];

    return { groups, sectionOrder };
  }, [posts, searchQuery, filterBy, startOfToday, startOfYesterday, startOfLastWeek, endOfLastWeek]);

  const totalVisiblePosts = groupedData.sectionOrder.reduce(
    (count, section) => count + (groupedData.groups[section]?.length || 0),
    0
  );

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
          onClick={() => onToggleSidebar(true)}
        >
          ▶
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
          onClick={() => onToggleSidebar(false)}
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

      {/* Actions Dropdown */}
      {isInstructor && (
        <div className="pazza-actions-row">
          <button className="pazza-actions-btn">
            Actions ▾
          </button>
        </div>
      )}

      {/* Posts List */}
      <div className="pazza-posts-list">
        {isLoading ? (
          <div className="pazza-loading">Loading posts...</div>
        ) : totalVisiblePosts === 0 ? (
          <div className="pazza-empty">No posts yet</div>
        ) : (
          groupedData.sectionOrder.map((section) => {
            const sectionPosts = groupedData.groups[section] || [];
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
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <div
                        className="pazza-post-content"
                        onClick={() => onPostSelect(post)}
                      >
                        <div className="pazza-post-header-row">
                          <div className="pazza-post-badges">
                            {post.authorRole === "INSTRUCTOR" && (
                              <span className="pazza-badge pazza-badge-instructor">INSTRUCTOR</span>
                            )}
                            {post.visibility === "SELECTED_STUDENTS" && (
                              <span className="pazza-badge pazza-badge-private">PRIVATE</span>
                            )}
                          </div>
                          <div className="pazza-post-title">{post.summary}</div>
                          <div className="pazza-post-time-inline">
                            {(() => {
                              const postDate = new Date(post.createdAt);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const postDay = new Date(postDate);
                              postDay.setHours(0, 0, 0, 0);
                              
                              if (postDay.getTime() === today.getTime()) {
                                // Show time if posted today
                                return postDate.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                              }

                              if (postDay >= startOfLastWeek && postDay <= endOfLastWeek) {
                                // Show weekday (e.g., Mon) for posts in the last week bucket
                                return postDate.toLocaleDateString([], {
                                  weekday: "short",
                                });
                              }

                              // Show date for anything older than last week
                              return postDate.toLocaleDateString([], {
                                month: "numeric",
                                day: "numeric",
                              });
                            })()}
                          </div>
                        </div>
                        {(() => {
                          let text = post.details
                            ? post.details.replace(/<[^>]*>/g, "").trim()
                            : "";
                          
                          // Remove standalone "0"
                          text = text.replace(/\b0\b/g, '').trim();
                          text = text.replace(/\s{2,}/g, ' ').trim();
                          
                          // Only render if there's actual content
                          if (!text || text.length === 0) {
                            return null;
                          }
                          
                          const truncated = text.slice(0, 80) + (text.length > 80 ? "..." : "");
                          return (
                            <div className="pazza-post-description">
                              {truncated}
                            </div>
                          );
                        })()}
                        {(post.goodQuestionCount || 0) > 0 && (
                          <div className="pazza-post-instructor-tag">
                            ♦ An instructor thinks this is a good question
                          </div>
                        )}
                        {post.hasGoodAnswer && (
                          <div className="pazza-post-instructor-tag">
                            ♦ An instructor thinks this is a good answer
                          </div>
                        )}
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
