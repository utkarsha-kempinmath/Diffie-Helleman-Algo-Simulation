import React from 'react';
import { Play, Pause, ChevronRight, ChevronLeft, CheckCircle2, RotateCcw } from 'lucide-react';

export interface StepItem {
  id: number;
  title: string;
  subtitle: string;
}

export const STEPS: StepItem[] = [
  { id: 1, title: 'Public Parameters', subtitle: 'Agree on prime p & generator g' },
  { id: 2, title: 'Private Secrets', subtitle: 'Alice picks a, Bob picks b' },
  { id: 3, title: 'Public Keys', subtitle: 'Compute & exchange A and B' },
  { id: 4, title: 'Shared Secret', subtitle: 'Compute identical K = g^(ab) mod p' },
  { id: 5, title: 'Secure Channel', subtitle: 'Encrypt data using key K' },
];

interface StepperProps {
  currentStep: number;
  setStep: (step: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onReset: () => void;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  setStep,
  isPlaying,
  setIsPlaying,
  onReset,
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl p-4 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Step Indicator Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 flex-grow">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setStep(step.id)}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg text-left transition border ${
                  isCurrent
                    ? 'bg-[#F7F5EE] border-[#2A2925] text-[#1C1917] shadow-sm ring-1 ring-[#2A2925]'
                    : isCompleted
                    ? 'bg-[#FFFFFF] border-[#CBDBCB] text-[#264233] hover:bg-[#F4F7F4]'
                    : 'bg-[#FFFFFF] border-[#EFECE1] text-[#78716C] hover:bg-[#FDFCF7]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isCurrent
                      ? 'bg-[#2A2925] text-[#FFFFFF]'
                      : isCompleted
                      ? 'bg-[#315542] text-[#FFFFFF]'
                      : 'bg-[#EFECE1] text-[#78716C]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight truncate">
                    {step.title}
                  </div>
                  <div className="text-[10px] text-[#78716C] leading-snug line-clamp-1">
                    {step.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Stepper Controls: Prev, Next, Auto-Play */}
        <div className="flex items-center justify-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#EFECE1]">
          <button
            onClick={() => setStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#F7F5EE] border border-[#DCD6C7] text-[#44403C] hover:bg-[#EFECE1] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Prev
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition border ${
              isPlaying
                ? 'bg-[#B04B26] text-[#FFFFFF] border-[#8E3A1C]'
                : 'bg-[#2A2925] text-[#FFFFFF] border-[#1C1917] hover:bg-[#1C1917]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Auto
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Auto Walkthrough
              </>
            )}
          </button>

          <button
            onClick={() => setStep(Math.min(5, currentStep + 1))}
            disabled={currentStep === 5}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#2A2925] text-[#FFFFFF] hover:bg-[#1C1917] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition shadow-sm"
          >
            Next Step
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
