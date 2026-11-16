import React, { useState } from 'react';
import { BookOpen, Award, CheckCircle, HelpCircle, Shield, FileText, ChevronDown, ChevronRight, X } from 'lucide-react';

interface OralExamCheatsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OralExamCheatsheetModal: React.FC<OralExamCheatsheetModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'summary' | 'steps' | 'viva' | 'grading'>('summary');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const vivaQuestions = [
    {
      q: '1. Is Diffie-Hellman an encryption algorithm or a key exchange protocol?',
      a: 'Diffie-Hellman is NOT an encryption algorithm. It is a Key Agreement / Key Exchange Protocol. It allows two communicating parties to establish a shared secret key over an insecure channel. That shared key is subsequently used with a symmetric cipher (like AES-GCM or ChaCha20) to encrypt actual messages.',
    },
    {
      q: '2. What mathematical one-way problem guarantees the security of Diffie-Hellman?',
      a: 'The Discrete Logarithm Problem (DLP) in the multiplicative group of integers modulo p (ℤₚ*). While computing modular exponentiation Y = g^x mod p is computationally easy (O(log x) using square-and-multiply), finding the secret exponent x given {g, Y, p} is computationally infeasible for cryptographically large primes (2048+ bits).',
    },
    {
      q: '3. Why must p be prime and g be a primitive root modulo p?',
      a: 'If p is prime, the non-zero integers form a cyclic field ℤₚ* of order p - 1. If g is a primitive root, its powers g¹, g², ..., g^(p-1) mod p generate ALL p - 1 non-zero values. If g were not a primitive root, public keys would be trapped in a small subgroup, allowing Eve to solve the discrete log via subgroup confinement attacks.',
    },
    {
      q: '4. What is the biggest vulnerability of textbook Diffie-Hellman, and how is it solved?',
      a: 'Textbook Diffie-Hellman is vulnerable to Man-In-The-Middle (MITM) attacks because it lacks identity authentication. An active adversary (Eve) can intercept public keys and establish independent keys with Alice and Bob. Mitigation: Station-to-Station (STS) protocol or Public Key Infrastructure (PKI / X.509 Certificates) where public keys are signed digitally using RSA or ECDSA.',
    },
    {
      q: '5. What is the difference between Static DH and Ephemeral Diffie-Hellman (DHE)?',
      a: 'In Static DH, parties reuse fixed long-term public/private key pairs. If the private key is compromised in the future, all past sessions can be decrypted. In Ephemeral DH (DHE), fresh temporary key pairs are generated for every single session and destroyed immediately after, providing Perfect Forward Secrecy (PFS).',
    },
    {
      q: '6. What is Elliptic Curve Diffie-Hellman (ECDH)?',
      a: 'ECDH replaces modular exponentiation in ℤₚ* with scalar point multiplication on an elliptic curve over a finite field: Q = d × G. ECDH provides equivalent cryptographic strength with substantially smaller key sizes (e.g., 256-bit Curve25519 matches the security of 3072-bit RSA/DH), reducing bandwidth and CPU overhead.',
    },
    {
      q: '7. How does Shor’s Algorithm impact Diffie-Hellman in a post-quantum world?',
      a: 'Peter Shor discovered a polynomial-time quantum algorithm (Shor’s algorithm) that can compute discrete logarithms in O((log p)³) on a fault-tolerant quantum computer. Therefore, classical DH and ECDH will be broken by large quantum computers. The industry is currently migrating to Post-Quantum Cryptography (PQC), such as ML-KEM (Kyber) standardized by NIST.',
    },
    {
      q: '8. What is the computational complexity of the best known classical attack against DH?',
      a: 'The best known classical algorithm is the General Number Field Sieve (GNFS) for discrete logarithms, which runs in sub-exponential time: L_p[1/3, c] = exp((c + o(1)) (ln p)^(1/3) (ln ln p)^(2/3)). This is why modern NIST standards mandate a minimum prime size of 2048 bits (yielding 112 bits of security) or 3072 bits (128 bits of security).',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#DCD6C7] overflow-hidden">
        {/* Header */}
        <div className="bg-[#2A2925] text-[#F7F5EE] p-5 flex items-center justify-between border-b border-[#44403C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1C1917] border border-[#44403C] flex items-center justify-center">
              <Award className="w-5 h-5 text-[#EFECE1]" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-[#FFFFFF]">
                Presentation & Viva Defense Guide
              </h2>
              <p className="text-xs text-[#C7C2B2]">
                Cryptography & Information Security (CIS) Syllabus • Evaluation Date: Nov 17–18, 2026
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

        {/* Tab switcher */}
        <div className="bg-[#F7F5EE] border-b border-[#EFECE1] px-5 py-2 flex gap-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'summary', label: '1. Executive Summary' },
            { id: 'steps', label: '2. Algorithm & Math Proof' },
            { id: 'viva', label: '3. Top Viva Q&A' },
            { id: 'grading', label: '4. 20-Mark Rubric Defense' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-md transition ${
                activeSection === sec.id
                  ? 'bg-[#2A2925] text-[#FFFFFF]'
                  : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#EFECE1]'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#2A2925]">
          {/* 1. Summary */}
          {activeSection === 'summary' && (
            <div className="space-y-4">
              <div className="bg-[#FDFCF7] border border-[#DCD6C7] rounded-xl p-4 space-y-2">
                <h4 className="font-bold font-serif text-sm text-[#1C1917]">
                  The Fundamental Problem Diffie-Hellman Solves
                </h4>
                <p className="leading-relaxed text-[#44403C]">
                  Prior to 1976, two entities wishing to communicate securely had to physically meet or rely on a trusted courier to exchange a secret key before encrypting anything (the <strong>Key Distribution Problem</strong>).
                </p>
                <p className="leading-relaxed text-[#44403C]">
                  In 1976, <strong>Whitfield Diffie and Martin E. Hellman</strong> published <em>"New Directions in Cryptography"</em>, introducing the world’s first practical public-key agreement scheme based on modular arithmetic and one-way functions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-[#FDF6F3] rounded-lg border border-[#F2D7CA] space-y-1">
                  <span className="font-bold text-[#8E3A1C] text-xs">Core Security Strength</span>
                  <p className="text-[11px] text-[#44403C] leading-snug">
                    Hardness of the <strong>Discrete Logarithm Problem (DLP)</strong>: Given prime <code className="font-mono">p</code>, generator <code className="font-mono">g</code>, and public value <code className="font-mono">A = gᵃ mod p</code>, finding secret <code className="font-mono">a</code> is computationally infeasible.
                  </p>
                </div>

                <div className="p-3.5 bg-[#F4F7F4] rounded-lg border border-[#CBDBCB] space-y-1">
                  <span className="font-bold text-[#264233] text-xs">Standard Real-World Deployment</span>
                  <p className="text-[11px] text-[#44403C] leading-snug">
                    Found in <strong>TLS 1.3 (HTTPS)</strong>, <strong>SSH-2</strong>, <strong>IPsec (IKE)</strong>, and <strong>Signal Protocol</strong> (often deployed as ECDHE with Curve25519 or P-256 for Perfect Forward Secrecy).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Algorithm Steps & Proof */}
          {activeSection === 'steps' && (
            <div className="space-y-4">
              <div className="border border-[#E5E1D8] rounded-xl overflow-hidden">
                <table className="w-full text-left font-mono">
                  <thead className="bg-[#F7F5EE] text-[#1C1917] border-b border-[#EFECE1]">
                    <tr>
                      <th className="py-2.5 px-3">Step</th>
                      <th className="py-2.5 px-3">Alice</th>
                      <th className="py-2.5 px-3">Public Wire</th>
                      <th className="py-2.5 px-3">Bob</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE1]">
                    <tr className="hover:bg-[#FDFCF7]">
                      <td className="py-2 px-3 font-bold text-[#78716C]">1. Setup</td>
                      <td className="py-2 px-3">Agrees on (p, g)</td>
                      <td className="py-2 px-3 text-[#8E3A1C] font-semibold">p, g are public</td>
                      <td className="py-2 px-3">Agrees on (p, g)</td>
                    </tr>
                    <tr className="hover:bg-[#FDFCF7]">
                      <td className="py-2 px-3 font-bold text-[#78716C]">2. Secrets</td>
                      <td className="py-2 px-3 text-[#8E3A1C]">Chooses secret a</td>
                      <td className="py-2 px-3 text-[#78716C] italic">(hidden)</td>
                      <td className="py-2 px-3 text-[#264233]">Chooses secret b</td>
                    </tr>
                    <tr className="hover:bg-[#FDFCF7]">
                      <td className="py-2 px-3 font-bold text-[#78716C]">3. Public Keys</td>
                      <td className="py-2 px-3">A = gᵃ mod p</td>
                      <td className="py-2 px-3 font-semibold text-[#1C1917]">Swap A and B</td>
                      <td className="py-2 px-3">B = gᵇ mod p</td>
                    </tr>
                    <tr className="hover:bg-[#FDFCF7]">
                      <td className="py-2 px-3 font-bold text-[#78716C]">4. Shared Secret</td>
                      <td className="py-2 px-3 font-bold text-[#264233]">K_A = Bᵃ mod p</td>
                      <td className="py-2 px-3 text-[#78716C] italic">(never sent!)</td>
                      <td className="py-2 px-3 font-bold text-[#264233]">K_B = Aᵇ mod p</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#F7F5EE] rounded-xl border border-[#DCD6C7] space-y-2">
                <h5 className="font-bold text-[#1C1917] font-serif">Mathematical Proof of Equivalence:</h5>
                <div className="font-mono text-xs bg-[#FFFFFF] p-3 rounded border border-[#E5E1D8] space-y-1 text-[#2A2925]">
                  <div>K_A ≡ Bᵃ ≡ (gᵇ)ᵃ ≡ g^(b·a) (mod p)</div>
                  <div>K_B ≡ Aᵇ ≡ (gᵃ)ᵇ ≡ g^(a·b) (mod p)</div>
                  <div className="pt-1 font-bold text-[#264233]">
                    Because a · b = b · a, therefore K_A ≡ K_B ≡ g^(ab) (mod p) Q.E.D.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Viva Q&A */}
          {activeSection === 'viva' && (
            <div className="space-y-2">
              {vivaQuestions.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-[#E5E1D8] rounded-lg overflow-hidden bg-[#FFFFFF]"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-3 text-left font-semibold text-[#1C1917] flex items-center justify-between hover:bg-[#F7F5EE] transition"
                  >
                    <span>{item.q}</span>
                    {openFaq === idx ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                  </button>
                  {openFaq === idx && (
                    <div className="p-3.5 bg-[#FDFCF7] border-t border-[#EFECE1] text-xs text-[#44403C] leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 4. Grading Rubric Defense */}
          {activeSection === 'grading' && (
            <div className="space-y-3">
              <div className="bg-[#F7F5EE] border border-[#DCD6C7] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#E1DDCF] pb-2">
                  <span className="font-bold font-serif text-sm text-[#1C1917]">
                    20-Mark Evaluation Criteria Mapping
                  </span>
                  <span className="font-bold text-xs bg-[#2A2925] text-[#FFFFFF] px-2 py-0.5 rounded">
                    Total: 20 Marks
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3D6A52] shrink-0 mt-0.5" />
                    <div>
                      <strong>Mathematical Correctness (5 Marks):</strong> Accurate modular exponentiation with square-and-multiply trace, primality check, and primitive root verification.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3D6A52] shrink-0 mt-0.5" />
                    <div>
                      <strong>Interactive Visual Simulation (5 Marks):</strong> Real-time parameters, dice randomizer, hide/show secret controls, visual packet transmission on public channel.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3D6A52] shrink-0 mt-0.5" />
                    <div>
                      <strong>Security & Threat Analysis (5 Marks):</strong> Passive Eve discrete log brute-force solver demonstration + full active Man-in-the-Middle (MITM) attack & defense toggle.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3D6A52] shrink-0 mt-0.5" />
                    <div>
                      <strong>Real-world Application & Intuition (5 Marks):</strong> Paint mixing analogy and symmetric message encryption/decryption demo using the derived key.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F5EE] border-t border-[#EFECE1] flex items-center justify-between">
          <span className="text-[11px] text-[#78716C]">
            Ready for live evaluation and oral defense.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#2A2925] text-[#FFFFFF] hover:bg-[#1C1917] transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
