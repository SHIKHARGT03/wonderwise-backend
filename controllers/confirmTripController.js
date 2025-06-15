// controllers/confirmTripController.js

import ConfirmedTrip from '../models/confirmTripModel.js';
import Trip from '../models/tripModel.js';

// ✅ POST /api/confirm-trip
export const confirmTrip = async (req, res) => {
  try {
    const { tripId, selectedFlight, selectedHotel } = req.body;

    // Find trip
    const originalTrip = await Trip.findById(tripId);
    if (!originalTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if already confirmed
    const alreadyConfirmed = await ConfirmedTrip.findOne({ originalTripId: tripId });
    if (alreadyConfirmed) {
      return res.status(400).json({ message: 'Trip already confirmed' });
    }

    // Create confirmed trip
    const confirmedTrip = new ConfirmedTrip({
      originalTripId: originalTrip._id,
      summary: {
        selectedTheme: originalTrip.selectedTheme,
        budgetLevel: originalTrip.budgetLevel,
        destination: originalTrip.destination,
        tripDuration: originalTrip.tripDuration,
        departureDate: originalTrip.departureDate,
        travelCategory: originalTrip.travelCategory,
        companions: originalTrip.companions,
        specificInterests: originalTrip.specificInterests,
        personalizationNote: originalTrip.personalizationNote,
      },
      itinerary: originalTrip.itinerary,
      selectedFlight,
      selectedHotel,
    });

    await confirmedTrip.save();
    res.status(201).json({ message: 'Trip confirmed successfully!', confirmedTrip });
  } catch (error) {
    console.error('Error confirming trip:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET /api/confirm-trip?userId=...
export const getUserConfirmedTrips = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const trips = await ConfirmedTrip.find({ userId })
      .sort({ confirmedAt: -1 })
      .populate('originalTripId');

    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching confirmed trips:', error);
    res.status(500).json({ message: 'Server error fetching trips' });
  }
};

// ✅ NEW: GET /api/confirm-trip/by-trip/:tripId
export const getConfirmedTripByTripId = async (req, res) => {
  try {
    const { tripId } = req.params;

    const confirmed = await ConfirmedTrip.findOne({ originalTripId: tripId }).populate('originalTripId');

    if (!confirmed) {
      return res.status(404).json({ message: 'Confirmed trip not found for given tripId' });
    }

    res.status(200).json(confirmed);
  } catch (error) {
    console.error('Error fetching confirmed trip by tripId:', error);
    res.status(500).json({ message: 'Server error fetching confirmed trip' });
  }
};
