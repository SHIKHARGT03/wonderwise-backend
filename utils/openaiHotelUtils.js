import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const prompt = `
You are a professional hotel recommendation assistant.

Given a city, return this exact structure only:
{
  "budget_hotels": [
    {
      "name": "",
      "price_per_night_inr": "",
      "review_out_of_5": "",
      "distance_from_airport_km": ""
    }, ...
  ],
  "premium_hotels": [
    {
      "name": "",
      "price_per_night_inr": "",
      "review_out_of_5": "",
      "distance_from_airport_km": ""
    }, ...
  ]
}

- Budget hotels should be 3-star affordable options.
- Premium should be 4-star, slightly costly, but below luxury.
- ALL hotels must be real and available in the given city.
- Distance must be under 15km from the nearest major airport.
- Provide accurate pricing and reviews.
- Do NOT invent names or hotels.
- Provide 3 hotels in both Budget hotels and Premium hotel category sorting from cheapest to costliest.

`;

export const fetchHotelDataFromAI = async (destination) => {
  const userQuery = `Hotels in ${destination}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: userQuery }
    ],
    temperature: 0.2
  });
  let content = completion.choices[0].message.content.trim();
  if (content.startsWith("```")) {
    content = content.replace(/```json|```/g, "").trim();
  }
  return JSON.parse(content);
};
