import { fetchExploreData } from "../utils/openaiUtils.js";

export const getExploreData = async (req, res) => {
  const { destinationId } = req.params;

  try {
    const data = await fetchExploreData(destinationId);
    res.status(200).json({ destination: destinationId, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch explore data" });
  }
};
