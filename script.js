/* =========================================================
   STREET 101 DERA — SCRIPT.JS
   Table of contents:
   1. Header shrink-on-scroll + back-to-top button
   2. Mobile nav toggle
   3. Smooth scroll for in-page links (closes mobile nav too)
   4. Scroll-reveal animations (IntersectionObserver)
   5. Menu category filtering
   6. Gallery lightbox
   7. Testimonial slider
   8. Contact form validation
   9. Footer year
   10. Google Maps note
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. HEADER SCROLL STATE + BACK TO TOP ---------- */
  const header = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const scrolled = window.scrollY > 40;
    header.classList.toggle("scrolled", scrolled);
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once in case page loads mid-scroll

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* ---------- 2. MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
  });


  /* ---------- 3. SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  // html { scroll-behavior: smooth } in CSS already handles the scrolling itself.
  // This JS just makes sure the mobile menu closes after a link is tapped.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });


  /* ---------- 4. SCROLL-REVEAL ANIMATIONS ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target); // animate once only
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));


  /* ---------- 5. MENU CATEGORY FILTERING ---------- */
  const menuTabs = document.querySelectorAll(".menu-tab");
  const menuItems = document.querySelectorAll(".menu-item");

  menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      menuTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.dataset.category;

      menuItems.forEach((item) => {
        const matches = category === "all" || item.dataset.category === category;
        item.classList.toggle("hidden", !matches);
      });
    });
  });


  /* ---------- 6. GALLERY LIGHTBOX ---------- */
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");

    lightboxImage.innerHTML =
      `<img src="${img.src}" alt="${img.alt}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`;

    lightboxCaption.textContent = item.dataset.caption || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });


  /* ---------- 7. TESTIMONIAL SLIDER ---------- */
  const track = document.getElementById("testimonialTrack");
  const slides = document.querySelectorAll(".testimonial");
  const dotsWrap = document.getElementById("tDots");
  const prevBtn = document.getElementById("tPrev");
  const nextBtn = document.getElementById("tNext");

  let current = 0;
  let autoplayTimer;

  // build dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.classList.add("t-dot");
    dot.setAttribute("aria-label", `Go to review ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = document.querySelectorAll(".t-dot");

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
    resetAutoplay();
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goToSlide(current + 1), 6000);
  }

  prevBtn.addEventListener("click", () => goToSlide(current - 1));
  nextBtn.addEventListener("click", () => goToSlide(current + 1));

  resetAutoplay();


  /* ---------- 8. CONTACT FORM VALIDATION ---------- */
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  function setError(fieldId, message) {
    const errorEl = document.getElementById(`err-${fieldId}`);
    const inputEl = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.toggle("invalid", Boolean(message));
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const date = document.getElementById("date").value;

    let valid = true;

    if (name.length < 2) {
      setError("name", "Please enter your name.");
      valid = false;
    } else {
      setError("name", "");
    }

    if (!isValidEmail(email)) {
      setError("email", "Please enter a valid email.");
      valid = false;
    } else {
      setError("email", "");
    }

    if (!date) {
      setError("date", "Please choose a date.");
      valid = false;
    } else {
      setError("date", "");
    }

    if (!valid) {
      formStatus.textContent = "Please fix the highlighted fields.";
      formStatus.classList.remove("success");
      return;
    }

    // No backend is connected in this template — this simulates a successful
    // submission. To send this data for real, replace this block with a
    // fetch() call to your own server or form-handling service, e.g.:
    //
    // fetch("https://your-api.example.com/reservations", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, email, date })
    // });

    formStatus.textContent = `Thanks, ${name}! Your request has been noted — we'll confirm by email shortly.`;
    formStatus.classList.add("success");
    form.reset();
  });


  /* ---------- 9. FOOTER YEAR ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();


  /* ---------- 10. GOOGLE MAPS ----------
     This template ships with a lightweight CSS placeholder (.map-placeholder
     in the HTML/CSS) instead of a live embed, so the page works offline and
     never depends on an API key.

     To show a real Google Map, replace the .map-placeholder <div> in
     index.html with an iframe like this:

     <iframe
       src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
       width="100%" height="100%" style="border:0;" allowfullscreen=""
       loading="lazy" referrerpolicy="no-referrer-when-downgrade">
     </iframe>

     Get YOUR_EMBED_CODE from Google Maps: search your address → Share →
     Embed a map → copy the src URL. No JavaScript changes are needed.
  ---------------------------------------------------------------- */

});