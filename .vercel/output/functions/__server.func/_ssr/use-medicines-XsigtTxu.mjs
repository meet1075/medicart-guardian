import { o as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as updateMedicineFn, i as getMedicinesFn, n as deleteMedicineFn, t as createMedicineFn } from "./medicines-CBQcPI-m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-medicines-XsigtTxu.js
function useMedicines() {
	const queryClient = useQueryClient();
	const medicinesQuery = useQuery({
		queryKey: ["medicines"],
		queryFn: async () => {
			const res = await getMedicinesFn();
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		staleTime: 300 * 1e3,
		gcTime: 1800 * 1e3,
		placeholderData: keepPreviousData
	});
	const createMedicineMutation = useMutation({
		mutationFn: async (data) => {
			const res = await createMedicineFn({ data });
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		onSuccess: (newMedicine) => {
			queryClient.setQueryData(["medicines"], (old) => {
				if (!old) return [newMedicine];
				return [newMedicine, ...old];
			});
			queryClient.invalidateQueries({ queryKey: ["medicines"] });
		}
	});
	const updateMedicineMutation = useMutation({
		mutationFn: async (args) => {
			const res = await updateMedicineFn({ data: args });
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		onSuccess: (updatedMedicine) => {
			queryClient.setQueryData(["medicines"], (old) => {
				if (!old) return old;
				return old.map((m) => m.id === updatedMedicine.id ? updatedMedicine : m);
			});
			queryClient.setQueryData(["medicine", updatedMedicine.id], updatedMedicine);
			queryClient.invalidateQueries({ queryKey: ["medicines"] });
			queryClient.invalidateQueries({ queryKey: ["medicine", updatedMedicine.id] });
		}
	});
	const deleteMedicineMutation = useMutation({
		mutationFn: async (id) => {
			const res = await deleteMedicineFn({ data: { id } });
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["medicines"] });
		}
	});
	return {
		medicines: medicinesQuery.data ?? [],
		isLoading: medicinesQuery.isLoading && !medicinesQuery.data,
		isError: medicinesQuery.isError,
		createMedicine: createMedicineMutation.mutateAsync,
		isCreating: createMedicineMutation.isPending,
		updateMedicine: updateMedicineMutation.mutateAsync,
		isUpdating: updateMedicineMutation.isPending,
		deleteMedicine: deleteMedicineMutation.mutateAsync,
		isDeleting: deleteMedicineMutation.isPending
	};
}
//#endregion
export { useMedicines as t };
