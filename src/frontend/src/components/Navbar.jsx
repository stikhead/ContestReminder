import { BellRing, Settings, CircleUserRound } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
      
      {/* Logo & Title (Left) */}
      <span className="text-lg font-bold text-white tracking-wide">
        Contest<span className="text-green-400">Reminder</span>
      </span>

      {/* Action Icons (Right) */}
      <div className="flex items-center gap-1">
        
        {/* Notifications / Reminders */}
        <button className="p-1.5 text-green-400 transition-colors rounded-md hover:text-green-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
          <BellRing className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button className="p-1.5 text-gray-400 transition-colors rounded-md hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <button className="p-1.5 text-gray-400 transition-colors rounded-md hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
          <CircleUserRound className="w-5 h-5" />
        </button>
        
      </div>
    </nav>
  );
}