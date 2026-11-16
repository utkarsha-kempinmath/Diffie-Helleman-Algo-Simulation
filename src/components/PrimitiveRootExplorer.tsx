import React, { useState } from 'react';
import { checkPrimitiveRoot, findPrimitiveRoots, checkPrimality } from '../utils/cryptoMath';
import { CheckCircle2, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';

export const PrimitiveRootExplorer: React.FC = () => {
  const [testP, setTestP] = useState<number>(23);
  const [testG, setTestG] = useState<number>(5);

  const pStatus = checkPrimality(testP);
  const rootStatus = checkPrimitiveRoot(testG, testP);
  const allRoots = findPrimitiveRoots(testP, 16);

  // Group size
  const expectedCount = testP - 1;

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#2A2925] text-[#FDFCF7] text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="text-base font-bold text-[#1C1917] font-serif">
                Primitive Root / Generator Explorer (ℤ<sub className="text-xs">p</sub>*)
              </h2>
            </div>
            <p className="text-xs text-[#78716C] mt-1 max-w-3xl">
              In modular arithmetic, a number <code className="font-mono font-bold text-[#1C1917]">g</code> is a <strong>primitive root modulo p</strong> (or generator) if its successive powers <code className="font-mono">g¹, g², ..., g^(p-1) mod p</code> generate every integer from <code className="font-mono">1</code> to <code className="font-mono">p - 1</code>.
            </p>
          </div>

          <div className="shrink-0 bg-[#F7F5EE] border border-[#DCD6C7] rounded-lg p-2.5 text-xs text-[#44403C]">
            <span className="font-semibold text-[#1C1917] block">Euler's Totient Theorem:</span>
            <span>Total primitive roots = φ(p - 1)</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl p-5 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1C1917] block">
            Test Prime Modulus (p):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="3"
              max="200"
              value={testP}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 3;
                setTestP(val);
                if (testG >= val) setTestG(val - 1);
              }}
              className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#FDFCF7] border border-[#DCD6C7] rounded text-[#1C1917]"
            />
          </div>
          {!pStatus.isPrime && (
            <p className="text-xs text-[#8E3A1C]">
              ⚠️ {testP} is not prime. Primitive roots in DH require a prime modulus.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1C1917] block">
            Test Candidate Generator (g):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="2"
              max={testP - 1}
              value={testG}
              onChange={(e) => setTestG(parseInt(e.target.value, 10) || 2)}
              className="w-full px-3 py-2 text-sm font-mono font-bold bg-[#FDFCF7] border border-[#DCD6C7] rounded text-[#1C1917]"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {rootStatus.isRoot ? (
              <span className="text-[#264233] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3D6A52]" /> Valid Generator (Order = {rootStatus.order})
              </span>
            ) : (
              <span className="text-[#8E3A1C] flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-[#B04B26]" /> Not a generator (Order = {rootStatus.order} &lt; {expectedCount})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Available Primitive Roots for this Prime */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
            All Valid Primitive Roots for p = {testP}
          </h3>
          <span className="text-xs text-[#78716C] font-mono">
            Count: {allRoots.length} roots
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {allRoots.map((root) => (
            <button
              key={root}
              onClick={() => setTestG(root)}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-md border transition ${
                testG === root
                  ? 'bg-[#2A2925] text-[#FFFFFF] border-[#1C1917] shadow-sm'
                  : 'bg-[#F7F5EE] text-[#44403C] border-[#DCD6C7] hover:bg-[#EFECE1]'
              }`}
            >
              g = {root}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Powers Sequence Table */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1C1917] font-serif">
              Powers of {testG} modulo {testP}: <span className="font-mono text-xs font-normal">({testG}ᵏ mod {testP})</span>
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Notice if the cycle visits all numbers from 1 to {expectedCount}.
            </p>
          </div>

          <div className="text-xs font-mono px-3 py-1 rounded bg-[#F7F5EE] border border-[#DCD6C7]">
            Unique generated elements: <strong className="text-[#1C1917]">{new Set(rootStatus.generatedValues).size} / {expectedCount}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {rootStatus.generatedValues.map((val, idx) => {
            const power = idx + 1;
            const isOne = val === 1;

            return (
              <div
                key={power}
                className={`p-2 rounded-lg border text-center font-mono text-xs transition ${
                  isOne && power === expectedCount
                    ? 'bg-[#F4F7F4] border-[#3D6A52] text-[#264233]'
                    : isOne
                    ? 'bg-[#FDF6F3] border-[#B04B26] text-[#8E3A1C]'
                    : 'bg-[#FDFCF7] border-[#E5E1D8] text-[#1C1917]'
                }`}
              >
                <div className="text-[10px] text-[#78716C]">
                  {testG}<sup>{power}</sup> mod {testP}
                </div>
                <div className="font-bold text-sm mt-0.5">{val}</div>
              </div>
            );
          })}
        </div>

        {/* Viva Defense Explanation */}
        <div className="p-3.5 bg-[#F7F5EE] rounded-lg border border-[#DCD6C7] text-xs text-[#44403C] space-y-1.5">
          <div className="font-bold text-[#1C1917] flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#78716C]" />
            <span>Why is this crucial for Diffie-Hellman?</span>
          </div>
          <p className="text-[11px] text-[#57534E] leading-relaxed">
            If <code className="font-mono font-bold">g</code> is a primitive root, the keys <code className="font-mono">A = gᵃ mod p</code> and <code className="font-mono">B = gᵇ mod p</code> are uniformly distributed across the entire set <code className="font-mono">&#123;1, 2, ..., p - 1&#125;</code>.
            If <code className="font-mono">g</code> were NOT a primitive root, the possible public keys would be restricted to a tiny subgroup, allowing an eavesdropper to solve the discrete logarithm problem in seconds!
          </p>
        </div>
      </div>
    </div>
  );
};
