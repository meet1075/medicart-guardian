import { authClient, useSession } from "@/lib/auth-client";
import { useState } from "react";

export function useAuth() {
  const { data: sessionData, isPending: isLoading, error: isError } = useSession();
  
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const login = async (data: { email: string; password: string }) => {
    setIsLoggingIn(true);
    try {
      const { data: result, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (error) throw new Error(error.message || "Login failed");
      return result;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    setIsRegistering(true);
    try {
      const { data: result, error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (error) throw new Error(error.message || "Registration failed");
      return result;
    } finally {
      setIsRegistering(false);
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
    
    login,
    isLoggingIn,
    
    register,
    isRegistering,
    
    logout,
    isLoggingOut,

    loginWithGoogle,
  };
}
