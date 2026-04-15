import express from "express";
import { bookSeat, lockSeat, unlockSeat } from "../controllers/bookingController.js";
import { processPayment } from "../controllers/paymentController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.put("/:id", verifyToken, bookSeat);
router.post("/:id/lock", verifyToken, lockSeat);
router.post("/:id/unlock", verifyToken, unlockSeat);

export default router;
