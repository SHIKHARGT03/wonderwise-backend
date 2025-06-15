import { fetchFlightDataFromAI } from "../utils/openaiFlightUtils.js";

export const getFlights = async (req, res) => {
  const { destination } = req.body;

  try {
    const data = await fetchFlightDataFromAI(destination);
    res.json(data);
  } catch (err) {
    console.error("Error in getFlights:", err);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
};
