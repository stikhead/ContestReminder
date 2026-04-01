import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
    clistId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    host: {
        type: String,
        required: true
    },
    description: {
          type: String
    },
    durationSeconds: {
        type: Number,
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
    resource: {
        type: String,
        enum: ['LeetCode', 'Codeforces', 'CodeChef', 'AtCoder'],
        required: true  
    },
    resource_id: {
        type: Number,
        required: true
    },
    eventLink: {
        type: String,
        required: true
    },
}, { 
    timestamps: true 
});

export const Contest = mongoose.model('Contest', contestSchema);