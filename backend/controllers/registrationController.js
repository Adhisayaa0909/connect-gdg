const Event = require("../models/Event");
const Registration = require("../models/Registration");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createRegistration = async (req, res) => {
  try {
    const { eventId, name, email, phone, college, department, rsvp } = req.body;

    if (!eventId || !name || !email || !phone || !college || !department) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registration = await Registration.create({
      eventId,
      name,
      email,
      phone,
      college,
      department,
      rsvp: rsvp || "going",
    });

    return res.status(201).json(registration);
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

const getRegistrationsByEventId = async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    return res.status(200).json(registrations);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch registrations", error: error.message });
  }
};

module.exports = {
  createRegistration,
  getRegistrationsByEventId,
};
