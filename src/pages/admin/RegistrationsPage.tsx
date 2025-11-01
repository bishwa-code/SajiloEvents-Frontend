import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import Modal from "../../components/common/Modal";
import ConfirmationModal from "../../components/common/ConfirmationModal";

interface Student {
  fullName: string;
  email: string;
}

interface EventDetails {
  _id: string;
  title: string;
  eventDate: string;
  isPaid: boolean;
  price?: number;
}

interface Registration {
  _id: string;
  student: Student;
  status: "pending" | "approved" | "rejected";
  paymentProofImage?: string;
  registrationDate: string;
}

const RegistrationsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: (() => Promise<void>) | null;
    message: string;
  }>({ open: false, action: null, message: "" });

  // Fetch registrations
  useEffect(() => {
    const fetchRegistrations = async () => {
      console.log("Fetching registrations... before !eventId");
      if (!eventId) return;
      setLoading(true);
      console.log("Fetching registrations... after !eventId");
      try {
        const res = await api.get(`/registrations/event/${eventId}`);
        console.log("Response received:", res.data);
        setRegistrations(res.data.registrations || []);
        if (res.data.registrations[0]?.event) {
          setEvent(res.data.registrations[0].event);
        }
      } catch (error: unknown) {
        console.error(error);
        toast.error("Failed to load registrations.");
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [eventId]);

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const res = await api.put(`/registrations/${id}/status`, { status });
      toast.success(res.data.message || "Status updated.");
      setRegistrations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred while updating status.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/registrations/${id}`);
      toast.success(res.data.message || "Registration deleted.");
      setRegistrations((prev) => prev.filter((r) => r._id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "An unexpected error occurred while deleting registration."
        );
      }
    }
  };

  const pendingRegistrations = registrations.filter(
    (r) => r.status === "pending"
  );
  const historyRegistrations = registrations.filter(
    (r) => r.status === "approved" || r.status === "rejected"
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300 text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        {/* Event Info */}
        {event && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {event.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              📅 {new Date(event.eventDate).toLocaleDateString()}
            </p>
            {event.isPaid && (
              <p className="text-gray-700 dark:text-gray-200 mt-1">
                💰 Price:{" "}
                <span className="font-semibold">Rs. {event.price}</span>
              </p>
            )}
          </div>
        )}

        {/* Pending Registrations */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Pending Registrations
          </h2>
          {pendingRegistrations.length === 0 ? (
            <p className="text-gray-500">No pending registrations.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-200 text-gray-800 dark:text-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                  <tr>
                    <th className="px-4 py-2">S.No.</th>
                    <th className="px-4 py-2">Full Name</th>
                    <th className="px-4 py-2">Email</th>
                    {event?.isPaid && <th className="px-4 py-2">Payment</th>}
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRegistrations.map((reg, idx) => (
                    <tr
                      key={reg._id}
                      className="border-t border-gray-300 dark:border-gray-700"
                    >
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{reg.student.fullName}</td>
                      <td className="px-4 py-2">{reg.student.email}</td>
                      {event?.isPaid && (
                        <td className="px-4 py-2">
                          {reg.paymentProofImage ? (
                            <button
                              onClick={() =>
                                setSelectedImage(reg.paymentProofImage!)
                              }
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              View
                            </button>
                          ) : (
                            <span className="text-gray-500 italic">
                              No proof
                            </span>
                          )}
                        </td>
                      )}
                      <td className="px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              action: () =>
                                handleStatusChange(reg._id, "approved"),
                              message: `Approve registration of ${reg.student.fullName}?`,
                            })
                          }
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              action: () =>
                                handleStatusChange(reg._id, "rejected"),
                              message: `Reject registration of ${reg.student.fullName}?`,
                            })
                          }
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* History Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Registration History
          </h2>
          {historyRegistrations.length === 0 ? (
            <p className="text-gray-500">No past registrations.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="bg-gray-100 dark:bg-gray-200 text-gray-800 dark:text-gray-700 w-full text-left rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                  <tr>
                    <th className="px-4 py-2">S.No.</th>
                    <th className="px-4 py-2">Full Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRegistrations.map((reg, idx) => (
                    <tr
                      key={reg._id}
                      className="border-t border-gray-300 dark:border-gray-700"
                    >
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">{reg.student.fullName}</td>
                      <td className="px-4 py-2">{reg.student.email}</td>
                      <td
                        className={`px-4 py-2 font-medium ${
                          reg.status === "approved"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {reg.status === "approved" ? "Accepted" : "Rejected"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {reg.status === "rejected" && (
                          <button
                            onClick={() =>
                              setConfirmModal({
                                open: true,
                                action: () => handleDelete(reg._id),
                                message: `Delete rejected registration of ${reg.student.fullName}?`,
                              })
                            }
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Payment Proof Modal */}
        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          title="Payment Proof"
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Payment Proof"
              className="w-full rounded-lg shadow"
            />
          ) : (
            <p>No image available</p>
          )}
        </Modal>

        {/* Confirm Modal */}
        <ConfirmationModal
          isOpen={confirmModal.open}
          message={confirmModal.message}
          onConfirm={async () => {
            if (confirmModal.action) {
              await confirmModal.action();
            }
            setConfirmModal({ open: false, action: null, message: "" });
          }}
          onCancel={() =>
            setConfirmModal({ open: false, action: null, message: "" })
          }
        />
      </div>
    </div>
  );
};

export default RegistrationsPage;
