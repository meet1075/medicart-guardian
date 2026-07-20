import { _ as string, c as boolean, m as object, o as any, p as number, s as array } from "../_libs/zod.mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Dlr6sAwK.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-orders-CxPkG3kV.js
var getOrdersFn = createServerFn({ method: "GET" }).handler(createSsrRpc("89267533749e533bf58e5e722665acfc23f42f117ecedd337877f6281ab71082"));
var getOrderByIdFn = createServerFn({ method: "GET" }).validator(object({ id: string() })).handler(createSsrRpc("e001c6774c5b1c1a19e4612727f04bd04fdb4e5715ff42f7957b1d5cd7f9fa52"));
var CreateOrderSchema = object({
	items: array(object({
		medicineId: string(),
		name: string(),
		salt: string().optional(),
		dosageForm: string().optional(),
		qty: number(),
		price: number(),
		prescriptionRequired: boolean().default(false)
	})),
	subtotal: number(),
	delivery: number(),
	total: number(),
	hasRx: boolean(),
	paymentMethod: string(),
	address: object({
		fullName: string(),
		phone: string(),
		line1: string(),
		line2: string().optional(),
		city: string(),
		state: string(),
		pincode: string(),
		type: string(),
		deliverySlot: string()
	}),
	prescriptionFiles: array(object({
		name: string(),
		mimeType: string(),
		dataUrl: string(),
		aiExtractionResult: any().optional()
	})).optional(),
	itemVerifications: array(object({
		medicineId: string(),
		aiStatus: string(),
		pharmacistApproved: boolean().default(false)
	})).optional()
});
var createOrderFn = createServerFn({ method: "POST" }).validator(CreateOrderSchema).handler(createSsrRpc("5c8eea6f9c83fbb2dbaf315f8c04587c61629cc285c42aea54a2f10c67322fbb"));
var updateOrderStatusFn = createServerFn({ method: "POST" }).validator(object({
	orderId: string(),
	status: string(),
	prescriptionStatus: string().optional(),
	reviewer: string().optional(),
	rejectReason: string().optional()
})).handler(createSsrRpc("f0ab8ac61429c5e6c887bfd38d2091a9f0ca0b938e58d0169062a8013b177776"));
var toggleItemVerificationFn = createServerFn({ method: "POST" }).validator(object({
	id: string(),
	approved: boolean()
})).handler(createSsrRpc("3d2d0dc277d2afe331a13cbc39133b97794e4571196c0f1c5872dc5d94f3e101"));
var verifyPaymentFn = createServerFn({ method: "POST" }).validator(object({
	orderId: string(),
	razorpayPaymentId: string(),
	razorpayOrderId: string(),
	razorpaySignature: string()
})).handler(createSsrRpc("937d1d2ecc5ddb535a21b06d17309c710c34ef9fa607bb8368cb206bbbae3268"));
function useOrders() {
	const queryClient = useQueryClient();
	const ordersQuery = useQuery({
		queryKey: ["orders"],
		queryFn: async () => {
			const res = await getOrdersFn();
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		refetchInterval: 3e3,
		staleTime: 2e3
	});
	const createOrderMutation = useMutation({
		mutationFn: async (data) => {
			const res = await createOrderFn({ data });
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		}
	});
	const updateOrderStatusMutation = useMutation({
		mutationFn: async (data) => {
			const res = await updateOrderStatusFn({ data });
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		onSuccess: (updatedOrder) => {
			queryClient.setQueryData(["orders"], (old) => {
				if (!old) return old;
				return old.map((o) => o.id === updatedOrder.id ? updatedOrder : o);
			});
			queryClient.setQueryData(["order", updatedOrder.id], updatedOrder);
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			queryClient.invalidateQueries({ queryKey: ["order", updatedOrder.id] });
		}
	});
	const toggleItemVerificationMutation = useMutation({
		mutationFn: async (data) => {
			const res = await toggleItemVerificationFn({ data });
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		onSuccess: (updatedVerification) => {
			if (updatedVerification && updatedVerification.orderId) queryClient.setQueryData(["orders"], (old) => {
				if (!old) return old;
				return old.map((o) => o.id === updatedVerification.orderId ? {
					...o,
					itemVerifications: o.itemVerifications.map((iv) => iv.id === updatedVerification.id ? updatedVerification : iv)
				} : o);
			});
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			if (updatedVerification && updatedVerification.orderId) queryClient.invalidateQueries({ queryKey: ["order", updatedVerification.orderId] });
		}
	});
	const verifyPaymentMutation = useMutation({
		mutationFn: async (data) => {
			const res = await verifyPaymentFn({ data });
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		onSuccess: (updatedOrder) => {
			queryClient.setQueryData(["orders"], (old) => {
				if (!old) return old;
				return old.map((o) => o.id === updatedOrder.id ? updatedOrder : o);
			});
			queryClient.setQueryData(["order", updatedOrder.id], updatedOrder);
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			queryClient.invalidateQueries({ queryKey: ["order", updatedOrder.id] });
		}
	});
	return {
		orders: ordersQuery.data ?? [],
		isLoading: ordersQuery.isLoading,
		isError: ordersQuery.isError,
		createOrder: createOrderMutation.mutateAsync,
		isCreating: createOrderMutation.isPending,
		updateOrderStatus: updateOrderStatusMutation.mutateAsync,
		isUpdating: updateOrderStatusMutation.isPending,
		toggleItemVerification: toggleItemVerificationMutation.mutateAsync,
		verifyPayment: verifyPaymentMutation.mutateAsync
	};
}
function useOrder(id) {
	return useQuery({
		queryKey: ["order", id],
		queryFn: async () => {
			const res = await getOrderByIdFn({ data: { id } });
			if (res.status === "error") throw new Error(res.message);
			return res.data;
		},
		enabled: !!id,
		staleTime: 2e3
	});
}
//#endregion
export { useOrders as n, useOrder as t };
