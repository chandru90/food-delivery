const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  diseases: { type: String },
  allergies: { type: String },
  roomNumber: { type: String },
  bedNumber: { type: String },
  floorNumber: { type: String },
  age: { type: Number },
  gender: { type: String },
  contactInfo: { type: String },
  emergencyContact: { type: String },
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: "MealMenu" },
});

module.exports = mongoose.model("Patient", patientSchema);
