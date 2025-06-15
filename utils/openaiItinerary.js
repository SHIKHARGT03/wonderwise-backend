import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const fetchItineraryFromAI = async (inputData) => {
  const {
    destination,
    selectedTheme,
    budgetLevel,
    companions,
    tripDuration,
    departureDate,
    travelCategory,
    specificInterests,
    personalizationNote,
  } = inputData;

  const prompt = `
You are a professional travel planner. Given the user's preferences, generate a structured itinerary in JSON for a ${tripDuration}-day trip to ${destination}.

User Preferences:
- Theme: ${selectedTheme}
- Budget: ${budgetLevel}
- Number of People: ${companions}
- Travel Category: ${travelCategory}
- Interests: ${JSON.stringify(specificInterests)}
- Personalization Note: ${personalizationNote || "N/A"}

Output Format:
{
  "itinerary": [
    {
      "day": 1,
      "blocks": [
        {
          "type": "arrival",
          "content": {
            "title": "Arrival in ${destination}",
            "description": "Welcome to ${destination}! Your journey begins with a smooth check-in and some relaxing downtime.",
            "price": "INR 800",
            "airportCode": "XYZ"
          }
        },
        {
          "type": "place",
          "content": {
            "title": "Example Landmark Name",
            "description": "This iconic landmark offers stunning views and historic charm, making it a must-visit in ${destination}.",
            "activities": ["Walking tour", "Photography"],
            "openHours": "9 AM - 6 PM",
            "timeToSpend": "2-3 hours"
          }
        },
        {
          "type": "restaurant",
          "content": {
            "title": "Example Restaurant",
            "description": "Enjoy local cuisine at this popular spot known for authentic flavors and a cozy ambiance.",
            "mustTry": "Paneer tikka, Masala dosa",
            "costPerPerson": "INR 400",
            "openHours": "12 PM - 10 PM"
          }
        }
      ]
    },
    ...
    {
      "day": ${tripDuration},
      "blocks": [
        {
          "type": "shopping",
          "content": {
            "title": "Local Bazaar",
            "description": "Wrap up your journey by exploring local markets full of spices, crafts, and souvenirs.",
            "souvenirs": ["Handicrafts", "Spices", "Textiles"]
          }
        }
      ]
    }
  ]
}

Instructions:
- Use real place and restaurant names, realistic suggestions.
- Descriptions must be 15–20 words long.
- IMPORTANT: Return ONLY valid JSON without any pre-text or post-text.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.5,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: `Plan a ${tripDuration}-day trip to ${destination}` },
    ],
  });

  let content = response.choices[0].message.content.trim();
  if (content.startsWith("```")) {
    content = content.replace(/```json|```/g, "").trim();
  }

  // ✅ Parse JSON
  const parsed = JSON.parse(content);

  // ✅ FIX invalid enum types like "adventure" → "activity"
  if (Array.isArray(parsed.itinerary)) {
    parsed.itinerary.forEach(day => {
      day.blocks.forEach(block => {
        if (block.type === "adventure") {
          block.type = "activity";
        }
      });
    });
  }

  return parsed;
};
