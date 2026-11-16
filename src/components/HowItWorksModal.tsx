import React, { useState } from 'react';
import { Key, ChevronDown, ChevronRight, X, Shield, Sparkles, BookOpen } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'What is the Diffie-Hellman Key Exchange?',
      a: 'Diffie-Hellman is a method that allows two people (like Alice and Bob) to create a shared secret key over an unsecure public network (like the internet), even if an eavesdropper is listening to everything they send.',
    },
    {
      q: 'Does Diffie-Hellman encrypt messages directly?',
      a: 'No! Diffie-Hellman does not encrypt the actual messages. Instead, it creates a shared secret key. Once Alice and Bob both have this key, they use it with a symmetric cipher (like AES) to encrypt their messages.',
    },
    {
      q: 'What are the public numbers p and g?',
      a: 'p is a prime modulus and g is a base generator. Both numbers are completely public. Anyone can see them, and knowing them does not compromise the security.',
    },
    {
      q: 'Why can’t an eavesdropper (Eve) just compute the secret key?',
      a: 'This is the Discrete Logarithm Problem. Computing g^x mod p is very fast, but reversing it (finding x given g, p, and the result) is computationally hard for large numbers. In real-world cryptography (like HTTPS and TLS), p is over 600 digits long, taking longer than the age of the universe to crack.',
    },
    {
      q: 'What is a Man-in-the-Middle (MITM) attack?',
      a: 'If an attacker can actively alter data on the network (not just listen), they could pretend to be Bob to Alice, and pretend to be Alice to Bob. In the real world, this is prevented using Digital Certificates (like HTTPS SSL/TLS certificates) to verify who you are talking to.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl border border-[#DCD6C7] overflow-hidden">
        {/* Header */}
        <div className="bg-[#2A2925] text-[#FFFFFF] p-5 flex items-center justify-between border-b border-[#44403C]">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-[#EFECE1]" />
            <div>
              <h2 className="text-base font-bold font-serif text-[#FFFFFF]">
                How Diffie-Hellman Works
              </h2>
              <p className="text-xs text-[#C7C2B2]">
                Simple, intuitive concepts behind public-key cryptography
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1C1917] text-[#C7C2B2] hover:text-[#FFFFFF] flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#2A2925]">
          {/* Quick 3-point summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#FDFCF7] border border-[#E5E1D8] rounded-xl text-center space-y-1">
              <span className="font-bold text-[#1C1917] block">1. Public Start</span>
              <p className="text-[11px] text-[#78716C]">
                Everyone agrees on base numbers in plain sight.
              </p>
            </div>
            <div className="p-3 bg-[#FDFCF7] border border-[#E5E1D8] rounded-xl text-center space-y-1">
              <span className="font-bold text-[#1C1917] block">2. Secret Mix</span>
              <p className="text-[11px] text-[#78716C]">
                Each side adds their private number to make a mixed key.
              </p>
            </div>
            <div className="p-3 bg-[#FDFCF7] border border-[#E5E1D8] rounded-xl text-center space-y-1">
              <span className="font-bold text-[#1C1917] block">3. Shared Secret</span>
              <p className="text-[11px] text-[#78716C]">
                Swapping mixed keys yields the exact same secret!
              </p>
            </div>
          </div>

          {/* Simple Q&A */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#1C1917] font-serif pt-1">
              Frequently Asked Questions
            </h3>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#E5E1D8] rounded-xl overflow-hidden bg-[#FFFFFF]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-3.5 text-left font-semibold text-[#1C1917] flex items-center justify-between hover:bg-[#F7F5EE] transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="p-3.5 bg-[#FDFCF7] border-t border-[#EFECE1] text-xs text-[#57534E] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#F7F5EE] border-t border-[#EFECE1] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#2A2925] text-[#FFFFFF] hover:bg-[#1C1917] transition"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
