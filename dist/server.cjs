var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express2 = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// backend/auth.ts
var import_util = require("util");
var import_crypto = require("crypto");

// backend/store.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));

// backend/catalog.ts
var products = [
  {
    id: "aero-glide-3",
    name: "Aero Glide 3",
    category: "Running",
    price: 249e4,
    rating: 4.9,
    reviews: 128,
    color: "\u0110en / V\xE0ng neon",
    tag: "M\u1EDBi",
    description: "\u0110\u1EC7m ph\u1EA3n h\u1ED3i n\u0103ng l\u01B0\u1EE3ng v\xE0 upper si\xEAu nh\u1EB9 cho nh\u1EEFng bu\u1ED5i ch\u1EA1y d\xE0i. Tho\xE1ng kh\xED, \xF4m ch\xE2n v\xE0 s\u1EB5n s\xE0ng cho nh\u1ECBp \u0111\u1ED9 h\xE0ng ng\xE0y.",
    sizes: [38, 39, 40, 41, 42, 43],
    stock: 24,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "cloudsurfer-max",
    name: "Cloudsurfer Max",
    category: "Running",
    price: 289e4,
    rating: 4.8,
    reviews: 94,
    color: "Tr\u1EAFng / B\u1EA1c",
    description: "\u0110\u1EBF d\xE0y \xEAm \xE1i, ph\xF9 h\u1EE3p ph\u1EE5c h\u1ED3i v\xE0 ch\u1EA1y d\u1EC5. L\u1EDBp \u0111\u1EC7m max cushion gi\xFAp m\u1ED7i b\u01B0\u1EDBc tr\u1EDF n\xEAn nh\u1EB9 h\u01A1n tr\xEAn \u0111\u01B0\u1EDDng d\xE0i.",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 18,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "everyday-knit",
    name: "Everyday Knit",
    category: "Lifestyle",
    price: 189e4,
    rating: 4.7,
    reviews: 215,
    color: "Xanh sage / Kem",
    tag: "B\xE1n ch\u1EA1y",
    description: "Knit \xF4m ch\xE2n, d\u1EC5 ph\u1ED1i \u0111\u1ED3 t\u1EEB ph\xF2ng gym \u0111\u1EBFn qu\xE1n c\xE0 ph\xEA. Thi\u1EBFt k\u1EBF t\u1ED1i gi\u1EA3n, \u0111\u1EBF linh ho\u1EA1t cho c\u1EA3 ng\xE0y.",
    sizes: [36, 37, 38, 39, 40, 41, 42],
    stock: 32,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "court-vision-pro",
    name: "Court Vision Pro",
    category: "Training",
    price: 219e4,
    rating: 4.8,
    reviews: 76,
    color: "\u0110\u1EA5t nung / Cao su",
    description: "B\xE1m s\xE2n ch\u1EAFc, h\u1ED7 tr\u1EE3 c\u1ED5 ch\xE2n v\u1EEBa ph\u1EA3i cho bu\u1ED5i t\u1EADp \u0111a h\u01B0\u1EDBng. \u0110\u1EBF ngo\xE0i b\u1EC1n, ph\xF9 h\u1EE3p HIIT v\xE0 gym.",
    sizes: [38, 39, 40, 41, 42, 43],
    stock: 16,
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "trail-finder-gtx",
    name: "Trail Finder GTX",
    category: "Running",
    price: 319e4,
    rating: 4.9,
    reviews: 51,
    color: "\u0110\xE1 / Cam",
    description: "M\xE0ng ch\u1ED1ng n\u01B0\u1EDBc, \u0111\u1EBF gai b\xE1m \u0111\u1ECBa h\xECnh v\xE0 m\u0169i gi\xE0y b\u1EA3o v\u1EC7. \u0110\u1ED3ng h\xE0nh tr\xEAn \u0111\u01B0\u1EDDng m\xF2n \u1EA9m \u01B0\u1EDBt v\xE0 s\u1ECFi \u0111\xE1.",
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 12,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "lift-trainer-01",
    name: "Lift Trainer 01",
    category: "Training",
    price: 229e4,
    rating: 4.6,
    reviews: 68,
    color: "\u0110en / Tr\u1EAFng",
    description: "\u0110\u1EBF ph\u1EB3ng \u1ED5n \u0111\u1ECBnh cho squat v\xE0 deadlift, v\u1EABn \u0111\u1EE7 linh ho\u1EA1t \u0111\u1EC3 chuy\u1EC3n sang cardio. B\u1EC1n v\xE0 s\u1EA1ch s\u1EBD.",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 20,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "night-pulse",
    name: "Night Pulse",
    category: "Lifestyle",
    price: 259e4,
    rating: 4.7,
    reviews: 83,
    color: "\u0110en / Ph\u1EA3n quang",
    tag: "Gi\u1EDBi h\u1EA1n",
    description: "Silhouette th\u1EA5p, chi ti\u1EBFt ph\u1EA3n quang cho bu\u1ED5i t\u1ED1i. \u0110\u1EC7m \xEAm, form streetwear nh\u01B0ng v\u1EABn \u0111i b\u1ED9 c\u1EA3 ng\xE0y.",
    sizes: [37, 38, 39, 40, 41, 42, 43],
    stock: 14,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "studio-flow",
    name: "Studio Flow",
    category: "Training",
    price: 199e4,
    rating: 4.5,
    reviews: 102,
    color: "H\u1ED3ng \u0111\u1EA5t / Kem",
    description: "Nh\u1EB9 v\xE0 b\xE1m s\xE0n cho yoga, pilates v\xE0 studio. Upper m\u1EC1m, \u0111\u1EBF m\u1ECFng c\u1EA3m nh\u1EADn m\u1EB7t \u0111\u1EA5t t\u1ED1t.",
    sizes: [36, 37, 38, 39, 40, 41],
    stock: 22,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "urban-court",
    name: "Urban Court",
    category: "Lifestyle",
    price: 209e4,
    rating: 4.6,
    reviews: 141,
    color: "Tr\u1EAFng / Navy",
    description: "Gi\xE0y court c\u1ED5 \u0111i\u1EC3n, da t\u1ED5ng h\u1EE3p d\u1EC5 v\u1EC7 sinh. Ph\u1ED1i \u0111\u01B0\u1EE3c v\u1EDBi qu\u1EA7n jean, short v\xE0 set c\xF4ng s\u1EDF n\u0103ng \u0111\u1ED9ng.",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 26,
    image: "https://images.unsplash.com/photo-1595341888016-a392ef883b1a?auto=format&fit=crop&w=900&q=85"
  }
];

// backend/store.ts
var dataDir = import_path.default.join(process.cwd(), "backend", "data");
var storePath = import_path.default.join(dataDir, "store.json");
var cache = null;
var writeChain = Promise.resolve();
function emptyStore() {
  return {
    products: structuredClone(products),
    users: [],
    sessions: [],
    orders: [],
    subscribers: []
  };
}
function loadStore() {
  if (cache) return cache;
  import_fs.default.mkdirSync(dataDir, { recursive: true });
  if (!import_fs.default.existsSync(storePath)) {
    cache = emptyStore();
    import_fs.default.writeFileSync(storePath, JSON.stringify(cache, null, 2), "utf8");
    return cache;
  }
  try {
    const parsed = JSON.parse(import_fs.default.readFileSync(storePath, "utf8"));
    parsed.users ??= [];
    parsed.sessions ??= [];
    parsed.orders ??= [];
    parsed.subscribers ??= [];
    const previousStock = new Map((parsed.products ?? []).map((item) => [item.id, item.stock]));
    parsed.products = products.map((item) => ({
      ...item,
      stock: previousStock.get(item.id) ?? item.stock
    }));
    cache = parsed;
    return cache;
  } catch {
    cache = emptyStore();
    import_fs.default.writeFileSync(storePath, JSON.stringify(cache, null, 2), "utf8");
    return cache;
  }
}
function saveStore(next) {
  cache = next;
  writeChain = writeChain.then(() => {
    import_fs.default.mkdirSync(dataDir, { recursive: true });
    const tmp = `${storePath}.tmp`;
    import_fs.default.writeFileSync(tmp, JSON.stringify(next, null, 2), "utf8");
    import_fs.default.renameSync(tmp, storePath);
  }).catch((error) => {
    console.error("Failed to persist store", error);
  });
  return writeChain;
}
function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    likes: user.likes
  };
}

// backend/auth.ts
var scrypt = (0, import_util.promisify)(import_crypto.scrypt);
var SESSION_MS = 1e3 * 60 * 60 * 24 * 7;
var COOKIE = "stride_session";
async function hashPassword(password) {
  const salt = (0, import_crypto.randomBytes)(16).toString("hex");
  const derived = await scrypt(password, salt, 32);
  return `${salt}:${derived.toString("hex")}`;
}
async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = await scrypt(password, salt, 32);
  const storedBuf = Buffer.from(hash, "hex");
  if (storedBuf.length !== derived.length) return false;
  return (0, import_crypto.timingSafeEqual)(storedBuf, derived);
}
function parseCookies(header) {
  const cookies = {};
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
  }
  return cookies;
}
function pruneSessions(sessions) {
  const now = Date.now();
  return sessions.filter((session) => session.expiresAt > now);
}
function createSession(userId) {
  const store = loadStore();
  const token = (0, import_crypto.randomBytes)(24).toString("hex");
  store.sessions = pruneSessions(store.sessions);
  store.sessions.push({
    token,
    userId,
    expiresAt: Date.now() + SESSION_MS
  });
  saveStore(store);
  return token;
}
function setSessionCookie(res, token) {
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.floor(SESSION_MS / 1e3)}`
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}
function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}
function destroySession(token) {
  if (!token) return;
  const store = loadStore();
  store.sessions = pruneSessions(store.sessions).filter((session) => session.token !== token);
  saveStore(store);
}
function getSessionUser(req) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (!token) return null;
  const store = loadStore();
  store.sessions = pruneSessions(store.sessions);
  const session = store.sessions.find((item) => item.token === token);
  if (!session) return null;
  return store.users.find((user) => user.id === session.userId) ?? null;
}
function sessionToken(req) {
  return parseCookies(req.headers.cookie)[COOKIE];
}

// backend/routes.ts
var import_crypto2 = require("crypto");
var import_express = require("express");
var FREE_SHIPPING = 1e6;
var SHIPPING_FEE = 3e4;
var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function newId(prefix) {
  return `${prefix}_${(0, import_crypto2.randomBytes)(6).toString("hex")}`;
}
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function isCardExpiryValid(expiry, now = /* @__PURE__ */ new Date()) {
  const match = expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2e3 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  return year > currentYear || year === currentYear && month >= currentMonth;
}
function cartKey(line) {
  return `${line.productId}:${line.size}`;
}
function sanitizeCart(lines) {
  const store = loadStore();
  const merged = /* @__PURE__ */ new Map();
  for (const line of lines) {
    const product = store.products.find((item) => item.id === line.productId);
    const size = Number(line.size);
    const quantity = Math.floor(Number(line.quantity));
    if (!product || !product.sizes.includes(size) || quantity < 1) continue;
    const next = {
      productId: product.id,
      size,
      quantity: Math.min(quantity, product.stock)
    };
    const key = cartKey(next);
    const existing = merged.get(key);
    if (existing) {
      existing.quantity = Math.min(product.stock, existing.quantity + next.quantity);
    } else {
      merged.set(key, next);
    }
  }
  return [...merged.values()];
}
function hydrateCart(lines) {
  const store = loadStore();
  return sanitizeCart(lines).map((line) => {
    const product = store.products.find((item) => item.id === line.productId);
    if (!product) return null;
    return {
      ...line,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.color,
      stock: product.stock
    };
  }).filter((item) => Boolean(item));
}
function cartTotals(lines) {
  const items = hydrateCart(lines);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  return { items, subtotal, shipping, total: subtotal + shipping };
}
function requireUser(req) {
  const user = getSessionUser(req);
  if (!user) {
    const error = new Error("UNAUTHORIZED");
    throw error;
  }
  return user;
}
var api = (0, import_express.Router)();
api.get("/health", (_req, res) => {
  res.json({ status: "ok", store: "Stride" });
});
api.get("/products", (_req, res) => {
  const store = loadStore();
  res.json({ products: store.products });
});
api.get("/products/:id", (req, res) => {
  const product = loadStore().products.find((item) => item.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y s\u1EA3n ph\u1EA9m" });
    return;
  }
  res.json({ product });
});
api.post("/auth/register", async (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const email = normalizeEmail(String(req.body?.email ?? ""));
    const password = String(req.body?.password ?? "");
    if (name.length < 2) {
      res.status(400).json({ error: "Vui l\xF2ng nh\u1EADp h\u1ECD v\xE0 t\xEAn" });
      return;
    }
    if (!emailPattern.test(email)) {
      res.status(400).json({ error: "Email kh\xF4ng h\u1EE3p l\u1EC7" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "M\u1EADt kh\u1EA9u c\u1EA7n t\u1ED1i thi\u1EC3u 6 k\xFD t\u1EF1" });
      return;
    }
    const store = loadStore();
    if (store.users.some((user2) => user2.email === email)) {
      res.status(409).json({ error: "Email n\xE0y \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u0103ng k\xFD" });
      return;
    }
    const guestCart = sanitizeCart(Array.isArray(req.body?.cart) ? req.body.cart : []);
    const guestLikes = Array.isArray(req.body?.likes) ? req.body.likes.filter((id) => store.products.some((item) => item.id === id)) : [];
    const user = {
      id: newId("usr"),
      name,
      email,
      passwordHash: await hashPassword(password),
      cart: guestCart,
      likes: [...new Set(guestLikes)],
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    store.users.push(user);
    saveStore(store);
    const token = createSession(user.id);
    setSessionCookie(res, token);
    res.status(201).json({ user: publicUser(user), cart: cartTotals(user.cart) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 t\u1EA1o t\xE0i kho\u1EA3n" });
  }
});
api.post("/auth/login", async (req, res) => {
  try {
    const email = normalizeEmail(String(req.body?.email ?? ""));
    const password = String(req.body?.password ?? "");
    const store = loadStore();
    const user = store.users.find((item) => item.email === email);
    if (!user || !await verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: "Email ho\u1EB7c m\u1EADt kh\u1EA9u ch\u01B0a \u0111\xFAng" });
      return;
    }
    const guestCart = sanitizeCart(Array.isArray(req.body?.cart) ? req.body.cart : []);
    const guestLikes = Array.isArray(req.body?.likes) ? req.body.likes.filter((id) => store.products.some((item) => item.id === id)) : [];
    user.cart = sanitizeCart([...user.cart, ...guestCart]);
    user.likes = [.../* @__PURE__ */ new Set([...user.likes, ...guestLikes])];
    saveStore(store);
    const token = createSession(user.id);
    setSessionCookie(res, token);
    res.json({ user: publicUser(user), cart: cartTotals(user.cart) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kh\xF4ng th\u1EC3 \u0111\u0103ng nh\u1EADp" });
  }
});
api.post("/auth/logout", (req, res) => {
  destroySession(sessionToken(req));
  clearSessionCookie(res);
  res.json({ ok: true });
});
api.get("/auth/me", (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    res.json({ user: null, cart: cartTotals([]) });
    return;
  }
  res.json({ user: publicUser(user), cart: cartTotals(user.cart) });
});
api.get("/cart", (req, res) => {
  const user = getSessionUser(req);
  res.json(cartTotals(user?.cart ?? []));
});
api.put("/cart", (req, res) => {
  const lines = sanitizeCart(Array.isArray(req.body?.items) ? req.body.items : []);
  const user = getSessionUser(req);
  if (user) {
    const store = loadStore();
    const current = store.users.find((item) => item.id === user.id);
    if (current) {
      current.cart = lines;
      saveStore(store);
    }
  }
  res.json(cartTotals(lines));
});
api.post("/likes", (req, res) => {
  try {
    const user = requireUser(req);
    const productId = String(req.body?.productId ?? "");
    const store = loadStore();
    const product = store.products.find((item) => item.id === productId);
    if (!product) {
      res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y s\u1EA3n ph\u1EA9m" });
      return;
    }
    const current = store.users.find((item) => item.id === user.id);
    if (!current) {
      res.status(401).json({ error: "Vui l\xF2ng \u0111\u0103ng nh\u1EADp" });
      return;
    }
    current.likes = current.likes.includes(productId) ? current.likes.filter((id) => id !== productId) : [...current.likes, productId];
    saveStore(store);
    res.json({ likes: current.likes });
  } catch {
    res.status(401).json({ error: "Vui l\xF2ng \u0111\u0103ng nh\u1EADp \u0111\u1EC3 l\u01B0u s\u1EA3n ph\u1EA9m" });
  }
});
api.post("/newsletter", (req, res) => {
  const email = normalizeEmail(String(req.body?.email ?? ""));
  if (!emailPattern.test(email)) {
    res.status(400).json({ error: "Email kh\xF4ng h\u1EE3p l\u1EC7" });
    return;
  }
  const store = loadStore();
  if (!store.subscribers.includes(email)) {
    store.subscribers.push(email);
    saveStore(store);
  }
  res.json({ ok: true, message: "\u0110\xE3 \u0111\u0103ng k\xFD nh\u1EADn tin. \u01AFu \u0111\xE3i 10% s\u1EBD \u0111\u01B0\u1EE3c g\u1EEDi t\u1EDBi email c\u1EE7a b\u1EA1n." });
});
api.get("/orders", (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Vui l\xF2ng \u0111\u0103ng nh\u1EADp" });
    return;
  }
  const orders = loadStore().orders.filter((order) => order.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ orders });
});
api.post("/orders", (req, res) => {
  try {
    const user = requireUser(req);
    const contact = {
      email: normalizeEmail(String(req.body?.email ?? user.email)),
      firstName: String(req.body?.firstName ?? "").trim(),
      lastName: String(req.body?.lastName ?? "").trim(),
      address: String(req.body?.address ?? "").trim(),
      city: String(req.body?.city ?? "").trim(),
      postalCode: String(req.body?.postalCode ?? "").trim()
    };
    const paymentMethod = req.body?.paymentMethod === "card" ? "card" : "cod";
    if (!emailPattern.test(contact.email) || !contact.firstName || !contact.lastName || !contact.address || !contact.city) {
      res.status(400).json({ error: "Vui l\xF2ng \u0111i\u1EC1n \u0111\u1EA7y \u0111\u1EE7 th\xF4ng tin giao h\xE0ng" });
      return;
    }
    if (contact.postalCode && !/^[0-9A-Za-z -]{3,10}$/.test(contact.postalCode)) {
      res.status(400).json({ error: "M\xE3 b\u01B0u ch\xEDnh ch\u01B0a h\u1EE3p l\u1EC7" });
      return;
    }
    let paymentHint = "Thanh to\xE1n khi nh\u1EADn h\xE0ng";
    if (paymentMethod === "card") {
      const card = String(req.body?.cardNumber ?? "").replace(/\s+/g, "");
      const expiry = String(req.body?.expiry ?? "").trim();
      const cvc = String(req.body?.cvc ?? "").trim();
      if (!/^\d{12,19}$/.test(card) || !isCardExpiryValid(expiry) || !/^\d{3,4}$/.test(cvc)) {
        res.status(400).json({ error: "Th\xF4ng tin th\u1EBB ch\u01B0a h\u1EE3p l\u1EC7. D\xF9ng th\u1EBB demo 4242 4242 4242 4242." });
        return;
      }
      paymentHint = `Th\u1EBB \u2022\u2022\u2022\u2022 ${card.slice(-4)} (m\xF4 ph\u1ECFng)`;
    }
    const store = loadStore();
    const current = store.users.find((item) => item.id === user.id);
    if (!current) {
      res.status(401).json({ error: "Vui l\xF2ng \u0111\u0103ng nh\u1EADp" });
      return;
    }
    const lines = sanitizeCart(current.cart);
    if (!lines.length) {
      res.status(400).json({ error: "Gi\u1ECF h\xE0ng \u0111ang tr\u1ED1ng" });
      return;
    }
    for (const line of lines) {
      const product = store.products.find((item) => item.id === line.productId);
      if (!product || product.stock < line.quantity) {
        res.status(409).json({
          error: `${product?.name ?? "S\u1EA3n ph\u1EA9m"} kh\xF4ng \u0111\u1EE7 t\u1ED3n kho`
        });
        return;
      }
    }
    const { items, subtotal, shipping, total } = cartTotals(lines);
    for (const line of lines) {
      const product = store.products.find((item) => item.id === line.productId);
      if (product) product.stock -= line.quantity;
    }
    const order = {
      id: newId("ord"),
      userId: user.id,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      contact,
      paymentMethod,
      paymentHint,
      subtotal,
      shipping,
      total,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "confirmed"
    };
    current.cart = [];
    store.orders.push(order);
    saveStore(store);
    res.status(201).json({ order });
  } catch {
    res.status(401).json({ error: "Vui l\xF2ng \u0111\u0103ng nh\u1EADp \u0111\u1EC3 thanh to\xE1n" });
  }
});

// server.ts
async function seedDemoAccount() {
  const store = loadStore();
  if (store.users.some((user) => user.email === "demo@stride.vn")) return;
  store.users.push({
    id: "usr_demo",
    name: "Kh\xE1ch Demo",
    email: "demo@stride.vn",
    passwordHash: await hashPassword("stride123"),
    cart: [],
    likes: [],
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  await saveStore(store);
}
async function startServer() {
  const app = (0, import_express2.default)();
  const PORT = Number(process.env.PORT) || 3e3;
  app.disable("x-powered-by");
  app.use(import_express2.default.json({ limit: "32kb" }));
  await seedDemoAccount();
  app.use("/api", api);
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express2.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Stride running at http://localhost:${PORT}`);
  });
}
startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
