import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

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

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    category: "General",
    event: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch admin’s events from /api/events/my
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/my");
        setEvents(res.data.events || []);
      } catch (error: unknown) {
        console.error(error);
        toast.error("Failed to load your events.");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle text / textarea / select inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multiple image selection and previews
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Validate before confirm modal
  const handleOpenConfirmModal = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    setShowConfirmModal(true);
  };

  // Submit post
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const res = await api.post("/posts", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Post created successfully!");
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
          "Failed to create post.";

        toast.error(errorMessage);
      } else {
        toast.error("Failed to create post.");
      }
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const handleCancel = () => navigate("/admin/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
          Create New Post
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

          {/* Related Event Dropdown */}
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

          {/* Upload images */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Upload Images (optional)
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

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow"
                  />
                </div>
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
              {submitting ? "Submitting..." : "Create Post"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Confirm Post Creation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to create this post?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostPage;
