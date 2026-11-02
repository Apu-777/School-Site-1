// School site — shared behavior

/* ---------------------------------------------------------------
   Language switcher (Bengali default, English optional)
   - Bengali text is written directly in the HTML.
   - English lives in data-en (inner HTML) and data-en-<attr>
     (placeholder, alt, aria-label, title) on the same element.
   - The choice is remembered in localStorage under "site-lang".
---------------------------------------------------------------- */
var SiteLang = (function () {
  var KEY = "site-lang";
  var ATTRS = ["placeholder", "alt", "aria-label", "title"];

  function stored() {
    try { return localStorage.getItem(KEY) === "en" ? "en" : "bn"; } catch (e) { return "bn"; }
  }
  function remember(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* storage unavailable: still switch for this page */ }
  }

  var current = "bn";

  function apply(lang) {
    current = lang;
    var root = document.documentElement;
    root.lang = lang;

    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (el._bn === undefined) el._bn = el.innerHTML;
      el.innerHTML = lang === "en" ? el.getAttribute("data-en") : el._bn;
    });

    ATTRS.forEach(function (attr) {
      document.querySelectorAll("[data-en-" + attr + "]").forEach(function (el) {
        var key = "_bn_" + attr;
        if (el[key] === undefined) el[key] = el.getAttribute(attr) || "";
        el.setAttribute(attr, lang === "en" ? el.getAttribute("data-en-" + attr) : el[key]);
      });
    });

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });

    root.classList.remove("lang-pending");
  }

  // Set a message on an element in both languages, showing the current one.
  function setText(el, bn, en) {
    el._bn = bn;
    el.setAttribute("data-en", en);
    el.innerHTML = current === "en" ? en : bn;
  }

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-lang");
      if (lang === current) return;
      remember(lang);
      apply(lang);
    });
  });

  // Bengali is already in the markup, so only switch when English was chosen.
  if (stored() === "en") apply("en");
  else document.documentElement.classList.remove("lang-pending");

  return { setText: setText, current: function () { return current; } };
})();

// Teacher carousel (home page)
document.querySelectorAll(".teacher-carousel-wrap").forEach(function (wrap) {
  var track = wrap.querySelector(".teacher-carousel");
  var prevBtn = wrap.querySelector(".prev");
  var nextBtn = wrap.querySelector(".next");
  if (!track) return;

  function scrollStep() {
    var card = track.querySelector(".team-card");
    return card ? card.offsetWidth + 22 : 240;
  }

  function scrollNext() {
    var maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 5) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: scrollStep(), behavior: "smooth" });
    }
  }

  function scrollPrev() {
    track.scrollBy({ left: -scrollStep(), behavior: "smooth" });
  }

  if (prevBtn) prevBtn.addEventListener("click", scrollPrev);
  if (nextBtn) nextBtn.addEventListener("click", scrollNext);

  // Autoplay — advances one card every 2 seconds, pauses on hover/touch
  var autoplayDelay = 2000;
  var autoplayTimer = setInterval(scrollNext, autoplayDelay);

  function pauseAutoplay() { clearInterval(autoplayTimer); }
  function resumeAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(scrollNext, autoplayDelay);
  }

  wrap.addEventListener("mouseenter", pauseAutoplay);
  wrap.addEventListener("mouseleave", resumeAutoplay);
  wrap.addEventListener("touchstart", pauseAutoplay, { passive: true });
  wrap.addEventListener("touchend", resumeAutoplay);
});

document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  // Teacher department filter (only present on teachers.html)
  var filterButtons = document.querySelectorAll(".filter-btn");
  var teacherCards = document.querySelectorAll(".teacher-card");
  if (filterButtons.length && teacherCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var dept = btn.getAttribute("data-filter");
        teacherCards.forEach(function (card) {
          var match = dept === "all" || card.getAttribute("data-dept") === dept;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  // Back to top button
  var backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Contact form: demo-only submit handling (no backend wired up)
  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-status");
      if (note) {
        SiteLang.setText(
          note,
          "ধন্যবাদ! এটা একটা ডেমো ফর্ম, তাই আসলে কিছু পাঠানো হয়নি।",
          "Thanks — this is a demo form, so nothing was actually sent yet."
        );
      }
    });
  }
});
