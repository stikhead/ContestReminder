import { ArrowLeft, MailCheck, ShieldAlert, AlertCircle } from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

export default function VerificationForm({ onBack, onVerifySuccess }) {
    
    const [otp, setOtp] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);
        try {
            const data = await chrome.storage.local.get('pendingVerificationEmail');
            const response = await api.post('/users/verify', {otp: otp, email: data.pendingVerificationEmail})
            const accessToken = response.data.accessToken || response.data.data?.accessToken;
            const refreshToken = response.data.refreshToken || response.data.data?.refreshToken;
            if (accessToken && refreshToken) {
                await chrome.storage.local.set({
                    accessToken: `Bearer ${accessToken}`,
                    refreshToken: `Bearer ${refreshToken}`
                })
            await chrome.storage.local.remove('pendingVerificationEmail')
                onVerifySuccess();
            } else {
                setErrorMsg("Invalid response from server. Missing otp.");
            }

        } catch (err) {
            console.error('An error occurred during verification', err);
            const backendMessage = err.response?.data?.message || "Verification failed. Please check your otp.";
            setErrorMsg(backendMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full px-6 py-4 animate-in slide-in-from-right-8 duration-300">

            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="p-1.5 text-gray-400 transition-colors rounded-md hover:text-white hover:bg-gray-800"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-white">Verify Email</h2>
            </div>

            <div className="flex flex-col items-center mb-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gray-800 rounded-full">
                    <MailCheck className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">
                    We sent a verification code to your email. Enter it below to activate your account.
                </p>
            </div>

            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}>

                <div className="flex justify-center">
                    <input
                        type="text"
                        maxLength="6"
                        placeholder="••••••"
                        className="w-3/4 py-3 text-2xl font-bold tracking-[0.5em] text-center text-white transition-colors bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder:text-gray-600 placeholder:tracking-normal"
                        value={otp}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setOtp(value);
                        }}
                    />
                </div>

                {errorMsg && (
                    <div className="flex items-center gap-2 p-2.5 text-xs text-red-400 bg-red-950/50 border border-red-900 rounded-md">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p>{errorMsg}</p>
                    </div>
                )}

                <button
                    type="submit"
                    className="flex items-center justify-center w-full gap-2 py-2.5 mt-2 text-sm font-semibold transition-all bg-green-400 rounded-lg shadow-lg hover:bg-green-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-950"
                >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Verify Account</span>
                </button>

                <button
                    type="button"
                    className="mt-2 text-xs text-gray-500 transition-colors hover:text-white"
                >
                    Didn't receive a code? <span className="text-green-400 underline underline-offset-2">Resend</span>
                </button>
            </form>
        </div>
    );
}