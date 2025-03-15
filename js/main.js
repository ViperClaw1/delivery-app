const ITEMS_URL = "http://localhost:3000/json/db.json";
const DELIVERY_MINIMAL_FREE = 600;

// Fetch items from the server
async function fetchItems(url) {
  const response = await fetch(url);
  return response.json();
}

// Retrieve items from the cart in localStorage
function getCartItems() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Render a product item in the products container
function renderProductItem(item, container) {
  const markup = `
    <div class="col-md-6">
      <div class="card mb-4" data-productid="${item.id}">
        <img class="product-img" src="img/roll/${item.img}" alt="${item.title}">
        <div class="card-body text-center">
          <h4 class="item-title">${item.title}</h4>
          <p><small class="text-muted">${item.itemsInBox} шт.</small></p>
          <div class="details-wrapper">
            <div class="items">
              <div class="items__control" data-click="minus">-</div>
              <div class="items__current" data-count>${item.counter}</div>
              <div class="items__control" data-click="plus">+</div>
            </div>
            <div class="price">
              <div class="price__weight">${item.weight}г.</div>
              <div class="price__currency">${item.price} ₽</div>
            </div>
          </div>
          <button type="button" data-click="addToCart" class="btn btn-block btn-outline-warning">+ в корзину</button>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML("beforeend", markup);
}

// Render a cart item in the cart container
function renderCartItem(item, container) {
  const markup = `
    <div class="cart-item" data-productid="${item.id}">
      <div class="cart-item__top">
        <div class="cart-item__img">
          <img src="img/roll/${item.img}" alt="${item.title}">
        </div>
        <div class="cart-item__desc">
          <div class="cart-item__title">${item.title}</div>
          <div class="cart-item__weight">${item.itemsInBox} шт. / ${item.weight}г.</div>
          <div class="cart-item__details">
            <div class="items items--small">
              <div class="items__control" data-click="minus">-</div>
              <div class="items__current" data-count>${item.items}</div>
              <div class="items__control" data-click="plus">+</div>
            </div>
            <div class="price">
              <div class="price__currency">${item.price} ₽</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  container.insertAdjacentHTML("beforeend", markup);
}

// Update the counter for a product item
function updateItemCounter(items, id, type) {
  const item = items.find((element) => element.id == id);
  if (!item) return;

  if (type === "minus" && item.counter > 1) item.counter--;
  if (type === "plus") item.counter++;
}

// Update the counter for a cart item
function updateCartItemCounter(cart, id, type) {
  const itemIndex = cart.findIndex((element) => element.id == id);
  if (itemIndex === -1) return;

  const item = cart[itemIndex];
  if (type === "minus" && item.items > 1) {
    item.items--;
  } else if (type === "minus") {
    cart.splice(itemIndex, 1);
    checkCartEmptiness(cart, cartEmpty, cartTotal, makeOrder);
  } else if (type === "plus") {
    item.items++;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update the view of a product item's counter
function updateItemCounterView(container, id, count) {
  const itemElement = container.querySelector(`[data-productid="${id}"]`);
  if (itemElement) {
    if (count > 0) {
      itemElement.querySelector("[data-count]").innerText = count;
    } else {
      itemElement.classList.add("none");
    }
  }
}

// Check if the cart is empty and update the UI accordingly
function checkCartEmptiness(cart, cartEmpty, cartTotal, makeOrder) {
  const isEmpty = cart.length === 0;
  cartEmpty.classList.toggle("none", !isEmpty);
  cartTotal.classList.toggle("none", isEmpty);
  makeOrder.classList.toggle("none", isEmpty);
}

// Add an item to the cart
function addToCart(productsContainer, items, cart, id) {
  const item = items.find((element) => element.id == id);
  if (!item) return;

  const itemInCart = cart.find((element) => element.id == id);
  if (itemInCart) {
    itemInCart.items += item.counter;
  } else {
    cart.push({ ...item, items: item.counter });
  }

  item.counter = 1;
  updateItemCounterView(productsContainer, id, item.counter);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Calculate the total sum of the cart
function calculateTotalSum(cart, cartTotalPrice, deliveryPriceContainer) {
  const totalSum = cart.reduce((sum, item) => sum + item.items * item.price, 0);
  cartTotalPrice.innerText = new Intl.NumberFormat("ru-RU").format(totalSum);
  calculateDelivery(totalSum, deliveryPriceContainer);
}

// Calculate delivery cost based on the total sum
function calculateDelivery(totalSum, deliveryPriceContainer) {
  if (totalSum >= DELIVERY_MINIMAL_FREE) {
    deliveryPriceContainer.innerText = "бесплатно";
    deliveryPriceContainer.classList.add("free");
  } else {
    deliveryPriceContainer.innerText = 300;
    deliveryPriceContainer.classList.remove("free");
  }
}

// Main function to initialize the application
async function main() {
  const state = {
    items: await fetchItems(ITEMS_URL),
    cart: getCartItems(),
  };

  const productsContainer = document.querySelector("#productsMainContainer");
  const cartContainer = document.querySelector("#cartItemsHolder");
  const cartEmpty = document.querySelector("#cartEmpty");
  const cartTotal = document.querySelector("#cartTotal");
  const makeOrder = document.querySelector("#makeOrder");
  const cart = document.querySelector("#cart");
  const cartTotalPrice = document.querySelector("#cartTotalPrice");
  const deliveryPriceContainer = document.querySelector(
    "#deliveryPriceContainer"
  );

  // Render initial items
  state.items.forEach((item) => renderProductItem(item, productsContainer));
  state.cart.forEach((item) => renderCartItem(item, cartContainer));

  // Event listeners
  productsContainer.addEventListener("click", (e) => {
    const id = e.target.closest("[data-productid]").dataset.productid;
    if (e.target.matches('[data-click="minus"]')) {
      updateItemCounter(state.items, id, "minus");
      updateItemCounterView(
        productsContainer,
        id,
        state.items.find((item) => item.id == id).counter
      );
    } else if (e.target.matches('[data-click="plus"]')) {
      updateItemCounter(state.items, id, "plus");
      updateItemCounterView(
        productsContainer,
        id,
        state.items.find((item) => item.id == id).counter
      );
    } else if (e.target.matches('[data-click="addToCart"]')) {
      addToCart(productsContainer, state.items, state.cart, id);
      cartContainer.innerHTML = "";
      state.cart.forEach((item) => renderCartItem(item, cartContainer));
      checkCartEmptiness(state.cart, cartEmpty, cartTotal, makeOrder);
      calculateTotalSum(state.cart, cartTotalPrice, deliveryPriceContainer);
    }
  });

  cart.addEventListener("click", (e) => {
    const id = e.target.closest("[data-productid]").dataset.productid;
    if (
      e.target.matches('[data-click="minus"]') ||
      e.target.matches('[data-click="plus"]')
    ) {
      updateCartItemCounter(state.cart, id, e.target.dataset.click);
      updateItemCounterView(
        cartContainer,
        id,
        state.cart.find((item) => item.id == id)?.items || 0
      );
      calculateTotalSum(state.cart, cartTotalPrice, deliveryPriceContainer);
    }
  });

  // Initial checks
  checkCartEmptiness(state.cart, cartEmpty, cartTotal, makeOrder);
  calculateTotalSum(state.cart, cartTotalPrice, deliveryPriceContainer);
}

main();
