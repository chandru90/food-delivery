const express = require('express');
const MealStatus = require('../models/MealStatus');
const router = express.Router();

// Get all meal statuses
router.get('/mealStatus', async (req, res) => {
  try {
    const meals = await MealStatus.find().populate('assignedPersonnel');
    res.json({ deliveries: meals });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meal statuses' });
  }
});

// Update meal status
router.put('/updateMealStatus/:mealId', async (req, res) => {
  const { mealId } = req.params;
  const { deliveryStatus } = req.body;

  try {
    const meal = await MealStatus.findById(mealId);
    if (meal) {
      meal.deliveryStatus = deliveryStatus;
      await meal.save();
      res.json({ message: 'Meal status updated' });
    } else {
      res.status(404).json({ message: 'Meal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating meal status' });
  }
});

module.exports = router;
