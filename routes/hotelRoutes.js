import express from "express";
import { getHotelOptions } from "../controllers/hotelController.js";
const router = express.Router();
router.get("/:destination", getHotelOptions);
export default router;