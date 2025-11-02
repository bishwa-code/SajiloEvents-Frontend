import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import EventCard from "../../components/events/EventCard";
import type { Event } from "../../types/events.types";

const AllCreatedEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/events/my");
      setEvents(data.events || []);
    } catch (error: unknown) {
      console.error("Failed to load events:", error);
      toast.error("Failed to load your events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDeleteSuccess = () => {
    // Refetch after delete
    fetchMyEvents();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          All Created Events
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading your events...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              You haven’t created any events yet.
            </p>
            <div className="mt-4">
              <a
                href="/admin/events/create"
                className="inline-block px-5 py-2 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition-colors"
              >
                Create New Event
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDeleteSuccess={handleDeleteSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCreatedEventsPage;
