import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const prompt = `
You are a professional travel agent. Given a fixed departure city (New Delhi) and a destination, return a valid JSON object with 3 real and existing flight options.

Only return this JSON:
{
  "flights": [
    {
      "airline": "",
      "flight_number": "",
      "departure_airport": "DEL",
      "arrival_airport": "",
      "departure_time": "",
      "arrival_time": "",
      "duration": "",
      "stops": "",
      "price_inr": "INR ..."
    }, ...
  ]
}

- Use only real flight routes.
- No made-up airlines or flights.
- Focus on accurate airlines and real pricing estimates.
- The name of airport should be in 3 letters code only, full name of airport not required.
- Keep the response short and correct.
`;

export const fetchFlightDataFromAI = async (destination) => {
  const userQuery = `New Delhi to ${destination}`;
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
