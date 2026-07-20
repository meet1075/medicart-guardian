import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { b as Pill } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MedicineVisual-DlBRNEbM.js
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_ACCENT = "#2563eb";
function MedicineVisual({ medicine, size = "md" }) {
	const Icon = Pill;
	const dim = size === "lg" ? "h-40" : size === "sm" ? "h-20" : "h-32";
	const iconSize = size === "lg" ? 56 : size === "sm" ? 28 : 40;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${dim} w-full rounded-lg flex items-center justify-center relative overflow-hidden`,
		style: { background: `linear-gradient(135deg, ${DEFAULT_ACCENT}15, ${DEFAULT_ACCENT}05)` },
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20",
				style: { background: DEFAULT_ACCENT }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -left-4 -bottom-4 h-16 w-16 rounded-full opacity-10",
				style: { background: DEFAULT_ACCENT }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				size: iconSize,
				style: { color: DEFAULT_ACCENT },
				strokeWidth: 1.5
			}),
			size !== "sm" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-2 left-3 text-[10px] font-medium uppercase tracking-wider text-foreground/50",
				children: medicine.dosageForm
			})
		]
	});
}
//#endregion
export { MedicineVisual as t };
