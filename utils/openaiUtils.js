import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const fetchExploreData = async (destination) => {
  const prompt = `
You are a travel assistant. The user will provide a destination name. Your task is to return ONLY a single JSON object (no other text or explanation) with the following structure:

{
  "mustVisit": [
    { "name": "", "description": "" },
    ... (6 places)
  ],
  "adventures": [
    { "name": "", "description": "", "price": "INR ... per person" },
    ... (3 adventures)
  ],
  "restaurants": [
    { "name": "", "description": "", "rating": "4.5" },
    ... (3 restaurants)
  ]
}

Rules:
- Must be accurate and real-world places/activities for the destination.
- Adventures must be realistic for the destination (e.g. no scuba diving in Jaipur).
- Prices: INR 800-2000 for domestic, INR 2500-6000 for international.
- Restaurant ratings must be out of 5 (e.g. 4.3, 4.5, etc).
- Do not add images or URLs. Do not add any extra explanation.
- The output MUST be clean, valid JSON only.

User query: ${destination}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a travel assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    let data = response.choices[0].message.content.trim();

    // Remove Markdown code block if present
    if (data.startsWith("```")) {
      data = data.replace(/```json|```/g, "").trim();
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.error("Raw data from OpenAI:", data);
      throw error; // Re-throw the error to be caught by the caller
    }
  } catch (error) {
    console.error("Error fetching data from OpenAI:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};
