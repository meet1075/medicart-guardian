import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useStore } from "./store-DhPtNZlM.mjs";
import { _ as string, m as object } from "../_libs/zod.mjs";
import { O as isRedirect, _ as useNavigate, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { V as FileText, Y as CircleCheck, h as ShieldCheck, i as Upload, j as LoaderCircle, s as Trash2 } from "../_libs/lucide-react.mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Dlr6sAwK.mjs";
import { t as CheckoutFrame } from "./CheckoutFrame-ohxPtQmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout.prescription-DpIuWBRc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var InputSchema = object({ dataUrl: string().min(20) });
/**
* Send a prescription image to a vision-capable LLM and extract structured info:
* doctor name, patient name, and a list of medicines with dosage. The result is a
* decision-support aid — always confirmed by a human pharmacist.
*/
var extractPrescription = createServerFn({ method: "POST" }).inputValidator((input) => InputSchema.parse(input)).handler(createSsrRpc("6fd842065327fb4267e80aadd4664a1b4b2dc0beda13e7d74e265684696bdc56"));
var PRESCRIPTION_KEY = "medicart.pending-prescription.v1";
function PrescriptionStep() {
	const { cartHasRx, cart } = useStore();
	const navigate = useNavigate();
	const [files, setFiles] = (0, import_react.useState)([]);
	const extractFn = useServerFn(extractPrescription);
	(0, import_react.useEffect)(() => {
		if (cart.length === 0) {
			navigate({
				to: "/cart",
				replace: true
			});
			return;
		}
		if (!cartHasRx) navigate({
			to: "/checkout/address",
			replace: true
		});
	}, [
		cartHasRx,
		cart.length,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		try {
			const raw = window.localStorage.getItem(PRESCRIPTION_KEY);
			if (raw) setFiles(JSON.parse(raw));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			window.localStorage.setItem(PRESCRIPTION_KEY, JSON.stringify(files));
		} catch {}
	}, [files]);
	async function handleFiles(fileList) {
		if (!fileList) return;
		for (const f of Array.from(fileList)) {
			if (f.size > 8 * 1024 * 1024) {
				toast.error(`${f.name} is too large (max 8 MB)`);
				continue;
			}
			const dataUrl = await new Promise((resolve, reject) => {
				const r = new FileReader();
				r.onload = () => resolve(r.result);
				r.onerror = () => reject(r.error);
				r.readAsDataURL(f);
			});
			const id = crypto.randomUUID();
			const entry = {
				id,
				name: f.name,
				mimeType: f.type || "image/jpeg",
				dataUrl,
				extracting: true
			};
			setFiles((prev) => [...prev, entry]);
			if (f.type.startsWith("image/")) try {
				const result = await extractFn({ data: { dataUrl } });
				setFiles((prev) => prev.map((p) => p.id === id ? {
					...p,
					extracting: false,
					extraction: {
						doctorName: result.doctorName,
						patientName: result.patientName,
						medicines: result.medicines,
						raw: result.raw
					}
				} : p));
			} catch (err) {
				console.error(err);
				setFiles((prev) => prev.map((p) => p.id === id ? {
					...p,
					extracting: false,
					error: "Could not analyze this image"
				} : p));
			}
			else setFiles((prev) => prev.map((p) => p.id === id ? {
				...p,
				extracting: false
			} : p));
		}
	}
	const canContinue = files.length > 0 && files.every((f) => !f.extracting);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckoutFrame, {
		current: "prescription",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl border border-border bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-foreground",
					children: "Upload your prescription"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Add clear photos or PDFs of your doctor's prescription. Multiple files welcome (e.g. multi-page Rx)."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background p-10 text-center transition-colors hover:border-primary hover:bg-primary-soft/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 20 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold text-foreground",
							children: "Drag files here or click to upload"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "JPG, PNG, or PDF · up to 8 MB each"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							multiple: true,
							accept: "image/*,application/pdf",
							onChange: (e) => handleFiles(e.target.files),
							className: "hidden"
						})
					]
				}),
				files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-3 sm:grid-cols-2",
					children: files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 rounded-lg border border-border bg-background p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-20 w-20 flex-none overflow-hidden rounded-md border border-border bg-surface-muted",
							children: f.mimeType.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: f.dataUrl,
								alt: f.name,
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-full w-full items-center justify-center text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 24 })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: f.name
								}),
								f.extracting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
										size: 12,
										className: "animate-spin"
									}), " Reading with AI…"]
								}) : f.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-destructive",
									children: f.error
								}) : f.extraction ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-xs text-success",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
											size: 12,
											className: "inline"
										}),
										" Uploaded ·",
										" ",
										f.extraction.medicines.length,
										" medicines detected"
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Uploaded"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setFiles((p) => p.filter((x) => x.id !== f.id)),
									className: "mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 }), " Remove"]
								})
							]
						})]
					}, f.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 rounded-lg border border-border bg-primary-soft/40 p-4 text-sm text-foreground/80",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
							size: 18,
							className: "mt-0.5 flex-none text-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-foreground",
							children: "Why we ask for this"
						}), "Our licensed pharmacist will verify this prescription against your order before it ships. This usually takes a few hours. Your prescription is stored securely and only used for dispensing your medicines."] })]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: !canContinue,
				onClick: () => navigate({ to: "/checkout/address" }),
				className: "rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary/90",
				children: "Continue to Address"
			})
		})]
	});
}
//#endregion
export { PrescriptionStep as component };
