import express from "express";
import { processPayment } from "../controllers/paymentController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, processPayment);

export default router;
