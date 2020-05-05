const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

//day1 

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector ('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('gloDelivery');

function toggleModalAuth () {
  console.log("Переключаю модалку аутентификации");
  modalAuth.classList.toggle("is-open");
}

buttonAuth.addEventListener('click', toggleModalAuth);
closeAuth.addEventListener('click', toggleModalAuth);

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
    console.log('логин');
    if (loginInput.value) {
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();
      console.log('loginInput.value: ', loginInput.value);
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

checkAuth ();