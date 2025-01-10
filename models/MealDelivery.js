const mongoose = require("mongoose");

const mealDeliverySchema = new mongoose.Schema({
  patientName: String,
  deliveryStatus: { type: String, default: "Pending" },
  deliveryDate: { type: Date, default: Date.now },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryPersonnel",
  },
  mealPlan: { type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" },
  roomNumber: String,
  deliveryNotes: String,
});

const MealDelivery = mongoose.model("MealDelivery", mealDeliverySchema);
module.exports = MealDelivery;
