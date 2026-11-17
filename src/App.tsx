import React, { useState } from 'react';
import { Header } from './components/Header';
import { SimpleSimulator } from './components/SimpleSimulator';
import { SymmetricMessagingDemo } from './components/SymmetricMessagingDemo';
import { HowItWorksModal } from './components/HowItWorksModal';
import { modPow } from './utils/cryptoMath';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('simulator');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Core DH numbers (defaults to clean textbook numbers p=23, g=5, a=6, b=15)
  const [p, setP] = useState<number>(23);
  const [g, setG] = useState<number>(5);
  const [a, setA] = useState<number>(6);
  const [b, setB] = useState<number>(15);

  // Derived shared secret
  const B = Number(modPow(g, b, p));
  const sharedKey = Number(modPow(B, a, p));

  const handleReset = () => {
    setP(23);
    setG(5);
    setA(6);
    setB(15);
    setCurrentTab('simulator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#1F1E1B]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onReset={handleReset}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentTab === 'simulator' && (
          <SimpleSimulator
            p={p}
            setP={setP}
            g={g}
            setG={setG}
            a={a}
            setA={setA}
            b={b}
            setB={setB}
            onGoToMessaging={() => setCurrentTab('messaging')}
          />
        )}

        {currentTab === 'messaging' && <SymmetricMessagingDemo sharedKey={sharedKey} />}
      </main>

      {/* Minimal, Clean Footer */}
      <footer className="border-t border-[#E5E1D8] bg-[#FFFFFF] py-4 text-center text-xs text-[#78716C]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Diffie-Hellman Key Exchange Simulator</span>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="text-[#8E3A1C] hover:underline font-medium"
          >
            How does it work?
          </button>
        </div>
      </footer>

      {/* Explanation Modal */}
      <HowItWorksModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};

export default App;
