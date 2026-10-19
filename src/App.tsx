import { lazy, Suspense } from 'react';
import { Navigation } from './components/Navigation';
import { HeroDressingScene } from './components/HeroDressingScene';
import { AzentosPhilosophySection } from './components/AzentosPhilosophySection';
import { TheResultSection } from './components/TheResultSection';
import { FinalCTA } from './components/FinalCTA';
import { ScrollProgress } from './components/ScrollProgress';

// three.js is most of the JS payload, so the 3D scene loads in its own chunk and the page
// can render without waiting for it.
const GlobalShirtScene = lazy(() =>
  import('./components/GlobalShirtScene').then((m) => ({ default: m.GlobalShirtScene }))
);

// The live try-on lives on the shop page.
const goToShop = () => window.location.assign('/try-on/');

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f6f9] text-[#111218] selection:bg-[#ff7711]/20 selection:text-[#0a0a0f] relative font-subline">
      {/* Scroll-Craft Dynamic Timeline Progress Indicator */}
      <ScrollProgress />

      {/* Floating Segmented Top Navigation */}
      <Navigation onTryOn={goToShop} />

      <Suspense fallback={null}>
        <GlobalShirtScene />
      </Suspense>

      {/* Main Editorial Flow */}
      <main>
        {/* Hero: the 3D shirt centre stage */}
        <HeroDressingScene />

        {/* Philosophy: shirt parked on the left, copy scrolls on the right */}
        <AzentosPhilosophySection />

        {/* The Result: shirt on the right, copy on the left */}
        <TheResultSection />
      </main>

      {/* Closing try-on CTA & minimal footer; slides up over the 3D shirt */}
      <FinalCTA />
    </div>
  );
}
