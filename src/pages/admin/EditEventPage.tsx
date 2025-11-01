import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

interface EventFormData {
  title: string;
  description: string;
  category: string;
  eventDate: string;
  eventTime: string;
  location: string;
  maxAttendees: number;
  eventDeadline: string;
  isPaid: boolean;
  price?: number;
  coverImage?: string;
}

const EditEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    category: "",
    eventDate: "",
    eventTime: "",
    location: "",
    maxAttendees: 0,
    eventDeadline: "",
    isPaid: false,
    price: undefined,
    coverImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 🟢 Fetch event details on mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const event = res.data.event;

        setFormData({
          title: event.title,
          description: event.description,
          category: event.category,
          eventDate: event.eventDate.slice(0, 10),
          eventTime: event.eventTime,
          location: event.location,
          maxAttendees: event.maxAttendees,
          eventDeadline: event.eventDeadline.slice(0, 10),
          isPaid: event.isPaid,
          price: event.price || undefined,
          coverImage: event.coverImage || "",
        });
        setImagePreview(event.coverImage || null);
      } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to load event details.");
        }
        navigate("/admin/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  // 🟠 Handle form input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value } = target;
    const isCheckbox =
      target instanceof HTMLInputElement && target.type === "checkbox";

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (target as HTMLInputElement).checked : value,
    }));
  };

  // 🟣 Handle image upload + preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // 🔵 Validation before update
  const validateForm = (): boolean => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill all required fields.");
      return false;
    }

    const eventDate = new Date(formData.eventDate);
    const deadline = new Date(formData.eventDeadline);
    const today = new Date();

    if (deadline > eventDate) {
      toast.error("Registration deadline cannot be after event date.");
      return false;
    }

    if (eventDate < today) {
      toast.error("Event date cannot be in the past.");
      return false;
    }

    if (formData.isPaid && (!formData.price || formData.price < 0)) {
      toast.error("Please provide a valid price for paid events.");
      return false;
    }

    return true;
  };

  // 🟢 Submit update
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const confirmUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null)
          formDataToSend.append(key, value.toString());
      });
      if (imageFile) formDataToSend.append("coverImage", imageFile);

      const res = await api.put(`/events/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Event updated successfully!");
      navigate("/admin/dashboard");
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update event.");
      }
    } finally {
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        Loading event details...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Edit Event
        </h1>

        {/* 🧾 Form */}
        <div className="space-y-5">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Title *
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-700"
            />
          </label>

          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Description *
            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-700"
              rows={4}
            />
          </label>

          <label className="block text-gray-700 dark:text-gray-300 mb-8">
            Category *
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-700"
            >
              <option value="">Select Category</option>
              {[
                "Academic",
                "Sports",
                "Tech",
                "Workshop",
                "Hackathon",
                "Cultural",
                "IT Meetups",
                "Orientation",
                "Others",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="block  text-gray-700 dark:text-gray-300 mb-2">
              Event Date *
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="p-3 border rounded-lg dark:bg-gray-700"
              />
            </label>

            <label className="block  text-gray-700 dark:text-gray-300 mb-2">
              Event Time *
              <input
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                className="p-3 border rounded-lg dark:bg-gray-700"
              />
            </label>
          </div>

          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Location *
            <input
              type="text"
              name="location"
              placeholder="Event Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-700"
            />
          </label>

          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Max Attendees *
            <input
              type="number"
              name="maxAttendees"
              placeholder="Max Attendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-700"
            />
          </label>

          <label className="block text-gray-700 dark:text-gray-300 mb-8">
            Registration Deadline *
            <input
              type="date"
              name="eventDeadline"
              value={formData.eventDeadline}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-700"
            />
          </label>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-gray-700 dark:text-gray-300">
              Paid Event?
            </label>
          </div>

          {formData.isPaid && (
            <label className="block text-gray-700 dark:text-gray-300 mb-4">
              Price (NPR) *
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:bg-gray-700"
              />
            </label>
          )}

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-500 file:text-white
                hover:file:bg-blue-600
                cursor-pointer"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-56 object-cover rounded-lg shadow"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Event
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[90%] max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Confirm Update
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to update this event?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEventPage;
