type TxStatusValue = 'idle' | 'pending' | 'success' | 'error';

type TxStatusProps = {
  status: TxStatusValue;
  txHash?: string;
  errorMessage?: string;
};

export default function TxStatus({
  status,
  txHash,
  errorMessage,
}: TxStatusProps) {
  if (status === 'idle') return null;

  let text = '';
  let color = '#aaa';

  if (status === 'pending') {
    text = 'Transaction pending...';
    color = '#fbbf24';
  } else if (status === 'success') {
    text = 'Swap simulated as success.';
    color = '#4ade80';
  } else if (status === 'error') {
    text = errorMessage || 'Something went wrong.';
    color = '#f87171';
  }

  return (
    <div style={{ fontSize: 13, marginTop: 8, color }}>
      {text}
      {txHash && (
        <div style={{ marginTop: 4, fontSize: 12, opacity: 0.9 }}>
          Tx: <span style={{ fontFamily: 'monospace' }}>{txHash}</span>
        </div>
      )}
    </div>
  );
}
