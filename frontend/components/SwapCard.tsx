'use client';

import { useState } from 'react';
import { approveUSDT } from '../lib/swap';

export default function SwapCard() {
  const [amount, setAmount] = useState('0');

  async function handleApprove() {
    try {
      const tx = await approveUSDT(
        process.env.NEXT_PUBLIC_FAKE_USDT!,
        process.env.NEXT_PUBLIC_ROUTER_ADDRESS!,
        BigInt(amount)
      );
      console.log('Approve tx:', tx);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4 bg-gray-900 rounded-xl">
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="text-black"
      />
      <button onClick={handleApprove} className="bg-purple-500 mt-4 p-2">
        Approve Only
      </button>
    </div>
  );
}
