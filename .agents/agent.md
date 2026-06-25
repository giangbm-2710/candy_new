# agent.md

## Purpose

Defines custom behavior, rules, and guidelines for AI agents working on the **Candy Catering** project. This file is used by the Antigravity IDE to shape the assistant’s responses, coding style, and interactions.

## General Guidelines

- **Documentation Integrity**: Preserve existing comments and docstrings unless the user explicitly requests changes.
- **Design Aesthetics**: Prioritize modern, premium UI (vibrant colors, gradients, micro‑animations, glassmorphism). Avoid plain minimal designs.
- **Responsive Design**: Ensure all pages work on desktop (1440×900), tablet (768×1024), and mobile (375×812). No horizontal scrollbars.
- **SEO**: Include proper `<title>`, meta description, canonical link, Open Graph tags, and JSON‑LD for every page.
- **Code Quality**: Use consistent naming, modular JavaScript, and TailwindCSS only when explicitly requested.
- **User Interaction**: Ask clarifying questions for ambiguous requirements. Provide concise markdown responses with clickable file links.

## Project‑Specific Rules

1. **Static Header/Footer** – Use static HTML for SEO rather than JS‑generated content.
2. **Mobile Menu** – Implement a drawer that opens from the right with accessible focus management.
3. **Floating Action Buttons** – Back‑to‑top, Messenger, Zalo, and phone buttons as defined in `js/main.js`.
4. **Gallery** – Lazy‑load images, provide a lightbox viewer, and support filtering.
5. **Testing** – Verify changes on all viewports; report any horizontal overflow as a critical bug.

## Revision History

- **2026‑06‑25** – Initial creation.
