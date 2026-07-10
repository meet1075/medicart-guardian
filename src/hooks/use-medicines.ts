import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
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
    staleTime: 5 * 60 * 1000,    // consider fresh for 5 minutes
    gcTime: 30 * 60 * 1000,      // keep in cache for 30 minutes
    placeholderData: keepPreviousData, // show old data instantly while refetching
  });

  const createMedicineMutation = useMutation({
    mutationFn: async (data: Parameters<typeof createMedicineFn>[0]["data"]) => {
      const res = await createMedicineFn({ data });
      if (res.status === "error") throw new Error(res.message);
      return res.data as Medicine;
    },
    onSuccess: (newMedicine) => {
      queryClient.setQueryData(["medicines"], (old: Medicine[] | undefined) => {
        if (!old) return [newMedicine];
        return [newMedicine, ...old];
      });
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });

  const updateMedicineMutation = useMutation({
    mutationFn: async (args: Parameters<typeof updateMedicineFn>[0]["data"]) => {
      const res = await updateMedicineFn({ data: args });
      if (res.status === "error") throw new Error(res.message);
      return res.data as Medicine;
    },
    onSuccess: (updatedMedicine) => {
      // Optimistic update for instant UI feedback
      queryClient.setQueryData(["medicines"], (old: Medicine[] | undefined) => {
        if (!old) return old;
        return old.map(m => m.id === updatedMedicine.id ? updatedMedicine : m);
      });
      queryClient.setQueryData(["medicine", updatedMedicine.id], updatedMedicine);

      // Background sync
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicine", updatedMedicine.id] });
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
    isLoading: medicinesQuery.isLoading && !medicinesQuery.data, // only true on very first load
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
