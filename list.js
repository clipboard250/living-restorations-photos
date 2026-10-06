import { list } from '@vercel/blob';
import { EVENTS } from '../public/events.js';

export default async function handler(req, res) {
  if (!process.env.GALLERY_KEY || req.query.key !== process.env.GALLERY_KEY) {
    return res.status(401).json({ error: 'Wrong password' });
  }
  const slug = String(req.query.event || '');
  if (!EVENTS[slug]) return res.status(404).json({ error: 'Unknown event' });

  const files = [];
  let cursor;
  do {
    const page = await list({ prefix: `events/${slug}/`, cursor, limit: 1000 });
    files.push(...page.blobs.map(b => ({
      url: b.url, downloadUrl: b.downloadUrl, path: b.pathname,
      size: b.size, uploadedAt: b.uploadedAt
    })));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  res.status(200).json({ files });
}
