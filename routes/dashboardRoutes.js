const express = require('express');
const router = express.Router();
const MealDelivery = require('../models/MealDelivery');
const Patient = require('../models/Patient');
const MealPlan = require('../models/MealMenu');
const PantryStaff = require('../models/PantryStaff');
const DeliveryPersonnel = require('../models/DeliveryPersonnel');

// Fetch all deliveries for Hospital Food Manager
router.get('/allDeliveries', async (req, res) => {
  try {
    const deliveries = await MealDelivery.find().populate('assignedTo').populate('mealPlan');
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch delayed deliveries
router.get('/delayedDeliveries', async (req, res) => {
  try {
    const currentDate = new Date();
    const delayedDeliveries = await MealDelivery.find({
      deliveryStatus: { $ne: 'Delivered' },
      deliveryDate: { $lt: currentDate },
    }).populate('assignedTo').populate('mealPlan');
    res.status(200).json(delayedDeliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch pantry staff performance
router.get('/pantryPerformance', async (req, res) => {
  try {
    const pantryStaff = await PantryStaff.find();
    res.status(200).json(pantryStaff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all patients and meal plans for Hospital Food Manager
router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find().populate('mealPlan');
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch meal preparation and delivery status for Inner Pantry
router.get('/mealStatus', async (req, res) => {
  try {
    const deliveries = await MealDelivery.find().populate('assignedTo').populate('mealPlan');
    const pantryStaff = await PantryStaff.find();
    res.status(200).json({ deliveries, pantryStaff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
