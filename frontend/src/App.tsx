import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  Star,
  X
} from "lucide-react";

type Category = "All" | "Running" | "Training" | "Lifestyle";

interface Product {
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  rating: string;
  reviews: string;
  image: string;
  color: string;
  tag?: string;
  stock: number;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
  size: number;
}

const products: Product[] = [
  {
    name: "Aero Glide 3",
    category: "Running",
    price: 2490000,
    rating: "4.9",
    reviews: "128",
    color: "Đen / Vàng neon",
    tag: "Mới",
    description: "Một đôi giày chạy linh hoạt với đệm nhẹ, hỗ trợ chuyển động tự nhiên và thoáng khí cho những buổi chạy dài.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    stock: 24,
  },
  {
    name: "Cloudsurfer Max",
    category: "Running",
    price: 2890000,
    rating: "4.8",
    reviews: "94",
    color: "Trắng / Bạc",
    description: "Độ êm ái tăng cường cho từng bước chạy, kết hợp đế linh hoạt và thân giày mềm giúp giữ chân ổn định suốt ngày.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85",
    stock: 18,
  },
  {
    name: "Everyday Knit",
    category: "Lifestyle",
    price: 1890000,
    rating: "4.7",
    reviews: "215",
    color: "Xanh sage / Kem",
    tag: "Bán chạy",
    description: "Thiết kế lifestyle tối giản với phần upper knit co giãn và đệm êm, phù hợp cho đi làm, đi chơi và mặc hàng ngày.",
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85",
    stock: 32,
  },
  {
    name: "Court Vision Pro",
    category: "Training",
    price: 2190000,
    rating: "4.8",
    reviews: "76",
    color: "Đất nung / Cao su",
    description: "Đôi giày training cân bằng cho phòng tập, với đế chân phẳng, phần gót chắc chắn và độ bám tốt trong các bài tập đa hướng.",
    image:
      "https://images.unsplash.com/photo-1554135367-3ec7b2b7c1e4?auto=format&fit=crop&w=900&q=85",
    stock: 16,
  },
  {
    name: "Trail Finder GTX",
    category: "Running",
    price: 3190000,
    rating: "4.9",
    reviews: "51",
    color: "Đá / Cam",
    description: "Mẫu trail bảo vệ với phần upper GTX chống nước, đế răng sâu và đệm phản hồi để tự tin trên địa hình gồ ghề.",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=85",
    stock: 12,
  },
  {
    name: "Lift Trainer 01",
    category: "Training",
    price: 2290000,
    rating: "4.6",
    reviews: "68",
    color: "Đen / Trắng",
    description: "Nền đế ổn định và phần đệm hỗ trợ tối ưu giúp tăng kiểm soát trong squat, deadlift và các bài tập sức mạnh.",
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=85",
    stock: 20,
  },
];

const categories: Category[] = ["All", "Running", "Training", "Lifestyle"];
type SortId = "featured" | "price-asc" | "price-desc" | "rating";
const FREE_SHIPPING = 1000000;
const CART_KEY = "stride.cart";
const LIKES_KEY = "stride.likes";
const isCardExpiryValid = (expiry: string, now = new Date()) => {
  const match = expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return year > currentYear || (year === currentYear && month >= currentMonth);
};
const categoryLabels: Record<Category, string> = {
  All: "Tất cả",
  Running: "Chạy bộ",
  Training: "Luyện tập",
  Lifestyle: "Phong cách",
};
const formatVnd = (amount: number) => `${amount.toLocaleString("vi-VN")} VNĐ`;
const productSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value === null ? fallback : value;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

export default function App() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>(() => {
    const value = readStored<CartItem[]>(CART_KEY, []);
    return Array.isArray(value)
      ? value.map((item) => ({ ...item, size: item.size ?? 39 }))
      : [];
  });
  const [liked, setLiked] = useState<string[]>(() => {
    const value = readStored<string[]>(LIKES_KEY, []);
    return Array.isArray(value) ? value : [];
  });
  const [sort, setSort] = useState<SortId>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showBag, setShowBag] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [checkoutPendingLogin, setCheckoutPendingLogin] = useState(false);
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const slug = window.location.hash.replace("#shoe/", "");
    return products.find((product) => productSlug(product.name) === slug) ?? null;
  });
  const [selectedSize, setSelectedSize] = useState(39);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : 30000;
  const cartTotal = subtotal + shipping;

  const filteredProducts = useMemo(
    () => {
      const filtered = products.filter(
        (product) =>
          (category === "All" || product.category === category) &&
          product.name.toLowerCase().includes(query.trim().toLowerCase()),
      );
      if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
      if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
      if (sort === "rating") return [...filtered].sort((a, b) => Number(b.rating) - Number(a.rating));
      return filtered;
    },
    [category, query, sort],
  );

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LIKES_KEY, JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    const syncProductFromHash = () => {
      const slug = window.location.hash.replace("#shoe/", "");
      setSelectedProduct(slug
        ? products.find((product) => productSlug(product.name) === slug) ?? null
        : null);
    };
    window.addEventListener("popstate", syncProductFromHash);
    window.addEventListener("hashchange", syncProductFromHash);
    return () => {
      window.removeEventListener("popstate", syncProductFromHash);
      window.removeEventListener("hashchange", syncProductFromHash);
    };
  }, []);

  useEffect(() => {
    const closeTransientUi = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setShowBag(false);
      setShowLogin(false);
      setShowRegister(false);
      setShowCheckout(false);
      setSelectedProduct(null);
      if (window.location.hash.startsWith("#shoe/")) {
        window.history.pushState({}, "", window.location.pathname + window.location.search);
      }
      setSortOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener("keydown", closeTransientUi);
    return () => window.removeEventListener("keydown", closeTransientUi);
  }, []);

  const addToCart = (name: string, size = 39) => {
    const product = products.find((item) => item.name === name);
    if (!product) return;
    setCart((items) => {
      const existing = items.find((item) => item.name === name && item.size === size);
      if (existing && existing.quantity >= product.stock) {
        setNotice("Đã đạt số lượng tồn kho");
        return items;
      }
      return existing
        ? items.map((item) =>
            item.name === name && item.size === size ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...items, { ...product, size, quantity: 1 }];
    });
    setShowBag(false);
    setNotice(`Đã thêm ${name} vào giỏ hàng`);
    window.setTimeout(() => setNotice(""), 2500);
  };

  const updateQuantity = (name: string, size: number, change: number) => {
    setCart((items) =>
      items
        .map((item) =>
          item.name === name && item.size === size
            ? {
                ...item,
                quantity: Math.min(
                  item.stock,
                  Math.max(0, item.quantity + change),
                ),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const beginCheckout = () => {
    if (!cart.length) {
      setNotice("Giỏ hàng đang trống");
      window.setTimeout(() => setNotice(""), 2500);
      return;
    }
    setShowBag(false);
    setSelectedProduct(null);
    if (window.location.hash.startsWith("#shoe/")) {
      window.history.pushState({}, "", window.location.pathname + window.location.search);
    }
    if (!signedIn) {
      setCheckoutPendingLogin(true);
      setShowLogin(true);
      return;
    }
    setShowCheckout(true);
  };

  const toggleLike = (name: string) => {
    setLiked((items) =>
      items.includes(name) ? items.filter((item) => item !== name) : [...items, name],
    );
  };

  const openProduct = (product: Product) => {
    setSelectedSize(39);
    setSelectedProduct(product);
    window.history.pushState({}, "", `#shoe/${productSlug(product.name)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    if (window.location.hash.startsWith("#shoe/")) {
      window.history.pushState({}, "", window.location.pathname + window.location.search);
    }
  };

  if (selectedProduct && !showCheckout && !showLogin && !showRegister) {
    const product = selectedProduct;
    return (
      <div className="site-shell detail-shell">
        <div className="announcement"><span>Miễn phí vận chuyển cho đơn từ {formatVnd(FREE_SHIPPING)}</span><span className="announcement-detail">Đổi trả dễ dàng trong 30 ngày</span></div>
        <header className="header">
          <button className="wordmark logo-button" onClick={closeProduct} aria-label="Quay lại cửa hàng">STRIDE<span>.</span></button>
          <button className="return-link" onClick={closeProduct}>Quay lại cửa hàng <ArrowRight size={16} /></button>
          <button className="bag-button" aria-label={`${cartCount} sản phẩm trong giỏ hàng`} onClick={() => setShowBag(true)}>
            <ShoppingBag size={20} strokeWidth={1.8} /><span>Giỏ hàng</span><b>{cartCount}</b>
          </button>
        </header>
        {showBag && <div className="bag-overlay" onClick={() => setShowBag(false)} />}
        {showBag && <aside className="bag-drawer" aria-label="Giỏ hàng">
          <div className="drawer-header"><div><p className="eyebrow">Giỏ hàng</p><h2>{cartCount} sản phẩm</h2></div><button className="icon-button" onClick={() => setShowBag(false)} aria-label="Đóng giỏ hàng"><X size={21} /></button></div>
          {cart.length ? <div className="bag-items">{cart.map((item) => <div className="bag-item" key={`${item.name}-${item.size}`}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>{item.color} · Size {item.size}</span><div className="quantity-control"><button onClick={() => updateQuantity(item.name, item.size, -1)}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.name, item.size, 1)}>+</button></div></div><b>{formatVnd(item.price * item.quantity)}</b></div>)}</div> : <div className="empty-bag"><ShoppingBag size={30} /><p>Giỏ hàng đang chờ<br />món đồ phù hợp.</p></div>}
          <div className="bag-footer"><div><span>Tạm tính</span><strong>{formatVnd(cartTotal)}</strong></div><button className="primary-button checkout-button" onClick={beginCheckout}>Thanh toán <ArrowRight size={17} /></button></div>
        </aside>}
        <main className="product-detail-page">
          <section className="detail-gallery">
            {product.tag && <span className="product-tag">{product.tag}</span>}
            <button className={liked.includes(product.name) ? "heart-button liked" : "heart-button"} onClick={() => toggleLike(product.name)} aria-label={`Lưu ${product.name}`}>
              <Heart size={20} fill={liked.includes(product.name) ? "currentColor" : "none"} />
            </button>
            <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.style.display = "none"; }} />
          </section>
          <section className="detail-copy">
            <p className="eyebrow">{product.category} / Stride Athletics</p>
            <h1>{product.name}</h1>
            <div className="detail-meta"><div className="rating"><Star size={14} fill="currentColor" /> {product.rating} <span>({product.reviews} đánh giá)</span></div><strong>{formatVnd(product.price)}</strong></div>
            <p className="product-desc">{product.description}</p>
            <div className="detail-divider" />
            <p className="detail-label">Màu sắc</p>
            <div className="detail-color"><span /> {product.color}</div>
            <p className="detail-label">Chọn size EU</p>
            <div className="size-grid">
              {[38, 39, 40, 41, 42, 43, 44].map((size) => (
                <button key={size} type="button" className={selectedSize === size ? "active" : ""} onClick={() => setSelectedSize(size)}>{size}</button>
              ))}
            </div>
            <p className="stock-note">{product.stock > 0 ? `Còn hàng · Size ${selectedSize}` : "Tạm hết hàng"}</p>
            <button className="login-submit detail-add" type="button" onClick={() => addToCart(product.name, selectedSize)} disabled={product.stock < 1}>
              {product.stock < 1 ? "Hết hàng" : "Thêm vào giỏ hàng"} <ArrowRight size={17} />
            </button>
            <div className="detail-benefits"><div><strong>Miễn phí vận chuyển</strong><span>Cho đơn từ {formatVnd(FREE_SHIPPING)}</span></div><div><strong>Đổi trả dễ dàng</strong><span>Trong vòng 30 ngày</span></div></div>
          </section>
        </main>
        {notice && <div className="toast">{notice}<span>✓</span></div>}
        <footer><button className="wordmark logo-button" onClick={closeProduct}>STRIDE<span>.</span></button><p>© 2026 Stride Athletics</p></footer>
      </div>
    );
  }

  if (showRegister) {
    return (
      <div className="site-shell login-shell">
        <div className="announcement">
          <span>Miễn phí vận chuyển cho đơn từ {formatVnd(FREE_SHIPPING)}</span>
          <span className="announcement-detail">Đổi trả dễ dàng trong 30 ngày</span>
        </div>
        <header className="header">
          <button className="wordmark logo-button" onClick={() => setShowRegister(false)} aria-label="Trang chủ Stride">STRIDE<span>.</span></button>
          <button className="return-link" onClick={() => setShowRegister(false)}>Quay lại cửa hàng <ArrowRight size={16} /></button>
        </header>
        <main className="login-page">
          <div className="login-visual">
            <div className="login-visual-copy"><p className="eyebrow">Bắt đầu hành trình</p><h1>Tạo<br /><em>dấu ấn.</em></h1><p>Tham gia cộng đồng Stride để lưu sản phẩm yêu thích và nhận ưu đãi dành riêng cho bạn.</p></div>
            <div className="login-visual-mark">S<span>.</span></div>
          </div>
          <section className="login-card" aria-labelledby="register-title">
            <p className="eyebrow">Thành viên mới</p>
            <h2 id="register-title">Tạo tài khoản.</h2>
            <form className="login-form" onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const password = form.elements.namedItem("register-password") as HTMLInputElement;
              const confirmation = form.elements.namedItem("register-confirmation") as HTMLInputElement;
              if (password.value !== confirmation.value) {
                setNotice("Mật khẩu xác nhận chưa trùng khớp");
                window.setTimeout(() => setNotice(""), 2500);
                return;
              }
              setSignedIn(true);
              setShowRegister(false);
              setShowLogin(false);
              if (checkoutPendingLogin) {
                setShowCheckout(true);
                setCheckoutPendingLogin(false);
              } else {
                setNotice("Tạo tài khoản thành công");
              }
              window.setTimeout(() => setNotice(""), 2500);
            }}>
              <label>Họ và tên<input type="text" placeholder="Nguyễn Văn An" required /></label>
              <label>Địa chỉ email<input type="email" placeholder="you  @example.com" required /></label>
              <label>Mật khẩu<div className="password-field"><input name="register-password" type={registerPasswordVisible ? "text" : "password"} placeholder="Tối thiểu 6 ký tự" required minLength={6} /><button type="button" onClick={() => setRegisterPasswordVisible(!registerPasswordVisible)}>{registerPasswordVisible ? "Ẩn" : "Hiện"}</button></div></label>
              <label>Xác nhận mật khẩu<input name="register-confirmation" type="password" placeholder="Nhập lại mật khẩu" required minLength={6} /></label>
              <label className="remember"><input type="checkbox" required /> <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật</span></label>
              <button className="login-submit" type="submit">Tạo tài khoản <ArrowRight size={17} /></button>
              <p className="signup-prompt">Đã có tài khoản? <button type="button" onClick={() => { setShowRegister(false); setShowLogin(true); }}>Đăng nhập</button></p>
            </form>
          </section>
        </main>
        {notice && <div className="toast">{notice}<span>✓</span></div>}
        <footer><a className="wordmark" href="#top" onClick={(event) => { event.preventDefault(); setShowRegister(false); }}>STRIDE<span>.</span></a><p>© 2026 Stride Athletics</p><div><a href="#shop">Bảo mật</a><a href="#shop">Điều khoản</a><a href="#shop">Trợ giúp</a></div></footer>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="site-shell login-shell">
        <div className="announcement">
          <span>Miễn phí vận chuyển cho đơn từ {formatVnd(FREE_SHIPPING)}</span>
          <span className="announcement-detail">Đổi trả dễ dàng trong 30 ngày</span>
        </div>
        <header className="header">
          <button className="wordmark logo-button" onClick={() => { setShowLogin(false); setCheckoutPendingLogin(false); }} aria-label="Return to Stride home">STRIDE<span>.</span></button>
          <button className="return-link" onClick={() => { setShowLogin(false); setCheckoutPendingLogin(false); }}>Quay lại cửa hàng <ArrowRight size={16} /></button>
        </header>
        <main className="login-page">
          <div className="login-visual">
            <div className="login-visual-copy"><p className="eyebrow">Cộng đồng Stride</p><h1>Luôn<br /><em>tiến bước.</em></h1><p>Lưu phong cách yêu thích, theo dõi đơn hàng và tìm đôi giày cho thành tích tiếp theo của bạn.</p></div>
            <div className="login-visual-mark">S<span>.</span></div>
          </div>
          <section className="login-card" aria-labelledby="login-title">
            <p className="eyebrow">Chào mừng trở lại</p>
            <h2 id="login-title">Đăng nhập Stride.</h2>
            {loginSubmitted ? (
              <div className="login-success"><div>✓</div><h3>Kiểm tra hộp thư.</h3><p>Liên kết đăng nhập đã được gửi đến email của bạn.</p><button onClick={() => setLoginSubmitted(false)}>Dùng email khác</button></div>
            ) : (
              <form className="login-form" onSubmit={(event) => {
                event.preventDefault();
                setSignedIn(true);
                if (checkoutPendingLogin) {
                  setShowLogin(false);
                  setShowCheckout(true);
                  setCheckoutPendingLogin(false);
                } else {
                  setShowLogin(false);
                  setNotice("Đăng nhập thành công");
                  window.setTimeout(() => setNotice(""), 2500);
                }
              }}>
                <label>Địa chỉ email<input type="email" placeholder="you@example.com" required /></label>
                <label>Mật khẩu<div className="password-field"><input type={passwordVisible ? "text" : "password"} placeholder="Nhập mật khẩu" required minLength={6} /><button type="button" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? "Ẩn" : "Hiện"}</button></div></label>
                <div className="form-meta"><label className="remember"><input type="checkbox" /> <span>Ghi nhớ tôi</span></label><a href="#forgot" onClick={(event) => { event.preventDefault(); setNotice("Đã yêu cầu liên kết đặt lại mật khẩu"); window.setTimeout(() => setNotice(""), 2500); }}>Quên mật khẩu?</a></div>
                <button className="login-submit" type="submit">Đăng nhập <ArrowRight size={17} /></button>
                <div className="divider"><span>hoặc tiếp tục với</span></div>
                <button className="social-login" type="button"><span className="google-mark">G</span> Tiếp tục với Google</button>
                <p className="signup-prompt">Bạn chưa có tài khoản? <button type="button" onClick={() => setShowRegister(true)}>Tạo tài khoản</button></p>
              </form>
            )}
          </section>
        </main>
        {notice && <div className="toast">{notice}<span>✓</span></div>}
        <footer><a className="wordmark" href="#top" onClick={(event) => { event.preventDefault(); setShowLogin(false); }}>STRIDE<span>.</span></a><p>© 2026 Stride Athletics</p><div><a href="#shop">Bảo mật</a><a href="#shop">Điều khoản</a><a href="#journal">Trợ giúp</a></div></footer>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="site-shell checkout-shell">
        <div className="announcement"><span>Thanh toán an toàn</span><span className="announcement-detail">Miễn phí vận chuyển cho đơn từ {formatVnd(FREE_SHIPPING)}</span></div>
        <header className="header">
          <button className="wordmark logo-button" onClick={() => { setShowCheckout(false); closeProduct(); }} aria-label="Quay lại cửa hàng">STRIDE<span>.</span></button>
          <button className="return-link" onClick={() => { setShowCheckout(false); closeProduct(); }}>Quay lại cửa hàng <ArrowRight size={16} /></button>
        </header>
        {checkoutComplete ? (
          <main className="checkout-success-page">
            <div className="checkout-success-icon">✓</div>
            <p className="eyebrow">Đặt hàng thành công</p>
            <h1>Sẵn sàng<br /><em>bứt phá.</em></h1>
            <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ sớm gửi hóa đơn và thông tin theo dõi qua email.</p>
            <button className="primary-button" onClick={() => { setCart([]); setCheckoutComplete(false); setShowCheckout(false); closeProduct(); }}>Tiếp tục mua sắm <ArrowRight size={17} /></button>
          </main>
        ) : (
          <main className="checkout-page">
            <section className="checkout-form-panel">
              <p className="eyebrow">Sắp hoàn tất</p>
              <h1>Hoàn tất<br /><em>đơn hàng.</em></h1>
              <form className="checkout-form" onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                if (paymentMethod === "card") {
                  const expiry = form.elements.namedItem("expiry") as HTMLInputElement;
                  if (!isCardExpiryValid(expiry.value)) {
                    expiry.setCustomValidity("Ngày hết hạn không hợp lệ hoặc thẻ đã hết hạn");
                    expiry.reportValidity();
                    return;
                  }
                  expiry.setCustomValidity("");
                }
                if (!cart.length) { setShowCheckout(false); setNotice("Giỏ hàng đang trống"); return; }
                setCheckoutComplete(true);
              }}>
                <h2>Thông tin liên hệ</h2>
                <label>Địa chỉ email<input name="email" type="email" placeholder="you@example.com" required /></label>
                <h2>Địa chỉ giao hàng</h2>
                <div className="form-row"><label>Tên<input name="firstName" required /></label><label>Họ<input name="lastName" required /></label></div>
                <label>Địa chỉ<input name="address" required /></label>
                <div className="form-row"><label>Thành phố<input name="city" required /></label><label>Mã bưu chính<input name="postalCode" required pattern="[0-9A-Za-z -]{3,10}" /></label></div>
                <h2>Thanh toán</h2>
                <div className="payment-options">
                  <label className={paymentMethod === "card" ? "active" : ""}><input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} /> Thẻ thanh toán</label>
                  <label className={paymentMethod === "cod" ? "active" : ""}><input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /> Thanh toán khi nhận hàng</label>
                </div>
                {paymentMethod === "card" && <><label>Số thẻ<input name="cardNumber" inputMode="numeric" placeholder="4242 4242 4242 4242" required pattern="[0-9 ]{12,23}" /></label>
                <div className="form-row"><label>Ngày hết hạn<input name="expiry" placeholder="MM / YY" required maxLength={7} pattern="(0[1-9]|1[0-2])\s*/\s*[0-9]{2}" onInput={(event) => {
                  const input = event.currentTarget;
                  input.setCustomValidity("");
                  const digits = input.value.replace(/\D/g, "").slice(0, 4);
                  input.value = digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
                }} /></label><label>Mã bảo mật<input name="cvc" inputMode="numeric" placeholder="CVC" required pattern="[0-9]{3,4}" /></label></div></>}
                <button className="login-submit" type="submit">Đặt hàng <ArrowRight size={17} /></button>
              </form>
            </section>
            <aside className="order-summary"><p className="eyebrow">Đơn hàng của bạn</p><h2>{cartCount} sản phẩm</h2>{cart.map((item) => <div className="summary-item" key={`${item.name}-${item.size}`}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>Size {item.size} · Số lượng {item.quantity}</span></div><b>{formatVnd(item.price * item.quantity)}</b></div>)}<div className="summary-total"><span>Tạm tính</span><strong>{formatVnd(subtotal)}</strong></div><div className="summary-total"><span>Vận chuyển</span><strong>{shipping ? formatVnd(shipping) : "Miễn phí"}</strong></div><div className="summary-total"><span>Tổng cộng</span><strong>{formatVnd(cartTotal)}</strong></div></aside>
          </main>
        )}
      </div>
    );
  }

  return (
    <div className="site-shell">
      {notice && <div className="toast">{notice}<span>✓</span></div>}
      <div className="announcement">
        <span>Miễn phí vận chuyển cho đơn từ {formatVnd(FREE_SHIPPING)}</span>
        <span className="announcement-detail">Đổi trả dễ dàng trong 30 ngày</span>
      </div>

      <header className="header">
        <a className="wordmark" href="#top" aria-label="Trang chủ Stride">STRIDE<span>.</span></a>
        <nav className={menuOpen ? "main-nav open" : "main-nav"}>
          <a href="#shop" onClick={() => setMenuOpen(false)}>Cửa hàng</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Câu chuyện</a>
          <a href="#journal" onClick={() => setMenuOpen(false)}>Tạp chí</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-button" aria-label="Tìm kiếm" onClick={() => document.getElementById("search")?.focus()}>
            <Search size={20} strokeWidth={1.8} />
          </button>
          <button className="icon-button account-button" aria-label="Đăng nhập" onClick={() => setShowLogin(true)}>
            <UserRound size={20} strokeWidth={1.8} />
          </button>
          <button className="bag-button" aria-label={`${cartCount} sản phẩm trong giỏ hàng`} onClick={() => setShowBag(true)}>
            <ShoppingBag size={20} strokeWidth={1.8} /><span>Giỏ hàng</span><b>{cartCount}</b>
          </button>
          <button className="menu-button icon-button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {showBag && <div className="bag-overlay" onClick={() => setShowBag(false)} />}
      {showBag && <aside className="bag-drawer" aria-label="Giỏ hàng">
        <div className="drawer-header"><div><p className="eyebrow">Giỏ hàng</p><h2>{cartCount} sản phẩm</h2></div><button className="icon-button" onClick={() => setShowBag(false)} aria-label="Đóng giỏ hàng"><X size={21} /></button></div>
        {cart.length ? <div className="bag-items">{cart.map((item) => <div className="bag-item" key={`${item.name}-${item.size}`}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>{item.color} · Size {item.size}</span><div className="quantity-control"><button onClick={() => updateQuantity(item.name, item.size, -1)} aria-label={`Xóa một ${item.name}`}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.name, item.size, 1)} aria-label={`Thêm một ${item.name}`}>+</button></div></div><b>{formatVnd(item.price * item.quantity)}</b></div>)}</div> : <div className="empty-bag"><ShoppingBag size={30} /><p>Giỏ hàng đang chờ<br />món đồ phù hợp.</p></div>}
        <div className="bag-footer"><div><span>Tạm tính</span><strong>{formatVnd(cartTotal)}</strong></div><button className="primary-button checkout-button" onClick={beginCheckout}>Thanh toán <ArrowRight size={17} /></button><small>Thuế và phí vận chuyển được tính khi thanh toán.</small></div>
      </aside>}

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Sẵn sàng cho mọi hành trình</p>
            <h1>Bước đi<br /><em>khác biệt.</em></h1>
            <p className="hero-description">Giày hiệu năng dành cho mọi người yêu thể thao. Thiết kế để đi xa hơn trên mọi cung đường.</p>
            <a href="#shop" className="primary-button">Khám phá bộ sưu tập <ArrowRight size={17} /></a>
          </div>
          <div className="hero-image-wrap">
            <div className="hero-sticker">Thiết kế<br />để chuyển động</div>
            <img className="hero-image" src="https://images.unsplash.com/photo-1556637640-2c80d3201be8?auto=format&fit=crop&w=1400&q=90" alt="Vận động viên mang giày chạy bộ sáng màu" onError={(event) => { event.currentTarget.style.display = "none"; }} />
            <div className="hero-caption"><span>01 / 04</span><span>Xuân / Hè 2026</span></div>
          </div>
        </section>

        <section className="marquee" aria-label="Đặc điểm Stride">
          <div>NHẸ NHÀNG <span>✦</span> ÊM ÁI <span>✦</span> BỀN BỈ <span>✦</span> NHẸ NHÀNG <span>✦</span> ÊM ÁI <span>✦</span></div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div><p className="eyebrow">Bộ sưu tập</p><h2>Tìm nhịp bước riêng.</h2></div>
            <p className="section-note">Sự thoải mái được chăm chút cho mọi chuyển động.</p>
          </div>
          <div className="shop-toolbar">
            <div className="category-tabs">
              {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{categoryLabels[item]}</button>)}
            </div>
            <label className="search-field"><Search size={17} /><input id="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm kiếm sản phẩm" /><button type="button" aria-label="Xóa tìm kiếm" onClick={() => setQuery("")}>{query && <X size={15} />}</button></label>
            <div className="sort-wrap">
              <button className="sort-button" type="button" aria-expanded={sortOpen} onClick={() => setSortOpen((open) => !open)}>
                Sắp xếp <strong>{sort === "featured" ? "Nổi bật" : sort === "price-asc" ? "Giá tăng dần" : sort === "price-desc" ? "Giá giảm dần" : "Đánh giá cao"}</strong><ChevronDown size={16} />
              </button>
              {sortOpen && (
                <div className="sort-menu" role="menu">
                  {([
                    ["featured", "Nổi bật"],
                    ["price-asc", "Giá tăng dần"],
                    ["price-desc", "Giá giảm dần"],
                    ["rating", "Đánh giá cao"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={sort === value ? "active" : ""}
                      onClick={() => { setSort(value); setSortOpen(false); }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-image">
                  {product.tag && <span className="product-tag">{product.tag}</span>}
                  <button className={liked.includes(product.name) ? "heart-button liked" : "heart-button"} onClick={() => toggleLike(product.name)} aria-label={`Lưu ${product.name}`}>
                    <Heart size={18} fill={liked.includes(product.name) ? "currentColor" : "none"} />
                  </button>
                  <img src={product.image} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  <button className="product-open" type="button" onClick={() => openProduct(product)} aria-label={`Xem chi tiết ${product.name}`} />
                  <button className="quick-add" onClick={() => addToCart(product.name)} disabled={product.stock < 1}>{product.stock < 1 ? "Hết hàng" : "Thêm nhanh"} <span>+</span></button>
                </div>
                <div className="product-info">
                  <div><h3><button className="name-button" type="button" onClick={() => openProduct(product)}>{product.name}</button></h3><p>{product.color}</p></div>
                  <strong>{formatVnd(product.price)}</strong>
                </div>
                <div className="rating"><Star size={13} fill="currentColor" /> {product.rating} <span>({product.reviews})</span></div>
              </article>
            ))}
          </div>
          {filteredProducts.length === 0 && <p className="empty-state">Không tìm thấy sản phẩm. Hãy thử từ khóa khác.</p>}
          <div className="view-all"><a href="#shop">Xem tất cả giày <ArrowRight size={17} /></a></div>
        </section>

        <section className="story-section" id="story">
          <div className="story-image"><img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=85" alt="Vận động viên chạy trên đường đua" onError={(event) => { event.currentTarget.style.display = "none"; }} /></div>
          <div className="story-copy"><p className="eyebrow">Vì sao là Stride</p><h2>Giày tốt.<br /><em>Năng lượng tốt.</em></h2><p>Chúng tôi tin rằng thiết bị tốt nhất sẽ giúp bạn tập trung vào hành trình. Giày Stride kết hợp thiết kế tinh tế với hiệu năng cả ngày để bạn luôn tiến về phía trước.</p><a href="#journal" className="text-link">Cách chúng tôi làm <ArrowRight size={17} /></a></div>
        </section>

        <section className="newsletter" id="journal"><p className="eyebrow">Luôn chuyển động</p><h2>Sản phẩm mới.<br />Năng lượng tốt.</h2><p>Đăng ký để nhận thông tin sớm, những câu chuyện thú vị và giảm 10% cho đơn hàng đầu tiên.</p><form onSubmit={(event) => { event.preventDefault(); const input = event.currentTarget.elements.namedItem("newsletter") as HTMLInputElement; input.value = ""; setNotice("Đã đăng ký nhận tin thành công"); window.setTimeout(() => setNotice(""), 2500); }}><input name="newsletter" type="email" aria-label="Địa chỉ email" placeholder="Địa chỉ email của bạn" required /><button type="submit" aria-label="Đăng ký"><ArrowRight size={20} /></button></form></section>
      </main>
      <footer><a className="wordmark" href="#top">STRIDE<span>.</span></a><p>© 2026 Stride Athletics</p><div><a href="#shop">Instagram</a><a href="#journal">Liên hệ</a><a href="#shop">Vận chuyển & đổi trả</a></div></footer>
    </div>
  );
}
