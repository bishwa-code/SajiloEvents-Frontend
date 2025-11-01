import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaUsers,
  FaClock,
  FaRupeeSign,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import type { Event } from "../../types/events.types";
import ConfirmationModal from "../common/ConfirmationModal";

interface EventCardProps {
  event: Event;
  userRole: "admin" | "student";
  onDeleteSuccess?: () => void; // Callback to refresh parent list after delete
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  userRole,
  onDeleteSuccess,
}) => {
  const placeholderImage =
    "https://via.placeholder.com/600x400.png?text=Event+Image";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete API call
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/events/${event._id}`);
      toast.success("Event deleted successfully!");
      setIsDeleting(false);
      setIsModalOpen(false);
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error: unknown) {
      console.error("Delete event error:", error);
      toast.error("Failed to delete the event.");
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden">
        {/* Event Cover Image */}
        <div className="relative w-full h-48 sm:h-56">
          <img
            src={event.coverImage || placeholderImage}
            alt={`Cover image for ${event.title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
              {event.category}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {event.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
            {event.description}
          </p>

          <div className="text-gray-500 dark:text-gray-400 space-y-2 mb-4">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              <p>
                {new Date(event.eventDate).toLocaleDateString()} at{" "}
                {event.eventTime}
              </p>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              <p>{event.location}</p>
            </div>
            <div className="flex items-center">
              <FaUsers className="mr-2 text-blue-500" />
              <p>Max Attendees: {event.maxAttendees}</p>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2 text-blue-500" />
              <p>
                Registration Deadline:{" "}
                {new Date(event.eventDeadline).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              <FaUser className="mr-2 text-blue-500" />
              <p>Organized by: {event.organizer.fullName}</p>
            </div>
          </div>

          {event.isPaid && (
            <div className="mb-4">
              <span className="flex items-center text-lg font-bold text-green-600 dark:text-green-400">
                Price:{" "}
                <span className="ml-1">
                  <FaRupeeSign className="inline text-base -mr-1" />
                  {event.price}
                </span>
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {userRole === "student" && (
              <Link
                to={`/events/${event._id}`}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition-colors"
              >
                View Event
              </Link>
            )}

            {userRole === "admin" && (
              <>
                <Link
                  to={`/admin/events/edit/${event._id}`}
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
                <Link
                  to={`/admin/events/registrations/${event._id}`}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-full shadow hover:bg-green-700 transition-colors"
                >
                  Registrations
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this event?"
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default EventCard;
