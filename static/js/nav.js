document.addEventListener('DOMContentLoaded', () => {

  const navbarBurger = document.getElementById("nav-toggle");
  const navbarBurgerIcon = document.getElementById("nav-hamburger");
  const navCrossIcon = document.getElementById("nav-cross");

  navbarBurger.addEventListener('click', () => {
    const target = document.getElementById(navbarBurger.dataset.target);

    navbarBurgerIcon.classList.toggle('hidden');
    navCrossIcon.classList.toggle('hidden');
    target.classList.toggle('hidden');
  });
});