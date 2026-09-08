// ================================================================
//  LOADER — runs immediately, before DOMContentLoaded
// ================================================================
(function () {
  const loader = document.getElementById("loader");
  if (!loader) return;

  // Lock scroll while loader is visible
  document.body.style.overflow = "hidden";

  function dismiss() {
    loader.classList.add("hidden");
    document.body.style.overflow = "";
    // Remove from DOM after fade-out so it never interferes
    setTimeout(() => loader.remove(), 700);
  }

  // Auto-dismiss: letter animations finish ~0.7s, bar fills at 2.2s → dismiss at 2.5s
  const autoTimer = setTimeout(dismiss, 2500);

  // Click anywhere to skip
  loader.addEventListener("click", () => {
    clearTimeout(autoTimer);
    dismiss();
  });
})();

document.addEventListener("DOMContentLoaded", function () {

  // ================================================================
  //  PORTFOLIO DATA — load from localStorage, fall back to defaults
  // ================================================================

  const DATA_KEY = "vy_portfolio";

  const DEFAULTS = {
    projects: [
      { id:"p1", num:"01", title:"AI Plagiarism Detection",
        desc:"Detects AI-generated and copied content using FastAPI and ML models with high accuracy.",
        tags:["FastAPI","Machine Learning","Python"],
        github:"https://github.com/Vinay-Yadav25/AI-Plagiarism-Detection-Tool", demo:"" },
      { id:"p2", num:"02", title:"AI-Workout App",
        desc:"Personalized AI workout plans with progress tracking and intelligent fitness recommendations.",
        tags:["Flutter","PHP","MySQL","AI"],
        github:"https://github.com/Vinay-Yadav25", demo:"" },
      { id:"p3", num:"03", title:"AI Helmet Detection",
        desc:"Real-time YOLOv8 safety detection system with Streamlit dashboard, alerts, and metrics.",
        tags:["YOLOv8","Computer Vision","Streamlit"],
        github:"https://github.com/Vinay-Yadav25/AI-Based-Helmet-Detection", demo:"" }
    ],
    skills: [
      { id:"s1", icon:"🖥️", name:"Frontend", tags:["HTML","CSS","JavaScript"], logos:{"HTML":"assets/html.png","CSS":"assets/css.png","JavaScript":"assets/JavaScript-logo.png"} },
      { id:"s2", icon:"💻", name:"Languages", tags:["Python","Java","C"], logos:{"Python":"assets/python.png","Java":"assets/java.png","C":"assets/C.png"} },
      { id:"s3", icon:"⚙️", name:"Backend", tags:["⚡ FastAPI","🐘 PHP","MySQL"], logos:{"MySQL":"assets/mysql.png"} },
      { id:"s4", icon:"🤖", name:"AI / ML", tags:["🧠 Deep Learning","👁️ Computer Vision","🎯 YOLOv8"], logos:{} },
      { id:"s5", icon:"📱", name:"Mobile Dev", tags:["📱 Flutter","🎯 Dart"], logos:{} },
      { id:"s6", icon:"🛠️", name:"Tools", tags:["VS Code","GitHub","ChatGPT"], logos:{"VS Code":"assets/vscode.png","GitHub":"assets/github.png","ChatGPT":"assets/gpt.png"} }
    ]
  };

  function getPortfolioData() {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      return raw ? JSON.parse(raw) : DEFAULTS;
    } catch(e) { return DEFAULTS; }
  }

  // Skill logos are stored with each skill category.
  // The old map remains as a backward-compatible fallback.
  const ICON_MAP = {
    "HTML":       "assets/html.png",
    "CSS":        "assets/css.png",
    "JavaScript": "assets/JavaScript-logo.png",
    "Python":     "assets/python.png",
    "Java":       "assets/java.png",
    "C":          "assets/C.png",
    "MySQL":      "assets/mysql.png",
    "VS Code":    "assets/vscode.png",
    "GitHub":     "assets/github.png",
    "ChatGPT":    "assets/gpt.png",
  };

  function skillTagHTML(tag, skill) {
    const hasEmoji = /^\p{Emoji}/u.test(tag.trim());
    if (hasEmoji) return `<span class="skill-tag">${tag}</span>`;

    // Prefer the logo selected in Admin CMS; fall back to the old map.
    const imgSrc = (skill && skill.logos && skill.logos[tag]) || ICON_MAP[tag];
    if (imgSrc) return `<span class="skill-tag"><img src="${imgSrc}" alt="${tag}" class="tag-icon" loading="lazy" />${tag}</span>`;
    return `<span class="skill-tag">${tag}</span>`;
  }

  function renderPortfolioProjects() {
    const container = document.getElementById("projects-container");
    if (!container) return;
    const { projects } = getPortfolioData();
    container.innerHTML = projects.map(p => `
      <div class="project-card">
        <div class="project-number">${p.num || ""}</div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
        <div class="project-btn-row">
          ${p.github
            ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" class="project-btn">GitHub <span>↗</span></a>`
            : ""}
          ${p.demo
            ? `<a href="${p.demo}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn--demo">Live Demo <span>▶</span></a>`
            : `<a href="#" class="project-btn project-btn--demo" title="Live demo coming soon">Live Demo <span>▶</span></a>`}
        </div>
      </div>
    `).join("");
  }

  function renderPortfolioSkills() {
    const container = document.getElementById("skills-container");
    if (!container) return;
    const { skills } = getPortfolioData();
    container.innerHTML = skills.map(s => `
      <div class="skill-category">
        <h3><span class="cat-icon">${s.icon}</span> ${s.name}</h3>
        <div class="skill-tags">
          ${s.tags.map(t => skillTagHTML(t, s)).join("")}
        </div>
      </div>
    `).join("");

    // Re-run stagger animation on newly rendered tags
    const tags = container.querySelectorAll(".skill-tag");
    tags.forEach((tag, i) => {
      tag.style.opacity    = "0";
      tag.style.transform  = "translateY(12px)";
      tag.style.transition = `opacity 0.4s ease ${i * 40}ms, transform 0.4s ease ${i * 40}ms`;
    });
  }

  // Render immediately on load
  renderPortfolioProjects();
  renderPortfolioSkills();

  // ================================================================
  //  BACKGROUND — Reactive Dot Grid + Data Pulse Streams
  // ================================================================
  const canvas = document.getElementById("bg-canvas");
  const ctx    = canvas.getContext("2d");
  let W, H;
  const mouse = { x: -9999, y: -9999 };

  const SPACING  = 28;
  const DOT_R    = 1.3;
  const RIPPLE_R = 150;
  const LIFT     = 4;

  let dots = [], pulses = [], shockwaves = [], flickers = [];

  function buildGrid() {
    dots = [];
    const cols = Math.ceil(W / SPACING) + 1;
    const rows = Math.ceil(H / SPACING) + 1;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        dots.push({ x: c * SPACING, y: r * SPACING, glow: 0 });
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildGrid();
  }
  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });
  // Shockwave on click — skip if user clicked a link or button so navigation still works
  window.addEventListener("click", e => {
    const tag = e.target.tagName.toLowerCase();
    const isLink = tag === "a" || tag === "button" || e.target.closest("a") || e.target.closest("button");
    if (!isLink) {
      shockwaves.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 1 });
    }
  });

  function spawnPulse() {
    const horiz = Math.random() > 0.5;
    pulses.push({ horiz, pos: horiz ? Math.random() * H : Math.random() * W,
      speed: 3 + Math.random() * 4, head: 0, tail: -200,
      alpha: 0.6 + Math.random() * 0.3, hue: 130 + Math.floor(Math.random() * 50) });
    setTimeout(spawnPulse, 900 + Math.random() * 2400);
  }
  spawnPulse();

  function spawnFlicker() {
    if (dots.length) {
      const d = dots[Math.floor(Math.random() * dots.length)];
      flickers.push({ dot: d, life: 1 });
    }
    setTimeout(spawnFlicker, 90 + Math.random() * 350);
  }
  spawnFlicker();

  function drawDots() {
    for (let i = 0; i < dots.length; i++) {
      const d  = dots[i];
      const dx = d.x - mouse.x, dy = d.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let radius = DOT_R, alpha = 0.15, glowing = false;

      if (dist < RIPPLE_R) {
        const t = 1 - dist / RIPPLE_R;
        const e = t * t * (3 - 2 * t);
        radius = DOT_R + e * LIFT;
        alpha  = 0.15 + e * 0.85;
        glowing = e > 0.5;
      }

      if (d.glow > 0) {
        radius = Math.max(radius, DOT_R + d.glow * 3);
        alpha  = Math.max(alpha, d.glow * 0.85);
        d.glow = Math.max(0, d.glow - 0.04);
      }

      if (glowing || d.glow > 0.3) {
        const gr = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, radius * 3);
        gr.addColorStop(0, `rgba(0,232,122,${alpha})`);
        gr.addColorStop(1, `rgba(0,232,122,0)`);
        ctx.beginPath(); ctx.arc(d.x, d.y, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gr; ctx.fill();
      }

      ctx.beginPath(); ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,200,90,${alpha})`; ctx.fill();
    }
  }

  function drawPulses() {
    pulses = pulses.filter(p => {
      p.head += p.speed; p.tail += p.speed;
      const limit = p.horiz ? W : H;
      if (p.tail > limit) return false;
      const x1 = p.horiz ? Math.max(0, p.tail) : p.pos;
      const y1 = p.horiz ? p.pos : Math.max(0, p.tail);
      const x2 = p.horiz ? Math.min(W, p.head) : p.pos;
      const y2 = p.horiz ? p.pos : Math.min(H, p.head);
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, `hsla(${p.hue},100%,65%,0)`);
      grad.addColorStop(0.5, `hsla(${p.hue},100%,65%,${p.alpha})`);
      grad.addColorStop(1, `hsla(${p.hue},100%,80%,${p.alpha * 0.9})`);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = grad; ctx.lineWidth = 1.8;
      ctx.shadowColor = `hsla(${p.hue},100%,65%,0.7)`; ctx.shadowBlur = 6;
      ctx.stroke(); ctx.shadowBlur = 0;
      return true;
    });
  }

  function drawShockwaves() {
    shockwaves = shockwaves.filter(s => {
      s.r += 8; s.alpha -= 0.022;
      if (s.alpha <= 0) return false;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,232,122,${s.alpha})`; ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(0,232,122,0.5)"; ctx.shadowBlur = 12;
      ctx.stroke(); ctx.shadowBlur = 0;
      if (s.r > 30) {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 0.55, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,200,255,${s.alpha * 0.4})`; ctx.lineWidth = 1;
        ctx.stroke();
      }
      return true;
    });
  }

  function processFlickers() {
    flickers = flickers.filter(f => {
      f.dot.glow = Math.max(f.dot.glow, f.life);
      f.life -= 0.035; return f.life > 0;
    });
  }

  function drawCursor() {
    if (mouse.x === -9999) return;
    const gr = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 36);
    gr.addColorStop(0, "rgba(0,232,122,0.22)");
    gr.addColorStop(1, "rgba(0,232,122,0)");
    ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 36, 0, Math.PI * 2);
    ctx.fillStyle = gr; ctx.fill();
    ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#00e87a"; ctx.shadowColor = "#00e87a"; ctx.shadowBlur = 10;
    ctx.fill(); ctx.shadowBlur = 0;
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#04090f"; ctx.fillRect(0, 0, W, H);
    processFlickers(); drawDots(); drawPulses(); drawShockwaves(); drawCursor();
  }
  animate();

  // ================================================================
  //  NAVBAR — transparent at top, glass on scroll
  // ================================================================
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  });

  // ================================================================
  //  MOBILE NAV TOGGLE
  // ================================================================
  const toggleBtn = document.getElementById("menu-toggle");
  const navLinks  = document.querySelector(".nav-links");

  function openMenu() {
    navLinks.classList.add("active");
    toggleBtn.innerHTML = "&#x2715;";   // ✕ close icon
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // prevent scroll behind drawer
  }

  function closeMenu() {
    navLinks.classList.remove("active");
    toggleBtn.innerHTML = "&#9776;";    // ☰ hamburger icon
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", () => {
    navLinks.classList.contains("active") ? closeMenu() : openMenu();
  });

  // Close on nav link click
  document.querySelectorAll(".nav-links a").forEach(link =>
    link.addEventListener("click", closeMenu)
  );

  // Close on outside tap (tap anywhere outside the drawer)
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // ================================================================
  //  TYPEWRITER
  // ================================================================
  new Typed("#element", {
    strings: ["AI/ML Engineer 🤖", "Web Developer 💻", "Flutter Developer 📱", "Passionate Builder 🚀"],
    loop: true, typeSpeed: 80, backSpeed: 60, backDelay: 2000,
  });

  // ================================================================
  //  FLY-IN
  // ================================================================
  const flyObs = new IntersectionObserver(
    entries => entries.forEach(e => e.target.classList.toggle("visible", e.isIntersecting)),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".fly-in").forEach(el => flyObs.observe(el));

  // ================================================================
  //  SKILL TAG STAGGER
  // ================================================================
  const skillTags = document.querySelectorAll(".skill-tag");
  skillTags.forEach((tag, i) => {
    tag.style.opacity = "0"; tag.style.transform = "translateY(14px)";
    tag.style.transition = `opacity 0.4s ease ${i * 40}ms, transform 0.4s ease ${i * 40}ms`;
  });

  let tagsAnimated = false;
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !tagsAnimated) {
        tagsAnimated = true;
        skillTags.forEach(tag => { tag.style.opacity = "1"; tag.style.transform = "translateY(0)"; });
      }
      if (!entry.isIntersecting) {
        tagsAnimated = false;
        skillTags.forEach(tag => { tag.style.opacity = "0"; tag.style.transform = "translateY(14px)"; });
      }
    });
  }, { threshold: 0.12 }).observe(document.getElementById("skills"));

  // ================================================================
  //  CONTACT FORM
  // ================================================================
  const form     = document.getElementById("contact-form");
  const popup    = document.getElementById("popup");
  const closeBtn = document.querySelector(".close-btn");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    fetch(form.action, {
      method: form.method, body: new FormData(form),
      headers: { Accept: "application/json" },
    })
    .then(res => {
      if (res.ok) { form.reset(); popup.style.display = "flex"; setTimeout(() => popup.style.display = "none", 4000); }
      else alert("⚠️ Something went wrong. Please try again.");
    })
    .catch(() => alert("❌ Submission failed. Please check your connection."));
  });

  closeBtn.addEventListener("click", () => popup.style.display = "none");
});
