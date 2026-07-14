import { useMutation, useQueryClient } from "@tanstack/react-query";
import { retryShipmentCreationFn, generateShipmentAwbFn, scheduleShipmentPickupFn, cancelShiprocketShipmentFn } from "@/api/shiprocket.api";

export function useShiprocket() {
  const queryClient = useQueryClient();

  const invalidateOrders = () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  const retryShipmentCreation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await retryShipmentCreationFn({ data: { orderId } });
      if (res.status === "error") throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => invalidateOrders(),
  });

  const generateAwb = useMutation({
    mutationFn: async ({ orderId, shipmentId }: { orderId: string; shipmentId: string }) => {
      const res = await generateShipmentAwbFn({ data: { orderId, shipmentId } });
      if (res.status === "error") throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => invalidateOrders(),
  });

  const schedulePickup = useMutation({
    mutationFn: async ({ orderId, shipmentId }: { orderId: string; shipmentId: string }) => {
      const res = await scheduleShipmentPickupFn({ data: { orderId, shipmentId } });
      if (res.status === "error") throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => invalidateOrders(),
  });

  const cancelShipment = useMutation({
    mutationFn: async ({ orderId, awbCode }: { orderId: string; awbCode: string }) => {
      const res = await cancelShiprocketShipmentFn({ data: { orderId, awbCode } });
      if (res.status === "error") throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => invalidateOrders(),
  });

  return {
    retryShipmentCreation,
    generateAwb,
    schedulePickup,
    cancelShipment,
  };
}
