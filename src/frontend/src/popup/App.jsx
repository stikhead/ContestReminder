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


export default function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('')
  const [user, setUser] = useState({});

  const onLogin = () => {
    setUser({ isAuthenticated: true })
    setCurrentView('authenticated')

  }
  const onLogout = () => {
    setUser({ isAuthenticated: false })
    setCurrentView('prompt')

  }

  
useEffect(() => {
  const checkInitialState = async () => {
    const storage = await chrome.storage.local.get([
      'accessToken',
      'pendingVerificationEmail',
      'pendingPasswordResetOtp'
    ]);
    if (storage.accessToken) {
      setCurrentView('authenticated');
      setIsAuthenticated(true);
      setUser({isAuthenticated: true})
    } 
    else if (storage.pendingVerificationEmail) {
      setEmail(storage.pendingVerificationEmail);
      setCurrentView('verification');
    } 
    else if (storage.pendingPasswordResetOtp){
      setEmail(storage.pendingPasswordResetOtp)
      setCurrentView('reset-password');
    }
    else {
      setCurrentView('prompt');
      setIsAuthenticated(false);
    }
  };
  checkInitialState();
}, []);

  const handleLogout = async () => {
   try {
     await chrome.storage.local.remove(['accessToken', 'refreshToken']);
     onLogout();
   } catch (error) {
    
   }
  };

  if (currentView === 'loading') {
    return (
      <div className="w-auto min-h-130 bg-[#080810]" />
    );
  }


  return (
    <AuthProvider value={{ user, onLogin, onLogout }}>
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
              onSignupSuccess={(email) => {
                setCurrentView('verification');
                setEmail(email)
              }
            }
            />
          )}

          {currentView === 'register' && (
            <SignupForm
              onBack={() => setCurrentView('prompt')}
              onSignupSuccess={(email) => {
                setCurrentView('verification');
                setEmail(email)
              }
            }
            />
          )}

          {currentView === 'verification' && (
            <VerificationForm
              onBack={() => setCurrentView('prompt')}
              onVerifySuccess={() => setCurrentView('authenticated')}
              email={email}
            />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPasswordForm
              onBack={() => setCurrentView('login')}
              onRequestOtp={(email) => {
                  setCurrentView('reset-password');
                  setEmail(email)
                }
              }
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
            <div className="flex flex-col h-full animate-in fade-in duration-300">

              <div className="h-px mx-4 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          
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