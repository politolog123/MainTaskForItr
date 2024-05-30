document.addEventListener("DOMContentLoaded", () => {
  const themeStylesheet = document.getElementById("themeStylesheet");
  const toggleThemeButton = document.getElementById("toggleThemeButton");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    themeStylesheet.setAttribute("href", savedTheme);
    updateButtonLabel(savedTheme);
  }

  if (toggleThemeButton) {
    toggleThemeButton.addEventListener("click", () => {
      const currentTheme = themeStylesheet.getAttribute("href");
      const newTheme =
        currentTheme === "/css/light-theme.css"
          ? "/css/dark-theme.css"
          : "/css/light-theme.css";
      themeStylesheet.setAttribute("href", newTheme);

      localStorage.setItem("theme", newTheme);

      updateButtonLabel(newTheme);
    });
  }

  function updateButtonLabel(theme) {
    if (toggleThemeButton) {
      toggleThemeButton.textContent =
        theme === "/css/light-theme.css"
          ? "Switch to Dark Theme"
          : "Switch to Light Theme";
    }
  }
});
