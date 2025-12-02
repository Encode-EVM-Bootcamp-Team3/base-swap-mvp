import React from 'react';

interface Props {
  message: string;
  txHash?: string;
  onClose: () => void;
}

export function TxToast({ message, txHash, onClose }: Props) {
  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-md flex flex-col gap-2 z-50">
      <span>{message}</span>

      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          View transaction
        </a>
      )}

      <button className="text-gray-400 text-xs self-end" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
