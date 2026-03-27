import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoginPrompt from '../components/LoginPrompt';
import LoginForm from '../components/Auth/Login/LoginForm';
import SignupForm from '../components/Auth/Register/SignupForm';
import VerificationForm from '../components/Auth/Register/VerificationForm';
import { Trophy, Flame, Zap, LogOut, ChevronRight } from 'lucide-react';
import { AuthProvider } from '../context/AuthContext';
import ForgotPasswordForm from '../components/Auth/Login/ForgotPasswordForm';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  const onLogin = () => {

    setUser({ isAuthenticated: true })
  }
  const onLogout = () => {
    setUser({ isAuthenticated: false })
  }

  const onLoginSuccess= () => {
    setCurrentView('authenticated')
  }
  
useEffect(() => {
  const checkInitialState = async () => {
    const storage = await chrome.storage.local.get([
      'accessToken',
      'pendingVerificationEmail',
    ]);
    if (storage.accessToken) {
      setCurrentView('authenticated');
      setIsAuthenticated(true);
      setUser({isAuthenticated: true})
    } 
    else if (storage.pendingVerificationEmail) {
      setCurrentView('verification');
    } 
    else {
      setCurrentView('prompt');
      setIsAuthenticated(false);
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
      <div className="w-auto min-h-130 bg-[#080810]" />
    );
  }


  return (
    <AuthProvider value={{ user, onLogin, onLogout, onLoginSuccess }}>
      <div
        className="flex flex-col w-full min-h-130"
        style={{
          background: 'linear-gradient(160deg, #0d0d1a 0%, #080810 60%, #0a0a0f 100%)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >


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
              
              onForgotPasswordClick={() => setCurrentView('forgot-password')}
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

          {currentView === 'forgot-password' && (
            <ForgotPasswordForm
              onBack={() => setCurrentView('login')}
              onResetSuccess={() => setCurrentView('login')}
            />
          )}

          {currentView === 'authenticated' && (
            <div className="flex flex-col h-full animate-in fade-in duration-300">



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
    </AuthProvider>
  );
}