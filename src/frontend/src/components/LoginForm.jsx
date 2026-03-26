import { ArrowLeft, Mail, KeyRound, LogIn, AlertCircle } from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

export default function LoginForm({ onBack, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const response = await api.post('/users/login', { 'email': email, 'password': password })
            const accessToken = response.data.accessToken || response.data.data?.accessToken;
            const refreshToken = response.data.refreshToken || response.data.data?.refreshToken;
            if (accessToken && refreshToken) {
                await chrome.storage.local.set({
                    accessToken: `Bearer ${accessToken}`,
                    refreshToken: `Bearer ${refreshToken}`
                })
                onLoginSuccess();
            } else {
                setErrorMsg("Invalid response from server. Missing tokens.");
            }

        } catch (err) {
            console.error('An error occurred during login', err);
            const backendMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
            setErrorMsg(backendMessage);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="flex flex-col h-full px-6 py-4 animate-in slide-in-from-right-8 duration-300">

            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={onBack}
                    className="p-1.5 text-gray-400 transition-colors rounded-md hover:text-white hover:bg-gray-800"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
            </div>

            <form className="flex flex-col gap-4"
                onSubmit={handleSubmit}>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400">Email Address</label>
                    <div className="relative flex items-center">
                        <Mail className="absolute w-4 h-4 text-gray-500 left-3" />
                        <input
                            type="email"
                            required
                            placeholder="developer@example.com"
                            className="w-full py-2.5 pl-10 pr-3 text-sm text-white transition-colors bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder:text-gray-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400">Password</label>
                    <div className="relative flex items-center">
                        <KeyRound className="absolute w-4 h-4 text-gray-500 left-3" />
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full py-2.5 pl-10 pr-3 text-sm text-white transition-colors bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder:text-gray-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            
                        />
                    </div>
                </div>
                {errorMsg && (
                    <div className="flex items-center gap-2 p-2.5 text-xs text-red-400 bg-red-950/50 border border-red-900 rounded-md">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p>{errorMsg}</p>

                    </div>
                )}

                <button
                    type="submit"
                    className={`flex items-center justify-center w-full gap-2 py-2.5 mt-4 text-sm
                                font-semibold transition-all bg-green-400 rounded-lg shadow-lg
                                hover:bg-green-300 active:scale-[0.98] focus:outline-none focus:ring-2
                                focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950 
                                `}      
                    disabled={isLoading ? true: false}
                    >
                    <LogIn className="w-4 h-4" />
                    <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                </button>
            </form>
        </div>
    );
}