import React from 'react';
import { Key, RotateCcw, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onReset: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onReset,
  onOpenGuide,
}) => {
  return (
    <header className="bg-[#FFFFFF] border-b border-[#E5E1D8] shadow-xs sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
        {/* Top Row: Clean Brand & Simple Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2A2925] text-[#F7F5EE] flex items-center justify-center font-bold shadow-xs">
              <Key className="w-4 h-4 text-[#EFECE1]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1C1917] tracking-tight font-serif">
                Diffie-Hellman Key Exchange
              </h1>
              <p className="text-xs text-[#78716C] hidden sm:block">
                How two people agree on a secret key over an open network
              </p>
            </div>
          </div>

          {/* Actions: Guide & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#44403C] bg-[#F7F5EE] hover:bg-[#EFECE1] border border-[#DCD6C7] transition"
              title="Learn how Diffie-Hellman works"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#78716C]" />
              <span className="hidden sm:inline">How it works</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:text-[#1C1917] hover:bg-[#F7F5EE] transition border border-transparent hover:border-[#DCD6C7]"
              title="Reset simulation to beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Clean 2-Mode Switcher Tabs */}
        <nav className="flex space-x-2 mt-3 pt-2.5 border-t border-[#F1EDE4] text-xs sm:text-sm font-medium">
          {[
            { id: 'simulator', label: '1. Step-by-Step Simulator' },
            { id: 'messaging', label: '2. Try Secret Messaging' },
          ].map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-3 py-1.5 rounded-md transition text-xs sm:text-sm ${
                  isActive
                    ? 'bg-[#2A2925] text-[#FDFCF7] font-semibold shadow-xs'
                    : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#F7F5EE]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
