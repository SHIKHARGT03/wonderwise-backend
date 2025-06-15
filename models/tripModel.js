// src/models/tripModel.js
import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  title: String,
  description: String,
  activities: [String],
  timeToSpend: String,
  openHours: String,
});

const restaurantSchema = new mongoose.Schema({
  title: String,
  description: String,
  costPerPerson: String,
  mustTry: String,
  openHours: String,
});

const arrivalSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String,
  airportCode: String,
});

const shoppingSchema = new mongoose.Schema({
  title: String,
  description: String,
  souvenirs: [String],
});

const daySchema = new mongoose.Schema({
  day: Number,
  blocks: [
    {
      type: {
        type: String,
        enum: [
          "arrival",
          "place",
          "restaurant",
          "shopping",
          "activity",
          "departure",
          "cafe",
          "nightlife",
        ],
      },
      content: mongoose.Schema.Types.Mixed,
    },
  ],
});

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    selectedTheme: String,
    budgetLevel: String,
    destination: String,
    tripDuration: Number,
    departureDate: Date,
    travelCategory: String,
    companions: Number,
    specificInterests: {
      Culinary: [String],
      Arts: [String],
      Nightlife: [String],
      Culture: [String],
    },
    personalizationNote: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    itinerary: [daySchema],
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;
