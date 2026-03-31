import { GDGEvent, Registration } from "./types";
import { mockEvents, mockRegistrations } from "./mock-data";

// Simple in-memory store (replace with Supabase/Lovable Cloud later)
let events: GDGEvent[] = [...mockEvents];
let registrations: Registration[] = [...mockRegistrations];

export const getEvents = () => [...events];

export const getEvent = (id: string) => events.find((e) => e.id === id);

export const createEvent = (event: Omit<GDGEvent, "id" | "createdAt">) => {
  const newEvent: GDGEvent = {
    ...event,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  events = [newEvent, ...events];
  return newEvent;
};

export const updateEventImage = (id: string, image: string) => {
  events = events.map((e) => (e.id === id ? { ...e, image } : e));
};

export const deleteEvent = (id: string) => {
  events = events.filter((e) => e.id !== id);
  registrations = registrations.filter((r) => r.eventId !== id);
};

export const getRegistrations = (eventId?: string) =>
  eventId ? registrations.filter((r) => r.eventId === eventId) : [...registrations];

export const createRegistration = (reg: Omit<Registration, "id" | "createdAt">) => {
  const newReg: Registration = {
    ...reg,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  registrations = [newReg, ...registrations];
  return newReg;
};

export const toggleRSVP = (regId: string) => {
  registrations = registrations.map((r) =>
    r.id === regId ? { ...r, rsvp: r.rsvp === "going" ? "not_going" : "going" } : r
  );
};
