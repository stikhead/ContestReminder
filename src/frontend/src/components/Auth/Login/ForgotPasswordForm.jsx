import { ArrowLeft, Mail, KeyRound, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import api from "../../../api/axios";

export default function ForgotPasswordForm({ onBack, onRequestOtp }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState('');

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const response = await api.post('/users/send-otp', { email });
            await chrome.storage.local.set({ pendingPasswordResetOtp: email })
            await chrome.storage.local.set({'nextOtpAvailableAt': response?.data?.data?.nextOtpAvailableAt})
            onRequestOtp(email);
        } catch (err) {
            console.error('Failed to request OTP', err);
            setErrorMsg(err.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col h-full w-full px-6 py-4 animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="p-1.5 text-gray-400 transition-colors rounded-md hover:text-white hover:bg-gray-800 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold text-white">
                    Reset Password
                </h2>
            </div>

            {errorMsg && (
                <div className="flex items-center gap-2 p-3 mb-4 text-xs text-red-400 bg-red-950/50 border border-red-900 rounded-lg animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{errorMsg}</p>
                </div>
            )}


            <form
                className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4"
                onSubmit={handleRequestOtp}>
                <p className="text-sm text-gray-400 mb-2">
                    Enter the email address associated with your account and we'll send you an OTP to reset your password.
                </p>

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

                <button
                    type="submit"
                    className="flex items-center justify-center w-full gap-2 py-2.5 mt-4 text-sm font-semibold text-gray-900 transition-all bg-green-400 rounded-lg shadow-lg hover:bg-green-300 active:scale-[0.98] disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed"
                    disabled={isLoading || !email}
                >
                    <span>{isLoading ? 'Sending...' : 'Send OTP'}</span>
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
            </form>



        </div>
    );
}