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
  HelpCircle,
  ShieldCheck,
  Send,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { modPow, checkPrimality, checkPrimitiveRoot } from '../utils/cryptoMath';

interface SimpleSimulatorProps {
  p: number;
  setP: (val: number) => void;
  g: number;
  setG: (val: number) => void;
  a: number;
  setA: (val: number) => void;
  b: number;
  setB: (val: number) => void;
  onGoToMessaging: () => void;
}

export const SimpleSimulator: React.FC<SimpleSimulatorProps> = ({
  p,
  setP,
  g,
  setG,
  a,
  setA,
  b,
  setB,
  onGoToMessaging,
}) => {
  const [step, setStep] = useState<number>(1);
  const [showAliceSecret, setShowAliceSecret] = useState<boolean>(true);
  const [showBobSecret, setShowBobSecret] = useState<boolean>(true);

  // Computed public keys
  const A = Number(modPow(g, a, p));
  const B = Number(modPow(g, b, p));

  // Computed shared secrets
  const KA = Number(modPow(B, a, p));
  const KB = Number(modPow(A, b, p));
  const keysMatch = KA === KB;

  // Trigger celebration on step 4
  useEffect(() => {
    if (step === 4 && keysMatch) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#C85A32', '#3D6A52', '#D97706', '#2A2925'],
        });
      } catch (e) {
        // fallback
      }
    }
  }, [step, keysMatch]);

  const randomizeAliceSecret = () => {
    const randomA = Math.floor(Math.random() * (p - 3)) + 2;
    setA(randomA);
  };

  const randomizeBobSecret = () => {
    const randomB = Math.floor(Math.random() * (p - 3)) + 2;
    setB(randomB);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 4-Step Progress Bar */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl p-3 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { num: 1, title: 'Public Numbers', desc: 'Pick p & g' },
            { num: 2, title: 'Private Secrets', desc: 'Alice & Bob choose' },
            { num: 3, title: 'Swap Public Keys', desc: 'Exchange over wire' },
            { num: 4, title: 'Shared Secret', desc: 'Both get identical key' },
          ].map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition ${
                  isActive
                    ? 'bg-[#2A2925] text-[#FFFFFF] shadow-xs'
                    : isDone
                    ? 'bg-[#F4F7F4] text-[#264233] hover:bg-[#E5EDE5]'
                    : 'text-[#78716C] hover:bg-[#F7F5EE]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#2A2925]'
                      : isDone
                      ? 'bg-[#3D6A52] text-[#FFFFFF]'
                      : 'bg-[#EFECE1] text-[#78716C]'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight truncate">{s.title}</div>
                  <div
                    className={`text-[10px] leading-snug truncate ${
                      isActive ? 'text-[#DCD6C7]' : 'text-[#A49F8F]'
                    }`}
                  >
                    {s.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= STEP 1: PUBLIC NUMBERS ================= */}
      {step === 1 && (
        <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#8E3A1C] uppercase tracking-wider">
              Step 1 of 4
            </span>
            <h2 className="text-xl font-bold font-serif text-[#1C1917]">
              Agree on Public Numbers (p and g)
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Alice and Bob want to establish a secret key, but they are far apart and communicating over an open, untrusted network. They begin by openly agreeing on two public numbers: a <strong>prime modulus (p)</strong> and a <strong>base generator (g)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prime p card */}
            <div className="p-4 bg-[#FDFCF7] border border-[#DCD6C7] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C1917]">Prime Modulus (p)</span>
                <span className="text-xs font-mono text-[#3D6A52] font-semibold">Prime Number</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-extrabold text-[#2A2925]">{p}</span>
                <span className="text-xs text-[#78716C]">
                  Sets the boundary for all arithmetic (all calculations wrap around modulo {p}).
                </span>
              </div>
            </div>

            {/* Generator g card */}
            <div className="p-4 bg-[#FDFCF7] border border-[#DCD6C7] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C1917]">Base Generator (g)</span>
                <span className="text-xs font-mono text-[#3D6A52] font-semibold">Primitive Root</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-extrabold text-[#2A2925]">{g}</span>
                <span className="text-xs text-[#78716C]">
                  The base number whose powers generate numbers modulo {p}.
                </span>
              </div>
            </div>
          </div>

          {/* Quick preset selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F7F5EE] rounded-xl border border-[#EFECE1] text-xs">
            <span className="text-[#57534E]">
              💡 <strong>Anyone can see these:</strong> Eavesdroppers on the network know p={p} and g={g}, and that's completely safe.
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#78716C]">Try numbers:</span>
              <button
                onClick={() => { setP(23); setG(5); setA(6); setB(15); }}
                className={`px-2 py-1 rounded font-mono font-medium border text-xs ${
                  p === 23 ? 'bg-[#2A2925] text-white border-[#2A2925]' : 'bg-white text-[#44403C] border-[#DCD6C7]'
                }`}
              >
                p=23, g=5
              </button>
              <button
                onClick={() => { setP(17); setG(3); setA(5); setB(7); }}
                className={`px-2 py-1 rounded font-mono font-medium border text-xs ${
                  p === 17 ? 'bg-[#2A2925] text-white border-[#2A2925]' : 'bg-white text-[#44403C] border-[#DCD6C7]'
                }`}
              >
                p=17, g=3
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#2A2925] text-[#FFFFFF] hover:bg-[#1C1917] transition flex items-center gap-2 shadow-xs"
            >
              Next: Pick Private Secrets <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: PRIVATE SECRETS ================= */}
      {step === 2 && (
        <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#8E3A1C] uppercase tracking-wider">
              Step 2 of 4
            </span>
            <h2 className="text-xl font-bold font-serif text-[#1C1917]">
              Alice and Bob Pick Their Secret Numbers
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Now, each person privately chooses a secret number. These numbers are <strong>NEVER sent across the network</strong>. They stay completely private on their local devices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Alice's Secret Card */}
            <div className="p-5 bg-[#FDF6F3] border border-[#F2D7CA] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#F9ECE5] text-[#8E3A1C] font-bold text-xs flex items-center justify-center font-serif">
                    A
                  </div>
                  <span className="font-bold text-sm text-[#1C1917]">Alice's Secret (a)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowAliceSecret(!showAliceSecret)}
                    className="p-1 text-[#8E3A1C] hover:bg-[#F2D7CA] rounded"
                    title={showAliceSecret ? 'Hide secret' : 'Show secret'}
                  >
                    {showAliceSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={randomizeAliceSecret}
                    className="p-1 text-[#8E3A1C] hover:bg-[#F2D7CA] rounded flex items-center gap-0.5 text-xs font-medium"
                    title="Roll new random secret"
                  >
                    <Dices className="w-3.5 h-3.5" /> Roll
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type={showAliceSecret ? 'number' : 'password'}
                  min="2"
                  max={p - 1}
                  value={a}
                  onChange={(e) => setA(parseInt(e.target.value, 10) || 2)}
                  className="w-24 px-3 py-1.5 font-mono text-2xl font-bold bg-[#FFFFFF] border border-[#F2D7CA] rounded-lg text-[#8E3A1C] text-center"
                />
                <span className="text-xs text-[#8E3A1C] font-medium leading-snug">
                  Only Alice knows this number.
                </span>
              </div>
            </div>

            {/* Bob's Secret Card */}
            <div className="p-5 bg-[#F4F7F4] border border-[#CBDBCB] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E5EDE5] text-[#264233] font-bold text-xs flex items-center justify-center font-serif">
                    B
                  </div>
                  <span className="font-bold text-sm text-[#1C1917]">Bob's Secret (b)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowBobSecret(!showBobSecret)}
                    className="p-1 text-[#264233] hover:bg-[#CBDBCB] rounded"
                    title={showBobSecret ? 'Hide secret' : 'Show secret'}
                  >
                    {showBobSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={randomizeBobSecret}
                    className="p-1 text-[#264233] hover:bg-[#CBDBCB] rounded flex items-center gap-0.5 text-xs font-medium"
                    title="Roll new random secret"
                  >
                    <Dices className="w-3.5 h-3.5" /> Roll
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type={showBobSecret ? 'number' : 'password'}
                  min="2"
                  max={p - 1}
                  value={b}
                  onChange={(e) => setB(parseInt(e.target.value, 10) || 2)}
                  className="w-24 px-3 py-1.5 font-mono text-2xl font-bold bg-[#FFFFFF] border border-[#CBDBCB] rounded-lg text-[#264233] text-center"
                />
                <span className="text-xs text-[#264233] font-medium leading-snug">
                  Only Bob knows this number.
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F7F5EE] border border-[#DCD6C7] text-[#44403C] hover:bg-[#EFECE1] transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#2A2925] text-[#FFFFFF] hover:bg-[#1C1917] transition flex items-center gap-2 shadow-xs"
            >
              Next: Calculate & Swap Public Keys <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: SWAP PUBLIC KEYS ================= */}
      {step === 3 && (
        <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#8E3A1C] uppercase tracking-wider">
              Step 3 of 4
            </span>
            <h2 className="text-xl font-bold font-serif text-[#1C1917]">
              Calculate & Swap Public Keys Across the Wire
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Alice takes base <code className="font-mono font-bold">{g}</code> to the power of her secret <code className="font-mono font-bold">{a}</code>, and Bob takes <code className="font-mono font-bold">{g}</code> to the power of his secret <code className="font-mono font-bold">{b}</code>. They send the results across the network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Alice Public Key Calculation */}
            <div className="p-4 bg-[#FDF6F3] border border-[#F2D7CA] rounded-xl space-y-2 text-center">
              <span className="text-xs font-bold text-[#8E3A1C] block">Alice Calculates A</span>
              <div className="font-mono text-xs text-[#57534E]">
                A = g<sup>a</sup> mod p
              </div>
              <div className="font-mono text-xs text-[#57534E]">
                A = {g}<sup>{a}</sup> mod {p}
              </div>
              <div className="text-2xl font-mono font-bold text-[#8E3A1C] bg-[#FFFFFF] py-1 px-3 rounded-lg border border-[#F2D7CA] inline-block">
                A = {A}
              </div>
              <div className="text-[11px] text-[#8E3A1C] font-medium pt-1">
                Alice sends {A} to Bob →
              </div>
            </div>

            {/* Center: The Insecure Wire & Eavesdropper */}
            <div className="p-4 bg-[#F7F5EE] border border-[#DCD6C7] rounded-xl space-y-3 text-center">
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-[#2A2925] text-white">
                THE PUBLIC WIRE
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-[#8E3A1C] flex items-center justify-center gap-1 font-semibold">
                  A = {A} (Alice → Bob)
                </div>
                <div className="text-[#264233] flex items-center justify-center gap-1 font-semibold">
                  B = {B} (Bob → Alice)
                </div>
              </div>
              <div className="p-2.5 bg-[#FFFFFF] rounded-lg border border-[#E5E1D8] text-[11px] text-[#57534E] text-left">
                <strong>Eve (Eavesdropper) sees:</strong>
                <br />
                p={p}, g={g}, A={A}, B={B}.
                <br />
                <span className="text-[#78716C] text-[10px]">
                  She cannot easily find secret <strong>a</strong> or <strong>b</strong> (Discrete Log Problem).
                </span>
              </div>
            </div>

            {/* Bob Public Key Calculation */}
            <div className="p-4 bg-[#F4F7F4] border border-[#CBDBCB] rounded-xl space-y-2 text-center">
              <span className="text-xs font-bold text-[#264233] block">Bob Calculates B</span>
              <div className="font-mono text-xs text-[#57534E]">
                B = g<sup>b</sup> mod p
              </div>
              <div className="font-mono text-xs text-[#57534E]">
                B = {g}<sup>{b}</sup> mod {p}
              </div>
              <div className="text-2xl font-mono font-bold text-[#264233] bg-[#FFFFFF] py-1 px-3 rounded-lg border border-[#CBDBCB] inline-block">
                B = {B}
              </div>
              <div className="text-[11px] text-[#264233] font-medium pt-1">
                ← Bob sends {B} to Alice
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F7F5EE] border border-[#DCD6C7] text-[#44403C] hover:bg-[#EFECE1] transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#2A2925] text-[#FFFFFF] hover:bg-[#1C1917] transition flex items-center gap-2 shadow-xs"
            >
              Next: Calculate Shared Secret <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: SHARED SECRET ================= */}
      {step === 4 && (
        <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#3D6A52] uppercase tracking-wider">
              Step 4 of 4 (Final Step)
            </span>
            <h2 className="text-xl font-bold font-serif text-[#1C1917]">
              The Secret Key is Created!
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Alice takes Bob's public key (<code className="font-mono font-bold">{B}</code>) and raises it to her secret (<code className="font-mono font-bold">{a}</code>). Bob takes Alice's public key (<code className="font-mono font-bold">{A}</code>) and raises it to his secret (<code className="font-mono font-bold">{b}</code>).
            </p>
          </div>

          {/* Side by side calculations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#FDF6F3] border border-[#F2D7CA] rounded-xl space-y-1">
              <span className="text-xs font-bold text-[#8E3A1C] block">Alice's Calculation:</span>
              <div className="font-mono text-xs text-[#57534E]">
                Key = B<sup>a</sup> mod p
              </div>
              <div className="font-mono text-xs text-[#57534E]">
                Key = {B}<sup>{a}</sup> mod {p} = <strong className="text-[#8E3A1C] text-sm">{KA}</strong>
              </div>
            </div>

            <div className="p-4 bg-[#F4F7F4] border border-[#CBDBCB] rounded-xl space-y-1">
              <span className="text-xs font-bold text-[#264233] block">Bob's Calculation:</span>
              <div className="font-mono text-xs text-[#57534E]">
                Key = A<sup>b</sup> mod p
              </div>
              <div className="font-mono text-xs text-[#57534E]">
                Key = {A}<sup>{b}</sup> mod {p} = <strong className="text-[#264233] text-sm">{KB}</strong>
              </div>
            </div>
          </div>

          {/* Celebratory Shared Key Result */}
          <div className="p-6 bg-[#FDFCF7] border-2 border-[#3D6A52] rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#3D6A52] text-white flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#3D6A52] uppercase tracking-wider block">
                Agreed Secret Key
              </span>
              <span className="font-mono text-4xl font-extrabold text-[#1C1917] my-1 inline-block">
                {KA}
              </span>
            </div>
            <p className="text-xs text-[#57534E] max-w-lg mx-auto leading-relaxed">
              Both Alice and Bob arrived at the exact same number (<strong>{KA}</strong>) without ever sharing their secrets (<code className="font-mono">a={a}</code>, <code className="font-mono">b={b}</code>) over the wire!
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F7F5EE] border border-[#DCD6C7] text-[#44403C] hover:bg-[#EFECE1] transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={onGoToMessaging}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#2A2925] text-[#FFFFFF] hover:bg-[#1C1917] transition flex items-center gap-2 shadow-xs"
            >
              Try Sending a Secret Message <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
