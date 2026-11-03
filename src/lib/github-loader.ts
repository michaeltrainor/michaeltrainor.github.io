import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

const repoSchema = z.object({
  name: z.string(),
  fullName: z.string(),
  description: z.string().nullable(),
  url: z.url(),
  homepage: z.string().nullable(),
  language: z.string().nullable(),
  stars: z.number(),
  forks: z.number(),
  topics: z.array(z.string()),
  pushedAt: z.coerce.date(),
  fork: z.boolean(),
  archived: z.boolean(),
});

export type Repo = z.infer<typeof repoSchema>;

/**
 * Loads a user's public repos from the GitHub API at build time.
 * Set GITHUB_TOKEN to avoid rate limits; if the API is unreachable the
 * collection is left as it was, so a flaky network never breaks a build.
 */
export function githubRepos(user: string): Loader {
  return {
    name: 'github-repos',
    schema: repoSchema,
    async load({ store, logger, parseData, generateDigest }) {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'User-Agent': `${user}-site`,
      };
      if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

      let raw: any[];
      try {
        const res = await fetch(
          `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`,
          { headers },
        );
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        raw = await res.json();
      } catch (err) {
        logger.warn(`GitHub fetch failed, keeping cached repos: ${err}`);
        return;
      }

      store.clear();
      for (const r of raw) {
        const data = await parseData({
          id: r.full_name,
          data: {
            name: r.name,
            fullName: r.full_name,
            description: r.description,
            url: r.html_url,
            homepage: r.homepage || null,
            language: r.language,
            stars: r.stargazers_count,
            forks: r.forks_count,
            topics: r.topics ?? [],
            pushedAt: r.pushed_at,
            fork: r.fork,
            archived: r.archived,
          },
        });
        store.set({ id: r.full_name, data, digest: generateDigest(data) });
      }
      logger.info(`Loaded ${raw.length} repos for ${user}`);
    },
  };
}
