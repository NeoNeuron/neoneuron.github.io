// Pull cord
// A lamp hangs under the navbar on a wire. Its cord is a chain of points with
// weight, kept at length by soft links, so it hangs, swings and whips like a
// rope. Held, the bead follows the pointer until the cord is tight; past that it
// stretches like rubber and tugs the lamp, which leans toward the pull. A pull
// past the click switches the site theme: the light page opens as a circle from
// the bulb (and closes back into it), the bulb pops and the lamp bounces.
// A tap, Enter or Space pulls it too, and it follows the navbar theme button.
// Spring values (stiffness, damping) are the ones from the original component.
(() => {
  const scene = document.getElementById("pull-cord");
  if (!scene) {
    return;
  }
  const grab = scene.querySelector(".pull-cord-grab");
  const lit = scene.querySelector(".pull-cord-room.is-light");
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- geometry ----------
  const WIRE = 122; // wire length
  const SHADE = 66; // shade height
  const AX = 34; // where the cord leaves the shade
  const AY = SHADE - 3;
  const N = 12; // links in the cord
  const SEG = 9; // length of one link
  const L = N * SEG; // length of the cord
  const CLICK = 22; // stretch that flips the switch
  const MAXS = 54; // the most the cord gives
  const GRAVITY = 2600;
  const MAX_SPEED = 2600;

  // ---------- springs and timers ----------
  const tune = (s, k, c) => {
    s.k = k;
    s.c = reduce ? 2 * Math.sqrt(k) : c;
  };
  const spring = (x, k, c) => ({ x: x, v: 0, t: x, k: k, c: c });
  const step = (s, dt) => {
    const a = -s.k * (s.x - s.t) - s.c * s.v;
    s.v += a * dt;
    s.x += s.v * dt;
  };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const timers = [];
  const after = (sec, fn) => {
    timers.push({ t: sec, fn: fn });
  };

  const TH = spring(0, 46, 3); // lamp angle
  const TUG = spring(0, 300, 13); // lamp drop
  const R = spring(0, 120, 21); // light radius, 0..1
  const BP = spring(1, 420, 13); // bulb pop
  const HX = spring(0, 210, 22); // the hand that pulls on a tap or a key press
  const HY = spring(0, 210, 22);
  const K = spring(1, 300, 17); // how far the cord is stretched; it eases back, so letting go is a bounce and not a whip
  tune(TH, 46, 3);
  tune(TUG, 300, 13);
  tune(R, 120, 21);
  tune(BP, 420, 13);
  tune(K, 300, 17);
  const springs = [TH, TUG, R, BP, HX, HY, K];

  const rooms = Array.from(scene.querySelectorAll(".pull-cord-room")).map((room) => ({
    lamp: room.querySelector(".pull-cord-lamp"),
    head: room.querySelector(".pull-cord-head"),
    bulb: room.querySelector(".pull-cord-bulb"),
    wire: room.querySelector(".pull-cord-wire path"),
    rope: room.querySelector(".pull-cord-rope path"),
    bead: room.querySelector(".pull-cord-bead"),
  }));

  // ---------- state ----------
  let on = false; // true while the light theme is on
  let armed = true;
  let held = null; // the pointer holding the bead
  let ghost = false; // true while the hand pulls for a tap or a key press
  let stretch = 0;
  let lean = 0;
  let side = 1;
  let flooding = null; // the page transition in flight
  let floodAge = 0;
  let width = 0; // the scene, in its own unscaled pixels
  let scale = 1;
  let originX = 0; // the scene's top left corner in the viewport
  let originY = 0;
  const pts = [];

  const anchor = () => {
    const c = Math.cos(TH.x);
    const s = Math.sin(TH.x);
    const y = WIRE + TUG.x + AY;
    return [width / 2 + AX * c - y * s, AX * s + y * c];
  };
  const bulbAt = () => {
    const c = Math.cos(TH.x);
    const s = Math.sin(TH.x);
    const y = WIRE + TUG.x + 63;
    return [width / 2 - y * s, y * c];
  };
  const measure = () => {
    const rect = scene.getBoundingClientRect();
    width = scene.offsetWidth;
    scale = rect.width / width || 1;
    originX = rect.left;
    originY = rect.top;
    if (!pts.length) {
      const [ax, ay] = anchor();
      for (let i = 0; i <= N; i++) {
        pts.push({ x: ax, y: ay + i * SEG, vx: 0, vy: 0 });
      }
    }
  };
  const local = (e) => [(e.clientX - originX) / scale, (e.clientY - originY) / scale];

  // ---------- the site theme ----------
  const siteIsLight = () => root.getAttribute("data-theme") !== "dark";
  const setSiteTheme = (light) => {
    // setThemeSetting comes from assets/js/theme.js
    if (typeof setThemeSetting === "function") {
      setThemeSetting(light ? "light" : "dark");
    }
  };
  const endFlood = (transition) => {
    if (flooding !== transition) {
      return;
    }
    flooding = null;
    root.classList.remove("pull-cord-to-light", "pull-cord-to-dark");
    root.style.removeProperty("--pull-cord-clip");
  };
  // Switch the site theme, letting the light open from (or close into) the bulb.
  const flood = (light) => {
    if (reduce || typeof document.startViewTransition !== "function") {
      setSiteTheme(light);
      return;
    }
    root.classList.toggle("pull-cord-to-light", light);
    root.classList.toggle("pull-cord-to-dark", !light);
    const transition = document.startViewTransition(() => {
      setSiteTheme(light);
      // the circle does the fading, so skip the site's own fade
      root.classList.remove("transition");
    });
    flooding = transition;
    floodAge = 0;
    transition.ready.catch(() => {});
    transition.finished.catch(() => {}).then(() => endFlood(transition));
  };

  // The lamp itself: light on or off, with the bulb pop and the bounce.
  const flip = (to) => {
    if (to === on) {
      return;
    }
    on = to;
    grab.setAttribute("aria-checked", String(on));
    BP.x = on ? 1.35 : 0.8;
    TUG.v += 150;
  };

  // what holds the bead: a real pointer, or the hand
  const pin = () => {
    if (held) {
      return [held.x, held.y];
    }
    if (ghost) {
      return [HX.x, HY.x];
    }
    return null;
  };
  // one pull by the hand (a tap, Enter or Space)
  const pull = () => {
    if (ghost || held) {
      return;
    }
    const b = pts[N];
    ghost = true;
    armed = true;
    side = -side;
    HX.x = b.x;
    HY.x = b.y;
    HX.v = b.vx;
    HY.v = b.vy;
    const [ax, ay] = anchor();
    HX.t = ax + side * 26;
    HY.t = ay + L + 64;
    // let go even if it never clicked
    after(1.1, () => {
      ghost = false;
    });
    wake();
  };

  // ---------- one step of the simulation ----------
  const frame = (dt) => {
    springs.forEach((s) => step(s, dt));
    if (dt <= 0) {
      return;
    }
    const [ax, ay] = anchor();
    const p = pin();
    const b = pts[N];

    // the held end: free inside the cord's reach, rubber past it
    let px = 0;
    let py = 0;
    stretch = 0;
    lean = 0;
    if (p) {
      const dx = p[0] - ax;
      const dy = p[1] - ay;
      const d = Math.hypot(dx, dy) || 1;
      const over = Math.max(0, d - L);
      const give = MAXS * (1 - Math.exp(-over / 70));
      const r = Math.min(d, L) + give;
      px = ax + (dx / d) * r;
      py = ay + (dy / d) * r;
      stretch = give;
      lean = over > 0 ? dx / d : 0;
      if (over > 0) {
        K.x = r / L;
        K.t = r / L;
        K.v = 0;
      }
      if (armed && give > CLICK) {
        armed = false;
        flip(!on);
        flood(on);
        if (held) {
          held.flipped = true;
        } else {
          after(0.12, () => {
            ghost = false;
          });
        }
      }
    }
    if (!p || !stretch) {
      K.t = 1;
    }
    const seg = SEG * Math.max(1, K.x);
    TUG.t = stretch * 0.22;
    TH.t = clamp(((-lean * stretch) / MAXS) * 0.5, -0.3, 0.3);

    // the rope: gravity, then links pulled back to length a few times
    const prev = pts.map((q) => [q.x, q.y]);
    for (let i = 1; i <= N; i++) {
      const q = pts[i];
      const drag = Math.exp(-(i === N ? 1.1 : 2.4) * dt);
      q.vy += GRAVITY * dt;
      q.vx *= drag;
      q.vy *= drag;
      const speed = Math.hypot(q.vx, q.vy);
      if (speed > MAX_SPEED) {
        q.vx *= MAX_SPEED / speed;
        q.vy *= MAX_SPEED / speed;
      }
      q.x += q.vx * dt;
      q.y += q.vy * dt;
    }
    for (let pass = 0; pass < 8; pass++) {
      pts[0].x = ax;
      pts[0].y = ay;
      if (p) {
        b.x = px;
        b.y = py;
      }
      for (let i = 0; i < N; i++) {
        const a = pts[i];
        const c = pts[i + 1];
        const dx = c.x - a.x;
        const dy = c.y - a.y;
        const d = Math.hypot(dx, dy) || 1e-6;
        const f = ((d - seg) / d) * 0.5;
        const wa = i === 0 ? 0 : 1;
        // the bead is heavy
        const beadWeight = p ? 0 : 0.3;
        const wc = i + 1 === N ? beadWeight : 1;
        const sum = wa + wc || 1;
        a.x += ((dx * f * wa) / sum) * 2;
        a.y += ((dy * f * wa) / sum) * 2;
        c.x -= ((dx * f * wc) / sum) * 2;
        c.y -= ((dy * f * wc) / sum) * 2;
      }
    }
    pts[0].x = ax;
    pts[0].y = ay;
    if (p) {
      b.x = px;
      b.y = py;
    }
    for (let i = 1; i <= N; i++) {
      pts[i].vx = (pts[i].x - prev[i][0]) / dt;
      pts[i].vy = (pts[i].y - prev[i][1]) / dt;
    }

    // the light opens wide and closes a little faster
    R.t = on ? 1 : 0;
    if (on) {
      tune(R, 120, 21);
    } else {
      tune(R, 170, 27);
    }

    // the page has caught up with the light: let the transition go
    if (flooding) {
      floodAge += dt;
      const settled = Math.abs(R.x - R.t) < 0.002 && Math.abs(R.v) < 0.02;
      if (settled || floodAge > 3) {
        flooding.skipTransition();
      }
    }
  };

  // ---------- drawing ----------
  const render = () => {
    const th = TH.x;
    const tug = TUG.x;
    const b = pts[N];
    const e = pts[N - 1];
    let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < N; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      const my = (pts[i].y + pts[i + 1].y) / 2;
      d += `Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    d += `L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    const ang = Math.atan2(e.x - b.x, b.y - e.y);
    const wl = WIRE + tug - 4;
    const wd = `M${(width / 2).toFixed(1)} -4L${(width / 2 - Math.sin(th) * wl).toFixed(2)} ${(Math.cos(th) * wl).toFixed(2)}`;
    const beadAt = `translate(${b.x.toFixed(2)}px,${b.y.toFixed(2)}px)`;
    rooms.forEach((o) => {
      o.lamp.style.transform = `rotate(${th.toFixed(4)}rad)`;
      o.wire.setAttribute("d", wd);
      o.head.style.transform = `translateY(${(WIRE + tug).toFixed(2)}px)`;
      o.bulb.style.transform = `scale(${BP.x.toFixed(4)})`;
      o.rope.setAttribute("d", d);
      o.bead.style.transform = `${beadAt} rotate(${ang.toFixed(4)}rad)`;
    });
    grab.style.transform = beadAt;

    // light: a circle from the bulb, big enough to pass the far corner of the window
    const [bx, by] = bulbAt();
    const vx = originX + bx * scale;
    const vy = originY + by * scale;
    const far = Math.hypot(Math.max(vx, root.clientWidth - vx), Math.max(vy, window.innerHeight - vy)) + 24;
    const r = Math.max(0, R.x) * far;
    lit.style.visibility = r < 4 ? "hidden" : "visible";
    lit.style.clipPath = `circle(${(r / scale).toFixed(1)}px at ${bx.toFixed(1)}px ${by.toFixed(1)}px)`;
    if (flooding) {
      root.style.setProperty("--pull-cord-clip", `circle(${r.toFixed(1)}px at ${vx.toFixed(1)}px ${vy.toFixed(1)}px)`);
    }
  };

  // ---------- the loop: it stops when everything has come to rest ----------
  const still = []; // where the cord hung when it was last seen moving
  // The links never settle to an exact zero speed, so rest is judged by distance:
  // has any point left the place it was last seen in?
  const cordMoved = () => {
    const moved = pts.some((q, i) => !still[i] || Math.hypot(q.x - still[i][0], q.y - still[i][1]) > 0.05);
    if (moved) {
      pts.forEach((q, i) => {
        still[i] = [q.x, q.y];
      });
    }
    return moved;
  };
  const busy = () => {
    if (held || ghost || flooding || timers.length) {
      return true;
    }
    if (springs.some((s) => Math.abs(s.x - s.t) > 1e-3 || Math.abs(s.v) > 1e-2)) {
      return true;
    }
    return cordMoved();
  };
  let running = false;
  let last = 0;
  let rest = 0;
  const loop = (now) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    for (let i = timers.length - 1; i >= 0; i--) {
      timers[i].t -= dt;
      if (timers[i].t <= 0) {
        timers.splice(i, 1)[0].fn();
      }
    }
    const sub = 4;
    for (let k = 0; k < sub; k++) {
      frame(dt / sub);
    }
    render();
    rest = busy() ? 0 : rest + dt;
    if (rest > 0.5) {
      running = false;
      return;
    }
    requestAnimationFrame(loop);
  };
  function wake() {
    rest = 0;
    if (running) {
      return;
    }
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }

  // ---------- input ----------
  grab.addEventListener("pointerdown", (e) => {
    measure();
    const [x, y] = local(e);
    const b = pts[N];
    held = { id: e.pointerId, x: b.x, y: b.y, ox: b.x - x, oy: b.y - y, moved: 0, sx: x, sy: y, flipped: false };
    ghost = false;
    armed = true;
    try {
      grab.setPointerCapture(e.pointerId);
    } catch {
      // the pointer is already gone
    }
    grab.classList.add("is-held");
    wake();
  });
  grab.addEventListener("pointermove", (e) => {
    if (!held || e.pointerId !== held.id) {
      return;
    }
    const [x, y] = local(e);
    held.x = x + held.ox;
    held.y = y + held.oy;
    held.moved = Math.max(held.moved, Math.hypot(x - held.sx, y - held.sy));
  });
  const drop = (e) => {
    if (!held || e.pointerId !== held.id) {
      return;
    }
    const tap = held.moved < 5 && !held.flipped && e.type === "pointerup";
    held = null;
    grab.classList.remove("is-held");
    if (tap) {
      pull();
    }
  };
  grab.addEventListener("pointerup", drop);
  grab.addEventListener("pointercancel", drop);
  // keyboard: Enter and Space arrive as a click with no pointer behind it
  grab.addEventListener("click", (e) => {
    if (!e.detail) {
      pull();
    }
  });

  // the navbar theme button and the system setting: the lamp follows them
  new MutationObserver(() => {
    flip(siteIsLight());
    wake();
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", () => {
    measure();
    wake();
  });

  // ---------- start ----------
  on = siteIsLight();
  grab.setAttribute("aria-checked", String(on));
  R.x = on ? 1 : 0;
  R.t = R.x;
  measure();
  if (!reduce) {
    // a small sway on arrival, so the cord reads as something you can pull
    pts[N].vx = 240;
  }
  scene.classList.add("is-ready");
  wake();
})();
