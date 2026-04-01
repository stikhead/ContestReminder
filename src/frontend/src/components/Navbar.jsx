import { useState, useRef, useEffect } from 'react';
import { BellRing, Settings, CircleUserRound, LogOut, Check, X, BellOff } from "lucide-react";
import useAuth from "../context/AuthContext";

export default function Navbar() {
  const { user, onLogout, updatePreferences } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);



  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTogglePlatform = (platform) => {
    const currentPrefs = user.contestPreference || {};
    updatePreferences({
      contestPreference: {
        ...currentPrefs,
        [platform]: !currentPrefs[platform]
      }
    });
  };

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-3 bg-[#0a0a0f] border-b border-white/5 relative z-50">
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-lg font-bold text-white tracking-tight">
            Contest<span className="text-green-400">Reminder</span>
          </span>
        </div>

        {user.isAuthenticated && (
          <div className="flex items-center gap-1" ref={menuRef}>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 transition-colors rounded-md hover:cursor-pointer ${showNotifications ? 'text-green-400 bg-white/5' : 'text-gray-400 hover:text-white'}`}
              >
                <BellRing className="w-5 h-5" />
                {user.savedContests?.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0f]" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-[#15151e] border border-white/10 rounded-xl shadow-2xl py-3 animate-in fade-in zoom-in-95 origin-top-right">
                  <h4 className="px-4 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">Watchlist</h4>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar">
                    {user.savedContests?.length > 0 ? (
                      user.savedContests.map(c => (
                        <div key={c._id} className="px-4 py-2 hover:bg-white/5 border-b border-white/2">
                          <p className="text-xs text-white font-medium truncate">{c.event || c.title}</p>
                          <p className="text-[10px] text-gray-500">{new Date(c.startTime).toLocaleDateString()}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-600">
                        <BellOff className="w-6 h-6 mx-auto mb-2 opacity-20" />
                        <p className="text-[11px]">No active reminders</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 transition-colors rounded-md hover:text-white hover:cursor-pointer hover:bg-white/5"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`p-1.5 transition-all rounded-md border hover:cursor-pointer ${showUserMenu ? 'border-green-400 text-white bg-white/5' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                <CircleUserRound className="w-6 h-6" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#15151e] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 origin-top-right">
                  <div className="px-4 py-2 border-b border-white/5 mb-1">
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Account</p>
                    <p className="text-xs text-white truncate font-medium">{user.email}</p>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:cursor-pointer font-semibold text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {showSettings && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#15151e] border border-white/10 w-full max-w-xs rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b border-white/5">
              <h2 className="text-xs font-bold text-white uppercase tracking-widest">Platform Settings</h2>
              <X className="text-gray-500 cursor-pointer  hover:text-white" onClick={() => setShowSettings(false)} size={18} />
            </div>
            
            <div className="p-5 grid grid-cols-1 gap-2">
              {['codeforces', 'leetcode', 'codechef', 'atcoder'].map(p => (
                <button
                  key={p}
                  onClick={() => handleTogglePlatform(p)}
                  className={`flex items-center justify-between px-4 hover:cursor-pointer py-3 rounded-xl border text-xs font-bold transition-all ${
                    user.contestPreference?.[p] 
                      ? 'bg-green-400/10 border-green-400/30 text-green-400' 
                      : 'bg-white/5 border-white/5 text-gray-500'
                  }`}
                >
                  <span className="capitalize">{p}</span>
                  {user.contestPreference?.[p] ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-white/10" />}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="w-full py-4 text-xs font-bold bg-white/5 text-white hover:cursor-pointer hover:bg-white/10 transition-colors border-t border-white/5"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}