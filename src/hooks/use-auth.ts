import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSessionFn, loginFn, logoutFn, registerFn } from "@/api/auth";
import type { User } from "@prisma/client";

export function useAuth() {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ["auth_session"],
    queryFn: async () => {
      const res = await getSessionFn();
      if (res.status === "error") throw new Error(res.message);
      return res.data as Omit<User, "passwordHash"> | null;
    },
    staleTime: 5 * 60 * 1000, 
  });

  const loginMutation = useMutation({
    mutationFn: async (data: Parameters<typeof loginFn>[0]["data"]) => {
      const res = await loginFn({ data });
      if (res.status === "error") throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth_session"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Parameters<typeof registerFn>[0]["data"]) => {
      const res = await registerFn({ data });
      if (res.status === "error") throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth_session"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await logoutFn();
      if (res.status === "error") throw new Error(res.message);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth_session"] });
    },
  });

  return {
    user: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    isError: sessionQuery.isError,
    
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
