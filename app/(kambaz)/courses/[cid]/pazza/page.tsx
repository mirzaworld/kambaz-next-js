"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import PazzaHeader from "./components/PazzaHeader";
import FolderTabs from "./components/FolderTabs";
import PostListSidebar from "./components/PostListSidebar";
import NewPostModal from "./components/NewPostModal";
import PostDetailView from "./components/PostDetailView";
import ManageClassModal from "./components/ManageClassModal";
import "./pazza.css";

interface Post {
  _id: string;
  courseId: string;
  authorId: string;
  authorName: string;
  authorRole: "STUDENT" | "INSTRUCTOR";
  type: "QUESTION" | "NOTE";
  summary: string;
  details: string;
  folders: string[];
  visibility?: "ENTIRE_CLASS" | "SELECTED_STUDENTS";
  visibleToUserIds?: string[];
  viewCount: number;
  hasStudentAnswer: boolean;
  hasInstructorAnswer: boolean;
  createdAt: string;
  isPinned?: boolean;
}

interface Folder {
  _id: string;
  courseId: string;
  name: string;
  createdAt: string;
}

export default function PazzaPage() {
  const params = useParams();
  const cid = params.cid as string;
  const currentUser = useSelector((state: any) => state.accountReducer?.currentUser);

  const [posts, setPosts] = useState<Post[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeFolder, setActiveFolder] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"qa" | "resources" | "statistics" | "manage">("qa");
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // const [filterBy, setFilterBy] = useState<"unread" | "updated" | "unresolved" | "following" | "all">("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [showManageClass, setShowManageClass] = useState(false);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [activeRightTab, setActiveRightTab] = useState<"post" | "newpost">("post");
  const [openTabs, setOpenTabs] = useState<Array<{id: string, type: "post" | "newpost", title: string}>>([]);

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  useEffect(() => {
    fetchData();
  }, [cid]);

  const fetchData = async () => {
    try {
      setIsLoadingPosts(true);

      // Fetch posts
      let url = `${SERVER_URL}/api/courses/${cid}/pazza/posts`;
      if (activeFolder) {
        url += `?folder=${activeFolder}`;
      }
      const postsResponse = await fetch(url, {
        credentials: "include",
      });
      const postsData = await postsResponse.json();
      setPosts(postsData);

      // Fetch folders
      const foldersResponse = await fetch(`${SERVER_URL}/api/courses/${cid}/pazza/folders`, {
        credentials: "include",
      });
      const foldersData = await foldersResponse.json();
      setFolders(foldersData);

      if (activeFolder === "" && foldersData.length > 0) {
        setActiveFolder(foldersData[0].name);
      }

      // Fetch course info
      const courseResponse = await fetch(`${SERVER_URL}/api/courses/${cid}`, {
        credentials: "include",
      });
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourseInfo(courseData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handlePostSelect = async (post: Post) => {
    setSelectedPost(post);
    setActiveRightTab("post");
    
    // Add post tab if not already open
    const postTabExists = openTabs.find(tab => tab.type === "post" && tab.id === post._id);
    if (!postTabExists) {
      setOpenTabs(prev => [...prev.filter(t => t.type !== "post"), { id: post._id, type: "post", title: post.summary.slice(0, 30) }]);
    }
    
    try {
      // Increment view count
      await fetch(`${SERVER_URL}/api/courses/${cid}/pazza/posts/${post._id}`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("Error updating post view:", error);
    }
  };

  const handleNewPostClick = () => {
    setShowNewPost(true);
    setActiveRightTab("newpost");
    
    // Add new post tab if not already open
    const newPostTabExists = openTabs.find(tab => tab.type === "newpost");
    if (!newPostTabExists) {
      setOpenTabs(prev => [...prev, { id: "newpost", type: "newpost", title: "New Post" }]);
    }
  };

  const handleCloseTab = (tabId: string) => {
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    if (tabId === "newpost") {
      setShowNewPost(false);
      if (selectedPost) {
        setActiveRightTab("post");
      }
    } else if (selectedPost?._id === tabId) {
      setSelectedPost(null);
      const remainingTab = openTabs.find(tab => tab.id !== tabId);
      if (remainingTab?.type === "newpost") {
        setActiveRightTab("newpost");
      }
    }
  };

  const handlePostCreated = () => {
    fetchData();
    setShowNewPost(false);
    setOpenTabs(prev => prev.filter(tab => tab.type !== "newpost"));
  };

  const handlePostDeleted = () => {
    if (selectedPost) {
      setOpenTabs(prev => prev.filter(tab => tab.id !== selectedPost._id));
    }
    setSelectedPost(null);
    fetchData();
  };

  const handlePostUpdated = () => {
    fetchData();
  };

  const handleFoldersUpdated = () => {
    fetchData();
  };

  const handlePinPosts = async (postIds: string[]) => {
    try {
      for (const postId of postIds) {
        await fetch(`${SERVER_URL}/api/courses/${cid}/pazza/posts/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isPinned: true }),
        });
      }
      fetchData();
    } catch (error) {
      console.error("Error pinning posts:", error);
    }
  };

  const handleUnpinPosts = async (postIds: string[]) => {
    try {
      for (const postId of postIds) {
        await fetch(`${SERVER_URL}/api/courses/${cid}/pazza/posts/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isPinned: false }),
        });
      }
      fetchData();
    } catch (error) {
      console.error("Error unpinning posts:", error);
    }
  };

  return (
    <div className="pazza-page">
      <PazzaHeader
        courseId={cid}
        courseInfo={courseInfo}
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewPost={handleNewPostClick}
      />

      {activeTab === "qa" && (
        <>
          <FolderTabs
            folders={folders}
            activeFolder={activeFolder}
            onFolderChange={setActiveFolder}
          />

          <div className="pazza-layout">
            <PostListSidebar
              posts={posts}
              selectedPost={selectedPost}
              onPostSelect={handlePostSelect}
              onSearchChange={setSearchQuery}
              searchQuery={searchQuery}
              isLoading={isLoadingPosts}
              onNewPost={handleNewPostClick}
              onPinPosts={handlePinPosts}
              onUnpinPosts={handleUnpinPosts}
              currentUser={currentUser}
            />

            <div className="pazza-right-panel">
              {/* Tab Bar */}
              {openTabs.length > 0 && (
                <div className="pazza-tabs-bar">
                  {openTabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`pazza-tab ${activeRightTab === tab.type && (tab.type === "newpost" || selectedPost?._id === tab.id) ? "active" : ""}`}
                      onClick={() => {
                        if (tab.type === "post") {
                          const post = posts.find(p => p._id === tab.id);
                          if (post) {
                            setSelectedPost(post);
                            setActiveRightTab("post");
                          }
                        } else {
                          setActiveRightTab("newpost");
                        }
                      }}
                    >
                      <span className="pazza-tab-title">{tab.title}</span>
                      <button
                        className="pazza-tab-close"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseTab(tab.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Content Area */}
              <div className="pazza-tab-content">
                {activeRightTab === "post" && (
                  <PostDetailView
                    selectedPost={selectedPost}
                    courseId={cid}
                    currentUser={currentUser}
                    onPostDeleted={handlePostDeleted}
                    onPostUpdated={handlePostUpdated}
                  />
                )}

                {activeRightTab === "newpost" && showNewPost && (
                  <NewPostModal
                    courseId={cid}
                    courseName={courseInfo?.name}
                    onClose={() => {
                      setShowNewPost(false);
                      handleCloseTab("newpost");
                    }}
                    onPostCreated={handlePostCreated}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "manage" && (
        <ManageClassModal
          courseId={cid}
          folders={folders}
          currentUser={currentUser}
          onFoldersUpdated={handleFoldersUpdated}
        />
      )}
    </div>
  );
}
