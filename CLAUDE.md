# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static multi-page marketing site for **PrimeOnPeople**, a recruitment agency placing candidates into global job markets. No build system, no package manager, no tests — plain HTML/CSS/JS served as-is.

## Running locally

No build step. Open [index.html](index.html) directly, or serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

## Architecture

**Pages.** Each `.html` file is a standalone page with its own `<head>`, inline `<style>`, and inline `tailwind.config`. They share [styles.css](styles.css) and [script.js](script.js) (linked at the bottom of every page). Navigation is plain anchor links between files.

- Core: [index.html](index.html), [about.html](about.html), [employers.html](employers.html), [jobs.html](jobs.html), [careers.html](careers.html), [contact.html](contact.html)
- Country landing pages: [germany.html](germany.html), [malta.html](malta.html), [new-zealand.html](new-zealand.html), [saudi-arabia.html](saudi-arabia.html), [lamub.html](lamub.html)

**Styling.** Tailwind is loaded from the CDN (`cdn.tailwindcss.com`) on every page. Each page re-declares the same `tailwind.config` inline — extending the palette with `navy` (900/800/700/600), `gold` (400/500/300), `slate.warm`, and fonts `display: Cormorant Garamond` / `body: DM Sans` (loaded via Google Fonts). When adding a new page, copy this config block; when changing the palette or fonts, update **every** HTML file.

**Shared JS.** [script.js](script.js) is global and runs on every page. It looks up DOM IDs/classes and no-ops via optional chaining when they are absent, so not every page needs every feature. Behaviors:
- Navbar scroll state (`#navbar.scrolled` after 60px)
- Mobile menu toggle (`#mobile-menu-btn` / `#mobile-menu`)
- Counter animations on `.counter` (hero, auto-start) and `.counter2` (scroll-triggered), reading `data-target`
- Scroll-reveal via `IntersectionObserver` on `.reveal` elements, honoring inline `animation-delay`
- Testimonial slider (`#testimonials-track`, `.testimonial-slide`, `.dot`, `#prev-btn`/`#next-btn`) with 5s autoplay and touch-swipe
- Active-nav highlighting based on `section[id]` visibility
- Hero parallax on `.hero-bg` (desktop only) and a cursor-follow glow

When adding interactive elements, prefer reusing these hook class/ID names so the existing script picks them up — don't duplicate the logic inline.

## Deployment

Site ships via Vercel. [vercel.json](vercel.json) sets `cleanUrls: false` + `trailingSlash: false` so URLs stay exactly as linked (`/about.html`, not `/about`) — otherwise Vercel's default 308 redirects break browser back-button history on a plain multi-page static site.
