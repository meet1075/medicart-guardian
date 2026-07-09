import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdersFn, getOrderByIdFn, createOrderFn, updateOrderStatusFn, toggleItemVerificationFn } from "@/api/orders";
import type { Order, OrderItem, PrescriptionFile, Address, ItemVerification } from "@prisma/client";

// Define the full order type returned by our backend
export type FullOrder = Order & {
  items: OrderItem[];
  prescriptionFiles: PrescriptionFile[];
  itemVerifications: ItemVerification[];
  address: Address;
};

export function useOrders() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await getOrdersFn();
      if (res.status === "error") throw new Error(res.message);
      return res.data as FullOrder[];
    },
    // Poll every 10 seconds to keep admin dashboard fresh
    refetchInterval: 10000,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: Parameters<typeof createOrderFn>[0]["data"]) => {
      const res = await createOrderFn({ data });
      if (res.status === "error") throw new Error(res.message);
      return res.data as FullOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async (data: Parameters<typeof updateOrderStatusFn>[0]["data"]) => {
      const res = await updateOrderStatusFn({ data });
      if (res.status === "error") throw new Error(res.message);
      return res.data as FullOrder;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });
    },
  });

  const toggleItemVerificationMutation = useMutation({
    mutationFn: async (data: Parameters<typeof toggleItemVerificationFn>[0]["data"]) => {
      const res = await toggleItemVerificationFn({ data });
      if (res.status === "error") throw new Error(res.message);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (data && data.orderId) {
        queryClient.invalidateQueries({ queryKey: ["order", data.orderId] });
      }
    },
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
  };
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await getOrderByIdFn({ data: { id } });
      if (res.status === "error") throw new Error(res.message);
      return res.data as FullOrder;
    },
    enabled: !!id,
  });
}
