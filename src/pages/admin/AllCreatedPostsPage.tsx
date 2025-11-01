// src/pages/admin/AllCreatedPostsPage.tsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import PostCard from "../../components/posts/PostCard";
import type { Post } from "../../types/posts.types";

const AllCreatedPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/posts/my");
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuccess = () => {
    fetchPosts(); // Refresh posts after delete
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen py-10 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            All Created Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and view all posts created by you.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Loading your posts...
          </p>
        )}

        {/* No Posts */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400">
              You haven’t created any posts yet.
            </p>
            <div className="mt-4">
              <a
                href="/admin/posts/create"
                className="inline-block px-5 py-2 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition-colors"
              >
                Create New Post
              </a>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDeleteSuccess={handleDeleteSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCreatedPostsPage;
