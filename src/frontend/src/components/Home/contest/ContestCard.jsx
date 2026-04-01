import { useState } from 'react';
import { PlusCircle, CheckCircle2, Clock, PlayCircle, ExternalLink } from 'lucide-react';
import api from '../../../api/axios';
import { CodeforcesLogo, LeetCodeLogo, CodeChefLogo, AtCoderLogo } from '../common/PlatformIcons';

const getPlatformAssets = (contest) => {
    const searchString = `${contest?.resource || ''} ${contest?.host || ''}`.toLowerCase();
    if (searchString.includes('leetcode')) return { Logo: LeetCodeLogo, color: 'text-yellow-400', name: 'LeetCode' };
    if (searchString.includes('codechef')) return { Logo: CodeChefLogo, color: 'text-orange-400', name: 'CodeChef' };
    if (searchString.includes('atcoder')) return { Logo: AtCoderLogo, color: 'text-gray-300', name: 'AtCoder' };
    if (searchString.includes('codeforces')) return { Logo: CodeforcesLogo, color: 'text-blue-400', name: 'Codeforces' };
    return { Logo: CodeforcesLogo, color: 'text-gray-400', name: contest?.resource || contest?.host || 'Unknown' }; 
};

const getEndedAgo = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const diffInMs = now - end;
    if (diffInMs < 0) return null;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    return diffInHours > 0 ? `Ended ${diffInHours}h ${diffInMins % 60}m ago` : `Ended ${diffInMins}m ago`;
};

const formatDuration = (seconds) => {
    if (!seconds) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
};

const getRelativeTimeState = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (now > end) return { text: getEndedAgo(endTime) || 'Ended', isPast: true, isLive: false };
    if (now >= start && now <= end) return { text: 'Live Now', isPast: false, isLive: true };

    const diffMs = start - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) return { text: `Starts in ${diffDays}d ${diffHrs}h`, isPast: false, isLive: false };

    if (diffHrs > 0) return { text: `Starts in ${diffHrs}h ${diffMins}m`, isPast: false, isLive: false };

    return { text: `Starts in ${diffMins}m`, isPast: false, isLive: false };
};



export default function ContestCard({ contest }) {
    if (!contest) return null;

    const [isSaved, setIsSaved] = useState(contest.isReminderSet || false); 
    const [isToggling, setIsToggling] = useState(false);

    const { Logo, color, name } = getPlatformAssets(contest); 
    const duration = formatDuration(contest.durationSeconds);
    const { text: relativeTime, isPast, isLive } = getRelativeTimeState(contest.startTime, contest.endTime);

 
const handleToggleReminder = async (e) => {
    e.stopPropagation();
    if (isToggling || isPast || isLive) return; 
    
    setIsToggling(true);
    const prevState = isSaved;
    setIsSaved(!isSaved);

    try {
        await api.post('/contests/toggle', { contestId: contest._id });
        
        if (typeof chrome !== 'undefined' && chrome.alarms) {
            const alarmName = `contest-${contest._id}`;
            
            if (!prevState) {
                await chrome.storage.local.set({ 
                    [alarmName]: { 
                        title: contest.description || contest.event,
                        platform: name,
                        url: contest.eventLink 
                    } 
                });

                const alarmTime = new Date(contest.startTime).getTime() - (15 * 60 * 1000);
                if (alarmTime > Date.now()) {
                    chrome.alarms.create(alarmName, { when: alarmTime });
                }
            } else {
                chrome.alarms.clear(alarmName);
                await chrome.storage.local.remove(alarmName);
            }
        }
    } catch (error) {
        setIsSaved(prevState); 
        console.error("Failed to toggle reminder", error);
    } finally {
        setIsToggling(false);
    }
};

    return (
        <div className="relative group overflow-hidden bg-[#15151e] hover:bg-[#1c1c28] border border-white/10 hover:border-white/20 shadow-lg rounded-xl transition-all cursor-pointer">
            <Logo className="absolute w-40 h-40 -right-5 -bottom-10 opacity-[0.25] group-hover:opacity-[0.40] transition-all duration-500 rotate-[-15deg] pointer-events-none" />
            
            <div className="relative z-10 p-4">
                <div className="flex justify-between items-start mb-2.5">
                    {/* Platform Badge */}
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded border border-white/5">
                        <Logo className="w-3.5 h-3.5" />
                        <span className={`text-[10px] font-bold ${color}`}>{name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isPast && (
                            <button 
                                 onClick={() => window.open(contest.eventLink, '_blank')}
                                className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-gray-400 bg-white/5 rounded border border-white/5 hover:cursor-pointer hover:text-green-400 hover:border-green-400/30 transition-all"
                            >
                                Register <ExternalLink size={10} />
                            </button>
                        )}

                        {!isPast && !isLive && (
                            <button 
                                onClick={handleToggleReminder}
                                disabled={isToggling}
                                className={`transition-colors p-1 -mr-1 rounded-md hover:bg-white/10 ${isSaved ? 'text-green-400' : 'text-gray-400 hover:text-green-400'}`}
                            >
                                {isSaved ? <CheckCircle2 size={16} /> : <PlusCircle size={16} />}
                            </button>
                        )}
                    </div>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2.5 group-hover:text-green-400 transition-colors line-clamp-2 pr-4 leading-snug">
                    {contest.description || contest.event || "No Description"}
                </h3>
                
                <div className="flex items-center gap-4 text-xs">
                    <span className={`flex items-center gap-1.5 font-medium ${
                        isLive ? 'text-red-400 animate-pulse' : isPast ? 'text-gray-400/80' : 'text-gray-300'
                    }`}>
                        {isLive && <PlayCircle size={12} />}
                        {relativeTime}
                    </span>
                    
                    <span className="flex items-center gap-1 text-gray-500 font-medium">
                        <Clock size={12} className="opacity-60" />
                        {duration}
                    </span>
                </div>
            </div>
        </div>
    );
}