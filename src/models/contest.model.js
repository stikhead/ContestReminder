import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
    contestId: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        enum: ['leetcode', 'codeforces', 'codechef', 'atcoder'],
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    isUpcoming: {
        type: Boolean,
        default: true
    },
    difficulty: {

    }
    

}, {});

export const Contest = mongoose.model('Contest', contestSchema);