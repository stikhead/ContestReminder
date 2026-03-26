import "dotenv/config";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendVerificationEmail } from "../services/email.service.js";
import crypto from "crypto";
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken  = async(user)=>{
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    
    if(!accessToken || !refreshToken){
        throw new ApiError(500, "An internal server error occurred");
    }

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});
    return {refreshToken, accessToken};
}

const generateVerificationToken = ()=>{
      
    const verificationPayload = crypto.randomBytes(32).toString("hex");

    return verificationPayload
}

const registerUser = asyncHandler( async (req, res)=> {
    const {email, password} = req.body;
    console.log(email, password)
    if(!email || !password){
        throw new ApiError(400, "all fields are required");
    }
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({email: normalizedEmail});

    if(existingUser){
        throw new ApiError(409, "Email already in use");
    }
    const token = generateVerificationToken();
    const user = await User.create({
        email: normalizedEmail,
        password: password,
        verification: {
            token: token,
            expiry: Date.now() + 15 * 60 * 1000
        }
    })

    try {
       const mail = await sendVerificationEmail(normalizedEmail, token);
       console.log(mail);
    } catch (error) {
       await User.findByIdAndDelete(user._id); 
       throw new ApiError(500, `An Error occured while sending verification email ${error}`);
    }

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -verification"
    )

    if(!createdUser){
        throw new ApiError(500, "Server Error");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )

})

const verifyUser = asyncHandler( async(req, res)=>{
    const {token} = req.query;
    if (!token) {
        throw new ApiError(400, "token is required");
    }
    console.log(token)
    const user = await User.findOne({
        "verification.token": token,
        "verification.expiry": { $gt: Date.now() }
    })

    if(!user){
        throw new ApiError(400, "Token Expired")
    }

    user.isVerified = true;
    user.verification = undefined;
    await user.save({validateBeforeSave: false});


    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "verified")
    )
})

const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        throw new ApiError(400, "All fields are required");
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({email: normalizedEmail}).select('+password');
    if(!user){
        throw new ApiError(401, "User not found");
    }

    const isPassword = await user.comparePassword(password);
    
    if(!isPassword){
        throw new ApiError(401, "Invalid Password");
    }
    
    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your email before logging in.");
    }
    
    const {refreshToken, accessToken} = await generateAccessAndRefreshToken(user);
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
            accessToken: accessToken
        },
       "User logged in successfullty")
    )
})

const logoutUser = asyncHandler(async(req, res)=>{
    if(!req.user){
        throw new ApiError(401, "Unauthorized");
    }

    await User.findByIdAndUpdate(
        req?.user?._id,
        {
            $unset: {refreshToken: 1}
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
            new ApiResponse(200, {}, "Tokens refreshed successfully")
        )
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});
export {registerUser, verifyUser, loginUser, logoutUser, refresh}
