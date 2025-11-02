import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.ts";
import { AxiosError } from "axios";
import type { Post } from "../types/posts.types.ts";

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${id}`);
        setPost(response.data.post);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "Failed to fetch post.");
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Loading post...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Post not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-10">
        {/* Post Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        {/* Post Metadata */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 text-gray-600 dark:text-gray-300">
          <div>
            <span className="font-medium">Author:</span> {post.author.fullName}{" "}
            ({post.author.email})
          </div>
          {post.event && (
            <div className="mt-2 sm:mt-0">
              <span className="font-medium">Related Event:</span>{" "}
              <p className="text-gray-600 dark:text-gray-300">
                {post.event.title} -{" "}
                {new Date(post.event.eventDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Category */}
        {post.category && (
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-6">
            {post.category}
          </span>
        )}

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {post.images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={post.title}
                className="rounded-lg object-cover w-full h-64"
              />
            ))}
          </div>
        )}

        {/* Post Content */}
        <div className="prose dark:prose-invert text-gray-800 dark:text-gray-100">
          <p>{post.content}</p>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            to="/posts"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            ← Back to Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
