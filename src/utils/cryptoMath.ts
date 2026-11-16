/**
 * Cryptographic & Number Theory Utilities for Diffie-Hellman Key Exchange
 */

// Greatest Common Divisor
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Primality test with factors info
export function checkPrimality(n: number): { isPrime: boolean; factor?: number } {
  if (n <= 1) return { isPrime: false };
  if (n <= 3) return { isPrime: true };
  if (n % 2 === 0) return { isPrime: false, factor: 2 };
  if (n % 3 === 0) return { isPrime: false, factor: 3 };

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0) return { isPrime: false, factor: i };
    if (n % (i + 2) === 0) return { isPrime: false, factor: i + 2 };
  }
  return { isPrime: true };
}

// Modular exponentiation (base^exp % mod) using BigInt to prevent 64-bit integer overflow
export function modPow(base: number | bigint, exp: number | bigint, mod: number | bigint): bigint {
  let b = BigInt(base);
  let e = BigInt(exp);
  const m = BigInt(mod);

  if (m === 1n) return 0n;
  let result = 1n;
  b = b % m;

  while (e > 0n) {
    if (e % 2n === 1n) {
      result = (result * b) % m;
    }
    e = e / 2n;
    b = (b * b) % m;
  }
  return result;
}

// Modular exponentiation with human-readable calculation step breakdown
export interface ModPowTraceStep {
  step: number;
  binaryBit: number;
  currentExp: string;
  operation: string;
  currentValue: number;
}

export function traceModPow(base: number, exp: number, mod: number): {
  result: number;
  binaryExp: string;
  steps: ModPowTraceStep[];
} {
  const binaryExp = exp.toString(2);
  const steps: ModPowTraceStep[] = [];
  let result = 1n;
  let currentBase = BigInt(base) % BigInt(mod);
  const m = BigInt(mod);

  // Square and multiply algorithm step-by-step
  for (let i = 0; i < binaryExp.length; i++) {
    const bit = parseInt(binaryExp[i], 10);
    // Square
    if (i > 0) {
      const prevResult = result;
      result = (result * result) % m;
      steps.push({
        step: steps.length + 1,
        binaryBit: bit,
        currentExp: `Square previous result: (${prevResult}²) mod ${mod}`,
        operation: 'Square',
        currentValue: Number(result),
      });
    }

    // Multiply if bit is 1
    if (bit === 1) {
      const prevResult = result;
      result = (result * currentBase) % m;
      steps.push({
        step: steps.length + 1,
        binaryBit: bit,
        currentExp: `Multiply by base ${base}: (${prevResult} × ${base}) mod ${mod}`,
        operation: 'Multiply',
        currentValue: Number(result),
      });
    }
  }

  return {
    result: Number(result),
    binaryExp,
    steps,
  };
}

// Check if g is a primitive root modulo p
// A number g is a primitive root mod p if g^1, g^2, ... g^(p-1) mod p produces all numbers from 1 to p-1 in some order.
export function checkPrimitiveRoot(g: number, p: number): {
  isRoot: boolean;
  generatedValues: number[];
  order: number;
  explanation: string;
} {
  if (p <= 2 || g <= 1 || g >= p) {
    return {
      isRoot: false,
      generatedValues: [],
      order: 0,
      explanation: `${g} must be between 2 and ${p - 1}.`,
    };
  }

  const generated = new Set<number>();
  const sequence: number[] = [];
  let current = 1n;
  const bigG = BigInt(g);
  const bigP = BigInt(p);

  for (let power = 1; power < p; power++) {
    current = (current * bigG) % bigP;
    const val = Number(current);
    sequence.push(val);
    generated.add(val);
    if (val === 1 && power < p - 1) {
      // Loop closed early without generating all elements
      return {
        isRoot: false,
        generatedValues: sequence,
        order: power,
        explanation: `${g}^${power} ≡ 1 (mod ${p}). Cycle repeats early after ${power} steps (order = ${power} < ${p - 1}).`,
      };
    }
  }

  const isRoot = generated.size === p - 1;
  return {
    isRoot,
    generatedValues: sequence,
    order: sequence.length,
    explanation: isRoot
      ? `${g} successfully generates all ${p - 1} integers from 1 to ${p - 1} modulo ${p}. It is a valid primitive root!`
      : `Generated ${generated.size} unique values out of ${p - 1} required.`,
  };
}

// Find all primitive roots modulo prime p
export function findPrimitiveRoots(p: number, maxToReturn = 12): number[] {
  if (p <= 2 || p > 1000) return []; // limit search range for real-time responsiveness
  const phi = p - 1;
  const roots: number[] = [];

  // Find prime factors of phi
  const factors: number[] = [];
  let temp = phi;
  for (let i = 2; i * i <= temp; i++) {
    if (temp % i === 0) {
      factors.push(i);
      while (temp % i === 0) temp = Math.floor(temp / i);
    }
  }
  if (temp > 1) factors.push(temp);

  // Test each candidate g from 2 to p-1
  for (let g = 2; g < p && roots.length < maxToReturn; g++) {
    let isRoot = true;
    for (const factor of factors) {
      const power = phi / factor;
      if (modPow(g, power, p) === 1n) {
        isRoot = false;
        break;
      }
    }
    if (isRoot) {
      roots.push(g);
    }
  }

  return roots;
}

// Discrete Logarithm Brute-Force Solver for Eve (demonstrates computational difficulty)
export function solveDiscreteLog(
  g: number,
  target: number,
  p: number,
  maxIterations = 50000
): { found: boolean; secret?: number; iterations: number; searchTimeMs: number } {
  const startTime = performance.now();
  let current = 1n;
  const bigG = BigInt(g);
  const bigTarget = BigInt(target);
  const bigP = BigInt(p);

  for (let x = 1; x <= Math.min(p - 1, maxIterations); x++) {
    current = (current * bigG) % bigP;
    if (current === bigTarget) {
      const endTime = performance.now();
      return {
        found: true,
        secret: x,
        iterations: x,
        searchTimeMs: Math.round((endTime - startTime) * 100) / 100,
      };
    }
  }

  const endTime = performance.now();
  return {
    found: false,
    iterations: Math.min(p - 1, maxIterations),
    searchTimeMs: Math.round((endTime - startTime) * 100) / 100,
  };
}

// Simple XOR stream encryption for demonstration of derived shared key
export function encryptMessage(text: string, keyNumber: number): {
  cipherHex: string;
  binaryKey: string;
  steps: Array<{ char: string; code: number; keyByte: number; xorVal: number; hex: string }>;
} {
  const keyByte = (keyNumber % 255) || 42;
  const binaryKey = keyByte.toString(2).padStart(8, '0');
  const steps: Array<{ char: string; code: number; keyByte: number; xorVal: number; hex: string }> = [];
  const hexParts: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);
    // Derive rotating keystream byte from keyNumber
    const derivedByte = ((keyByte + i * 7) % 255) || 1;
    const xorVal = code ^ derivedByte;
    const hex = xorVal.toString(16).padStart(2, '0').toUpperCase();
    hexParts.push(hex);
    steps.push({
      char,
      code,
      keyByte: derivedByte,
      xorVal,
      hex,
    });
  }

  return {
    cipherHex: hexParts.join(' '),
    binaryKey,
    steps,
  };
}

export function decryptMessage(cipherHex: string, keyNumber: number): string {
  const hexValues = cipherHex.split(/\s+/).filter(Boolean);
  const keyByte = (keyNumber % 255) || 42;
  let result = '';

  for (let i = 0; i < hexValues.length; i++) {
    const xorVal = parseInt(hexValues[i], 16);
    if (isNaN(xorVal)) continue;
    const derivedByte = ((keyByte + i * 7) % 255) || 1;
    const code = xorVal ^ derivedByte;
    result += String.fromCharCode(code);
  }

  return result;
}
