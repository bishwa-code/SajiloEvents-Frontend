import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";

const eventCategories = [
  "Academic",
  "Sports",
  "Tech",
  "Workshop",
  "Hackathon",
  "Cultural",
  "IT Meetups",
  "Orientation",
  "Others",
] as const;

const EditProfilePage = () => {
  const { user, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setInterests(user.interests || []);
    }
  }, [user]);

  const handleInterestChange = (category: string) => {
    setInterests((prevInterests: string[]) =>
      prevInterests.includes(category)
        ? prevInterests.filter((c: string) => c !== category)
        : [...prevInterests, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/users/profile", { fullName, interests });
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Update failed.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-900 dark:text-gray-100 text-lg">
          Loading profile...
        </p>
      </div>
    );
  }

  // Only students can edit their profile
  if (!user || user.role === "admin") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-900 dark:text-gray-100 text-lg">
          Only students can edit their profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:text-white focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Interests
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {eventCategories.map((category) => (
                <div
                  key={category}
                  className={`cursor-pointer px-3 py-2 text-sm font-medium rounded-full border transition-colors duration-200
                    ${
                      interests.includes(category)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                    }`}
                  onClick={() => handleInterestChange(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-4 py-2 rounded-xl bg-gray-400 text-white hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
