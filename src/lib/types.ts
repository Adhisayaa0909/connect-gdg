export interface GDGEvent {
  id: string;
  title: string;
  description: string;
  department: string;
  startDate: string;
  endDate: string;
  location: string;
  locationType: "online" | "offline";
  image: string;
  organizer: string;
  gallery: string[];
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  rsvp: "going" | "not_going";
  createdAt: string;
}
