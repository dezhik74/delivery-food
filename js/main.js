'use strict'; 

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector ('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector ('.container-promo');
const restaurants = document.querySelector ('.restaurants');
const menu = document.querySelector ('.menu');
const logo = document.querySelector ('.logo');
const cardsMenu = document.querySelector ('.cards-menu');
const restaurantMenu = document.querySelector ('.restaurant-menu');

let login = localStorage.getItem('gloDelivery');

const getData = async function (url) {
  const responce = await fetch (url);
  if (!responce.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${responce.status}!`);
  }
  return await responce.json();
};

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth () {
  modalAuth.classList.toggle("is-open");
  if (!login) {
    document.querySelector('.auth-error').style.display = 'none';
  } 
}

function authorized () {

  function logOut() {
    login = null;
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    localStorage.removeItem('gloDelivery');
    checkAuth();
  }
  console.log('Авторизован');

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
}

function notAuthorized () {

  function logIn (event) {
    event.preventDefault();
    if (loginInput.value) {
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth ();
    } else {
        document.querySelector('.auth-error').style.display = 'block';
    }
  }

  console.log("не авторизован");
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth () {
  if (login) {
    authorized ();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant ({ image, kitchen, name, price, stars, time_of_delivery:timeOfDelivery, products }) {

  const card = `
  <a class="card card-restaurant" data-products="${products}"
    data-name="${name}" data-rating="${stars}" data-price="${price}" data-kitchen="${kitchen}">
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>
  `;


  cardsRestaurants.insertAdjacentHTML('beforeend', card);

}

function createRestaurantMenu (dataset) {

  console.log(dataset);

  const restMenu = `
    <h2 class="section-title restaurant-title">${dataset.name}</h2>
    <div class="card-info">
      <div class="rating">
        ${dataset.rating}
      </div>
      <div class="price">От ${dataset.price} ₽</div>
      <div class="category">${dataset.kitchen}</div>
    </div>
  `;
  restaurantMenu.textContent="";
  restaurantMenu.insertAdjacentHTML ('beforeend', restMenu);

}

function createCardGood ({ id, name, description, price, image }) {

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">
          ${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);
  cardsMenu.insertAdjacentElement ('beforeend', card);
}

function openGoods (event) {
  
  const target = event.target
  const restaurant = target.closest('.card-restaurant');

  if (!login) {
    toggleModalAuth ();
    return;
  }
  
  if (restaurant) {
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    createRestaurantMenu(restaurant.dataset);
    getData(`./db/${restaurant.dataset.products}`).then(function (data) {
      data.forEach(createCardGood);
    })
  }

}

function init () {

  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
  })
  
  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  cardsRestaurants.addEventListener ('click', openGoods);
  
  Array.from(document.querySelectorAll('.logo')).map(function (item) {
    item.addEventListener ('click', function () {
      containerPromo.classList.remove('hide');
      restaurants.classList.remove('hide');
      menu.classList.add('hide');
    })
  })
  
  checkAuth ();
  
  new Swiper ('.swiper-container', {
    loop: true,
    sliderPerView: 1,
  });
  

}

init ();