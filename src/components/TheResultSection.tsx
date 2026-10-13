import { useScrollReveal } from '../hooks/useScrollReveal';

export function TheResultSection() {
  // Separate reveals for the two beats: the section is tall, so one observer on the
  // whole thing would reveal the pillars long before they scroll into view.
  const statementRef = useScrollReveal<HTMLDivElement>({ stagger: 0.12, yOffset: 20, duration: 0.85 });
  const pillarsRef = useScrollReveal<HTMLDivElement>({ stagger: 0.12, yOffset: 20, duration: 0.85 });

  return (
    <section
      id="result"
      className="relative bg-transparent border-t border-black/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Content on the left scrolls past the parked model */}
        <div className="py-28 sm:py-36 lg:pt-[20vh] lg:pb-[50vh] space-y-16 lg:space-y-[40vh] text-left">
          {/* Beat 1: Latency statement */}
          <div ref={statementRef} className="space-y-6 lg:min-h-[60vh] lg:flex lg:flex-col lg:justify-center">


            {/* Oversized Typographic Numeral */}
            <div className="reveal-child my-4 select-none">
              <span className="font-headline text-8xl sm:text-9xl md:text-[11rem] font-semibold tracking-tighter text-[#1d1d1f] leading-none inline-block">
                03<span className="text-[#86868b] text-5xl sm:text-7xl md:text-7xl align-top ml-1">s</span>
              </span>
            </div>

            {/* Confident Minimalist Statement */}
            <div className="reveal-child max-w-xl space-y-4">
              <h2 className="font-headline text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] leading-snug">
                Description to Photorealism.
              </h2>

              <p className="font-subline text-[15px] sm:text-[17px] text-[#86868b] leading-relaxed">
                No 3D coordinate rigging or avatar approximations. An indistinguishable photograph of you in any garment.
              </p>
            </div>
          </div>

          {/* Beat 2: 3 Minimal Metric Pillars */}
          <div ref={pillarsRef}>
            <div className="reveal-child pt-10 max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-t border-black/5">
              <div className="space-y-2">
                <div className="font-headline text-[15px] text-[#1d1d1f] font-semibold">
                  Volumetric Solvers
                </div>
                <p className="font-subline text-[13px] text-[#86868b] leading-relaxed">
                  Gravity folds and weave stiffness modeled to your frame.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-headline text-[15px] text-[#1d1d1f] font-semibold">
                  Ambient Lux Match
                </div>
                <p className="font-subline text-[13px] text-[#86868b] leading-relaxed">
                  Directional highlights extracted from your room lighting.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-headline text-[15px] text-[#1d1d1f] font-semibold">
                  Biometric Purge
                </div>
                <p className="font-subline text-[13px] text-[#86868b] leading-relaxed">
                  Ephemeral memory only. Zero photo retention.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty column: GlobalShirtScene parks the 3D model here for the whole section */}
        <div data-shirt-anchor="result" className="hidden lg:block" />
      </div>
    </section>
  );
}
