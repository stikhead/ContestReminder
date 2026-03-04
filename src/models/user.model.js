import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true // basic jwt later change to false when oauth
    },

    refreshToken: {
        type: String
    },

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

export const User = mongoose.model('User', userSchema);