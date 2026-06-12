# bloodblinker.github.io

Personal portfolio of **Robin Roy** — documenting my journey from software development into cybersecurity.

Live site: https://bloodblinker.github.io/

## Stack

Plain HTML + CSS + a little vanilla JavaScript. No frameworks, no build step — push to `main` and GitHub Pages deploys it.

## Structure

```
├── index.html          # main portfolio page
├── apps.html           # open-source Android apps
├── linux-basics.html   # notes: Linux 100 Fundamentals
├── 404.html            # terminal-style "command not found" page
├── assets/img/         # app icons and images
├── css/style.css       # shared stylesheet (all pages)
└── js/main.js          # nav, scroll-reveal, interactive hero terminal
```

## Adding a new notes page

1. Copy `linux-basics.html` to e.g. `programming-basics.html`.
2. Update the `<title>`, meta description, heading, subtitle, and `last updated` line.
3. Replace the `<details class="note-topic">` blocks with your topics. Each command uses a
   `.command-block` with `.command-title`, `.command-desc`, `.command-syntax`, `.command-examples`.
4. In `index.html`, find the matching "in progress" card in the Knowledge Base section,
   change it from a `<div class="note-card wip">` to `<a href="your-page.html" class="note-card">`,
   and swap the `note-status` span for the `note-link` span (copy the Linux Basics card).
