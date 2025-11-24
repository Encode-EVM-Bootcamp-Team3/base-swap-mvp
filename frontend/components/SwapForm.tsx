'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi';
import { erc20Abi, getAddress, isAddress, parseUnits } from 'viem';
import { sepolia } from 'wagmi/chains';
import TokenSelector from './TokenSelector';
import TxStatus from './TxStatus';
import { TOKEN_SWAP_ADDRESS, tokenSwapAbi } from '../lib/contract';

type TxStatusValue = 'idle' | 'pending' | 'success' | 'error';

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

const TOKENS = [
  {
    symbol: 'FUSDT',
    address: resolveAddress(
      'NEXT_PUBLIC_FAKE_USDT_ADDRESS',
      '0x58d1fB5788283Bc6abb12cF958f56ABAAAf6CC7C',
    ),
    decimals: 6,
  },
  {
    symbol: 'FUSDC',
    address: resolveAddress(
      'NEXT_PUBLIC_FAKE_USDC_ADDRESS',
      '0x51e78127EA289f36E39d6685bd7e59468814c813',
    ),
    decimals: 6,
  },
] as const;

type TokenSymbol = (typeof TOKENS)[number]['symbol'];

const TOKENS_BY_SYMBOL: Record<TokenSymbol, (typeof TOKENS)[number]> =
  TOKENS.reduce(
    (acc, token) => ({ ...acc, [token.symbol]: token }),
    {} as Record<TokenSymbol, (typeof TOKENS)[number]>,
  );

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function SwapForm() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [tokenIn, setTokenIn] = useState<TokenSymbol>('FUSDT');
  const [tokenOut, setTokenOut] = useState<TokenSymbol>('FUSDC');
  const [amountIn, setAmountIn] = useState('');
  const [txStatus, setTxStatus] = useState<TxStatusValue>('idle');
  const [lastTxHash, setLastTxHash] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { address, isConnected } = useAccount();
  const {
    connect,
    connectors,
    status: connectStatus,
    error: connectError,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();
  const primaryConnector =
    connectors.find((c) => c.id === 'injected') ?? connectors[0];

  if (!mounted) return null;

  const tokenInMeta = TOKENS_BY_SYMBOL[tokenIn];
  const tokenOutMeta = TOKENS_BY_SYMBOL[tokenOut];

  const ensureValidAmount = (value: string) => {
    return value && Number(value) > 0;
  };

  const handleSwapClick = async () => {
    setErrorMessage(undefined);
    setLastTxHash(undefined);

    if (!isConnected || !address) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!ensureValidAmount(amountIn)) {
      alert('Please enter a valid amount.');
      return;
    }

    if (tokenIn === tokenOut) {
      alert('Token In and Token Out cannot be the same.');
      return;
    }

    if (!tokenInMeta || !tokenOutMeta) {
      alert('Token metadata missing.');
      return;
    }

    try {
      setTxStatus('pending');

      const amount = parseUnits(amountIn, tokenInMeta.decimals);

      await writeContractAsync({
        address: tokenInMeta.address,
        abi: erc20Abi,
        functionName: 'approve',
        chainId: sepolia.id,
        args: [TOKEN_SWAP_ADDRESS, amount],
      });

      const hash = await writeContractAsync({
        address: TOKEN_SWAP_ADDRESS,
        abi: tokenSwapAbi,
        functionName: 'swap',
        chainId: sepolia.id,
        args: [tokenInMeta.address, tokenOutMeta.address, amount],
      });

      console.log('Swap tx hash:', hash);
      setLastTxHash(hash);
      setTxStatus('success');
    } catch (err) {
      console.error(err);
      setTxStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Swap failed');
      alert('Swap failed, check console for details.');
    }
  };

  const handleSwitchTokens = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
  };

  const isSwapping = txStatus === 'pending';

  return (
    <div
      style={{
        borderRadius: 16,
        border: '1px solid #262626',
        padding: 18,
        background:
          'radial-gradient(circle at top, rgba(59,130,246,0.15), transparent 60%) #050509',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
      }}
    >
      {/* Wallet Connect */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: '#e5e5e5' }}>
          Swap
        </span>

        {!isConnected ? (
          <button
            type="button"
            onClick={() =>
              primaryConnector && connect({ connector: primaryConnector })
            }
            disabled={!primaryConnector || connectStatus === 'pending'}
            style={{
              fontSize: 12,
              padding: '6px 10px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: '#3b82f6',
              color: '#fff',
              opacity:
                !primaryConnector || connectStatus === 'pending' ? 0.7 : 1,
            }}
          >
            {connectStatus === 'pending' ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => disconnect()}
            style={{
              fontSize: 12,
              padding: '6px 10px',
              borderRadius: 999,
              border: '1px solid #374151',
              background: '#0b1120',
              color: '#e5e5e5',
              cursor: 'pointer',
            }}
          >
            {shortenAddress(address)}
          </button>
        )}
      </div>

      {/* From */}
      <div
        style={{
          padding: 12,
          borderRadius: 12,
          background: 'rgba(15,23,42,0.85)',
          border: '1px solid #27272a',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <TokenSelector
          label="From"
          value={tokenIn}
          onChange={(v) => setTokenIn(v as TokenSymbol)}
          options={TOKENS}
        />

        <input
          type="number"
          placeholder="0.0"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
          style={{
            marginTop: 4,
            width: '100%',
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px solid #333',
            background: '#020617',
            color: '#fff',
            fontSize: 16,
          }}
        />
      </div>

      {/* Approve Only */}
      <button
        type="button"
        style={{
          marginTop: 6,
          width: '100%',
          padding: '10px 12px',
          borderRadius: 999,
          border: 'none',
          fontSize: 15,
          fontWeight: 500,
          cursor: isSwapping ? 'not-allowed' : 'pointer',
          background: '#6366f1',
          color: '#fff',
        }}
        onClick={async () => {
          if (!isConnected || !address) {
            alert('Please connect your wallet first.');
            return;
          }

          if (!ensureValidAmount(amountIn)) {
            alert('Please enter a valid amount to approve.');
            return;
          }

          const amount = parseUnits(amountIn, tokenInMeta.decimals);

          try {
            console.log('Approving ...');
            const tx = await writeContractAsync({
              address: tokenInMeta.address,
              abi: erc20Abi,
              functionName: 'approve',
              chainId: sepolia.id,
              args: [TOKEN_SWAP_ADDRESS, amount],
            });

            console.log('Approve OK:', tx);
            alert('Approve success!');
            setLastTxHash(tx as string);
          } catch (err) {
            console.error(err);
            alert('Approve failed');
          }
        }}
      >
        Approve Only
      </button>

      {/* Switch */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={handleSwitchTokens}
          style={{
            borderRadius: 999,
            border: '1px solid #27272a',
            background: '#020617',
            color: '#e5e5e5',
            fontSize: 12,
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          ⇅ Switch
        </button>
      </div>

      {/* To */}
      <div
        style={{
          padding: 12,
          borderRadius: 12,
          background: 'rgba(15,23,42,0.85)',
          border: '1px solid #27272a',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <TokenSelector
          label="To"
          value={tokenOut}
          onChange={(v) => setTokenOut(v as TokenSymbol)}
          options={TOKENS}
        />

        <div
          style={{
            marginTop: 4,
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px dashed #333',
            background: '#020617',
            fontSize: 14,
            color: '#9ca3af',
          }}
        >
          Estimated output will appear here.
        </div>
      </div>

      {connectError && (
        <div style={{ fontSize: 12, color: '#f87171' }}>
          {connectError.message}
        </div>
      )}

      <TxStatus status={txStatus} txHash={lastTxHash} errorMessage={errorMessage} />

      {/* Swap */}
      <button
        type="button"
        onClick={handleSwapClick}
        disabled={!isConnected || isSwapping}
        style={{
          marginTop: 6,
          width: '100%',
          padding: '10px 12px',
          borderRadius: 999,
          border: 'none',
          fontSize: 15,
          fontWeight: 500,
          cursor: !isConnected || isSwapping ? 'not-allowed' : 'pointer',
          background: isConnected ? '#22c55e' : '#4b5563',
          color: '#0b1120',
          opacity: isSwapping ? 0.7 : 1,
        }}
      >
        {!isConnected
          ? 'Connect wallet to swap'
          : isSwapping
            ? 'Swapping...'
            : 'Swap'}
      </button>
    </div>
  );
}
