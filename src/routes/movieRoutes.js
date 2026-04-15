import express from "express";
import { getMovies, getSeatsForMovie } from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/:id/seats", getSeatsForMovie);

export default router;
