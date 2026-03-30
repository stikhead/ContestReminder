import { useEffect, react, useState } from "react"
import api from "../api/axios"
export default function useResendOtp(email){

    const [timer, setTimer] = useState(0);
    const [resending, setIsResending] = useState(false);
    const [error, setError] = useState('');
    const [timerReady, setIsTimerReady] = useState(false);

    useEffect(()=>{
        const syncTimer = async () => {
            const data = await chrome.storage.local.get('nextOtpAvailableAt');
            if(data.nextOtpAvailableAt){
                const remaining = Math.floor((data.nextOtpAvailableAt - Date.now())/1000);
                if(remaining > 0){
                    setTimer(remaining);
                } else {
                    await chrome.storage.local.remove('nextOtpAvailableAt');
                }
            }
            setIsTimerReady(true);
        }
        syncTimer();
    }, []);

    useEffect(()=>{
        if(!timerReady) return
        let interval
        if(timer>0){
            interval = setInterval(()=>{
                setTimer((prev) => prev - 1);
            }, 1000)
        } else if (timer === 0){
            chrome.storage.local.remove('nextOtpAvailableAt')
        }

        return () => clearInterval(interval)
    }, [timer])


    const triggerResend =  async () => {
        setIsResending(true);
        setError('');
       try {
         const response = await api.post('/users/send-otp', {email});
         const nextOtpAvailableAt = response.data?.data.nextOtpAvailableAt || response.data?.nextOtpAvailableAt;
         if(nextOtpAvailableAt){
             await chrome.storage.local.set({'nextOtpAvailableAt': nextOtpAvailableAt});
             setTimer(Math.floor((nextOtpAvailableAt - Date.now())/1000));
         }
       } catch (error) {
         console.log(error);
         setError(error.response?.data?.message || 'Failed to resend code.');
         
       } finally {
        setIsResending(false);
       }

    };

    return {timer, resending, error, triggerResend};
}