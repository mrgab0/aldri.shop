// app/hooks/useEdgeTTS.ts
import { useState, useEffect } from 'react';

export function useEdgeTTS(text: string) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!text) return;
    let aborted = false;
    const fetchAudio = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'TTS request failed');
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (!aborted) setAudioUrl(url);
      } catch (e: any) {
        if (!aborted) setError(e.message);
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    fetchAudio();
    return () => {
      aborted = true;
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [text]);

  return { audioUrl, loading, error };
}
