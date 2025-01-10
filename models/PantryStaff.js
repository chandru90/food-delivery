const mongoose = require("mongoose");

const pantryStaffSchema = new mongoose.Schema({
  name: String,
  contactInfo: String,
  role: { type: String, enum: ["Cook", "Delivery"], default: "Cook" },
});

const PantryStaff = mongoose.model("PantryStaff", pantryStaffSchema);
module.exports = PantryStaff;
