const express = require("express");
const router = express.Router();

// Fetch pantry performance (can be enhanced as needed)
router.get("/pantryPerformance", async (req, res) => {
  try {
    // Just sending hardcoded data for now
    res.json([
      { _id: "1", name: "John", role: "Pantry Worker" },
      { _id: "2", name: "Jane", role: "Pantry Worker" },
    ]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pantry performance" });
  }
});

module.exports = router;
