(function () {
  function applyCookieThemeClass() {
    var root = document.documentElement;
    var theme = root.getAttribute("data-theme");

    if (theme === "dark") {
      root.classList.add("cc--darkmode");
    } else {
      root.classList.remove("cc--darkmode");
    }
  }

  function setupObserver() {
    if (typeof MutationObserver !== "function") {
      return;
    }

    var root = document.documentElement;
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i += 1) {
        if (mutations[i].attributeName === "data-theme") {
          applyCookieThemeClass();
          break;
        }
      }
    });

    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyCookieThemeClass();
    setupObserver();
  });
})();
