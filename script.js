// Ridgeview Academy — shared site behavior
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

    // Autoplay — advances one card every 3 seconds, pauses on hover/touch
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
        note.textContent = "Thanks — this is a demo form, so nothing was actually sent yet.";
      }
    });
  }
});