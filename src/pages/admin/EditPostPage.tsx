import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../components/common/ConfirmationModal";

interface PostFormData {
  title: string;
  content: string;
  category: string;
  event?: string;
}

interface EventOption {
  _id: string;
  title: string;
  eventDate: string;
  location: string;
}

interface PostImage {
  public_id: string;
  url: string;
}

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    category: "General",
    event: "",
  });

  const [existingImages, setExistingImages] = useState<PostImage[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clearImages, setClearImages] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        const post = res.data.post;
        setFormData({
          title: post.title || "",
          content: post.content || "",
          category: post.category || "General",
          event: post.event?._id || "",
        });
        setExistingImages(post.images || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load post details.");
        navigate("/admin/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/my");
        setEvents(res.data.events || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your events.");
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setClearImages(false); // user is replacing, not clearing
  };

  const handleClearImages = () => {
    setExistingImages([]);
    setImageFiles([]);
    setImagePreviews([]);
    setClearImages(true);
  };

  // Validate before confirm modal
  const handleOpenConfirmModal = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    setShowConfirmModal(true);
  };

  // Submit update
  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      if (clearImages) {
        formDataToSend.append("clearImages", "true");
      } else {
        imageFiles.forEach((file) => formDataToSend.append("images", file));
      }

      const res = await api.put(`/posts/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Post updated successfully!");
      navigate("/admin/dashboard");
    } catch (err: unknown) {
      console.error(err);
      if (typeof err === "object" && err !== null) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to update post.";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to update post.");
      }
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const handleCancel = () => navigate("/admin/dashboard");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Loading post details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
          Edit Post
        </h1>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Post Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              placeholder="Write your post content..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Notice">Notice</option>
              <option value="Announcement">Announcement</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Related Event */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Related Event (Optional)
            </label>
            {loadingEvents ? (
              <p className="text-gray-500">Loading your events...</p>
            ) : events.length > 0 ? (
              <select
                name="event"
                value={formData.event}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Select an event --</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title} —{" "}
                    {new Date(event.eventDate).toLocaleDateString()} (
                    {event.location})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-500 italic">
                You haven’t created any events yet.
              </p>
            )}
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Existing Images
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-3">
                {existingImages.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow"
                  />
                ))}
              </div>
              <button
                onClick={handleClearImages}
                className="text-sm text-red-600 hover:underline"
              >
                Remove all images
              </button>
            </div>
          )}

          {/* New Uploads */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Upload New Images (optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-500 file:text-white
                hover:file:bg-blue-600
                cursor-pointer"
            />
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={handleCancel}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleOpenConfirmModal}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Post"}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Post Update"
        message="Are you sure you want to update this post?"
        onConfirm={handleUpdate}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

export default EditPostPage;
