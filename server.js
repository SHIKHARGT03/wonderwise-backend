import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js'; // include `.js` extension for ESM
import exploreRoutes from './routes/exploreRoutes.js';
import transportRoutes from "./routes/transportRoutes.js";
import flightRoutes from "./routes/flightRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import destinationRoutes from "./routes/destination.route.js";
import tripRoutes from "./routes/tripRoutes.js";
import confirmTripRoutes from './routes/confirmTripRoute.js';
import flightHotelRoutes from "./routes/flightHotelRoutes.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: function (origin, callback) {
    // Allow all localhost ports (e.g., 5173, 5174, 5175, etc.)
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/explore', exploreRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/destination", destinationRoutes);

app.use("/api/trip", tripRoutes);
app.use("/api/flights-hotels", flightHotelRoutes);
app.use('/api/confirm-trip', confirmTripRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

