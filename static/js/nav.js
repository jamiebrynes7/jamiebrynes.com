document.addEventListener('DOMContentLoaded', () => {

  const navbarBurger = document.getElementById("nav-toggle");

  navbarBurger.addEventListener('click', () => {
  
    // Get the target from the "data-target" attribute
    const target = navbarBurger.dataset.target;
    const $target = document.getElementById(target);

    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    navbarBurger.classList.toggle('hidden');
    $target.classList.toggle('hidden');
  });
});