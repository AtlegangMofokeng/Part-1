// ------------------------------
// PRODUCT 1 SLIDESHOW
// ------------------------------

let slideIndexP1 = 1;
showSlidesP1(slideIndexP1);

function plusSlidesP1(n) {
  showSlidesP1(slideIndexP1 += n);
}

function currentSlideP1(n) {
  showSlidesP1(slideIndexP1 = n);
}

function showSlidesP1(n) {
  let slides = document.getElementsByClassName("p1Slide");
  let dots = document.getElementsByClassName("dotP1");

  if (n > slides.length) { slideIndexP1 = 1 }
  if (n < 1) { slideIndexP1 = slides.length }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("activeP1");
  }

  slides[slideIndexP1 - 1].style.display = "block";
  dots[slideIndexP1 - 1].classList.add("activeP1");
}



// -------------------------------------------------
// COLOUR SELECTORS
// -------------------------------------------------

// Product 1 color
let selectedColorP1 = null;
function showColor(color) {
  selectedColorP1 = color;
}

// Product 2 color
let selectedColorP2 = null;
function showColor2(color, element) {
  selectedColorP2 = color;

  // highlight selection
  document.querySelectorAll(".color-circle2").forEach(c => c.classList.remove("selected"));
  element.classList.add("selected");
}



// ------------------------------
// CART SYSTEM
// ------------------------------

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", function () {

  const cartCount = document.querySelector(".cart-count");
  cartCount.textContent = cart.length;

  const addCartButtons = document.querySelectorAll(".add-cart");

  addCartButtons.forEach(button => {
    button.addEventListener("click", () => {

      const productName = button.dataset.product;
      const productPrice = Number(button.dataset.price);

      // Pick correct colour depending on product
      let chosenColor =
        productName === "Sun Hat"
          ? selectedColorP1
          : selectedColorP2;

      if (!chosenColor) {
        alert("Please select a colour first!");
        return;
      }

      const item = {
        name: productName,
        price: productPrice,
        color: chosenColor
      };

      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));

      cartCount.textContent = cart.length;

      alert(`${productName} (${chosenColor}) added to cart!`);
    });
  });

});



addCartButtons.forEach(button => {
    button.addEventListener("click", () => {

        const productName = button.dataset.product;
        const productPrice = Number(button.dataset.price);

        // quantity value (gets the input next to the button)
        const qtyInput = button.parentElement.querySelector(".qty-input");
        const quantity = Number(qtyInput.value);

        // pick the correct color
        let chosenColor;

        if (productName === "Sun Hat") {
            chosenColor = selectedColorP1;
        } else {
            chosenColor = selectedColorP2;
        }

        if (!chosenColor) {
            alert("Please select a colour first!");
            return;
        }

        const item = {
            name: productName,
            price: productPrice,
            color: chosenColor,
            quantity: quantity
        };

        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));

        cartCount.textContent = cart.length;

        alert(`${quantity} × ${productName} (${chosenColor}) added to cart!`);
    });
});


// Detect if we're on the cart page
if (document.getElementById("cart-items")) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.querySelector(".cart-count");

    cartCount.textContent = cart.length;

    function renderCart() {
        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            total += item.price * item.quantity;

            itemDiv.innerHTML = `
                <p><strong>${item.name}</strong> (${item.color})</p>
                <p>Price: R${item.price} x ${item.quantity}</p>
                <button onclick="removeItem(${index})">Remove</button>
            `;
            cartItems.appendChild(itemDiv);
        });

        cartTotal.textContent = `Total: R${total}`;
    }

    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        cartCount.textContent = cart.length;
        renderCart();
    }

    document.getElementById("checkout").addEventListener("click", () => {
        if(cart.length === 0){
            alert("Your cart is empty!");
            return;
        }
        alert("Thanks for shopping! 🛒"); 
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        cartCount.textContent = 0;
        renderCart();
    });

    renderCart();
}









function goToCart() {
    window.location.href = "cart.html"; // go to your cart page
}







const cartIcon = document.querySelector('.cart-icon');
cartIcon.addEventListener('mouseenter', () => {
    // show a small popup with cart items
});
cartIcon.addEventListener('mouseleave', () => {
    // hide popup
});
