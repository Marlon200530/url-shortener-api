import express from "express";
import { createShortUrl } from "../controllers/short-url.controller";
import { auth } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", auth, createShortUrl);

export default router;
