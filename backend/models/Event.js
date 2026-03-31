const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    department: {
      type: String,
      default: "All Departments",
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    locationType: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    image: {
      type: String,
      default: "",
    },
    organizer: {
      type: String,
      default: "",
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Expose a frontend-friendly id field.
eventSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = mongoose.model("Event", eventSchema);
