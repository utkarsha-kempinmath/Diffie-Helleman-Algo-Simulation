import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { modPow, encryptMessage, decryptMessage } from '../utils/cryptoMath';

export const MitmAttackView: React.FC = () => {
  const p = 23;
  const g = 5;

  const [a] = useState<number>(6);
  const [b] = useState<number>(15);
  const [e1] = useState<number>(4);
  const [e2] = useState<number>(7);

  const [useAuthentication, setUseAuthentication] = useState<boolean>(false);
  const [aliceMessage, setAliceMessage] = useState<string>('Transfer $100 to Bob');

  // Keys
  const A = Number(modPow(g, a, p));
  const B = Number(modPow(g, b, p));
  const E1 = Number(modPow(g, e1, p));
  const E2 = Number(modPow(g, e2, p));

  const keyAliceEve = Number(modPow(E2, a, p));
  const keyBobEve = Number(modPow(E1, b, p));
  const keyEveAlice = Number(modPow(A, e2, p));
  const keyEveBob = Number(modPow(B, e1, p));
  const keyGenuine = Number(modPow(B, a, p));

  // Cipher flow
  const aliceCipher = encryptMessage(aliceMessage, useAuthentication ? keyGenuine : keyAliceEve);
  const eveReadMessage = useAuthentication ? 'Blocked by digital certificate!' : aliceMessage;
  const bobReceived = useAuthentication ? aliceMessage : 'Transfer $999 to Eve (tampered!)';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#1C1917]">
              Man-in-the-Middle (MITM) Attack
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              Why simple Diffie-Hellman needs authentication (like HTTPS certificates).
            </p>
          </div>

          <button
            onClick={() => setUseAuthentication(!useAuthentication)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs ${
              useAuthentication
                ? 'bg-[#264233] text-white'
                : 'bg-[#B04B26] text-white'
            }`}
          >
            {useAuthentication ? (
              <>
                <ShieldCheck className="w-4 h-4" /> Certificates ON (Protected)
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" /> No Authentication (Vulnerable)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Interception */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* Alice */}
        <div className="bg-[#FFFFFF] border border-[#F2D7CA] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F9ECE5]">
            <h3 className="text-sm font-bold text-[#1C1917]">Alice</h3>
            <span className="text-xs text-[#8E3A1C] font-mono">Secret a = 6</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#6C2B14] block">Alice sends:</span>
            <input
              type="text"
              value={aliceMessage}
              onChange={(e) => setAliceMessage(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#FDF6F3] border border-[#F2D7CA] rounded-lg text-xs font-sans text-[#1C1917]"
            />
          </div>

          <div className="p-2.5 bg-[#F7F5EE] rounded-xl text-[11px] text-[#57534E]">
            {useAuthentication ? (
              <span className="text-[#264233] font-semibold">
                ✓ Verified Bob's certificate directly.
              </span>
            ) : (
              <span className="text-[#8E3A1C]">
                ⚠️ Unknowingly chatting with Eve!
              </span>
            )}
          </div>
        </div>

        {/* Eve in the middle */}
        <div className="bg-[#2A2925] text-white border border-[#44403C] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#44403C]">
            <span className="text-xs font-bold text-[#FDE68A] flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Eve (In the Middle)
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#44403C]">
              {useAuthentication ? 'BLOCKED' : 'INTERCEPTING'}
            </span>
          </div>

          {useAuthentication ? (
            <p className="text-xs text-[#CBDBCB] leading-relaxed pt-2">
              Eve is blocked! She cannot forge valid digital certificates or signatures.
            </p>
          ) : (
            <div className="space-y-2 text-xs">
              <p className="text-[#E1DDCF] leading-snug">
                Eve intercepts Alice and Bob's keys, secretly creating two separate keys:
              </p>
              <div className="p-2 bg-[#1C1917] rounded-lg font-mono text-[11px] text-[#FDE68A]">
                Eve reads message: <br />
                <span className="text-white font-bold">{eveReadMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bob */}
        <div className="bg-[#FFFFFF] border border-[#CBDBCB] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE5]">
            <h3 className="text-sm font-bold text-[#1C1917]">Bob</h3>
            <span className="text-xs text-[#264233] font-mono">Secret b = 15</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#1B2F24] block">Bob receives:</span>
            <div className="p-2.5 bg-[#F4F7F4] border border-[#CBDBCB] rounded-lg text-xs font-mono font-bold text-[#1B2F24]">
              {bobReceived}
            </div>
          </div>

          <div className="p-2.5 bg-[#F7F5EE] rounded-xl text-[11px] text-[#57534E]">
            {useAuthentication ? (
              <span className="text-[#264233] font-semibold">
                ✓ Received Alice's true message.
              </span>
            ) : (
              <span className="text-[#8E3A1C]">
                ⚠️ Received Eve's tampered message!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
