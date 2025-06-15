import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const fetchFlightAndHotelOptions = async (source, destination, date) => {
  const systemPrompt = `
You are a professional travel planner.

Given a source city, a destination city, and a departure date, return a single JSON object containing:
- 3 real and existing flight options from source to destination on the given date
- 3 real hotels available in the destination city

IMPORTANT GUIDELINES:
- ONLY return a single JSON object in the format below. No explanation or extra text.
- Do NOT make up flight numbers, airlines, or hotels. Use only real-world examples.
- Airport codes must be IATA 3-letter codes (e.g., DEL for New Delhi).
- Hotel details must be actual known hotels in the destination city.
- All hotels must be within 15 km from the nearest major airport.
- No hallucinations. Accuracy and realism are a must.
- Avoid luxury hotels; stick to budget and mid-range (3-star or 4-star max).

Expected structure:

{
  "flights": [
    {
      "airline": "string",
      "flightNumber": "string",
      "departureAirport": "IATA_CODE",
      "arrivalAirport": "IATA_CODE",
      "departureTime": "YYYY-MM-DDTHH:mm",
      "arrivalTime": "YYYY-MM-DDTHH:mm",
      "duration": "e.g. 2h 30m",
      "stops": 0 or 1,
      "price": number (in INR)
    },
    ...
  ],
  "hotels": [
    {
      "name": "string",
      "price": number (per night, in INR),
      "rating": number (out of 5),
      "description": "string",
      "distanceFromAirport": "e.g. 5 km"
    },
    ...
  ]
}
`;

  const userMessage = `Plan travel from ${source} to ${destination} on ${date}.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.2
    });

    let content = completion.choices[0].message.content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/```json|```/g, "").trim();
    }

    const result = JSON.parse(content);
    return result;
  } catch (err) {
    console.error("OpenAI fetch error:", err.message);
    throw new Error("Failed to fetch flight and hotel options from AI.");
  }
};
