import { Code, LogInIcon } from "lucide-react";

export default function LoginPrompt({onLoginClick, onSignupClick}) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8 text-center animate-in fade-in duration-300">
      
      <div className="relative flex items-center justify-center w-16 h-16 mb-6 bg-gray-800 rounded-full shadow-inner shadow-black/50">
        <Code className="w-8 h-8 text-green-400" />
      </div>
      
      <h2 className="mb-2 text-xl font-semibold text-white">
        Sync Your Contests
      </h2>
      <p className="mb-8 text-sm leading-relaxed text-gray-400">
        Login to sync upcoming schedules from Codeforces, LeetCode, and AtCoder, and manage your reminders.
      </p>

      <button
       onClick={onLoginClick}
       className="flex items-center justify-center gap-1 mt-4 text-sm font-medium text-gray-400  hover:cursor-pointer transition-colors hover:text-white">
        <LogInIcon className="w-4 h-4" />
        <span>Login to Account</span>
      </button>

      <button 
       className="mt-4 text-xs text-gray-500 transition-colors hover:cursor-pointer hover:text-gray-300"
       onClick={onSignupClick}
       >
        Don't have an account? Sign up
      </button>

    </div>
  );
}