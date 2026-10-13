import { useState } from 'react';
import { STYLIST_RECOMMENDATIONS, SAVED_WARDROBE } from '../data/fashionData';
import { StylistRecommendation, WardrobeItem } from '../types/fashion';
import { Sparkles, ArrowRight, Bookmark, Send, Compass } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface AIStylistSectionProps {
  onSelectPromptForTryOn: (prompt: string) => void;
}

export function AIStylistSection({ onSelectPromptForTryOn }: AIStylistSectionProps) {
  const [selectedConsultation, setSelectedConsultation] = useState<StylistRecommendation>(
    STYLIST_RECOMMENDATIONS[0]
  );
  const [selectedWardrobeItem, setSelectedWardrobeItem] = useState<WardrobeItem | null>(null);
  const [wardrobeFilter, setWardrobeFilter] = useState<string>('all');
  const [customOccasion, setCustomOccasion] = useState<string>('');
  const [customGenerating, setCustomGenerating] = useState<boolean>(false);
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.12, yOffset: 24, duration: 0.9 });

  // Filter saved looks
  const filteredWardrobe = SAVED_WARDROBE.filter((item) => {
    if (wardrobeFilter === 'all') return true;
    return item.collection.toLowerCase().includes(wardrobeFilter.toLowerCase());
  });

  const handleGenerateCustomAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customOccasion.trim()) return;

    setCustomGenerating(true);
    setTimeout(() => {
      setSelectedConsultation({
        id: 'custom-' + Date.now(),
        promptTrigger: customOccasion,
        occasion: 'Bespoke Atelier Consultation',
        headline: `Architectural Chiaroscuro for "${customOccasion}"`,
        editorialProse: `To honor this setting, avoid generic commercial excess. We recommend a sculpted balance of natural raw fibers with deliberate drape tension—calibrated for ambient twilight lighting.`,
        lookTitle: 'The Bespoke Commission',
        outfitBreakdown: [
          { piece: 'Outer Layer', material: 'Double-faced cashmere raw wool wrap coat in obsidian', cut: 'Drop shoulder relaxed cut' },
          { piece: 'Midlayer', material: 'Finest-gauge seamless silk-merino turtleneck in parchment', cut: 'Sculptural ribless tubular fit' },
          { piece: 'Trousers', material: 'Relaxed cavalry twill tailoring with forward pleats', cut: 'Clean pooling break above Oxford shoe' }
        ],
        palette: [
          { name: 'Obsidian Noir', hex: '#0e1014' },
          { name: 'Parchment Silk', hex: '#e8e2d4' },
          { name: 'Burnt Ochre', hex: '#6d4b29' },
          { name: 'Champagne Brass', hex: '#c8aa6e' }
        ],
        fabricSpec: 'Double-Faced Cashmere 580g Silk-Merino 180g Cavalry Twill 460g'
      });
      setCustomGenerating(false);
      setCustomOccasion('');
    }, 700);
  };

  return (
    <section 
      ref={sectionRef} 
      id="stylist" 
      className="py-28 bg-[#060608] border-t border-white/[0.06] relative overflow-hidden"
    >
      {/* Studio Radial Ambient Fill */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#c8aa6e]/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="reveal-child text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.22em] text-[#c8aa6e] font-medium mb-3">
            Agentic Direction Personal Wardrobe
          </div>
          <h2 className="text-3xl sm:text-5xl font-editorial font-light tracking-tight text-neutral-100 mb-4">
            The Haute Stylist
          </h2>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            An intelligent advisor trained on century-old tailoring archives, occasion etiquette, and weather microclimates.
          </p>
        </div>

        {/* Custom Consultation Input Bar */}
        <div className="reveal-child max-w-2xl mx-auto mb-10">
          <form onSubmit={handleGenerateCustomAdvice} className="relative flex items-center">
            <Compass className="w-4 h-4 text-[#c8aa6e] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={customOccasion}
              onChange={(e) => setCustomOccasion(e.target.value)}
              placeholder="Ask stylist: e.g. Private gallery opening in Zurich during late November..."
              className="w-full pl-11 pr-28 py-3 bg-[#0c0c12] hairline-border rounded-sm text-xs sm:text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-[#c8aa6e] transition-colors"
            />
            <button
              type="submit"
              disabled={customGenerating || !customOccasion.trim()}
              className="absolute right-1.5 px-4 py-1.5 bg-[#ece6d8] hover:bg-white text-[#070709] text-[11px] font-mono uppercase tracking-wider font-medium rounded-sm transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              {customGenerating ? (
                <span>Composing...</span>
              ) : (
                <>
                  <span>Consult</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Stylist Occasion Prompt Selectors */}
        <div className="reveal-child flex flex-wrap justify-center gap-2 mb-10">
          {STYLIST_RECOMMENDATIONS.map((item) => {
            const isCurrent = selectedConsultation.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedConsultation(item)}
                className={`px-4 py-2 text-xs tracking-wider transition-all duration-200 rounded-sm cursor-pointer ${
                  isCurrent
                    ? 'bg-[#181822] text-[#e8e4d9] hairline-border-gold'
                    : 'bg-[#0a0a0e] text-neutral-400 hairline-border hover:text-neutral-200'
                }`}
              >
                {item.occasion}
              </button>
            );
          })}
        </div>

        {/* Curated Consultation Presentation Card */}
        <div className="reveal-child bg-[#0a0a0f] hairline-border p-8 sm:p-12 rounded-sm mb-20 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Editorial Advice & Recommendation */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c8aa6e] font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Consultation Brief: "{selectedConsultation.promptTrigger}"</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-editorial font-light text-neutral-100 leading-tight">
                {selectedConsultation.headline}
              </h3>

              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed italic border-l-2 border-[#c8aa6e]/60 pl-4 py-1 font-sans">
                "{selectedConsultation.editorialProse}"
              </p>

              {/* Garment Assembly Breakdown */}
              <div className="space-y-3 pt-3">
                <div className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
                  Curated Silhouette Breakdown
                </div>
                {selectedConsultation.outfitBreakdown.map((piece, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs py-2 border-b border-white/[0.05] gap-1">
                    <span className="font-mono text-neutral-400 uppercase tracking-wider text-[11px] sm:w-28 shrink-0">
                      {piece.piece}
                    </span>
                    <span className="text-neutral-200 font-medium flex-1">
                      {piece.material}
                    </span>
                    <span className="text-neutral-400 font-light sm:text-right">
                      {piece.cut}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectPromptForTryOn(selectedConsultation.lookTitle + ' — ' + selectedConsultation.headline)}
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#ece6d8] hover:bg-white text-[#070709] text-xs uppercase tracking-[0.18em] font-medium rounded-sm transition-all cursor-pointer shadow-[0_0_20px_rgba(200,170,110,0.15)]"
                >
                  <span>Try On Curated Look</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="text-xs text-neutral-400 font-mono">
                  {selectedConsultation.fabricSpec}
                </div>
              </div>
            </div>

            {/* Aesthetic Palette & Tactile Swatch Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-[#0e0e15] hairline-border p-6 rounded-sm space-y-6">
                <div>
                  <div className="text-[11px] font-mono tracking-widest text-[#c8aa6e] uppercase mb-1">
                    Curated Capsule
                  </div>
                  <div className="text-xl font-editorial text-neutral-100 font-normal">
                    {selectedConsultation.lookTitle}
                  </div>
                </div>

                {/* Color Harmony Swatches */}
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-3">
                    Chromatic Harmony
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedConsultation.palette.map((color, i) => (
                      <div key={i} className="space-y-1.5 text-center">
                        <div
                          className="h-14 rounded-sm border border-white/10 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="text-[10px] text-neutral-300 font-light truncate">
                          {color.name}
                        </div>
                        <div className="text-[9px] text-neutral-500 font-mono">
                          {color.hex}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tactile Specifications */}
                <div className="pt-2 border-t border-white/[0.06] text-xs text-neutral-400 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span>Occasion Formality</span>
                    <span className="text-neutral-200">Bespoke Atelier Protocol</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Optical Sheen Rating</span>
                    <span className="text-neutral-200">Ultra-Matte 12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thermal Insulation</span>
                    <span className="text-neutral-200">Autumn Transitional (14°C)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved-Looks Wardrobe Showcase */}
        <div className="reveal-child">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/[0.08] gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#c8aa6e] font-mono mb-1">
                Private Archive
              </div>
              <h3 className="text-2xl font-editorial font-light text-neutral-100">
                Saved-Looks Wardrobe
              </h3>
            </div>

            {/* Filter Pills / Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#0d0d14] rounded-sm hairline-border">
              <button
                onClick={() => setWardrobeFilter('all')}
                className={`px-3 py-1 text-xs font-mono rounded-sm transition-all cursor-pointer ${
                  wardrobeFilter === 'all' ? 'bg-[#1a1a24] text-[#c8aa6e]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Looks
              </button>
              <button
                onClick={() => setWardrobeFilter('capsule')}
                className={`px-3 py-1 text-xs font-mono rounded-sm transition-all cursor-pointer ${
                  wardrobeFilter === 'capsule' ? 'bg-[#1a1a24] text-[#c8aa6e]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Capsule A/W
              </button>
              <button
                onClick={() => setWardrobeFilter('evening')}
                className={`px-3 py-1 text-xs font-mono rounded-sm transition-all cursor-pointer ${
                  wardrobeFilter === 'evening' ? 'bg-[#1a1a24] text-[#c8aa6e]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Evening
              </button>
              <button
                onClick={() => setWardrobeFilter('transitional')}
                className={`px-3 py-1 text-xs font-mono rounded-sm transition-all cursor-pointer ${
                  wardrobeFilter === 'transitional' ? 'bg-[#1a1a24] text-[#c8aa6e]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Transitional
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredWardrobe.map((look) => (
              <div
                key={look.id}
                onClick={() => setSelectedWardrobeItem(look)}
                className="group bg-[#0b0b10] hairline-border p-5 rounded-sm hover:bg-[#101017] hover:border-[#c8aa6e]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-3">
                    <span className="text-[#c8aa6e]">{look.collection}</span>
                    <span>{look.dateCreated}</span>
                  </div>

                  <h4 className="text-base font-editorial text-neutral-100 group-hover:text-[#c8aa6e] transition-colors mb-2">
                    {look.title}
                  </h4>

                  <p className="text-xs text-neutral-400 font-light line-clamp-2 italic mb-4">
                    "{look.prompt}"
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>{look.fabric}</span>
                  <div className="flex items-center gap-1 text-[#c8aa6e]">
                    <Bookmark className="w-3 h-3" />
                    <span>Archived</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wardrobe Item Inspection Drawer/Modal */}
      {selectedWardrobeItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedWardrobeItem(null)}
        >
          <div 
            className="bg-[#0d0d14] hairline-border-gold p-8 rounded-sm max-w-md w-full shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8aa6e]">
                  {selectedWardrobeItem.collection} Saved Look
                </span>
                <h4 className="text-2xl font-editorial font-light text-neutral-100 mt-1">
                  {selectedWardrobeItem.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedWardrobeItem(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono uppercase cursor-pointer"
              >
                Close &times;
              </button>
            </div>

            <div className="p-4 bg-[#111119] rounded-sm hairline-border text-xs text-neutral-300 italic">
              "{selectedWardrobeItem.prompt}"
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                <span>Fabric Weight</span>
                <span className="text-neutral-200">{selectedWardrobeItem.fabric}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                <span>Drape Profile</span>
                <span className="text-neutral-200">{selectedWardrobeItem.specs.drape}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                <span>Studio Lighting</span>
                <span className="text-neutral-200">{selectedWardrobeItem.specs.lighting}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                <span>Silhouette Architecture</span>
                <span className="text-neutral-200">{selectedWardrobeItem.specs.silhouette}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectPromptForTryOn(selectedWardrobeItem.prompt);
                setSelectedWardrobeItem(null);
              }}
              className="w-full py-3 bg-[#ece6d8] hover:bg-white text-[#070709] text-xs uppercase tracking-[0.18em] font-medium rounded-sm transition-all cursor-pointer"
            >
              Re-Render Look In Fitting Room
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
