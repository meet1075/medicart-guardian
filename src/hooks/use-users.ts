import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsersFn, updateUserRoleFn } from "@/api/users";

export type AdminUserView = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
};

export function useUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getUsersFn();
      if (res.status === "error") throw new Error(res.message);
      return res.data as AdminUserView[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async (args: Parameters<typeof updateUserRoleFn>[0]["data"]) => {
      const res = await updateUserRoleFn({ data: args });
      if (res.status === "error") throw new Error(res.message);
      return res.data as AdminUserView;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["users"], (old: AdminUserView[] | undefined) => {
        if (!old) return old;
        return old.map(u => u.id === updatedUser.id ? updatedUser : u);
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading && !usersQuery.data,
    isError: usersQuery.isError,
    updateUserRole: updateUserRoleMutation.mutateAsync,
    isUpdating: updateUserRoleMutation.isPending,
  };
}
