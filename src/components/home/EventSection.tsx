import React, { useState, useEffect } from "react";
import api from "../../api/axios.ts";
import { AxiosError } from "axios";
import EventCard from "../events/EventCard.tsx";
import type { Event } from "../../types/events.types.ts";

const EventSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/events");

        // --- Filtering and Sorting Logic ---
        const allEvents = response.data.events;
        const now = new Date();

        // Filter out events where the deadline has passed.
        const upcomingEvents = allEvents.filter(
          (event: Event) => new Date(event.eventDeadline) > now
        );

        // Sort the upcoming events by their event date.
        upcomingEvents.sort(
          (a: Event, b: Event) =>
            new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
        );

        // Only show the first 3 upcoming events for the homepage.
        setEvents(upcomingEvents.slice(0, 3));

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Loading events...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          No events found. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

export default EventSection;
