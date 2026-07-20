import { o as __toESM } from "../_runtime.mjs";
import { B as any, G as number, H as boolean, K as object, V as array, Y as string } from "../_libs/@better-auth/core+[...].mjs";
import { n as db } from "./ssr.mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { a as tryCreateShiprocketShipment } from "./shiprocket.api-BDlLZW_n.mjs";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.mjs";
import { n as getUserSession, r as successResponse, t as errorResponse } from "./auth.server-CIzGGSXg.mjs";
import { t as require_razorpay } from "../_libs/razorpay.mjs";
import crypto from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-DisgbviF.js
var import_razorpay = /* @__PURE__ */ __toESM(require_razorpay());
var getOrdersFn_createServerFn_handler = createServerRpc({
	id: "89267533749e533bf58e5e722665acfc23f42f117ecedd337877f6281ab71082",
	name: "getOrdersFn",
	filename: "src/api/orders.ts"
}, (opts) => getOrdersFn.__executeServer(opts));
var getOrdersFn = createServerFn({ method: "GET" }).handler(getOrdersFn_createServerFn_handler, async () => {
	try {
		const session = await getUserSession();
		if (!session) return errorResponse("Unauthorized", "Please log in", 401);
		const whereClause = session.role === "ADMIN" ? {} : { userId: session.id };
		return successResponse("Orders fetched successfully", await db.order.findMany({
			where: whereClause,
			include: {
				items: true,
				prescriptionFiles: true,
				itemVerifications: true,
				address: true,
				user: { select: {
					id: true,
					name: true,
					email: true
				} }
			},
			orderBy: { createdAt: "desc" }
		}));
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to fetch orders", error.message);
	}
});
var getOrderByIdFn_createServerFn_handler = createServerRpc({
	id: "e001c6774c5b1c1a19e4612727f04bd04fdb4e5715ff42f7957b1d5cd7f9fa52",
	name: "getOrderByIdFn",
	filename: "src/api/orders.ts"
}, (opts) => getOrderByIdFn.__executeServer(opts));
var getOrderByIdFn = createServerFn({ method: "GET" }).validator(object({ id: string() })).handler(getOrderByIdFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session) return errorResponse("Unauthorized", "Please log in", 401);
		const order = await db.order.findUnique({
			where: { id: data.id },
			include: {
				items: true,
				prescriptionFiles: true,
				itemVerifications: true,
				address: true,
				user: { select: {
					id: true,
					name: true,
					email: true
				} }
			}
		});
		if (!order) return errorResponse("Order not found", void 0, 404);
		if (session.role !== "ADMIN" && order.userId !== session.id) return errorResponse("Unauthorized", void 0, 403);
		return successResponse("Order fetched successfully", order);
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to fetch order", error.message);
	}
});
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
var createOrderFn_createServerFn_handler = createServerRpc({
	id: "5c8eea6f9c83fbb2dbaf315f8c04587c61629cc285c42aea54a2f10c67322fbb",
	name: "createOrderFn",
	filename: "src/api/orders.ts"
}, (opts) => createOrderFn.__executeServer(opts));
var createOrderFn = createServerFn({ method: "POST" }).validator(CreateOrderSchema).handler(createOrderFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session) return errorResponse("Unauthorized", "Please log in to place an order", 401);
		let rzpOrderId = void 0;
		let initialStatus = data.hasRx ? "under_review" : "processing";
		if (data.paymentMethod !== "cod") {
			initialStatus = "payment_pending";
			try {
				rzpOrderId = (await new import_razorpay.default({
					key_id: process.env.RAZORPAY_KEY_ID,
					key_secret: process.env.RAZORPAY_KEY_SECRET
				}).orders.create({
					amount: Math.round(data.total * 100),
					currency: "INR"
				})).id;
			} catch (e) {
				console.error("Razorpay order creation failed", e);
				return errorResponse("Payment initiation failed", "Could not contact payment gateway", 500);
			}
		}
		const order = await db.order.create({
			data: {
				user: { connect: { id: session.id } },
				subtotal: data.subtotal,
				delivery: data.delivery,
				total: data.total,
				hasRx: data.hasRx,
				paymentMethod: data.paymentMethod,
				status: initialStatus,
				prescriptionStatus: data.hasRx ? "pending" : null,
				razorpayOrderId: rzpOrderId,
				address: { create: {
					...data.address,
					user: { connect: { id: session.id } }
				} },
				items: { create: data.items.map((item) => ({
					medicineId: item.medicineId,
					name: item.name,
					salt: item.salt,
					dosageForm: item.dosageForm,
					qty: item.qty,
					price: item.price,
					prescriptionRequired: item.prescriptionRequired
				})) },
				prescriptionFiles: data.prescriptionFiles ? { create: data.prescriptionFiles.map((file) => ({
					name: file.name,
					mimeType: file.mimeType,
					dataUrl: file.dataUrl,
					aiExtractionResult: file.aiExtractionResult ?? null
				})) } : void 0,
				itemVerifications: data.itemVerifications ? { create: data.itemVerifications.map((iv) => ({
					medicineId: iv.medicineId,
					aiStatus: iv.aiStatus,
					pharmacistApproved: iv.pharmacistApproved
				})) } : void 0
			},
			include: {
				items: true,
				prescriptionFiles: true,
				itemVerifications: true,
				address: true,
				user: { select: {
					id: true,
					name: true,
					email: true
				} }
			}
		});
		if (initialStatus === "processing") tryCreateShiprocketShipment(order.id).catch(console.error);
		return successResponse("Order created successfully", order, 201);
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to create order", error.message);
	}
});
var updateOrderStatusFn_createServerFn_handler = createServerRpc({
	id: "f0ab8ac61429c5e6c887bfd38d2091a9f0ca0b938e58d0169062a8013b177776",
	name: "updateOrderStatusFn",
	filename: "src/api/orders.ts"
}, (opts) => updateOrderStatusFn.__executeServer(opts));
var updateOrderStatusFn = createServerFn({ method: "POST" }).validator(object({
	orderId: string(),
	status: string(),
	prescriptionStatus: string().optional(),
	reviewer: string().optional(),
	rejectReason: string().optional()
})).handler(updateOrderStatusFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", void 0, 403);
		const order = await db.order.update({
			where: { id: data.orderId },
			data: {
				status: data.status,
				prescriptionStatus: data.prescriptionStatus,
				reviewedBy: data.reviewer,
				reviewedAt: data.reviewer ? /* @__PURE__ */ new Date() : void 0,
				rejectReason: data.rejectReason
			},
			include: {
				items: true,
				prescriptionFiles: true,
				itemVerifications: true,
				address: true,
				user: { select: {
					id: true,
					name: true,
					email: true
				} }
			}
		});
		if (data.status === "processing") tryCreateShiprocketShipment(order.id).catch(console.error);
		return successResponse("Order updated successfully", order);
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to update order status", error.message);
	}
});
var toggleItemVerificationFn_createServerFn_handler = createServerRpc({
	id: "3d2d0dc277d2afe331a13cbc39133b97794e4571196c0f1c5872dc5d94f3e101",
	name: "toggleItemVerificationFn",
	filename: "src/api/orders.ts"
}, (opts) => toggleItemVerificationFn.__executeServer(opts));
var toggleItemVerificationFn = createServerFn({ method: "POST" }).validator(object({
	id: string(),
	approved: boolean()
})).handler(toggleItemVerificationFn_createServerFn_handler, async ({ data }) => {
	try {
		const session = await getUserSession();
		if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", void 0, 403);
		return successResponse("Item verification toggled", await db.itemVerification.update({
			where: { id: data.id },
			data: { pharmacistApproved: data.approved }
		}));
	} catch (error) {
		console.error(error);
		return errorResponse("Failed to toggle item verification", error.message);
	}
});
var verifyPaymentFn_createServerFn_handler = createServerRpc({
	id: "937d1d2ecc5ddb535a21b06d17309c710c34ef9fa607bb8368cb206bbbae3268",
	name: "verifyPaymentFn",
	filename: "src/api/orders.ts"
}, (opts) => verifyPaymentFn.__executeServer(opts));
var verifyPaymentFn = createServerFn({ method: "POST" }).validator(object({
	orderId: string(),
	razorpayPaymentId: string(),
	razorpayOrderId: string(),
	razorpaySignature: string()
})).handler(verifyPaymentFn_createServerFn_handler, async ({ data }) => {
	try {
		if (!await getUserSession()) return errorResponse("Unauthorized", "Please log in", 401);
		const secret = process.env.RAZORPAY_KEY_SECRET;
		const hmac = crypto.createHmac("sha256", secret);
		hmac.update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`);
		if (hmac.digest("hex") !== data.razorpaySignature) return errorResponse("Payment verification failed", "Invalid signature", 400);
		const order = await db.order.update({
			where: { id: data.orderId },
			data: {
				razorpayPaymentId: data.razorpayPaymentId,
				razorpaySignature: data.razorpaySignature,
				status: "processing"
			},
			include: {
				items: true,
				prescriptionFiles: true,
				itemVerifications: true,
				address: true,
				user: { select: {
					id: true,
					name: true,
					email: true
				} }
			}
		});
		if (order.hasRx && order.prescriptionStatus === "pending") await db.order.update({
			where: { id: data.orderId },
			data: { status: "under_review" }
		});
		if (!order.hasRx || order.prescriptionStatus === "verified") tryCreateShiprocketShipment(order.id).catch(console.error);
		return successResponse("Payment verified successfully", order);
	} catch (error) {
		console.error(error);
		return errorResponse("Payment verification error", error.message);
	}
});
//#endregion
export { createOrderFn_createServerFn_handler, getOrderByIdFn_createServerFn_handler, getOrdersFn_createServerFn_handler, toggleItemVerificationFn_createServerFn_handler, updateOrderStatusFn_createServerFn_handler, verifyPaymentFn_createServerFn_handler };
