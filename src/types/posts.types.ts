export interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  images?: {
    public_id: string;
    url: string;
  }[];
  author: {
    _id: string;
    fullName: string;
    email: string;
  };
  event?: {
    _id: string;
    title: string;
    eventDate: string;
    location: string;
  };
  createdAt: string;
  updatedAt: string;
}
