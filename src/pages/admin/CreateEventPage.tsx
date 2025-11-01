import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import ConfirmationModal from "../../components/common/ConfirmationModal";

type FormState = {
  title: string;
  description: string;
  category: string;
  eventDate: string;
  eventTime: string;
  location: string;
  maxAttendees: string;
  eventDeadline: string;
  isPaid: boolean;
  price: string;
};

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    category: "",
    eventDate: "",
    eventTime: "",
    location: "",
    maxAttendees: "",
    eventDeadline: "",
    isPaid: false,
    price: "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------- HANDLERS ----------------
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setCoverImage(null);
      setPreview(null);
    }
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setCoverImage(null);
    setPreview(null);
  };

  // ---------------- VALIDATION ----------------
  const validateForm = (): boolean => {
    const {
      title,
      description,
      category,
      eventDate,
      eventTime,
      location,
      maxAttendees,
      eventDeadline,
      isPaid,
      price,
    } = formData;

    // Check required fields
    if (
      !title ||
      !description ||
      !category ||
      !eventDate ||
      !eventTime ||
      !location ||
      !maxAttendees ||
      !eventDeadline
    ) {
      toast.error("Please fill all required fields.");
      return false;
    }

    // Check date validity
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    const deadlineDateObj = new Date(eventDeadline);

    if (isNaN(eventDateObj.getTime()) || isNaN(deadlineDateObj.getTime())) {
      toast.error("Please provide valid event and deadline dates.");
      return false;
    }

    if (deadlineDateObj > eventDateObj) {
      toast.error("Deadline cannot be after the event date.");
      return false;
    }

    if (eventDateObj < today) {
      toast.error("Event date cannot be in the past.");
      return false;
    }

    // Check attendees
    if (Number(maxAttendees) <= 0) {
      toast.error("Maximum attendees must be greater than 0.");
      return false;
    }

    // If paid, validate price
    if (isPaid && (price === "" || Number(price) < 0)) {
      toast.error("Please enter a valid price for a paid event.");
      return false;
    }

    return true;
  };

  // ---------------- SUBMISSION ----------------
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "price" && !formData.isPaid) return;
        data.append(key, String(value));
      });

      if (coverImage) data.append("coverImage", coverImage);

      await api.post("/events", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event created successfully!");

      if (preview) URL.revokeObjectURL(preview);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Event creation failed:", err);
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create event. Please check the inputs.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  // When user clicks “Create Event” (before modal)
  const handleCreateClick = () => {
    if (validateForm()) {
      setIsModalOpen(true);
    }
  };

  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview);
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Create New Event
        </h1>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Title */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Event title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Short description"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a category</option>
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Tech">Tech</option>
              <option value="Workshop">Workshop</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Cultural">Cultural</option>
              <option value="IT Meetups">IT Meetups</option>
              <option value="Orientation">Orientation</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Cover Image
            </label>
            <input
              type="file"
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

            {preview && (
              <div className="mt-4 relative">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Image preview:
                </p>
                <img
                  src={preview}
                  alt="cover preview"
                  className="w-full max-h-64 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-sm shadow hover:bg-red-700"
                >
                  × Remove
                </button>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Event Date *
              </label>
              <input
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Event Time *
              </label>
              <input
                name="eventTime"
                type="time"
                value={formData.eventTime}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Location *
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Venue, room, or online link"
            />
          </div>

          {/* Attendees & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Max Attendees *
              </label>
              <input
                name="maxAttendees"
                type="number"
                min={1}
                value={formData.maxAttendees}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Registration Deadline *
              </label>
              <input
                name="eventDeadline"
                type="date"
                value={formData.eventDeadline}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Paid Toggle */}
          <div className="flex items-center gap-2">
            <input
              id="isPaid"
              name="isPaid"
              type="checkbox"
              checked={formData.isPaid}
              onChange={handleCheckboxChange}
              className="w-4 h-4"
            />
            <label
              htmlFor="isPaid"
              className="text-gray-700 dark:text-gray-300"
            >
              Is this a paid event?
            </label>
          </div>

          {formData.isPaid && (
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Price (NPR) *
              </label>
              <input
                name="price"
                type="number"
                min={0}
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg shadow hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateClick}
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg shadow text-white ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Event Creation"
        message="Are you sure you want to create this event?"
        onConfirm={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CreateEventPage;
