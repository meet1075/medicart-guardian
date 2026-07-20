import { a as db } from "./ssr.mjs";
import { _ as string, m as object } from "../_libs/zod.mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Dlr6sAwK.mjs";
import { n as createShiprocketOrder } from "./shiprocket.service-CklOLUJv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shiprocket.api-BDlLZW_n.js
/**
* Internal utility to attempt creating a Shiprocket shipment.
* Does NOT throw errors, gracefully updates the DB.
*/
async function tryCreateShiprocketShipment(orderId) {
	try {
		const order = await db.order.findUnique({
			where: { id: orderId },
			include: {
				items: true,
				address: true,
				user: true
			}
		});
		if (!order || order.isShipmentCreated) return;
		if (order.status !== "processing") return;
		const shiprocketData = await createShiprocketOrder(order);
		await db.order.update({
			where: { id: orderId },
			data: {
				isShipmentCreated: true,
				shiprocketOrderId: String(shiprocketData.order_id),
				shipmentId: String(shiprocketData.shipment_id),
				shipmentStatus: "Processing",
				shipmentError: null
			}
		});
	} catch (error) {
		console.error("Failed to sync order to Shiprocket:", error);
		await db.order.update({
			where: { id: orderId },
			data: {
				isShipmentCreated: false,
				shipmentError: error.message || "Failed to create shipment"
			}
		});
	}
}
var retryShipmentCreationFn = createServerFn({ method: "POST" }).validator(object({ orderId: string() })).handler(createSsrRpc("cf331f29a2929f4f3e66b6e81f83aa68d78d54721506eac4ea9b05c66d1fedda"));
var generateShipmentAwbFn = createServerFn({ method: "POST" }).validator(object({
	orderId: string(),
	shipmentId: string()
})).handler(createSsrRpc("3897b7d6e3fcc3a3bab995b19898a5de948b47015cd16b77e47fce2a7410ae6f"));
var scheduleShipmentPickupFn = createServerFn({ method: "POST" }).validator(object({
	orderId: string(),
	shipmentId: string()
})).handler(createSsrRpc("071dced2ba76644e673fc2283da6bc62dfd4950418ce77fe9a2aa9e2aa079f6d"));
var cancelShiprocketShipmentFn = createServerFn({ method: "POST" }).validator(object({
	orderId: string(),
	awbCode: string()
})).handler(createSsrRpc("f522d5206dbefc94092264b6c6f70e8c13c3ce50131704efcf95d20ba0d9c796"));
//#endregion
export { tryCreateShiprocketShipment as a, scheduleShipmentPickupFn as i, generateShipmentAwbFn as n, retryShipmentCreationFn as r, cancelShiprocketShipmentFn as t };
