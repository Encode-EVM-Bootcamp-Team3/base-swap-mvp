// frontend/components/TokenSelector.tsx
type TokenOption = {
  symbol: string;
  address: string;
  decimals: number;
};

type TokenSelectorProps = {
  label: string;
  value: string;
  onChange: (symbol: string) => void;
  options: TokenOption[];
};

export default function TokenSelector({
  label,
  value,
  onChange,
  options,
}: TokenSelectorProps) {
  const current = options.find((t) => t.symbol === value) ?? options[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          fontSize: 12,
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{label}</span>
        <span style={{ fontSize: 11, color: '#6b7280' }}>Base Sepolia</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* ------------------ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 10px',
            borderRadius: 999,
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid #1f2937',
            minWidth: 120,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '999px',
              background:
                'radial-gradient(circle at 30% 0, #38bdf8, transparent 60%), #0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: '#e5e7eb',
              fontWeight: 600,
            }}
          >
            {current.symbol[0]}
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#e5e7eb',
            }}
          >
            {current.symbol}
          </span>
        </div>

        {/* ------------------ */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid #1f2937',
            background: '#020617',
            color: '#e5e7eb',
            fontSize: 13,
            outline: 'none',
          }}
        >
          {options.map((t) => (
            <option key={t.symbol} value={t.symbol}>
              {t.symbol}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
