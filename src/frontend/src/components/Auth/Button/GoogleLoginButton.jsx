import api from "../../../api/axios";
import useAuth from "../../../context/AuthContext";
import react, { useState } from 'react'
export default function GoogleButton({ onError, disabled, set, text = "Continue with Google"}) {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const { onLogin } = useAuth();  
    const handleClick = async () => {
        setIsGoogleLoading(true); 
        set(true);
        
        const redirectUri = chrome.identity.getRedirectURL();
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

        authUrl.searchParams.set('client_id', '185629803135-1bskd3kv3j0ep63cl25mlftbmnrhrmme.apps.googleusercontent.com');
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('access_type', 'offline');
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/userinfo.email');
        authUrl.searchParams.set('prompt', 'consent');

        chrome.identity.launchWebAuthFlow({ url: authUrl.href, interactive: true }, async (responseUrl) => {
            if (chrome.runtime.lastError || !responseUrl) {
                console.error("Auth flow failed or user cancelled.", chrome.runtime.lastError);
                setIsGoogleLoading(false); 
                set(false)
                return;
            }

            const url = new URL(responseUrl);
            const code = url.searchParams.get('code');
            try {
                const response = await api.post('/users/googleLogin', { code });
                const accessToken = response.data.accessToken || response.data.data?.accessToken;
                const refreshToken = response.data.refreshToken || response.data.data?.refreshToken;
                if (accessToken && refreshToken) {
                    await chrome.storage.local.remove('pendingVerificationEmail');
                    await chrome.storage.local.set({
                        'accessToken': `${accessToken}`,
                        'refreshToken': `${refreshToken}`
                    })
                    onLogin();
                } else {
                    onError("Invalid response from server. Missing tokens.");
                }

            } catch (err) {
                console.error('An error occurred during login', err);
                const backendMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
                onError(backendMessage);
            } finally {
                setIsGoogleLoading(false);
                set(false);
            }
        });
    }

    return (
    <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isGoogleLoading}
        className={`flex items-center justify-center w-full gap-2 py-2.5 text-sm
                    font-medium text-white transition-all border border-gray-700 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-950
                    ${isGoogleLoading || disabled
                ? 'bg-gray-800/50 cursor-not-allowed opacity-50'
                : 'bg-gray-800 hover:bg-gray-700 active:scale-[0.98]  cursor-pointer'
            }`}
    >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span>{isGoogleLoading ? 'Connecting...' : `${text}`}</span>
    </button>
    )
}