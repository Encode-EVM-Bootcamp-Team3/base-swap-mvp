// frontend/lib/contract.ts

import { getAddress, isAddress } from 'viem';

/**
 * Reads an address from environment variables with optional fallback.
 * Ensures the address is valid and normalized using getAddress().
 */
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

/**
 * Swap contract address — loaded entirely from environment.
 * Must exist in NEXT_PUBLIC_TOKEN_SWAP_ADDRESS
 */
export const TOKEN_SWAP_ADDRESS = resolveAddress(
  'NEXT_PUBLIC_TOKEN_SWAP_ADDRESS'
);

/**
 * TokenSwap ABI
 */
export const tokenSwapAbi = [
  {
    inputs: [
      { internalType: 'address', name: 'tokenIn', type: 'address' },
      { internalType: 'address', name: 'tokenOut', type: 'address' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
    ],
    name: 'swap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
