const express = require("express");
const DeliveryPersonnel = require("../models/DeliveryPersonnel");
const router = express.Router();

// Fetch delivery personnel
router.get("/deliveryPersonnel", async (req, res) => {
  try {
    const personnel = await DeliveryPersonnel.find();
    res.json(personnel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching delivery personnel" });
  }
});

// Add new delivery personnel
router.post("/addDeliveryPersonnel", async (req, res) => {
  try {
    const newPersonnel = new DeliveryPersonnel(req.body);
    await newPersonnel.save();
    res.json(newPersonnel);
  } catch (error) {
    res.status(500).json({ message: "Error adding new delivery personnel" });
  }
});

module.exports = router;
