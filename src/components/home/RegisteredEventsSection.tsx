import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import type { Registration } from "../../types/registration.types";

interface Props {
  registrations: Registration[];
}

const RegisteredEventSection: React.FC<Props> = ({ registrations }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedRemarks, setSelectedRemarks] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {registrations.map((reg) => (
          <div
            key={reg._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col justify-between"
          >
            {reg.event.coverImage && (
              <img
                src={reg.event.coverImage}
                alt={reg.event.title}
                className="rounded-lg mb-3 w-full h-40 object-cover"
              />
            )}

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {reg.event.title}
            </h3>

            <p className="text-gray-700 dark:text-gray-300 mb-1">
              {new Date(reg.event.eventDate).toLocaleDateString()} at{" "}
              {reg.event.eventTime}
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {reg.event.location}
            </p>

            <p
              className={`font-medium mb-2 ${
                reg.status === "approved"
                  ? "text-green-600"
                  : reg.status === "pending"
                  ? "text-yellow-500"
                  : "text-red-600"
              }`}
            >
              Status: {reg.status.toUpperCase()}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Registered on:{" "}
              {new Date(reg.registrationDate).toLocaleDateString()}
            </p>

            <div className="flex flex-col gap-2 mt-auto">
              {reg.event.isPaid && reg.paymentProofImage && (
                <button
                  onClick={() => setSelectedImage(reg.paymentProofImage!)}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  View Payment Proof
                </button>
              )}

              {reg.adminRemarks && (
                <button
                  onClick={() => setSelectedRemarks(reg.adminRemarks!)}
                  className="px-3 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  View Admin Remarks
                </button>
              )}

              <Link
                to={`/events/${reg.event._id}`}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-center"
              >
                View Event
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Proof Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title="Payment Proof"
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Payment Proof"
            className="rounded-lg w-full"
          />
        )}
      </Modal>

      {/* Admin Remarks Modal */}
      <Modal
        isOpen={!!selectedRemarks}
        onClose={() => setSelectedRemarks(null)}
        title="Admin Remarks"
      >
        <p className="text-gray-800 dark:text-gray-200">{selectedRemarks}</p>
      </Modal>
    </>
  );
};

export default RegisteredEventSection;
