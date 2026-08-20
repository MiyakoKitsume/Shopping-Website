const products = [
  { id: 1, name: 'Oiled Canvas Tote', category: 'Carry', price: 68, badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80' },
  { id: 2, name: 'Stoneware Pitcher', category: 'Home', price: 54, badge: '', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80' },
  { id: 3, name: 'Linen Everyday Shirt', category: 'Wear', price: 96, badge: 'New in', image: 'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=80' },
  { id: 4, name: 'Hand-poured Candle', category: 'Home', price: 32, badge: '', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80' },
  { id: 5, name: 'Daily Wool Cap', category: 'Wear', price: 42, badge: '', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=700&q=80' },
  { id: 6, name: 'Ribbed Glass Tumbler', category: 'Home', price: 24, badge: '', image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=700&q=80' },
  { id: 7, name: 'Vegetable Tanned Wallet', category: 'Carry', price: 78, badge: '', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80' },
  { id: 8, name: 'Soft Utility Trouser', category: 'Wear', price: 110, badge: 'New in', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80' }
];

let selectedCategory = 'All';
let searchTerm = '';
let cart = JSON.parse(localStorage.getItem('field-found-cart') || '[]');
const grid = document.querySelector('#product-grid');
const count = document.querySelector('#result-count');

const money = value => `$${value.toFixed(2)}`;

function visibleProducts() {
  let result = products.filter(product => selectedCategory === 'All' || product.category === selectedCategory);
  if (searchTerm) result = result.filter(product => `${product.name} ${product.category}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const sort = document.querySelector('#sort-select').value;
  if (sort === 'low') result.sort((a, b) => a.price - b.price);
  if (sort === 'high') result.sort((a, b) => b.price - a.price);
  return result;
}

function renderProducts() {
  const visible = visibleProducts();
  count.textContent = `${visible.length} ${visible.length === 1 ? 'piece' : 'pieces'}`;
  grid.innerHTML = visible.length ? visible.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 55}ms">
      <div class="product-photo"><img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <button class="quick-add" data-add="${product.id}" aria-label="Add ${product.name} to bag"><i data-lucide="plus"></i></button>
      </div>
      <div class="product-info"><div><div class="product-name">${product.name}</div><div class="product-meta">${product.category}</div></div><div class="product-price">${money(product.price)}</div></div>
    </article>`).join('') : '<p class="no-results">Nothing found here. Try another search.</p>';
  lucide.createIcons();
}

function renderCart() {
  const items = cart.map(item => ({ ...products.find(product => product.id === item.id), quantity: item.quantity }));
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector('#cart-count').textContent = totalItems;
  document.querySelector('#cart-title').textContent = `${totalItems} ${totalItems === 1 ? 'piece' : 'pieces'}`;
  document.querySelector('#cart-total').textContent = money(total);
  document.querySelector('#checkout-button').disabled = !items.length;
  document.querySelector('#cart-items').innerHTML = items.length ? items.map(item => `
    <div class="cart-item"><img src="${item.image}" alt="${item.name}" /><div><h3>${item.name}</h3><p>${money(item.price)}</p><div class="quantity"><button data-quantity="${item.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-quantity="${item.id}" data-change="1" aria-label="Increase quantity">+</button></div></div><div class="cart-item-price">${money(item.price * item.quantity)}</div></div>`).join('') : '<div class="empty-cart"><i data-lucide="shopping-bag"></i><p>Your bag is waiting<br />for something good.</p><a href="#shop" id="empty-cart-link">Browse pieces</a></div>';
  localStorage.setItem('field-found-cart', JSON.stringify(cart));
  lucide.createIcons();
}

function addToCart(id) { const existing = cart.find(item => item.id === id); existing ? existing.quantity++ : cart.push({ id, quantity: 1 }); renderCart(); showToast(`${products.find(product => product.id === id).name} added to your bag`); }
function showToast(message) { const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
function toggleCart(open) { document.querySelector('#cart-drawer').classList.toggle('open', open); document.querySelector('#overlay').classList.toggle('open', open); document.querySelector('#cart-drawer').setAttribute('aria-hidden', !open); }


document.addEventListener('click', event => {
  const add = event.target.closest('[data-add]'); if (add) addToCart(Number(add.dataset.add));
  const quantity = event.target.closest('[data-quantity]');
  if (quantity) { const item = cart.find(product => product.id === Number(quantity.dataset.quantity)); item.quantity += Number(quantity.dataset.change); if (item.quantity <= 0) cart = cart.filter(product => product.id !== item.id); renderCart(); }
  const tab = event.target.closest('[data-category]'); if (tab) { selectedCategory = tab.dataset.category; document.querySelectorAll('.tab').forEach(button => button.classList.toggle('active', button === tab)); renderProducts(); }
  const categoryLink = event.target.closest('[data-category-link]'); if (categoryLink) { selectedCategory = categoryLink.dataset.categoryLink; document.querySelectorAll('.tab').forEach(button => button.classList.toggle('active', button.dataset.category === selectedCategory)); renderProducts(); }
});

document.querySelector('#sort-select').addEventListener('change', renderProducts);
document.querySelector('#cart-toggle').addEventListener('click', () => toggleCart(true));
document.querySelector('#cart-close').addEventListener('click', () => toggleCart(false));
document.querySelector('#overlay').addEventListener('click', () => toggleCart(false));
document.querySelector('#checkout-button').addEventListener('click', () => showToast('Checkout is ready for your details'));
document.querySelector('#search-toggle').addEventListener('click', () => { document.querySelector('#search-panel').classList.add('open'); document.querySelector('#search-panel').setAttribute('aria-hidden', 'false'); document.querySelector('#search-input').focus(); });
document.querySelector('#search-close').addEventListener('click', () => { document.querySelector('#search-panel').classList.remove('open'); document.querySelector('#search-panel').setAttribute('aria-hidden', 'true'); });
document.querySelector('#search-input').addEventListener('input', event => { searchTerm = event.target.value; renderProducts(); });
document.querySelector('#newsletter-form').addEventListener('submit', event => { event.preventDefault(); document.querySelector('#form-status').textContent = 'You are on the list. See you soon.'; event.target.reset(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { toggleCart(false); document.querySelector('#search-panel').classList.remove('open'); } });

renderProducts();
renderCart();
lucide.createIcons();
