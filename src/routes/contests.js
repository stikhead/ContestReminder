import express from "express";
const router = express.Router();
import {
	getAllContests,
	getUpcomingContests,
	getOngoingContests,
	getPastContests,
} from "../controllers/fetchContestsfromDb.js";

router.get("/", getAllContests);
router.get("/upcoming", getUpcomingContests);
router.get("/ongoing", getOngoingContests);
router.get("/past", getPastContests);

export default router;
