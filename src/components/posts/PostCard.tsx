// src/components/posts/PostCard.tsx
import React, { useState } from "react";
import type { Post } from "../../types/posts.types";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/useAuth";
import ConfirmationModal from "../common/ConfirmationModal";

interface PostCardProps {
  post: Post;
  onDeleteSuccess?: () => void; // Callback to refresh list after delete
}

const PostCard: React.FC<PostCardProps> = ({ post, onDeleteSuccess }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { _id, title, content, category, images, author, event, createdAt } =
    post;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/posts/${_id}`);
      toast.success("Post deleted successfully!");
      setIsDeleting(false);
      setIsModalOpen(false);
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      console.error("Delete post error:", error);
      toast.error("Failed to delete the post.");
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden">
        {/* Post Image */}
        {images && images.length > 0 && (
          <div className="relative w-full h-48 sm:h-56">
            <img
              src={images[0].url}
              alt={title}
              className="w-full h-full object-cover"
            />
            {category && (
              <span className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {category}
              </span>
            )}
          </div>
        )}

        {/* Post Info */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-3">
            {content}
          </p>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div>By: {author.fullName}</div>
            {event && <div>Event: {event.title}</div>}
            <div>{new Date(createdAt).toLocaleDateString()}</div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {user?.role === "student" && (
              <Link
                to={`/posts/${_id}`}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition-colors"
              >
                Read More
              </Link>
            )}

            {user?.role === "admin" && (
              <>
                <Link
                  to={`/admin/posts/edit/${_id}`}
                  className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-full shadow hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-full shadow hover:bg-red-700 transition-colors"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this post?"
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PostCard;
