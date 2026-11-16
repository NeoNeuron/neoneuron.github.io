// Command palette
// The site search. The panel's width and height spring open from the navbar
// search button. Every result row has a position spring and a visibility
// spring, so filtering slides the matches up into place while the rest fade
// and drop out, and the highlight glides to the current row.
// Cmd/Ctrl+K or the navbar button opens it; arrows, Enter and Escape work.
// Spring values (stiffness, damping) are the ones from the original component.
// The entries come from search-data.js, built from _scripts/search.liquid.js.
(() => {
  const pal = document.getElementById("cmdk");
  if (!pal) {
    return;
  }
  const chrome = pal.querySelector(".cmdk-chrome");
  const box = pal.querySelector(".cmdk-box");
  const input = pal.querySelector("#cmdk-input");
  const scroll = pal.querySelector(".cmdk-scroll");
  const list = pal.querySelector(".cmdk-results");
  const highlight = pal.querySelector(".cmdk-highlight");
  const empty = pal.querySelector(".cmdk-empty");
  const carrier = document.querySelector("ninja-keys"); // search-data.js puts the entries on it
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- geometry ----------
  const ROW = 38; // height of one result
  const QUERY = 52; // height of the input row
  const PAD = 6; // space under the results
  const MAX_ROWS = 8; // more matches than this scroll
  const PILL_W = 170; // closed size when there is no navbar button to grow out of
  const PILL_H = 44;

  // ---------- springs ----------
  const spring = (x, k, c) => ({ x: x, v: 0, t: x, k: k, c: reduce ? 2 * Math.sqrt(k) : c });
  const step = (s, dt) => {
    const a = -s.k * (s.x - s.t) - s.c * s.v;
    s.v += a * dt;
    s.x += s.v * dt;
  };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const settled = (s) => Math.abs(s.x - s.t) < 0.01 && Math.abs(s.v) < 0.05;

  const W = spring(PILL_W, 300, 26); // panel width
  const H = spring(PILL_H, 240, 24); // panel height
  const O = spring(0, 300, 28); // how open it is, 0..1
  const HY = spring(0, 420, 30); // highlight position

  // ---------- state ----------
  let rows = null; // built the first time the palette opens
  let open = false;
  let sel = 0;
  let closedW = PILL_W;
  let closedH = PILL_H;

  // Some titles carry markup (an external-link icon); keep the words only.
  const plain = (html) => {
    const doc = new DOMParser().parseFromString(String(html || ""), "text/html");
    return doc.body.textContent.replace(/\s+/g, " ").trim();
  };
  // Lower case and without accents, so "resume" finds "résumé".
  const fold = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const visible = () => rows.filter((r) => r.shown);
  const shownRows = () => clamp(visible().length, 1, MAX_ROWS);

  const mark = () => {
    const v = visible();
    rows.forEach((r) => {
      const current = v[sel] === r;
      r.li.classList.toggle("is-current", current);
      r.li.setAttribute("aria-selected", String(current));
    });
    if (v[sel]) {
      input.setAttribute("aria-activedescendant", v[sel].li.id);
    } else {
      input.removeAttribute("aria-activedescendant");
    }
    HY.t = sel * ROW;
    // keep the current row inside the part of the list that shows
    const viewHeight = shownRows() * ROW;
    if (sel * ROW < scroll.scrollTop) {
      scroll.scrollTop = sel * ROW;
    } else if ((sel + 1) * ROW > scroll.scrollTop + viewHeight) {
      scroll.scrollTop = (sel + 1) * ROW - viewHeight;
    }
  };
  // Decide which rows match the query and where each one goes.
  const layout = () => {
    // a row matches when it contains every word of the query, in any order
    const words = fold(input.value).split(/\s+/).filter(Boolean);
    let k = 0;
    rows.forEach((r) => {
      r.shown = words.every((word) => r.text.includes(word));
      if (r.shown) {
        r.y.t = k * ROW;
        r.idx = k;
        k += 1;
      }
      r.o.t = r.shown ? 1 : 0;
      r.li.style.pointerEvents = r.shown ? "" : "none";
    });
    list.style.height = `${k * ROW}px`;
    empty.hidden = k > 0;
    sel = Math.min(sel, Math.max(0, k - 1));
    if (open) {
      H.t = QUERY + shownRows() * ROW + PAD;
    }
    mark();
  };

  const run = (row) => {
    setOpen(false);
    if (row && typeof row.item.handler === "function") {
      row.item.handler();
    }
  };
  const build = () => {
    const entries = carrier && Array.isArray(carrier.data) ? carrier.data : [];
    rows = entries.map((item, i) => {
      const li = document.createElement("li");
      li.className = "cmdk-row";
      li.id = `cmdk-option-${i}`;
      li.setAttribute("role", "option");
      const title = document.createElement("span");
      title.className = "cmdk-title";
      title.textContent = plain(item.title);
      li.appendChild(title);
      const section = plain(item.section);
      if (section) {
        const tag = document.createElement("span");
        tag.className = "cmdk-tag";
        tag.textContent = section;
        li.appendChild(tag);
      }
      list.appendChild(li);
      const row = {
        li: li,
        item: item,
        text: fold(`${title.textContent} ${plain(item.description)} ${section}`),
        y: spring(0, 300, 26),
        o: spring(1, 300, 28),
        shown: true,
        idx: i,
      };
      li.addEventListener("click", () => run(row));
      li.addEventListener("mousemove", () => {
        if (row.shown && sel !== row.idx) {
          sel = row.idx;
          mark();
          wake();
        }
      });
      return row;
    });
    layout();
    rows.forEach((r) => {
      r.y.x = r.y.t;
    });
  };

  // ---------- where it opens from ----------
  const trigger = () => document.getElementById("search-toggle");
  const fullWidth = () => box.offsetWidth;
  const place = () => {
    const viewport = document.documentElement.clientWidth;
    const button = trigger();
    const rect = button ? button.getBoundingClientRect() : null;
    const toggler = document.querySelector(".navbar-toggler");
    const menuCollapsed = toggler && window.getComputedStyle(toggler).display !== "none";
    if (rect && rect.width > 0 && !menuCollapsed) {
      // grow out of the navbar button: same corner, same size
      closedW = rect.width;
      closedH = rect.height;
      const right = Math.max(16, Math.min(viewport - rect.right, viewport - 16 - fullWidth()));
      pal.style.top = `${rect.top}px`;
      pal.style.right = `${right}px`;
      pal.style.left = "auto";
      pal.style.transform = "none";
    } else {
      // the button is folded into the mobile menu: open from the top centre
      closedW = PILL_W;
      closedH = PILL_H;
      pal.style.top = "72px";
      pal.style.right = "auto";
      pal.style.left = "50%";
      pal.style.transform = "translateX(-50%)";
    }
  };

  function setOpen(to) {
    if (to === open) {
      return;
    }
    open = to;
    if (open) {
      pal.hidden = false;
      if (!rows) {
        build();
      }
      const wasShut = O.x < 0.01;
      place();
      if (wasShut) {
        W.x = closedW;
        H.x = closedH;
        W.v = 0;
        H.v = 0;
      }
      W.t = fullWidth();
      H.t = QUERY + shownRows() * ROW + PAD;
      O.t = 1;
      input.focus({ preventScroll: true });
    } else {
      const hadFocus = pal.contains(document.activeElement);
      W.t = closedW;
      H.t = closedH;
      O.t = 0;
      input.value = "";
      sel = 0;
      scroll.scrollTop = 0;
      layout();
      const button = trigger();
      if (hadFocus && button) {
        button.focus({ preventScroll: true });
      }
    }
    pal.classList.toggle("is-open", open);
    input.setAttribute("aria-expanded", String(open));
    wake();
  }

  // ---------- one step of the motion, and drawing ----------
  const frame = (dt) => {
    step(W, dt);
    step(H, dt);
    step(O, dt);
    step(HY, dt);
    rows.forEach((r) => {
      step(r.y, dt);
      step(r.o, dt);
    });
  };
  const render = () => {
    const o = clamp(O.x, 0, 1);
    pal.style.width = `${W.x.toFixed(2)}px`;
    pal.style.height = `${H.x.toFixed(2)}px`;
    chrome.style.opacity = clamp(o * 2.5, 0, 1).toFixed(3);
    box.style.opacity = clamp(o * 2 - 0.6, 0, 1).toFixed(3);
    rows.forEach((r) => {
      const v = clamp(r.o.x, 0, 1);
      r.li.style.opacity = v.toFixed(3);
      r.li.style.transform = `translateY(${(r.y.x + (1 - v) * 10).toFixed(2)}px) scale(${(0.96 + 0.04 * v).toFixed(4)})`;
    });
    highlight.style.opacity = visible().length ? "1" : "0";
    highlight.style.transform = `translateY(${HY.x.toFixed(2)}px)`;
  };

  // ---------- the loop: it stops when everything has come to rest ----------
  const atRest = () => [W, H, O, HY].every(settled) && rows.every((r) => settled(r.y) && settled(r.o));
  let running = false;
  let last = 0;
  const loop = (now) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    const sub = 4;
    for (let k = 0; k < sub; k++) {
      frame(dt / sub);
    }
    if (atRest()) {
      // land exactly on the targets, then sleep
      [W, H, O, HY].forEach((s) => {
        s.x = s.t;
        s.v = 0;
      });
      rows.forEach((r) => {
        r.y.x = r.y.t;
        r.o.x = r.o.t;
      });
      render();
      running = false;
      if (!open) {
        pal.hidden = true;
      }
      return;
    }
    render();
    requestAnimationFrame(loop);
  };
  function wake() {
    if (running || !rows) {
      return;
    }
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }

  // ---------- input ----------
  input.addEventListener("input", () => {
    sel = 0;
    scroll.scrollTop = 0;
    layout();
    wake();
  });
  input.addEventListener("keydown", (e) => {
    // leave the keys alone while a Chinese (or other) input method is composing
    if (e.isComposing) {
      return;
    }
    const v = visible();
    const n = Math.max(v.length, 1);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      sel = (sel + 1) % n;
      mark();
      wake();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      sel = (sel - 1 + n) % n;
      mark();
      wake();
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(v[sel]);
    } else if (e.key === "Tab") {
      // the input is the only stop inside the panel
      e.preventDefault();
    }
  });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      window.openSearchModal();
    } else if (e.key === "Escape" && open && !e.isComposing) {
      e.preventDefault();
      setOpen(false);
    }
  });
  // a press on the panel must not take the focus from the input, or the keys stop working
  pal.addEventListener("mousedown", (e) => {
    if (e.target !== input) {
      e.preventDefault();
    }
  });
  // a press anywhere outside the panel closes it
  document.addEventListener("pointerdown", (e) => {
    if (open && !pal.contains(e.target)) {
      setOpen(false);
    }
  });
  window.addEventListener("resize", () => {
    if (open) {
      place();
      W.t = fullWidth();
      wake();
    }
  });

  // The navbar search button calls this (see _includes/header.liquid).
  window.openSearchModal = () => {
    if (open) {
      setOpen(false);
      return;
    }
    // fold the mobile menu away first, as the old search did
    const menu = document.getElementById("navbarNav");
    if (menu && menu.classList.contains("show") && window.jQuery) {
      window.jQuery(menu).collapse("hide");
    }
    setOpen(true);
  };
})();
