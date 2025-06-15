import { fetchExploreData } from "../utils/openaiUtils.js";
import { fetchTransportDataFromAI } from "../utils/openaiTransportUtils.js";
import { fetchFlightDataFromAI } from "../utils/openaiFlightUtils.js";
import { fetchHotelDataFromAI } from "../utils/openaiHotelUtils.js";

export const getMustVisitPlaces = async (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({ error: "Destination is required" });
  }

  try {
    const data = await fetchExploreData(destination);
    if (!data || !data.mustVisit) {
      return res
        .status(500)
        .json({ error: "Failed to fetch or invalid data from OpenAI" });
    }
    res.json(data.mustVisit);
  } catch (err) {
    console.error("Error in getMustVisitPlaces:", err);
    res.status(500).json({ error: "Failed to fetch from OpenAI" });
  }
};

export const getAdventures = async (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({ error: "Destination is required" });
  }

  try {
    const data = await fetchExploreData(destination);
    if (!data || !data.adventures) {
      return res
        .status(500)
        .json({ error: "Failed to fetch or invalid data from OpenAI" });
    }
    res.json(data.adventures);
  } catch (err) {
    console.error("Error in getAdventures:", err);
    res.status(500).json({ error: "Failed to fetch from OpenAI" });
  }
};

export const getRestaurants = async (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({ error: "Destination is required" });
  }

  try {
    const data = await fetchExploreData(destination);
    if (!data || !data.restaurants) {
      return res
        .status(500)
        .json({ error: "Failed to fetch or invalid data from OpenAI" });
    }
    res.json(data.restaurants);
  } catch (err) {
    console.error("Error in getRestaurants:", err);
    res.status(500).json({ error: "Failed to fetch from OpenAI" });
  }
};

export const getFlights = async (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({ error: "Destination is required" });
  }

  try {
    const data = await fetchFlightDataFromAI(destination);
    if (!data || !data.flights) {
      return res
        .status(500)
        .json({ error: "Failed to fetch or invalid data from OpenAI" });
    }
    res.json(data.flights);
  } catch (err) {
    console.error("Error in getFlights:", err);
    res.status(500).json({ error: "Failed to fetch flight data from OpenAI" });
  }
};

export const getHotels = async (req, res) => {
  const { destination } = req.body;
  if (!destination) return res.status(400).json({ error: "Destination is required" });

  try {
    const data = await fetchHotelDataFromAI(destination);
    if (!data?.budget_hotels || !data?.premium_hotels) {
      return res.status(500).json({ error: "Invalid or missing hotel data" });
    }
    res.json(data);
  } catch (err) {
    console.error("getHotels error:", err);
    res.status(500).json({ error: "Failed to fetch hotel data from OpenAI" });
  }
};

export const getTransportOptions = async (req, res) => {
  const { destination } = req.body;
  if (!destination) return res.status(400).json({ error: "Destination is required" });

  try {
    const data = await fetchTransportDataFromAI(destination);
    if (!data?.sightseeing_bus || !data?.private_cab || !data?.local_transport) {
      return res.status(500).json({ error: "Invalid or missing transport data" });
    }
    res.json(data);
  } catch (err) {
    console.error("getTransportOptions error:", err);
    res.status(500).json({ error: "Failed to fetch transport data" });
  }
};