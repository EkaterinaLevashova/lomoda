const headerCityButton = document.querySelector('.header__city-button');

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

subheaderСart.addEventListener('click', cartModalOpen);

cartOverlay.addEventListener('click', event => {
    console.log(event);
    const target = event.target;
    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) { //проверяет селектор, cart-overlay - клик вне модалки
        cartModalClose();
    }
})

cartOverlay.addEventListener('keydown', event => {
    console.log(event);
    if (event.keyCode == 27) {
        cartModalClose();
    }
})