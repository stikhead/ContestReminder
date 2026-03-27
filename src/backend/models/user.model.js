import "dotenv/config"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        index: true
    },
    password: {
        type: String,
        required: true, // basic jwt later change to false when oauth
        select: false
    },

    refreshToken: {
        type: String
    },

    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },

    verification: {
        emailToken: {
            type: String,
        },
        emailExpiry: {
            type: Date
        },
        passwordToken: {
            type: String,
        },
        passwordExpiry: {
            type: Date
        },
        nextOtpAvailableAt: {
            type: Date
        }
    },

    savedContests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contest',
        }
    ],

    reminderPreference: {
        calender: {
            type: Boolean,
            required: true,
            default: false
        },
        appNotification: {
            type: Boolean,
            required: true,
            default: false
        }
    },

    contestPreference: {
        codeforces: {
            type: Boolean,
            required: true,
            default: true
        },

        codechef: {
            type: Boolean,
            required: true,
            default: true
        },
        leetcode: {
            type: Boolean,
            required: true,
            default: true
        },
        atcoder: {
            type: Boolean,
            required: true,
            default: true
        }
    }

}, {});

userSchema.pre('save', async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
})

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function() {
    return jwt.sign({
        _id: this._id,
        email: this.email
    }, 
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign({
        _id: this._id
    }, 
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}


export const User = mongoose.model('User', userSchema);