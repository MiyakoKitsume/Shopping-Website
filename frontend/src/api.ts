import type { CartItem, CartPayload, Order, Product, User } from "./types";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(path, {
    ...options,
    headers,
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      typeof data.error === "string" ? data.error : "Đã xảy ra lỗi, vui lòng thử lại",
      response.status,
    );
  }
  return data as T;
}

export const api = {
  products: () => request<{ products: Product[] }>("/api/products"),
  me: () => request<{ user: User | null; cart: CartPayload }>("/api/auth/me"),
  login: (body: { email: string; password: string; cart: CartItem[]; likes: string[] }) =>
    request<{ user: User; cart: CartPayload }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  register: (body: { name: string; email: string; password: string; cart: CartItem[]; likes: string[] }) =>
    request<{ user: User; cart: CartPayload }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  logout: () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
  saveCart: (items: CartItem[]) =>
    request<CartPayload>("/api/cart", {
      method: "PUT",
      body: JSON.stringify({
        items: items.map(({ productId, size, quantity }) => ({ productId, size, quantity })),
      }),
    }),
  toggleLike: (productId: string) =>
    request<{ likes: string[] }>("/api/likes", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),
  newsletter: (email: string) =>
    request<{ ok: boolean; message: string }>("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  orders: () => request<{ orders: Order[] }>("/api/orders"),
  checkout: (body: Record<string, string>) =>
    request<{ order: Order }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
