import { a as db } from "./ssr.mjs";
import { _ as string, m as object } from "../_libs/zod.mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { i as schedulePickup, n as createShiprocketOrder, r as generateAWB, t as cancelShipment } from "./shiprocket.service-CklOLUJv.mjs";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.mjs";
import { n as getUserSession, r as successResponse, t as errorResponse } from "./auth.server-CIzGGSXg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shiprocket.api-TeOSsld8.js
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
var retryShipmentCreationFn_createServerFn_handler = createServerRpc({
	id: "cf331f29a2929f4f3e66b6e81f83aa68d78d54721506eac4ea9b05c66d1fedda",
	name: "retryShipmentCreationFn",
	filename: "src/api/shiprocket.api.ts"
}, (opts) => retryShipmentCreationFn.__executeServer(opts));
var retryShipmentCreationFn = createServerFn({ method: "POST" }).validator(object({ orderId: string() })).handler(retryShipmentCreationFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", void 0, 403);
		await tryCreateShiprocketShipment(data.orderId);
		const order = await db.order.findUnique({ where: { id: data.orderId } });
		if (order?.isShipmentCreated) return successResponse("Shipment created successfully", order);
		else return errorResponse("Failed to create shipment", order?.shipmentError || "Unknown error");
	} catch (error) {
		console.error(error);
		return errorResponse("Error", error.message);
	}
});
var generateShipmentAwbFn_createServerFn_handler = createServerRpc({
	id: "3897b7d6e3fcc3a3bab995b19898a5de948b47015cd16b77e47fce2a7410ae6f",
	name: "generateShipmentAwbFn",
	filename: "src/api/shiprocket.api.ts"
}, (opts) => generateShipmentAwbFn.__executeServer(opts));
var generateShipmentAwbFn = createServerFn({ method: "POST" }).validator(object({
	orderId: string(),
	shipmentId: string()
})).handler(generateShipmentAwbFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", void 0, 403);
		const awbResponse = (await generateAWB(data.shipmentId)).response?.data;
		if (!awbResponse) throw new Error("Invalid response from Shiprocket");
		return successResponse("AWB generated successfully", await db.order.update({
			where: { id: data.orderId },
			data: {
				awbCode: awbResponse.awb_code,
				courierName: awbResponse.courier_name
			}
		}));
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to generate AWB", error.message);
	}
});
var scheduleShipmentPickupFn_createServerFn_handler = createServerRpc({
	id: "071dced2ba76644e673fc2283da6bc62dfd4950418ce77fe9a2aa9e2aa079f6d",
	name: "scheduleShipmentPickupFn",
	filename: "src/api/shiprocket.api.ts"
}, (opts) => scheduleShipmentPickupFn.__executeServer(opts));
var scheduleShipmentPickupFn = createServerFn({ method: "POST" }).validator(object({
	orderId: string(),
	shipmentId: string()
})).handler(scheduleShipmentPickupFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", void 0, 403);
		await schedulePickup(data.shipmentId);
		return successResponse("Pickup scheduled successfully", await db.order.update({
			where: { id: data.orderId },
			data: { pickupStatus: "Scheduled" }
		}));
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to schedule pickup", error.message);
	}
});
var cancelShiprocketShipmentFn_createServerFn_handler = createServerRpc({
	id: "f522d5206dbefc94092264b6c6f70e8c13c3ce50131704efcf95d20ba0d9c796",
	name: "cancelShiprocketShipmentFn",
	filename: "src/api/shiprocket.api.ts"
}, (opts) => cancelShiprocketShipmentFn.__executeServer(opts));
var cancelShiprocketShipmentFn = createServerFn({ method: "POST" }).validator(object({
	orderId: string(),
	awbCode: string()
})).handler(cancelShiprocketShipmentFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", void 0, 403);
		await cancelShipment([data.awbCode]);
		return successResponse("Shipment cancelled", await db.order.update({
			where: { id: data.orderId },
			data: { shipmentStatus: "Cancelled" }
		}));
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to cancel shipment", error.message);
	}
});
//#endregion
export { cancelShiprocketShipmentFn_createServerFn_handler, generateShipmentAwbFn_createServerFn_handler, retryShipmentCreationFn_createServerFn_handler, scheduleShipmentPickupFn_createServerFn_handler };
