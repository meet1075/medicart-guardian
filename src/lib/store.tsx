import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Address,
  CartItem,
  ItemVerification,
  Order,
  OrderStatus,
  PrescriptionFile,
  PrescriptionStatus,
} from "./types";
import { getMedicine } from "./medicines";
import { compareMedicine } from "./fuzzy-match";
import { buildDemoOrder, shouldSeedDemo, DEMO_ORDER_ID } from "./demo-seed";

const CART_KEY = "medicart.cart.v1";
const ORDERS_KEY = "medicart.orders.v1";
const ADDR_KEY = "medicart.addresses.v1";
const ADMIN_KEY = "medicart.admin.v1";

interface StoreContext {
  cart: CartItem[];
  addToCart: (medicineId: string, qty?: number) => void;
  updateQty: (medicineId: string, qty: number) => void;
  removeFromCart: (medicineId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartHasRx: boolean;

  savedAddresses: Address[];
  saveAddress: (a: Address) => void;

  orders: Order[];
  createOrder: (input: {
    prescriptionFiles: PrescriptionFile[];
    address: Address;
    paymentMethod: Order["paymentMethod"];
  }) => Order;
  updatePrescriptionOnOrder: (orderId: string, files: PrescriptionFile[]) => void;
  toggleItemVerified: (orderId: string, medicineId: string) => void;
  approveOrder: (orderId: string, reviewer: string) => void;
  rejectOrder: (orderId: string, reviewer: string, reason: string) => void;

  // auth state removed in favor of Server Functions

  /** True once localStorage has been read on the client. Use this to defer
   * rendering of client-only data (orders, cart) until after hydration. */
  storeHydrated: boolean;
}

const StoreCtx = createContext<StoreContext | null>(null);

function loadJSON<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(k);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJSON(k: string, v: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* quota */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => loadJSON<CartItem[]>(CART_KEY, []));
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(() =>
    loadJSON<Address[]>(ADDR_KEY, [])
  );
  const [hydrated, setHydrated] = useState(false);

  const [orders, setOrders] = useState<Order[]>(() => {
    const storedOrders = loadJSON<Order[]>(ORDERS_KEY, []);
    if (shouldSeedDemo()) {
      return [buildDemoOrder(), ...storedOrders];
    }
    return storedOrders;
  });

  // Mark hydrated on first client render
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Legacy hydration effect removed — state is now seeded synchronously via lazy init above

  useEffect(() => {
    if (hydrated) saveJSON(CART_KEY, cart);
  }, [cart, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    // Strip large dataUrls from prescriptionFiles before persisting to localStorage
    // to avoid 5 MB quota errors. The demo order's SVG is tiny so it's safe to keep;
    // real user-uploaded base64 images can be megabytes and must be stripped.
    const ordersForStorage = orders.map((o) => ({
      ...o,
      prescriptionFiles: o.prescriptionFiles.map((f) => ({
        ...f,
        // Keep SVG data URLs (they're tiny) but strip large image/PDF base64
        dataUrl: f.mimeType === "image/svg+xml" || f.dataUrl.length < 50_000
          ? f.dataUrl
          : "[file-too-large-for-storage]",
      })),
    }));
    saveJSON(ORDERS_KEY, ordersForStorage);
  }, [orders, hydrated]);
  useEffect(() => {
    if (hydrated) saveJSON(ADDR_KEY, savedAddresses);
  }, [savedAddresses, hydrated]);

  // Cross-tab sync so /admin sees live order updates when public tab places one
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === ORDERS_KEY) setOrders(loadJSON<Order[]>(ORDERS_KEY, []));
      if (e.key === CART_KEY) setCart(loadJSON<CartItem[]>(CART_KEY, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addToCart = useCallback((medicineId: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.medicineId === medicineId);
      if (existing) {
        return prev.map((c) =>
          c.medicineId === medicineId ? { ...c, qty: c.qty + qty } : c,
        );
      }
      return [...prev, { medicineId, qty }];
    });
  }, []);

  const updateQty = useCallback((medicineId: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((c) => c.medicineId !== medicineId)
        : prev.map((c) => (c.medicineId === medicineId ? { ...c, qty } : c)),
    );
  }, []);

  const removeFromCart = useCallback((medicineId: string) => {
    setCart((prev) => prev.filter((c) => c.medicineId !== medicineId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const saveAddress = useCallback((a: Address) => {
    setSavedAddresses((prev) => [a, ...prev.filter((p) => p.pincode !== a.pincode || p.line1 !== a.line1)].slice(0, 5));
  }, []);

  const cartCount = useMemo(() => cart.reduce((n, c) => n + c.qty, 0), [cart]);
  const cartHasRx = useMemo(
    () => cart.some((c) => getMedicine(c.medicineId)?.prescriptionRequired),
    [cart],
  );

  const createOrder = useCallback(
    ({
      prescriptionFiles,
      address,
      paymentMethod,
    }: {
      prescriptionFiles: PrescriptionFile[];
      address: Address;
      paymentMethod: Order["paymentMethod"];
    }): Order => {
      const items = cart
        .map((c) => {
          const m = getMedicine(c.medicineId);
          if (!m) return null;
          return {
            medicineId: m.id,
            name: m.name,
            salt: m.salt,
            qty: c.qty,
            price: m.mrp,
            dosageForm: m.dosageForm,
            prescriptionRequired: m.prescriptionRequired,
          };
        })
        .filter(Boolean) as Order["items"];

      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const delivery = address.deliverySlot === "express" ? 79 : subtotal > 499 ? 0 : 39;
      const hasRx = items.some((i) => i.prescriptionRequired);

      // AI-assisted comparison against extracted prescription medicines
      const extracted = prescriptionFiles.flatMap((f) => f.extraction?.medicines ?? []);
      const itemVerification: ItemVerification[] = items
        .filter((i) => i.prescriptionRequired)
        .map((i) => {
          const m = getMedicine(i.medicineId)!;
          const aiStatus = extracted.length
            ? compareMedicine({ name: m.name, salt: m.salt, brand: m.brand }, extracted)
            : "not_found";
          return { medicineId: i.medicineId, aiStatus, pharmacistApproved: false };
        });

      const status: OrderStatus = hasRx ? "under_review" : "processing";
      const prescriptionStatus: PrescriptionStatus | undefined = hasRx ? "pending" : undefined;

      const order: Order = {
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
        itemVerification,
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [cart],
  );

  const updatePrescriptionOnOrder = useCallback(
    (orderId: string, files: PrescriptionFile[]) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o;
          const extracted = files.flatMap((f) => f.extraction?.medicines ?? []);
          const itemVerification: ItemVerification[] = o.items
            .filter((i) => i.prescriptionRequired)
            .map((i) => {
              const m = getMedicine(i.medicineId);
              const aiStatus =
                m && extracted.length
                  ? compareMedicine({ name: m.name, salt: m.salt, brand: m.brand }, extracted)
                  : "not_found";
              return { medicineId: i.medicineId, aiStatus, pharmacistApproved: false };
            });
          return {
            ...o,
            prescriptionFiles: files,
            itemVerification,
            status: "under_review" as OrderStatus,
            prescriptionStatus: "pending" as PrescriptionStatus,
            rejectReason: undefined,
          };
        }),
      );
    },
    [],
  );

  const toggleItemVerified = useCallback((orderId: string, medicineId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              itemVerification: o.itemVerification.map((v) =>
                v.medicineId === medicineId
                  ? { ...v, pharmacistApproved: !v.pharmacistApproved }
                  : v,
              ),
            }
          : o,
      ),
    );
  }, []);

  const approveOrder = useCallback((orderId: string, reviewer: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "processing" as OrderStatus,
              prescriptionStatus: "verified" as PrescriptionStatus,
              reviewedBy: reviewer,
              reviewedAt: Date.now(),
              rejectReason: undefined,
            }
          : o,
      ),
    );
  }, []);

  const rejectOrder = useCallback((orderId: string, reviewer: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "action_needed" as OrderStatus,
              prescriptionStatus: "rejected" as PrescriptionStatus,
              reviewedBy: reviewer,
              reviewedAt: Date.now(),
              rejectReason: reason,
            }
          : o,
      ),
    );
  }, []);

  const value: StoreContext = {
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartHasRx,
    savedAddresses,
    saveAddress,
    orders,
    createOrder,
    updatePrescriptionOnOrder,
    toggleItemVerified,
    approveOrder,
    rejectOrder,
    storeHydrated: hydrated,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreContext {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
