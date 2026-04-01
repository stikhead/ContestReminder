import { Router } from "express";
import { past, today, toggleReminder, upcoming } from "../controllers/contest.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { contestFetchRateLimit } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.route('/today').get(verifyJWT , today);
router.route('/upcoming').get(verifyJWT , upcoming);
router.route('/past').get(verifyJWT, past);
router.route('/toggle').post(verifyJWT, toggleReminder);
export default router