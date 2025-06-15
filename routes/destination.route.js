import express from "express";
import {
  getMustVisitPlaces,
  getAdventures,
  getRestaurants,
  getFlights,
  getHotels,
  getTransportOptions,
} from "../controllers/destination.controller.js";

const router = express.Router();

router.post("/must-visit", getMustVisitPlaces);
router.post("/adventures", getAdventures);
router.post("/restaurants", getRestaurants);
router.post("/flights", getFlights); // New route for flights
router.post("/hotels", getHotels); // New route for hotels
router.post("/transport", getTransportOptions);

export default router;
