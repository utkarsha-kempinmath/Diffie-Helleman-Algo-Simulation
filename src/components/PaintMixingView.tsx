import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

export const PaintMixingView: React.FC = () => {
  const [paintStep, setPaintStep] = useState<number>(1);

  // Colors
  const publicColor = { hex: '#E8C547', name: 'Common Yellow' };
  const aliceSecretColor = { hex: '#C24926', name: 'Alice Red-Orange' };
  const bobSecretColor = { hex: '#346B4A', name: 'Bob Deep Olive' };

  // Blends
  const aliceMix = { hex: '#D58737', name: 'Alice Mix (Yellow + Red-Orange)' };
  const bobMix = { hex: '#8E9860', name: 'Bob Mix (Yellow + Deep Olive)' };
  const finalShared = { hex: '#9F7449', name: 'Identical Shared Color' };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Card */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#1C1917]">
              The Paint Mixing Analogy
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              An intuitive visual metaphor: Mixing paint colors is easy, but separating them back is impossible.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPaintStep(Math.max(1, paintStep - 1))}
              disabled={paintStep === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F7F5EE] border border-[#DCD6C7] text-[#44403C] hover:bg-[#EFECE1] disabled:opacity-40"
            >
              Back
            </button>
            <span className="text-xs font-mono font-bold text-[#2A2925] px-1">
              Step {paintStep} of 4
            </span>
            <button
              onClick={() => setPaintStep(Math.min(4, paintStep + 1))}
              disabled={paintStep === 4}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2A2925] text-[#FFFFFF] hover:bg-[#1C1917] disabled:opacity-40"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Step Banner */}
        <div className="bg-[#F7F5EE] border border-[#EFECE1] rounded-xl p-3 text-xs text-[#44403C] flex items-center gap-2 mt-2">
          <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>
            {paintStep === 1 && 'Step 1: Alice and Bob start with a shared, public color (Common Yellow).'}
            {paintStep === 2 && 'Step 2: Each picks a private secret paint that never leaves their easel.'}
            {paintStep === 3 && 'Step 3: They mix their secret with Common Yellow, and swap the mixed paints.'}
            {paintStep === 4 && 'Step 4: Each adds their secret paint to the other person’s mix. Both get the exact same color!'}
          </span>
        </div>
      </div>

      {/* Visual Canvas: Alice - Public - Bob */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* Alice */}
        <div className="bg-[#FFFFFF] border border-[#F2D7CA] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F9ECE5]">
            <h3 className="text-sm font-bold text-[#1C1917]">Alice's Easel</h3>
            <span className="text-xs px-2 py-0.5 bg-[#F9ECE5] text-[#8E3A1C] rounded font-medium">Party A</span>
          </div>

          {/* Alice Secret Paint */}
          <div className="p-3 bg-[#FDF6F3] border border-[#F2D7CA] rounded-xl space-y-2">
            <span className="text-xs font-bold text-[#6C2B14] block">Alice's Secret Paint</span>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full border border-black/10 shadow-xs shrink-0"
                style={{ backgroundColor: aliceSecretColor.hex }}
              />
              <div className="text-xs">
                <div className="font-semibold text-[#1C1917]">{aliceSecretColor.name}</div>
                <div className="text-[10px] text-[#78716C]">Never shared</div>
              </div>
            </div>
          </div>

          {/* Alice Mix */}
          {paintStep >= 3 && (
            <div className="p-3 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#1C1917] block">Alice's Mixed Paint</span>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full border border-black/10 shadow-xs shrink-0"
                  style={{ backgroundColor: aliceMix.hex }}
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#1C1917]">{aliceMix.name}</div>
                  <div className="text-[10px] text-[#8E3A1C]">Sent across openly</div>
                </div>
              </div>
            </div>
          )}

          {/* Alice Final Color */}
          {paintStep === 4 && (
            <div className="p-3 bg-[#FDFCF7] border-2 border-[#CBDBCB] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#264233] block">Alice's Final Color</span>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border border-black/20 shadow-xs shrink-0"
                  style={{ backgroundColor: finalShared.hex }}
                />
                <div className="text-xs font-bold text-[#1C1917]">
                  {finalShared.name}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Public Gallery */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C7] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="text-center pb-2 border-b border-[#EFECE1]">
            <span className="text-xs font-bold font-mono text-[#2A2925]">
              THE PUBLIC CHANNEL
            </span>
          </div>

          {/* Common Public Color */}
          <div className="p-3 bg-[#F7F5EE] border border-[#EFECE1] rounded-xl space-y-2 text-center">
            <span className="text-xs font-bold text-[#1C1917] block">Common Paint</span>
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-9 h-9 rounded-full border border-black/10 shadow-xs"
                style={{ backgroundColor: publicColor.hex }}
              />
              <div className="text-xs text-left">
                <div className="font-semibold text-[#1C1917]">{publicColor.name}</div>
                <div className="text-[10px] text-[#78716C]">Public to everyone</div>
              </div>
            </div>
          </div>

          {/* Mixed Paints Swapped */}
          {paintStep >= 3 && (
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-[#FDF6F3] border border-[#F2D7CA] rounded-lg flex items-center justify-between">
                <span className="text-[#8E3A1C] font-medium flex items-center gap-1">
                  Alice sends <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: aliceMix.hex }} />
              </div>

              <div className="p-2 bg-[#F4F7F4] border border-[#CBDBCB] rounded-lg flex items-center justify-between">
                <span className="text-[#264233] font-medium flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Bob sends
                </span>
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: bobMix.hex }} />
              </div>
            </div>
          )}

          {/* Eve note */}
          <div className="p-3 bg-[#F7F5EE] rounded-xl border border-[#EFECE1] text-xs space-y-1">
            <div className="font-semibold text-[#1C1917] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Eve's Dilemma</span>
            </div>
            <p className="text-[11px] text-[#57534E] leading-relaxed">
              Eve sees the mixed colors, but in the real world you cannot separate blended paint back into base pigments!
            </p>
          </div>
        </div>

        {/* Bob */}
        <div className="bg-[#FFFFFF] border border-[#CBDBCB] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE5]">
            <h3 className="text-sm font-bold text-[#1C1917]">Bob's Easel</h3>
            <span className="text-xs px-2 py-0.5 bg-[#E5EDE5] text-[#264233] rounded font-medium">Party B</span>
          </div>

          {/* Bob Secret Paint */}
          <div className="p-3 bg-[#F4F7F4] border border-[#CBDBCB] rounded-xl space-y-2">
            <span className="text-xs font-bold text-[#1B2F24] block">Bob's Secret Paint</span>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full border border-black/10 shadow-xs shrink-0"
                style={{ backgroundColor: bobSecretColor.hex }}
              />
              <div className="text-xs">
                <div className="font-semibold text-[#1C1917]">{bobSecretColor.name}</div>
                <div className="text-[10px] text-[#78716C]">Never shared</div>
              </div>
            </div>
          </div>

          {/* Bob Mix */}
          {paintStep >= 3 && (
            <div className="p-3 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#1C1917] block">Bob's Mixed Paint</span>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full border border-black/10 shadow-xs shrink-0"
                  style={{ backgroundColor: bobMix.hex }}
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#1C1917]">{bobMix.name}</div>
                  <div className="text-[10px] text-[#264233]">Sent across openly</div>
                </div>
              </div>
            </div>
          )}

          {/* Bob Final Color */}
          {paintStep === 4 && (
            <div className="p-3 bg-[#FDFCF7] border-2 border-[#CBDBCB] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#264233] block">Bob's Final Color</span>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border border-black/20 shadow-xs shrink-0"
                  style={{ backgroundColor: finalShared.hex }}
                />
                <div className="text-xs font-bold text-[#1C1917]">
                  {finalShared.name}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
