import { ArrowLeft, Mail, KeyRound, UserPlus, User, AlertCircle } from "lucide-react";
import { useState } from "react";
import api from "../../../api/axios";
import GoogleButton from "../Button/GoogleLoginButton";

export default function SignupForm({ onBack, onSignupSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isFormIncomplete = !name.trim() || !email.trim() || !password.trim();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const response = await api.post('/users/register', { email, password });
            await chrome.storage.local.set({
                pendingVerificationEmail: email
            });
            onSignupSuccess();
        } catch (err) {
            console.error('An error occurred during signup', err);
            const backendMessage = err.response?.data?.message || "Signup failed. Please try again later.";
            setErrorMsg(backendMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-full w-full px-6 py-4 animate-in slide-in-from-right-8 duration-300">

            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="p-1.5 text-gray-400 transition-colors rounded-md hover:text-white hover:bg-gray-800 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-white">Create Account</h2>
            </div>

            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400">Full Name</label>
                    <div className="relative flex items-center">
                        <User className="absolute w-4 h-4 text-gray-500 left-3" />
                        <input
                            type="text"
                            required
                            disabled={isLoading}
                            placeholder="John Doe"
                            className="w-full py-2.5 pl-10 pr-3 text-sm text-white transition-colors bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400">Email Address</label>
                    <div className="relative flex items-center">
                        <Mail className="absolute w-4 h-4 text-gray-500 left-3" />
                        <input
                            type="email"
                            required
                            disabled={isLoading}
                            placeholder="developer@example.com"
                            className="w-full py-2.5 pl-10 pr-3 text-sm text-white transition-colors bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            disabled={isLoading}
                            placeholder="••••••••"
                            className="w-full py-2.5 pl-10 pr-3 text-sm text-white transition-colors bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={isLoading || isFormIncomplete}
                    className={`flex items-center justify-center w-full gap-2 py-2.5 mt-4 text-sm 
                        font-semibold transition-all rounded-lg text-gray-900
                        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950
                        ${(isLoading || isFormIncomplete)
                            ? 'bg-green-400/50 cursor-not-allowed'
                            : 'bg-green-400 shadow-lg hover:bg-green-300 active:scale-[0.98] hover:cursor-pointer'
                        }`}
                >
                    <UserPlus className="w-4 h-4" />
                    <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
                </button>
            </form>

            <div className="relative flex items-center py-4">
                <div className="grow border-t border-gray-800"></div>
                <span className="shrink-0 mx-4 text-xs text-gray-500">or</span>
                <div className="grow border-t border-gray-800"></div>
            </div>

            <GoogleButton
                disabled={isLoading}
                onError={setErrorMsg}
                text="Signup With Google"
            />
        </div>
    );
}