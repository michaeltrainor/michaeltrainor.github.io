---
title: A new home on the web
description: Why this site exists and how it stays up to date.
pubDate: 2026-11-02
tags: [meta]
---

This site is built with [Astro](https://astro.build) and deployed to GitHub Pages.

Most of what you see comes from small data files and live sources:

- **Projects** are listed in `src/data/projects.yaml`, and their stars, languages, and last-push dates come from the GitHub API.
- **Notes** like this one are Markdown files in `src/content/notes/`.
- **About** reads from `src/data/skills.yaml` and `src/data/experience.yaml`.

The site rebuilds on every push and once a day on a schedule, so the GitHub data stays fresh without me touching it.
