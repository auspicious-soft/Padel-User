// app/api/whatsapp/media/stream/route.ts
// Used specifically for video — streams bytes directly instead of base64
// so large files don't timeout or blow up memory.

import { NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const mediaId = req.nextUrl.searchParams.get('mediaId');

  if (!mediaId) {
    return new Response(JSON.stringify({ error: 'mediaId is required' }), { status: 400 });
  }

  try {
    // Step 1: get the real URL from WhatsApp Graph API
    const meta = await axios.get(
      `https://graph.facebook.com/v18.0/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        },
      }
    );

    const mediaUrl = meta.data.url;

    // Step 2: fetch the video as a stream
    const response = await axios.get(mediaUrl, {
      responseType: 'stream',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      },
    });

    const contentType = response.headers['content-type'] || 'video/mp4';
    const contentLength = response.headers['content-length'];

    // Step 3: pipe the stream back to the browser
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=3600',
    };

    if (contentLength) {
      headers['Content-Length'] = contentLength;
    }

    // Convert axios stream to Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        response.data.on('data', (chunk: Buffer) => {
          controller.enqueue(chunk);
        });
        response.data.on('end', () => {
          controller.close();
        });
        response.data.on('error', (err: Error) => {
          controller.error(err);
        });
      },
    });

    return new Response(readableStream, { headers });
  } catch (error) {
    console.error('Video stream error:', error);
    return new Response(JSON.stringify({ error: 'Failed to stream video' }), { status: 500 });
  }
}