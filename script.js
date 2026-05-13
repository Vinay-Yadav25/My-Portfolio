// FIX: Wrapped everything in DOMContentLoaded so JS runs only after the
//      DOM is fully parsed — previously all getElementById/querySelector
//      calls ran before elements existed, causing silent failures.
document.addEventListener("DOMContentLoaded", function () {

  // ===== MOBILE NAV TOGGLE =====
  const toggleBtn = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  toggleBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  // ===== TYPEWRITER EFFECT =====
  // FIX: Expanded strings to reflect multiple roles (was only one string).
  //      The rogue <span>A</span> in the HTML has been removed — the typed
  //      text now renders cleanly inside #element alone.
  var typed = new Typed("#element", {
    strings: [
      "AI/ML Engineer 🤖",
      "Web Developer 💻",
      "Flutter Developer 📱",
      "Passionate Developer 🚀"
    ],
    loop: true,
    typeSpeed: 80,
    backSpeed: 60,
    backDelay: 2000,
  });

  // ===== FLY-IN SCROLL ANIMATION =====
  const flyIns = document.querySelectorAll(".fly-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible"); // re-triggers on scroll back
        }
      });
    },
    { threshold: 0.2 }
  );

  flyIns.forEach((section) => observer.observe(section));

  // ===== CONTACT FORM WITH POPUP =====
  const form = document.getElementById("contact-form");
  const popup = document.getElementById("popup");
  const closeBtn = document.querySelector(".close-btn");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          form.reset();
          popup.style.display = "flex";
          setTimeout(() => (popup.style.display = "none"), 4000);
        } else {
          alert("⚠️ Something went wrong. Please try again.");
        }
      })
      .catch(() => {
        alert("❌ Submission failed. Please check your connection.");
      });
  });

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

});
