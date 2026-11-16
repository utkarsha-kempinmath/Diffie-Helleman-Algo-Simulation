import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Dices,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Terminal,
  Cpu,
  Calculator,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  checkPrimality,
  checkPrimitiveRoot,
  findPrimitiveRoots,
  modPow,
  solveDiscreteLog,
  traceModPow,
  ModPowTraceStep,
} from '../utils/cryptoMath';

interface MathSimulationViewProps {
  currentStep: number;
  setStep: (s: number) => void;
  p: number;
  setP: (val: number) => void;
  g: number;
  setG: (val: number) => void;
  a: number;
  setA: (val: number) => void;
  b: number;
  setB: (val: number) => void;
}

export const MathSimulationView: React.FC<MathSimulationViewProps> = ({
  currentStep,
  setStep,
  p,
  setP,
  g,
  setG,
  a,
  setA,
  b,
  setB,
}) => {
  // Visibility toggles for private keys
  const [showAliceSecret, setShowAliceSecret] = useState<boolean>(true);
  const [showBobSecret, setShowBobSecret] = useState<boolean>(true);

  // Trace modal state
  const [traceModalData, setTraceModalData] = useState<{
    title: string;
    formula: string;
    result: number;
    steps: ModPowTraceStep[];
  } | null>(null);

  // Eve brute-force state
  const [eveCracking, setEveCracking] = useState<boolean>(false);
  const [eveResult, setEveResult] = useState<{
    found: boolean;
    secret?: number;
    iterations: number;
    searchTimeMs: number;
  } | null>(null);

  // Validation checks
  const pValidation = checkPrimality(p);
  const gValidation = checkPrimitiveRoot(g, p);
  const recommendedRoots = findPrimitiveRoots(p, 8);

  // Computations
  // Public keys: A = g^a mod p, B = g^b mod p
  const A = Number(modPow(g, a, p));
  const B = Number(modPow(g, b, p));

  // Shared secret keys: K_A = B^a mod p, K_B = A^b mod p
  const KA = Number(modPow(B, a, p));
  const KB = Number(modPow(A, b, p));
  const keysMatch = KA === KB && pValidation.isPrime && gValidation.isRoot;

  // Trigger confetti when reaching step 4 with matching keys
  useEffect(() => {
    if (currentStep === 4 && keysMatch) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#C85A32', '#3D6A52', '#D97706', '#2A2925'],
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, [currentStep, keysMatch]);

  // Randomize helper
  const randomizeAliceSecret = () => {
    const randomA = Math.floor(Math.random() * (p - 3)) + 2;
    setA(randomA);
  };

  const randomizeBobSecret = () => {
    const randomB = Math.floor(Math.random() * (p - 3)) + 2;
    setB(randomB);
  };

  const handleEveAttack = () => {
    setEveCracking(true);
    setEveResult(null);
    setTimeout(() => {
      const res = solveDiscreteLog(g, A, p);
      setEveResult(res);
      setEveCracking(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* 1. PUBLIC PARAMETERS CONTROL PANEL (p, g) */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#EFECE1]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#2A2925] text-[#FDFCF7] text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-base font-bold text-[#1C1917] font-serif">
                Public Domain Parameters (Agreed Openly)
              </h2>
            </div>
            <p className="text-xs text-[#78716C] mt-0.5">
              Alice and Bob openly agree on a large prime modulus (<code className="font-mono font-semibold text-[#1C1917]">p</code>) and a generator (<code className="font-mono font-semibold text-[#1C1917]">g</code>) belonging to the multiplicative group <span className="font-serif italic font-semibold">ℤ</span><sub className="font-sans text-[10px]">p</sub>*.
            </p>
          </div>

          <div className="text-xs text-[#78716C] flex items-center gap-1.5 bg-[#F7F5EE] px-2.5 py-1.5 rounded-md border border-[#EFECE1]">
            <HelpCircle className="w-3.5 h-3.5 text-[#A49F8F]" />
            <span>Public channel: Insecure and visible to everyone</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {/* Prime p input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#2A2925] flex items-center gap-1">
                <span>Prime Modulus (p):</span>
              </label>
              {pValidation.isPrime ? (
                <span className="text-[11px] font-semibold text-[#264233] flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-[#3D6A52]" /> Prime
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-[#8E3A1C] flex items-center gap-0.5">
                  <AlertTriangle className="w-3 h-3 text-[#B04B26]" /> Composite
                </span>
              )}
            </div>
            <input
              type="number"
              min="5"
              max="9999"
              value={p}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 5;
                setP(val);
                if (a >= val) setA(val - 2);
                if (b >= val) setB(val - 2);
              }}
              className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#FDFCF7] border border-[#DCD6C7] rounded-md text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2A2925]"
            />
            {!pValidation.isPrime && (
              <p className="text-[11px] text-[#8E3A1C]">
                {p} is divisible by {pValidation.factor}. Diffie-Hellman requires a prime number.
              </p>
            )}
          </div>

          {/* Generator g input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#2A2925] flex items-center gap-1">
                <span>Generator / Primitive Root (g):</span>
              </label>
              {gValidation.isRoot ? (
                <span className="text-[11px] font-semibold text-[#264233] flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-[#3D6A52]" /> Valid Root
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-[#B45309] flex items-center gap-0.5">
                  <AlertTriangle className="w-3 h-3 text-[#B45309]" /> Subgroup
                </span>
              )}
            </div>
            <input
              type="number"
              min="2"
              max={p - 1}
              value={g}
              onChange={(e) => setG(parseInt(e.target.value, 10) || 2)}
              className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#FDFCF7] border border-[#DCD6C7] rounded-md text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#2A2925]"
            />
            {!gValidation.isRoot && (
              <p className="text-[11px] text-[#92400E] leading-tight">
                {gValidation.explanation}
              </p>
            )}
          </div>

          {/* Recommended Primitive Roots selector */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-[#2A2925]">
              Valid Primitive Roots for p = {p}:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto p-1 bg-[#F7F5EE] rounded-md border border-[#EFECE1]">
              {recommendedRoots.length > 0 ? (
                recommendedRoots.map((root) => (
                  <button
                    key={root}
                    onClick={() => setG(root)}
                    className={`px-2 py-0.5 text-xs font-mono font-semibold rounded border transition ${
                      g === root
                        ? 'bg-[#2A2925] text-[#FFFFFF] border-[#1C1917]'
                        : 'bg-[#FFFFFF] text-[#44403C] border-[#DCD6C7] hover:bg-[#EFECE1]'
                    }`}
                  >
                    g = {root}
                  </button>
                ))
              ) : (
                <span className="text-xs text-[#78716C] p-1">
                  Enter a valid prime to compute primitive roots.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE THREE-PARTY MAIN STAGE: ALICE | PUBLIC CHANNEL & EVE | BOB */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= ALICE'S STATION (Cols 1-4) ================= */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#F2D7CA] rounded-xl p-5 shadow-sm space-y-5 relative">
          <div className="flex items-center justify-between pb-3 border-b border-[#F9ECE5]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F9ECE5] text-[#8E3A1C] border border-[#F2D7CA] flex items-center justify-center font-bold text-sm font-serif">
                A
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C1917] font-serif">Alice's Node</h3>
                <span className="text-[10px] font-semibold text-[#8E3A1C] uppercase tracking-wider">
                  Private & Secure Domain
                </span>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 bg-[#F9ECE5] text-[#8E3A1C] rounded border border-[#F2D7CA] font-medium">
              Party A
            </span>
          </div>

          {/* Alice's Private Key (a) */}
          <div className="bg-[#FDF6F3] border border-[#F2D7CA] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6C2B14] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#8E3A1C]" /> Alice's Private Secret (a)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowAliceSecret(!showAliceSecret)}
                  className="text-xs text-[#8E3A1C] hover:text-[#4D1E0E] p-1 rounded"
                  title={showAliceSecret ? 'Hide secret' : 'Show secret'}
                >
                  {showAliceSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={randomizeAliceSecret}
                  className="text-xs text-[#8E3A1C] hover:bg-[#F2D7CA] p-1 rounded transition flex items-center gap-0.5"
                  title="Randomize secret key"
                >
                  <Dices className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type={showAliceSecret ? 'number' : 'password'}
                min="2"
                max={p - 1}
                value={a}
                onChange={(e) => setA(parseInt(e.target.value, 10) || 2)}
                className="w-full px-3 py-1.5 font-mono text-sm font-bold bg-[#FFFFFF] border border-[#F2D7CA] rounded text-[#4D1E0E] focus:outline-none focus:ring-1 focus:ring-[#8E3A1C]"
              />
            </div>
            <p className="text-[10px] text-[#8E3A1C] leading-snug">
              Kept strictly confidential. Never transmitted over the network!
            </p>
          </div>

          {/* Step 3: Alice Computes Public Key A */}
          <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-lg p-3.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C1917] flex items-center gap-1">
                <span>1. Compute Public Key (A)</span>
              </span>
              <button
                onClick={() => {
                  const trace = traceModPow(g, a, p);
                  setTraceModalData({
                    title: "Alice's Public Key Calculation",
                    formula: `A = g^a mod p = ${g}^${a} mod ${p}`,
                    result: trace.result,
                    steps: trace.steps,
                  });
                }}
                className="text-[11px] text-[#8E3A1C] hover:underline flex items-center gap-0.5"
              >
                <Calculator className="w-3 h-3" /> Trace Steps
              </button>
            </div>

            <div className="p-2.5 bg-[#F7F5EE] rounded font-mono text-xs text-[#1C1917] border border-[#EFECE1] space-y-1">
              <div className="text-[#78716C] text-[11px]">Formula: A = g^a mod p</div>
              <div className="font-semibold text-sm">
                A = {g}<sup>{a}</sup> mod {p} = <span className="font-bold text-[#8E3A1C] bg-[#F9ECE5] px-1.5 py-0.5 rounded border border-[#F2D7CA]">{A}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#78716C]">Transmission status:</span>
              <span className="text-xs font-semibold text-[#8E3A1C] flex items-center gap-1">
                Send A = {A} <Send className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Step 4: Alice Computes Shared Secret Key K */}
          <div className="bg-[#FFFFFF] border-2 border-[#CBDBCB] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#264233] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#3D6A52]" />
                <span>2. Compute Shared Secret (K_A)</span>
              </span>
              <button
                onClick={() => {
                  const trace = traceModPow(B, a, p);
                  setTraceModalData({
                    title: "Alice's Shared Secret Calculation",
                    formula: `K_A = B^a mod p = ${B}^${a} mod ${p}`,
                    result: trace.result,
                    steps: trace.steps,
                  });
                }}
                className="text-[11px] text-[#3D6A52] hover:underline flex items-center gap-0.5"
              >
                <Calculator className="w-3 h-3" /> Trace Steps
              </button>
            </div>

            <div className="p-2.5 bg-[#F4F7F4] rounded font-mono text-xs text-[#264233] border border-[#CBDBCB] space-y-1">
              <div className="text-[#3D6A52] text-[11px]">Formula: K_A = B^a mod p = (g^b)^a mod p</div>
              <div className="font-semibold text-sm">
                K_A = {B}<sup>{a}</sup> mod {p} = <span className="font-bold text-base text-[#1B2F24] bg-[#CBDBCB] px-2 py-0.5 rounded">{KA}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PUBLIC CHANNEL & PASSIVE EVE (Cols 5-8) ================= */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#DCD6C7] rounded-xl p-4 shadow-sm space-y-4">
          {/* Header of Public Channel */}
          <div className="text-center pb-2 border-b border-[#EFECE1]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A2925] text-[#FDFCF7] text-xs font-bold font-mono">
              <Terminal className="w-3.5 h-3.5 text-[#E1DDCF]" />
              THE INSECURE PUBLIC CHANNEL
            </div>
            <p className="text-[11px] text-[#78716C] mt-1">
              Network cables, Wi-Fi radio, Internet routers. Anyone can sniff packets here!
            </p>
          </div>

          {/* Data Packets Moving Across Channel */}
          <div className="space-y-2 font-mono text-xs">
            <div className="p-2 bg-[#F7F5EE] border border-[#EFECE1] rounded-md flex items-center justify-between">
              <span className="text-[#78716C]">Public Modulus:</span>
              <span className="font-bold text-[#1C1917] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#DCD6C7]">
                p = {p}
              </span>
            </div>

            <div className="p-2 bg-[#F7F5EE] border border-[#EFECE1] rounded-md flex items-center justify-between">
              <span className="text-[#78716C]">Public Generator:</span>
              <span className="font-bold text-[#1C1917] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#DCD6C7]">
                g = {g}
              </span>
            </div>

            <div className="p-2 bg-[#FDF6F3] border border-[#F2D7CA] rounded-md flex items-center justify-between">
              <span className="text-[#8E3A1C] font-semibold flex items-center gap-1">
                Alice's Public Key <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-[#8E3A1C] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#F2D7CA]">
                A = {A}
              </span>
            </div>

            <div className="p-2 bg-[#F4F7F4] border border-[#CBDBCB] rounded-md flex items-center justify-between">
              <span className="text-[#264233] font-semibold flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Bob's Public Key
              </span>
              <span className="font-bold text-[#264233] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#CBDBCB]">
                B = {B}
              </span>
            </div>
          </div>

          {/* Eve's Eavesdropper Terminal */}
          <div className="bg-[#2A2925] text-[#F7F5EE] rounded-lg p-3.5 space-y-3 border border-[#1C1917]">
            <div className="flex items-center justify-between border-b border-[#44403C] pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FDFCF7]">
                <Cpu className="w-4 h-4 text-[#D97706]" />
                <span>Eve's Wiretap Console</span>
              </div>
              <span className="text-[10px] font-mono bg-[#44403C] text-[#EFECE1] px-1.5 py-0.5 rounded">
                Passive Sniffer
              </span>
            </div>

            <div className="text-[11px] font-mono space-y-1 text-[#E1DDCF]">
              <div>&gt; Captured: p={p}, g={g}, A={A}, B={B}</div>
              <div className="text-[#F2D7CA]">&gt; Missing Secrets: a = ???, b = ???</div>
              <div className="text-[#DCD6C7]">&gt; Goal: Solve g^a ≡ {A} (mod {p}) for a</div>
            </div>

            {/* Attack Button */}
            <div className="pt-1">
              <button
                onClick={handleEveAttack}
                disabled={eveCracking}
                className="w-full py-1.5 px-3 rounded text-xs font-semibold bg-[#B45309] hover:bg-[#92400E] text-[#FFFFFF] transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                {eveCracking ? 'Brute-forcing discrete log...' : 'Run Eve Discrete Log Attack'}
              </button>
            </div>

            {/* Eve Result display */}
            {eveResult && (
              <div className="p-2.5 rounded bg-[#1C1917] border border-[#44403C] text-[11px] font-mono space-y-1">
                {eveResult.found ? (
                  <>
                    <div className="text-[#FDE68A] font-bold">
                      ✓ Cracked! Found Alice's secret a = {eveResult.secret}
                    </div>
                    <div className="text-[#A49F8F]">
                      Searched {eveResult.iterations} values in {eveResult.searchTimeMs} ms.
                    </div>
                    <div className="text-[10px] text-[#CBDBCB] leading-tight pt-1">
                      ⚠️ Note: For small prime {p}, brute force is trivial. In real cryptography, p is 2048 to 4096 bits (600+ digits), requiring ~2¹¹² operations—impossible to crack in trillions of years!
                    </div>
                  </>
                ) : (
                  <div className="text-[#F2D7CA]">
                    Could not find secret within search limit ({eveResult.iterations} ops).
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= BOB'S STATION (Cols 9-12) ================= */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#CBDBCB] rounded-xl p-5 shadow-sm space-y-5 relative">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EDE5]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#E5EDE5] text-[#264233] border border-[#CBDBCB] flex items-center justify-center font-bold text-sm font-serif">
                B
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C1917] font-serif">Bob's Node</h3>
                <span className="text-[10px] font-semibold text-[#3D6A52] uppercase tracking-wider">
                  Private & Secure Domain
                </span>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 bg-[#E5EDE5] text-[#264233] rounded border border-[#CBDBCB] font-medium">
              Party B
            </span>
          </div>

          {/* Bob's Private Key (b) */}
          <div className="bg-[#F4F7F4] border border-[#CBDBCB] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1B2F24] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#3D6A52]" /> Bob's Private Secret (b)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowBobSecret(!showBobSecret)}
                  className="text-xs text-[#264233] hover:text-[#122018] p-1 rounded"
                  title={showBobSecret ? 'Hide secret' : 'Show secret'}
                >
                  {showBobSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={randomizeBobSecret}
                  className="text-xs text-[#264233] hover:bg-[#CBDBCB] p-1 rounded transition flex items-center gap-0.5"
                  title="Randomize secret key"
                >
                  <Dices className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type={showBobSecret ? 'number' : 'password'}
                min="2"
                max={p - 1}
                value={b}
                onChange={(e) => setB(parseInt(e.target.value, 10) || 2)}
                className="w-full px-3 py-1.5 font-mono text-sm font-bold bg-[#FFFFFF] border border-[#CBDBCB] rounded text-[#1B2F24] focus:outline-none focus:ring-1 focus:ring-[#3D6A52]"
              />
            </div>
            <p className="text-[10px] text-[#3D6A52] leading-snug">
              Kept strictly confidential. Never transmitted over the network!
            </p>
          </div>

          {/* Step 3: Bob Computes Public Key B */}
          <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-lg p-3.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C1917] flex items-center gap-1">
                <span>1. Compute Public Key (B)</span>
              </span>
              <button
                onClick={() => {
                  const trace = traceModPow(g, b, p);
                  setTraceModalData({
                    title: "Bob's Public Key Calculation",
                    formula: `B = g^b mod p = ${g}^${b} mod ${p}`,
                    result: trace.result,
                    steps: trace.steps,
                  });
                }}
                className="text-[11px] text-[#3D6A52] hover:underline flex items-center gap-0.5"
              >
                <Calculator className="w-3 h-3" /> Trace Steps
              </button>
            </div>

            <div className="p-2.5 bg-[#F7F5EE] rounded font-mono text-xs text-[#1C1917] border border-[#EFECE1] space-y-1">
              <div className="text-[#78716C] text-[11px]">Formula: B = g^b mod p</div>
              <div className="font-semibold text-sm">
                B = {g}<sup>{b}</sup> mod {p} = <span className="font-bold text-[#264233] bg-[#E5EDE5] px-1.5 py-0.5 rounded border border-[#CBDBCB]">{B}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#78716C]">Transmission status:</span>
              <span className="text-xs font-semibold text-[#264233] flex items-center gap-1">
                <Send className="w-3 h-3" /> Send B = {B}
              </span>
            </div>
          </div>

          {/* Step 4: Bob Computes Shared Secret Key K */}
          <div className="bg-[#FFFFFF] border-2 border-[#CBDBCB] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#264233] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#3D6A52]" />
                <span>2. Compute Shared Secret (K_B)</span>
              </span>
              <button
                onClick={() => {
                  const trace = traceModPow(A, b, p);
                  setTraceModalData({
                    title: "Bob's Shared Secret Calculation",
                    formula: `K_B = A^b mod p = ${A}^${b} mod ${p}`,
                    result: trace.result,
                    steps: trace.steps,
                  });
                }}
                className="text-[11px] text-[#3D6A52] hover:underline flex items-center gap-0.5"
              >
                <Calculator className="w-3 h-3" /> Trace Steps
              </button>
            </div>

            <div className="p-2.5 bg-[#F4F7F4] rounded font-mono text-xs text-[#264233] border border-[#CBDBCB] space-y-1">
              <div className="text-[#3D6A52] text-[11px]">Formula: K_B = A^b mod p = (g^a)^b mod p</div>
              <div className="font-semibold text-sm">
                K_B = {A}<sup>{b}</sup> mod {p} = <span className="font-bold text-base text-[#1B2F24] bg-[#CBDBCB] px-2 py-0.5 rounded">{KB}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. VERIFICATION BANNER & MATHEMATICAL PROOF */}
      <div
        className={`rounded-xl p-5 border transition-all ${
          keysMatch
            ? 'bg-[#FDFCF7] border-[#3D6A52] shadow-sm'
            : 'bg-[#FFFBEB] border-[#D97706]'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                keysMatch ? 'bg-[#3D6A52] text-[#FFFFFF]' : 'bg-[#D97706] text-[#FFFFFF]'
              }`}
            >
              {keysMatch ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1C1917] font-serif">
                  {keysMatch
                    ? 'Cryptographic Key Agreement Established (K_A = K_B)'
                    : 'Parameters Incomplete or Non-matching'}
                </h3>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#EFECE1] text-[#2A2925] border border-[#DCD6C7]">
                  Shared Secret: K = {keysMatch ? KA : '?'}
                </span>
              </div>
              <p className="text-xs text-[#57534E] mt-1 max-w-3xl leading-relaxed">
                Both Alice and Bob independently reached the exact same shared key{' '}
                <strong className="text-[#1C1917] font-mono">{KA}</strong> without ever transmitting their private secrets (<code className="font-mono">a={a}</code>, <code className="font-mono">b={b}</code>) over the wire!
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep(5)}
            className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold bg-[#2A2925] text-[#FFFFFF] hover:bg-[#1C1917] transition shadow-sm flex items-center gap-1.5"
          >
            Test Message Encryption with Key {KA} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mathematical Equivalence Breakdown */}
        <div className="mt-4 pt-4 border-t border-[#EFECE1] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-[#FFFFFF] p-3 rounded border border-[#E5E1D8]">
            <span className="text-[#78716C] font-sans block mb-1 font-semibold">Alice's Derivation:</span>
            <div className="text-[#8E3A1C] font-semibold">
              K_A = B^a mod p = (g^b)^a mod p = g^(ba) mod p = <span className="font-bold">{KA}</span>
            </div>
          </div>
          <div className="bg-[#FFFFFF] p-3 rounded border border-[#E5E1D8]">
            <span className="text-[#78716C] font-sans block mb-1 font-semibold">Bob's Derivation:</span>
            <div className="text-[#264233] font-semibold">
              K_B = A^b mod p = (g^a)^b mod p = g^(ab) mod p = <span className="font-bold">{KB}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL: STEP-BY-STEP MODULAR EXPONENTIATION TRACE */}
      {traceModalData && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-xl border border-[#DCD6C7]">
            <div className="p-4 border-b border-[#EFECE1] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1C1917] font-serif">
                  {traceModalData.title}
                </h3>
                <p className="text-xs text-[#78716C] font-mono mt-0.5">
                  {traceModalData.formula}
                </p>
              </div>
              <button
                onClick={() => setTraceModalData(null)}
                className="w-7 h-7 rounded-full bg-[#F7F5EE] text-[#78716C] hover:text-[#1C1917] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              <p className="text-xs text-[#57534E]">
                Computers use the <strong>Square-and-Multiply Algorithm</strong> to compute modular exponentiation in <code className="font-mono">O(log exp)</code> operations instead of multiplying the number directly (which causes massive integer overflow):
              </p>

              <div className="border border-[#E5E1D8] rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-[#F7F5EE] text-[#44403C] border-b border-[#EFECE1]">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Operation</th>
                      <th className="py-2 px-3">Math Expression</th>
                      <th className="py-2 px-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE1]">
                    {traceModalData.steps.map((st) => (
                      <tr key={st.step} className="hover:bg-[#FDFCF7]">
                        <td className="py-1.5 px-3 text-[#78716C]">{st.step}</td>
                        <td className="py-1.5 px-3 font-semibold text-[#1C1917]">{st.operation}</td>
                        <td className="py-1.5 px-3 text-[#57534E] text-[11px]">{st.currentExp}</td>
                        <td className="py-1.5 px-3 text-right font-bold text-[#2A2925]">{st.currentValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-2.5 bg-[#F7F5EE] rounded text-xs font-mono font-bold text-[#1C1917] text-right">
                Final Result ≡ {traceModalData.result} (mod {p})
              </div>
            </div>

            <div className="p-3 border-t border-[#EFECE1] text-right">
              <button
                onClick={() => setTraceModalData(null)}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-[#2A2925] text-[#FFFFFF] hover:bg-[#1C1917]"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
