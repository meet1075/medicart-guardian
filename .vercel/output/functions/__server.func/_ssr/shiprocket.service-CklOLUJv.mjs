//#region node_modules/.nitro/vite/services/ssr/assets/shiprocket.service-CklOLUJv.js
var cachedToken = null;
var tokenExpiry = null;
/**
* Gets a valid Shiprocket auth token.
*/
async function getShiprocketToken() {
	if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) return cachedToken;
	const email = process.env.SHIPROCKET_EMAIL;
	const password = process.env.SHIPROCKET_PASSWORD;
	if (!email || !password) {
		console.warn("⚠️ Shiprocket credentials missing. Running in DEMO MOCK mode.");
		return "MOCK_TOKEN_123";
	}
	const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email,
			password
		})
	});
	if (!response.ok) {
		const errText = await response.text();
		console.error("Shiprocket Auth Error:", errText);
		throw new Error("Failed to authenticate with Shiprocket");
	}
	cachedToken = (await response.json()).token;
	tokenExpiry = Date.now() + 12960 * 60 * 1e3;
	return cachedToken;
}
/**
* Creates a custom order/shipment in Shiprocket.
* Returns the parsed JSON response which includes `shipment_id` and `order_id`.
*/
async function createShiprocketOrder(order) {
	const token = await getShiprocketToken();
	const [firstName, ...lastNameParts] = order.address.fullName.split(" ");
	const lastName = lastNameParts.join(" ") || firstName;
	const payload = {
		order_id: order.id,
		order_date: new Date(order.createdAt).toISOString().split("T")[0],
		pickup_location: "Primary",
		billing_customer_name: firstName,
		billing_last_name: lastName,
		billing_address: order.address.line1,
		billing_address_2: order.address.line2 || "",
		billing_city: order.address.city,
		billing_pincode: order.address.pincode,
		billing_state: order.address.state,
		billing_country: "India",
		billing_email: order.user?.email || "customer@example.com",
		billing_phone: order.address.phone,
		shipping_is_billing: true,
		order_items: order.items.map((item) => ({
			name: item.name,
			sku: item.medicineId,
			units: item.qty,
			selling_price: item.price,
			discount: 0
		})),
		payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
		sub_total: order.total,
		length: 10,
		breadth: 10,
		height: 10,
		weight: .5
	};
	if (token === "MOCK_TOKEN_123") return {
		order_id: `mock_order_${Date.now()}`,
		shipment_id: `mock_shipment_${Date.now()}`,
		status: "NEW",
		status_code: 1,
		awb_code: "",
		courier_company_id: "",
		courier_name: ""
	};
	const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(payload)
	});
	if (!response.ok) {
		const errText = await response.text();
		console.error("Shiprocket Create Order Error:", errText);
		throw new Error(`Failed to create shipment in Shiprocket: ${errText}`);
	}
	return response.json();
}
/**
* Generates an AWB for an existing shipment.
*/
async function generateAWB(shipmentId) {
	const token = await getShiprocketToken();
	if (token === "MOCK_TOKEN_123") return {
		awb_assign_status: 1,
		response: { data: {
			awb_code: `AWB${Math.floor(Math.random() * 1e8)}IN`,
			applied_weight: .5,
			company_id: 12345,
			courier_company_id: 1,
			courier_name: "BlueDart Demo"
		} }
	};
	const response = await fetch("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ shipment_id: shipmentId })
	});
	if (!response.ok) {
		const errText = await response.text();
		throw new Error(`Failed to generate AWB: ${errText}`);
	}
	return response.json();
}
/**
* Schedules a pickup for the shipment.
*/
async function schedulePickup(shipmentId) {
	const token = await getShiprocketToken();
	if (token === "MOCK_TOKEN_123") return {
		pickup_status: 1,
		response: { pickup_scheduled_date: (/* @__PURE__ */ new Date()).toISOString() }
	};
	const response = await fetch("https://apiv2.shiprocket.in/v1/external/courier/generate/pickup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ shipment_id: [shipmentId] })
	});
	if (!response.ok) {
		const errText = await response.text();
		throw new Error(`Failed to schedule pickup: ${errText}`);
	}
	return response.json();
}
/**
* Cancels a shipment by AWB.
*/
async function cancelShipment(awbs) {
	const token = await getShiprocketToken();
	if (token === "MOCK_TOKEN_123") return {
		status: 200,
		message: "Mock shipment cancelled successfully"
	};
	const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/cancel/awb", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ awbs })
	});
	if (!response.ok) {
		const errText = await response.text();
		throw new Error(`Failed to cancel shipment: ${errText}`);
	}
	return response.json();
}
//#endregion
export { schedulePickup as i, createShiprocketOrder as n, generateAWB as r, cancelShipment as t };
