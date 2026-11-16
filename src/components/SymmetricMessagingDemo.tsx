import React, { useState } from 'react';
import { Lock, Unlock, Send, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { encryptMessage, decryptMessage } from '../utils/cryptoMath';

interface SymmetricMessagingDemoProps {
  sharedKey: number;
}

export const SymmetricMessagingDemo: React.FC<SymmetricMessagingDemoProps> = ({ sharedKey }) => {
  const [plainText, setPlainText] = useState<string>('Hello Bob! Our shared key works.');

  // Encryption using negotiated key
  const encryptionResult = encryptMessage(plainText, sharedKey);

  // Bob's decryption using negotiated key
  const bobDecrypted = decryptMessage(encryptionResult.cipherHex, sharedKey);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Card */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#1C1917]">
              Try Secret Messaging
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              Now that Alice and Bob agreed on the secret key (<strong className="font-mono text-[#1C1917]">{sharedKey}</strong>), see how they use it to send encrypted messages.
            </p>
          </div>

          <div className="bg-[#F4F7F4] border border-[#CBDBCB] rounded-xl px-3.5 py-2 text-xs text-[#264233] flex items-center gap-2 shrink-0">
            <Key className="w-4 h-4 text-[#3D6A52]" />
            <div>
              <span className="text-[10px] text-[#3D6A52] font-semibold block uppercase">Shared Key</span>
              <span className="font-mono font-bold text-sm">Key = {sharedKey}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Columns: Alice Types -> Scrambled on Network -> Bob Decrypts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* 1. Alice Sends */}
        <div className="bg-[#FFFFFF] border border-[#F2D7CA] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F9ECE5]">
            <h3 className="text-sm font-bold text-[#1C1917]">1. Alice Sends</h3>
            <span className="text-xs font-mono px-2 py-0.5 bg-[#F9ECE5] text-[#8E3A1C] rounded">
              Key = {sharedKey}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#6C2B14] block">
              Type a secret message:
            </label>
            <textarea
              rows={3}
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              className="w-full p-2.5 text-xs font-sans bg-[#FDF6F3] border border-[#F2D7CA] rounded-xl text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#8E3A1C]"
              placeholder="Type message here..."
            />
          </div>
          <p className="text-[11px] text-[#78716C] leading-snug">
            Alice's device scrambles the text using Key = {sharedKey}.
          </p>
        </div>

        {/* 2. On the Wire */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C7] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="text-center pb-2 border-b border-[#EFECE1]">
            <span className="text-xs font-bold font-mono text-[#2A2925]">
              2. On the Public Wire
            </span>
          </div>

          <div className="p-3 bg-[#F7F5EE] border border-[#EFECE1] rounded-xl space-y-2">
            <span className="text-[11px] font-semibold text-[#78716C] block">
              Scrambled Ciphertext (Hex):
            </span>
            <div className="font-mono text-xs break-all bg-[#FFFFFF] p-2.5 rounded-lg border border-[#DCD6C7] text-[#1C1917]">
              {encryptionResult.cipherHex || '(empty)'}
            </div>
          </div>
          <p className="text-[11px] text-[#57534E] leading-snug">
            Anyone listening on the network only sees this random scramble of numbers.
          </p>
        </div>

        {/* 3. Bob Receives */}
        <div className="bg-[#FFFFFF] border border-[#CBDBCB] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5EDE5]">
            <h3 className="text-sm font-bold text-[#1C1917]">3. Bob Receives</h3>
            <span className="text-xs font-mono px-2 py-0.5 bg-[#E5EDE5] text-[#264233] rounded">
              Key = {sharedKey}
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#1B2F24] block">
              Decrypted Message:
            </span>
            <div className="p-3 bg-[#F4F7F4] border border-[#CBDBCB] rounded-xl text-xs font-sans text-[#1B2F24] font-medium min-h-[4.5rem] flex items-center">
              {bobDecrypted}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#264233] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#3D6A52]" />
            <span>Decrypted perfectly!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
