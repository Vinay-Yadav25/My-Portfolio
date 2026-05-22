# 🚀 Vinay Yadav — Personal Portfolio

> AI/ML Engineer & Web Developer · Final-year B.Tech CSE (AIML) · JNTUH Hyderabad

[![Live Site](https://img.shields.io/badge/Live%20Site-Visit-00e87a?style=for-the-badge&logo=github)](https://vinay-yadav25.github.io/Vinay-s-Portfolio/)
[![GitHub](https://img.shields.io/badge/GitHub-Vinay--Yadav25-181717?style=for-the-badge&logo=github)](https://github.com/Vinay-Yadav25)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-vinay--yadav--25vy-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/vinay-yadav-25vy/)

---

## 📸 Preview

<!-- ![Portfolio Preview](assets/profile.JPG) -->

---

## ✨ Features

- **Interactive Background** — Reactive dot grid with data pulse beams, click shockwaves, and random flickers that respond to mouse movement
- **Typewriter Animation** — Role text cycles through AI/ML Engineer, Web Developer, Flutter Developer, Passionate Builder
- **Fly-in Scroll Animations** — Sections animate into view as you scroll
- **Skill Tag Stagger** — Skill badges cascade in with a wave animation on scroll
- **Frosted Glass Navbar** — Sticky navbar with backdrop blur, scroll-aware darkening, and animated underline hover effects
- **Responsive Mobile Menu** — Slide-in drawer with hamburger ↔ ✕ icon swap, outside-click and ESC key close
- **Project Cards** — GitHub and Live Demo buttons per project with hover glow effects
- **Working Contact Form** — Powered by FormSubmit with a success popup
- **SEO Ready** — Meta description, keywords, Open Graph tags
- **Fully Responsive** — Mobile-first layout across all screen sizes

---

## 🗂️ Project Structure

```
Vinay-s-Portfolio/
│
├── index.html          # Main HTML — all sections
├── style.css           # All styles — layout, animations, responsive
├── script.js           # Interactive background + all JS logic
│
└── assets/
    ├── profile.JPG     # Profile photo
    ├── favicon.ico     # Browser tab icon
    ├── gmail.png       # Social icon
    ├── linkedin.png    # Social icon
    ├── github.png      # Social icon
    ├── html.png        # Skill icon
    ├── css.png         # Skill icon
    ├── JavaScript-logo.png
    ├── python.png
    ├── java.png
    ├── C.png
    ├── mysql.png
    ├── vscode.png
    └── gpt.png
```

---

## 🧩 Sections

| # | Section | Description |
|---|---------|-------------|
| 01 | **Hero** | Name, role typewriter, CTA buttons, social links, profile photo |
| 02 | **About** | Bio, stats cards (Projects, Technologies, Year, Specialisation) |
| 03 | **Skills** | 6 category cards — Frontend, Languages, Backend, AI/ML, Mobile, Tools |
| 04 | **Projects** | 3 featured projects with tech tags, GitHub and Live Demo buttons |
| 05 | **Contact** | Contact info + working form via FormSubmit |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox, Animations) |
| Interactivity | Vanilla JavaScript (Canvas API, IntersectionObserver) |
| Fonts | Inter + Space Grotesk (Google Fonts) |
| Typewriter | [Typed.js](https://github.com/mattboldt/typed.js/) |
| Contact Form | [FormSubmit](https://formsubmit.co/) |
| Hosting | GitHub Pages |

---

## 🎨 Background Animation

The interactive background is built entirely on the HTML5 Canvas API with no external libraries:

- **Dot Grid** — evenly spaced dots across the viewport that brighten and scale near the cursor using a smoothstep curve
- **Data Pulse Beams** — gradient-stroked lines shoot horizontally and vertically at random intervals, simulating network traffic
- **Click Shockwaves** — double expanding rings radiate outward from any click
- **Random Flickers** — dots light up randomly to simulate live server activity
- All animations run at 60fps via `requestAnimationFrame`

---

## 🚀 Getting Started

### Clone the repo
```bash
git clone https://github.com/Vinay-Yadav25/Vinay-s-Portfolio.git
cd Vinay-s-Portfolio
```

### Run locally
No build tools needed. Open directly in your browser:
```bash
# Option 1 — just open the file
open index.html

# Option 2 — use VS Code Live Server extension (recommended)
# Right-click index.html → Open with Live Server
```

---

## ✏️ Customisation

### Update your details
Open `index.html` and edit:
- **Name & tagline** — Hero section `<h1>` and `<p class="hero-desc">`
- **Profile photo** — Replace `assets/profile.JPG`
- **Social links** — Hero and Contact sections
- **CV** — Replace `Vinay-Resume.pdf` with your own file
- **Projects** — Update project cards with your repo URLs and live demo links

### Add a new project
Copy a `.project-card` block in the Projects section and update:
```html
<div class="project-card">
  <div class="project-number">04</div>
  <h3>Your Project Name</h3>
  <p>Brief description of what it does.</p>
  <div class="project-tags">
    <span class="tag">Tech1</span>
    <span class="tag">Tech2</span>
  </div>
  <div class="project-btn-row">
    <a href="https://github.com/your-repo" target="_blank" class="project-btn">
      GitHub <span>↗</span>
    </a>
    <a href="https://your-demo.com" target="_blank" class="project-btn project-btn--demo">
      Live Demo <span>▶</span>
    </a>
  </div>
</div>
```

### Update Live Demo links
Replace `href="#"` on `.project-btn--demo` buttons with your deployed URLs once projects are live.

---

## 📬 Contact Form Setup

The contact form uses [FormSubmit](https://formsubmit.co/) — no backend needed.

The form action is already set:
```html
<form action="https://formsubmit.co/gvinayyadav25@gmail.com" method="POST">
```

First submission will send a confirmation email to activate the endpoint. After that, all messages land directly in your inbox.

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| `> 900px` | Full desktop — hero split layout, 3-column skills grid |
| `≤ 900px` | Tablet — stacked hero, 2-column stats |
| `≤ 768px` | Mobile — single column, hamburger menu, stacked CTA buttons |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Typed.js](https://github.com/mattboldt/typed.js/) — typewriter effect
- [FormSubmit](https://formsubmit.co/) — contact form backend
- [Google Fonts](https://fonts.google.com/) — Inter & Space Grotesk
- [GitHub Pages](https://pages.github.com/) — free hosting

---

<p align="center">
  Built with 💚 by <a href="https://github.com/Vinay-Yadav25">Vinay Yadav</a>
</p>