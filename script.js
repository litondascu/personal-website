const products = [
  {
    id: 1,
    name: "Ferrero Rocher Box",
    category: "Chocolate",
    price: 1200,
    discount: 10,
    stock: 18,
    gradient: "linear-gradient(135deg, #6f1d1b, #bb9457)"
  },
  {
    id: 2,
    name: "Toblerone Imported",
    category: "Chocolate",
    price: 950,
    discount: 8,
    stock: 12,
    gradient: "linear-gradient(135deg, #ffb703, #fb8500)"
  },
  {
    id: 3,
    name: "Snickers Mini Pack",
    category: "Chocolate",
    price: 700,
    discount: 5,
    stock: 25,
    gradient: "linear-gradient(135deg, #5f0f40, #9a031e)"
  },
  {
    id: 4,
    name: "Red Bull Energy Drink",
    category: "Drink",
    price: 450,
    discount: 12,
    stock: 30,
    gradient: "linear-gradient(135deg, #1d3557, #457b9d)"
  },
  {
    id: 5,
    name: "Coca-Cola Vanilla",
    category: "Drink",
    price: 300,
    discount: 7,
    stock: 22,
    gradient: "linear-gradient(135deg, #d00000, #f48c06)"
  },
  {
    id: 6,
    name: "Monster Energy Can",
    category: "Drink",
    price: 550,
    discount: 20,
    stock: 14,
    gradient: "linear-gradient(135deg, #386641, #6a994e)"
  }
];

let cart = [];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutForm = document.getElementById("checkoutForm");
const successMessage = document.getElementById("successMessage");

function getDiscountedPrice(price, discount) {
  return Math.round(price - (price * discount / 100));
}

function formatTaka(value) {
  return `৳${value.toLocaleString()}`;
}

function renderProducts(items) {
  productGrid.innerHTML = "";
  if (!items.length) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  items.forEach(product => {
    const discounted = getDiscountedPrice(product.price, product.discount);

    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image" style="background:${product.gradient}">
        ${product.category}
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="meta">${product.category}</p>
        <p class="stock">Available Quantity: ${product.stock}</p>
        <div class="price-row">
          <span class="old-price">${formatTaka(product.price)}</span>
          <span class="new-price">${formatTaka(discounted)}</span>
          <span class="discount-badge">${product.discount}% OFF</span>
        </div>
        <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);

  if (existing) {
    if (existing.quantity < item.stock) {
      existing.quantity += 1;
    }
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  updateCart();
  openCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  if (!cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  }

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    const discounted = getDiscountedPrice(item.price, item.discount);
    const lineTotal = discounted * item.quantity;
    total += lineTotal;
    count += item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <p>${item.quantity} × ${formatTaka(discounted)}</p>
      </div>
      <button class="close-btn" onclick="removeFromCart(${item.id})">×</button>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = formatTaka(total);
  cartCount.textContent = count;
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden", "true");
}

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", () => {
  closeCart();
  checkoutModal.classList.add("hidden");
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }
  checkoutModal.classList.remove("hidden");
  overlay.classList.add("show");
});

document.getElementById("closeCheckout").addEventListener("click", () => {
  checkoutModal.classList.add("hidden");
  if (!cartDrawer.classList.contains("open")) {
    overlay.classList.remove("show");
  }
});

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  successMessage.classList.remove("hidden");
  cart = [];
  updateCart();
  setTimeout(() => {
    checkoutModal.classList.add("hidden");
    closeCart();
    checkoutForm.reset();
    successMessage.classList.add("hidden");
  }, 1800);
});

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase().trim();
  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
  renderProducts(filtered);
});

renderProducts(products);
updateCart();
