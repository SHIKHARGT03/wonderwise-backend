import express from "express";
import { getTransportOptions } from "../controllers/transportController.js";

const router = express.Router();
router.get("/:destination", getTransportOptions);
export default router;
