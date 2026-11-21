import fs from "fs";
import path from "path";
import { products, type Product } from "./catalog.ts";

export interface CartLine {
  productId: string;
  size: number;
  quantity: number;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  cart: CartLine[];
  likes: string[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: number;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderRecord {
  id: string;
  userId: string;
  items: OrderItem[];
  contact: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: "cod" | "card";
  paymentHint: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  status: "confirmed";
}

export interface SessionRecord {
  token: string;
  userId: string;
  expiresAt: number;
}

export interface StoreData {
  products: Product[];
  users: UserRecord[];
  sessions: SessionRecord[];
  orders: OrderRecord[];
  subscribers: string[];
}

const dataDir = path.join(process.cwd(), "backend", "data");
const storePath = path.join(dataDir, "store.json");

let cache: StoreData | null = null;
let writeChain: Promise<void> = Promise.resolve();

function emptyStore(): StoreData {
  return {
    products: structuredClone(products),
    users: [],
    sessions: [],
    orders: [],
    subscribers: [],
  };
}

export function loadStore(): StoreData {
  if (cache) return cache;
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(storePath)) {
    cache = emptyStore();
    fs.writeFileSync(storePath, JSON.stringify(cache, null, 2), "utf8");
    return cache;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(storePath, "utf8")) as StoreData;
    parsed.users ??= [];
    parsed.sessions ??= [];
    parsed.orders ??= [];
    parsed.subscribers ??= [];
    const previousStock = new Map((parsed.products ?? []).map((item) => [item.id, item.stock]));
    parsed.products = products.map((item) => ({
      ...item,
      stock: previousStock.get(item.id) ?? item.stock,
    }));
    cache = parsed;
    return cache;
  } catch {
    cache = emptyStore();
    fs.writeFileSync(storePath, JSON.stringify(cache, null, 2), "utf8");
    return cache;
  }
}

export function saveStore(next: StoreData) {
  cache = next;
  writeChain = writeChain.then(() => {
    fs.mkdirSync(dataDir, { recursive: true });
    const tmp = `${storePath}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(next, null, 2), "utf8");
    fs.renameSync(tmp, storePath);
  }).catch((error) => {
    console.error("Failed to persist store", error);
  });
  return writeChain;
}

export function publicUser(user: UserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    likes: user.likes,
  };
}
