import { useState, useEffect } from "react";
import api from "../api/axios.ts";
import { AxiosError } from "axios";
import EventCard from "../components/events/EventCard.tsx";
import type { Event } from "../types/events.types.ts";

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/events");

        // Filter events whose deadline is in the future
        const upcomingEvents = response.data.events.filter((event: Event) => {
          return new Date(event.eventDeadline) >= new Date();
        });

        setEvents(upcomingEvents);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "Failed to fetch events.");
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-6 text-center animate-fade-in">
          Upcoming Events
        </h1>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Loading events...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-700 dark:text-gray-300">
              No events found. Check back soon!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
