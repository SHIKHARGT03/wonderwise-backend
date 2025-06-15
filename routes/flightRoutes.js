import express from "express";
import { getFlights } from "../controllers/flightController.js";
const router = express.Router();
router.get("/:destination", getFlights);
export default router;