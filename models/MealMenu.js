const mongoose = require("mongoose");

const mealMenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  meals: {
    morning: [String],
    afternoon: [String],
    dinner: [String],
  },
  instructions: { type: String },
});

module.exports = mongoose.model("MealMenu", mealMenuSchema);
