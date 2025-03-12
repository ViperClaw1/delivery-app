const items = [
  {
    id: 1,
    title: "Калифорния хит",
    price: 300,
    weight: 180,
    itemsInBox: 6,
    img: "california-hit.jpg",
    counter: 1,
  },
  {
    id: 2,
    title: "Калифорния темпура",
    price: 250,
    weight: 205,
    itemsInBox: 6,
    img: "california-tempura.jpg",
    counter: 1,
  },
  {
    id: 3,
    title: "Запеченый ролл «Калифорния»",
    price: 230,
    weight: 182,
    itemsInBox: 6,
    img: "zapech-california.jpg",
    counter: 1,
  },
  {
    id: 4,
    title: "Филадельфия",
    price: 320,
    weight: 230,
    itemsInBox: 6,
    img: "philadelphia.jpg",
    counter: 1,
  },
];

const state = {
  items: items,
  cart: [],
  totalSum: 0,
};

const productsContainer = document.querySelector("#productsMainContainer");
const itemTotalSum = document.querySelector(".price__currency");
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

const itemUpdateCounter = function (id, type) {
  const itemIndex = state.items.findIndex(function (element) {
    if (element.id == id) {
      return true;
    }
  });

  let count = state.items[itemIndex].counter; //

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

      debugger;
      cart.querySelector('[data-productid="' + id + '"').style.display = "none";
      delete state.cart[itemIndex];
      if (state.cart.length < 2) {
        state.cart = [];
      }
      checkCartEmptiness();
      return true;
    }
  }

  if (type == "plus") {
    count++; // 4
  }

  state.cart[itemIndex].items = count; // 4
};

const itemUpdateViewCounter = function (id) {
  // 1) По ID найти  объект продукта в state.items
  // для того чтобы получить значение его свойства counter

  const itemIndex = state.items.findIndex(function (element) {
    if (element.id == id) {
      return true;
    }
  });

  // 2) Обновить значение счетчика в разметке
  // 2.1) Найти место в разметке  где находится счетчик // [data-count]
  // 2.2) Обновить  значение счетчика в разметке
  productsContainer
    .querySelector('[data-productid="' + id + '"')
    .querySelector("[data-count]").innerText = state.items[itemIndex].counter;
};

const itemUpdateViewCounterInCart = function (id) {
  const itemIndex = state.cart.findIndex(function (element) {
    if (element.id == id) {
      return true;
    }
  });

  cart
    .querySelector('[data-productid="' + id + '"')
    .querySelector("[data-count]").innerText = state.cart[itemIndex].items;
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

  // Проверим, есть ли в корзине товар с таикм id
  const itemInCartIndex = state.cart.findIndex(function (element) {
    if (element.id == id) {
      return true;
    }
  });
  // Если есть, вернется -1

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
  itemUpdateViewCounter(id);

  cartContainer.innerHTML = "";
  state.cart.forEach(renderItemInCart);

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
  cartTotalPrice.innerText = totalSum;
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
