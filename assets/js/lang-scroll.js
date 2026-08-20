/*
 * Keep the reading position when the visitor switches language.
 *
 * The language toggle is an ordinary link to the sibling page, so the browser
 * would normally land at the top of the new document. The two language builds
 * of a page are structurally mirrored by polyglot but differ slightly in
 * height, so the position is stored as a fraction of the scrollable range and
 * re-applied proportionally on the other side.
 *
 * This file runs synchronously in <head> so that a pending restore is known
 * before the body is parsed: the content is held back until it has been
 * scrolled into place, otherwise the visitor sees the top of the page flash by
 * before the jump.
 */
const LANG_SCROLL_KEY = "langSwitchScroll";
const LANG_SCROLL_STYLE_ID = "lang-scroll-hide";
// never leave the content hidden, whatever else goes wrong
const LANG_SCROLL_REVEAL_TIMEOUT = 1500;

/*
 * Read and consume the pending position straight away. Consuming it here makes
 * the restore one-shot: an ordinary navigation later on must not inherit it.
 */
const pendingScrollFraction = (function () {
  const stored = sessionStorage.getItem(LANG_SCROLL_KEY);
  sessionStorage.removeItem(LANG_SCROLL_KEY);

  // an anchor in the URL wins over a restored position
  if (stored === null || window.location.hash) {
    return null;
  }

  const fraction = parseFloat(stored);
  return fraction > 0 ? fraction : null;
})();

function scrollableRange() {
  return document.documentElement.scrollHeight - window.innerHeight;
}

function saveScrollForLanguageSwitch(event) {
  /*
   * Middle-click and cmd/ctrl-click open the link in another tab and leave this
   * page where it is, so there is no switch to carry a position across.
   */
  if (event && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
    return;
  }

  const range = scrollableRange();
  const position = window.scrollY || document.documentElement.scrollTop || 0;

  if (range <= 0 || position <= 0) {
    // at the top, or nothing to scroll: let the other page open normally
    sessionStorage.removeItem(LANG_SCROLL_KEY);
    return;
  }

  sessionStorage.setItem(LANG_SCROLL_KEY, String(Math.min(position / range, 1)));
}

/*
 * `visibility` rather than `display`, so the document still lays out and can be
 * scrolled while hidden. The rule targets the body: the background lives there
 * (see _sass/_layout.scss) and propagates to the canvas, so the page keeps its
 * light or dark backdrop instead of flashing white.
 */
function hideContentUntilScrolled() {
  const style = document.createElement("style");
  style.id = LANG_SCROLL_STYLE_ID;
  style.textContent = "body { visibility: hidden !important; }";
  document.head.appendChild(style);
  setTimeout(revealContent, LANG_SCROLL_REVEAL_TIMEOUT);
}

function revealContent() {
  const style = document.getElementById(LANG_SCROLL_STYLE_ID);
  if (style) {
    style.remove();
  }
}

function applyPendingScroll() {
  const range = scrollableRange();
  if (range > 0) {
    window.scrollTo(0, Math.round(pendingScrollFraction * range));
  }
}

if (pendingScrollFraction !== null) {
  hideContentUntilScrolled();

  document.addEventListener("DOMContentLoaded", function () {
    /*
     * Both in the same task: the browser cannot paint between the two, so the
     * content becomes visible already at the right position. Scheduling the
     * reveal on an animation frame instead would stall in a background tab,
     * where requestAnimationFrame is throttled.
     */
    applyPendingScroll();
    revealContent();
  });

  /*
   * Images are rendered with `height="auto"` and so reserve no space, which
   * means the document keeps growing after the first layout. Correct the
   * position once everything has settled. The small delay after `load` mirrors
   * what progress-bar.js does for the same reason.
   */
  window.addEventListener(
    "load",
    function () {
      setTimeout(function () {
        applyPendingScroll();
        revealContent();
      }, 50);
    },
    { once: true }
  );
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-lang-switch]").forEach(function (link) {
    link.addEventListener("click", saveScrollForLanguageSwitch);
  });
});
