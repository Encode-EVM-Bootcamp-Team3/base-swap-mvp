// frontend/lib/contract.ts
import { getAddress, isAddress } from 'viem';

const resolveAddress = (
  key: string,
  fallback?: string,
): `0x${string}` => {
  const value = process.env[key];
  if (value && isAddress(value)) return getAddress(value);
  if (fallback && isAddress(fallback)) {
    console.warn(`Using fallback for ${key}`);
    return getAddress(fallback);
  }
  throw new Error(`Missing or invalid env var ${key}`);
};

export const TOKEN_SWAP_ADDRESS = resolveAddress(
  'NEXT_PUBLIC_TOKEN_SWAP_ADDRESS',
  '0xB80609D89eFE4b3e1A0Ab91d6c16BB520B762256',
);

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
