import express from "express";
const router = express.Router();
import { addSubscription } from "../src/controllers/addSubscription.js";

router.post("/", addSubscription);

export default router;
