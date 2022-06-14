// Always set the dark mode immediately on load to prevent flashing.
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

document.addEventListener("DOMContentLoaded", function () {
  setupDarkModeToggle();
  setupMobileMenu();
});

function setupDarkModeToggle() {
  const sunIcon = document.getElementById("dark-mode-toggle_sun");
  const moonIcon = document.getElementById("dark-mode-toggle_moon");

  const localStorageKey = "theme";

  const setDarkMode = (isDarkMode: boolean) => {
    if (isDarkMode) {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
      document.documentElement.classList.add("dark");
    } else {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
      document.documentElement.classList.remove("dark");
    }

    localStorage[localStorageKey] = isDarkMode ? "dark" : "light";
  }

  if (localStorageKey in localStorage) {
    setDarkMode(localStorage[localStorageKey] === "dark");
  } else {
    setDarkMode(window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  const button = document.getElementById("dark-mode-toggle");

  button.addEventListener("click", () => {
    // Invert the dark mode.
    setDarkMode(localStorage[localStorageKey] !== "dark");
  });
}

function setupMobileMenu() {
  const crossIcon = document.getElementById("mobile-menu_cross-icon");
  const burgerIcon = document.getElementById("mobile-menu_burger-icon");
  const linkContainer = document.getElementById("mobile-menu_container");

  const setVisibility = (isOpen: boolean) =>  {
    if (isOpen) {
      crossIcon.classList.remove("hidden");
      burgerIcon.classList.add("hidden");
      linkContainer.classList.remove("hidden");
    } else {
      crossIcon.classList.add("hidden");
      burgerIcon.classList.remove("hidden");
      linkContainer.classList.add("hidden");
    }
  };

  setVisibility(false);

  crossIcon.addEventListener("click", () => {
    setVisibility(false);
  });

  burgerIcon.addEventListener("click", () => {
    setVisibility(true);
  });
}
