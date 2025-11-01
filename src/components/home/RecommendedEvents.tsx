import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import type { Event } from "../../types/events.types";
import axios from "axios";
import { Link } from "react-router-dom";

const RecommendedEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await api.get("/recommendations");
        if (response.data.recommendedEvents?.length > 0) {
          setEvents(response.data.recommendedEvents);
          setError(null);
        } else {
          setEvents([]);
          setError(response.data.message || null);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch recommendations.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Recommended Events
        </h2>
        <p className="text-gray-500 dark:text-gray-300">
          Loading recommendations...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Recommended Events
      </h2>

      {error ? (
        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          No recommended events available.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition hover:-translate-y-1"
            >
              {event.coverImage && (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {event.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {new Date(event.eventDate).toLocaleDateString()} at{" "}
                {event.eventTime}
              </p>

              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                {event.category}
              </p>

              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                {event.description}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Organized by: {event.organizer.fullName}
              </p>

              <Link
                to={`/events/${event._id}`}
                className="inline-block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedEvents;
