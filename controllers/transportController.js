import { fetchTransportDataFromAI } from "../utils/openaiTransportUtils.js";

export const getTransportOptions = async (req, res) => {
  const { destination } = req.params;

  try {
    const data = await fetchTransportDataFromAI(destination);
    res.status(200).json(data);
  } catch (error) {
    console.error("Transport fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch transport options." });
  }
};
