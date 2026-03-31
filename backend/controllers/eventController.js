const Event = require("../models/Event");
const Registration = require("../models/Registration");

const getAllEvents = async (req, res) => {
  try {
    // Keep a short query timeout so API does not hang on bad DB/network states.
    const events = await Event.find().sort({ startDate: 1 }).maxTimeMS(5000).exec();
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch event", error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      startDate,
      endDate,
      location,
      locationType,
      organizer,
    } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        message: "title, startDate and endDate are required",
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const event = await Event.create({
      title,
      description,
      department,
      startDate,
      endDate,
      location,
      locationType,
      organizer,
      image,
      gallery: [],
    });

    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create event", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Registration.deleteMany({ eventId: req.params.id });

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
};
