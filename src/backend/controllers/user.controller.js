import "dotenv/config";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendVerificationEmail } from "../services/email.service.js";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import axios from 'axios';

const generateAccessAndRefreshToken = async (user) => {

    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    if (!accessToken || !refreshToken) {
        throw new ApiError(500, "An internal server error occurred");
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
}

const generateVerificationToken = () => {

    const verificationPayload = crypto.randomBytes(32).toString("hex");

    return verificationPayload
}

const isOtpAvailableAndGenerateOtp = async (user) => {
    const currentTime = Date.now();


    if (!user.verification) {
        user.verification = {};
    }

    if (user.verification?.nextOtpAvailableAt && currentTime < user.verification.nextOtpAvailableAt) {
        const secondsLeft = Math.ceil((user.verification.nextOtpAvailableAt - currentTime) / 1000);
        throw new ApiError(429, `Please wait ${secondsLeft} seconds before requesting another code.`);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const cooldownMs = 60 * 1000;
    const expiryMs = 15 * 60 * 1000;
    const nextAvailable = currentTime + cooldownMs;

    if (user.isVerified) {
        user.verification.passwordToken = otp;
        user.verification.passwordExpiry = currentTime + expiryMs;
    } else {
        user.verification.emailToken = otp;
        user.verification.emailExpiry = currentTime + expiryMs;
    }

    user.verification.nextOtpAvailableAt = nextAvailable;
    return { nextAvailable, otp, user };

}

const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });


    if (existingUser) {
        if (existingUser.isVerified) {
            throw new ApiError(409, "Email already in use");
        }

        const { nextAvailable, otp, user } = await isOtpAvailableAndGenerateOtp(existingUser)

        user.password = password;


        await user.save({ validateBeforeSave: true });

        try {
            await sendVerificationEmail(normalizedEmail, otp);
        } catch (error) {
            throw new ApiError(500, "User updated but failed to send email. Please try resending.");
        }

        return res.status(200).json(
            new ApiResponse(200, {
                email: normalizedEmail,
                nextOtpAvailableAt: nextAvailable
            }, "Verification email resent.")
        );
    }


    const newUser = await User.create({
        email: normalizedEmail,
        password: password,
    });

    const { nextAvailable, otp, user } = await isOtpAvailableAndGenerateOtp(newUser)
    user.save({ validateBeforeSave: false })
    try {
        await sendVerificationEmail(normalizedEmail, otp);
    } catch (error) {
        await User.findByIdAndDelete(user._id);
        throw new ApiError(500, "Failed to send verification email. Please try again.");
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken -verification");

    return res.status(201).json(
        new ApiResponse(201, {
            user: createdUser,
            nextOtpAvailableAt: nextAvailable
        }, "User registered successfully. Please verify your email.")
    );
});

const verifyUser = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }
    console.log(otp)
    const user = await User.findOne({
        'email': email,
        "verification.emailToken": otp,
        "verification.emailExpiry": { $gt: Date.now() }
    })

    if (!user) {
        throw new ApiError(400, "Invalid or expired otp")
    }



    user.isVerified = true;
    user.verification = undefined;
    await user.save({ validateBeforeSave: false });
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user);
    const savedUser = await User.findById(user?._id).select('-password -refreshToken');


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken, savedUser },
                "Account verified successfully"
            )
        );
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
        throw new ApiError(401, "User not found");
    }

    const isPassword = await user.comparePassword(password);

    if (!isPassword) {
        throw new ApiError(401, "Invalid Password");
    }

    if (!user.isVerified) {

        throw new ApiError(403, "Please verify your email before logging in.");
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user);
    const savedUser = await User.findById(user?._id).select('-password -refreshToken');

    return res
        .status(200)
        .cookie(
            'accessToken', `${accessToken}`, {
            httpOnly: true,
            secure: true
        }
        )
        .cookie(
            'refreshToken', `${refreshToken}`, {
            httpOnly: true,
            secure: true
        }
        )
        .json(
            new ApiResponse(200, {
                user: savedUser,
                accessToken: accessToken,
                refreshToken: refreshToken
            },
                "User logged in successfullty")
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    await User.findByIdAndUpdate(
        req?.user?._id,
        {
            $unset: { refreshToken: 1 }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie(
            'accessToken', {
            httpOnly: true,
            secure: true
        })
        .clearCookie(
            'refreshToken', {
            httpOnly: true,
            secure: true
        })
        .json(
            new ApiResponse(200, {}, "logged out")
        )

})

const refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    console.log(refreshToken)
    if (!refreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodeToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id);

        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }

        if (refreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user);

        return res
            .status(200)
            .cookie(
                'accessToken', accessToken, {
                httpOnly: true,
                secure: true
            }
            )
            .cookie(
                'refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true
            }
            )
            .json(
                new ApiResponse(200, {
                    accessToken: accessToken,
                    refreshToken: newRefreshToken
                }, "Tokens refreshed successfully")
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const googleLogin = asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (!code) {
        throw new ApiError(
            400, 'Google token is required'
        )
    }

    let googleUser;
    try {
        const { data: tokens } = await axios.post(`${process.env.GOOGLE_OAUTH_URI}`, {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.GOOGLE_REDIRECT_URI
        });

        const { access_token } = tokens;

        const response = await axios.get(`${process.env.GOOGLE_VERIFICATION_URI}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        googleUser = response.data;

    } catch (error) {
        console.error(error.response?.data || error.message);
        throw new ApiError(401, "Google authentication failed");
    }

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
        const generatedPassword = generateVerificationToken();

        user = await User.create({
            email: googleUser.email,
            password: generatedPassword,
            isVerified: true,
            name: googleUser.name
        });
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user);
    return res
        .status(200)
        .cookie(
            'accessToken', `${accessToken}`, {
            httpOnly: true,
            secure: true
        }
        )
        .cookie(
            'refreshToken', `${refreshToken}`, {
            httpOnly: true,
            secure: true
        }
        )
        .json(
            new ApiResponse(200, {
                user: user,
                accessToken: accessToken,
                refreshToken: refreshToken
            },
                "User logged in successfullty")
        )
})

const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, 'Email is required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (!existingUser) {
        return res.status(200).json(
            new ApiResponse(200, {nextOtpAvailableAt: Date.now() + ( 60 * 1000)}, "If an account exists, a new code has been sent.")
        );
    }

    const { nextAvailable, otp, user } = await isOtpAvailableAndGenerateOtp(existingUser);

    await user.save({ validateBeforeSave: false });

    try {
        await sendVerificationEmail(normalizedEmail, otp);
        console.log(`OTP Resent to ${normalizedEmail}: ${otp}`);
    } catch (error) {
        if (user.isVerified) {
            user.verification.passwordToken = undefined;
            user.verification.passwordExpiry = undefined;
        } else {
            user.verification.emailToken = undefined;
            user.verification.emailExpiry = undefined;
        }
        user.verification.nextOtpAvailableAt = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ApiError(500, `Failed to send email: ${error.message}`);
    }

    return res.status(200).json(
        new ApiResponse(200, {
            nextOtpAvailableAt: nextAvailable
        }, 'If an account exists, a new code has been sent.')
    );
});


const verifyForgetPasswordOtpAndResetPassword = asyncHandler(async (req, res) => {
    const { otp, email, newPassword } = req.body;

    if (!otp || !email || !newPassword) {
        throw new ApiError(400, "All fields (email, otp, newPassword) are required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        throw new ApiError(400, 'Invalid or expired OTP');
    }

    let validOtp;
    if (user.isVerified) {
        validOtp = user.verification?.passwordToken === otp && user.verification?.passwordExpiry > currentTime;
    } else {
        validOtp = user.verification?.emailToken === otp && user.verification?.emailExpiry > currentTime;

    }

    if (!validOtp) {
        throw new ApiError(400, 'Invalid or expired OTP');
    }


    if (!user.isVerified) {
        user.isVerified = true;
    }

    user.verification.passwordToken = undefined;
    user.verification.passwordExpiry = undefined;
    user.verification.emailToken = undefined;
    user.verification.emailExpiry = undefined;
    await user.save({ validateBeforeSave: true });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset successfully")
    );
});

const getUserProfile = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.user?._id)
        .populate("savedContests")
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

const updatePreferences = asyncHandler(async (req, res) => {
    const { contestPreference, reminderPreference } = req.body;

       if (!contestPreference && !reminderPreference) {
        throw new ApiError(400, "No preferences provided for update");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                contestPreference,
                reminderPreference
            }
        },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Preferences updated successfully"));
});

export { registerUser, updatePreferences, getUserProfile, verifyUser, sendOtp, verifyForgetPasswordOtpAndResetPassword, googleLogin, loginUser, logoutUser, refresh }
