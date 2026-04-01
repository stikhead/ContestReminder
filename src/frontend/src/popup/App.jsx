import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoginPrompt from '../components/LoginPrompt';
import LoginForm from '../components/Auth/Login/LoginForm';
import SignupForm from '../components/Auth/Register/SignupForm';
import VerificationForm from '../components/Auth/Register/VerificationForm';
import { LogOut, ChevronRight } from 'lucide-react';
import { AuthProvider } from '../context/AuthContext';
import ForgotPasswordForm from '../components/Auth/Login/ForgotPasswordForm';
import ResetPasswordForm from '../components/Auth/Login/ResetPasswordForm';
import Dashboard from '../components/Home/DashBoard';
import api from '../api/axios';

export default function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState({ isAuthenticated: false, loading: true });

  const checkInitialState = async () => {
    const storage = await chrome.storage.local.get([
      'accessToken',
      'pendingVerificationEmail',
      'pendingPasswordResetOtp'
    ]);

    if (storage.accessToken) {
      setCurrentView('authenticated');
      setIsAuthenticated(true);
    } 
    else if (storage.pendingVerificationEmail) {
      setEmail(storage.pendingVerificationEmail);
      setCurrentView('verification');
    } 
    else if (storage.pendingPasswordResetOtp) {
      setEmail(storage.pendingPasswordResetOtp);
      setCurrentView('reset-password');
    } 
    else {
      setCurrentView('prompt');
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    try {
      const storage = await chrome.storage.local.get(['accessToken']);
      if (!storage.accessToken) {
        setUser({ isAuthenticated: false, loading: false });
        return;
      }

      const { data } = await api.get("/users/profile");
      const userData = { ...data.data, isAuthenticated: true, loading: false };
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setUser({ isAuthenticated: false, loading: false });
      setIsAuthenticated(false);
    }
  };

  const onLogin = async () => {
   
    setIsAuthenticated(true);
    setCurrentView('authenticated');
    await refreshUser();
  };

  const onLogout = async () => {
    try {
      await api.post("/users/logout");
      await chrome.storage.local.remove(['accessToken', 'refreshToken']);
      setUser({ isAuthenticated: false, loading: false });
      setIsAuthenticated(false);
      setCurrentView('prompt');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const updatePreferences = async (prefs) => {
    try {
      const { data } = await api.patch("/users/preferences", prefs);
      setUser(prev => ({ ...prev, ...data.data }));
      return { success: true };
    } catch (error) {
      console.error("Failed to update preferences", error);
      return { success: false };
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    checkInitialState();
  }, []);

  const handleLogout = async () => {
    await onLogout();
  };

  if (currentView === 'loading' || user.loading) {
    return (
      <div className="w-auto min-h-130 bg-[#080810]" />
    );
  }

  return (
    <AuthProvider value={{ user, onLogin, onLogout, updatePreferences }}>
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
              onLoginSuccess={onLogin}
              onSignupSuccess={(email) => {
                setCurrentView('verification');
                setEmail(email);
              }}
            />
          )}

          {currentView === 'register' && (
            <SignupForm
              onBack={() => setCurrentView('prompt')}
              onSignupSuccess={(email) => {
                setCurrentView('verification');
                setEmail(email);
              }}
            />
          )}

          {currentView === 'verification' && (
            <VerificationForm
              onBack={() => setCurrentView('prompt')}
              onVerifySuccess={() => {
                setCurrentView('authenticated');
                refreshUser();
              }}
              email={email}
            />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPasswordForm
              onBack={() => setCurrentView('login')}
              onRequestOtp={(email) => {
                setCurrentView('reset-password');
                setEmail(email);
              }}
            />
          )}

          {currentView === 'reset-password' && (
            <ResetPasswordForm
              onBack={() => setCurrentView('forgot-password')}
              onResetSuccess={() => setCurrentView('login')}
              email={email}
            />
          )}

          {currentView === 'authenticated' && (
            <div className="flex flex-col overflow-y-scroll h-full animate-in fade-in duration-300">
              <Dashboard />
              <div className="px-4 pb-4">
                <button
                  onClick={handleLogout}
                  className="
                    group w-full flex items-center justify-between
                    px-3 py-2.5 rounded-xl
                    border border-white/5 bg-white/2
                    text-gray-500 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/4
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