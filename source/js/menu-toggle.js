var navMain = document.querySelector('.main-nav');
var navToggle = navMain.querySelector('.main-nav__toggle');

navMain.classList.remove('main-nav--nojs');

navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.replace('main-nav--closed', 'main-nav--opened');
  } else {
    navMain.classList.replace('main-nav--opened', 'main-nav--closed');
  }
});
