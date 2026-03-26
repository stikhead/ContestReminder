import { Router } from "express";
import { loginUser, logoutUser, refresh, registerUser, verifyUser } from "../controllers/user.controller.js";
import { verifyRateLimit, loginRateLimit, logoutRateLimit } from "../middleware/rateLimit.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/verify').post(verifyRateLimit, verifyUser);
router.route('/login').post(loginRateLimit, loginUser);
router.route('/logout').post(logoutRateLimit, verifyJWT, logoutUser);
router.route('/refresh').post(refresh);
export default router