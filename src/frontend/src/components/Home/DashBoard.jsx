import { useState } from 'react';
import { Bell, Settings, User, ChevronRight, ChevronLeft, LayoutGrid, CalendarDays } from 'lucide-react';
import { AllPlatformsLogo, CodeforcesLogo, LeetCodeLogo, CodeChefLogo, AtCoderLogo } from './common/PlatformIcons';

import ContestView from './contest/ContestView';
import ReminderView from './reminders/ReminderView';

export default function Dashboard() {
    const [activeMainTab, setActiveMainTab] = useState('contests'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activePlatform, setActivePlatform] = useState('all');
    const [viewMode, setViewMode] = useState('list'); 

    const platforms = [
        { id: 'all', name: 'All Platforms', icon: AllPlatformsLogo },
        { id: 'codeforces', name: 'Codeforces', icon: CodeforcesLogo },
        { id: 'leetcode', name: 'LeetCode', icon: LeetCodeLogo },
        { id: 'codechef', name: 'CodeChef', icon: CodeChefLogo },
        { id: 'atcoder', name: 'AtCoder', icon: AtCoderLogo },
    ];

    return (
        <div className="flex flex-col w-full h-screen max-h-150 bg-[#0a0a0f] text-gray-200 font-sans overflow-hidden">   
            <div className="flex justify-between items-center px-4 border-b border-white/5 bg-white/2">
                <div className="flex">
                    <button 
                        onClick={() => setActiveMainTab('contests')}
                        className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${activeMainTab === 'contests' ? 'border-green-400 text-green-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        Contests
                    </button>
                    <button 
                        onClick={() => setActiveMainTab('reminders')}
                        className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${activeMainTab === 'reminders' ? 'border-green-400 text-green-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        Saved
                    </button>
                </div>

                {activeMainTab === 'contests' && (
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <LayoutGrid size={14} />
                        </button>
                        <button 
                            onClick={() => setViewMode('calendar')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <CalendarDays size={14} />
                        </button>
                    </div>
                )}
            </div>
            <div className="flex flex-1 min-h-0"> 
                <aside className={`flex flex-col border-r border-white/5 bg-white/1 transition-all duration-300 ${isSidebarOpen ? 'w-35' : 'w-14'}`}>
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center justify-center p-3 hover:bg-white/5 text-gray-500 hover:text-white transition-colors border-b border-white/5 shrink-0"
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>

                    <div className="flex flex-col py-2 flex-1 overflow-y-auto">
                        {platforms.map((p) => {
                            const Icon = p.icon;
                            const isActive = activePlatform === p.id;
                            return (
                                <button 
                                    key={p.id}
                                    onClick={() => setActivePlatform(p.id)}
                                    className={`
                                        flex items-center gap-3 cursor-pointer p-3 transition-all duration-200 border-r-2
                                        ${isActive ? 'bg-white/10 border-white shadow-[inset_4px_0_0_rgba(255,255,255,0.1)]' : 'border-transparent hover:bg-white/5 opacity-60 hover:opacity-100'}
                                    `}
                                    title={p.name}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-110' : 'scale-100'}`} />
                                    {isSidebarOpen && (
                                        <span className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                            {p.name}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <main className="flex-1 flex flex-col bg-[#0a0a0f] min-w-0 min-h-0">
                    {activeMainTab === 'contests' 
                        ? <ContestView viewMode={viewMode} activePlatform={activePlatform} /> 
                        : <ReminderView activePlatform={activePlatform} /> 
                    }
                </main>

            </div>
        </div>
    );
}