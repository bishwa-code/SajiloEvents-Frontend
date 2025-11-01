import React, { useState, useEffect } from "react";
import api from "../../api/axios.ts";
import { AxiosError } from "axios";
import type { Post } from "../../types/posts.types.ts";
import PostCard from "../posts/PostCard.tsx";

const PostSection: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/posts"); // Get all posts
        const allPosts = response.data.posts;

        // Sort by createdAt descending (latest posts first)
        allPosts.sort(
          (a: Post, b: Post) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Show only first 3 for homepage
        setPosts(allPosts.slice(0, 3));
        setError(null);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "Failed to fetch posts.");
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Loading posts...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          No posts found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostSection;
