import { createDecartClient } from '@decartai/sdk';

// Vercel function (POST /api/realtime-token), also served by the Vite dev server: see
// devApiRoutes() in vite.config.ts.
//
// Mints a short-lived Decart client token for the live try-on on /try-on/. The permanent
// key (DECART_API_KEY) never leaves the server; the browser gets a token that expires in
// 60 seconds, only works with the try-on model, and caps how long (and so how much) a
// single session can run.
const TRY_ON_MODELS = ['lucy-vton-latest', 'lucy-vton-3.6'];
const MAX_SESSION_SECONDS = 180;

export async function POST() {
  // Tolerate the key being pasted into the env var with surrounding quotes or whitespace.
  const apiKey = process.env.DECART_API_KEY?.trim().replace(/^(['"])(.*)\1$/, '$2');
  if (!apiKey) {
    return Response.json({ error: 'DECART_API_KEY is not set' }, { status: 503 });
  }

  try {
    const client = createDecartClient({ apiKey });
    const token = await client.tokens.create({
      allowedModels: TRY_ON_MODELS,
      constraints: { realtime: { maxSessionDuration: MAX_SESSION_SECONDS } },
    });
    return Response.json({ apiKey: token.apiKey, expiresAt: token.expiresAt });
  } catch (err) {
    console.error('Failed to create Decart client token', err);
    // Pass on Decart's reason (e.g. `401 - {"error":"Invalid or expired API key"}`), which
    // never contains the key, so a broken deployment can be diagnosed from the browser.
    const reason = (err as { message?: string })?.message?.replace(/^Failed to create token:\s*/, '');
    return Response.json({ error: 'Failed to create token', reason }, { status: 502 });
  }
}
