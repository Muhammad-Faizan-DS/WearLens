import { useScrollReveal } from '../hooks/useScrollReveal';
import { SpotlightCard } from './SpotlightCard';

export function TheAtelierSection() {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.08, yOffset: 16, duration: 0.75 });

  const specs = [
    {
      num: '01',
      title: 'Stylist Engine',
      stat: '12,000+',
      desc: 'Archival tailoring patterns & live etiquette protocols.',
    },
    {
      num: '02',
      title: 'Saved Capsule',
      stat: 'Instant',
      desc: 'Posture tension memory and single-click re-drape.',
    },
    {
      num: '03',
      title: 'Commerce SDK',
      stat: '-38%',
      desc: 'Reduction in sizing returns across luxury boutiques.',
    },
    {
      num: '04',
      title: 'Zero Retention',
      stat: '0-Storage',
      desc: 'Ephemeral RAM processing. Automated photo purge.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="atelier-specs"
      className="relative py-16 sm:py-24 bg-[#fbfbfd] border-t border-black/5 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Compact Minimal Header */}
        <div className="reveal-child flex flex-col sm:flex-row sm:items-end justify-between pb-8 mb-10 border-b border-black/5 gap-3">
          <div>
            <div className="font-subline text-[13px] text-[#86868b] font-medium mb-2">
              Specifications
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
              The Architecture.
            </h2>
          </div>
          <p className="font-subline text-[15px] sm:text-[17px] text-[#86868b] max-w-sm">
            Client-side ephemeral encryption. Zero persistent biometric storage.
          </p>
        </div>

        {/* 4 Minimal Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((spec) => (
            <SpotlightCard
              key={spec.num}
              className="reveal-child bg-white hairline-border p-6 rounded-2xl space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between font-subline text-[11px] text-[#86868b] font-medium">
                <span>Spec / {spec.num}</span>
                <span className="text-[#1d1d1f] font-semibold">{spec.title}</span>
              </div>

              <div className="font-headline text-3xl font-semibold text-[#1d1d1f]">
                {spec.stat}
              </div>

              <p className="font-subline text-[13px] text-[#86868b] leading-relaxed">
                {spec.desc}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
