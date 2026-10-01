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
     GALLERY  (built from data/products.json — edit that file to
     add/change pieces; nothing here needs to change)
     ============================================================ */
  const grid = $("#grid");
  const filtersEl = $("#filters");
  const MARK = "assets/logo-mark.svg";

  let PRODUCTS = [];

  // a product's photos, real paths only (empty slots fall back to the placeholder)
  const photosOf = (p) => (p.images || []).filter(Boolean);

  // placeholder tile markup for a product with no photo
  const placeholder = (p) =>
    `<div class="card__ph" data-tone="${p.tone || "chestnut"}">
       <img src="${MARK}" alt="" />
     </div>`;

  const mediaMarkup = (p) => {
    const photos = photosOf(p);
    const cover = photos.length
      ? `<img src="${photos[0]}" alt="${p.name}" loading="lazy" />`
      : placeholder(p);
    const variantHint =
      photos.length > 1 ? `<span class="card__variants">${photos.length} photos</span>` : "";
    return cover + variantHint;
  };

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
  function buildFilters(categories) {
    filtersEl.innerHTML = "";
    categories.forEach((cat, i) => {
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
  }

  /* ---------- contact details (the "contact" block in products.json) ----------
     Rebuilds the contact-section list and footer social links. If the data
     file fails to load, the static markup in index.html stays as a fallback. */
  let orderEmail = "";

  const link = (href, text, external) => {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    if (external) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    return a;
  };

  function renderContact(c) {
    orderEmail = c.email || "";

    const socials = [
      c.instagram && { label: "Instagram", href: `https://instagram.com/${c.instagram}`, handle: c.instagram },
      c.tiktok && { label: "TikTok", href: `https://tiktok.com/@${c.tiktok}`, handle: c.tiktok },
      c.telegram && { label: "Telegram", href: `https://t.me/${c.telegram}`, handle: c.telegram },
    ].filter(Boolean);

    const list = $("#contactList");
    if (list) {
      list.innerHTML = "";
      const addItem = (label, links) => {
        if (!links.length) return;
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.className = "contact__label";
        span.textContent = label;
        li.append(span, ...links);
        list.appendChild(li);
      };
      addItem("Email", orderEmail ? [link(`mailto:${orderEmail}`, orderEmail)] : []);
      addItem(
        "Phone / WhatsApp",
        (c.phones || []).map((ph) => link(`tel:${ph.replace(/[^\d+]/g, "")}`, ph))
      );
      socials.forEach((s) => addItem(s.label, [link(s.href, "@" + s.handle, true)]));
    }

    const footer = $("#footerSocial");
    if (footer) {
      footer.innerHTML = "";
      socials.forEach((s) => footer.appendChild(link(s.href, s.label, true)));
    }
  }

  // load the data file (contact details + product catalogue) and build the page
  async function loadProducts() {
    try {
      const res = await fetch("data/products.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (data.contact) renderContact(data.contact);
      PRODUCTS = data.products || [];
      buildFilters(data.categories && data.categories.length ? data.categories : ["All"]);
      renderCards(PRODUCTS);
    } catch (err) {
      console.error("Failed to load data/products.json", err);
      grid.innerHTML = "";
      filtersEl.innerHTML = "";
      const msg = document.createElement("p");
      msg.className = "gallery__note";
      msg.textContent =
        "Couldn't load the product list right now. Please refresh the page, or get in touch if this keeps happening.";
      grid.parentElement.insertBefore(msg, grid);
    }
  }
  loadProducts();

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  const lb = $("#lightbox");
  const lbMedia = $("#lbMedia");
  let lastFocus = null;
  let lbProduct = null;
  let lbIndex = 0;

  // renders the current photo (or placeholder), plus cycling controls when
  // the product has more than one photo — click the image, use the arrows,
  // tap a dot, or press the left/right arrow keys to move between them
  function renderLightboxMedia() {
    const photos = photosOf(lbProduct);
    if (!photos.length) {
      lbMedia.innerHTML = `<div class="card__ph" data-tone="${lbProduct.tone || "chestnut"}" style="position:absolute;inset:0;"></div>
         <img class="ph-mark" src="${MARK}" alt="" style="position:relative;z-index:1;" />`;
      lbMedia.setAttribute("data-tone", lbProduct.tone || "chestnut");
      return;
    }
    lbMedia.setAttribute("data-tone", "");
    const multi = photos.length > 1;
    lbMedia.innerHTML = `
      <img class="real" src="${photos[lbIndex]}" alt="${lbProduct.name}" />
      ${
        multi
          ? `
        <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous photo">&#8249;</button>
        <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next photo">&#8250;</button>
        <span class="lightbox__count">${lbIndex + 1} / ${photos.length}</span>
        <div class="lightbox__dots">
          ${photos
            .map(
              (_, i) =>
                `<button type="button" class="lightbox__dot${i === lbIndex ? " is-active" : ""}" data-i="${i}" aria-label="Photo ${i + 1} of ${photos.length}"></button>`
            )
            .join("")}
        </div>`
          : ""
      }`;
  }

  function stepLightbox(dir) {
    const photos = photosOf(lbProduct);
    if (photos.length < 2) return;
    lbIndex = (lbIndex + dir + photos.length) % photos.length;
    renderLightboxMedia();
  }

  function openLightbox(p) {
    lbProduct = p;
    lbIndex = 0;
    renderLightboxMedia();
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
    if (e.target.hasAttribute("data-close")) return closeLightbox();
    if (e.target.closest(".lightbox__nav--prev")) return stepLightbox(-1);
    if (e.target.closest(".lightbox__nav--next")) return stepLightbox(1);
    const dot = e.target.closest(".lightbox__dot");
    if (dot) return stepLightbox(Number(dot.dataset.i) - lbIndex);
    if (e.target.matches(".lightbox__media img.real")) stepLightbox(1);
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") stepLightbox(1);
    if (e.key === "ArrowLeft") stepLightbox(-1);
  });

  /* ============================================================
     CONTACT FORM  (mailto compose — no backend required)
     The destination inbox is "contact.email" in data/products.json.
     Wire to Formspree / Netlify Forms for real submissions (see README).
     ============================================================ */
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

    if (!orderEmail) {
      note.textContent = "Email isn't available right now — please call, or message us on Instagram or Telegram.";
      note.classList.add("is-err");
      return;
    }

    const subject = encodeURIComponent(`Signature Craft enquiry — ${interest}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInterested in: ${interest}\n\n${message}`
    );
    window.location.href = `mailto:${orderEmail}?subject=${subject}&body=${body}`;

    note.textContent = "Opening your email app… if nothing happens, message us on Instagram or WhatsApp.";
    note.classList.add("is-ok");
    form.reset();
  });
})();
