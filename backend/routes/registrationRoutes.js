const express = require("express");
const {
  createRegistration,
  getRegistrationsByEventId,
} = require("../controllers/registrationController");

const router = express.Router();

router.post("/", createRegistration);
router.get("/:eventId", getRegistrationsByEventId);

module.exports = router;
