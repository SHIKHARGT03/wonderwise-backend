// routes/confirmTripRoute.js

import express from 'express';
import {
  confirmTrip,
  getUserConfirmedTrips,
  getConfirmedTripByTripId,
} from '../controllers/confirmTripController.js';

const router = express.Router();

router.post('/', confirmTrip);
router.get('/', getUserConfirmedTrips);
router.get('/by-trip/:tripId', getConfirmedTripByTripId); // ✅ working now

export default router;
