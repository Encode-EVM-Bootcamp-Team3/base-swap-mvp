import SwapForm from '../components/SwapForm';

export default function Home() {
  return (
    <main style={{ maxWidth: '420px', margin: '40px auto' }}>
      <h1
        style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}
      >
        Base Swap MVP
      </h1>
      <SwapForm />
    </main>
  );
}
