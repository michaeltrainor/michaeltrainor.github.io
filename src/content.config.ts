import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';
import { SITE } from './consts';
import { githubRepos } from './lib/github-loader';

// Loads a YAML list and records each entry's position, since collections don't keep file order.
const orderedYaml = (path: string) =>
  file(path, {
    parser: (text) => (parse(text) as Record<string, unknown>[]).map((entry, order) => ({ ...entry, order })),
  });

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
  loader: orderedYaml('src/data/projects.yaml'),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    repo: z.string().optional(),
    url: z.url().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    hidden: z.boolean().default(false),
    order: z.number(),
  }),
});

const skills = defineCollection({
  loader: orderedYaml('src/data/skills.yaml'),
  schema: z.object({ title: z.string(), items: z.array(z.string()), order: z.number() }),
});

const experience = defineCollection({
  loader: orderedYaml('src/data/experience.yaml'),
  schema: z.object({
    role: z.string(),
    org: z.string(),
    period: z.string(),
    summary: z.string(),
    order: z.number(),
  }),
});

const repos = defineCollection({ loader: githubRepos(SITE.githubUser) });

export const collections = { notes, projects, skills, experience, repos };
