import { useState } from 'react';
import ContestCard from './ContestCard';
import useFetchContests from '../../../hooks/useFetchContests';

export default function ContestView({ viewMode, activePlatform }) {
    const [timeFilter, setTimeFilter] = useState('upcoming');
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

    const { todayContest, pastContest, upcomingContest, isLoading } = useFetchContests(activePlatform);
    const contestType = ['today', 'upcoming', 'past'];
    const getActiveContests = () => {
        if (timeFilter === 'today') return todayContest || [];
        if (timeFilter === 'upcoming') return upcomingContest || [];
        return pastContest || [];
    };

    const displayContests = getActiveContests();
    const allContests = [...(todayContest || []), ...(upcomingContest || []), ...(pastContest || [])];

    const calendarDays = Array.from({ length: 30 }, (_, i) => {
        const currentSquareDate = new Date();
        currentSquareDate.setDate(currentSquareDate.getDate() + i);
        const squareDateString = currentSquareDate.toDateString();

        const contestsOnThisDay = allContests.filter(contest => {
            if (!contest?.startTime) return false;
            return new Date(contest.startTime).toDateString() === squareDateString;
        });

        return {
            dateString: squareDateString,
            dayName: currentSquareDate.toLocaleDateString('en-US', { weekday: 'short' }),
            dateNum: currentSquareDate.getDate(),
            isToday: i === 0,
            hasContest: contestsOnThisDay.length > 0,
            hasReminder: contestsOnThisDay.some(contest => contest.isReminderSet)
        };
    });

    const selectedDateContests = allContests.filter(c => {
        if (!c?.startTime) return false;
        return new Date(c.startTime).toDateString() === selectedDate;
    });

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {viewMode === 'list' ? (
                <>
                    <div className="flex gap-2 pb-2 shrink-0 animate-in fade-in slide-in-from-top-2">
                        {contestType.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-3 py-3 cursor-pointer rounded-b-2xl text-xs font-medium capitalize transition-all ${timeFilter === filter ? 'bg-white/10 text-green-400' : 'text-gray-500 hover:bg-white/5 hover:text-green-300'}`}
                            >
                                
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 pb-20 custom-scrollbar">
                        <div className="space-y-3 animate-in fade-in pb-4">
                            {isLoading ? (
                                <div className="text-center text-gray-500 mt-10 text-sm animate-pulse">Fetching contests...</div>
                            ) : displayContests.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10 text-sm">No contests found.</div>
                            ) : (
                                displayContests.map((contest) => (
                                    <ContestCard key={contest._id} contest={contest} />
                                ))
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 overflow-y-auto p-4 pb-20 custom-scrollbar">
                    <div className="animate-in fade-in slide-in-from-right-4 pb-4">

                        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-[10px] font-semibold text-gray-500 uppercase">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, i) => {
                                const isSelected = selectedDate === day.dateString;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(day.dateString)}
                                        className={`
                                            relative flex flex-col items-center justify-center aspect-square rounded-lg border transition-all hover:bg-white/5 cursor-pointer 
                                            ${isSelected ? 'border-green-400 bg-green-400/10' : day.isToday ? 'border-white/20 bg-white/5' : 'border-white/5 bg-white/1'}
                                        `}
                                    >
                                        <span className={`text-xs font-medium ${day.isToday || isSelected ? 'text-white' : 'text-gray-400'}`}>{day.dateNum}</span>
                                        <div className="absolute bottom-1.5 flex gap-1">
                                            {day.hasContest && <div className="w-1 h-1 rounded-full bg-blue-400/70" />}
                                            {day.hasReminder && <div className="w-1 h-1 rounded-full bg-green-400 shadow-[0_0_4px_rgba(74,222,128,0.5)]" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/5">
                            <h3 className="text-sm font-semibold text-white mb-4">
                                Contests on {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                            </h3>
                            <div className="space-y-3">
                                {isLoading ? (
                                    <div className="text-center text-gray-500 py-4 text-sm animate-pulse">Fetching calendar data...</div>
                                ) : selectedDateContests.length > 0 ? (
                                    selectedDateContests.map(contest => (
                                        <ContestCard key={contest._id} contest={contest} />
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-4 text-sm bg-white/2 rounded-xl border border-white/5">
                                        No contests scheduled for this date.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}