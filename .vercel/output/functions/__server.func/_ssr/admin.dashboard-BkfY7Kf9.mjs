import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard-BkfY7Kf9.js
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter = () => import("./admin.dashboard-CovYIl60.mjs");
var Route = createFileRoute("/admin/dashboard")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
function StatusPill({ status, rx }) {
	if (rx === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground",
		children: "Pending review"
	});
	if (rx === "rejected") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive",
		children: "Rejected"
	});
	if (rx === "verified") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success",
		children: "Verified"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary",
		children: status.replace("_", " ")
	});
}
//#endregion
export { StatusPill as n, Route as t };
