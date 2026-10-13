import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, X, Check, RefreshCw, Bookmark, Download } from 'lucide-react';
import { OUTFIT_PRESETS } from '../data/fashionData';

interface FittingRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export function FittingRoomModal({ isOpen, onClose, initialPrompt }: FittingRoomModalProps) {
  const [activeTab, setActiveTab] = useState<'muse' | 'upload' | 'camera'>('muse');
  const [selectedMuse, setSelectedMuse] = useState<number>(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(
    initialPrompt || OUTFIT_PRESETS[0].prompt
  );
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderStage, setRenderStage] = useState<string>('');
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [resultReady, setResultReady] = useState<boolean>(false);
  const [splitPos, setSplitPos] = useState<number>(50);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (resultReady) {
        if (e.key === 'ArrowLeft') {
          setSplitPos((prev) => Math.max(0, prev - 5));
        } else if (e.key === 'ArrowRight') {
          setSplitPos((prev) => Math.min(100, prev + 5));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, resultReady, onClose]);

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
        .then((stream) => {
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraError(null);
        })
        .catch((err) => {
          console.warn('Camera error', err);
          setCameraError('Camera access unavailable. A calibrated muse silhouette is active.');
        });
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
    }

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, activeTab]);

  const handleStartTryOn = () => {
    setIsRendering(true);
    setResultReady(false);
    setRenderProgress(0);
    setIsSaved(false);

    const stages = [
      { progress: 25, stage: 'Calculating skeletal posture...' },
      { progress: 55, stage: 'Synthesizing fabric tension & grain...' },
      { progress: 85, stage: 'Matching ambient room lux...' },
      { progress: 100, stage: 'Photorealistic try-on resolved.' },
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < stages.length) {
        setRenderProgress(stages[current].progress);
        setRenderStage(stages[current].stage);
        current++;
      } else {
        clearInterval(interval);
        setIsRendering(false);
        setResultReady(true);
      }
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleDownloadLookbookCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 1600);

    ctx.strokeStyle = '#0a0a0f';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, 1080, 1480);

    ctx.fillStyle = '#0a0a0f';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LOOKBOOK ATELIER', 600, 180);

    ctx.fillStyle = '#ff7711';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('4K NEURAL TRY-ON PHOTOREALISTIC RESOLVE', 600, 225);

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(400, 360, 400, 680);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('Resolved Try-On', 600, 720);

    ctx.fillStyle = '#f4f5f8';
    ctx.fillRect(150, 1180, 900, 180);

    ctx.fillStyle = '#ff7711';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('PROMPT SYNTAX:', 190, 1230);

    ctx.fillStyle = '#111218';
    ctx.font = '20px sans-serif';
    ctx.fillText(`"${prompt.slice(0, 70)}..."`, 190, 1280);

    const link = document.createElement('a');
    link.download = `LOOKBOOK_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Atelier Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5">
          <div className="flex items-center gap-3">
            <span className="font-headline text-[15px] tracking-tight text-[#1d1d1f] font-semibold">
              Fitting Room
            </span>
            <span className="hidden sm:inline-block font-subline text-[13px] text-[#86868b]">
              3.0s Neural Resolve Esc to close
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#6b6e82] hover:text-[#0a0a0f] transition-colors cursor-pointer"
            aria-label="Close fitting room"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Visual Viewport */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div className="relative aspect-[3/4] bg-[#f5f6fa] rounded-xl overflow-hidden flex items-center justify-center select-none shadow-inner border border-black/[0.06]">
              {/* Rendering State */}
              {isRendering && (
                <div className="absolute inset-0 bg-white/95 z-30 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-2 border-black/5 border-t-[#1d1d1f] animate-spin" />
                  <div className="space-y-1">
                    <div className="font-headline text-[13px] font-medium text-[#1d1d1f]">
                      Synthesizing Drape ({renderProgress}%)
                    </div>
                    <div className="font-subline text-[13px] text-[#86868b]">
                      {renderStage}
                    </div>
                  </div>
                  <div className="w-44 h-1 bg-black/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#1d1d1f] transition-all duration-300"
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Resolved Split Slider */}
              {resultReady ? (
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-[#e8ebf2] flex flex-col items-center justify-center p-6">
                    <div className="w-32 h-52 bg-[#d2d6e2] rounded-t-xl flex flex-col items-center justify-center text-center">
                      <span className="font-subline text-[11px] font-medium text-[#444654]">Baseline Subject</span>
                    </div>
                  </div>

                  <div 
                    className="absolute inset-0 bg-[#1d1d1f] text-white flex flex-col items-center justify-center p-6 overflow-hidden border-r-2 border-white/20"
                    style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
                  >
                    <div className="w-36 h-56 bg-black/30 rounded-t-xl border-t border-white/20 shadow-2xl flex flex-col items-center justify-between p-4">
                      <div className="w-6 h-6 border-r border-b border-white/40 -rotate-45" />
                      <span className="font-subline text-[11px] text-white/80 font-medium">
                        Lookbook Drape 4K
                      </span>
                    </div>
                  </div>

                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
                    style={{ left: `${splitPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border border-black/10 flex items-center justify-center text-[10px] text-[#1d1d1f] shadow-lg font-medium">
                      &harr;
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={splitPos}
                    onChange={(e) => setSplitPos(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    aria-label="Before after split"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  {activeTab === 'muse' && (
                    <div className="space-y-4">
                      <div className="w-32 h-52 mx-auto bg-[#1d1d1f] text-white rounded-t-xl border-t border-white/20 flex flex-col items-center justify-center p-4">
                        <span className="font-subline text-[11px] text-white font-medium">
                          Muse 0{selectedMuse}
                        </span>
                        <span className="font-subline text-[11px] text-white/50 mt-1">
                          Calibrated Silhouette
                        </span>
                      </div>
                      <p className="font-subline text-[13px] text-[#86868b]">
                        Ready to apply neural drape to Muse 0{selectedMuse}.
                      </p>
                    </div>
                  )}

                  {activeTab === 'upload' && (
                    <div>
                      {uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt="Uploaded photograph"
                          className="max-h-56 mx-auto rounded-lg border border-black/10"
                        />
                      ) : (
                        <label className="flex flex-col items-center justify-center p-8 border border-dashed border-black/20 rounded-2xl hover:bg-[#fbfbfd] hover:border-black/30 cursor-pointer transition-colors">
                          <Upload className="w-8 h-8 text-[#1d1d1f] mb-3" />
                          <span className="font-headline text-[13px] font-medium text-[#1d1d1f]">Select Photo</span>
                          <span className="font-subline text-[11px] text-[#86868b] mt-1">JPEG, PNG up to 25MB</span>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                      )}
                    </div>
                  )}

                  {activeTab === 'camera' && (
                    <div className="w-full">
                      {cameraError ? (
                        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-lg">
                          {cameraError}
                        </div>
                      ) : (
                        <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Tab Selector */}
              <div>
                <label className="font-subline text-[11px] text-[#86868b] font-medium block mb-2">
                  01. Ingestion Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setActiveTab('muse')}
                    className={`py-2 px-3 text-[13px] font-subline rounded-full transition-all cursor-pointer font-medium ${
                      activeTab === 'muse'
                        ? 'bg-[#1d1d1f] text-white shadow-sm'
                        : 'bg-[#fbfbfd] text-[#86868b] hover:text-[#1d1d1f] border border-black/5'
                    }`}
                  >
                    Muses
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`py-2 px-3 text-[13px] font-subline rounded-full transition-all cursor-pointer font-medium ${
                      activeTab === 'upload'
                        ? 'bg-[#1d1d1f] text-white shadow-sm'
                        : 'bg-[#fbfbfd] text-[#86868b] hover:text-[#1d1d1f] border border-black/5'
                    }`}
                  >
                    Upload
                  </button>
                  <button
                    onClick={() => setActiveTab('camera')}
                    className={`py-2 px-3 text-[13px] font-subline rounded-full transition-all cursor-pointer font-medium ${
                      activeTab === 'camera'
                        ? 'bg-[#1d1d1f] text-white shadow-sm'
                        : 'bg-[#fbfbfd] text-[#86868b] hover:text-[#1d1d1f] border border-black/5'
                    }`}
                  >
                    Camera
                  </button>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="font-subline text-[11px] text-[#86868b] font-medium block">
                  02. Describe Outfit
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. double-breasted melton wool coat in charcoal noir with white shirting"
                  className="w-full p-4 bg-[#fbfbfd] border border-black/5 rounded-2xl text-[13px] sm:text-[15px] text-[#1d1d1f] focus:outline-none focus:border-black/20 transition-colors leading-relaxed font-subline"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2">
                {OUTFIT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPrompt(p.prompt)}
                    className="text-[11px] font-subline px-3 py-1.5 bg-[#fbfbfd] hover:bg-[#f5f5f7] border border-black/5 text-[#1d1d1f] rounded-full transition-colors cursor-pointer font-medium"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="space-y-3 pt-4 border-t border-black/5">
              <button
                onClick={handleStartTryOn}
                disabled={isRendering}
                className="w-full py-3.5 px-6 bg-[#1d1d1f] hover:bg-[#000000] text-white text-[15px] font-subline font-medium rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
              >
                {isRendering ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Virtual Try-On</span>
                  </>
                )}
              </button>

              {resultReady && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsSaved(true)}
                    className="flex-1 py-3 bg-[#fbfbfd] border border-black/5 hover:bg-[#f5f5f7] text-[13px] font-subline text-[#1d1d1f] rounded-full font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isSaved ? <Check className="w-4 h-4 text-[#1d1d1f]" /> : <Bookmark className="w-4 h-4" />}
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={handleDownloadLookbookCard}
                    className="py-3 px-6 bg-[#fbfbfd] border border-black/5 hover:bg-[#f5f5f7] text-[13px] font-subline text-[#1d1d1f] rounded-full font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Card</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
