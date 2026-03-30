import useResendOtp from '../../../hooks/useResendOtp'

export default function ResendOtpButton({email, isLoading}) {
    const { timer, resending, triggerResend, error } = useResendOtp(email);
    return (<div className="mt-auto pt-6 text-center">
        {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

        <button
            type="button"
            onClick={triggerResend}
            disabled={isLoading || resending || timer > 0}
            className="text-xs text-gray-100 transition-colors hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
            {resending ? (
                "Sending..."
            ) : timer > 0 ? (
                `Resend code in ${timer}s`
            ) : (
                <>Didn't receive a code? <span className="text-green-400 underline underline-offset-2">Resend</span></>
            )}
        </button>
    </div>
    )
}