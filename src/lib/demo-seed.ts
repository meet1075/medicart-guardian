import type { Order } from "./types";

/**
 * A tiny inline SVG that looks like a printed prescription slip.
 * Using SVG keeps the payload tiny (< 2 KB) versus a real image base64 (> 100 KB).
 */
const DEMO_PRESCRIPTION_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
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

export const DEMO_ORDER_ID = "MCDEMO001";
const DEMO_SEED_FLAG = "medicart.demo-seeded.v1";

export function buildDemoOrder(): Order {
  return {
    id: DEMO_ORDER_ID,
    createdAt: Date.now() - 1000 * 60 * 18, // 18 minutes ago
    items: [
      {
        medicineId: "azithral-500",
        name: "Azithral 500",
        salt: "Azithromycin 500mg",
        qty: 1,
        price: 92,
        dosageForm: "Tablet",
        prescriptionRequired: true,
      },
      {
        medicineId: "metformin-500",
        name: "Glycomet 500",
        salt: "Metformin 500mg",
        qty: 2,
        price: 24,
        dosageForm: "Tablet",
        prescriptionRequired: true,
      },
      {
        medicineId: "pan-40",
        name: "Pan 40",
        salt: "Pantoprazole 40mg",
        qty: 1,
        price: 118,
        dosageForm: "Tablet",
        prescriptionRequired: true,
      },
    ],
    subtotal: 92 + 48 + 118,
    delivery: 0,
    total: 258,
    hasRx: true,
    prescriptionFiles: [
      {
        id: "demo-file-1",
        name: "prescription_05jul2026.svg",
        mimeType: "image/svg+xml",
        dataUrl: DEMO_PRESCRIPTION_SVG,
        extraction: {
          doctorName: "Dr. Suresh Rao",
          patientName: "Ravi Kumar Sharma",
          medicines: [
            { name: "Azithral 500", dosage: "1 tablet once daily × 5 days" },
            { name: "Glycomet 500 (Metformin)", dosage: "1 tablet twice daily × 30 days" },
            { name: "Pan 40 (Pantoprazole)", dosage: "1 tablet 30 min before breakfast × 14 days" },
          ],
        },
      },
    ],
    address: {
      fullName: "Ravi Kumar Sharma",
      phone: "9876543210",
      line1: "12, MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      type: "Home",
      deliverySlot: "standard",
    },
    paymentMethod: "upi",
    status: "under_review",
    prescriptionStatus: "pending",
    itemVerification: [
      { medicineId: "azithral-500", aiStatus: "matched", pharmacistApproved: false },
      { medicineId: "metformin-500", aiStatus: "matched", pharmacistApproved: false },
      { medicineId: "pan-40", aiStatus: "possible", pharmacistApproved: false },
    ],
  };
}

/**
 * Returns true if this is the first time we're seeding demo data
 * (i.e. the flag key doesn't exist in localStorage yet).
 * Marks it as seeded so we don't inject duplicates on subsequent loads.
 */
export function shouldSeedDemo(): boolean {
  if (typeof window === "undefined") return false;
  const already = window.localStorage.getItem(DEMO_SEED_FLAG);
  if (already) return false;
  window.localStorage.setItem(DEMO_SEED_FLAG, "1");
  return true;
}
