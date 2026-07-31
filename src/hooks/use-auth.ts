import { authClient, useSession } from "@/lib/auth-client";
import { useState } from "react";

export function useAuth() {
  const { data: sessionData, isPending: isLoading, error: isError } = useSession();
  
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const sendOtp = async (phoneNumber: string) => {
    setIsSendingOtp(true);
    try {
      const { data, error } = await authClient.phoneNumber.sendOtp({
        phoneNumber,
      });
      if (error) throw new Error(error.message || "Failed to send OTP");
      return data;
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async (phoneNumber: string, code: string) => {
    setIsVerifyingOtp(true);
    try {
      const { data, error } = await authClient.phoneNumber.verify({
        phoneNumber,
        code,
      });
      if (error) throw new Error(error.message || "Invalid OTP");
      return data;
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message || "Logout failed");
      return true;
    } finally {
      setIsLoggingOut(false);
    }
  };

  const loginWithGoogle = async (callbackURL: string = "/") => {
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });
    if (error) throw new Error(error.message || "Google Login failed");
    return data;
  };

  return {
    user: (sessionData?.user as any) ?? null,
    isLoading,
    isError,
    sendOtp,
    isSendingOtp,
    
    verifyOtp,
    isVerifyingOtp,
    
    logout,
    isLoggingOut,

    loginWithGoogle,
  };
}
