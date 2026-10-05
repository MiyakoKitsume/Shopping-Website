import { useMemo, useState } from "react";
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
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    name: "Aero Glide 3",
    category: "Running",
    price: 140000,
    rating: "4.9",
    reviews: "128",
    color: "Đen / Vàng neon",
    tag: "Mới",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Cloudsurfer Max",
    category: "Running",
    price: 160000,
    rating: "4.8",
    reviews: "94",
    color: "Trắng / Bạc",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Everyday Knit",
    category: "Lifestyle",
    price: 110000,
    rating: "4.7",
    reviews: "215",
    color: "Xanh sage / Kem",
    tag: "Bán chạy",
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Court Vision Pro",
    category: "Training",
    price: 125000,
    rating: "4.8",
    reviews: "76",
    color: "Đất nung / Cao su",
    image:
      "https://images.unsplash.com/photo-1554135367-3ec7b2b7c1e4?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Trail Finder GTX",
    category: "Running",
    price: 175000,
    rating: "4.9",
    reviews: "51",
    color: "Đá / Cam",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Lift Trainer 01",
    category: "Training",
    price: 130000,
    rating: "4.6",
    reviews: "68",
    color: "Đen / Trắng",
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=85",
  },
];

const categories: Category[] = ["All", "Running", "Training", "Lifestyle"];
const categoryLabels: Record<Category, string> = {
  All: "Tất cả",
  Running: "Chạy bộ",
  Training: "Luyện tập",
  Lifestyle: "Phong cách",
};
const formatVnd = (amount: number) => `${amount.toLocaleString("vi-VN")} VNĐ`;

export default function App() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
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
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === "All" || product.category === category) &&
          product.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [category, query],
  );

  const addToCart = (name: string) => {
    const product = products.find((item) => item.name === name);
    if (!product) return;
    setCart((items) => {
      const existing = items.find((item) => item.name === name);
      return existing
        ? items.map((item) =>
            item.name === name ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...items, { ...product, quantity: 1 }];
    });
    setShowBag(false);
    setNotice(`Đã thêm ${name} vào giỏ hàng`);
    window.setTimeout(() => setNotice(""), 2500);
  };

  const updateQuantity = (name: string, change: number) => {
    setCart((items) =>
      items
        .map((item) =>
          item.name === name ? { ...item, quantity: item.quantity + change } : item,
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

  if (showRegister) {
    return (
      <div className="site-shell login-shell">
        <div className="announcement">
          <span>Miễn phí vận chuyển cho đơn từ 100.000 VNĐ</span>
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
              if (checkoutPendingLogin) {
                setShowCheckout(true);
                setCheckoutPendingLogin(false);
              } else {
                setNotice("Tạo tài khoản thành công");
              }
              window.setTimeout(() => setNotice(""), 2500);
            }}>
              <label>Họ và tên<input type="text" placeholder="Nguyễn Văn An" required /></label>
              <label>Địa chỉ email<input type="email" placeholder="ban@example.com" required /></label>
              <label>Mật khẩu<div className="password-field"><input name="register-password" type={registerPasswordVisible ? "text" : "password"} placeholder="Tối thiểu 6 ký tự" required minLength={6} /><button type="button" onClick={() => setRegisterPasswordVisible(!registerPasswordVisible)}>{registerPasswordVisible ? "Ẩn" : "Hiện"}</button></div></label>
              <label>Xác nhận mật khẩu<input name="register-confirmation" type="password" placeholder="Nhập lại mật khẩu" required minLength={6} /></label>
              <label className="remember"><input type="checkbox" required /> <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật</span></label>
              <button className="login-submit" type="submit">Tạo tài khoản <ArrowRight size={17} /></button>
              <p className="signup-prompt">Đã có tài khoản? <button type="button" onClick={() => { setShowRegister(false); setShowLogin(true); }}>Đăng nhập</button></p>
            </form>
          </section>
        </main>
        {notice && <div className="toast">{notice}<span>✓</span></div>}
        <footer><a className="wordmark" href="#" onClick={(event) => { event.preventDefault(); setShowRegister(false); }}>STRIDE<span>.</span></a><p>© 2025 Stride Athletics</p><div><a href="#shop">Bảo mật</a><a href="#shop">Điều khoản</a><a href="#shop">Trợ giúp</a></div></footer>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="site-shell login-shell">
        <div className="announcement">
          <span>Miễn phí vận chuyển cho đơn từ 100.000 VNĐ</span>
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
                setLoginSubmitted(true);
                setSignedIn(true);
                if (checkoutPendingLogin) {
                  setShowLogin(false);
                  setShowCheckout(true);
                  setCheckoutPendingLogin(false);
                }
              }}>
                <label>Địa chỉ email<input type="email" placeholder="ban@example.com" required /></label>
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
        <footer><a className="wordmark" href="#" onClick={(event) => { event.preventDefault(); setShowLogin(false); }}>STRIDE<span>.</span></a><p>© 2025 Stride Athletics</p><div><a href="#shop">Bảo mật</a><a href="#shop">Điều khoản</a><a href="#shop">Trợ giúp</a></div></footer>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="site-shell checkout-shell">
        <div className="announcement"><span>Thanh toán an toàn</span><span className="announcement-detail">Miễn phí vận chuyển cho đơn từ 100.000 VNĐ</span></div>
        <header className="header">
          <button className="wordmark logo-button" onClick={() => setShowCheckout(false)} aria-label="Return to Stride home">STRIDE<span>.</span></button>
          <button className="return-link" onClick={() => setShowCheckout(false)}>Quay lại cửa hàng <ArrowRight size={16} /></button>
        </header>
        {checkoutComplete ? (
          <main className="checkout-success-page">
            <div className="checkout-success-icon">✓</div>
            <p className="eyebrow">Đặt hàng thành công</p>
            <h1>Sẵn sàng<br /><em>bứt phá.</em></h1>
            <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ sớm gửi hóa đơn và thông tin theo dõi qua email.</p>
            <button className="primary-button" onClick={() => { setCart([]); setCheckoutComplete(false); setShowCheckout(false); }}>Tiếp tục mua sắm <ArrowRight size={17} /></button>
          </main>
        ) : (
          <main className="checkout-page">
            <section className="checkout-form-panel">
              <p className="eyebrow">Sắp hoàn tất</p>
              <h1>Hoàn tất<br /><em>đơn hàng.</em></h1>
              <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); setCheckoutComplete(true); }}>
                <h2>Thông tin liên hệ</h2>
                <label>Địa chỉ email<input type="email" placeholder="ban@example.com" required /></label>
                <h2>Địa chỉ giao hàng</h2>
                <div className="form-row"><label>Tên<input required /></label><label>Họ<input required /></label></div>
                <label>Địa chỉ<input required /></label>
                <div className="form-row"><label>Thành phố<input required /></label><label>Mã bưu chính<input required pattern="[0-9A-Za-z -]{3,10}" /></label></div>
                <h2>Thanh toán</h2>
                <label>Số thẻ<input inputMode="numeric" placeholder="4242 4242 4242 4242" required minLength={12} /></label>
                <div className="form-row"><label>Ngày hết hạn<input placeholder="MM / YY" required /></label><label>Mã bảo mật<input inputMode="numeric" placeholder="CVC" required minLength={3} /></label></div>
                <button className="login-submit" type="submit">Đặt hàng <ArrowRight size={17} /></button>
              </form>
            </section>
            <aside className="order-summary"><p className="eyebrow">Đơn hàng của bạn</p><h2>{cartCount} sản phẩm</h2>{cart.map((item) => <div className="summary-item" key={item.name}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>Số lượng {item.quantity}</span></div><b>{formatVnd(item.price * item.quantity)}</b></div>)}<div className="summary-total"><span>Tổng cộng</span><strong>{formatVnd(cartTotal)}</strong></div></aside>
          </main>
        )}
      </div>
    );
  }

  return (
    <div className="site-shell">
      {notice && <div className="toast">{notice}<span>✓</span></div>}
      <div className="announcement">
        <span>Miễn phí vận chuyển cho đơn từ 100.000 VNĐ</span>
        <span className="announcement-detail">Đổi trả dễ dàng trong 30 ngày</span>
      </div>

      <header className="header">
        <a className="wordmark" href="#" aria-label="Trang chủ Stride">STRIDE<span>.</span></a>
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
        {cart.length ? <div className="bag-items">{cart.map((item) => <div className="bag-item" key={item.name}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>{item.color}</span><div className="quantity-control"><button onClick={() => updateQuantity(item.name, -1)} aria-label={`Xóa một ${item.name}`}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.name, 1)} aria-label={`Thêm một ${item.name}`}>+</button></div></div><b>{formatVnd(item.price * item.quantity)}</b></div>)}</div> : <div className="empty-bag"><ShoppingBag size={30} /><p>Giỏ hàng đang chờ<br />món đồ phù hợp.</p></div>}
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
            <div className="hero-caption"><span>01 / 04</span><span>Xuân / Hè 2025</span></div>
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
            <button className="sort-button">Sắp xếp <strong>Nổi bật</strong><ChevronDown size={16} /></button>
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
                  <button className="quick-add" onClick={() => addToCart(product.name)}>Thêm nhanh <span>+</span></button>
                </div>
                <div className="product-info">
                  <div><h3>{product.name}</h3><p>{product.color}</p></div>
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

        <section className="newsletter" id="journal"><p className="eyebrow">Luôn chuyển động</p><h2>Sản phẩm mới.<br />Năng lượng tốt.</h2><p>Đăng ký để nhận thông tin sớm, những câu chuyện thú vị và giảm 10% cho đơn hàng đầu tiên.</p><form onSubmit={(e) => e.preventDefault()}><input type="email" aria-label="Địa chỉ email" placeholder="Địa chỉ email của bạn" /><button type="submit" aria-label="Đăng ký"><ArrowRight size={20} /></button></form></section>
      </main>
      <footer><a className="wordmark" href="#">STRIDE<span>.</span></a><p>© 2025 Stride Athletics</p><div><a href="#shop">Instagram</a><a href="#shop">Liên hệ</a><a href="#shop">Vận chuyển & đổi trả</a></div></footer>
    </div>
  );
}
