import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { playMicroClick } from '../utils/audioFeedback';

interface LookbookItem {
  id: string;
  plate: string;
  title: string;
  fabric: string;
  prompt: string;
  aspect: string;
}

const LOOKS: LookbookItem[] = [
  {
    id: 'plate-01',
    plate: 'PLATE I',
    title: 'The Nocturne Wrap',
    fabric: 'Double-Faced Cashmere 680g',
    prompt: 'sculptural double-faced cashmere wrap coat in obsidian noir, raw silk shirting, wide pleat trousers',
    aspect: 'col-span-12 lg:col-span-7',
  },
  {
    id: 'plate-02',
    plate: 'PLATE II',
    title: 'The Raw Silk Trench',
    fabric: 'Crisp Silk Faille 380g',
    prompt: 'architectural sand silk-faille oversized storm trench, ivory fine-gauge cashmere crewneck',
    aspect: 'col-span-12 lg:col-span-5',
  },
  {
    id: 'plate-03',
    plate: 'PLATE III',
    title: 'Velvet Evening Smoking',
    fabric: 'Italian Cotton Velvet 520g',
    prompt: 'midnight velvet dinner jacket, broad grosgrain shawl lapel, poplin dress shirt',
    aspect: 'col-span-12 lg:col-span-5',
  },
  {
    id: 'plate-04',
    plate: 'PLATE IV',
    title: 'Bonded Minimal Shell',
    fabric: 'Bonded Merino Wool 460g',
    prompt: 'minimalist bonded wool zip jacket in deep espresso, seamless mockneck, architectural trousers',
    aspect: 'col-span-12 lg:col-span-7',
  },
];

interface TheLookbookSectionProps {
  onSelectPromptForTryOn: (prompt: string) => void;
}

export function TheLookbookSection({ onSelectPromptForTryOn }: TheLookbookSectionProps) {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.1, yOffset: 20, duration: 0.85 });

  const handleSelectLook = (prompt: string) => {
    playMicroClick(1500, 0.04);
    onSelectPromptForTryOn(prompt);
  };

  return (
    <section
      ref={sectionRef}
      id="lookbook"
      className="relative py-28 sm:py-36 bg-white border-t border-black/[0.06] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="reveal-child flex flex-col md:flex-row md:items-end justify-between pb-10 mb-12 border-b border-black/5 gap-4">
          <div>
            <div className="font-subline text-[13px] text-[#86868b] font-medium mb-2">
              Curated Archive Autumn / Winter
            </div>
            <h2 className="font-headline text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
              The Lookbook.
            </h2>
          </div>
          <p className="font-subline text-[15px] sm:text-[17px] text-[#86868b] max-w-sm">
            Photorealistic trial renders produced entirely by prompt specification. Zero physical garment samples.
          </p>
        </div>

        {/* Asymmetric Gallery Cards */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          {LOOKS.map((item) => (
            <div
              key={item.id}
              className={`reveal-child ${item.aspect} group cursor-pointer`}
              onClick={() => handleSelectLook(item.prompt)}
            >
              <SpotlightCard className="bg-[#fbfbfd] hover:bg-[#f5f5f7] hairline-border p-7 rounded-3xl transition-all duration-300 h-full flex flex-col justify-between space-y-6 shadow-sm">
                <div className="flex items-center justify-between font-subline text-[13px] text-[#86868b] font-medium">
                  <span className="text-[#1d1d1f] font-semibold">{item.plate}</span>
                  <span>{item.fabric}</span>
                </div>

                {/* Editorial Visual Slate */}
                <div className="relative aspect-[16/10] bg-[#1d1d1f] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-white shadow-inner transition-transform duration-300">
                  <div className="w-24 h-36 bg-white/5 rounded-t-xl border-t border-white/20 flex flex-col items-center justify-between p-3 shadow-inner">
                    <div className="w-6 h-6 border-r border-b border-white/20 -rotate-45" />
                    <span className="font-subline text-[10px] text-white/60 font-medium">
                      Neural Drape
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 font-subline text-[11px] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white font-medium flex items-center gap-1.5 border border-white/10">
                    <Sparkles className="w-3 h-3 text-white/80" />
                    <span>3.0s Latency</span>
                  </div>
                </div>

                {/* Caption */}
                <div className="space-y-1">
                  <h3 className="font-headline text-2xl font-semibold text-[#1d1d1f] group-hover:opacity-70 transition-opacity">
                    {item.title}
                  </h3>
                  <p className="font-subline text-[13px] text-[#86868b] italic line-clamp-1">
                    "{item.prompt}"
                  </p>
                </div>

                {/* Action */}
                <div className="pt-3 border-t border-black/5 flex items-center justify-between font-subline text-[13px]">
                  <span className="text-[#86868b] font-medium">Click to try look</span>
                  <span className="inline-flex items-center gap-1 text-[#1d1d1f] font-medium transition-transform group-hover:translate-x-1">
                    <span>Try On</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
