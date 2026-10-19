import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export function HeroDressingScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Progress through the pinned hero (0 → 1), driving the headline's parallax and fade.
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxY = -scrollProgress * 85;
  const headlineOpacity = Math.max(0.12, 1 - scrollProgress * 1.5);

  return (
    <section
      ref={containerRef}
      id="atelier"
      className="relative h-[280vh] w-full"
    >
      {/* Sticky Fullscreen Transparent Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-transparent select-none">

        {/* Soft Studio Overhead Light Falloff (Transparent version) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />

        {/* Center-Left Hero Headline */}
        <div
          className="absolute left-6 sm:left-12 lg:left-20 top-1/2 max-w-lg text-left z-20 pointer-events-auto transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(calc(-50% + ${parallaxY}px))`,
            opacity: headlineOpacity,
          }}
        >
          {/* Subtle Tag */}
          <div className="text-[13px] font-subline text-[#86868b] mb-3 flex items-center gap-1.5 font-medium">
            <span>Neural Haute Couture</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-tight mb-4">
            Pure Design.<br />
            See yourself.
          </h1>

          {/* Concise Subline */}
          <p className="font-subline text-[15px] sm:text-[17px] text-[#86868b] font-normal leading-relaxed max-w-sm mb-8">
            Photorealistic neural virtual try-on in three seconds. Describe any outfit in plain English.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/try-on/"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-[#1d1d1f] hover:bg-[#000000] text-white text-[15px] font-subline font-medium rounded-full transition-all shadow-sm active:scale-95"
            >
              <span>Try It On</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href="#philosophy"
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] text-[15px] font-subline font-medium rounded-full hairline-border-dark transition-colors shadow-sm active:scale-95"
            >
              <span>Our Works</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
