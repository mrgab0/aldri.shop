// app/api/tts/route.ts
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const region = process.env.AZURE_TTS_REGION;
    const key = process.env.AZURE_TTS_KEY;
    if (!region || !key) {
      return new Response(JSON.stringify({ error: 'Azure credentials not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const ssml = `
      <speak version='1.0' xml:lang='en-US'>
        <voice name='en-US-PamelaNeural'>${text}</voice>
      </speak>`;
    const azureUrl = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const azureRes = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'AldriShopTTS/1.0',
      },
      body: ssml,
    });
    if (!azureRes.ok) {
      const errText = await azureRes.text();
      return new Response(JSON.stringify({ error: 'Azure TTS failed', details: errText }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }
    const audioBuffer = await azureRes.arrayBuffer();
    return new Response(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (e) {
    console.error('TTS handler error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
