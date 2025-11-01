import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventSection from "../components/home/EventSection.tsx";
import PostSection from "../components/home/PostSection.tsx";
import HeroIllustration from "../assets/hero.svg";
import api from "../api/axios";
import { AxiosError } from "axios";
import { useAuth } from "../context/useAuth.ts";
import type { Registration } from "../types/registration.types.ts";
import RecommendedEvents from "../components/home/RecommendedEvents.tsx";
import RegisteredEventSection from "../components/home/RegisteredEventsSection.tsx";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regLoading, setRegLoading] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);

  // Fetch student's registered events
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setRegLoading(true);
        const res = await api.get("/registrations/my-registrations");
        setRegistrations(res.data.registrations);
        setRegError(null);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setRegError(
            err.response?.data?.message || "Failed to load registrations."
          );
        } else {
          setRegError("An unknown error occurred.");
        }
      } finally {
        setRegLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Welcome Section */}
      <header className="relative w-full min-h-screen flex items-center justify-center pt-16 sm:pt-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-white dark:to-gray-900 opacity-95"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-600 dark:text-blue-400 leading-tight mb-4 animate-fade-in">
              Welcome, {user?.fullName}!
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Discover upcoming events, read the latest posts, and manage your
              registrations from your dashboard.
            </p>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <img
              src={HeroIllustration}
              alt="Campus dashboard illustration"
              className="max-w-md w-full h-auto"
            />
          </div>
        </div>
      </header>

      <main className="py-12 sm:py-20 space-y-20">
        {/* Recommended Events Section */}
        <section id="recommended-events" className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <RecommendedEvents />
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section
          id="upcoming-events"
          className="mb-12 sm:mb-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                Upcoming Events
              </h2>
              <Link
                to="/events"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                View All Events
              </Link>
            </div>
            <EventSection />
          </div>
        </section>

        {/* Latest Posts Section */}
        <section
          id="latest-posts"
          className="mb-12 sm:mb-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                Latest Posts
              </h2>
              <Link
                to="/posts"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                View All Posts
              </Link>
            </div>
            <PostSection />
          </div>
        </section>

        {/* Registered Events Section */}
        <section
          id="registered-events"
          className="mb-12 sm:mb-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                My Registered Events ({registrations.length})
              </h2>
              <Link
                to="/registrations"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                View All
              </Link>
            </div>

            {regLoading && (
              <div className="flex justify-center items-center h-40">
                <p className="text-xl text-gray-700 dark:text-gray-300">
                  Loading registrations...
                </p>
              </div>
            )}

            {regError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                <span>{regError}</span>
              </div>
            )}

            {!regLoading && registrations.length === 0 && (
              <div className="flex justify-center items-center h-40">
                <p className="text-xl text-gray-700 dark:text-gray-300">
                  You have not registered for any events yet.
                </p>
              </div>
            )}

            <RegisteredEventSection registrations={registrations} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
