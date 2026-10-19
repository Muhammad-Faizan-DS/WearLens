import { Sparkles, ArrowUp } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export function FinalCTA() {
  const ctaRef = useScrollReveal<HTMLDivElement>({ stagger: 0.1, yOffset: 20, duration: 0.85 });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // #closing is also where GlobalShirtScene stops drawing: once this opaque footer has
    // slid over the viewport, the 3D shirt behind it is hidden.
    <footer id="closing" className="bg-[#fbfbfd] border-t border-black/5 relative overflow-hidden">
      {/* Centered Closing CTA */}
      <div
        ref={ctaRef}
        className="max-w-4xl mx-auto px-6 py-28 sm:py-36 text-center relative z-10 space-y-6"
      >
        <div className="reveal-child font-subline text-[13px] text-[#86868b] font-medium">
          Haute Couture Digital Atelier
        </div>

        <h2 className="reveal-child font-headline text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-none text-balance">
          Describe any outfit.<br />
          See yourself.
        </h2>

        <p className="reveal-child font-subline text-[15px] sm:text-[17px] text-[#86868b] max-w-md mx-auto leading-relaxed">
          The fitting room is open. Pick a piece, turn on your camera and see it on you, live.
        </p>

        {/* Buttons */}
        <div className="reveal-child pt-4 flex items-center justify-center">
          <a
            href="/try-on/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#1d1d1f] hover:bg-[#000000] text-white text-[15px] font-subline font-medium rounded-full transition-all shadow-sm active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try it on live</span>
          </a>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="border-t border-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 font-subline text-[13px] text-[#86868b]">
          <a
            href="#"
            className="font-headline text-[17px] font-semibold tracking-tight text-[#1d1d1f] hover:opacity-70 transition-opacity"
          >
            WearLens
          </a>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-[#86868b]">
            <a href="#atelier" className="hover:text-[#1d1d1f] transition-colors">Atelier</a>
            <a href="#philosophy" className="hover:text-[#1d1d1f] transition-colors">Philosophy</a>
            <a href="#result" className="hover:text-[#1d1d1f] transition-colors">Result</a>
            <a href="/try-on/" className="hover:text-[#1d1d1f] transition-colors">Shop</a>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-[#1d1d1f] transition-colors cursor-pointer"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="font-subline text-[13px] text-[#86868b]">
            &copy; 2026 WearLens
          </div>
        </div>
      </div>
    </footer>
  );
}
