import { lazy, Suspense, useState } from 'react';
import { Navigation } from './components/Navigation';
import { HeroDressingScene } from './components/HeroDressingScene';
import { AzentosPhilosophySection } from './components/AzentosPhilosophySection';
import { TheResultSection } from './components/TheResultSection';
import { TheFittingSection } from './components/TheFittingSection';
import { LiveMirrorSection } from './components/LiveMirrorSection';
import { TheAtelierSection } from './components/TheAtelierSection';
import { TheLookbookSection } from './components/TheLookbookSection';
import { FinalCTA } from './components/FinalCTA';
import { FittingRoomModal } from './components/FittingRoomModal';
import { ScrollProgress } from './components/ScrollProgress';

// three.js is most of the JS payload, so the 3D scene loads in its own chunk and the page
// can render without waiting for it.
const GlobalShirtScene = lazy(() =>
  import('./components/GlobalShirtScene').then((m) => ({ default: m.GlobalShirtScene }))
);

export default function App() {
  const [fittingRoomOpen, setFittingRoomOpen] = useState(false);
  const [fittingRoomPrompt, setFittingRoomPrompt] = useState<string | undefined>(undefined);

  const handleOpenFittingRoom = (promptOverride?: string) => {
    if (promptOverride) {
      setFittingRoomPrompt(promptOverride);
    }
    setFittingRoomOpen(true);
  };

  const handleCloseFittingRoom = () => {
    setFittingRoomOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f9] text-[#111218] selection:bg-[#ff7711]/20 selection:text-[#0a0a0f] relative font-subline">
      {/* Scroll-Craft Dynamic Timeline Progress Indicator */}
      <ScrollProgress />

      {/* Floating Segmented Top Navigation */}
      <Navigation onOpenFittingRoom={() => handleOpenFittingRoom()} />

      <Suspense fallback={null}>
        <GlobalShirtScene />
      </Suspense>

      {/* Main Editorial Flow */}
      <main>
        {/* Hero: PixelVault / Zenrixa 3D Model with Glowing Amber Visor on White Studio Canvas */}
        <HeroDressingScene onOpenFittingRoom={() => handleOpenFittingRoom()} />

        {/* Philosophy & Bento Showcase (Azentos / PixelVault Signature Statement) */}
        <AzentosPhilosophySection />

        {/* 1. The Result: Speed / Performance (Oversized 03s Typographic Moment) */}
        <TheResultSection />

        {/* 2. The Fitting: Photo Try-On (Continuous Scene & Resolving Figure) */}
        <TheFittingSection onOpenFittingRoom={() => handleOpenFittingRoom()} />

        {/* 3. Live: Camera Try-On (Intimate Mirror Moment) */}
        <LiveMirrorSection onOpenFittingRoom={() => handleOpenFittingRoom()} />

        {/* 4. The Atelier: Capabilities & Technical Spec-Sheet */}
        <TheAtelierSection />

        {/* 5. The Lookbook: Curated Asymmetric Editorial Spread */}
        <TheLookbookSection onSelectPromptForTryOn={(prompt) => handleOpenFittingRoom(prompt)} />
      </main>

      {/* 6. Final CTA & Minimal Footer */}
      <FinalCTA onOpenFittingRoom={() => handleOpenFittingRoom()} />

      {/* Interactive Digital Fitting Room Modal */}
      <FittingRoomModal
        isOpen={fittingRoomOpen}
        onClose={handleCloseFittingRoom}
        initialPrompt={fittingRoomPrompt}
      />
    </div>
  );
}
