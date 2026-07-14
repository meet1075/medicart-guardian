import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdersFn, getOrderByIdFn, createOrderFn, updateOrderStatusFn, toggleItemVerificationFn, verifyPaymentFn } from "@/api/orders";
import type { Order, OrderItem, PrescriptionFile, Address, ItemVerification } from "@prisma/client";

// Define the full order type returned by our backend
export type FullOrder = Order & {
  items: OrderItem[];
  prescriptionFiles: PrescriptionFile[];
  itemVerifications: ItemVerification[];
  address: Address;
  user: { id: string; name: string; email: string } | null;
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
    // Poll every 3 seconds to keep admin dashboard fresh
    refetchInterval: 3000,
    staleTime: 2000,
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
    onSuccess: (updatedOrder) => {
      // Optimistic update for immediate UI feedback
      queryClient.setQueryData(["orders"], (old: FullOrder[] | undefined) => {
        if (!old) return old;
        return old.map(o => o.id === updatedOrder.id ? updatedOrder : o);
      });
      queryClient.setQueryData(["order", updatedOrder.id], updatedOrder);

      // Background sync to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", updatedOrder.id] });
    },
  });

  const toggleItemVerificationMutation = useMutation({
    mutationFn: async (data: Parameters<typeof toggleItemVerificationFn>[0]["data"]) => {
      const res = await toggleItemVerificationFn({ data });
      if (res.status === "error") throw new Error(res.message);
      return res.data;
    },
    onSuccess: (updatedVerification) => {
      // Optimistic deep update for item verification
      if (updatedVerification && updatedVerification.orderId) {
        queryClient.setQueryData(["orders"], (old: FullOrder[] | undefined) => {
          if (!old) return old;
          return old.map(o => o.id === updatedVerification.orderId ? {
            ...o,
            itemVerifications: o.itemVerifications.map((iv: any) => iv.id === updatedVerification.id ? updatedVerification : iv)
          } : o);
        });
      }

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (updatedVerification && updatedVerification.orderId) {
        queryClient.invalidateQueries({ queryKey: ["order", updatedVerification.orderId] });
      }
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async (data: Parameters<typeof verifyPaymentFn>[0]["data"]) => {
      const res = await verifyPaymentFn({ data });
      if (res.status === "error") throw new Error(res.message);
      return res.data as FullOrder;
    },
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(["orders"], (old: FullOrder[] | undefined) => {
        if (!old) return old;
        return old.map(o => o.id === updatedOrder.id ? updatedOrder : o);
      });
      queryClient.setQueryData(["order", updatedOrder.id], updatedOrder);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", updatedOrder.id] });
    },
  });

  return {
    orders: (ordersQuery.data ?? []) as FullOrder[],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
    updateOrderStatus: updateOrderStatusMutation.mutateAsync,
    isUpdating: updateOrderStatusMutation.isPending,
    toggleItemVerification: toggleItemVerificationMutation.mutateAsync,
    verifyPayment: verifyPaymentMutation.mutateAsync,
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
    staleTime: 2000,
  });
}
