import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useFetchContests(activePlatforms) {
    const [todayContest, setTodayContest] = useState([]);
    const [pastContest, setPastContest] = useState([]);
    const [upcomingContest, setUpcomingContest] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const FetchContest = async (useCache = true) => {
        setIsLoading(true);
        try {
            if (useCache) {
                const cachedData = await chrome.storage.local.get(['past', 'today', 'upcoming']);
                if (cachedData.today) setTodayContest(cachedData.today);
                if (cachedData.past) setPastContest(cachedData.past);
                if (cachedData.upcoming) {
                    setUpcomingContest(cachedData.upcoming);
                    setIsLoading(false); 
                }
            }

            const [todayContestRes, pastContestRes, upcomingContestRes] = await Promise.allSettled([
                api.get('/contests/today', { params: { plat: activePlatforms } }),
                api.get('/contests/past', { params: { plat: activePlatforms } }),
                api.get('/contests/upcoming', { params: { plat: activePlatforms } })
            ]);

            const newToday = todayContestRes.status === 'fulfilled' ? todayContestRes.value.data.data : todayContest;
            const newPast = pastContestRes.status === 'fulfilled' ? pastContestRes.value.data.data : pastContest;
            const newUpcoming = upcomingContestRes.status === 'fulfilled' ? upcomingContestRes.value.data.data : upcomingContest;

            setTodayContest(newToday);
            setPastContest(newPast);
            setUpcomingContest(newUpcoming);

            await chrome.storage.local.set({
                'today': newToday,
                'past': newPast,
                'upcoming': newUpcoming,
                'lastFetched': Date.now()
            });

        } catch (err) {
            console.error("Critical error fetching contests:", err);
            setError(err.message || "Something went wrong fetching contests.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        FetchContest();
    }, [activePlatforms]);

    const triggerRefresh = () => {
        return FetchContest(false);
    }

    return { todayContest, pastContest, upcomingContest, isLoading, error, triggerRefresh }
}