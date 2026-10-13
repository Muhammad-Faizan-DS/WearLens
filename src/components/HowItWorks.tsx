import { useState } from 'react';
import { Camera, Sparkles, Check, ArrowRight, Layers } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface HowItWorksProps {
  onOpenFittingRoom: () => void;
}

export function HowItWorks({ onOpenFittingRoom }: HowItWorksProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedFabricLab, setSelectedFabricLab] = useState<'wool' | 'silk' | 'velvet'>('wool');
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.12, yOffset: 24, duration: 0.9 });

  const steps = [
    {
      num: '01',
      title: 'Upload or Open Lens',
      subtitle: 'Single photograph or real-time camera feed',
      description:
        'A single mirror photograph or 3-second live camera capture is all LOOKBOOK needs. Our neural topology analyzer calculates your shoulder curvature, stance, natural drapery line, and skin tone ambient bounce in 280 milliseconds. No 3D body scanners or specialized markers required.',
      details: [
        'Works with casual mirror selfies or studio portraits',
        'Automatic background separation and depth sensing',
        'Strict biometric privacy: processed in ephemeral memory, never retained'
      ],
      interactiveLabel: 'Step 1: Lens Mapping',
      previewHeading: 'Skeletal & Posture Extraction',
      badge: 'Capture'
    },
    {
      num: '02',
      title: 'Describe in Plain English',
      subtitle: 'Natural language without technical styling jargon',
      description:
        'Simply state what you envision. From iconic vintage archival pieces to bespoke custom tailoring, specify exact fabric weights, cuts, textures, and atmospheric settings. The agent parses weave density, tensile stiffness, and garment seams automatically.',
      details: [
        'Understands natural nuances ("unstructured relaxed shoulder", "heavy melton wool")',
        'Cross-references textile physics across 12,000 couture fabric archives',
        'Intelligently coordinates underpinnings, collar heights, and trouser breaks'
      ],
      interactiveLabel: 'Step 2: Natural Syntax',
      previewHeading: 'Textile Physics Decomposition',
      badge: 'Synthesize'
    },
    {
      num: '03',
      title: 'Photorealistic Reveal in 3s',
      subtitle: 'Indistinguishable 4K composite in natural light',
      description:
        'Within three seconds, see yourself wearing the exact ensemble. The rendering engine casts accurate wrinkles, fabric tension folds, seam shadows, and specular highlights matching your room\'s lighting. Not a flat sticker or 2D sticker paste—a true optical dress.',
      details: [
        'Full volumetric cloth drape calculation with gravity modeling',
        'Real specular light reflection and ambient color temperature matching',
        'High-resolution output ready for personal archiving or store checkout'
      ],
      interactiveLabel: 'Step 3: Neural Rendering',
      previewHeading: 'High-Resolution Volumetric Drape',
      badge: 'Render'
    }
  ];

  const current = steps[activeStep - 1];

  const fabricSpecs = {
    wool: {
      title: 'Melton Virgin Wool (650 g/m²)',
      stiffness: '85% (High Structural Memory)',
      weave: 'Compact Twill Milled & Raised',
      gravity: 'Perpendicular Straight Hang',
      lightAbsorption: '94% (Deep Obsidian Well)',
    },
    silk: {
      title: 'Raw Silk Faille (380 g/m²)',
      stiffness: '35% (Liquid Bias Fluidity)',
      weave: 'Crisp Ribbed Filament Faille',
      gravity: 'Anatomical Contoured Ripple',
      lightAbsorption: '68% (Subtle Directional Lustre)',
    },
    velvet: {
      title: 'Italian Cotton Velvet (520 g/m²)',
      stiffness: '65% (Draped Plush Volume)',
      weave: 'Dense Cut-Pile Velvet',
      gravity: 'Weighted Gentle Cascade',
      lightAbsorption: '97% (Shadows with Soft Halo)',
    },
  };

  return (
    <section 
      ref={sectionRef} 
      id="how-it-works" 
      className="relative py-28 bg-[#070709] border-t border-white/[0.06] overflow-hidden"
    >
      {/* Studio Radial Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-white/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Editorial Header */}
        <div className="reveal-child text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.22em] text-[#c8aa6e] font-medium mb-3">
            The Digital Fitting Room
          </div>
          <h2 className="text-3xl sm:text-5xl font-editorial font-light tracking-tight text-neutral-100 mb-4">
            Three Quiet Steps
          </h2>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            From natural prose to a bespoke photographic try-on. No clunky 3D avatars or robotic distortion.
          </p>
        </div>

        {/* Step Selector Tab Navigation */}
        <div className="reveal-child grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const isSelected = activeStep === stepNum;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(stepNum)}
                className={`p-6 text-left transition-all duration-300 rounded-sm cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#101016] hairline-border-gold shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
                    : 'bg-[#0a0a0e]/60 hairline-border hover:bg-[#0e0e14] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono tracking-widest text-[#c8aa6e]">
                    {s.num}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-lg font-editorial text-neutral-100 font-normal mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light line-clamp-1">
                  {s.subtitle}
                </p>
                {isSelected && (
                  <div className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-[#c8aa6e]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Continuous Active Step Showcase Card */}
        <div className="reveal-child bg-[#0b0b10] hairline-border p-8 sm:p-12 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.7)] mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Step Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c8aa6e] font-mono">
                <span>Phase {current.num}</span>
                <span></span>
                <span>{current.subtitle}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-editorial font-light text-neutral-100 leading-snug">
                {current.title}
              </h3>

              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                {current.description}
              </p>

              {/* Technical Precision Proof Points */}
              <div className="space-y-3 pt-2">
                {current.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#171722] border border-[#c8aa6e]/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-[#c8aa6e]" />
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-300 font-light">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={onOpenFittingRoom}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ece6d8] hover:bg-white text-[#070709] text-xs uppercase tracking-[0.18em] font-medium rounded-sm transition-all cursor-pointer shadow-[0_0_20px_rgba(200,170,110,0.15)]"
                >
                  <span>Experience Try-On</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-xs text-neutral-400 font-mono">
                  Latency: &le; 3.0s
                </span>
              </div>
            </div>

            {/* Interactive Simulation Display Column */}
            <div className="lg:col-span-5">
              <div className="bg-[#0e0e14] hairline-border p-6 rounded-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-neutral-400 pb-4 mb-4 border-b border-white/[0.06]">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#c8aa6e]">
                    Atelier Engine Monitor
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400">
                    STATUS: READY
                  </span>
                </div>

                {activeStep === 1 && (
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] max-h-[300px] w-full bg-[#12121a] rounded-sm overflow-hidden flex flex-col items-center justify-center border border-white/[0.08]">
                      <div className="w-32 h-44 rounded-full border border-dashed border-[#c8aa6e]/50 flex flex-col items-center justify-center text-center p-3 relative">
                        <Camera className="w-6 h-6 text-[#c8aa6e] mb-2" />
                        <span className="text-[10px] tracking-wider text-neutral-300 uppercase font-mono">
                          Subject Pose
                        </span>
                        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#c8aa6e]" />
                        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#c8aa6e]" />
                        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#c8aa6e]" />
                        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#c8aa6e]" />
                      </div>
                      <div className="mt-3 text-[11px] font-mono text-neutral-400">
                        Frame Alignment: 99.4% Accuracy
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-400">
                      <div className="bg-[#14141d] p-2 rounded-sm border border-white/5">
                        SKELETON: 33 JOINTS
                      </div>
                      <div className="bg-[#14141d] p-2 rounded-sm border border-white/5">
                        AMBIENT LUX: 450 LUMENS
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#12121a] rounded-sm border border-white/[0.08] font-mono text-xs text-neutral-300 space-y-2">
                      <div className="text-[10px] text-[#c8aa6e] uppercase tracking-wider">
                        Natural Query Input:
                      </div>
                      <div className="text-neutral-100 font-sans italic text-sm">
                        "Oversized double-breasted coat in charcoal melton wool with white poplin collar"
                      </div>
                    </div>

                    <div className="space-y-2 text-[11px] font-mono">
                      <div className="flex justify-between items-center bg-[#14141d] p-2 rounded-sm border border-white/5">
                        <span className="text-neutral-400">Weave Density</span>
                        <span className="text-[#c8aa6e]">650 g/m² Virgin Wool</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#14141d] p-2 rounded-sm border border-white/5">
                        <span className="text-neutral-400">Shoulder Pad Stiffener</span>
                        <span className="text-neutral-200">Structured Bespoke Drop</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#14141d] p-2 rounded-sm border border-white/5">
                        <span className="text-neutral-400">Collar Break Point</span>
                        <span className="text-neutral-200">Low-Set Double Button</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] max-h-[300px] w-full bg-[#12121a] rounded-sm overflow-hidden flex flex-col items-center justify-center border border-white/[0.08]">
                      <div className="w-36 h-48 bg-gradient-to-b from-[#1b1c23] to-[#0d0d12] rounded-t-lg border-t-2 border-[#c8aa6e]/60 relative flex flex-col items-center justify-center shadow-inner">
                        <div className="w-12 h-14 border-b-2 border-r-2 border-[#c8aa6e]/40 -rotate-45 absolute top-1" />
                        <Sparkles className="w-6 h-6 text-[#c8aa6e] animate-pulse" />
                        <span className="text-[10px] tracking-widest text-neutral-300 uppercase font-mono mt-3">
                          Render Complete
                        </span>
                      </div>
                      <div className="mt-3 text-[11px] font-mono text-[#c8aa6e]">
                        4K Photorealistic Composite 2.8s
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-400">
                      <div className="bg-[#14141d] p-2 rounded-sm border border-white/5">
                        RAY BOUNCE: 16 SAMPLES
                      </div>
                      <div className="bg-[#14141d] p-2 rounded-sm border border-white/5">
                        SPECULAR SHEEN: MATCHED
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Fabric Physics Lab (Scroll-Craft & UI-UX Pro Max Feature) */}
        <div className="reveal-child bg-[#09090e] hairline-border p-6 sm:p-8 rounded-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/[0.06] gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c8aa6e]" />
              <span className="text-xs uppercase tracking-[0.2em] font-mono text-neutral-200">
                Textile Physics &amp; Tensile Drape Decomposition
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedFabricLab('wool')}
                className={`px-3 py-1 text-xs font-mono rounded-sm transition-all cursor-pointer ${
                  selectedFabricLab === 'wool' ? 'bg-[#1a1a24] text-[#c8aa6e] border border-[#c8aa6e]' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Melton Wool
              </button>
              <button
                onClick={() => setSelectedFabricLab('silk')}
                className={`px-3 py-1 text-xs font-mono rounded-sm transition-all cursor-pointer ${
                  selectedFabricLab === 'silk' ? 'bg-[#1a1a24] text-[#c8aa6e] border border-[#c8aa6e]' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Raw Silk
              </button>
              <button
                onClick={() => setSelectedFabricLab('velvet')}
                className={`px-3 py-1 text-xs font-mono rounded-sm transition-all cursor-pointer ${
                  selectedFabricLab === 'velvet' ? 'bg-[#1a1a24] text-[#c8aa6e] border border-[#c8aa6e]' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Cotton Velvet
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#0d0d14] rounded-sm hairline-border">
              <div className="text-[10px] text-neutral-500 uppercase mb-1">Textile Weight &amp; Spec</div>
              <div className="text-neutral-200 font-medium">{fabricSpecs[selectedFabricLab].title}</div>
            </div>
            <div className="p-3 bg-[#0d0d14] rounded-sm hairline-border">
              <div className="text-[10px] text-neutral-500 uppercase mb-1">Tensile Stiffness</div>
              <div className="text-[#c8aa6e] font-medium">{fabricSpecs[selectedFabricLab].stiffness}</div>
            </div>
            <div className="p-3 bg-[#0d0d14] rounded-sm hairline-border">
              <div className="text-[10px] text-neutral-500 uppercase mb-1">Gravity Bias Drop</div>
              <div className="text-neutral-200 font-medium">{fabricSpecs[selectedFabricLab].gravity}</div>
            </div>
            <div className="p-3 bg-[#0d0d14] rounded-sm hairline-border">
              <div className="text-[10px] text-neutral-500 uppercase mb-1">Specular Lux Behavior</div>
              <div className="text-neutral-200 font-medium">{fabricSpecs[selectedFabricLab].lightAbsorption}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
