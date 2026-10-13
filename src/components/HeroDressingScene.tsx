import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowDown, Star } from 'lucide-react';
import { playMicroClick } from '../utils/audioFeedback';

interface HeroDressingSceneProps {
  onOpenFittingRoom: () => void;
}

export function HeroDressingScene({ onOpenFittingRoom }: HeroDressingSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastFrameMilestoneRef = useRef(0);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')} 27 June 2026`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll-craft: continuous frame scrubbing with speed calibrated -40%
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

      // Micro audio click on every 30-frame milestone
      const frameNum = Math.floor(progress * 180);
      const milestone = Math.floor(frameNum / 25);
      if (milestone !== lastFrameMilestoneRef.current) {
        lastFrameMilestoneRef.current = milestone;
        playMicroClick(800 + milestone * 80, 0.025);
      }
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

        {/* Removed local ThreeScrollFrameScene - GlobalShirtScene handles this now */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
        </div>

        {/* Large Architectural Watermark Letters */}
        <div className="absolute bottom-16 left-0 right-0 z-10 pointer-events-none flex justify-center opacity-5">
          <span className="font-headline text-7xl sm:text-9xl md:text-[14rem] font-semibold tracking-tight text-[#1d1d1f] select-none whitespace-nowrap">
            Lookbook
          </span>
        </div>

        {/* Floating Top Studio Bar */}
        <div className="absolute top-20 left-0 right-0 z-20 px-6 sm:px-12 flex items-center justify-between pointer-events-auto">


          <div className="hidden sm:flex items-center gap-4 text-xs font-subline text-[#626678]">
            <span className="font-mono">{currentTime}</span>
          </div>
        </div>

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

          {/* Social Proof */}
          <div className="flex items-center gap-2 text-[13px] font-subline text-[#86868b] mb-8">
            <div className="flex text-[#1d1d1f]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-medium">3,000+ Fitted Customers</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playMicroClick(1300, 0.04);
                onOpenFittingRoom();
              }}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-[#1d1d1f] hover:bg-[#000000] text-white text-[15px] font-subline font-medium rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>Try It On</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <a
              href="#philosophy"
              onClick={() => playMicroClick(1100, 0.03)}
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] text-[15px] font-subline font-medium rounded-full hairline-border-dark transition-colors shadow-sm active:scale-95"
            >
              <span>Our Works</span>
            </a>
          </div>
        </div>

        {/* Center Bottom Floating Capsule Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <div className="flex items-center gap-5 px-6 py-2.5 glass-pill rounded-full shadow-sm text-[13px] font-subline text-[#86868b]">
            <span className="font-medium">Est. 2026</span>
            <span className="text-black/10">|</span>
            <span className="text-[#1d1d1f] font-medium">Neural Drape</span>
            <span className="text-black/10">|</span>
            <a 
              href="#philosophy" 
              onClick={() => playMicroClick(1000, 0.03)}
              className="flex items-center gap-2 text-[#1d1d1f] font-medium hover:text-[#000000] transition-colors"
            >
              <span>Scroll Down</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#86868b]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
