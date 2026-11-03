# michaeltrainor.com

Personal site built with [Astro](https://astro.build), deployed to GitHub Pages at <https://michaeltrainor.com>.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # type-check + production build
```

## Where content lives

| What | File |
|---|---|
| Name, tagline, nav, social links | `src/consts.ts` |
| Projects (joined to live GitHub data) | `src/data/projects.yaml` |
| Skills and experience (About page) | `src/data/skills.yaml`, `src/data/experience.yaml` |
| Notes / blog posts | `src/content/notes/*.md` |
| GitHub data loader | `src/lib/github-loader.ts` |

Add a note by dropping a Markdown file in `src/content/notes/` with `title`, `description`, and `pubDate` frontmatter.

## Deploy

`.github/workflows/deploy.yml` builds and deploys on every push to `main`, daily at 09:17 UTC (to refresh GitHub data), and on demand from the Actions tab.
