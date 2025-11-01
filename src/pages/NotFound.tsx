import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 sm:pt-20 flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 dark:from-gray-800 to-white dark:to-gray-900 opacity-95"></div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Big 404 */}
        <h1 className="text-7xl sm:text-9xl font-extrabold text-blue-600 dark:text-blue-400 mb-6 animate-fade-in">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          The page you’re looking for doesn’t exist or has been moved. Let’s get
          you back on track.
        </p>

        {/* Styled Link as Button */}
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
