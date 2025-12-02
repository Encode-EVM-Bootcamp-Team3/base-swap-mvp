// frontend/pages/index.tsx
import SwapForm from '../components/SwapForm';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1040,
          display: 'flex',
          gap: 40,
          alignItems: 'flex-start',
        }}
      >
        {/* -------------------------------- */}
        <section style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              marginBottom: 12,
              letterSpacing: -0.5,
            }}
          >
            Base Swap MVP
          </div>
          <p
            style={{
              fontSize: 14,
              color: '#9ca3af',
              maxWidth: 420,
              lineHeight: 1.6,
            }}
          >
            Swap ERC-20 tokens on Base Sepolia with a lightweight and responsive
            UI. Connect your wallet to interact with the smart contract directly
            from the browser.
          </p>
        </section>

        {/* --------------------------------- */}
        <section style={{ width: 420, flexShrink: 0 }}>
          <SwapForm />
        </section>
      </div>
    </main>
  );
}
