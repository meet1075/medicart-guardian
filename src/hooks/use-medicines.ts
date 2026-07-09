import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedicinesFn, getMedicineByIdFn, createMedicineFn, updateMedicineFn, deleteMedicineFn } from "@/api/medicines";
import type { Medicine } from "@prisma/client";

export function useMedicines() {
  const queryClient = useQueryClient();

  const medicinesQuery = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const res = await getMedicinesFn();
      if (res.status === "error") throw new Error(res.message);
      return res.data as Medicine[];
    },
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });

  const createMedicineMutation = useMutation({
    mutationFn: async (data: Parameters<typeof createMedicineFn>[0]["data"]) => {
      const res = await createMedicineFn({ data });
      if (res.status === "error") throw new Error(res.message);
      return res.data as Medicine;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });

  const updateMedicineMutation = useMutation({
    mutationFn: async (args: Parameters<typeof updateMedicineFn>[0]["data"]) => {
      const res = await updateMedicineFn({ data: args });
      if (res.status === "error") throw new Error(res.message);
      return res.data as Medicine;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicine", data.id] });
    },
  });

  const deleteMedicineMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteMedicineFn({ data: { id } });
      if (res.status === "error") throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });

  return {
    medicines: medicinesQuery.data ?? [],
    isLoading: medicinesQuery.isLoading,
    isError: medicinesQuery.isError,
    createMedicine: createMedicineMutation.mutateAsync,
    isCreating: createMedicineMutation.isPending,
    updateMedicine: updateMedicineMutation.mutateAsync,
    isUpdating: updateMedicineMutation.isPending,
    deleteMedicine: deleteMedicineMutation.mutateAsync,
    isDeleting: deleteMedicineMutation.isPending,
  };
}

export function useMedicine(id: string) {
  return useQuery({
    queryKey: ["medicine", id],
    queryFn: async () => {
      const res = await getMedicineByIdFn({ data: { id } });
      if (res.status === "error") throw new Error(res.message);
      return res.data as Medicine;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
