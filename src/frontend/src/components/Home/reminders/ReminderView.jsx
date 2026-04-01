import { Bell } from 'lucide-react';
import useFetchContests from '../../../hooks/useFetchContests';
import ContestCard from '../contest/ContestCard';

export default function ReminderView({ activePlatform }) { 
    const { todayContest, upcomingContest, isLoading } = useFetchContests(activePlatform); 

    const allActive = [...(todayContest || []), ...(upcomingContest || [])];
    const uniqueContests = Array.from(new Map(allActive.map(c => [c._id, c])).values());
    const savedContests = uniqueContests.filter(contest => contest.isReminderSet);

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-4 border-b border-white/5 shrink-0 bg-white/1">
                <h2 className="text-sm font-semibold text-white">Your Saved Reminders</h2>
                <p className="text-xs text-gray-400 mt-1">You will be notified 15 minutes before these start.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {isLoading ? (
                    <div className="text-center text-gray-500 mt-10 text-sm animate-pulse">Loading reminders...</div>
                ) : savedContests.length > 0 ? (
                    <div className="space-y-3 animate-in fade-in">
                        {savedContests.map(contest => (
                            <ContestCard key={contest._id} contest={contest} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-20 text-center animate-in fade-in">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-500">
                            <Bell size={24} />
                        </div>
                        <h2 className="text-white font-semibold mb-2">No Saved Reminders</h2>
                        <p className="text-sm text-gray-400 max-w-62.5">
                            Click the plus icon on any upcoming contest to save it here and get notified.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}