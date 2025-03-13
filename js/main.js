const itemsUrl = "./json/db.json";

function getItems(url) {
  return fetch(url).then((answer) => answer.json());
}

function getItemsFromCart() {
  return JSON.parse(localStorage.getItem("cart"));
}

async function main() {
  const items = await getItems(itemsUrl);
  const itemsFromCart = await getItemsFromCart();

  const state = {
    items: items,
    cart: itemsFromCart,
  };

  if (state.cart == null) {
    state.cart = [];
  }

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
  const deliveryMinimalFree = 600;

  const renderItem = function (item) {
    const markup = `
      <div class="col-md-6">
        <div class="card mb-4" data-productid="${item.id}">
          <img class="product-img" src="img/roll/${item.img}" alt="${item.title}">
          <div class="card-body text-center">
            <h4 class="item-title">${item.title}</h5>
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

    productsContainer.insertAdjacentHTML("beforeend", markup);
  };

  const renderItemInCart = function (item) {
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

    cartContainer.insertAdjacentHTML("beforeend", markup);
  };

  state.items.forEach(renderItem);
  state.cart.forEach(renderItemInCart);

  const itemUpdateCounter = function (id, type) {
    const itemIndex = state.items.findIndex(function (element) {
      if (element.id == id) {
        return true;
      }
    });

    let count = state.items[itemIndex].counter;

    if (type == "minus") {
      if (count > 1) {
        count--; // 4
      }
    }

    if (type == "plus") {
      count++; // 4
    }

    state.items[itemIndex].counter = count; // 4
  };

  const itemUpdateCounterInCart = function (id, type) {
    const itemIndex = state.cart.findIndex(function (element) {
      if (element.id == id) {
        return true;
      }
    });

    let count = state.cart[itemIndex].items; //

    if (type == "minus") {
      if (count > 1) {
        count--; // 4
      } else {
        const itemIndex = state.cart.findIndex(function (element) {
          if (element.id == id) {
            return true;
          }
        });

        cart.querySelector('[data-productid="' + id + '"').style.display =
          "none";

        state.cart.forEach(function (el, i) {
          if (el.id == id) state.cart.splice(i, 1);
        });

        if (state.cart.length == 0) {
          state.cart = [];
        }
        checkCartEmptiness();
        calcTotalSum();
        return true;
      }
    }

    if (type == "plus") {
      count++;
    }

    state.cart[itemIndex].items = count;
  };

  const itemUpdateViewCounter = function (id) {
    const itemIndex = state.items.findIndex(function (element) {
      if (element.id == id) {
        return true;
      }
    });

    productsContainer
      .querySelector('[data-productid="' + id + '"')
      .querySelector("[data-count]").innerText = state.items[itemIndex].counter;
  };

  const itemUpdateViewCounterInCart = function (id) {
    const itemIndexInCart = state.cart.findIndex(function (element) {
      if (element.id == id) {
        return true;
      }
    });

    if (itemIndexInCart != -1) {
      cart
        .querySelector('[data-productid="' + id + '"')
        .querySelector("[data-count]").innerText =
        state.cart[itemIndexInCart].items;
    }

    localStorage.setItem("cart", JSON.stringify(state.cart));
  };

  const checkCartEmptiness = function () {
    if (state.cart.length > 0) {
      cartEmpty.classList.add("none");
      cartTotal.classList.remove("none");
      makeOrder.classList.remove("none");
    } else {
      cartEmpty.classList.remove("none");
      cartTotal.classList.add("none");
      makeOrder.classList.add("none");
    }
  };

  const addToCart = function (id) {
    const itemIndex = state.items.findIndex(function (element) {
      if (element.id == id) {
        return true;
      }
    });

    const itemInCartIndex = state.cart.findIndex(function (element) {
      if (element.id == id) {
        return true;
      }
    });

    if (itemInCartIndex == -1) {
      const itemToAdd = {
        id: state.items[itemIndex].id,
        title: state.items[itemIndex].title,
        price: state.items[itemIndex].price,
        weight: state.items[itemIndex].weight,
        itemsInBox: state.items[itemIndex].itemsInBox,
        img: state.items[itemIndex].img,
        items: state.items[itemIndex].counter,
      };

      state.cart.push(itemToAdd);
    } else {
      state.cart[itemInCartIndex].items += state.items[itemIndex].counter;
    }

    state.items[itemIndex].counter = 1;
    state.items[itemIndex].itemsInBox--;
    itemUpdateViewCounter(id);

    cartContainer.innerHTML = "";
    state.cart.forEach(renderItemInCart);

    localStorage.setItem("cart", JSON.stringify(state.cart));

    checkCartEmptiness();
    calcTotalSum();
  };

  productsContainer.addEventListener("click", function (e) {
    const id = e.target.closest("[data-productid]").dataset.productid;

    if (e.target.matches('[data-click="minus"]')) {
      itemUpdateCounter(id, "minus", "state");
      itemUpdateViewCounter(id);
    } else if (e.target.matches('[data-click="plus"]')) {
      itemUpdateCounter(id, "plus", "state");
      itemUpdateViewCounter(id);
    } else if (e.target.matches('[data-click="addToCart"]')) {
      addToCart(id);
    }
  });

  cart.addEventListener("click", function (e) {
    const id = e.target.closest("[data-productid]").dataset.productid;

    if (e.target.matches('[data-click="minus"]')) {
      itemUpdateCounterInCart(id, "minus");
    } else if (e.target.matches('[data-click="plus"]')) {
      itemUpdateCounterInCart(id, "plus");
    }

    itemUpdateViewCounterInCart(id);
    calcTotalSum();
  });

  const calcTotalSum = function () {
    let totalSum = 0;
    state.cart.forEach(function (element) {
      const currentSum = element.items * element.price;
      totalSum += currentSum;
    });

    state.totalSum = totalSum;
    cartTotalPrice.innerText = new Intl.NumberFormat("ru-RU").format(totalSum);
    calcDelivery();
  };

  const calcDelivery = function () {
    if (state.totalSum >= deliveryMinimalFree) {
      deliveryPriceContainer.innerText = "бесплатно";
      deliveryPriceContainer.classList.add("free");
    } else {
      deliveryPriceContainer.innerText = 300;
      deliveryPriceContainer.classList.remove("free");
    }
  };
}

main();
