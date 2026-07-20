//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-BtG4vr6A.js
var manifest = {
	"071dced2ba76644e673fc2283da6bc62dfd4950418ce77fe9a2aa9e2aa079f6d": {
		functionName: "scheduleShipmentPickupFn_createServerFn_handler",
		importer: () => import("./_ssr/shiprocket.api-TeOSsld8.mjs")
	},
	"2f3b73addd7b3a4277ea105a58fa85658c4870efd306c67a485c7d4b498f18e8": {
		functionName: "getMedicinesFn_createServerFn_handler",
		importer: () => import("./_ssr/medicines-CphEFBrl.mjs")
	},
	"3897b7d6e3fcc3a3bab995b19898a5de948b47015cd16b77e47fce2a7410ae6f": {
		functionName: "generateShipmentAwbFn_createServerFn_handler",
		importer: () => import("./_ssr/shiprocket.api-TeOSsld8.mjs")
	},
	"3d2d0dc277d2afe331a13cbc39133b97794e4571196c0f1c5872dc5d94f3e101": {
		functionName: "toggleItemVerificationFn_createServerFn_handler",
		importer: () => import("./_ssr/orders-DisgbviF.mjs")
	},
	"5c8eea6f9c83fbb2dbaf315f8c04587c61629cc285c42aea54a2f10c67322fbb": {
		functionName: "createOrderFn_createServerFn_handler",
		importer: () => import("./_ssr/orders-DisgbviF.mjs")
	},
	"65c5cf8336103188f70f758fef547d90a5940dc67d3e708bbb836a744ae43aa4": {
		functionName: "getMedicineByIdFn_createServerFn_handler",
		importer: () => import("./_ssr/medicines-CphEFBrl.mjs")
	},
	"6fd842065327fb4267e80aadd4664a1b4b2dc0beda13e7d74e265684696bdc56": {
		functionName: "extractPrescription_createServerFn_handler",
		importer: () => import("./_ssr/prescription.functions-Dz0rurpH.mjs")
	},
	"8510250d0169daf97baaafc39bd2900f0435eddb53bfd3e1d08728d71f7be5db": {
		functionName: "updateMedicineFn_createServerFn_handler",
		importer: () => import("./_ssr/medicines-CphEFBrl.mjs")
	},
	"89267533749e533bf58e5e722665acfc23f42f117ecedd337877f6281ab71082": {
		functionName: "getOrdersFn_createServerFn_handler",
		importer: () => import("./_ssr/orders-DisgbviF.mjs")
	},
	"937d1d2ecc5ddb535a21b06d17309c710c34ef9fa607bb8368cb206bbbae3268": {
		functionName: "verifyPaymentFn_createServerFn_handler",
		importer: () => import("./_ssr/orders-DisgbviF.mjs")
	},
	"966ba1498e4a33b60fc5134952749c3dfeb070d42121ad82f67bd5a05afafe99": {
		functionName: "updateUserRoleFn_createServerFn_handler",
		importer: () => import("./_ssr/users-CJeotTuJ.mjs")
	},
	"a0556ec3785d8273b5b1a36343f4dfdaad36851f54785d8b248489992994d896": {
		functionName: "deleteMedicineFn_createServerFn_handler",
		importer: () => import("./_ssr/medicines-CphEFBrl.mjs")
	},
	"b2285bf707d43b52e38f804495c12b475c29c9e72468af5fd2b1f1409ea8cec1": {
		functionName: "createMedicineFn_createServerFn_handler",
		importer: () => import("./_ssr/medicines-CphEFBrl.mjs")
	},
	"cf331f29a2929f4f3e66b6e81f83aa68d78d54721506eac4ea9b05c66d1fedda": {
		functionName: "retryShipmentCreationFn_createServerFn_handler",
		importer: () => import("./_ssr/shiprocket.api-TeOSsld8.mjs")
	},
	"e001c6774c5b1c1a19e4612727f04bd04fdb4e5715ff42f7957b1d5cd7f9fa52": {
		functionName: "getOrderByIdFn_createServerFn_handler",
		importer: () => import("./_ssr/orders-DisgbviF.mjs")
	},
	"f0ab8ac61429c5e6c887bfd38d2091a9f0ca0b938e58d0169062a8013b177776": {
		functionName: "updateOrderStatusFn_createServerFn_handler",
		importer: () => import("./_ssr/orders-DisgbviF.mjs")
	},
	"f24f20ce9df5ac7d76933babae8293b89929eeff50c46da620e01993809575c6": {
		functionName: "getUsersFn_createServerFn_handler",
		importer: () => import("./_ssr/users-CJeotTuJ.mjs")
	},
	"f522d5206dbefc94092264b6c6f70e8c13c3ce50131704efcf95d20ba0d9c796": {
		functionName: "cancelShiprocketShipmentFn_createServerFn_handler",
		importer: () => import("./_ssr/shiprocket.api-TeOSsld8.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
