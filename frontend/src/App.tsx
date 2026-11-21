import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  Star,
  X,
} from "lucide-react";
import { api, ApiError } from "./api";
import type { CartItem, Category, Order, Product, SortId, User, View } from "./types";

const categories: Category[] = ["All", "Running", "Training", "Lifestyle"];
const categoryLabels: Record<Category, string> = {
  All: "Tất cả",
  Running: "Chạy bộ",
  Training: "Luyện tập",
  Lifestyle: "Phong cách",
};
const sortLabels: Record<SortId, string> = {
  featured: "Nổi bật",
  "price-asc": "Giá tăng dần",
  "price-desc": "Giá giảm dần",
  rating: "Đánh giá cao",
};
const CART_KEY = "stride.cart";
const LIKES_KEY = "stride.likes";
const FREE_SHIPPING = 1_000_000;

const formatVnd = (amount: number) => `${amount.toLocaleString("vi-VN")} VNĐ`;

function loadLocalCart(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadLocalLikes(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(LIKES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function cartLineKey(item: Pick<CartItem, "productId" | "size">) {
  return `${item.productId}:${item.size}`;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeError, setNoticeError] = useState(false);
  const [view, setView] = useState<View>("shop");
  const [showBag, setShowBag] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const skipSync = useRef(true);
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>();

  const signedIn = Boolean(user);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : 30000;
  const cartTotal = subtotal + shipping;

  const filteredProducts = useMemo(() => {
    const list = products.filter(
      (product) =>
        (category === "All" || product.category === category) &&
        product.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, query, sort]);

  const toast = (message: string, isError = false) => {
    window.clearTimeout(noticeTimer.current);
    setNotice(message);
    setNoticeError(isError);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 2800);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [catalog, session] = await Promise.all([api.products(), api.me()]);
        if (cancelled) return;
        setProducts(catalog.products);
        if (session.user) {
          setUser(session.user);
          setLiked(session.user.likes);
          setCart(session.cart.items);
        } else {
          setCart(loadLocalCart());
          setLiked(loadLocalLikes());
        }
      } catch {
        if (!cancelled) {
          setCart(loadLocalCart());
          setLiked(loadLocalLikes());
          toast("Không tải được dữ liệu cửa hàng", true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          skipSync.current = false;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (skipSync.current) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (!user) return;
    const handle = window.setTimeout(() => {
      api.saveCart(cart).catch(() => toast("Không lưu được giỏ hàng", true));
    }, 250);
    return () => window.clearTimeout(handle);
  }, [cart, user]);

  useEffect(() => {
    if (!user) localStorage.setItem(LIKES_KEY, JSON.stringify(liked));
  }, [liked, user]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setShowBag(false);
      setActiveProduct(null);
      setMenuOpen(false);
      setSortOpen(false);
      setAccountOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goShop = () => {
    setView("shop");
    setCheckoutPending(false);
    setPlacedOrder(null);
    setMenuOpen(false);
  };

  const openProduct = (product: Product) => {
    setActiveProduct(product);
    setSelectedSize(product.sizes.includes(41) ? 41 : product.sizes[0] ?? null);
  };

  const addToCart = (product: Product, size: number | null) => {
    if (size == null) {
      toast("Vui lòng chọn size", true);
      return;
    }
    if (!product.sizes.includes(size)) {
      toast("Size không khả dụng", true);
      return;
    }
    if (product.stock < 1) {
      toast("Sản phẩm đã hết hàng", true);
      return;
    }
    const existing = cart.find((item) => item.productId === product.id && item.size === size);
    const nextQty = (existing?.quantity ?? 0) + 1;
    if (nextQty > product.stock) {
      toast("Đã đạt số lượng tồn kho", true);
      return;
    }
    setCart((items) => {
      const current = items.find((item) => item.productId === product.id && item.size === size);
      if (current) {
        return items.map((item) =>
          item.productId === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1, stock: product.stock, price: product.price }
            : item,
        );
      }
      return [
        ...items,
        {
          productId: product.id,
          size,
          quantity: 1,
          name: product.name,
          price: product.price,
          image: product.image,
          color: product.color,
          stock: product.stock,
        },
      ];
    });
    setShowBag(false);
    setActiveProduct(null);
    toast(`Đã thêm ${product.name} (size ${size}) vào giỏ`);
  };

  const updateQuantity = (productId: string, size: number, change: number) => {
    const current = cart.find((item) => item.productId === productId && item.size === size);
    if (!current) return;
    if (change > 0 && current.quantity >= current.stock) {
      toast("Đã đạt số lượng tồn kho", true);
      return;
    }
    setCart((items) =>
      items
        .map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const beginCheckout = () => {
    if (!cart.length) {
      toast("Giỏ hàng đang trống", true);
      return;
    }
    setShowBag(false);
    if (!signedIn) {
      setCheckoutPending(true);
      setView("login");
      return;
    }
    setPlacedOrder(null);
    setView("checkout");
  };

  const toggleLike = async (product: Product) => {
    const already = liked.includes(product.id);
    setLiked((items) => (already ? items.filter((id) => id !== product.id) : [...items, product.id]));
    if (!user) {
      toast(already ? "Đã bỏ khỏi yêu thích" : "Đã lưu vào yêu thích");
      return;
    }
    try {
      const result = await api.toggleLike(product.id);
      setLiked(result.likes);
    } catch (error) {
      setLiked((items) => (already ? [...items, product.id] : items.filter((id) => id !== product.id)));
      toast(error instanceof ApiError ? error.message : "Không lưu được sản phẩm", true);
    }
  };

  const handleAuth = async (event: FormEvent<HTMLFormElement>, mode: "login" | "register") => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    if (mode === "register") {
      const confirmation = (form.elements.namedItem("confirmation") as HTMLInputElement).value;
      if (password !== confirmation) {
        toast("Mật khẩu xác nhận chưa trùng khớp", true);
        return;
      }
    }
    setBusy(true);
    try {
      const result =
        mode === "register"
          ? await api.register({
              name: (form.elements.namedItem("name") as HTMLInputElement).value,
              email,
              password,
              cart,
              likes: liked,
            })
          : await api.login({ email, password, cart, likes: liked });
      skipSync.current = true;
      setUser(result.user);
      setLiked(result.user.likes);
      setCart(result.cart.items);
      localStorage.setItem(CART_KEY, JSON.stringify(result.cart.items));
      skipSync.current = false;
      if (checkoutPending) {
        setCheckoutPending(false);
        setView("checkout");
      } else {
        setView("shop");
        toast(mode === "register" ? "Tạo tài khoản thành công" : `Xin chào, ${result.user.name}`);
      }
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Không thể xác thực", true);
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await api.logout().catch(() => undefined);
    setUser(null);
    setOrders([]);
    setAccountOpen(false);
    setView("shop");
    toast("Đã đăng xuất");
  };

  const openAccount = async () => {
    if (!user) {
      setView("login");
      return;
    }
    setAccountOpen(false);
    setView("account");
    try {
      const result = await api.orders();
      setOrders(result.orders);
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Không tải được đơn hàng", true);
    }
  };

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    try {
      const body: Record<string, string> = {
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
        lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
        address: (form.elements.namedItem("address") as HTMLInputElement).value,
        city: (form.elements.namedItem("city") as HTMLInputElement).value,
        postalCode: (form.elements.namedItem("postalCode") as HTMLInputElement).value,
        paymentMethod,
      };
      if (paymentMethod === "card") {
        body.cardNumber = (form.elements.namedItem("cardNumber") as HTMLInputElement).value;
        body.expiry = (form.elements.namedItem("expiry") as HTMLInputElement).value;
        body.cvc = (form.elements.namedItem("cvc") as HTMLInputElement).value;
      }
      const result = await api.checkout(body);
      skipSync.current = true;
      setCart([]);
      localStorage.setItem(CART_KEY, "[]");
      skipSync.current = false;
      setPlacedOrder(result.order);
      setProducts((items) =>
        items.map((product) => {
          const sold = result.order.items
            .filter((item) => item.productId === product.id)
            .reduce((sum, item) => sum + item.quantity, 0);
          return sold ? { ...product, stock: Math.max(0, product.stock - sold) } : product;
        }),
      );
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Không đặt được hàng", true);
    } finally {
      setBusy(false);
    }
  };

  const submitNewsletter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("newsletter") as HTMLInputElement;
    try {
      const result = await api.newsletter(input.value);
      input.value = "";
      toast(result.message);
    } catch (error) {
      toast(error instanceof ApiError ? error.message : "Không đăng ký được", true);
    }
  };

  const toastNode = notice ? (
    <div className={noticeError ? "toast toast-error" : "toast"} role="status">
      {notice}
      <span>{noticeError ? "!" : "✓"}</span>
    </div>
  ) : null;

  const storeHeader = (backLabel = "Quay lại cửa hàng") => (
    <header className="header">
      <button className="wordmark logo-button" onClick={goShop} aria-label="Trang chủ Stride">
        STRIDE<span>.</span>
      </button>
      <button className="return-link" onClick={goShop}>
        {backLabel} <ArrowRight size={16} />
      </button>
    </header>
  );

  if (loading) {
    return (
      <div className="site-shell loading-shell">
        <p className="eyebrow">Stride</p>
        <h1>Đang tải<br /><em>cửa hàng.</em></h1>
      </div>
    );
  }

  if (view === "register") {
    return (
      <div className="site-shell login-shell">
        {toastNode}
        <div className="announcement">
          <span>Miễn phí vận chuyển cho đơn từ {formatVnd(FREE_SHIPPING)}</span>
          <span className="announcement-detail">Đổi trả dễ dàng trong 30 ngày</span>
        </div>
        {storeHeader()}
        <main className="login-page">
          <div className="login-visual">
            <div className="login-visual-copy">
              <p className="eyebrow">Bắt đầu hành trình</p>
              <h1>Tạo<br /><em>dấu ấn.</em></h1>
              <p>Tham gia cộng đồng Stride để lưu sản phẩm yêu thích và theo dõi đơn hàng.</p>
            </div>
            <div className="login-visual-mark">S<span>.</span></div>
          </div>
          <section className="login-card" aria-labelledby="register-title">
            <p className="eyebrow">Thành viên mới</p>
            <h2 id="register-title">Tạo tài khoản.</h2>
            <form className="login-form" onSubmit={(event) => handleAuth(event, "register")}>
              <label>Họ và tên<input name="name" type="text" placeholder="Nguyễn Văn An" required minLength={2} autoComplete="name" /></label>
              <label>Địa chỉ email<input name="email" type="email" placeholder="you@example.com" required autoComplete="email" /></label>
              <label>Mật khẩu
                <div className="password-field">
                  <input name="password" type={registerPasswordVisible ? "text" : "password"} placeholder="Tối thiểu 6 ký tự" required minLength={6} autoComplete="new-password" />
                  <button type="button" onClick={() => setRegisterPasswordVisible((value) => !value)}>{registerPasswordVisible ? "Ẩn" : "Hiện"}</button>
                </div>
              </label>
              <label>Xác nhận mật khẩu<input name="confirmation" type="password" placeholder="Nhập lại mật khẩu" required minLength={6} autoComplete="new-password" /></label>
              <label className="remember"><input type="checkbox" required /> <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật</span></label>
              <button className="login-submit" type="submit" disabled={busy}>{busy ? "Đang tạo..." : "Tạo tài khoản"} <ArrowRight size={17} /></button>
              <p className="signup-prompt">Đã có tài khoản? <button type="button" onClick={() => setView("login")}>Đăng nhập</button></p>
            </form>
          </section>
        </main>
        <footer>
          <button className="wordmark logo-button" onClick={goShop}>STRIDE<span>.</span></button>
          <p>© 2026 Stride Athletics</p>
          <div><a href="#shop">Bảo mật</a><a href="#shop">Điều khoản</a><a href="#shop">Trợ giúp</a></div>
        </footer>
      </div>
    );
  }

  if (view === "login") {
    return (
      <div className="site-shell login-shell">
        {toastNode}
        <div className="announcement">
          <span>Miễn phí vận chuyển cho đơn từ {formatVnd(FREE_SHIPPING)}</span>
          <span className="announcement-detail">Đổi trả dễ dàng trong 30 ngày</span>
        </div>
        {storeHeader()}
        <main className="login-page">
          <div className="login-visual">
            <div className="login-visual-copy">
              <p className="eyebrow">Cộng đồng Stride</p>
              <h1>Luôn<br /><em>tiến bước.</em></h1>
              <p>Lưu phong cách yêu thích, theo dõi đơn hàng và tìm đôi giày cho thành tích tiếp theo.</p>
            </div>
            <div className="login-visual-mark">S<span>.</span></div>
          </div>
          <section className="login-card" aria-labelledby="login-title">
            <p className="eyebrow">Chào mừng trở lại</p>
            <h2 id="login-title">Đăng nhập Stride.</h2>
            <form className="login-form" onSubmit={(event) => handleAuth(event, "login")}>
              <label>Địa chỉ email<input name="email" type="email" placeholder="demo@stride.vn" required autoComplete="email" /></label>
              <label>Mật khẩu
                <div className="password-field">
                  <input name="password" type={passwordVisible ? "text" : "password"} placeholder="Nhập mật khẩu" required minLength={6} autoComplete="current-password" />
                  <button type="button" onClick={() => setPasswordVisible((value) => !value)}>{passwordVisible ? "Ẩn" : "Hiện"}</button>
                </div>
              </label>
              <div className="form-meta">
                <label className="remember"><input type="checkbox" /> <span>Ghi nhớ tôi</span></label>
                <button type="button" className="text-button" onClick={() => toast("Hãy dùng tài khoản demo@stride.vn / stride123")}>Quên mật khẩu?</button>
              </div>
              <button className="login-submit" type="submit" disabled={busy}>{busy ? "Đang đăng nhập..." : "Đăng nhập"} <ArrowRight size={17} /></button>
              <p className="demo-hint">Thử nhanh: demo@stride.vn / stride123</p>
              <p className="signup-prompt">Bạn chưa có tài khoản? <button type="button" onClick={() => setView("register")}>Tạo tài khoản</button></p>
            </form>
          </section>
        </main>
        <footer>
          <button className="wordmark logo-button" onClick={goShop}>STRIDE<span>.</span></button>
          <p>© 2026 Stride Athletics</p>
          <div><a href="#shop">Bảo mật</a><a href="#shop">Điều khoản</a></div>
        </footer>
      </div>
    );
  }

  if (view === "checkout") {
    return (
      <div className="site-shell checkout-shell">
        {toastNode}
        <div className="announcement">
          <span>Thanh toán an toàn</span>
          <span className="announcement-detail">Miễn phí vận chuyển cho đơn từ {formatVnd(FREE_SHIPPING)}</span>
        </div>
        {storeHeader()}
        {placedOrder ? (
          <main className="checkout-success-page">
            <div className="checkout-success-icon">✓</div>
            <p className="eyebrow">Đặt hàng thành công</p>
            <h1>Sẵn sàng<br /><em>bứt phá.</em></h1>
            <p>Mã đơn <strong>{placedOrder.id}</strong>. Chúng tôi sẽ gửi xác nhận tới {placedOrder.contact.email}.</p>
            <p className="order-pay-hint">{placedOrder.paymentHint} · Tổng {formatVnd(placedOrder.total)}</p>
            <button className="primary-button" onClick={goShop}>Tiếp tục mua sắm <ArrowRight size={17} /></button>
          </main>
        ) : (
          <main className="checkout-page">
            <section className="checkout-form-panel">
              <p className="eyebrow">Sắp hoàn tất</p>
              <h1>Hoàn tất<br /><em>đơn hàng.</em></h1>
              <form className="checkout-form" onSubmit={submitCheckout}>
                <h2>Thông tin liên hệ</h2>
                <label>Địa chỉ email<input name="email" type="email" defaultValue={user?.email ?? ""} required /></label>
                <h2>Địa chỉ giao hàng</h2>
                <div className="form-row">
                  <label>Tên<input name="firstName" required /></label>
                  <label>Họ<input name="lastName" required /></label>
                </div>
                <label>Địa chỉ<input name="address" required /></label>
                <div className="form-row">
                  <label>Thành phố<input name="city" required /></label>
                  <label>Mã bưu chính<input name="postalCode" pattern="[0-9A-Za-z -]{3,10}" placeholder="700000" /></label>
                </div>
                <h2>Thanh toán</h2>
                <div className="payment-options">
                  <label className={paymentMethod === "cod" ? "active" : ""}>
                    <input type="radio" name="pay" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                    Thanh toán khi nhận hàng
                  </label>
                  <label className={paymentMethod === "card" ? "active" : ""}>
                    <input type="radio" name="pay" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                    Thẻ (mô phỏng)
                  </label>
                </div>
                {paymentMethod === "card" && (
                  <>
                    <label>Số thẻ<input name="cardNumber" inputMode="numeric" placeholder="4242 4242 4242 4242" required minLength={12} /></label>
                    <div className="form-row">
                      <label>Ngày hết hạn<input name="expiry" placeholder="MM / YY" required /></label>
                      <label>Mã bảo mật<input name="cvc" inputMode="numeric" placeholder="CVC" required minLength={3} /></label>
                    </div>
                    <small className="field-hint">Cổng thanh toán mô phỏng — không lưu số thẻ. Dùng 4242 4242 4242 4242.</small>
                  </>
                )}
                <button className="login-submit" type="submit" disabled={busy || !cart.length}>
                  {busy ? "Đang xử lý..." : `Đặt hàng · ${formatVnd(cartTotal)}`} <ArrowRight size={17} />
                </button>
              </form>
            </section>
            <aside className="order-summary">
              <p className="eyebrow">Đơn hàng của bạn</p>
              <h2>{cartCount} sản phẩm</h2>
              {cart.map((item) => (
                <div className="summary-item" key={cartLineKey(item)}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>Size {item.size} · SL {item.quantity}</span>
                  </div>
                  <b>{formatVnd(item.price * item.quantity)}</b>
                </div>
              ))}
              <div className="summary-lines">
                <div><span>Tạm tính</span><span>{formatVnd(subtotal)}</span></div>
                <div><span>Vận chuyển</span><span>{shipping ? formatVnd(shipping) : "Miễn phí"}</span></div>
              </div>
              <div className="summary-total"><span>Tổng cộng</span><strong>{formatVnd(cartTotal)}</strong></div>
            </aside>
          </main>
        )}
      </div>
    );
  }

  if (view === "account") {
    return (
      <div className="site-shell">
        {toastNode}
        <div className="announcement">
          <span>Xin chào, {user?.name}</span>
          <span className="announcement-detail">{user?.email}</span>
        </div>
        {storeHeader("Về cửa hàng")}
        <main className="account-page">
          <p className="eyebrow">Tài khoản</p>
          <h1>Đơn hàng<br /><em>của bạn.</em></h1>
          {orders.length === 0 ? (
            <p className="empty-state">Chưa có đơn hàng. Hãy chọn đôi giày đầu tiên.</p>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <header>
                    <strong>{order.id}</strong>
                    <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
                  </header>
                  {order.items.map((item) => (
                    <p key={`${item.productId}-${item.size}`}>{item.name} · size {item.size} × {item.quantity}</p>
                  ))}
                  <footer>
                    <span>{order.paymentHint}</span>
                    <b>{formatVnd(order.total)}</b>
                  </footer>
                </article>
              ))}
            </div>
          )}
          <button className="secondary-button" onClick={logout}>Đăng xuất</button>
        </main>
      </div>
    );
  }

  return (
    <div className="site-shell">
      {toastNode}
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
          <div className="account-wrap">
            <button
              className="icon-button account-button"
              aria-label={signedIn ? "Tài khoản" : "Đăng nhập"}
              onClick={() => (signedIn ? setAccountOpen((value) => !value) : setView("login"))}
            >
              <UserRound size={20} strokeWidth={1.8} />
            </button>
            {accountOpen && signedIn && (
              <div className="account-menu">
                <p>{user?.name}</p>
                <button type="button" onClick={openAccount}>Đơn hàng</button>
                <button type="button" onClick={logout}>Đăng xuất</button>
              </div>
            )}
          </div>
          <button className="bag-button" aria-label={`${cartCount} sản phẩm trong giỏ hàng`} onClick={() => setShowBag(true)}>
            <ShoppingBag size={20} strokeWidth={1.8} /><span>Giỏ hàng</span><b>{cartCount}</b>
          </button>
          <button className="menu-button icon-button" aria-label={menuOpen ? "Đóng menu" : "Mở menu"} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {showBag && <div className="bag-overlay" onClick={() => setShowBag(false)} />}
      {showBag && (
        <aside className="bag-drawer" aria-label="Giỏ hàng">
          <div className="drawer-header">
            <div>
              <p className="eyebrow">Giỏ hàng</p>
              <h2>{cartCount} sản phẩm</h2>
            </div>
            <button className="icon-button" onClick={() => setShowBag(false)} aria-label="Đóng giỏ hàng"><X size={21} /></button>
          </div>
          {cart.length ? (
            <div className="bag-items">
              {cart.map((item) => (
                <div className="bag-item" key={cartLineKey(item)}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.color} · Size {item.size}</span>
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.productId, item.size, -1)} aria-label={`Giảm ${item.name}`}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.size, 1)} aria-label={`Tăng ${item.name}`}>+</button>
                    </div>
                  </div>
                  <b>{formatVnd(item.price * item.quantity)}</b>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-bag"><ShoppingBag size={30} /><p>Giỏ hàng đang chờ<br />món đồ phù hợp.</p></div>
          )}
          <div className="bag-footer">
            <div><span>Tạm tính</span><strong>{formatVnd(subtotal)}</strong></div>
            <div className="shipping-line"><span>Vận chuyển</span><strong>{shipping ? formatVnd(shipping) : "Miễn phí"}</strong></div>
            <button className="primary-button checkout-button" onClick={beginCheckout} disabled={!cart.length}>
              Thanh toán <ArrowRight size={17} />
            </button>
            <small>Đơn từ {formatVnd(FREE_SHIPPING)} được miễn phí vận chuyển.</small>
          </div>
        </aside>
      )}

      {activeProduct && (
        <>
          <div className="bag-overlay" onClick={() => setActiveProduct(null)} />
          <aside className="product-drawer" aria-label={activeProduct.name}>
            <button className="icon-button drawer-close" onClick={() => setActiveProduct(null)} aria-label="Đóng"><X size={21} /></button>
            <img src={activeProduct.image} alt={activeProduct.name} />
            <p className="eyebrow">{categoryLabels[activeProduct.category]}</p>
            <h2>{activeProduct.name}</h2>
            <p className="product-desc">{activeProduct.description}</p>
            <strong className="detail-price">{formatVnd(activeProduct.price)}</strong>
            <p className="size-label">Chọn size EU</p>
            <div className="size-grid">
              {activeProduct.sizes.map((size) => (
                <button key={size} className={selectedSize === size ? "active" : ""} onClick={() => setSelectedSize(size)}>
                  {size}
                </button>
              ))}
            </div>
            <p className="stock-note">{activeProduct.stock > 0 ? `Còn ${activeProduct.stock} đôi` : "Hết hàng"}</p>
            <button
              className="primary-button checkout-button"
              onClick={() => addToCart(activeProduct, selectedSize)}
              disabled={activeProduct.stock < 1}
            >
              Thêm vào giỏ <ArrowRight size={17} />
            </button>
          </aside>
        </>
      )}

      <main id="top">
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
              {categories.map((item) => (
                <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
                  {categoryLabels[item]}
                </button>
              ))}
            </div>
            <label className="search-field">
              <Search size={17} />
              <input id="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm sản phẩm" />
              <button type="button" aria-label="Xóa tìm kiếm" onClick={() => setQuery("")}>{query && <X size={15} />}</button>
            </label>
            <div className="sort-wrap">
              <button className="sort-button" onClick={() => setSortOpen((value) => !value)} type="button">
                Sắp xếp <strong>{sortLabels[sort]}</strong><ChevronDown size={16} />
              </button>
              {sortOpen && (
                <div className="sort-menu">
                  {(Object.keys(sortLabels) as SortId[]).map((id) => (
                    <button key={id} className={sort === id ? "active" : ""} onClick={() => { setSort(id); setSortOpen(false); }}>
                      {sortLabels[id]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  {product.tag && <span className="product-tag">{product.tag}</span>}
                  <button className={liked.includes(product.id) ? "heart-button liked" : "heart-button"} onClick={() => toggleLike(product)} aria-label={`Lưu ${product.name}`}>
                    <Heart size={18} fill={liked.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                  <button className="product-open" onClick={() => openProduct(product)} aria-label={`Xem ${product.name}`}>
                    <img src={product.image} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  </button>
                  <button className="quick-add" onClick={() => openProduct(product)} disabled={product.stock < 1}>
                    {product.stock < 1 ? "Hết hàng" : "Chọn size"} <span>+</span>
                  </button>
                </div>
                <div className="product-info">
                  <div>
                    <h3><button type="button" className="name-button" onClick={() => openProduct(product)}>{product.name}</button></h3>
                    <p>{product.color}</p>
                  </div>
                  <strong>{formatVnd(product.price)}</strong>
                </div>
                <div className="rating"><Star size={13} fill="currentColor" /> {product.rating.toFixed(1)} <span>({product.reviews})</span></div>
              </article>
            ))}
          </div>
          {filteredProducts.length === 0 && <p className="empty-state">Không tìm thấy sản phẩm. Hãy thử từ khóa khác.</p>}
        </section>

        <section className="story-section" id="story">
          <div className="story-image">
            <img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1200&q=85" alt="Vận động viên chạy trên đường đua" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          </div>
          <div className="story-copy">
            <p className="eyebrow">Vì sao là Stride</p>
            <h2>Giày tốt.<br /><em>Năng lượng tốt.</em></h2>
            <p>Chúng tôi tin rằng thiết bị tốt nhất sẽ giúp bạn tập trung vào hành trình. Giày Stride kết hợp thiết kế tinh tế với hiệu năng cả ngày để bạn luôn tiến về phía trước.</p>
            <a href="#journal" className="text-link">Cách chúng tôi làm <ArrowRight size={17} /></a>
          </div>
        </section>

        <section className="newsletter" id="journal">
          <p className="eyebrow">Luôn chuyển động</p>
          <h2>Sản phẩm mới.<br />Năng lượng tốt.</h2>
          <p>Đăng ký để nhận thông tin sớm, những câu chuyện thú vị và giảm 10% cho đơn hàng đầu tiên.</p>
          <form onSubmit={submitNewsletter}>
            <input name="newsletter" type="email" aria-label="Địa chỉ email" placeholder="Địa chỉ email của bạn" required />
            <button type="submit" aria-label="Đăng ký"><ArrowRight size={20} /></button>
          </form>
        </section>
      </main>
      <footer>
        <a className="wordmark" href="#top">STRIDE<span>.</span></a>
        <p>© 2026 Stride Athletics</p>
        <div>
          <a href="#shop">Cửa hàng</a>
          <a href="#story">Câu chuyện</a>
          <a href="#journal">Liên hệ</a>
        </div>
      </footer>
    </div>
  );
}
