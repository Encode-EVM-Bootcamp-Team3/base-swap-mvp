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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 12, color: '#aaa' }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '8px 10px',
          borderRadius: 8,
          border: '1px solid #333',
          background: '#050509',
          color: '#fff',
          fontSize: 14,
        }}
      >
        {options.map((t) => (
          <option key={t.symbol} value={t.symbol}>
            {t.symbol}
          </option>
        ))}
      </select>
    </div>
  );
}
