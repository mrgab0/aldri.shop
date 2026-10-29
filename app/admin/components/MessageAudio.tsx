// app/admin/components/MessageAudio.tsx
"use client";

import { useEdgeTTS } from "@/app/hooks/useEdgeTTS";

interface MessageAudioProps {
  text: string;
  role: string;
}

export default function MessageAudio({ text, role }: MessageAudioProps) {
  // Only synthesize for admin/assistant messages (non‑user)
  const { audioUrl, loading, error } = useEdgeTTS(role === "user" ? "" : text);

  return (
    <>
      <p className="whitespace-pre-wrap">{text}</p>
      {role !== "user" && audioUrl && (
        <audio src={audioUrl} autoPlay controls={false} className="mt-1" />
      )}
      {loading && <span className="text-xs text-gray-400">🔊 Generando audio...</span>}
      {error && <span className="text-xs text-red-500">❗ {error}</span>}
    </>
  );
}
