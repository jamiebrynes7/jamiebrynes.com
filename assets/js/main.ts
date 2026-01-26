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
  setupCodeCopyButtons();
});

function setupDarkModeToggle() {
  const localStorageKey = "theme";

  const setDarkMode = (isDarkMode: boolean) => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
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

function setupCodeCopyButtons() {
  const clipboardIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
  const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  const codeBlocks = document.querySelectorAll(".arbgen-code");

  codeBlocks.forEach((block) => {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.innerHTML = clipboardIcon;
    button.setAttribute("aria-label", "Copy code to clipboard");
    button.setAttribute("title", "Copy");

    button.addEventListener("click", async () => {
      const code = block.querySelector("code");
      if (!code) return;

      try {
        // Extract text from each line content span and join with newlines
        const lineContents = code.querySelectorAll(".lc");
        const text = Array.from(lineContents)
          .map((lc) => lc.textContent || "")
          .join("\n");
        await navigator.clipboard.writeText(text);

        // Fade out, swap icon, fade in
        button.style.opacity = "0";
        setTimeout(() => {
          button.innerHTML = checkIcon;
          button.classList.add("copied");
          button.setAttribute("aria-label", "Copied!");
          button.setAttribute("title", "Copied!");
          button.style.opacity = "1";
        }, 150);

        setTimeout(() => {
          button.style.opacity = "0";
          setTimeout(() => {
            button.innerHTML = clipboardIcon;
            button.classList.remove("copied");
            button.setAttribute("aria-label", "Copy code to clipboard");
            button.setAttribute("title", "Copy");
            button.style.opacity = "1";
          }, 150);
        }, 1500);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    });

    block.appendChild(button);
  });
}
