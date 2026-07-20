import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Pen, s as Trash2, t as X, v as Search, y as Plus } from "../_libs/lucide-react.mjs";
import { t as useMedicines } from "./use-medicines-XsigtTxu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard.medicines-qhubeVrT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MedicinesAdminPage() {
	const { medicines, isLoading, deleteMedicine, createMedicine, updateMedicine, isCreating, isUpdating } = useMedicines();
	const [q, setQ] = (0, import_react.useState)("");
	const [editingMedicine, setEditingMedicine] = (0, import_react.useState)(null);
	const [isAdding, setIsAdding] = (0, import_react.useState)(false);
	const filteredMedicines = medicines.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()) || m.salt.toLowerCase().includes(q.toLowerCase()) || m.id.toLowerCase().includes(q.toLowerCase()));
	async function handleDelete(id) {
		if (confirm("Are you sure you want to delete this medicine?")) try {
			await deleteMedicine(id);
			toast.success("Medicine deleted successfully");
		} catch (e) {
			toast.error("Failed to delete medicine");
		}
	}
	function handleEdit(m) {
		setEditingMedicine(m);
		setIsAdding(false);
	}
	function handleAddNew() {
		setEditingMedicine(null);
		setIsAdding(true);
	}
	function closeEditor() {
		setEditingMedicine(null);
		setIsAdding(false);
	}
	async function handleSubmit(data) {
		try {
			if (isAdding) {
				await createMedicine(data);
				toast.success("Medicine created successfully");
			} else if (editingMedicine) {
				await updateMedicine({
					id: editingMedicine.id,
					data
				});
				toast.success("Medicine updated successfully");
			}
			closeEditor();
		} catch (e) {
			toast.error(e.message || "Failed to save medicine");
		}
	}
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-10 text-center text-muted-foreground animate-pulse",
		children: "Loading medicines..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold",
					children: "Medicines"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Manage your product catalog."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleAddNew,
					className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 }), " Add Medicine"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2 focus-within:border-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					size: 18,
					className: "text-muted-foreground"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search by name, salt, or ID...",
					className: "flex-1 bg-transparent text-sm outline-none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-border bg-surface-muted/50 text-xs uppercase text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-semibold",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-semibold",
									children: "MRP"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-semibold",
									children: "Stock"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right font-semibold",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-border",
							children: [filteredMedicines.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-surface-muted/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold",
												children: m.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: m.salt
											}),
											m.prescriptionRequired && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 inline-block rounded border border-warning/30 bg-warning/10 px-1 text-[10px] font-bold text-warning-foreground",
												children: "Rx Required"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 font-semibold",
										children: ["₹", m.mrp.toFixed(2)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2 w-2 rounded-full ${m.inStock ? "bg-success" : "bg-destructive"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.inStock ? "In Stock" : "Out of stock" })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleEdit(m),
												className: "rounded p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { size: 16 })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleDelete(m.id),
												className: "rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 })
											})]
										})
									})
								]
							}, m.id)), filteredMedicines.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 5,
								className: "px-4 py-8 text-center text-sm text-muted-foreground",
								children: "No medicines found."
							}) })]
						})]
					})
				})
			}),
			(isAdding || editingMedicine) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MedicineEditorModal, {
				medicine: editingMedicine,
				onClose: closeEditor,
				onSubmit: handleSubmit,
				isSaving: isCreating || isUpdating
			})
		]
	});
}
function MedicineEditorModal({ medicine, onClose, onSubmit, isSaving }) {
	const [formData, setFormData] = (0, import_react.useState)({
		name: medicine?.name || "",
		salt: medicine?.salt || "",
		brand: medicine?.brand || "",
		mrp: medicine?.mrp || 0,
		packSize: medicine?.packSize || "",
		dosageForm: medicine?.dosageForm || "",
		prescriptionRequired: medicine?.prescriptionRequired || false,
		inStock: medicine?.inStock ?? true
	});
	function handleChange(e) {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? e.target.checked : type === "number" ? parseFloat(value) || 0 : value
		}));
	}
	function handleSave(e) {
		e.preventDefault();
		onSubmit(formData);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-border bg-surface shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold",
						children: medicine ? "Edit Medicine" : "Add New Medicine"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-md p-1 hover:bg-surface-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						id: "medicine-form",
						onSubmit: handleSave,
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-semibold text-muted-foreground",
									children: "Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									name: "name",
									value: formData.name,
									onChange: handleChange,
									className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-semibold text-muted-foreground",
									children: "Salt / Active Ingredients"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									name: "salt",
									value: formData.salt,
									onChange: handleChange,
									className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-semibold text-muted-foreground",
								children: "Brand"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								name: "brand",
								value: formData.brand,
								onChange: handleChange,
								className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-semibold text-muted-foreground",
								children: "Dosage Form"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								name: "dosageForm",
								value: formData.dosageForm,
								onChange: handleChange,
								placeholder: "e.g. Tablet, Syrup",
								className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-semibold text-muted-foreground",
								children: "MRP (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								step: "0.01",
								name: "mrp",
								value: formData.mrp,
								onChange: handleChange,
								className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-semibold text-muted-foreground",
								children: "Pack Size"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								name: "packSize",
								value: formData.packSize,
								onChange: handleChange,
								placeholder: "e.g. 10 Tablets",
								className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									id: "rxReq",
									name: "prescriptionRequired",
									checked: formData.prescriptionRequired,
									onChange: handleChange,
									className: "accent-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "rxReq",
									className: "text-sm font-semibold",
									children: "Prescription Required"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									id: "inStock",
									name: "inStock",
									checked: formData.inStock,
									onChange: handleChange,
									className: "accent-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "inStock",
									className: "text-sm font-semibold",
									children: "In Stock"
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-3 border-t border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-surface-muted",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						form: "medicine-form",
						disabled: isSaving,
						className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
						children: isSaving ? "Saving..." : "Save Medicine"
					})]
				})
			]
		})
	});
}
//#endregion
export { MedicinesAdminPage as component };
