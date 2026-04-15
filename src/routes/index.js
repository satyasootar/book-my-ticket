import express from "express";
import authRoutes from "./authRoutes.js";
import movieRoutes from "./movieRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = express.Router();

router.use("/", authRoutes);
router.use("/movies", movieRoutes);
router.use("/book", bookingRoutes);
router.use("/payment", paymentRoutes);

export default router;
