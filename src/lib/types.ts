export type Category =
  | "prescription"
  | "otc"
  | "skincare"
  | "vitamins"
  | "babycare"
  | "devices";

export type HealthConcern =
  | "diabetes"
  | "cardiac"
  | "skin"
  | "pain"
  | "cold"
  | "digestion";

export interface Medicine {
  id: string;
  name: string;
  salt: string;
  brand: string;
  manufacturer: string;
  category: Category;
  healthConcern: HealthConcern[];
  price: number;
  mrp: number;
  packSize: string;
  dosageForm: string;
  prescriptionRequired: boolean;
  uses: string;
  howToUse: string;
  sideEffects: string;
  safety: string;
  accent: string; // token color for card visual
  substitutes?: string[]; // ids
  inStock?: boolean;
}

export interface CartItem {
  medicineId: string;
  qty: number;
}

export interface PrescriptionExtraction {
  doctorName?: string;
  patientName?: string;
  medicines: { name: string; dosage?: string }[];
  raw?: string;
}

export interface PrescriptionFile {
  id: string;
  name: string;
  mimeType: string;
  dataUrl: string;
  extraction?: PrescriptionExtraction;
  extracting?: boolean;
  error?: string;
}

export interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: "Home" | "Work";
  deliverySlot: "standard" | "express";
}

export type MatchStatus = "matched" | "possible" | "not_found";

export interface ItemVerification {
  medicineId: string;
  aiStatus: MatchStatus;
  pharmacistApproved: boolean;
}

export type OrderStatus =
  | "placed"
  | "under_review"
  | "verified"
  | "action_needed"
  | "processing"
  | "shipped"
  | "delivered";

export type PrescriptionStatus = "pending" | "verified" | "rejected";

export interface Order {
  id: string;
  createdAt: number;
  items: {
    medicineId: string;
    name: string;
    salt: string;
    qty: number;
    price: number;
    dosageForm: string;
    prescriptionRequired: boolean;
  }[];
  subtotal: number;
  delivery: number;
  total: number;
  hasRx: boolean;
  prescriptionFiles: PrescriptionFile[];
  address: Address;
  paymentMethod: "card" | "upi" | "cod";
  status: OrderStatus;
  prescriptionStatus?: PrescriptionStatus;
  rejectReason?: string;
  itemVerification: ItemVerification[];
  reviewedBy?: string;
  reviewedAt?: number;
}
