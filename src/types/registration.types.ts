import type { Event } from "./events.types";

export interface Registration {
  _id: string;
  event: Event;
  student: string;
  status: "pending" | "approved" | "rejected";
  registrationDate: string;
  paymentProofImage?: string;
  adminRemarks?: string;
}
