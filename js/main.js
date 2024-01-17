// АЛГОРИТМ ДЕЙСТВИЙ:

// 1. Переносим данные в объекты
// 2. Выводим товары через шаблоны
// 3. Отлавливаем нажатие на карточки товаров
// 4. Отлавливаем нажатие на нкопки +-
// 5. Пишем функцию изменения счетчика в модели
// 6. Пишем функцию изменения счетчика в разметке

const items = [
    {
        id: 1,
        title: 'Филадельфия хит ролл',
        img: 'philadelphia.jpg',
        weight: 180,
        price: 300,
        amountTotal: 6,
        counter: 1
    },
    {
        id: 2,
        title: 'Калифорния темпура',
        img: 'california-tempura.jpg',
        weight: 205,
        price: 250,
        amountTotal: 6,
        counter: 1
    },
    {
        id: 3,
        title: 'Запеченый ролл «Калифорния»',
        img: 'zapech-california.jpg',
        weight: 182,
        price: 230,
        amountTotal: 6,
        counter: 1 
    },
    {
        id: 4,
        title: 'Филадельфия',
        img: 'philadelphia.jpg',
        weight: 230,
        price: 320,
        amountTotal: 6,
        counter: 1
    }
];

// Создаем глобальную переменную для хранения состояния всего приложения
const state = {
    items: items,
    cart: []
};

// Находим родительский див, куда будем помещать карточки роллов
const productsContainer = document.querySelector('#productMainContainer');

// Помещаем в данный див карточки роллов
const renderItem = (item) => {

    // Создаем шаблон разметки для одного ролла, подставив в него нужные значения
    const markup = `
    <div class="col-md-6">
    <div class="card mb-4" data-productid="${item.id}">
        <img class="product-img" src="img/roll/${item.img}" alt="${item.title}">
        <div class="card-body text-center">
            <h4 class="item-title">${item.title}</h5>
            <p><small class="text-muted">${item.amountTotal} шт.</small></p>

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

            <button type="button" class="btn btn-block btn-outline-warning">+ в корзину</button>
            
        </div>
    </div>
    </div>
    `;
    
    // Подставляем в данный объект разметку для ролла
    productsContainer.insertAdjacentHTML('beforeend', markup);

};

// Для каждого объекта из массива роллов запускаем эту функцию
items.forEach(renderItem);

// Создадим функцию изменения счетчика в модели
const itemUpdateCounter = (id, type) => {

    // Обращаемся к текущему счетчику по его id, находим индекс карточки
    const itemIndex = state.items.findIndex((element) => {
        if (element.id == id) {
            return true;
        }
    });

    let count = state.items[itemIndex].counter;

    if (type == 'plus') count++;
    else if (type == 'minus') {
        if (count > 1) count--;
    }

    state.items[itemIndex].counter = count;
    console.log(state.items[itemIndex].counter);

};

// Создадим функцию изменения счетчика в разметке
const itemUpdateViewCounter = (id) => {

    // 1) По id находим объект карточки в state.items, чтобы получить значение его свойства counter
    const itemIndex = state.items.findIndex((element) => {
        if (element.id == id) {
            return true;
        }
    });

    const count2show = state.items[itemIndex].counter;

    // 2) Обновляем значение счетчика в разметке
    const currentCard = productsContainer.querySelector('[data-productid="' + id + '"]'); // находим в разметке, где находится 
    const counter = currentCard.querySelector('[data-count]'); // обращаемся непосредственно к счетчику
    counter.innerHTML = count2show; // обновляем значение счетчика в разметке

};

// Настраиваем отлавливание нажатие по +-
// Для этого обращаемся к данному объекту через родительский див и отслеживаем любое событие внутри данного дива
// Чтобы понимать, к какому товару применяется событие, надо к карточке товара добавить атрибут (data-productid)
productsContainer.addEventListener('click', (e) => {

    // Далее нам нужно достучаться до этого атрибута
    // Через метод closest дотягиваемся до ближайшего объекта, у которого есть данный атрибут
    const id = e.target.closest('[data-productid]').dataset.productid;
    
    // Теперь мы знаем, внутри какой карточки мы находимся
    // и теперь находим конкретный объект по селектору, к которому применено событие
   if (e.target.matches('[data-click="minus"]')) {
        itemUpdateCounter(id, 'minus'); // изменение счетчика в модели
        itemUpdateViewCounter(id); // изменение счетчика в разметке

   } else if (e.target.matches('[data-click="plus"]')) {
        itemUpdateCounter(id, 'plus');
        itemUpdateViewCounter(id);
        
   }

});
