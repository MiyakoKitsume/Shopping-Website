export type Category = "Running" | "Training" | "Lifestyle";

export interface Product {
  id: string;
  name: string;
  category: Category;
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

export const products: Product[] = [
  {
    id: "aero-glide-3",
    name: "Aero Glide 3",
    category: "Running",
    price: 2490000,
    rating: 4.9,
    reviews: 128,
    color: "Đen / Vàng neon",
    tag: "Mới",
    description:
      "Đệm phản hồi năng lượng và upper siêu nhẹ cho những buổi chạy dài. Thoáng khí, ôm chân và sẵn sàng cho nhịp độ hàng ngày.",
    sizes: [38, 39, 40, 41, 42, 43],
    stock: 24,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "cloudsurfer-max",
    name: "Cloudsurfer Max",
    category: "Running",
    price: 2890000,
    rating: 4.8,
    reviews: 94,
    color: "Trắng / Bạc",
    description:
      "Đế dày êm ái, phù hợp phục hồi và chạy dễ. Lớp đệm max cushion giúp mỗi bước trở nên nhẹ hơn trên đường dài.",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "everyday-knit",
    name: "Everyday Knit",
    category: "Lifestyle",
    price: 1890000,
    rating: 4.7,
    reviews: 215,
    color: "Xanh sage / Kem",
    tag: "Bán chạy",
    description:
      "Knit ôm chân, dễ phối đồ từ phòng gym đến quán cà phê. Thiết kế tối giản, đế linh hoạt cho cả ngày.",
    sizes: [36, 37, 38, 39, 40, 41, 42],
    stock: 32,
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "court-vision-pro",
    name: "Court Vision Pro",
    category: "Training",
    price: 2190000,
    rating: 4.8,
    reviews: 76,
    color: "Đất nung / Cao su",
    description:
      "Bám sân chắc, hỗ trợ cổ chân vừa phải cho buổi tập đa hướng. Đế ngoài bền, phù hợp HIIT và gym.",
    sizes: [38, 39, 40, 41, 42, 43],
    stock: 16,
    image:
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "trail-finder-gtx",
    name: "Trail Finder GTX",
    category: "Running",
    price: 3190000,
    rating: 4.9,
    reviews: 51,
    color: "Đá / Cam",
    description:
      "Màng chống nước, đế gai bám địa hình và mũi giày bảo vệ. Đồng hành trên đường mòn ẩm ướt và sỏi đá.",
    sizes: [39, 40, 41, 42, 43, 44],
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "lift-trainer-01",
    name: "Lift Trainer 01",
    category: "Training",
    price: 2290000,
    rating: 4.6,
    reviews: 68,
    color: "Đen / Trắng",
    description:
      "Đế phẳng ổn định cho squat và deadlift, vẫn đủ linh hoạt để chuyển sang cardio. Bền và sạch sẽ.",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "night-pulse",
    name: "Night Pulse",
    category: "Lifestyle",
    price: 2590000,
    rating: 4.7,
    reviews: 83,
    color: "Đen / Phản quang",
    tag: "Giới hạn",
    description:
      "Silhouette thấp, chi tiết phản quang cho buổi tối. Đệm êm, form streetwear nhưng vẫn đi bộ cả ngày.",
    sizes: [37, 38, 39, 40, 41, 42, 43],
    stock: 14,
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "studio-flow",
    name: "Studio Flow",
    category: "Training",
    price: 1990000,
    rating: 4.5,
    reviews: 102,
    color: "Hồng đất / Kem",
    description:
      "Nhẹ và bám sàn cho yoga, pilates và studio. Upper mềm, đế mỏng cảm nhận mặt đất tốt.",
    sizes: [36, 37, 38, 39, 40, 41],
    stock: 22,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "urban-court",
    name: "Urban Court",
    category: "Lifestyle",
    price: 2090000,
    rating: 4.6,
    reviews: 141,
    color: "Trắng / Navy",
    description:
      "Giày court cổ điển, da tổng hợp dễ vệ sinh. Phối được với quần jean, short và set công sở năng động.",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    stock: 26,
    image:
      "https://images.unsplash.com/photo-1595341888016-a392ef883b1a?auto=format&fit=crop&w=900&q=85",
  },
];
