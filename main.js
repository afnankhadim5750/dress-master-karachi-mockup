/* Dress Master — mobile menu, scroll-spy, lightbox, enquiry form, reveal. */
(function () {
  "use strict";

  /* ---- Mobile menu: instant toggle, no transition on the open/close ---- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setMenu(menu.hidden);
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
  }

  /* ---- Scroll-spy: highlight the current section in the desktop nav ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === id);
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Reveal on scroll ---- */
  var revealTargets = document.querySelectorAll(
    ".timeline-step, .fabric-card, .service-card, .why-card, .occasion-card, .gallery-item, .fit-copy, .heritage-copy"
  );
  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      revealer.observe(el);
    });
  }

  /* ---- Lightbox gallery ---- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxClose = document.getElementById("lightbox-close");
  var lastFocus = null;
  var openLightbox = function (item) {
    var img = item.querySelector("img");
    var name = item.getAttribute("data-full");
    if (!img || !name) return;
    lastFocus = document.activeElement;
    lightboxImg.src = "images/" + name + "-1600.webp";
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  };
  var closeLightbox = function () {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  document.querySelectorAll(".gallery-item").forEach(function (item) {
    item.addEventListener("click", function () { openLightbox(item); });
  });
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
  });

  /* ---- Enquiry form: builds a summary, no fake submission ---- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    var error = document.getElementById("form-error");
    var summary = document.getElementById("form-summary");
    var summaryText = document.getElementById("form-summary-text");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("f-name").value.trim();
      var occasion = document.getElementById("f-occasion").value;
      var garment = document.getElementById("f-garment").value;
      var fabric = document.getElementById("f-fabric").value;
      var notes = document.getElementById("f-notes").value.trim();
      if (!name || !occasion || !garment || !fabric) {
        error.hidden = false;
        summary.hidden = true;
        return;
      }
      error.hidden = true;
      var lines = [
        "Name: " + name,
        "Occasion: " + occasion,
        "Garment: " + garment,
        "Fabric: " + fabric
      ];
      if (notes) lines.push("Notes: " + notes);
      summaryText.textContent = lines.join("\n");
      summary.hidden = false;
      summary.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
})();
