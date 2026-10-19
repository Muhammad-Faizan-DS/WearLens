import { useEffect, useRef, useState } from 'react';
import { Camera, Loader2, RotateCcw, Sparkles, X } from 'lucide-react';
import type { RealTimeClient } from '@decartai/sdk';
import { PRODUCTS, formatPrice, productImages } from '../data/products';
import { Product } from '../types/fashion';
import { playMicroClick } from '../utils/audioFeedback';

// Live virtual try-on with Decart's Lucy VTON model: the shopper's camera is streamed to
// Decart over WebRTC and comes back with the garment on them. Each session authenticates
// with a short-lived token from api/realtime-token.ts, which also caps the session length.
const TRY_ON_MODEL = 'lucy-vton-latest';
const SESSION_LIMIT_SECONDS = 180; // matches MAX_SESSION_SECONDS in api/realtime-token.ts

type Phase = 'intro' | 'starting' | 'live' | 'ended' | 'error';

class TokenError extends Error {
  status: number;
  constructor(status: number) {
    super(`Token endpoint returned ${status}`);
    this.status = status;
  }
}

async function fetchClientToken() {
  const res = await fetch('/api/realtime-token', { method: 'POST' });
  if (!res.ok) throw new TokenError(res.status);
  const { apiKey } = await res.json();
  return apiKey as string;
}

// The front product shot is the garment reference. Sent as a Blob rather than a URL so it
// also works when the page isn't publicly reachable (e.g. localhost).
const garmentCache = new Map<string, Promise<Blob>>();
function garmentImage(product: Product) {
  let blob = garmentCache.get(product.slug);
  if (!blob) {
    blob = fetch(productImages(product).front).then((res) => res.blob());
    garmentCache.set(product.slug, blob);
  }
  return blob;
}

function describeError(err: unknown) {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError') return 'Camera access was blocked. Allow the camera for this site in your browser, then try again.';
    if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') return 'No camera was found on this device.';
    if (err.name === 'NotReadableError') return 'Your camera is being used by another app. Close it and try again.';
  }
  if (err instanceof TokenError && err.status === 503) return "Live try-on isn't set up yet: the Decart API key is missing.";
  if (err instanceof TokenError) return "Couldn't start a try-on session. Please try again.";
  const message = (err as { message?: string })?.message;
  return message || 'Something went wrong starting the try-on.';
}

function endedMessage(reason: string) {
  if (reason === 'insufficient_credits') return 'The try-on account is out of credits.';
  if (reason === 'session_limit') return 'Lots of people are trying things on right now. Please try again in a minute.';
  if (reason === 'moderation_violation') return 'The session was stopped by content moderation.';
  return 'Session ended.';
}

function formatSeconds(total: number) {
  const s = Math.max(0, Math.floor(total));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

interface LiveTryOnProps {
  product: Product;
  onClose: () => void;
}

export function LiveTryOn({ product, onClose }: LiveTryOnProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [message, setMessage] = useState('');
  const [garment, setGarment] = useState(product);
  const [hasOutput, setHasOutput] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const outputRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const session = useRef<{ client: RealTimeClient | null; stream: MediaStream | null; closed: boolean }>({
    client: null,
    stream: null,
    closed: false,
  });

  const stop = () => {
    const { client, stream } = session.current;
    session.current.client = null;
    session.current.stream = null;
    client?.disconnect();
    stream?.getTracks().forEach((track) => track.stop());
    if (outputRef.current) outputRef.current.srcObject = null;
    if (previewRef.current) previewRef.current.srcObject = null;
  };

  const finish = (text: string, isError = false) => {
    stop();
    setPhase(isError ? 'error' : 'ended');
    setMessage(text);
  };

  // Stop the camera and the paid session whenever the dialog closes.
  useEffect(() => {
    const state = session.current;
    state.closed = false;
    return () => {
      state.closed = true;
      stop();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const start = async () => {
    playMicroClick(1400, 0.04);
    setPhase('starting');
    setMessage('');
    setHasOutput(false);
    setSeconds(0);

    try {
      const { createDecartClient, models } = await import('@decartai/sdk');
      const model = models.realtime(TRY_ON_MODEL);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user', frameRate: model.fps, width: model.width, height: model.height },
      });
      if (session.current.closed) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      session.current.stream = stream;
      if (previewRef.current) previewRef.current.srcObject = stream;

      const decart = createDecartClient({ apiKeyProvider: fetchClientToken });
      const client = await decart.realtime.connect(stream, {
        model,
        // Desktop webcams don't report which way they face, so always mirror like a mirror would.
        mirror: true,
        onRemoteStream: (remote) => {
          if (outputRef.current) outputRef.current.srcObject = remote;
          setHasOutput(true);
        },
        initialState: {
          prompt: { text: garment.tryOnPrompt, enhance: false },
          image: await garmentImage(garment),
        },
      });
      if (session.current.closed) {
        client.disconnect();
        return;
      }
      session.current.client = client;

      // Ignore events from a session we've already torn down.
      const isCurrent = () => session.current.client === client;
      // Decart's billing ticks arrive too rarely to drive the clock; the effect below counts
      // seconds locally and these keep it from falling behind the billed time.
      client.on('generationTick', ({ seconds }) => isCurrent() && setSeconds((prev) => Math.max(prev, seconds)));
      client.on('sessionEnded', ({ reason }) => isCurrent() && finish(endedMessage(reason)));
      client.on('error', (err) => isCurrent() && finish(err.message || 'The try-on connection failed.', true));
      client.on('connectionChange', (state) => isCurrent() && state === 'disconnected' && finish('Session ended.'));
      setPhase('live');
    } catch (err) {
      console.error('Live try-on failed to start', err);
      if (!session.current.closed) finish(describeError(err), true);
    }
  };

  const switchGarment = async (next: Product) => {
    if (next.slug === garment.slug) return;
    playMicroClick(1200, 0.03);
    setGarment(next);
    const client = session.current.client;
    if (!client) return;
    try {
      // set() replaces the whole state, so always send prompt and image together.
      await client.set({ prompt: next.tryOnPrompt, image: await garmentImage(next), enhance: false });
    } catch (err) {
      console.error('Failed to switch garment', err);
    }
  };

  const live = phase === 'live';

  // Session clock: runs once the try-on video is actually coming back.
  useEffect(() => {
    if (!live || !hasOutput) return;
    const id = window.setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => window.clearInterval(id);
  }, [live, hasOutput]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Live try-on"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0b0b0d]/60 backdrop-blur-md p-3 sm:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-5xl max-h-full overflow-y-auto bg-[#fbfbfd] rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-black/5">
          <div>
            <div className="font-headline text-[17px] font-semibold text-[#1d1d1f]">Live try-on</div>
            <div className="text-[13px] text-[#86868b]">See it on you, in real time</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close try-on"
            className="p-2 rounded-full hover:bg-black/5 text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 p-4 sm:p-6">
          {/* Stage */}
          <div className="relative aspect-[3/4] sm:aspect-video rounded-2xl overflow-hidden bg-[#111113]">
            <video ref={outputRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            {/* Raw camera: fills the stage until the try-on stream arrives, then shrinks to a corner */}
            <video
              ref={previewRef}
              autoPlay
              playsInline
              muted
              className={`absolute object-cover -scale-x-100 transition-all duration-500 ${
                hasOutput
                  ? 'bottom-3 right-3 w-24 sm:w-32 aspect-video rounded-xl ring-1 ring-white/30'
                  : 'inset-0 w-full h-full opacity-50'
              } ${phase === 'starting' || live ? '' : 'hidden'}`}
            />

            {live && (
              <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur text-white text-[12px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] animate-pulse" />
                <span>Live</span>
                <span className="text-white/60 font-mono">
                  {formatSeconds(seconds)} / {formatSeconds(SESSION_LIMIT_SECONDS)}
                </span>
              </div>
            )}

            {(phase === 'starting' || (live && !hasOutput)) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                <Loader2 className="w-7 h-7 animate-spin" />
                <div className="text-[15px] font-medium">Dressing you in the {garment.name}…</div>
              </div>
            )}

            {phase === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="font-headline text-2xl sm:text-3xl font-semibold mb-2">See it on you, live</div>
                <p className="text-[13px] sm:text-[14px] text-white/60 max-w-sm leading-relaxed mb-6">
                  Stand back so your upper body is in frame, in good light. Take off any thick jacket for the most accurate fit.
                </p>
                <button
                  onClick={start}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] text-[15px] font-medium rounded-full transition-colors active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start camera</span>
                </button>
              </div>
            )}

            {(phase === 'ended' || phase === 'error') && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
                <p className="text-[15px] max-w-sm leading-relaxed mb-5">{message}</p>
                <button
                  onClick={start}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] text-[15px] font-medium rounded-full transition-colors active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Start again</span>
                </button>
              </div>
            )}
          </div>

          {/* Garment picker */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-[12px] text-[#86868b] font-medium mb-1">Trying on</div>
              <div className="font-headline text-[17px] font-semibold text-[#1d1d1f] leading-snug">{garment.name}</div>
              <div className="text-[13px] text-[#86868b]">{formatPrice(garment)}</div>
            </div>

            <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
              {PRODUCTS.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => switchGarment(p)}
                  aria-pressed={p.slug === garment.slug}
                  aria-label={`Try on ${p.name}`}
                  className={`rounded-xl overflow-hidden bg-[#f3f3f5] border-2 transition-colors cursor-pointer ${
                    p.slug === garment.slug ? 'border-[#1d1d1f]' : 'border-transparent hover:border-black/20'
                  }`}
                >
                  <img src={productImages(p).front} alt="" width={1200} height={1500} className="block w-full h-auto" />
                </button>
              ))}
            </div>

            {live && (
              <button
                onClick={() => finish('Session ended.')}
                className="w-full px-5 py-3 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] text-[14px] font-medium rounded-full hairline-border-dark transition-colors cursor-pointer"
              >
                End session
              </button>
            )}

            <p className="text-[11px] text-[#86868b] leading-relaxed mt-auto">
              Your camera video is streamed to Decart to render the try-on. Sessions stop after {SESSION_LIMIT_SECONDS / 60} minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
