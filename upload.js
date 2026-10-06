import { handleUpload } from '@vercel/blob/client';
import { EVENTS } from '../public/events.js';

export default async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const [root, slug] = pathname.split('/');
        if (root !== 'events' || !EVENTS[slug] || !EVENTS[slug].open) {
          throw new Error('Uploads are closed for this event');
        }
        return {
          allowedContentTypes: ['image/*', 'video/*'],
          maximumSizeInBytes: 500 * 1024 * 1024,
          addRandomSuffix: true
        };
      },
      onUploadCompleted: async () => {}
    });
    res.status(200).json(json);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
