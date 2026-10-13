import { useState, useRef, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Camera, X } from 'lucide-react';
import { playShutterSound, playMicroClick } from '../utils/audioFeedback';

interface LiveMirrorSectionProps {
  onOpenFittingRoom: () => void;
}

export function LiveMirrorSection({ onOpenFittingRoom }: LiveMirrorSectionProps) {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.1, yOffset: 20, duration: 0.85 });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    playShutterSound();
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      setStream(s);
      setCameraActive(true);
      setCameraError(null);
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraError('Camera access unavailable. A calibrated mirror silhouette is displayed.');
    }
  };

  const stopCamera = () => {
    playMicroClick(800, 0.03);
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraActive, stream]);

  return (
    <section
      ref={sectionRef}
      id="live"
      className="relative py-28 sm:py-36 bg-white border-t border-black/[0.06] overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
        {/* Section Header */}
        <div className="reveal-child space-y-3">
          <div className="font-subline text-[13px] text-[#86868b] font-medium">
            Live Atelier Camera Mirror
          </div>
          <h2 className="font-headline text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
            The Living Mirror.
          </h2>
          <p className="font-subline text-[15px] sm:text-[17px] text-[#86868b] max-w-sm mx-auto leading-relaxed">
            Stand before the lens. Turn, tilt, and see digital drape calculate to your posture in real time.
          </p>
        </div>

        {/* Intimate Mirror Frame */}
        <div className="reveal-child relative max-w-sm mx-auto aspect-[3/4] bg-[#1d1d1f] rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-between p-6 text-white border border-black/10">
          {/* Subtle Corner Aperture Marks */}
          <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-white/20" />
          <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-white/20" />
          <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-white/20" />
          <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-white/20" />

          {/* Top Telemetry */}
          <div className="relative z-10 flex items-center justify-between font-subline text-[11px] text-white/50 font-medium">
            <span className="text-white font-medium">
              {cameraActive ? 'Lens Active 30fps' : 'Mirror Standby'}
            </span>
            <span>Shutter: 1/120s</span>
          </div>

          {/* Center: Camera Feed or Graphic Reflection */}
          <div className="relative my-auto flex flex-col items-center justify-center">
            {cameraActive ? (
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/20">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={stopCamera}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full cursor-pointer"
                  title="Close camera"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-5 text-center">
                <div className="w-24 h-36 mx-auto rounded-full border border-dashed border-white/20 flex flex-col items-center justify-center p-3">
                  <Camera className="w-6 h-6 text-white/60 mb-2" />
                  <span className="font-subline text-[11px] text-white/50 font-medium">
                    Aperture
                  </span>
                </div>

                {cameraError && (
                  <p className="font-subline text-[10px] text-white/60 px-3">
                    {cameraError}
                  </p>
                )}

                <button
                  onClick={startCamera}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1d1d1f] text-[15px] font-subline font-medium rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <span>Activate Mirror</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Telemetry */}
          <div className="relative z-10 flex items-center justify-between font-subline text-[11px] text-white/50 pt-3 border-t border-white/10 font-medium">
            <span>Lux: D50 (5000K)</span>
            <button
              onClick={() => {
                playMicroClick(1200, 0.03);
                onOpenFittingRoom();
              }}
              className="text-white hover:text-white/80 font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              Enter Salon &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
