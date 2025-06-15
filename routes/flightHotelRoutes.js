import express from "express";
import { getFlightAndHotelOptions } from "../controllers/flightHotelController.js";

const router = express.Router();

// Corrected path — this is now POST /api/flights-hotels
router.post("/", getFlightAndHotelOptions);

export default router;
