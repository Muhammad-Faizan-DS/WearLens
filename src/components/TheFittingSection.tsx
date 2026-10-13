import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Sparkles } from 'lucide-react';

interface TheFittingSectionProps {
  onOpenFittingRoom: () => void;
}

export function TheFittingSection({ onOpenFittingRoom }: TheFittingSectionProps) {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.1, yOffset: 20, duration: 0.85 });
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(3);

  const prompts = {
    1: 'single mirror photograph or live studio camera',
    2: 'oversized double-breasted melton wool coat in charcoal noir',
    3: 'photorealistic resolve in 3.0 seconds with directional lux',
  };

  return (
    <section
      ref={sectionRef}
      id="fitting"
      className="relative py-28 sm:py-36 bg-[#fbfbfd] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="reveal-child text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="font-subline text-[13px] text-[#86868b] font-medium">
            The Fitting Photo Try-On
          </div>
          <h2 className="font-headline text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
            One continuous dress.
          </h2>
          <p className="font-subline text-[15px] sm:text-[17px] text-[#86868b] leading-relaxed">
            Upload any photo. State the cut or fabric in plain English. See the outfit resolve onto your frame.
          </p>
        </div>

        {/* Continuous Stage Card */}
        <div className="reveal-child bg-white hairline-border p-8 sm:p-12 rounded-3xl shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Phase Selector & Prompt */}
            <div className="lg:col-span-6 space-y-6">
              {/* Phase Tabs */}
              <div className="flex items-center gap-6 pb-4 border-b border-black/5">
                <button
                  onClick={() => setActivePhase(1)}
                  className={`text-left transition-colors cursor-pointer ${
                    activePhase === 1 ? 'text-[#1d1d1f] font-semibold' : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  <div className="font-subline text-[11px] font-medium">01 / Acquire</div>
                  <div className="font-headline text-[13px] mt-0.5">Subject Pose</div>
                </button>

                <span className="text-black/10">&mdash;</span>

                <button
                  onClick={() => setActivePhase(2)}
                  className={`text-left transition-colors cursor-pointer ${
                    activePhase === 2 ? 'text-[#1d1d1f] font-semibold' : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  <div className="font-subline text-[11px] font-medium">02 / Syntax</div>
                  <div className="font-headline text-[13px] mt-0.5">Plain English</div>
                </button>

                <span className="text-black/10">&mdash;</span>

                <button
                  onClick={() => setActivePhase(3)}
                  className={`text-left transition-colors cursor-pointer ${
                    activePhase === 3 ? 'text-[#1d1d1f] font-semibold' : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  <div className="font-subline text-[11px] font-medium">03 / Resolve</div>
                  <div className="font-headline text-[13px] mt-0.5">Optical Dress</div>
                </button>
              </div>

              {/* Active Prompt Line */}
              <div className="space-y-2">
                <div className="font-subline text-[11px] text-[#86868b] font-medium">
                  Active Specification
                </div>
                <blockquote className="font-headline text-xl sm:text-2xl font-medium text-[#1d1d1f] leading-snug">
                  "{prompts[activePhase]}"
                </blockquote>
              </div>

              <p className="font-subline text-[13px] sm:text-[14px] text-[#86868b] leading-relaxed">
                {activePhase === 1 && 'Extracts shoulder slope and skeletal stance in 280ms from any casual mirror snapshot.'}
                {activePhase === 2 && 'Understands tailored wool weights, collar heights, and trouser breaks directly from plain text.'}
                {activePhase === 3 && 'Renders accurate fabric tension, wrinkle folds, and specular sheen matching your room lux.'}
              </p>

              <div>
                <button
                  onClick={onOpenFittingRoom}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1d1d1f] hover:bg-[#000000] text-white text-[15px] font-subline font-medium rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Try It With Your Photo</span>
                </button>
              </div>
            </div>

            {/* Right: Minimalist Neural Engine Visualizer */}
            <div className="lg:col-span-6 flex justify-center w-full">
              <div className="w-full max-w-lg aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-sm hairline-border bg-[#fbfbfd] relative flex items-center justify-center group">
                {/* Soft background mesh effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f7] via-white to-[#ebebed] opacity-80" />
                
                {/* Abstract glowing orb (Apple Intelligence vibe) */}
                <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
                  <div className="absolute inset-4 bg-gradient-to-bl from-white to-gray-100 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-10 bg-white rounded-full shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col items-center justify-center z-10 group-hover:scale-105 transition-transform duration-700">
                    <Sparkles className="w-6 h-6 text-[#86868b] opacity-60 mb-2" />
                    <div className="font-subline text-[10px] text-[#86868b] font-medium uppercase tracking-widest">
                      Processing
                    </div>
                  </div>
                </div>

                {/* Telemetry overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
                  <div className="font-subline text-[11px] text-[#86868b] font-medium tracking-wide">
                    Neural Engine Active
                  </div>
                  <div className="font-subline text-[11px] text-[#86868b] font-medium tracking-wide">
                    0.28ms Latency
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
