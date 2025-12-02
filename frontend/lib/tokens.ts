// frontend/lib/tokens.ts
import { getAddress, isAddress } from 'viem';

export type TokenConfig = {
  symbol: string;
  address: `0x${string}`;
  decimals: number;
};

const resolveAddress = (
  key:
    | 'NEXT_PUBLIC_TOKEN_SWAP_ADDRESS'
    | 'NEXT_PUBLIC_FAKE_USDT_ADDRESS'
    | 'NEXT_PUBLIC_FAKE_USDC_ADDRESS',
  fallback?: string
): `0x${string}` => {
  // Instead of process.env[key], directly access known env variables
  const envMap: Record<string, string | undefined> = {
    NEXT_PUBLIC_TOKEN_SWAP_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_SWAP_ADDRESS,
    NEXT_PUBLIC_FAKE_USDT_ADDRESS: process.env.NEXT_PUBLIC_FAKE_USDT_ADDRESS,
    NEXT_PUBLIC_FAKE_USDC_ADDRESS: process.env.NEXT_PUBLIC_FAKE_USDC_ADDRESS,
  };

  const value = envMap[key];

  if (!value) {
    if (fallback && isAddress(fallback)) return getAddress(fallback);
    throw new Error(`Environment variable ${key} is missing.`);
  }

  if (!isAddress(value)) {
    throw new Error(`Invalid address in env var ${key}`);
  }

  return getAddress(value);
};

function resolveSymbol(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function resolveDecimals(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const TOKENS = [
  {
    symbol: resolveSymbol('NEXT_PUBLIC_FAKE_USDT_SYMBOL', 'FUSDT'),
    address: resolveAddress('NEXT_PUBLIC_FAKE_USDT_ADDRESS'),
    decimals: resolveDecimals('NEXT_PUBLIC_FAKE_USDT_DECIMALS', 6),
  },
  {
    symbol: resolveSymbol('NEXT_PUBLIC_FAKE_USDC_SYMBOL', 'FUSDC'),
    address: resolveAddress('NEXT_PUBLIC_FAKE_USDC_ADDRESS'),
    decimals: resolveDecimals('NEXT_PUBLIC_FAKE_USDC_DECIMALS', 6),
  },
] as const;

export type TokenSymbol = (typeof TOKENS)[number]['symbol'];

export const TOKENS_BY_SYMBOL: Record<TokenSymbol, (typeof TOKENS)[number]> =
  TOKENS.reduce((acc, token) => {
    acc[token.symbol] = token;
    return acc;
  }, {} as Record<TokenSymbol, (typeof TOKENS)[number]>);
