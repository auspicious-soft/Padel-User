'use client';

import { useEffect, useState } from 'react';
import { FileText, Download, Mic, Loader2 } from 'lucide-react';
import axios from 'axios';

/* ─────────────────────────────────────────
   HOOK
   Calls /api/whatsapp/media?mediaId=...
   Returns a base64 data URL ready for <img> / <audio>
───────────────────────────────────────── */
const useMediaUrl = (mediaId: string | undefined) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!mediaId) return;
    let cancelled = false;

    setLoading(true);
    setError(false);

    axios
      .get(`/api/whatsapp/media?mediaId=${mediaId}`)
      .then((res) => { if (!cancelled) setSrc(res.data.url); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [mediaId]);

  return { src, loading, error };
};

/* ─────────────────────────────────────────
   SHARED STATES
───────────────────────────────────────── */
const MediaLoader = () => (
  <div className="flex items-center gap-2 text-xs text-zinc-400 px-1 py-3">
    <Loader2 className="h-3.5 w-3.5 animate-spin" />
    <span>Loading...</span>
  </div>
);

const MediaError = () => (
  <p className="text-xs text-red-400 px-1 py-2">⚠️ Could not load media</p>
);

/* ─────────────────────────────────────────
   MAIN EXPORT
   Usage in ChatPage:
     <MediaMessage message={m} onImageClick={(src) => setLightboxSrc(src)} />
───────────────────────────────────────── */
export const MediaMessage = ({
  message,
  onImageClick,
}: {
  message: any;
  onImageClick?: (src: string) => void;
}) => {
  const meta = message.metadata;
  const type = meta?.type;

  // ── IMAGE ──
  if (type === 'image' && meta?.image?.id) {
    return <ImageMedia mediaId={meta.image.id} caption={message.body} onImageClick={onImageClick} />;
  }

  // ── AUDIO ──
  if (type === 'audio' && meta?.audio?.id) {
    return <AudioMedia mediaId={meta.audio.id} mimeType={meta.audio.mime_type} isVoice={meta.audio.voice} />;
  }

  // ── DOCUMENT ──
  if (type === 'document' && meta?.document?.id) {
    return (
      <DocumentMedia
        mediaId={meta.document.id}
        filename={meta.document.filename}
        mimeType={meta.document.mime_type}
        onImageClick={onImageClick}
      />
    );
  }

  // ── PLAIN TEXT ──
  return <p className="break-words whitespace-pre-wrap">{message.body}</p>;
};

/* ─────────────────────────────────────────
   IMAGE
───────────────────────────────────────── */
const ImageMedia = ({
  mediaId,
  caption,
  onImageClick,
}: {
  mediaId: string;
  caption?: string;
  onImageClick?: (src: string) => void;
}) => {
  const { src, loading, error } = useMediaUrl(mediaId);
  if (loading) return <MediaLoader />;
  if (error || !src) return <MediaError />;

  return (
    <div>
      <img
        src={src}
        alt="Image"
        className="max-w-[220px] max-h-[220px] rounded-lg object-cover border border-white/10 cursor-pointer"
        onClick={() => onImageClick?.(src)}
      />
      {caption && caption !== '[image]' && (
        <p className="mt-1 text-sm break-words whitespace-pre-wrap px-1">{caption}</p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   AUDIO
───────────────────────────────────────── */
const AudioMedia = ({
  mediaId,
  mimeType,
  isVoice,
}: {
  mediaId: string;
  mimeType?: string;
  isVoice?: boolean;
}) => {
  const { src, loading, error } = useMediaUrl(mediaId);
  if (loading) return <MediaLoader />;
  if (error || !src) return <MediaError />;

  return (
    <div className="flex flex-col gap-1 min-w-[220px]">
      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
        <Mic className="h-3.5 w-3.5" />
        <span>{isVoice ? 'Voice message' : 'Audio'}</span>
      </div>
      <audio controls className="w-full accent-[#78E378]" style={{ maxWidth: 240 }}>
        <source src={src} type={mimeType || 'audio/ogg; codecs=opus'} />
        Your browser does not support audio playback.
      </audio>
    </div>
  );
};

/* ─────────────────────────────────────────
   DOCUMENT
───────────────────────────────────────── */
const DocumentMedia = ({
  mediaId,
  filename,
  mimeType,
  onImageClick,
}: {
  mediaId: string;
  filename?: string;
  mimeType?: string;
  onImageClick?: (src: string) => void;
}) => {
  const { src, loading, error } = useMediaUrl(mediaId);
  const name = filename || 'document';
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const isImageDoc = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);

  if (loading) return <MediaLoader />;
  if (error || !src) return <MediaError />;

  // document that is actually an image (e.g. IMG_3236.jpg sent as document)
  if (isImageDoc) {
    return (
      <div>
        <img
          src={src}
          alt={name}
          className="max-w-[220px] max-h-[220px] rounded-lg object-cover border border-white/10 cursor-pointer"
          onClick={() => onImageClick?.(src)}
        />
        <p className="mt-1 text-xs text-zinc-400 truncate max-w-[220px] px-1">{name}</p>
      </div>
    );
  }

  // generic file download card
  return (
    <a
      href={src}
      download={name}
      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30 transition min-w-[180px]"
    >
      <div className="h-9 w-9 rounded-md bg-zinc-700 flex items-center justify-center flex-shrink-0">
        <FileText className="h-4 w-4 text-zinc-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-zinc-400">{mimeType}</p>
      </div>
      <Download className="h-4 w-4 text-zinc-400 flex-shrink-0" />
    </a>
  );
};