/* ============================================================
   Signature Craft — interactions
   ============================================================ */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- current year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- sticky nav background ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const toggle = $("#navToggle");
  const navLinks = $("#navLinks");
  const closeMenu = () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$(".nav__link", navLinks).forEach((l) => l.addEventListener("click", closeMenu));
  navLinks.querySelector(".nav__cta")?.addEventListener("click", closeMenu);

  /* ---------- reveal on scroll ---------- */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  $$(".reveal").forEach((el) => revealObs.observe(el));

  /* ---------- active nav link (scroll spy) ---------- */
  const sections = ["story", "gallery", "custom", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          $$(".nav__link").forEach((l) =>
            l.classList.toggle("is-active", l.getAttribute("href") === "#" + id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ============================================================
     GALLERY  (built from PRODUCTS in products.js)
     ============================================================ */
  const grid = $("#grid");
  const filtersEl = $("#filters");
  const MARK = "assets/logo-mark.svg";

  // placeholder tile markup for a product with no photo
  const placeholder = (p) =>
    `<div class="card__ph" data-tone="${p.tone || "chestnut"}">
       <img src="${MARK}" alt="" />
     </div>`;

  const mediaMarkup = (p) =>
    p.image
      ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />`
      : placeholder(p);

  function renderCards(list) {
    grid.innerHTML = list
      .map(
        (p, i) => `
      <article class="card" data-index="${PRODUCTS.indexOf(p)}" style="transition-delay:${(i % 4) * 70}ms">
        <div class="card__media">
          ${mediaMarkup(p)}
          <span class="card__view">View details</span>
        </div>
        <div class="card__body">
          <div>
            <h3 class="card__name">${p.name}</h3>
            <p class="card__cat">${p.category}</p>
          </div>
          ${p.price ? `<span class="card__price">${p.price}</span>` : ""}
        </div>
      </article>`
      )
      .join("");

    // stagger-in
    const cardObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            cardObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    $$(".card", grid).forEach((c) => cardObs.observe(c));
  }

  // filter buttons
  CATEGORIES.forEach((cat, i) => {
    const b = document.createElement("button");
    b.className = "filter" + (i === 0 ? " is-active" : "");
    b.textContent = cat;
    b.dataset.cat = cat;
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => {
      $$(".filter", filtersEl).forEach((f) => f.classList.remove("is-active"));
      b.classList.add("is-active");
      renderCards(cat === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat));
    });
    filtersEl.appendChild(b);
  });

  renderCards(PRODUCTS);

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  const lb = $("#lightbox");
  const lbMedia = $("#lbMedia");
  let lastFocus = null;

  function openLightbox(p) {
    lbMedia.innerHTML = p.image
      ? `<img class="real" src="${p.image}" alt="${p.name}" />`
      : `<div class="card__ph" data-tone="${p.tone || "chestnut"}" style="position:absolute;inset:0;"></div>
         <img class="ph-mark" src="${MARK}" alt="" style="position:relative;z-index:1;" />`;
    lbMedia.setAttribute("data-tone", p.image ? "" : p.tone || "chestnut");
    $("#lbCat").textContent = p.category;
    $("#lbTitle").textContent = p.name;
    $("#lbMaterial").textContent = p.material || "";
    $("#lbDesc").textContent = p.desc || "";
    $("#lbPrice").textContent = p.price || "";
    lastFocus = document.activeElement;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    $(".lightbox__close").focus();
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    if (lastFocus) lastFocus.focus();
  }

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    openLightbox(PRODUCTS[Number(card.dataset.index)]);
  });
  lb.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lb.classList.contains("is-open")) closeLightbox();
  });

  /* ============================================================
     CONTACT FORM  (mailto compose — no backend required)
     Swap ORDER_EMAIL for the business inbox, or wire to
     Formspree / Netlify Forms for real submissions (see README).
     ============================================================ */
  const ORDER_EMAIL = "hello@signaturecraft.com"; // TODO: change to the real inbox
  const form = $("#contactForm");
  const note = $("#formNote");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    note.className = "form__note";

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const interest = form.interest.value;
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      note.textContent = "Please fill in your name, email, and message.";
      note.classList.add("is-err");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = "That email doesn't look quite right.";
      note.classList.add("is-err");
      return;
    }

    const subject = encodeURIComponent(`Signature Craft enquiry — ${interest}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInterested in: ${interest}\n\n${message}`
    );
    window.location.href = `mailto:${ORDER_EMAIL}?subject=${subject}&body=${body}`;

    note.textContent = "Opening your email app… if nothing happens, message us on Instagram or WhatsApp.";
    note.classList.add("is-ok");
    form.reset();
  });
})();
