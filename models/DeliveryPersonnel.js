const mongoose = require("mongoose");

const deliveryPersonnelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  role: { type: String, default: "Delivery Personnel" },
});

module.exports = mongoose.model("DeliveryPersonnel", deliveryPersonnelSchema);
