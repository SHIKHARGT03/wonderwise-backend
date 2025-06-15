// src/controllers/tripController.js
import Trip from "../models/tripModel.js";
import { fetchItineraryFromAI } from "../utils/openaiItinerary.js";
import dayjs from "dayjs";

export const generateItinerary = async (req, res) => {
  try {
    const {
      destination,
      selectedTheme,
      budgetLevel,
      companions,
      tripDuration,
      departureDate,
      travelCategory,
      specificInterests,
      personalizationNote,
      userId,
    } = req.body;

    // Check if similar trip exists within 7 days
    const oneWeekAgo = dayjs().subtract(7, "day").toDate();
    const existingTrip = await Trip.findOne({
      userId,
      destination,
      selectedTheme,
      budgetLevel,
      companions,
      tripDuration,
      departureDate,
      travelCategory,
      specificInterests,
      createdAt: { $gte: oneWeekAgo },
    });

    if (existingTrip) {
      return res.status(200).json(existingTrip);
    }

    // Fetch from OpenAI
    const result = await fetchItineraryFromAI(req.body);

    // Save new trip
    const newTrip = new Trip({
      userId,
      destination,
      selectedTheme,
      budgetLevel,
      companions,
      tripDuration,
      departureDate,
      travelCategory,
      specificInterests,
      personalizationNote,
      itinerary: result.itinerary,
    });

    await newTrip.save();
    res.status(200).json(newTrip);
  } catch (err) {
    console.error("Error generating itinerary:", err.message);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
};
