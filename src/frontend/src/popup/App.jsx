import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoginPrompt from '../components/LoginPrompt';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import VerificationForm from '../components/VerificationForm';
import { Trophy, Flame, Zap, LogOut, ChevronRight } from 'lucide-react';

const FILTERS = ['All', 'Live', 'Upcoming', 'Ended'];

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 space-y-3 animate-pulse">
      <div className="h-3 w-2/3 rounded-full bg-white/10" />
      <div className="h-2 w-1/2 rounded-full bg-white/5" />
      <div className="flex gap-2 mt-4">
        <div className="h-6 w-16 rounded-full bg-white/10" />
        <div className="h-6 w-12 rounded-full bg-white/5" />
      </div>
    </div>
  );
}

function EmptyState({ filter }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 gap-3 text-center px-6">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
        <Trophy size={18} className="text-indigo-400" />
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">
        No <span className="text-white font-medium">{filter}</span> contests right now.
        <br />
        <span className="text-xs text-gray-600">Check back soon.</span>
      </p>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const storage = await chrome.storage.local.get([
          'accessToken',
          'pendingVerificationEmail',
        ]);
        if (storage.accessToken) {
          setCurrentView('authenticated');
        } else if (storage.pendingVerificationEmail) {
          setCurrentView('verification');
        } else {
          setCurrentView('prompt');
        }
      } catch (error) {
        console.error('Failed to read from Chrome storage', error);
        setCurrentView('prompt');
      }
    };
    checkInitialState();
  }, []);

  const handleLogout = async () => {
    await chrome.storage.local.remove(['accessToken', 'refreshToken']);
    setCurrentView('prompt');
  };

  if (currentView === 'loading') {
    return (
      <div className="w-96 min-h-[520px] bg-[#080810]" />
    );
  }

  return (
    <div
      className="flex flex-col overflow-hidden w-96 min-h-[520px]"
      style={{
        background: 'linear-gradient(160deg, #0d0d1a 0%, #080810 60%, #0a0a0f 100%)',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-64 h-64 opacity-20"
        style={{
          background: 'radial-gradient(circle at 0% 0%, #6366f1 0%, transparent 70%)',
        }}
      />

      <Navbar />

      <main className="relative flex-1 overflow-x-hidden overflow-y-auto">

        {currentView === 'prompt' && (
          <LoginPrompt
            onLoginClick={() => setCurrentView('login')}
            onSignupClick={() => setCurrentView('register')}
          />
        )}

        {currentView === 'login' && (
          <LoginForm
            onBack={() => setCurrentView('prompt')}
            onLoginSuccess={() => setCurrentView('authenticated')}
          />
        )}

        {currentView === 'register' && (
          <SignupForm
            onBack={() => setCurrentView('prompt')}
            onSignupSuccess={() => setCurrentView('verification')}
          />
        )}

        {currentView === 'verification' && (
          <VerificationForm
            onBack={() => setCurrentView('prompt')}
            onVerifySuccess={() => setCurrentView('authenticated')}
          />
        )}

        {currentView === 'authenticated' && (
          <div className="flex flex-col h-full animate-in fade-in duration-300">

            {/* Header */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-indigo-400/80 font-semibold">
                    Contests
                  </p>
                  <h2 className="text-lg font-bold text-white leading-tight tracking-tight">
                    Discover &amp; Compete
                  </h2>
                </div>

                <div className="flex gap-1.5">
                  <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5">
                    <Flame size={10} className="text-orange-400" />
                    <span className="text-[10px] text-orange-300 font-semibold">3 Live</span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                    <Zap size={10} className="text-emerald-400" />
                    <span className="text-[10px] text-emerald-300 font-semibold">New</span>
                  </div>
                </div>
              </div>

              {/* Filter pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`
                      flex-shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full border transition-all duration-200
                      ${activeFilter === f
                        ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-white/[0.04] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.08]'
                      }
                    `}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px mx-4 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>

            {/* Footer */}
            <div className="px-4 pb-3 pt-1">
              <div className="h-px mb-3 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
              <button
                onClick={handleLogout}
                className="
                  group w-full flex items-center justify-between
                  px-3 py-2.5 rounded-xl
                  border border-white/5 bg-white/[0.02]
                  text-gray-500 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/[0.04]
                  transition-all duration-200 text-xs font-medium
                "
              >
                <span className="flex items-center gap-2">
                  <LogOut size={13} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                  Sign out
                </span>
                <ChevronRight size={12} className="opacity-30 group-hover:opacity-60" />
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}