import { randomBytes } from "crypto";
import { Router } from "express";
import {
  clearSessionCookie,
  createSession,
  destroySession,
  getSessionUser,
  hashPassword,
  sessionToken,
  setSessionCookie,
  verifyPassword,
} from "./auth.ts";
import { loadStore, publicUser, saveStore, type CartLine } from "./store.ts";

const FREE_SHIPPING = 1_000_000;
const SHIPPING_FEE = 30_000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function newId(prefix: string) {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function cartKey(line: CartLine) {
  return `${line.productId}:${line.size}`;
}

function sanitizeCart(lines: CartLine[]): CartLine[] {
  const store = loadStore();
  const merged = new Map<string, CartLine>();
  for (const line of lines) {
    const product = store.products.find((item) => item.id === line.productId);
    const size = Number(line.size);
    const quantity = Math.floor(Number(line.quantity));
    if (!product || !product.sizes.includes(size) || quantity < 1) continue;
    const next: CartLine = {
      productId: product.id,
      size,
      quantity: Math.min(quantity, product.stock),
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

function hydrateCart(lines: CartLine[]) {
  const store = loadStore();
  return sanitizeCart(lines)
    .map((line) => {
      const product = store.products.find((item) => item.id === line.productId);
      if (!product) return null;
      return {
        ...line,
        name: product.name,
        price: product.price,
        image: product.image,
        color: product.color,
        stock: product.stock,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function cartTotals(lines: CartLine[]) {
  const items = hydrateCart(lines);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  return { items, subtotal, shipping, total: subtotal + shipping };
}

function requireUser(req: Parameters<typeof getSessionUser>[0]) {
  const user = getSessionUser(req);
  if (!user) {
    const error = new Error("UNAUTHORIZED");
    throw error;
  }
  return user;
}

export const api = Router();

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
    res.status(404).json({ error: "Không tìm thấy sản phẩm" });
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
      res.status(400).json({ error: "Vui lòng nhập họ và tên" });
      return;
    }
    if (!emailPattern.test(email)) {
      res.status(400).json({ error: "Email không hợp lệ" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Mật khẩu cần tối thiểu 6 ký tự" });
      return;
    }
    const store = loadStore();
    if (store.users.some((user) => user.email === email)) {
      res.status(409).json({ error: "Email này đã được đăng ký" });
      return;
    }
    const guestCart = sanitizeCart(Array.isArray(req.body?.cart) ? req.body.cart : []);
    const guestLikes = Array.isArray(req.body?.likes)
      ? req.body.likes.filter((id: unknown) => store.products.some((item) => item.id === id))
      : [];
    const user = {
      id: newId("usr"),
      name,
      email,
      passwordHash: await hashPassword(password),
      cart: guestCart,
      likes: [...new Set(guestLikes as string[])],
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    saveStore(store);
    const token = createSession(user.id);
    setSessionCookie(res, token);
    res.status(201).json({ user: publicUser(user), cart: cartTotals(user.cart) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Không thể tạo tài khoản" });
  }
});

api.post("/auth/login", async (req, res) => {
  try {
    const email = normalizeEmail(String(req.body?.email ?? ""));
    const password = String(req.body?.password ?? "");
    const store = loadStore();
    const user = store.users.find((item) => item.email === email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      res.status(401).json({ error: "Email hoặc mật khẩu chưa đúng" });
      return;
    }
    const guestCart = sanitizeCart(Array.isArray(req.body?.cart) ? req.body.cart : []);
    const guestLikes = Array.isArray(req.body?.likes)
      ? req.body.likes.filter((id: unknown) => store.products.some((item) => item.id === id))
      : [];
    user.cart = sanitizeCart([...user.cart, ...guestCart]);
    user.likes = [...new Set([...user.likes, ...(guestLikes as string[])])];
    saveStore(store);
    const token = createSession(user.id);
    setSessionCookie(res, token);
    res.json({ user: publicUser(user), cart: cartTotals(user.cart) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Không thể đăng nhập" });
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
      res.status(404).json({ error: "Không tìm thấy sản phẩm" });
      return;
    }
    const current = store.users.find((item) => item.id === user.id);
    if (!current) {
      res.status(401).json({ error: "Vui lòng đăng nhập" });
      return;
    }
    current.likes = current.likes.includes(productId)
      ? current.likes.filter((id) => id !== productId)
      : [...current.likes, productId];
    saveStore(store);
    res.json({ likes: current.likes });
  } catch {
    res.status(401).json({ error: "Vui lòng đăng nhập để lưu sản phẩm" });
  }
});

api.post("/newsletter", (req, res) => {
  const email = normalizeEmail(String(req.body?.email ?? ""));
  if (!emailPattern.test(email)) {
    res.status(400).json({ error: "Email không hợp lệ" });
    return;
  }
  const store = loadStore();
  if (!store.subscribers.includes(email)) {
    store.subscribers.push(email);
    saveStore(store);
  }
  res.json({ ok: true, message: "Đã đăng ký nhận tin. Ưu đãi 10% sẽ được gửi tới email của bạn." });
});

api.get("/orders", (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Vui lòng đăng nhập" });
    return;
  }
  const orders = loadStore()
    .orders.filter((order) => order.userId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
      postalCode: String(req.body?.postalCode ?? "").trim(),
    };
    const paymentMethod: "cod" | "card" = req.body?.paymentMethod === "card" ? "card" : "cod";
    if (!emailPattern.test(contact.email) || !contact.firstName || !contact.lastName || !contact.address || !contact.city) {
      res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin giao hàng" });
      return;
    }
    if (contact.postalCode && !/^[0-9A-Za-z -]{3,10}$/.test(contact.postalCode)) {
      res.status(400).json({ error: "Mã bưu chính chưa hợp lệ" });
      return;
    }

    let paymentHint = "Thanh toán khi nhận hàng";
    if (paymentMethod === "card") {
      const card = String(req.body?.cardNumber ?? "").replace(/\s+/g, "");
      const expiry = String(req.body?.expiry ?? "").trim();
      const cvc = String(req.body?.cvc ?? "").trim();
      if (!/^\d{12,19}$/.test(card) || !/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(expiry) || !/^\d{3,4}$/.test(cvc)) {
        res.status(400).json({ error: "Thông tin thẻ chưa hợp lệ. Dùng thẻ demo 4242 4242 4242 4242." });
        return;
      }
      paymentHint = `Thẻ •••• ${card.slice(-4)} (mô phỏng)`;
    }

    const store = loadStore();
    const current = store.users.find((item) => item.id === user.id);
    if (!current) {
      res.status(401).json({ error: "Vui lòng đăng nhập" });
      return;
    }
    const lines = sanitizeCart(current.cart);
    if (!lines.length) {
      res.status(400).json({ error: "Giỏ hàng đang trống" });
      return;
    }

    for (const line of lines) {
      const product = store.products.find((item) => item.id === line.productId);
      if (!product || product.stock < line.quantity) {
        res.status(409).json({
          error: `${product?.name ?? "Sản phẩm"} không đủ tồn kho`,
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
        image: item.image,
      })),
      contact,
      paymentMethod,
      paymentHint,
      subtotal,
      shipping,
      total,
      createdAt: new Date().toISOString(),
      status: "confirmed" as const,
    };
    current.cart = [];
    store.orders.push(order);
    saveStore(store);
    res.status(201).json({ order });
  } catch {
    res.status(401).json({ error: "Vui lòng đăng nhập để thanh toán" });
  }
});
