import express from "express";
import { generateItinerary } from "../controllers/tripController.js";

const router = express.Router();

// Example path: POST http://localhost:5000/api/trip/generate
router.post("/generate", generateItinerary);

export default router;
