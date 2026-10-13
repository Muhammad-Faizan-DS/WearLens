import { Sparkles, ArrowUp } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface FooterProps {
  onOpenFittingRoom: () => void;
}

export function Footer({ onOpenFittingRoom }: FooterProps) {
  const ctaRef = useScrollReveal<HTMLDivElement>({ stagger: 0.12, yOffset: 20, duration: 0.85 });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#fbfbfd] border-t border-black/5 relative overflow-hidden">
      {/* Closing Haute CTA Section */}
      <div ref={ctaRef} className="max-w-4xl mx-auto px-6 py-28 sm:py-36 text-center relative z-10 space-y-6">
        <div className="reveal-child font-subline text-[13px] text-[#86868b] font-medium">
          The Future of Personal Dressing
        </div>

        <h2 className="reveal-child font-headline text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-none text-balance">
          Private. Precise.<br />
          Cinematic.
        </h2>

        <p className="reveal-child font-subline text-[15px] sm:text-[17px] text-[#86868b] max-w-md mx-auto leading-relaxed">
          Step into your private atelier. Describe any garment, fabric weight, or tailoring nuance, and see yourself wearing it in three seconds.
        </p>

        <div className="reveal-child pt-4 flex flex-col sm:flex-row items-center justify-center gap-5">
          <button
            onClick={onOpenFittingRoom}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#1d1d1f] hover:bg-[#000000] text-white text-[15px] font-subline font-medium rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enter Digital Fitting Room</span>
          </button>
        </div>

        <div className="reveal-child font-subline text-[13px] text-[#86868b] pt-6">
          Client-side ephemeral encryption Zero biometric retention
        </div>
      </div>

      {/* Minimal Editorial Footer Bar */}
      <div className="border-t border-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 font-subline text-[13px] text-[#86868b]">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <span className="font-headline text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
              Lookbook
            </span>
            <span className="text-black/10"></span>
            <span className="text-[#86868b]">
              Neural Haute Couture Atelier
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 font-medium text-[#86868b]">
            <a href="#atelier" className="hover:text-[#1d1d1f] transition-colors">
              Atelier
            </a>
            <a href="#how-it-works" className="hover:text-[#1d1d1f] transition-colors">
              Mechanism
            </a>
            <a href="#stylist" className="hover:text-[#1d1d1f] transition-colors">
              AI Stylist
            </a>
            <a href="#for-stores" className="hover:text-[#1d1d1f] transition-colors">
              For Boutiques
            </a>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-[#1d1d1f] transition-colors cursor-pointer"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copyright & Era */}
          <div className="text-[13px] text-[#86868b]">
            &copy; 2026 Lookbook Atelier All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
