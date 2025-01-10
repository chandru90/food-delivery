const express = require("express");
const Patient = require("../models/Patient");
const router = express.Router();

// Fetch all patients
router.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find().populate("menuId");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients" });
  }
});

// Add a new patient
router.post("/addPatient", async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    console.log(newPatient);
    await newPatient.save();
    res.json(newPatient);
  } catch (error) {
    res.status(500).json({ message: "Error adding new patient" });
  }
});

module.exports = router;
