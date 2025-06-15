// src/models/confirmTripModel.js
import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  airlineName: String,
  flightNumber: String,
  departureAirportCode: String,
  arrivalAirportCode: String,
  departureTime: String,
  arrivalTime: String,
  duration: String,
  stops: Number,
  price: Number,
});

const hotelSchema = new mongoose.Schema({
  name: String,
  price: Number,
  rating: Number,
  description: String,
  distanceFromAirport: String,
});

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

const confirmedTripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    originalTripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
    summary: {
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
    },
    itinerary: [daySchema],
    selectedFlight: flightSchema,
    selectedHotel: hotelSchema,
    confirmedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ConfirmedTrip = mongoose.model("ConfirmedTrip", confirmedTripSchema);
export default ConfirmedTrip;
