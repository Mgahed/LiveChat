(function ($) {

  "use strict";


})(jQuery);

function toggle_menu() {
  $('.chat-app .people-list').css('left', '0');
}

function close_menu() {
  $('.chat-app .people-list').css('left', '-600px');
}

/*const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);*/
