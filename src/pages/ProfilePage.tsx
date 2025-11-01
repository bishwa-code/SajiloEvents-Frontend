import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import type { Registration } from "../types/registration.types";
import RegisteredEventSection from "../components/home/RegisteredEventsSection";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regLoading, setRegLoading] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 sm:p-12">
      <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        My Profile
      </h1>

      {user && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-12">
          <p className="text-lg text-gray-800 dark:text-gray-200 mb-2">
            <span className="font-semibold">Full Name:</span> {user.fullName}
          </p>
          <p className="text-lg text-gray-800 dark:text-gray-200 mb-2">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-lg text-gray-800 dark:text-gray-200 mb-2">
            <span className="font-semibold">Role:</span>{" "}
            {user.role.toUpperCase()}
          </p>

          {user.role !== "admin" && (
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                to="/profile/edit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </Link>
              <Link
                to="/profile/password"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Change Password
              </Link>
            </div>
          )}
        </div>
      )}

      {/* My Registered Events */}

      {user && user.role !== "admin" && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            My Registered Events ({registrations.length})
          </h2>

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
      )}
    </div>
  );
};

export default ProfilePage;
