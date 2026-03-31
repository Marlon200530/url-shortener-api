import express from "express";
import { createShortUrl, getUrl } from "../controllers/short-url.controller";
import { auth } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", auth, createShortUrl);

export default router;



