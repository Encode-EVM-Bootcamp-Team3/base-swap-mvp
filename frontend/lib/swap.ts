// frontend/lib/swap.ts
import { writeContract } from '@wagmi/core';
import FakeUSDT from '../abi/FakeUSDT.json';
import FakeUSDC from '../abi/FakeUSDC.json';
import { config } from './wagmiClient';

const FAKE_USDT_ADDRESS = process.env
  .NEXT_PUBLIC_FAKE_USDT_ADDRESS as `0x${string}`;

const FAKE_USDC_ADDRESS = process.env
  .NEXT_PUBLIC_FAKE_USDC_ADDRESS as `0x${string}`;

if (!FAKE_USDT_ADDRESS || !FAKE_USDC_ADDRESS) {
  throw new Error(
    'Missing NEXT_PUBLIC_FAKE_USDT_ADDRESS or NEXT_PUBLIC_FAKE_USDC_ADDRESS in .env'
  );
}

export async function approveUSDT(spender: string, amount: bigint) {
  return writeContract(config, {
    address: FAKE_USDT_ADDRESS,
    abi: FakeUSDT.abi,
    functionName: 'approve',
    args: [spender, amount],
  });
}

export async function approveUSDC(spender: string, amount: bigint) {
  return writeContract(config, {
    address: FAKE_USDC_ADDRESS,
    abi: FakeUSDC.abi,
    functionName: 'approve',
    args: [spender, amount],
  });
}
