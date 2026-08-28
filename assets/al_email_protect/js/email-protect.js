// Rejoins addresses that al_email_protect emitted in halves, and copies them to
// the clipboard on click. Vanilla by design: al-folio v1 dropped jQuery from the
// core runtime, and a plugin that reintroduced it would break sites that do not
// load the bootstrap-compat shim.
(function () {
  "use strict";

  var TOAST_ID = "al-email-copied-toast";
  var TOAST_MS = 1800;
  var toastTimer = null;

  function showToast(message) {
    var toast = document.getElementById(TOAST_ID);
    if (!toast) {
      toast = document.createElement("div");
      toast.id = TOAST_ID;
      // Announce politely so screen readers report the copy without stealing focus.
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");

    // Restart the timer rather than stacking them, or a second click hides the
    // toast early while it is still animating in from the first.
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
      toastTimer = null;
    }, TOAST_MS);
  }

  function legacyCopy(text) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(field);
    field.select();
    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (err) {
      copied = false;
    }
    document.body.removeChild(field);
    return copied;
  }

  function addressOf(element) {
    var local = element.getAttribute("data-eu");
    var domain = element.getAttribute("data-ed");
    if (!local || !domain) {
      return null;
    }
    return local + "@" + domain;
  }

  function copy(element) {
    var address = addressOf(element);
    if (!address) {
      return;
    }

    // navigator.clipboard is undefined on any page not served over a secure
    // context, which includes plain-HTTP self-hosting and some previews. Fall
    // back rather than throwing, so the click still does something useful.
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(address).then(
        function () {
          showToast("Email copied to clipboard");
        },
        function () {
          // Permission can still be refused; surface the address so the visitor
          // can copy it by hand instead of getting silence.
          showToast(address);
        }
      );
      return;
    }

    showToast(legacyCopy(address) ? "Email copied to clipboard" : address);
  }

  // Delegated so addresses rendered after load (search palette, lazy includes)
  // are handled without re-binding.
  function onActivate(event) {
    var element = event.target.closest ? event.target.closest(".al-email-protect") : null;
    if (!element) {
      return;
    }
    event.preventDefault();
    copy(element);
  }

  function ready() {
    document.addEventListener("click", onActivate);

    // The element is an <a href="#">, so it is already focusable and reachable
    // by keyboard, but Enter fires click while Space does not. Handle Space too.
    document.addEventListener("keydown", function (event) {
      if (event.key !== " " && event.key !== "Spacebar") {
        return;
      }
      var element = event.target.closest ? event.target.closest(".al-email-protect") : null;
      if (element) {
        event.preventDefault();
        copy(element);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
