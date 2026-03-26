import { Contest } from "../models/contest.model.js";
import { contestSyncToDatabase } from "../services/contest.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const injectReminderState = (contests, userSavedIds) => {
    return contests.map(contest=>({
        ...contest,
        isReminderSet: userSavedIds.includes(contest._id.toString())
    }))
}

const upcoming = asyncHandler(async(req, res)=>{
    const {plat} = req.query;
    if(!plat){
        throw new ApiError(500, "All fields are required");
    }
    const c = await Contest.find({
        resouce: plat,
        startTime: { $gte: new Date()}
    }).sort({ startTime: 1 }).lean()

    if(c.length===0){
        throw new ApiError(404, "No data found");
    }
    const userContestList = req.user?.savedContests?.map(id => id.toString()) || [];
    const data = injectReminderState(c, userContestList)

    return res
    .status(200)
    .json(
        new ApiResponse(201, data, "success")
    )
})

const past = asyncHandler(async(req, res)=>{
    const {plat} = req.query;
    if(!plat){
        throw new ApiError(500, "All fields are required");
    }
    const c = await Contest.find({
        resouce: plat,
        endTime: { $lte: new Date()}
    }).sort({ startTime: 1 }).lean()

    if(c.length===0){
        throw new ApiError(404, "No data found");
    }

    const userContestList = req.user?.savedContests?.map(id => id.toString()) || []
    const data = injectReminderState(c, userContestList)

    return res
    .status(200)
    .json(
        new ApiResponse(201, data, "success")
    )
})

const today = asyncHandler(async(req, res)=>{
    const {plat} = req.query;
    if(!plat){
        throw new ApiError(500, "All fields are required");
    }

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999)

    const c = await Contest.find({
        resouce: plat,
        startTime: {
            $gte: startDate,
            $lte: endDate 
        }
    }).sort({ startTime: 1 }).lean()

    if(c.length===0){
        throw new ApiError(404, "No data found");
    }

    const userContestList = req.user?.savedContests?.map(id => id.toString()) || []
    const data = injectReminderState(c, userContestList)

    return res
    .status(200)
    .json(
        new ApiResponse(201, data, "success")
    )
})

const toggleReminder = asyncHandler(async(req, res)=>{
    const {contestId} = req.body;
    if(!contestId){
        throw new ApiError(500, "An Error occurred");
    }

    const savedIds = req.user.savedContests.includes(contestId);

    if(savedIds){
        req.user.savedContests.pull(contestId)
    } else {
        req.user.savedContests.push(contestId);
    }

    await req.user.save({validateBeforeSave: false})

    
    return res
    .status(200)
    .json(
        new ApiResponse(200, { reminderSet: !savedIds }, "Reminder updated successfully")
    );
})
export {today, upcoming, past, toggleReminder}