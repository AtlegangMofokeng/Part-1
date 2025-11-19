/* ============================
   PRODUCT 1 SLIDESHOW
============================ */
let slideIndexP1 = 1;
showSlidesP1(slideIndexP1);

function plusSlidesP1(n) { showSlidesP1(slideIndexP1 += n); }
function currentSlideP1(n) { showSlidesP1(slideIndexP1 = n); }

function showSlidesP1(n) {
  let slides = document.getElementsByClassName("p1Slide");
  let dots = document.getElementsByClassName("dotP1");

  if (n > slides.length) slideIndexP1 = 1;
  if (n < 1) slideIndexP1 = slides.length;

  for (let s of slides) s.style.display = "none";
  for (let d of dots) d.classList.remove("activeP1");

  slides[slideIndexP1 - 1].style.display = "block";
  dots[slideIndexP1 - 1].classList.add("activeP1");
}

/* ============================
   COLOR SELECTORS
============================ */
let selectedColorP1 = null;
let selectedColorP2 = null;

function showColor(color, element) {
  selectedColorP1 = color;
  document.querySelectorAll(".color-circle").forEach(c => c.classList.remove("selected"));
  element.classList.add("selected");
}

function showColor2(color, element) {
  selectedColorP2 = color;
  document.querySelectorAll(".color-circle2").forEach(c => c.classList.remove("selected"));
  element.classList.add("selected");
}

/* ============================
   CART SYSTEM
============================ */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartCount = document.querySelector(".cart-count");

function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }

document.addEventListener("DOMContentLoaded", () => {
  updateCartTotalSpent();
  updateStorePrices();

  // QUANTITY BUTTONS
  document.querySelectorAll(".qty-wrapper").forEach(wrapper => {
    const input = wrapper.querySelector(".qty-input");
    wrapper.querySelector(".plus").addEventListener("click", () => input.value = Number(input.value) + 1);
    wrapper.querySelector(".minus").addEventListener("click", () => {
      if (input.value > 1) input.value = Number(input.value) - 1;
    });
  });

  // ADD TO CART
  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = btn.dataset.product;
      const price = Number(btn.dataset.price);
      const qty = Number(btn.parentElement.querySelector(".qty-input").value);
      const image = btn.dataset.image;

      let color = product === "Sun Hat" ? selectedColorP1 : selectedColorP2;
      if (!color) return alert("Please select a color first!");

      cart.push({ name: product, price, quantity: qty, color, image });
      saveCart();
      updateCartTotalSpent();
      alert(`${qty} × ${product} (${color}) added to cart!`);
    });
  });
});

/* ============================
   NAVIGATION
============================ */
function goToCart() { window.location.href = "cart.html"; }

/* ============================
   CURRENCY SYSTEM
============================ */
let currentCurrency = "ZAR";
const currencyRates = { ZAR:1, USD:0.052, EUR:0.048, GBP:0.041, JPY:8.20 };

const customSelect = document.querySelector(".custom-select");
const selectedDisplay = customSelect?.querySelector(".selected");
const optionsContainer = customSelect?.querySelector(".options");
const optionItems = optionsContainer?.querySelectorAll(".option");

if (customSelect) {
  selectedDisplay.addEventListener("click", () => customSelect.classList.toggle("active"));

  optionItems.forEach(option => {
    option.addEventListener("click", () => {
      currentCurrency = option.dataset.value;
      selectedDisplay.innerHTML = option.innerHTML;
      customSelect.classList.remove("active");
      updateStorePrices();
      updateCartTotalSpent();
      if (document.getElementById("cart-items")) renderCart();
    });
  });

  document.addEventListener("click", e => {
    if (!customSelect.contains(e.target)) customSelect.classList.remove("active");
  });
}

/* ============================
   PRICE CONVERSION
============================ */
function convertPrice(amount) { return amount * currencyRates[currentCurrency]; }
function formatCurrency(amount) {
  return new Intl.NumberFormat("en", { style: "currency", currency: currentCurrency }).format(amount);
}
function updateStorePrices() {
  document.querySelectorAll(".price-display").forEach(p => {
    const base = Number(p.dataset.price);
    p.textContent = formatCurrency(convertPrice(base));
  });
}

/* ============================
   CART TOTAL
============================ */
function updateCartTotalSpent() {
  let total = 0;
  cart.forEach(item => total += convertPrice(item.price) * item.quantity);
  if (cartCount) cartCount.textContent = formatCurrency(total);
}

/* ============================
   CART PAGE RENDERING
============================ */
if (document.getElementById("cart-items")) {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, i) => {
      const unitPrice = convertPrice(item.price);
      const subtotal = unitPrice * item.quantity;
      total += subtotal;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <div class="cart-item-wrapper">
          <img src="${item.image}" alt="${item.name}" class="cart-img">
          <div class="cart-info">
            <p><strong>${item.name}</strong> (${item.color})</p>
            <p>Unit Price: ${formatCurrency(unitPrice)}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Subtotal: ${formatCurrency(subtotal)}</p>
            <button onclick="removeItem(${i})">Remove</button>
          </div>
        </div>
      `;

      cartItems.appendChild(div);
    });

    cartTotal.textContent = `Total: ${formatCurrency(total)}`;
    updateCartTotalSpent();
  }

  window.removeItem = function(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  };

  renderCart();
}

/* ============================
   CHECKOUT FORM HANDLING (NEW)
============================ */
if (document.getElementById("checkout-form")) {
  const form = document.getElementById("checkout-form");

  form.addEventListener("submit", e => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const fullName = document.getElementById("full-name").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const postal = document.getElementById("postal").value.trim();
    const bank = document.getElementById("bank").value;
    const card = document.getElementById("card-number").value.trim();
    const expiry = document.getElementById("expiry").value;
    const cvv = document.getElementById("cvv").value.trim();

    if (!fullName || !address || !city || !postal || !bank || !card || !expiry || !cvv) {
      alert("Please fill in all required fields.");
      return;
    }

    alert("Order successfully placed! Thank you for shopping 💛");

    cart = [];
    saveCart();
    updateCartTotalSpent();

    if (document.getElementById("cart-items")) renderCart();

    form.reset();
  });
}

/* ============================
   MINI CART (hover)
============================ */
const cartIcon = document.querySelector(".cart-icon");
if (cartIcon) {
  cartIcon.addEventListener("mouseenter", updateMiniCart);
}

function updateMiniCart() {
  const mini = document.querySelector(".mini-cart");
  if (!mini) return;
  mini.innerHTML = "";
  cart.forEach(item => {
    const subtotal = convertPrice(item.price) * item.quantity;
    mini.innerHTML += `<div>${item.quantity} × ${item.name} (${item.color}) — ${formatCurrency(subtotal)}</div>`;
  });
}
document.getElementById("year").textContent = new Date().getFullYear();




