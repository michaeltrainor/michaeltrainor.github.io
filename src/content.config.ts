import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SITE } from './consts';
import { githubRepos } from './lib/github-loader';

// Markdown notes / blog posts in src/content/notes/.
const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Curated projects; `repo` joins to live GitHub data.
const projects = defineCollection({
  loader: file('src/data/projects.yaml'),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    repo: z.string().optional(),
    url: z.url().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    hidden: z.boolean().default(false),
  }),
});

const skills = defineCollection({
  loader: file('src/data/skills.yaml'),
  schema: z.object({ title: z.string(), items: z.array(z.string()) }),
});

const experience = defineCollection({
  loader: file('src/data/experience.yaml'),
  schema: z.object({
    role: z.string(),
    org: z.string(),
    period: z.string(),
    summary: z.string(),
  }),
});

const repos = defineCollection({ loader: githubRepos(SITE.githubUser) });

export const collections = { notes, projects, skills, experience, repos };
