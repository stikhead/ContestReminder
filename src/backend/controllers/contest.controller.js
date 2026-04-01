import { Contest } from "../models/contest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const injectReminderState = (contests, userSavedIds) => {
    return contests.map(contest => ({
        ...contest,
        isReminderSet: userSavedIds.includes(contest._id.toString())
    }));
};

const buildPlatformQuery = (plat) => {
    const query = {};
    if (plat && plat !== 'all') {
       
        query.host = { $regex: new RegExp(`^${plat}$`, 'i') };
    }
    console.log(query);
    return query;
};


const upcoming = asyncHandler(async(req, res) => {
    const { plat } = req.query;
    if (!plat) throw new ApiError(400, "Platform is required");

    const query = { 
        ...buildPlatformQuery(plat),
        startTime: { $gte: new Date() } 
    };

    const c = await Contest.find(query).sort({ startTime: 1 }).lean();

    const userContestList = req.user?.savedContests?.map(id => id.toString()) || [];
    const data = injectReminderState(c, userContestList);

    return res.status(200).json(new ApiResponse(200, data, "success"));
});

const past = asyncHandler(async(req, res) => {
    const { plat } = req.query; 
    if (!plat) throw new ApiError(400, "Platform is required");

    const query = {
        ...buildPlatformQuery(plat),
        endTime: { $lte: new Date() }
    };

    const c = await Contest.find(query).sort({ startTime: -1 }).lean(); 

    const userContestList = req.user?.savedContests?.map(id => id.toString()) || [];
    const data = injectReminderState(c, userContestList);

    return res.status(200).json(new ApiResponse(200, data, "success"));
});

const today = asyncHandler(async(req, res) => {
    const { plat } = req.query; 
    if (!plat) throw new ApiError(400, "Platform is required");

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const query = {
        ...buildPlatformQuery(plat),
        startTime: { $gte: startDate, $lte: endDate }
    };

    const c = await Contest.find(query).sort({ startTime: 1 }).lean();

    const userContestList = req.user?.savedContests?.map(id => id.toString()) || [];
    const data = injectReminderState(c, userContestList);

    return res.status(200).json(new ApiResponse(200, data, "success"));
});

const toggleReminder = asyncHandler(async(req, res) => {
    const { contestId } = req.body;
    if (!contestId) throw new ApiError(400, "Contest ID is required");

    const savedIds = req.user.savedContests.includes(contestId);

    if (savedIds) {
        req.user.savedContests.pull(contestId);
    } else {
        req.user.savedContests.push(contestId);
    }

    await req.user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, { reminderSet: !savedIds }, "Reminder updated successfully"));
});

export { today, upcoming, past, toggleReminder };