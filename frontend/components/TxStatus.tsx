// frontend/components/TxStatus.tsx
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
  let color = '#9ca3af';

  if (status === 'pending') {
    text = 'Transaction pending...';
    color = '#facc15';
  } else if (status === 'success') {
    text = 'Swap submitted successfully.';
    color = '#4ade80';
  } else if (status === 'error') {
    text = errorMessage || 'Something went wrong.';
    color = '#f97373';
  }

  return (
    <div
      style={{
        fontSize: 12,
        marginTop: 6,
        color,
        borderRadius: 8,
        padding: '6px 8px',
        background: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(55,65,81,0.8)',
      }}
    >
      <div>{text}</div>
      {txHash && (
        <div
          style={{
            marginTop: 4,
            fontSize: 11,
            opacity: 0.9,
            wordBreak: 'break-all',
          }}
        >
          Tx:{' '}
          <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo' }}>
            {txHash}
          </span>
        </div>
      )}
    </div>
  );
}
