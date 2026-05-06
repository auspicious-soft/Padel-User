import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const mediaId = req.nextUrl.searchParams.get('mediaId');

  if (!mediaId) {
    return NextResponse.json({ error: 'mediaId is required' }, { status: 400 });
  }

  try {
    // Step 1: get the actual media URL from WhatsApp Graph API
    const meta = await axios.get(
      `https://graph.facebook.com/v18.0/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        },
      }
    );

    const mediaUrl = meta.data.url;

    // Step 2: download the media bytes
    const file = await axios.get(mediaUrl, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      },
    });

    // Step 3: convert to base64 and return
    const base64 = Buffer.from(file.data, 'binary').toString('base64');
    const dataUrl = `data:${file.headers['content-type']};base64,${base64}`;

    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}