document.addEventListener("DOMContentLoaded", function () {

  // ===== MOBILE NAV TOGGLE =====
  const toggleBtn = document.getElementById("menu-toggle");
  const navLinks  = document.querySelector(".nav-links");

  toggleBtn.addEventListener("click", () => navLinks.classList.toggle("active"));
  document.querySelectorAll(".nav-links a").forEach((link) =>
    link.addEventListener("click", () => navLinks.classList.remove("active"))
  );

  // ===== TYPEWRITER =====
  new Typed("#element", {
    strings: [
      "AI/ML Engineer 🤖",
      "Web Developer 💻",
      "Flutter Developer 📱",
      "Passionate Builder 🚀",
    ],
    loop: true,
    typeSpeed: 80,
    backSpeed: 60,
    backDelay: 2000,
  });

  // ===== SKILL CIRCLE ANIMATION ENGINE =====
  //
  //  animateCircle(circle, target, duration)
  //  ----------------------------------------
  //  Smoothly fills an SVG circle path from its current dasharray value
  //  to `target` over `duration` ms using an easeOutCubic curve and
  //  requestAnimationFrame — no CSS transition needed, giving us full
  //  JS control for both scroll-in and hover-replay.

  function animateCircle(circle, target, duration) {
    duration = duration || 900;

    // Read where the circle currently sits so replay starts from 0
    const from = parseFloat(circle.style.strokeDasharray) || 0;

    // Cancel any animation already running on this element
    if (circle._rafId) cancelAnimationFrame(circle._rafId);

    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic — fast start, slow finish (feels natural)
      const eased   = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;

      circle.style.strokeDasharray = current.toFixed(2) + ", 100";

      if (progress < 1) {
        circle._rafId = requestAnimationFrame(step);
      } else {
        circle._rafId = null;
      }
    }

    circle._rafId = requestAnimationFrame(step);
  }

  // Helper: instantly reset a circle back to 0
  function resetCircle(circle) {
    if (circle._rafId) cancelAnimationFrame(circle._rafId);
    circle.style.strokeDasharray = "0, 100";
  }

  // Detect touch-only devices (no real hover support)
  const isTouch = () => window.matchMedia("(hover: none)").matches;

  // Gather all skill cards once
  const skillCards = document.querySelectorAll(".circle-skill");

  // ── DESKTOP: hover fills → drain on leave ──────────────────────────────────
  if (!isTouch()) {
    skillCards.forEach((card) => {
      const circle  = card.querySelector(".circle");
      const percent = parseFloat(card.dataset.percent) || 0;

      card.addEventListener("mouseenter", () => {
        animateCircle(circle, percent, 700);
      });

      card.addEventListener("mouseleave", () => {
        // Drain animation: animate back to 0
        animateCircle(circle, 0, 500);
      });
    });
  }

  // ── BOTH: scroll-into-view fills all circles (staggered cascade) ───────────
  //    Desktop: fills on first scroll in, resets when scrolled out so hover
  //             stays the primary interaction afterwards.
  //    Mobile:  fills on every scroll-in (main interaction since no hover).

  const skillsSection = document.getElementById("skills");
  let sectionFilled   = false;

  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {

        if (entry.isIntersecting && !sectionFilled) {
          sectionFilled = true;

          // Stagger each circle by 80 ms for a nice cascade effect
          skillCards.forEach((card, i) => {
            const circle  = card.querySelector(".circle");
            const percent = parseFloat(card.dataset.percent) || 0;
            setTimeout(() => animateCircle(circle, percent, 900), i * 80);
          });
        }

        if (!entry.isIntersecting) {
          sectionFilled = false;

          // Reset all circles so the animation replays on next scroll-in
          skillCards.forEach((card) => resetCircle(card.querySelector(".circle")));
        }
      });
    },
    { threshold: 0.15 }
  );

  if (skillsSection) skillsObserver.observe(skillsSection);

  // ===== FLY-IN SCROLL ANIMATION =====
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".fly-in").forEach((el) => observer.observe(el));

  // ===== CONTACT FORM =====
  const form     = document.getElementById("contact-form");
  const popup    = document.getElementById("popup");
  const closeBtn = document.querySelector(".close-btn");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    fetch(form.action, {
      method:  form.method,
      body:    new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          form.reset();
          popup.style.display = "flex";
          setTimeout(() => (popup.style.display = "none"), 4000);
        } else {
          alert("⚠️ Something went wrong. Please try again.");
        }
      })
      .catch(() => alert("❌ Submission failed. Please check your connection."));
  });

  closeBtn.addEventListener("click", () => (popup.style.display = "none"));
});
