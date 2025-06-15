import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const prompt = `
You are a professional travel assistant. A user will provide a destination city.

You must return a valid JSON object with exactly this structure and NOTHING else:

{
  "sightseeing_bus": {
    "name": "",
    "description": "",
    "price_per_person_inr": "",
    "availability": ""
  },
  "private_cab": {
    "service_name": "",
    "description": "",
    "price_per_day_inr": "",
    "contact": ""
  },
  "local_transport": {
    "service_name": "",
    "type": "", // e.g., \"Ride sharing\", \"Auto-rickshaw\", \"Bike taxis\"
    "description": "",
    "app_available": true // true or false
  }
}

- All services must be real and exist in the destination city.
- Do NOT invent names or services.
- The sightseeing bus must be an official or well-known local city tour bus.
- For private cabs, fetch a reliable vendor that serves tourists.
- For local transport, fetch what tourists typically use (Ola, Uber, local autos, etc.).
- Keep all details concise and factual.
- Do NOT add any text before or after the JSON response.
`;

export const fetchTransportDataFromAI = async (destination) => {
  const userQuery = `Destination: ${destination}`;

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
