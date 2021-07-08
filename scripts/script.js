const headerCityButton = document.querySelector('.header__city-button');

let hash = location.hash.substring(1) //взяли хэш и обрезали решетку

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?' //достаем данные, если получены, то город в кнопке меняется

headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите ваш город');
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city) //localStorage
});

// Блокировка скролла

const disableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth; //ширина скролла
    
    document.body.dbScrollY = window.scrollY; // не дает скакать экрану при скролле перед кликом на модалку
    
    document.body.style.cssText = `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding-right: ${widthScroll}px;
    `;
}

const enableScroll = () => {
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY //предотвращение скролла после закрытия модалки
    }
    )
}

// Модальное окно (корзина)

const subheaderСart = document.querySelector('.subheader__cart')
const cartOverlay = document.querySelector('.cart-overlay')

const cartModalOpen = () => {
    cartOverlay.classList.add('cart-overlay-open')
    disableScroll();
}

const cartModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open')
    enableScroll();
}

cartOverlay.addEventListener('keydown', event => {
    console.log(event);
    if (event.keyCode == 27) {
        cartModalClose();
    }
})

//Запрос БД

const getData = async () => {  
    const data = await fetch('db.json');    // returns promiss  - "дождитесь пока данные вам вернуться" | await willn`t make an assignment "выполнять присваиванием", while fetch willn` return responce 

    if (data.ok) {
        return data.json()
    } else {
        throw new Error (`Данные не были получены, ошибка ${data.status} ${data.statusText}`)   //исключение
    }
};


const getGoods = (callback, value) => {
    getData()
        .then(data => {    //когда getData вызовет return, тогда вызовится эта функция then
            if (value) {
                callback(data.filter(item => item.category === value))
            } else {
                callback(data);
            }
        })
        .catch (err => {
            callback(err)
        });
}


getGoods ((data) => {
    console.warn('data')
})


subheaderСart.addEventListener('click', cartModalOpen);

cartOverlay.addEventListener('click', event => {
    const target = event.target;
    
    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) { //проверяет селектор, cart-overlay - клик вне модалки
        cartModalClose();
    }
})

try { //если в блоке try возникается ошибка, то catch ее отлавливает
    const goodsList = document.querySelector('.goods__list')

    if (!goodsList) {
        throw 'Это не страница товаров'
    }

    const createCard = data => {

        const { id, preview, cost, brand, name, sizes } = data; //деструктуризация

        const li = document.createElement('li');
        li.classList.add('goods__item');

        li.innerHTML = `
            <article class="good">
                <a class="good__link-img" href="card-good.html#${id}">
                    <img class="good__img" src="goods-image/${preview}" alt="">
                </a>
                <div class="good__description">
                    <p class="good__price">${cost} &#8381;</p>
                    <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                    ${sizes ? 
                        `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` :
                    ``}
                    
                    <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                </div>
            </article>
        `
        return li;
    };

    const renderGoogsList = data => {
        goodsList.textContent = '';
        
        data.forEach(item => {
            const card = createCard(item);
            goodsList.append(card)
        });
    };

    window.addEventListener('hashchange', () => {   //обновление товаров без обновления станицы
        hash = location.hash.substring(1)
        getGoods(renderGoogsList, hash); 
    })

    getGoods(renderGoogsList, hash);


} catch (err) {
    console.log(err)
}