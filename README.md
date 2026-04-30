# Vinay's Portfolio

This repository contains a personal portfolio website built with plain HTML, CSS, and JavaScript. It highlights my background, skills, projects, resume, and contact information in a single responsive landing page.

## Overview

The site is a static front-end project with no build step or framework. Everything runs directly in the browser, which makes it easy to host on GitHub Pages, Netlify, Vercel, or any basic static hosting service.

## Features

- Responsive single-page portfolio layout
- Sticky navigation bar with mobile menu toggle
- Hero section with social links and resume download
- About section with personal introduction
- Skills section with circular progress indicators
- Projects section with GitHub links
- Contact form integrated with FormSubmit
- Scroll reveal animations
- Typing animation powered by `typed.js`

## Tech Stack

- HTML5
- CSS3
- JavaScript
- [Typed.js](https://github.com/mattboldt/typed.js/)
- [FormSubmit](https://formsubmit.co/)

## Project Structure

```text
portfolio/
|- index.html
|- style.css
|- script.js
|- Vinay-Resume.pdf
|- README.md
`- assets/
```

## How to Run Locally

Because this is a static website, you can open it directly in a browser.

### Option 1: Open the file directly

Open `index.html` in your browser.

### Option 2: Run a local server

Using VS Code Live Server or any small static server is recommended if you want behavior closer to production.

Example with Python:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Main Files

- `index.html`: page structure and content
- `style.css`: site layout, colors, responsive rules, and animations
- `script.js`: mobile nav, typing effect, scroll animations, and contact form handling
- `assets/`: images, icons, and favicon used across the site
- `Vinay-Resume.pdf`: downloadable resume linked from the hero section

## Contact Form

The contact form submits through FormSubmit using the configured email address in `index.html`.

If you want to change the recipient:

1. Open `index.html`
2. Find the `<form>` tag in the contact section
3. Replace the `action` email with your own FormSubmit endpoint

## Deployment

This project can be deployed as-is to any static hosting platform, including:

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

## Notes

- Some project links in the current page content are still placeholders and should be updated before sharing widely.
- The project currently relies on external CDNs for fonts and `typed.js`.
- No package manager or installation step is required.

## Author

Vinay Yadav

- GitHub: [Vinay-Yadav25](https://github.com/Vinay-Yadav25)
- LinkedIn: [vinay-yadav-25vy](https://www.linkedin.com/in/vinay-yadav-25vy/)

