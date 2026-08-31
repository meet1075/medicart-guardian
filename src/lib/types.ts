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
  mrp: number;
  packSize: string;
  dosageForm: string;
  prescriptionRequired: boolean;
  moq: number;
  inStock?: boolean;
  imageUrl?: string | null;
}

export interface CartItem {
  medicineId: string;
  qty: number;
  name?: string;
  salt?: string;
  mrp?: number;
  dosageForm?: string;
  prescriptionRequired?: boolean;
  moq?: number;
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
  paymentMethod: "card" | "upi";
  status: OrderStatus;
  prescriptionStatus?: PrescriptionStatus;
  rejectReason?: string;
  itemVerification: ItemVerification[];
  reviewedBy?: string;
  reviewedAt?: number;
}
