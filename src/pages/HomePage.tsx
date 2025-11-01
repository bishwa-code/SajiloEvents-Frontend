import React from "react";
import { Link } from "react-router-dom";
import EventSection from "../components/home/EventSection.tsx";
import CategorySection from "../components/home/CategorySection.tsx";
import Testimonials from "../components/home/Testimonials";
import PostSection from "../components/home/PostSection.tsx";
import HeroIllustration from "../assets/hero.svg";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Hero Section */}
      <header className="relative w-full min-h-screen flex items-center justify-center pt-16 sm:pt-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-white dark:to-gray-900 opacity-95"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-600 dark:text-blue-400 leading-tight mb-4 animate-fade-in">
              Discover, Connect, and Experience Events
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Explore a world of opportunities. From workshops, tech meetups to
              academic events, find the events that match your interests.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                to="/events"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 text-center"
              >
                Explore Events
              </Link>
              <Link
                to="/posts"
                className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 text-center"
              >
                View Posts
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <img
              src={HeroIllustration}
              alt="Campus events illustration"
              className="max-w-md w-full h-auto"
            />
          </div>
        </div>
      </header>

      <main className="py-12 sm:py-20">
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

        {/* Latest Posts Section (Placeholder) */}
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

        {/* Categories & Filters Section */}
        <section
          id="categories"
          className="mb-12 sm:mb-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Explore by Category
            </h2>
            <CategorySection />
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="bg-blue-50 dark:bg-gray-800 py-12 sm:py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-12">
              What Students Say
            </h2>
            <Testimonials />
          </div>
        </section>

        {/* About the Platform Section */}
        <section id="about" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              About the Platform
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
              Sajilo Events is a comprehensive campus portal designed to connect
              students with all the exciting events happening on campus. From
              academic seminars to cultural showcases, this platform was created
              as a 7th semester project to streamline event communication and
              enhance campus engagement.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
