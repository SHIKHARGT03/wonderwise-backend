import { fetchHotelDataFromAI } from "../utils/openaiHotelUtils.js";

export const getHotelOptions = async (req, res) => {
  const { destination } = req.params;
  try {
    const data = await fetchHotelDataFromAI(destination);
    res.status(200).json(data);
  } catch (error) {
    console.error("Hotel fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch hotel options." });
  }
};