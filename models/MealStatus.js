const mongoose = require("mongoose");

const mealStatusSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  deliveryStatus: { type: String, default: "Prepared" },
  assignedPersonnel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryPersonnel",
  },
});

module.exports = mongoose.model("MealStatus", mealStatusSchema);
