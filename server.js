// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");

// app.use(cors());
// app.use(express.json());

// // In-memory data for patients and meal statuses
// let patients = [];
// let mealStatuses = [];
// let pantryPerformance = [
//   { _id: "1", name: "John Doe", role: "Chef" },
//   { _id: "2", name: "Jane Smith", role: "Assistant" },
// ];
// let deliveryPersonnel = [
//   {
//     _id: "1",
//     name: "Delivery Person 1",
//     contact: "1234567890",
//     role: "Delivery Personnel",
//   },
//   {
//     _id: "2",
//     name: "Delivery Person 2",
//     contact: "9876543210",
//     role: "Delivery Personnel",
//   },
// ];

// // Add new patient route
// app.post("/api/addPatient", (req, res) => {
//   const newPatient = req.body;
//   newPatient._id = patients.length + 1; // Ensure unique ID for patient
//   patients.push(newPatient);

//   // Add corresponding meal status for the new patient
//   const newMealStatus = {
//     _id: `meal-${newPatient._id}`, // Unique ID for meal status
//     patientName: newPatient.name,
//     deliveryStatus: "Prepared", // Default delivery status
//     menu: newPatient.menu,
//   };
//   mealStatuses.push(newMealStatus);

//   res.status(201).json(newPatient); // Return the newly added patient
// });

// // Get all patients
// app.get("/api/dashboard/patients", (req, res) => {
//   res.status(200).json(patients);
// });

// // Get meal statuses (for Pantry Dashboard)
// app.get("/api/dashboard/mealStatus", (req, res) => {
//   res.status(200).json({ deliveries: mealStatuses });
// });

// // Get pantry performance (staff)
// app.get("/api/dashboard/pantryPerformance", (req, res) => {
//   res.status(200).json(pantryPerformance);
// });

// // Get delivery personnel
// app.get("/api/dashboard/deliveryPersonnel", (req, res) => {
//   res.status(200).json(deliveryPersonnel);
// });

// // Update meal status (Pantry Dashboard)
// app.put("/api/dashboard/updateMealStatus/:mealId", (req, res) => {
//   const { mealId } = req.params;
//   const { deliveryStatus } = req.body;

//   let meal = mealStatuses.find((meal) => meal._id === mealId);
//   if (meal) {
//     meal.deliveryStatus = deliveryStatus;
//     res.status(200).json(meal);
//   } else {
//     res.status(404).json({ message: "Meal not found" });
//   }
// });

// // Add new delivery personnel
// app.post("/api/dashboard/addDeliveryPersonnel", (req, res) => {
//   const newPersonnel = req.body;
//   newPersonnel._id = deliveryPersonnel.length + 1;
//   deliveryPersonnel.push(newPersonnel);

//   res.status(201).json(newPersonnel);
// });

// // New API to fetch only "In Progress" deliveries (this is the new endpoint requested)
// app.get("/api/dashboard/getInProgressDeliveries", (req, res) => {
//   // Filter the meals that are "In Progress"
//   const inProgressDeliveries = mealStatuses.filter(
//     (meal) => meal.deliveryStatus === "In Progress"
//   );

//   res.status(200).json(inProgressDeliveries);
// });

// // Mark delivery as delivered
// app.put("/api/delivery/markDelivered/:mealId", (req, res) => {
//   const { mealId } = req.params;
//   const { deliveryStatus, notes, deliveryTime } = req.body;

//   // Find the meal by mealId
//   const meal = mealStatuses.find((meal) => meal._id === mealId);
//   if (meal) {
//     meal.deliveryStatus = deliveryStatus || "Delivered"; // Ensure status is updated
//     meal.deliveryTime = deliveryTime; // Add the delivery time
//     meal.notes = notes || ""; // Add notes if provided

//     // Respond with the updated meal status
//     res.status(200).json(meal);
//   } else {
//     res.status(404).json({ message: "Meal not found" });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // You can still keep this if you want to allow credentials (cookies, headers)
  })
);
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

// Patient Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomNumber: { type: String, required: true },
  bedNumber: { type: String, required: true },
  floorNumber: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contactInfo: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  menu: { type: String, required: true },
  status: { type: String, default: "Active" },
});

const Patient = mongoose.model("Patient", patientSchema);

// Meal Status Schema
const mealStatusSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  deliveryStatus: { type: String, default: "Prepared" },
  menu: { type: String, required: true },
  deliveryAgent: { type: String, default: "" }, // Added field for delivery agent
});

const MealStatus = mongoose.model("MealStatus", mealStatusSchema);

// Pantry Performance Schema
const pantryPerformanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
});

const PantryPerformance = mongoose.model(
  "PantryPerformance",
  pantryPerformanceSchema
);

// Delivery Personnel Schema
const deliveryPersonnelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  role: { type: String, required: true }, // Delivery role
});

const DeliveryPersonnel = mongoose.model(
  "DeliveryPersonnel",
  deliveryPersonnelSchema
);

// Register Route
app.post("/api/auth/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, password, role });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error during registration", error });
  }
});

// Login Route
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error during authentication", error });
  }
});

// Add New Patient Route
app.post("/api/addPatient", async (req, res) => {
  const {
    name,
    roomNumber,
    bedNumber,
    floorNumber,
    age,
    gender,
    contactInfo,
    emergencyContact,
    menu,
  } = req.body;

  try {
    const newPatient = new Patient({
      name,
      roomNumber,
      bedNumber,
      floorNumber,
      age,
      gender,
      contactInfo,
      emergencyContact,
      menu,
    });

    await newPatient.save();

    const newMealStatus = new MealStatus({
      patientName: name,
      menu,
    });

    await newMealStatus.save();

    res.status(201).json({ message: "Patient added", patient: newPatient });
  } catch (error) {
    console.error("Error adding patient", error);
    res.status(500).json({ message: "Error adding patient", error });
  }
});

// Get All Patients
app.get("/api/dashboard/patients", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
});

// Get Meal Statuses
app.get("/api/dashboard/mealStatus", async (req, res) => {
  try {
    const mealStatuses = await MealStatus.find();
    res.status(200).json({ deliveries: mealStatuses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching meal statuses", error });
  }
});

// Get Delivery Personnel
app.get("/api/dashboard/deliveryPersonnel", async (req, res) => {
  try {
    const deliveryPersonnel = await DeliveryPersonnel.find();
    res.status(200).json(deliveryPersonnel);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching delivery personnel", error });
  }
});
// Get "In Progress" Deliveries
app.get("/api/dashboard/getInProgressDeliveries", async (req, res) => {
  try {
    // Query the MealStatus collection for deliveries with "In Progress" status
    const inProgressDeliveries = await MealStatus.find({
      deliveryStatus: "In Progress",
    });

    res.status(200).json(inProgressDeliveries); // Respond with the filtered results
  } catch (error) {
    console.error("Error fetching in-progress deliveries:", error);
    res
      .status(500)
      .json({ message: "Error fetching in-progress deliveries", error });
  }
});

// Update Meal Status and assign Delivery Agent
// app.put("/api/dashboard/updateMealStatus/:mealId", async (req, res) => {
//   const { mealId } = req.params;
//   const { deliveryStatus } = req.body;

//   try {
//     const meal = await MealStatus.findById(mealId);
//     if (!meal) {
//       return res.status(404).json({ message: "Meal not found" });
//     }

//     if (deliveryStatus === "In Progress") {
//       const deliveryAgent = await DeliveryPersonnel.findOne({
//         role: "Delivery",
//       });
//       if (!deliveryAgent) {
//         return res
//           .status(404)
//           .json({ message: "No available delivery agent found" });
//       }
//       meal.deliveryAgent = deliveryAgent.name; // Assign the delivery agent
//     }

//     meal.deliveryStatus = deliveryStatus || meal.deliveryStatus;
//     await meal.save();

//     res.status(200).json(meal);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating meal status", error });
//   }
// });// Update Meal Status and assign Delivery Agent
app.put("/api/dashboard/updateMealStatus/:mealId", async (req, res) => {
  const { mealId } = req.params;
  const { deliveryStatus } = req.body; // We expect the `deliveryStatus` directly in the body

  try {
    // Fetch the meal status by mealId
    const meal = await MealStatus.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Update the delivery status and save the meal status
    meal.deliveryStatus = deliveryStatus || meal.deliveryStatus; // Only update if new status is provided
    await meal.save();

    res.status(200).json(meal); // Respond with updated meal status
  } catch (error) {
    res.status(500).json({ message: "Error updating meal status", error });
  }
});

// Mark Meal as Delivered
app.put("/api/delivery/markDelivered/:mealId", async (req, res) => {
  const { mealId } = req.params;
  const { deliveryStatus, notes, deliveryTime } = req.body;

  try {
    const meal = await MealStatus.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    meal.deliveryStatus = deliveryStatus || "Delivered";
    meal.notes = notes || "";
    meal.deliveryTime = deliveryTime || new Date();

    await meal.save();
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: "Error marking meal as delivered", error });
  }
});
// Update Patient Details
app.put("/api/updatePatient/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    roomNumber,
    bedNumber,
    floorNumber,
    age,
    gender,
    contactInfo,
    emergencyContact,
    menu,
  } = req.body;

  try {
    // Find patient by ID and update the fields
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      {
        name,
        roomNumber,
        bedNumber,
        floorNumber,
        age,
        gender,
        contactInfo,
        emergencyContact,
        menu,
      },
      { new: true } // Return the updated patient object
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient", error);
    res.status(500).json({ message: "Error updating patient", error });
  }
});

// Delete Patient
app.delete("/api/deletePatient/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the patient by ID
    const deletedPatient = await Patient.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Optionally, you can delete related meal status records
    await MealStatus.deleteMany({ patientName: deletedPatient.name });

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient", error);
    res.status(500).json({ message: "Error deleting patient", error });
  }
});
app.get("/api/dashboard/getPatientDetails/:patientName", async (req, res) => {
  const { patientName } = req.params;

  try {
    // Find the patient by name
    const patient = await Patient.findOne({ name: patientName });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Return the necessary details
    res.status(200).json({
      bedNumber: patient.bedNumber,
      roomNumber: patient.roomNumber,
      floorNumber: patient.floorNumber,
    });
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({ message: "Error fetching patient details", error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
