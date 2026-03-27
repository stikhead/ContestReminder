import { ArrowLeft, Mail, KeyRound, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import api from "../../../api/axios";

export default function ForgotPasswordForm({ onBack, onResetSuccess }) {
    
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            await api.post('/users/forgot-password-otp', { email });
            setStep(2);
        } catch (err) {
            console.error('Failed to request OTP', err);
            setErrorMsg(err.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            await api.post('/users/forgot-password', { email, otp, newPassword });
            setStep(3); 
            
            setTimeout(() => {
                onBack();
            }, 3000);

        } catch (err) {
            console.error('Failed to reset password', err);
            setErrorMsg(err.response?.data?.message || "Invalid OTP or failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full px-6 py-4 animate-in slide-in-from-right-8 duration-300">
            
            <div className="flex items-center gap-3 mb-6">
                {step !== 3 && (
                    <button
                        onClick={step === 2 ? () => setStep(1) : onBack}
                        className="p-1.5 text-gray-400 transition-colors rounded-md hover:text-white hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <h2 className="text-xl font-semibold text-white">
                    {step === 1 ? 'Reset Password' : step === 2 ? 'Verify OTP' : 'Success!'}
                </h2>
            </div>

            {errorMsg && (
                <div className="flex items-center gap-2 p-3 mb-4 text-xs text-red-400 bg-red-950/50 border border-red-900 rounded-lg animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{errorMsg}</p>
                </div>
            )}

            {step === 1 && (
                <form className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4" onSubmit={handleRequestOtp}>
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
                        className="flex items-center justify-center w-full gap-2 py-2.5 mt-4 text-sm font-semibold text-gray-900 transition-all bg-green-400 rounded-lg shadow-lg hover:bg-green-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || !email}
                    >
                        <span>{isLoading ? 'Sending...' : 'Send OTP'}</span>
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4" onSubmit={handleResetPassword}>
                    <p className="text-sm text-gray-400 mb-2">
                        We've sent a code to <span className="text-white font-medium">{email}</span>.
                    </p>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">6-Digit OTP</label>
                        <div className="relative flex items-center">
                            <ShieldCheck className="absolute w-4 h-4 text-gray-500 left-3" />
                            <input
                                type="text"
                                required
                                maxLength={6}
                                placeholder="123456"
                                className="w-full py-2.5 pl-10 pr-3 text-sm tracking-widest text-white transition-colors bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder:text-gray-600"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">New Password</label>
                        <div className="relative flex items-center">
                            <KeyRound className="absolute w-4 h-4 text-gray-500 left-3" />
                            <input
                                type="password"
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="w-full py-2.5 pl-10 pr-3 text-sm text-white transition-colors bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder:text-gray-600"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="flex items-center justify-center w-full gap-2 py-2.5 mt-4 text-sm font-semibold text-gray-900 transition-all bg-green-400 rounded-lg shadow-lg hover:bg-green-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || otp.length < 6 || !newPassword}
                    >
                        <span>{isLoading ? 'Verifying...' : 'Reset Password'}</span>
                    </button>
                </form>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center justify-center h-48 gap-4 text-center animate-in zoom-in-95 duration-500">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-400/10 rounded-full">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white mb-1">Password Reset!</h3>
                        <p className="text-sm text-gray-400">Redirecting you back to login...</p>
                    </div>
                </div>
            )}

        </div>
    );
}