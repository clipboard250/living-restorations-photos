import { del } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  if (!process.env.GALLERY_KEY || body.key !== process.env.GALLERY_KEY) {
    return res.status(401).json({ error: 'Wrong password' });
  }
  const url = String(body.url || '');
  if (!/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/events\//i.test(url)) {
    return res.status(400).json({ error: 'Not an event file' });
  }
  await del(url);
  res.status(200).json({ ok: true });
}
