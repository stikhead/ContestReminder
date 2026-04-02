import 'dotenv/config'
import axios from "axios";
import { allowedPlatforms, names } from '../constants.js';
import { Contest } from '../models/contest.model.js';

const instance = axios.create({
  baseURL: `${process.env.BASE_URL}`,
  timeout: 10000,
  headers: {'Authorization': `${process.env.CLIST_API_KEY}`}
});

const convertHostNames = (id)=>{
    return names[id] || 'Unknown';
}

const fetchUpcomingContests = async() => {
   try {
     const response = await instance.get('/contest/', {
        params: {
            upcoming: true,
            resource_id__in: allowedPlatforms.join(',')
        }
     })
    //  const filteredData = response?.data?.objects?.filter(item => {
    //     return allowedPlatforms.includes(item.resource_id);
    //  })
     const formattedData = response?.data?.objects?.map(contest => {
        const {duration, id, start, end, href, event, resource, resource_id} = contest;
        return {
            contestId: id,
            contestHost: convertHostNames(resource_id),
            contestDuration: duration,
            contestStart: start,
            contestDescription: event,
            contestEnd: end,
            contestResource: resource,
            contestResourceId: resource_id,
            contestLink: href
        }
     })
     return formattedData;
   } catch (error) {
    console.error("Clist API Fetch Failed:", error.message);
        throw new Error("Failed to fetch contests from external API");
   }
}

const contestSyncToDatabase = async () => {
    try {
        console.log("Starting database sync...");
        const contestData = await fetchUpcomingContests();

        const bulkOperations = contestData.map(c => ({
            updateOne: {
                filter: { 
                    clistId: c.contestId 
                },
                update: {
                    $set: {
                        clistId: c.contestId,
                        host: c.contestHost,
                        resource: c.contestResource, 
                        resource_id: c.contestResourceId,
                        eventLink: c.contestLink,  
                        description: c.contestDescription,
                        startTime: c.contestStart,
                        endTime: c.contestEnd,
                        durationSeconds: c.contestDuration
                    }
                },
                upsert: true,
            }
        }));

        const res = await Contest.bulkWrite(bulkOperations);
        
        console.log(`Sync complete! Inserted: ${res.upsertedCount}, Updated: ${res.modifiedCount}`);
        
    } catch (error) {
        console.error("Database Sync Failed:", error.message);
    }
}
export {contestSyncToDatabase};
