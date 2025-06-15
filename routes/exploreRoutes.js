import express from "express";
import { getExploreData } from "../controllers/exploreController.js";

const router = express.Router();

// GET /api/explore/:destinationId
router.get("/:destinationId", getExploreData);

export default router;
