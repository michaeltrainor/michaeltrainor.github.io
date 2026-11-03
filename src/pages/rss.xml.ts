import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../consts';
import { getNotes } from '../lib/data';

export async function GET(context: APIContext) {
  const notes = await getNotes();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items: notes.map((n) => ({
      title: n.data.title,
      description: n.data.description,
      pubDate: n.data.pubDate,
      link: `/notes/${n.id}/`,
    })),
  });
}
