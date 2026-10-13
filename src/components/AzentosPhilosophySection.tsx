import { useScrollReveal } from '../hooks/useScrollReveal';
import { Sparkles, Award, ArrowUpRight } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { playMicroClick } from '../utils/audioFeedback';

export function AzentosPhilosophySection() {
  // Separate reveals for the two beats: the section is tall, so one observer on the
  // whole thing would reveal the bento cards long before they scroll into view.
  const introRef = useScrollReveal<HTMLDivElement>({ stagger: 0.1, yOffset: 20, duration: 0.85 });
  const bentoRef = useScrollReveal<HTMLDivElement>({ stagger: 0.1, yOffset: 20, duration: 0.85 });

  return (
    <section
      id="philosophy"
      className="relative bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Empty column: GlobalShirtScene parks the 3D model here for the whole section */}
        <div data-shirt-anchor="philosophy" className="hidden lg:block" />

        {/* Content on the right scrolls past the parked model */}
        <div className="py-28 sm:py-36 lg:pt-[20vh] lg:pb-[50vh] space-y-16 lg:space-y-[45vh]">
          {/* Beat 1: Core Headline */}
          <div ref={introRef} className="space-y-4 lg:min-h-[60vh] lg:flex lg:flex-col lg:justify-center">
            <h2 className="reveal-child font-headline text-4xl sm:text-5xl md:text-6xl font-semibold text-[#1d1d1f] leading-tight tracking-tight text-balance">
              Real cloth tension.<br />
              Not flat stickers.
            </h2>

            <p className="reveal-child font-subline text-[15px] sm:text-[17px] text-[#86868b] font-normal max-w-lg leading-relaxed">
              Every silhouette calculates physical drape, room lux reflection, and true living posture in three seconds.
            </p>
          </div>

          {/* Beat 2: Minimal Bento Showcase Grid */}
          <div ref={bentoRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {/* Card 1: Maisons */}
            <div className="reveal-child">
              <SpotlightCard className="h-full bg-white hairline-border p-8 rounded-3xl flex flex-col justify-between shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-headline text-[22px] font-semibold text-[#1d1d1f] leading-snug">
                    400+ Luxury Maisons
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-[#fbfbfd] flex items-center justify-center shrink-0 border border-black/5">
                    <Sparkles className="w-4 h-4 text-[#86868b]" />
                  </div>
                </div>

                <p className="font-subline text-[13px] text-[#86868b] leading-relaxed">
                  Volumetric cloth solvers calculate fiber stiffness, seam tension, and specular grain directly on your physique.
                </p>
              </SpotlightCard>
            </div>

            {/* Card 2: 56M+ Drapes with User Avatars */}
            <div className="reveal-child">
              <SpotlightCard className="h-full bg-white hairline-border p-8 rounded-3xl flex flex-col justify-between shadow-sm space-y-6">
                <div className="flex -space-x-2 overflow-hidden">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#1d1d1f] text-[10px] font-subline flex items-center justify-center text-white font-medium"
                    >
                      0{n}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="font-headline text-4xl font-semibold text-[#1d1d1f]">
                    56M+
                  </div>
                  <div className="font-subline text-[13px] text-[#86868b] font-medium mt-1">
                    Drapes Calculated
                  </div>
                </div>
              </SpotlightCard>
            </div>

            {/* Card 3: 10+ Awards */}
            <div className="reveal-child">
              <SpotlightCard className="h-full bg-white hairline-border p-8 rounded-3xl flex flex-col justify-between shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-headline text-4xl font-semibold text-[#1d1d1f]">
                      10+
                    </div>
                    <div className="font-subline text-[13px] text-[#86868b] font-medium mt-1">
                      Tech Awards
                    </div>
                  </div>

                  <div className="p-2.5 rounded-full bg-[#fbfbfd] border border-black/5">
                    <Award className="w-4 h-4 text-[#86868b]" />
                  </div>
                </div>

                <p className="font-subline text-[13px] text-[#86868b] leading-relaxed">
                  Best Neural Atelier 2026 for sub-3 second optical dress resolution.
                </p>
              </SpotlightCard>
            </div>

            {/* Card 4: Dark Accent Portrait Card */}
            <div className="reveal-child">
              <SpotlightCard
                spotlightColor="rgba(255, 255, 255, 0.1)"
                onClick={() => playMicroClick(1400, 0.04)}
                className="h-full bg-[#1d1d1f] text-white p-6 rounded-3xl flex flex-col items-center justify-between text-center shadow-lg group cursor-pointer"
              >
                <div className="w-full flex justify-end">
                  <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="w-14 h-20 bg-white/10 rounded-t-xl border-t border-white/20 flex flex-col items-center justify-center my-3 shadow-inner">
                  <span className="font-subline text-[10px] text-white/80 font-medium">
                    4K Drape
                  </span>
                </div>
                <div className="font-headline text-[13px] text-white font-medium">
                  Studio D50
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
