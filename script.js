
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



      var typed = new Typed("#element", {
        strings: [ "Passionate Developer"],
        loop: true,
        typeSpeed: 100,
        backSpeed: 80,
        backDelay: 2000,
      });

      const flyIns = document.querySelectorAll(".fly-in");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              // observer.unobserve(entry.target); // keep observing so nav clicks re-trigger
            } else {
              entry.target.classList.remove("visible"); // Allow re-animation
            }
          });
        },
        {
          threshold: 0.2,
        }
      );

      flyIns.forEach((section) => observer.observe(section));

      const form = document.getElementById("contact-form");
      const popup = document.getElementById("popup");
      const closeBtn = document.querySelector(".close-btn");

      form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent reload

        const formData = new FormData(form);

        fetch(form.action, {
          method: form.method,
          body: formData,
          headers: { Accept: "application/json" },
        })
          .then((response) => {
            if (response.ok) {
              form.reset();
              popup.style.display = "flex"; // Show popup
              setTimeout(() => (popup.style.display = "none"), 4000); // Auto-close after 4s
            } else {
              alert("⚠️ Something went wrong. Please try again.");
            }
          })
          .catch((error) => {
            alert("❌ Submission failed. Please check your connection.");
          });
      });

      closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
      });