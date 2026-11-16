# Diffie-Hellman Key Exchange Interactive Simulator
**Course:** Cryptography and Information Security (CIS)  
**Evaluation Dates:** 17th & 18th November 2026  
**Total Marks:** 20  
**Technology Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons  

---

## 🌟 Overview
This interactive educational simulator demonstrates the complete mechanics, mathematical foundations, practical applications, and security vulnerabilities of the **Diffie-Hellman Key Exchange Algorithm (1976)**.

Designed with an academic editorial palette (warm parchment, charcoal, terracotta, and forest olive), free of futuristic AI blue or neon tropes, making it clean, legible, and directly tailored for high-scoring university presentations and viva evaluations.

---

## 🚀 Quick Start Instructions

The application is currently running at:
```
http://localhost:3000/
```

To run manually at any time:
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start the development server
npm run dev
```

---

## 📚 Simulator Modules

### 1. Mathematical Simulator (`MathSimulationView.tsx`)
- **Public Domain Parameters**: Live validation of prime modulus $p$ and primitive root $g \pmod p$, with one-click selector for valid generators.
- **Alice & Bob Nodes**: Secret exponent controls ($a, b$), dice randomizer, hide/show toggles, public key generation ($A = g^a \pmod p, B = g^b \pmod p$).
- **Square-and-Multiply Trace Modal**: Step-by-step arithmetic breakdown showing how computers compute large modular powers without integer overflow.
- **Public Wire & Passive Eve Sniffer**: Visual packet transmission showing what travels on the wire vs. what remains strictly secret. Includes a live **Discrete Logarithm Problem (DLP) brute-force solver** to illustrate why large primes (2048+ bits) are computationally intractable.
- **Shared Secret Equivalence**: Proof banner verifying $K_A \equiv K_B \equiv g^{ab} \pmod p$.

### 2. The Color Mixing Analogy (`PaintMixingView.tsx`)
- 4-stage interactive walkthrough using physical paint blending.
- Demonstrates how one-way functions behave: mixing yellow with secret colors is easy, but separating the mixture back into base pigments is physically impossible.

### 3. Man-In-The-Middle (MITM) Attack Simulator (`MitmAttackView.tsx`)
- Demonstrates the fundamental limitation of textbook Diffie-Hellman: **lack of authentication**.
- Live interception where Eve establishes independent keys ($K_{AE}, K_{EB}$) with Alice and Bob.
- Live message tampering demonstration with toggleable **Digital Signatures / PKI Authentication** defense.

### 4. Generator & Powers Explorer (`PrimitiveRootExplorer.tsx`)
- Interactive power table visualizer $g^1, g^2, \dots, g^{p-1} \pmod p$ over cyclic group $\mathbb{Z}_p^*$.
- Demonstrates why $g$ must generate all $p-1$ elements to prevent small-subgroup confinement attacks.

### 5. Symmetric Session Key Messaging (`SymmetricMessagingDemo.tsx`)
- Shows *why* Diffie-Hellman matters in the real world (TLS, SSH, Signal).
- Plaintext is encrypted into ciphertext hex using keystream generated from the shared key $K$. Shows cleartext decryption at Bob's station and unintelligible noise if an attacker uses the wrong key.

### 6. Presentation & Viva Defense Guide (`OralExamCheatsheetModal.tsx`)
- Quick-access modal containing top 8 viva oral examination questions with answers, 20-mark evaluation rubric breakdown, and historical context (*"New Directions in Cryptography"* by Diffie & Hellman, 1976).
