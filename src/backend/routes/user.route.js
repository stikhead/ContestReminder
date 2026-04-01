import { Router } from "express";
import { getUserProfile, googleLogin, loginUser, logoutUser, refresh, registerUser, sendOtp, updatePreferences, verifyForgetPasswordOtpAndResetPassword, verifyUser } from "../controllers/user.controller.js";
import { verifyRateLimit, loginRateLimit, logoutRateLimit } from "../middleware/rateLimit.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/verify').post(verifyRateLimit, verifyUser);
router.route('/login').post(loginRateLimit, loginUser);
router.route('/logout').post(logoutRateLimit, verifyJWT, logoutUser);
router.route('/refresh').post(refresh);
router.route('/googleLogin').post(googleLogin);
router.route('/forgot-password').post(verifyForgetPasswordOtpAndResetPassword);
router.route('/send-otp').post(sendOtp);
router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/preferences").patch(verifyJWT, updatePreferences);
export default router