import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DhPtNZlM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MEDICINES = [
	{
		id: "dolo-650",
		name: "Dolo 650",
		salt: "Paracetamol 650mg",
		brand: "Dolo",
		mrp: 34.5,
		packSize: "Strip of 15 tablets",
		dosageForm: "Tablet",
		prescriptionRequired: false
	},
	{
		id: "azithral-500",
		name: "Azithral 500",
		salt: "Azithromycin 500mg",
		brand: "Azithral",
		mrp: 108,
		packSize: "Strip of 5 tablets",
		dosageForm: "Tablet",
		prescriptionRequired: true
	},
	{
		id: "metformin-500",
		name: "Glycomet 500",
		salt: "Metformin 500mg",
		brand: "Glycomet",
		mrp: 28,
		packSize: "Strip of 20 tablets",
		dosageForm: "Tablet",
		prescriptionRequired: true
	},
	{
		id: "telma-40",
		name: "Telma 40",
		salt: "Telmisartan 40mg",
		brand: "Telma",
		mrp: 175,
		packSize: "Strip of 15 tablets",
		dosageForm: "Tablet",
		prescriptionRequired: true
	},
	{
		id: "atorva-10",
		name: "Atorva 10",
		salt: "Atorvastatin 10mg",
		brand: "Atorva",
		mrp: 92,
		packSize: "Strip of 15 tablets",
		dosageForm: "Tablet",
		prescriptionRequired: true
	},
	{
		id: "cetzine",
		name: "Cetzine",
		salt: "Cetirizine 10mg",
		brand: "Cetzine",
		mrp: 48,
		packSize: "Strip of 10 tablets",
		dosageForm: "Tablet",
		prescriptionRequired: false
	},
	{
		id: "vicks-vaporub",
		name: "Vicks VapoRub",
		salt: "Camphor + Menthol + Eucalyptus Oil",
		brand: "Vicks",
		mrp: 120,
		packSize: "50g jar",
		dosageForm: "Topical Ointment",
		prescriptionRequired: false
	},
	{
		id: "shelcal-500",
		name: "Shelcal 500",
		salt: "Calcium Carbonate + Vitamin D3",
		brand: "Shelcal",
		mrp: 195,
		packSize: "Strip of 15 tablets",
		dosageForm: "Tablet",
		prescriptionRequired: false
	},
	{
		id: "revital-h",
		name: "Revital H",
		salt: "Multivitamin + Multimineral + Ginseng",
		brand: "Revital",
		mrp: 340,
		packSize: "Bottle of 30 capsules",
		dosageForm: "Capsule",
		prescriptionRequired: false
	},
	{
		id: "cetaphil-cleanser",
		name: "Cetaphil Gentle Skin Cleanser",
		salt: "Non-soap surfactant blend",
		brand: "Cetaphil",
		mrp: 499,
		packSize: "250ml bottle",
		dosageForm: "Liquid Cleanser",
		prescriptionRequired: false
	},
	{
		id: "himalaya-baby-lotion",
		name: "Himalaya Baby Lotion",
		salt: "Olive oil + Almond oil",
		brand: "Himalaya",
		mrp: 200,
		packSize: "200ml bottle",
		dosageForm: "Lotion",
		prescriptionRequired: false
	},
	{
		id: "bp-monitor",
		name: "Omron HEM-7120 BP Monitor",
		salt: "Digital blood pressure monitor",
		brand: "Omron",
		mrp: 2299,
		packSize: "1 device with cuff",
		dosageForm: "Device",
		prescriptionRequired: false
	},
	{
		id: "glucometer",
		name: "Accu-Chek Active Glucometer",
		salt: "Blood glucose meter kit",
		brand: "Accu-Chek",
		mrp: 1650,
		packSize: "1 meter + 10 strips",
		dosageForm: "Device",
		prescriptionRequired: false
	},
	{
		id: "pan-40",
		name: "Pan 40",
		salt: "Pantoprazole 40mg",
		brand: "Pan",
		mrp: 138,
		packSize: "Strip of 15 tablets",
		dosageForm: "Tablet",
		prescriptionRequired: true
	},
	{
		id: "crocin-cold-flu",
		name: "Crocin Cold & Flu Max",
		salt: "Paracetamol + Phenylephrine + Caffeine",
		brand: "Crocin",
		mrp: 78,
		packSize: "Strip of 10 tablets",
		dosageForm: "Tablet",
		prescriptionRequired: false
	},
	{
		id: "moov-cream",
		name: "Moov Pain Relief Cream",
		salt: "Diclofenac + Methyl salicylate + Menthol",
		brand: "Moov",
		mrp: 165,
		packSize: "50g tube",
		dosageForm: "Topical Cream",
		prescriptionRequired: false
	}
];
function getMedicine(id) {
	return MEDICINES.find((m) => m.id === id);
}
function normalize(s) {
	return s.toLowerCase().replace(/\d+\s*(mg|mcg|ml|g)\b/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function tokens(s) {
	return normalize(s).split(" ").filter((t) => t.length >= 3);
}
function similarity(a, b) {
	if (a === b) return 1;
	if (!a || !b) return 0;
	const m = a.length, n = b.length;
	const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
	for (let i = 0; i <= m; i++) dp[i][0] = i;
	for (let j = 0; j <= n; j++) dp[0][j] = j;
	for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
	return 1 - dp[m][n] / Math.max(m, n);
}
/**
* Compare a single cart medicine (name/salt/brand) against the list of medicines
* extracted from the prescription image. Returns a MatchStatus.
*/
function compareMedicine(cart, extracted) {
	const targets = [
		cart.name,
		cart.salt,
		cart.brand
	].flatMap((s) => [s, ...tokens(s)]).map((s) => normalize(s)).filter(Boolean);
	let best = 0;
	for (const e of extracted) {
		const eNorm = normalize(e.name);
		const eTokens = tokens(e.name);
		for (const t of targets) {
			const s1 = similarity(t, eNorm);
			if (s1 > best) best = s1;
			for (const et of eTokens) {
				const s2 = similarity(t, et);
				if (s2 > best) best = s2;
			}
			if (t.length >= 4 && (eNorm.includes(t) || t.includes(eNorm))) best = Math.max(best, .9);
		}
	}
	if (best >= .85) return "matched";
	if (best >= .6) return "possible";
	return "not_found";
}
/**
* A tiny inline SVG that looks like a printed prescription slip.
* Using SVG keeps the payload tiny (< 2 KB) versus a real image base64 (> 100 KB).
*/
var DEMO_PRESCRIPTION_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" font-family="Georgia,serif">
  <!-- background -->
  <rect width="600" height="420" fill="#fafaf8" rx="8"/>
  <!-- header bar -->
  <rect width="600" height="80" fill="#1a3a5c" rx="8"/>
  <rect y="70" width="600" height="10" fill="#1a3a5c"/>
  <!-- hospital name -->
  <text x="30" y="35" font-size="22" font-weight="bold" fill="white">City General Hospital</text>
  <text x="30" y="58" font-size="13" fill="#a0bcd4">Dept. of Internal Medicine  ·  Dr. S. Rao, MBBS MD</text>
  <text x="470" y="40" font-size="11" fill="#a0bcd4">Reg No: MCI/2019/04821</text>
  <text x="470" y="56" font-size="11" fill="#a0bcd4">Ph: 080-4567-8901</text>
  <!-- Rx symbol -->
  <text x="30" y="120" font-size="36" font-weight="bold" fill="#1a3a5c">℞</text>
  <!-- date / patient -->
  <text x="90" y="105" font-size="12" fill="#555">Date: 05-Jul-2026</text>
  <text x="90" y="122" font-size="13" font-weight="bold" fill="#111">Patient: Ravi Kumar Sharma</text>
  <text x="90" y="139" font-size="12" fill="#555">Age: 42 yrs  ·  M  ·  Wt: 74 kg</text>
  <!-- divider -->
  <line x1="30" y1="155" x2="570" y2="155" stroke="#ccc" stroke-width="1" stroke-dasharray="4 3"/>
  <!-- medicines -->
  <text x="30" y="180" font-size="13" font-weight="bold" fill="#1a3a5c">1. Azithral 500 mg</text>
  <text x="50" y="197" font-size="12" fill="#333">  1 tablet once daily × 5 days (after food)</text>
  <text x="30" y="222" font-size="13" font-weight="bold" fill="#1a3a5c">2. Glycomet 500 mg (Metformin)</text>
  <text x="50" y="239" font-size="12" fill="#333">  1 tablet twice daily with meals × 30 days</text>
  <text x="30" y="264" font-size="13" font-weight="bold" fill="#1a3a5c">3. Pan 40 (Pantoprazole)</text>
  <text x="50" y="281" font-size="12" fill="#333">  1 tablet 30 min before breakfast × 14 days</text>
  <!-- divider -->
  <line x1="30" y1="300" x2="570" y2="300" stroke="#ccc" stroke-width="1" stroke-dasharray="4 3"/>
  <!-- advice -->
  <text x="30" y="320" font-size="11" fill="#666">Advice: Plenty of fluids. Monitor blood sugar daily. Follow-up in 2 weeks.</text>
  <!-- signature -->
  <text x="390" y="370" font-size="13" font-style="italic" fill="#1a3a5c">Dr. Suresh Rao</text>
  <line x1="370" y1="380" x2="570" y2="380" stroke="#1a3a5c" stroke-width="1"/>
  <text x="390" y="395" font-size="11" fill="#555">Signature &amp; Stamp</text>
  <!-- stamp circle -->
  <circle cx="80" cy="370" r="38" fill="none" stroke="#1a3a5c" stroke-width="2"/>
  <text x="80" y="360" font-size="9" text-anchor="middle" fill="#1a3a5c">CITY GENERAL</text>
  <text x="80" y="372" font-size="9" text-anchor="middle" fill="#1a3a5c">HOSPITAL</text>
  <text x="80" y="384" font-size="9" text-anchor="middle" fill="#1a3a5c">BANGALORE</text>
</svg>
`)}`;
var DEMO_ORDER_ID = "MCDEMO001";
var DEMO_SEED_FLAG = "medicart.demo-seeded.v1";
function buildDemoOrder() {
	return {
		id: DEMO_ORDER_ID,
		createdAt: Date.now() - 1e3 * 60 * 18,
		items: [
			{
				medicineId: "azithral-500",
				name: "Azithral 500",
				salt: "Azithromycin 500mg",
				qty: 1,
				price: 92,
				dosageForm: "Tablet",
				prescriptionRequired: true
			},
			{
				medicineId: "metformin-500",
				name: "Glycomet 500",
				salt: "Metformin 500mg",
				qty: 2,
				price: 24,
				dosageForm: "Tablet",
				prescriptionRequired: true
			},
			{
				medicineId: "pan-40",
				name: "Pan 40",
				salt: "Pantoprazole 40mg",
				qty: 1,
				price: 118,
				dosageForm: "Tablet",
				prescriptionRequired: true
			}
		],
		subtotal: 258,
		delivery: 0,
		total: 258,
		hasRx: true,
		prescriptionFiles: [{
			id: "demo-file-1",
			name: "prescription_05jul2026.svg",
			mimeType: "image/svg+xml",
			dataUrl: DEMO_PRESCRIPTION_SVG,
			extraction: {
				doctorName: "Dr. Suresh Rao",
				patientName: "Ravi Kumar Sharma",
				medicines: [
					{
						name: "Azithral 500",
						dosage: "1 tablet once daily × 5 days"
					},
					{
						name: "Glycomet 500 (Metformin)",
						dosage: "1 tablet twice daily × 30 days"
					},
					{
						name: "Pan 40 (Pantoprazole)",
						dosage: "1 tablet 30 min before breakfast × 14 days"
					}
				]
			}
		}],
		address: {
			fullName: "Ravi Kumar Sharma",
			phone: "9876543210",
			line1: "12, MG Road",
			city: "Bangalore",
			state: "Karnataka",
			pincode: "560001",
			type: "Home",
			deliverySlot: "standard"
		},
		paymentMethod: "upi",
		status: "under_review",
		prescriptionStatus: "pending",
		itemVerification: [
			{
				medicineId: "azithral-500",
				aiStatus: "matched",
				pharmacistApproved: false
			},
			{
				medicineId: "metformin-500",
				aiStatus: "matched",
				pharmacistApproved: false
			},
			{
				medicineId: "pan-40",
				aiStatus: "possible",
				pharmacistApproved: false
			}
		]
	};
}
/**
* Returns true if this is the first time we're seeding demo data
* (i.e. the flag key doesn't exist in localStorage yet).
* Marks it as seeded so we don't inject duplicates on subsequent loads.
*/
function shouldSeedDemo() {
	if (typeof window === "undefined") return false;
	if (window.localStorage.getItem(DEMO_SEED_FLAG)) return false;
	window.localStorage.setItem(DEMO_SEED_FLAG, "1");
	return true;
}
var CART_KEY = "medicart.cart.v1";
var ORDERS_KEY = "medicart.orders.v1";
var ADDR_KEY = "medicart.addresses.v1";
var StoreCtx = (0, import_react.createContext)(null);
function loadJSON(k, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(k);
		if (!raw) return fallback;
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function saveJSON(k, v) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(k, JSON.stringify(v));
	} catch {}
}
function StoreProvider({ children }) {
	const [cart, setCart] = (0, import_react.useState)(() => loadJSON(CART_KEY, []));
	const [savedAddresses, setSavedAddresses] = (0, import_react.useState)(() => loadJSON(ADDR_KEY, []));
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [orders, setOrders] = (0, import_react.useState)(() => {
		const storedOrders = loadJSON(ORDERS_KEY, []);
		if (shouldSeedDemo()) return [buildDemoOrder(), ...storedOrders];
		return storedOrders;
	});
	(0, import_react.useEffect)(() => {
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (hydrated) saveJSON(CART_KEY, cart);
	}, [cart, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		saveJSON(ORDERS_KEY, orders.map((o) => ({
			...o,
			prescriptionFiles: o.prescriptionFiles.map((f) => ({
				...f,
				dataUrl: f.mimeType === "image/svg+xml" || f.dataUrl.length < 5e4 ? f.dataUrl : "[file-too-large-for-storage]"
			}))
		})));
	}, [orders, hydrated]);
	(0, import_react.useEffect)(() => {
		if (hydrated) saveJSON(ADDR_KEY, savedAddresses);
	}, [savedAddresses, hydrated]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const onStorage = (e) => {
			if (e.key === ORDERS_KEY) setOrders(loadJSON(ORDERS_KEY, []));
			if (e.key === CART_KEY) setCart(loadJSON(CART_KEY, []));
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);
	const addToCart = (0, import_react.useCallback)((medicineId, qty = 1) => {
		setCart((prev) => {
			if (prev.find((c) => c.medicineId === medicineId)) return prev.map((c) => c.medicineId === medicineId ? {
				...c,
				qty: c.qty + qty
			} : c);
			return [...prev, {
				medicineId,
				qty
			}];
		});
	}, []);
	const updateQty = (0, import_react.useCallback)((medicineId, qty) => {
		setCart((prev) => qty <= 0 ? prev.filter((c) => c.medicineId !== medicineId) : prev.map((c) => c.medicineId === medicineId ? {
			...c,
			qty
		} : c));
	}, []);
	const removeFromCart = (0, import_react.useCallback)((medicineId) => {
		setCart((prev) => prev.filter((c) => c.medicineId !== medicineId));
	}, []);
	const clearCart = (0, import_react.useCallback)(() => setCart([]), []);
	const saveAddress = (0, import_react.useCallback)((a) => {
		setSavedAddresses((prev) => [a, ...prev.filter((p) => p.pincode !== a.pincode || p.line1 !== a.line1)].slice(0, 5));
	}, []);
	const value = {
		cart,
		addToCart,
		updateQty,
		removeFromCart,
		clearCart,
		cartCount: (0, import_react.useMemo)(() => cart.reduce((n, c) => n + c.qty, 0), [cart]),
		cartHasRx: (0, import_react.useMemo)(() => cart.some((c) => getMedicine(c.medicineId)?.prescriptionRequired), [cart]),
		savedAddresses,
		saveAddress,
		orders,
		createOrder: (0, import_react.useCallback)(({ prescriptionFiles, address, paymentMethod }) => {
			const items = cart.map((c) => {
				const m = getMedicine(c.medicineId);
				if (!m) return null;
				return {
					medicineId: m.id,
					name: m.name,
					salt: m.salt,
					qty: c.qty,
					price: m.mrp,
					dosageForm: m.dosageForm,
					prescriptionRequired: m.prescriptionRequired
				};
			}).filter(Boolean);
			const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
			const delivery = address.deliverySlot === "express" ? 79 : subtotal > 499 ? 0 : 39;
			const hasRx = items.some((i) => i.prescriptionRequired);
			const extracted = prescriptionFiles.flatMap((f) => f.extraction?.medicines ?? []);
			const itemVerification = items.filter((i) => i.prescriptionRequired).map((i) => {
				const m = getMedicine(i.medicineId);
				const aiStatus = extracted.length ? compareMedicine({
					name: m.name,
					salt: m.salt,
					brand: m.brand
				}, extracted) : "not_found";
				return {
					medicineId: i.medicineId,
					aiStatus,
					pharmacistApproved: false
				};
			});
			const status = hasRx ? "under_review" : "processing";
			const prescriptionStatus = hasRx ? "pending" : void 0;
			const order = {
				id: "MC" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 900 + 100),
				createdAt: Date.now(),
				items,
				subtotal,
				delivery,
				total: subtotal + delivery,
				hasRx,
				prescriptionFiles,
				address,
				paymentMethod,
				status,
				prescriptionStatus,
				itemVerification
			};
			setOrders((prev) => [order, ...prev]);
			return order;
		}, [cart]),
		updatePrescriptionOnOrder: (0, import_react.useCallback)((orderId, files) => {
			setOrders((prev) => prev.map((o) => {
				if (o.id !== orderId) return o;
				const extracted = files.flatMap((f) => f.extraction?.medicines ?? []);
				const itemVerification = o.items.filter((i) => i.prescriptionRequired).map((i) => {
					const m = getMedicine(i.medicineId);
					const aiStatus = m && extracted.length ? compareMedicine({
						name: m.name,
						salt: m.salt,
						brand: m.brand
					}, extracted) : "not_found";
					return {
						medicineId: i.medicineId,
						aiStatus,
						pharmacistApproved: false
					};
				});
				return {
					...o,
					prescriptionFiles: files,
					itemVerification,
					status: "under_review",
					prescriptionStatus: "pending",
					rejectReason: void 0
				};
			}));
		}, []),
		toggleItemVerified: (0, import_react.useCallback)((orderId, medicineId) => {
			setOrders((prev) => prev.map((o) => o.id === orderId ? {
				...o,
				itemVerification: o.itemVerification.map((v) => v.medicineId === medicineId ? {
					...v,
					pharmacistApproved: !v.pharmacistApproved
				} : v)
			} : o));
		}, []),
		approveOrder: (0, import_react.useCallback)((orderId, reviewer) => {
			setOrders((prev) => prev.map((o) => o.id === orderId ? {
				...o,
				status: "processing",
				prescriptionStatus: "verified",
				reviewedBy: reviewer,
				reviewedAt: Date.now(),
				rejectReason: void 0
			} : o));
		}, []),
		rejectOrder: (0, import_react.useCallback)((orderId, reviewer, reason) => {
			setOrders((prev) => prev.map((o) => o.id === orderId ? {
				...o,
				status: "action_needed",
				prescriptionStatus: "rejected",
				reviewedBy: reviewer,
				reviewedAt: Date.now(),
				rejectReason: reason
			} : o));
		}, []),
		storeHydrated: hydrated
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreCtx.Provider, {
		value,
		children
	});
}
function useStore() {
	const ctx = (0, import_react.useContext)(StoreCtx);
	if (!ctx) throw new Error("useStore must be used inside StoreProvider");
	return ctx;
}
//#endregion
export { compareMedicine as n, useStore as r, StoreProvider as t };
