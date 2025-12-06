/**
 * PAZZA MAIN PAGE
 * Location: app/(kambaz)/courses/[cid]/pazza/page.tsx
 *
 * This is the main container for the entire Pazza Q&A system.
 * It manages the overall layout with:
 * - PazzaNavBar (top fixed bar)
 * - FolderFilters (category buttons)
 * - ListOfPostsSidebar (left column: posts list)
 * - PostScreen (right column: selected post or class at a glance)
 */

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PazzaNavBar from "./components/PazzaNavBar";
import FolderFilters from "./components/FolderFilters";
import ListOfPostsSidebar from "./components/ListOfPostsSidebar";
import PostScreen from "./components/PostScreen";
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
  visibility: "ENTIRE_CLASS" | "SELECTED_STUDENTS";
  viewCount: number;
  hasStudentAnswer: boolean;
  hasInstructorAnswer: boolean;
  createdAt: string;
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

  // State Management
  const [posts, setPosts] = useState<Post[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

  /**
   * Load initial data: posts and folders
   */
  useEffect(() => {
    fetchPostsAndFolders();
  }, [cid]);

  /**
   * Fetch posts and folders from backend
   */
  const fetchPostsAndFolders = async () => {
    try {
      setIsLoadingPosts(true);

      // Fetch posts
      const postsResponse = await fetch(`${SERVER_URL}/api/courses/${cid}/pazza/posts`, {
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

      // Set default selected folder (first folder)
      if (foldersData.length > 0 && !selectedFolder) {
        setSelectedFolder(foldersData[0].name);
      }
    } catch (error) {
      console.error("Error fetching posts and folders:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  /**
   * Handle folder selection change
   */
  const handleFolderChange = (folderName: string) => {
    setSelectedFolder(folderName);
    setSelectedPost(null); // Deselect post when switching folders
  };

  /**
   * Handle post selection
   */
  const handlePostSelect = (post: Post) => {
    setSelectedPost(post);
  };

  /**
   * Handle new post creation (callback from NewPostScreen)
   * Refreshes the posts list
   */
  const handlePostCreated = () => {
    fetchPostsAndFolders();
  };

  /**
   * Handle post deletion
   */
  const handlePostDeleted = () => {
    setSelectedPost(null);
    fetchPostsAndFolders();
  };

  /**
   * Filter posts based on selected folder and search query
   */
  const filteredPosts = posts.filter((post) => {
    const matchesFolder = selectedFolder === "" || post.folders.includes(selectedFolder);
    const matchesSearch =
      searchQuery === "" ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="pazza-container">
      {/* Top Navigation Bar - Fixed */}
      <PazzaNavBar courseId={cid} onPostCreated={handlePostCreated} folders={folders} />

      {/* Folder Filter Buttons */}
      <FolderFilters
        folders={folders}
        selectedFolder={selectedFolder}
        onFolderChange={handleFolderChange}
      />

      {/* Main Content Area */}
      <div className="pazza-main-content">
        {/* Left Sidebar - List of Posts */}
        <div className={`pazza-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <ListOfPostsSidebar
            posts={filteredPosts}
            selectedPost={selectedPost}
            onPostSelect={handlePostSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isLoading={isLoadingPosts}
          />
        </div>

        {/* Right Column - Post Content or Class at a Glance */}
        <div className="pazza-post-area">
          <PostScreen
            selectedPost={selectedPost}
            allPosts={posts}
            courseId={cid}
            onPostDeleted={handlePostDeleted}
            onPostUpdated={fetchPostsAndFolders}
          />
        </div>
      </div>
    </div>
  );
}
