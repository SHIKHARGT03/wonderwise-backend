import { fetchFlightAndHotelOptions } from "../utils/openaiTrip.js";

export const getFlightAndHotelOptions = async (req, res) => {
  try {
    const { source, destination, date } = req.body;

    if (!source || !destination || !date) {
      return res.status(400).json({ message: "Source, destination, and date are required." });
    }

    const { flights, hotels } = await fetchFlightAndHotelOptions(source, destination, date);

    return res.status(200).json({
      success: true,
      flights,
      hotels,
    });
  } catch (error) {
    console.error("Error fetching flights and hotels:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch flight and hotel options.",
    });
  }
};
