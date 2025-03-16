"use client"
import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent, ChangeEvent, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { resendOTP, verifyOTP } from '@/actions/authActions';
import HeaderLayout from '@/app/headerLayout';
import { signIn } from "next-auth/react";
 

interface OTPInputProps {
  length?: number;
  identifier:string;
  callback:string;
 
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6,  identifier, callback }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const totalTime= Number.parseInt(process.env.OTP_RESEND_TIME || "30")
  const [timeLeft, setTimeLeft] = useState<number>(totalTime);  
  const router= useRouter()
  const[pending, startTransition]= useTransition()
  const[isResending, startResendingTransition]= useTransition()
  const onComplete= (otpValue:string)=>{
    startTransition(async()=>{
      if(otpValue.length === length){
        await signIn("credentials", { email: identifier, otp:otpValue, redirect: false })
          .then((result) => {
            if (result?.error) {
              toast.error(result.error);
              return;
            }

            if (result?.ok && !result?.error) {
              toast.success("Login successfully.")
              router.push(callback);
            }
          })
          .catch((err) => {
            toast.error(err.message);
          });
        
      }
      
    })
  }
  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
    const { value } = e.target;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    
    // Get just the last character if multiple are pasted
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
    
    // Move to next input if this one is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key events (backspace, arrow keys)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current field is empty and backspace pressed, move to previous field
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only proceed if pasted content is all digits
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < Math.min(length, pastedData.length); i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex].focus();
    
    // Check if OTP is complete after paste
    if (pastedData.length >= length && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const handleResend= ()=>{
    startResendingTransition(async()=>{
      
        try {

          
          const resp=await resendOTP(identifier)
          if( "error" in resp){
            toast.error(resp.error)
           
          }else{
            setTimeLeft(totalTime)
            toast.success("New OTP Code sent successfuly.")
         
          }
  
        } catch (error) {
          toast.error("Otp code resend failed.")
          
        }
      
      
    })
  }
 
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Calculate circular progress for the timer
  const calculateCircleProgress = () => {
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / totalTime;
    const dashoffset = circumference * (1 - progress);
    return {
      radius,
      circumference,
      dashoffset
    };
  };

  const { radius, circumference, dashoffset } = calculateCircleProgress();

  return (
   <HeaderLayout>
     <div className="flex flex-col items-center justify-center w-full max-w-md px-6">
      <h2 className="text-sm text-gray-800 text-center mb-6 font-sm pt-10">
        Protecting your account is our priority. Please confirm your identity by providing the code sent to your email/phone
      </h2>
      
      <div className="flex gap-2 w-full justify-center mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            ref={(ref: HTMLInputElement | null) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            className="w-12 h-12 border border-gray-300 rounded text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        ))}
      </div>
      
      <div className="flex justify-between w-full">
        <button 
          className="py-2 px-8 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          onClick={() => {router.back()}}
        >
          Cancel
        </button>
        
        <button 
          className={`py-2 px-8 bg-primary rounded-full text-white font-medium hover:bg-primary transition-colors ${pending && "opacity-50 cursor-not-allowed"}`}
          onClick={() => onComplete && onComplete(otp.join(''))}
        >
         {pending ? "Verifying...": " Verify"}
        </button>
      </div>
      
      <div className="mt-6 text-center text-gray-700 flex items-center justify-center gap-2">
        It may take a minute to receive verification message. Haven't received it yet?{' '}
        {timeLeft > 0 && (
          <div className="inline-flex items-center justify-center">
            <svg width="28" height="28" className="transform -rotate-90">
              <circle
                cx="14"
                cy="14"
                r={radius}
                fill="transparent"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              <circle
                cx="14"
                cy="14"
                r={radius}
                fill="transparent"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="ml-1 text-sm">{timeLeft}s</span>
          </div>
        )}
        <button
          className={`text-amber-500 font-medium ${timeLeft > 0 || isResending ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
          onClick={timeLeft > 0 || isResending ? undefined : handleResend}
          disabled={timeLeft > 0 || isResending}
        >
          {isResending ? 'Sending...' : 'Resend'}
        </button>
      </div>
    </div>
   </HeaderLayout>
  );
};

export default OTPInput;