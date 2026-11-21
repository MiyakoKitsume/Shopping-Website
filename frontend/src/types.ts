export type Category = "All" | "Running" | "Training" | "Lifestyle";
export type SortId = "featured" | "price-asc" | "price-desc" | "rating";
export type View = "shop" | "login" | "register" | "checkout" | "account";

export interface Product {
  id: string;
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  color: string;
  tag?: string;
  description: string;
  sizes: number[];
  stock: number;
}

export interface CartItem {
  productId: string;
  size: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
  color: string;
  stock: number;
}

export interface CartPayload {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  likes: string[];
}

export interface Order {
  id: string;
  items: Array<{
    productId: string;
    name: string;
    size: number;
    quantity: number;
    price: number;
    image: string;
  }>;
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
  status: string;
}
