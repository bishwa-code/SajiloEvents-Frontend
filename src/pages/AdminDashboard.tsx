import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [eventCount, setEventCount] = useState<number>(0);
  const [postCount, setPostCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const [eventsRes, postsRes] = await Promise.all([
          api.get("/events/my"),
          api.get("/posts/my"),
        ]);

        setEventCount(eventsRes.data.count);
        setPostCount(postsRes.data.count);
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (!user) return null;

  return (
    <div className="p-6 space-y-10">
      {/* Section Welcome */}
      <section className="bg-blue-100 rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold">Welcome, {user.fullName}!</h1>
        <p className="text-gray-700 mt-2">
          Here's a quick overview of your events and posts.
        </p>
      </section>

      {/* Section Summary Cards */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Events Card */}
        <div className="bg-white rounded-lg p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold">Events Conducted</h2>
            <p className="text-3xl font-bold mt-4">
              {loading ? "..." : eventCount}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/events")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer"
          >
            View Events
          </button>
        </div>

        {/* Posts Card */}
        <div className="bg-white rounded-lg p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold">Posts Created</h2>
            <p className="text-3xl font-bold mt-4">
              {loading ? "..." : postCount}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/posts")}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer"
          >
            View Posts
          </button>
        </div>
      </section>

      {/* Section Create */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Create Event */}
        <div
          onClick={() => navigate("/admin/events/create")}
          className="bg-blue-200 rounded-lg p-6 shadow-md cursor-pointer hover:bg-blue-300 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Create Event</h2>
          <p>Click here to create a new event for your users.</p>
        </div>

        {/* Create Post */}
        <div
          onClick={() => navigate("/admin/posts/create")}
          className="bg-green-200 rounded-lg p-6 shadow-md cursor-pointer hover:bg-green-300 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Create Post</h2>
          <p>Click here to create a new post for your users.</p>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
