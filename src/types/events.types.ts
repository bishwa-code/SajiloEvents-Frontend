export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  eventTime: string;
  location: string;
  organizer: {
    _id: string;
    fullName: string;
    email: string;
  };
  maxAttendees: number;
  eventDeadline: string;
  isPaid: boolean;
  price?: number;
  coverImage?: string;
}
