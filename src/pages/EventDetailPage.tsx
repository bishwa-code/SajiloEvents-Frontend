import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import api from "../api/axios.ts";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaTag,
  FaUser,
  FaRupeeSign,
} from "react-icons/fa";
import type { Event } from "../types/events.types.ts";
import type { Registration } from "../types/registration.types.ts";
import { useAuth } from "../context/useAuth.ts";
import Modal from "../components/common/Modal.tsx";

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // Event data and loading/error states
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Registration states
  const [myRegistration, setMyRegistration] = useState<Registration | null>(
    null
  );

  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(
    null
  );

  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration info modals
  const [showProofModal, setShowProofModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);

  // Feedback messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.event);
        setError(null);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch event details.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Check if user is already registered for this event
  useEffect(() => {
    const checkMyRegistration = async () => {
      if (!user || !event) return;

      try {
        const res = await api.get("/registrations/my-registrations");
        const myRegistrations = res.data.registrations;
        const reg = myRegistrations.find(
          (r: Registration) => r.event._id === event._id
        );

        if (reg) {
          setMyRegistration(reg);
          setAlreadyRegistered(true);
          setRegistrationStatus(reg.status);
        } else {
          setMyRegistration(null);
          setAlreadyRegistered(false);
          setRegistrationStatus(null);
        }
      } catch (err) {
        console.error("Failed to fetch my registrations", err);
      }
    };

    checkMyRegistration();
  }, [user, event]);

  // Helper to show feedback
  const showFeedback = (isSuccess: boolean, message: string) => {
    if (isSuccess) {
      setSuccessMessage(message);
      setErrorMessage(null);
    } else {
      setErrorMessage(message);
      setSuccessMessage(null);
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 5000);
  };

  // Handle registration button click
  const handleRegister = useCallback(async () => {
    if (!event) return;

    setIsSubmitting(true);
    try {
      if (event.isPaid) {
        setShowPaymentModal(true);
      } else {
        const response = await api.post("/registrations", {
          eventId: event._id,
        });
        showFeedback(true, response.data.message);
        setAlreadyRegistered(true);
        setRegistrationStatus("pending");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        showFeedback(false, err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        showFeedback(false, err.message);
      } else {
        showFeedback(false, "Registration failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [event]);

  // Handle payment modal submit
  const handlePaymentModalSubmit = useCallback(async () => {
    if (!event || !paymentProof) {
      showFeedback(false, "Please upload a payment proof image.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("eventId", event._id);
      formData.append("paymentProof", paymentProof);

      const response = await api.post("/registrations", formData);
      showFeedback(true, response.data.message);
      setShowPaymentModal(false);
      setPaymentProof(null);
      setAlreadyRegistered(true);
      setRegistrationStatus("pending");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        showFeedback(false, err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        showFeedback(false, err.message);
      } else {
        showFeedback(false, "Payment submission failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [event, paymentProof]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    } else {
      setPaymentProof(null);
    }
  };

  // Helper functions for button text and color
  const isDeadlinePassed = event
    ? new Date() > new Date(event.eventDeadline)
    : false;

  const getRegisterButtonText = () => {
    if (isDeadlinePassed) return "Registration Closed";
    if (alreadyRegistered) {
      return registrationStatus === "pending"
        ? "Pending Approval"
        : registrationStatus === "approved"
        ? "Registered"
        : "Registered";
    }
    return "Register Now";
  };

  const getRegisterButtonColor = () => {
    if (isDeadlinePassed || alreadyRegistered)
      return "bg-gray-400 cursor-not-allowed";
    return "bg-blue-600 hover:bg-blue-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Loading event details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-600 dark:text-red-400">
          Event not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <div className="relative w-full h-80 sm:h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
        <img
          src={
            event.coverImage ||
            "https://via.placeholder.com/1200x800.png?text=Event+Cover"
          }
          alt={`Cover for ${event.title}`}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
            {event.title}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 drop-shadow flex items-center justify-center">
            <FaUser className="hidden sm:inline-block mr-2" /> Organized by:{" "}
            {event.organizer.fullName}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Event Description */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                About the Event
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Details
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-3 text-blue-500 text-xl" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p>{new Date(event.eventDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-3 text-blue-500 text-xl" />
                  <div>
                    <p className="font-semibold">Time</p>
                    <p>{event.eventTime}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-3 text-blue-500 text-xl" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p>{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-3 text-blue-500 text-xl" />
                  <div>
                    <p className="font-semibold">Max Attendees</p>
                    <p>{event.maxAttendees}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaTag className="mr-3 text-blue-500 text-xl" />
                  <div>
                    <p className="font-semibold">Category</p>
                    <p className="capitalize">{event.category}</p>
                  </div>
                </div>
              </div>

              {/* Registration & Price */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl font-bold flex items-center">
                    {event.isPaid ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center">
                        <FaRupeeSign className="mr-1" />
                        {event.price}
                      </span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400">
                        Free
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <FaClock className="inline-block mr-1 text-base text-red-500" />
                    Deadline:{" "}
                    {new Date(event.eventDeadline).toLocaleDateString()}
                  </p>
                </div>

                {successMessage && (
                  <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center mb-4">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">
                    {errorMessage}
                  </div>
                )}

                {user ? (
                  <button
                    className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-lg transition-colors duration-300 ${getRegisterButtonColor()} ${
                      isSubmitting
                        ? "cursor-not-allowed"
                        : "transform hover:scale-105"
                    }`}
                    disabled={
                      isSubmitting || isDeadlinePassed || alreadyRegistered
                    }
                    onClick={handleRegister}
                  >
                    {isSubmitting ? "Processing..." : getRegisterButtonText()}
                  </button>
                ) : (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Log in to register for this event.
                  </p>
                )}
              </div>

              {/* Registration Info Section */}
              {myRegistration && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                    Your Registration
                  </h4>

                  <p
                    className={`font-medium mb-2 ${
                      myRegistration.status === "approved"
                        ? "text-green-600"
                        : myRegistration.status === "pending"
                        ? "text-yellow-500"
                        : "text-red-600"
                    }`}
                  >
                    Status: {myRegistration.status.toUpperCase()}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Registered on:{" "}
                    <strong>
                      {new Date(
                        myRegistration.registrationDate
                      ).toLocaleDateString()}
                    </strong>
                  </p>

                  <div className="flex flex-col gap-2">
                    {myRegistration.event.isPaid &&
                      myRegistration.paymentProofImage && (
                        <button
                          onClick={() => setShowProofModal(true)}
                          className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          View Payment Proof
                        </button>
                      )}

                    {myRegistration.adminRemarks ? (
                      <button
                        onClick={() => setShowRemarksModal(true)}
                        className="px-3 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
                      >
                        View Admin Remarks
                      </button>
                    ) : (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        Status still pending - no admin remarks available yet.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Submit Payment Proof
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Upload an image of your payment receipt. Registration will be
              pending until admin approval.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4 w-full"
            />
            {paymentProof && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Selected: {paymentProof.name}
              </p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentModalSubmit}
                className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
                  isSubmitting || !paymentProof
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isSubmitting || !paymentProof}
              >
                {isSubmitting ? "Submitting..." : "Submit Proof"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Proof Modal */}
      <Modal
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        title="Payment Proof"
      >
        {myRegistration?.paymentProofImage && (
          <img
            src={myRegistration.paymentProofImage}
            alt="Payment Proof"
            className="rounded-lg w-full"
          />
        )}
      </Modal>

      {/* Admin Remarks Modal */}
      <Modal
        isOpen={showRemarksModal}
        onClose={() => setShowRemarksModal(false)}
        title="Admin Remarks"
      >
        <p className="text-gray-800 dark:text-gray-200">
          {myRegistration?.adminRemarks}
        </p>
      </Modal>
    </div>
  );
};

export default EventDetailPage;
