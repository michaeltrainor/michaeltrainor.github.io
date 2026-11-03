import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type ProjectWithRepo = CollectionEntry<'projects'> & {
  repo?: CollectionEntry<'repos'>['data'];
};

/** Visible curated projects in file order, each joined to its live GitHub repo if it is public. */
export async function getProjects(): Promise<ProjectWithRepo[]> {
  const projects = await getCollection('projects', ({ data }) => !data.hidden);
  return Promise.all(
    projects.map(async (p) => ({
      ...p,
      repo: p.data.repo ? (await getEntry('repos', p.data.repo))?.data : undefined,
    })),
  );
}

/** Published notes, newest first. */
export async function getNotes() {
  const notes = await getCollection('notes', ({ data }) => import.meta.env.DEV || !data.draft);
  return notes.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Public, non-fork repos sorted by most recent push. */
export async function getRecentRepos(limit = 6) {
  const repos = await getCollection('repos', ({ data }) => !data.fork && !data.archived);
  return repos
    .map((r) => r.data)
    .filter((r) => r.name !== `${r.fullName.split('/')[0]}.github.io` && r.name !== r.fullName.split('/')[0])
    .sort((a, b) => b.pushedAt.valueOf() - a.pushedAt.valueOf())
    .slice(0, limit);
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** "3 days ago" style label. */
export function timeAgo(date: Date, now = new Date()) {
  const s = (date.valueOf() - now.valueOf()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000], ['month', 2592000], ['week', 604800],
    ['day', 86400], ['hour', 3600], ['minute', 60],
  ];
  for (const [unit, secs] of units) {
    if (Math.abs(s) >= secs) return rtf.format(Math.round(s / secs), unit);
  }
  return 'just now';
}

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
