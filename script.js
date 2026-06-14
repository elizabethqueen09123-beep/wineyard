/* ===== Nightingale Family Vineyard — JS (corrected) ===== */
document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  /* ---- Age Gate ---- */
  const gate = document.getElementById("ageGate");
  function openSite() {
    if (gate) gate.classList.add("hidden");
    body.classList.remove("locked");
  }
  if (localStorage.getItem("ngAge") === "ok") openSite();

  const gateYes = document.getElementById("gateYes");
  const gateNo = document.getElementById("gateNo");
  if (gateYes) gateYes.addEventListener("click", function () {
    localStorage.setItem("ngAge", "ok");
    openSite();
  });
  if (gateNo) gateNo.addEventListener("click", function () {
    const main = document.getElementById("gateMain");
    const deny = document.getElementById("gateDeny");
    if (main) main.style.display = "none";
    if (deny) deny.classList.add("show");
  });

  /* ---- Header / nav ---- */
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 40);
    });
  }
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  /* ---- Wine Slider ---- */
  const slider = document.querySelector(".slider");
  if (slider) {
    const slides = [...slider.querySelectorAll(".slide")];
    const dotsWrap = document.getElementById("sliderDots");
    let idx = 0, timer;

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        const b = document.createElement("button");
        b.setAttribute("aria-label", "Go to slide " + (i + 1));
        if (i === 0) b.classList.add("active");
        b.addEventListener("click", function () { go(i, true); });
        dotsWrap.appendChild(b);
      });
    }
    const dots = dotsWrap ? [...dotsWrap.children] : [];

    function go(n, manual) {
      slides[idx].classList.remove("active");
      if (dots[idx]) dots[idx].classList.remove("active");
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add("active");
      if (dots[idx]) dots[idx].classList.add("active");
      if (manual) restart();
    }
    const next = function () { go(idx + 1); };
    const prev = function () { go(idx - 1); };
    function start() { timer = setInterval(next, 6000); }
    function restart() { clearInterval(timer); start(); }

    const nextBtn = document.getElementById("slideNext");
    const prevBtn = document.getElementById("slidePrev");
    if (nextBtn) nextBtn.addEventListener("click", function () { go(idx + 1, true); });
    if (prevBtn) prevBtn.addEventListener("click", function () { go(idx - 1, true); });

    slider.addEventListener("mouseenter", function () { clearInterval(timer); });
    slider.addEventListener("mouseleave", start);

    document.addEventListener("keydown", function (e) {
      const lbEl = document.getElementById("lightbox");
      if (lbEl && lbEl.classList.contains("open")) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    let x0 = null;
    slider.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) { dx < 0 ? go(idx + 1, true) : go(idx - 1, true); }
      x0 = null;
    });

    if (slides.length) start();
  }

  /* ---- Build gallery ---- */
  const grid = document.getElementById("galleryGrid");
  if (grid) {
    const galleryArt = [
      { cls: "wide", c: ["#5e2a30", "#b15b3c", "#e8b87c"] },
      { cls: "", c: ["#6b6f47", "#4d5235", "#3c4029"] },
      { cls: "tall", c: ["#5a1f2b", "#7a2e38", "#3c1a22"] },
      { cls: "", c: ["#b15b3c", "#c2974a", "#e8b87c"] },
      { cls: "", c: ["#4d5235", "#6b6f47", "#c2974a"] },
      { cls: "wide", c: ["#34121b", "#5a1f2b", "#9e2f4a"] },
      { cls: "", c: ["#c2b06a", "#d8c98a", "#6b6f47"] }
    ];
    galleryArt.forEach(function (g, i) {
      const fig = document.createElement("figure");
      fig.className = g.cls;
      fig.dataset.i = i;
      fig.innerHTML =
        '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">' +
        '<defs><linearGradient id="ga' + i + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="' + g.c[0] + '"/>' +
        '<stop offset=".55" stop-color="' + g.c[1] + '"/>' +
        '<stop offset="1" stop-color="' + g.c[2] + '"/></linearGradient></defs>' +
        '<rect width="400" height="300" fill="url(#ga' + i + ')"/>' +
        '<circle cx="' + (90 + i * 22) + '" cy="150" r="80" fill="none" stroke="#f7f2ea" stroke-width="1.5" opacity=".35"/>' +
        '<path d="M0 220 Q200 180 400 220 V300 H0Z" fill="rgba(52,18,27,.25)"/></svg>';
      grid.appendChild(fig);
    });
  }

  /* ---- Lightbox ---- */
  const lb = document.getElementById("lightbox");
  const lbStage = document.getElementById("lbStage");
  if (lb && lbStage && grid) {
    let current = 0;
    function showLB(i) {
      const figs = [...grid.querySelectorAll("figure")];
      if (!figs.length) return;
      current = (i + figs.length) % figs.length;
      lbStage.innerHTML = figs[current].querySelector("svg").outerHTML;
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      body.classList.add("locked");
    }
    function closeLB() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      if (localStorage.getItem("ngAge") === "ok") body.classList.remove("locked");
    }
    grid.addEventListener("click", function (e) {
      const f = e.target.closest("figure");
      if (f) showLB(+f.dataset.i);
    });
    const lbClose = document.getElementById("lbClose");
    const lbNext = document.getElementById("lbNext");
    const lbPrev = document.getElementById("lbPrev");
    if (lbClose) lbClose.addEventListener("click", closeLB);
    if (lbNext) lbNext.addEventListener("click", function () { showLB(current + 1); });
    if (lbPrev) lbPrev.addEventListener("click", function () { showLB(current - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowRight") showLB(current + 1);
      if (e.key === "ArrowLeft") showLB(current - 1);
    });
  }

  /* ---- Scroll reveal ---- */
  const io = new IntersectionObserver(function (en) {
    en.forEach(function (x) {
      if (x.isIntersecting) { x.target.classList.add("visible"); io.unobserve(x.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---- Stat counters ---- */
  const sio = new IntersectionObserver(function (en) {
    en.forEach(function (x) {
      if (!x.isIntersecting) return;
      const el = x.target, t = +el.dataset.target;
      let n = 0, step = Math.max(1, Math.ceil(t / 40));
      const tick = function () {
        n += step;
        if (n >= t) { el.textContent = t; }
        else { el.textContent = n; requestAnimationFrame(tick); }
      };
      tick();
      sio.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat__num").forEach(function (el) { sio.observe(el); });

  /* ---- Contact form ---- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form && status) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      status.textContent = "Sending…";
      status.className = "form-status";
      try {
        const r = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (r.ok) {
          status.textContent = "Thank you. We'll be in touch shortly.";
          status.className = "form-status ok";
          form.reset();
        } else {
          status.textContent = "Something went wrong. Please try again.";
          status.className = "form-status err";
        }
      } catch (err) {
        status.textContent = "Network error. Please try again.";
        status.className = "form-status err";
      }
    });
  }

  /* ---- Footer year ---- */
  document.querySelectorAll(".year").forEach(function (e) {
    e.textContent = new Date().getFullYear();
  });
});
