import { useState, useEffect } from "react";
import api from "../api/axios.ts";
import { AxiosError } from "axios";
import PostCard from "../components/posts/PostCard.tsx";
import type { Post } from "../types/posts.types.ts";

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/posts");

        // Sort posts by createdAt descending (latest posts first)
        const allPosts: Post[] = response.data.posts;
        allPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(allPosts);
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-6 text-center animate-fade-in">
          Latest Posts
        </h1>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Loading posts...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-700 dark:text-gray-300">
              No posts found. Check back soon!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
