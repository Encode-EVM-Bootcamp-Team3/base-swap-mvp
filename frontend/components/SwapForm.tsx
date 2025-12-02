// frontend/components/SwapForm.tsx
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi';
import { erc20Abi, parseUnits } from 'viem';
import { sepolia } from 'wagmi/chains';

import TokenSelector from './TokenSelector';
import TxStatus from './TxStatus';

import { TOKEN_SWAP_ADDRESS, tokenSwapAbi } from '../lib/contract';
import { TOKENS, TOKENS_BY_SYMBOL, TokenSymbol } from '../lib/tokens';
import { estimateOutput } from '../lib/swap';

type TxStatusValue = 'idle' | 'pending' | 'success' | 'error';

/** Small loading spinner using the global `spin` keyframes */
function LoadingSpinner() {
  return (
    <div
      style={{
        border: '3px solid #4b5563',
        borderTop: '3px solid #16a34a',
        borderRadius: '50%',
        width: 16,
        height: 16,
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}

/** Toast shown when swap succeeds */
function TxToast({ txHash, onClose }: { txHash: string; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 18,
        right: 18,
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: 12,
        padding: '12px 14px',
        color: '#f1f5f9',
        fontSize: 13,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        zIndex: 9999,
      }}
    >
      <strong>Swap complete ✔</strong>

      <a
        href={`https://sepolia.etherscan.io/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#60a5fa', textDecoration: 'underline' }}
      >
        View on Explorer
      </a>

      <button
        type="button"
        onClick={onClose}
        style={{
          marginTop: 4,
          alignSelf: 'flex-end',
          fontSize: 11,
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
        }}
      >
        Close
      </button>
    </div>
  );
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function SwapForm() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [tokenIn, setTokenIn] = useState<TokenSymbol>(TOKENS[0].symbol);
  const [tokenOut, setTokenOut] = useState<TokenSymbol>(TOKENS[1].symbol);
  const [amountIn, setAmountIn] = useState('');
  const [estimatedOut, setEstimatedOut] = useState('');
  const [txStatus, setTxStatus] = useState<TxStatusValue>('idle');
  const [lastTxHash, setLastTxHash] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isApproving, setIsApproving] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

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

  const ensureValidAmount = (value: string) =>
    value && Number(value) > 0 && !Number.isNaN(Number(value));

  /** Approve-only button handler */
  const handleApproveOnly = async () => {
    setErrorMessage(undefined);
    setLastTxHash(undefined);

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
      setTxStatus('pending');
      setIsApproving(true);
      setIsSwapping(false);

      const tx = await writeContractAsync({
        address: tokenInMeta.address,
        abi: erc20Abi,
        functionName: 'approve',
        chainId: sepolia.id,
        args: [TOKEN_SWAP_ADDRESS, amount],
      });

      console.log('Approve OK:', tx);
      setLastTxHash(tx as string);
      setTxStatus('success');
    } catch (err) {
      console.error(err);
      setTxStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Approve failed');
      alert('Approve failed');
    } finally {
      setIsApproving(false);
    }
  };

  /** Approve + swap flow */
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

    try {
      setTxStatus('pending');
      setIsSwapping(true);
      setIsApproving(false);

      const amount = parseUnits(amountIn, tokenInMeta.decimals);

      // 1) Approve
      await writeContractAsync({
        address: tokenInMeta.address,
        abi: erc20Abi,
        functionName: 'approve',
        chainId: sepolia.id,
        args: [TOKEN_SWAP_ADDRESS, amount],
      });

      // 2) Swap
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
    } finally {
      setIsSwapping(false);
    }
  };

  const handleSwitchTokens = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setEstimatedOut(estimateOutput(amountIn, tokenInMeta.decimals));
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: 24,
    border: '1px solid #1f2937',
    padding: 20,
    background:
      'radial-gradient(circle at top, rgba(59,130,246,0.12), transparent 55%) rgba(6,8,20,0.96)',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    boxShadow: '0 18px 60px rgba(0,0,0,0.65)',
  };

  const isBusy = isApproving || isSwapping;

  return (
    <>
      <div style={cardStyle}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#e5e7eb',
              }}
            >
              Swap
            </div>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
              Base Sepolia • Router:{' '}
              <span
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo',
                }}
              >
                {TOKEN_SWAP_ADDRESS.slice(0, 6)}...
                {TOKEN_SWAP_ADDRESS.slice(-4)}
              </span>
            </div>
          </div>

          {!isConnected ? (
            <button
              type="button"
              onClick={() =>
                primaryConnector && connect({ connector: primaryConnector })
              }
              disabled={!primaryConnector || connectStatus === 'pending'}
              style={{
                fontSize: 12,
                padding: '7px 12px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background:
                  'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #4f46e5 100%)',
                color: '#f9fafb',
                opacity:
                  !primaryConnector || connectStatus === 'pending' ? 0.7 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {connectStatus === 'pending' ? 'Connecting…' : 'Connect Wallet'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => disconnect()}
              style={{
                fontSize: 12,
                padding: '7px 12px',
                borderRadius: 999,
                border: '1px solid #374151',
                background: '#020617',
                color: '#e5e7eb',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
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
            borderRadius: 16,
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid #27272a',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <TokenSelector
            label="Pay"
            value={tokenIn}
            onChange={(v) => setTokenIn(v as TokenSymbol)}
            options={TOKENS as any}
          />

          <input
            type="number"
            placeholder="0.00"
            value={amountIn}
            onChange={(e) => {
              setAmountIn(e.target.value);
              setEstimatedOut(
                estimateOutput(e.target.value, tokenOutMeta.decimals)
              );
            }}
            style={{
              marginTop: 6,
              width: '100%',
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid #1f2937',
              background: '#020617',
              color: '#f9fafb',
              fontSize: 20,
              textAlign: 'right',
              outline: 'none',
            }}
          />
          <div
            style={{
              marginTop: 2,
              fontSize: 11,
              color: '#6b7280',
              textAlign: 'right',
            }}
          >
            Balance: -- {tokenIn}
          </div>
        </div>

        {/* Approve only button */}
        <button
          type="button"
          onClick={handleApproveOnly}
          disabled={!isConnected || isBusy}
          style={{
            marginTop: 2,
            width: '100%',
            padding: '9px 12px',
            borderRadius: 999,
            border: 'none',
            fontSize: 13,
            fontWeight: 500,
            cursor: !isConnected || isBusy ? 'not-allowed' : 'pointer',
            background:
              'linear-gradient(135deg, rgba(129,140,248,0.18), rgba(129,140,248,0.28))',
            color: '#e5e7eb',
            opacity: isApproving ? 0.9 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {isApproving && <LoadingSpinner />}
          {isApproving ? 'Approving…' : 'Approve Only'}
        </button>

        {/* Switch */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={handleSwitchTokens}
            disabled={isBusy}
            style={{
              borderRadius: 999,
              border: '1px solid #374151',
              background: '#020617',
              color: '#e5e7eb',
              fontSize: 12,
              padding: '5px 12px',
              cursor: isBusy ? 'not-allowed' : 'pointer',
              marginTop: 2,
            }}
          >
            ⇅ Switch
          </button>
        </div>

        {/* To */}
        <div
          style={{
            padding: 12,
            borderRadius: 16,
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid #27272a',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <TokenSelector
            label="Receive"
            value={tokenOut}
            onChange={(v) => setTokenOut(v as TokenSymbol)}
            options={TOKENS as any}
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
            {ensureValidAmount(amountIn)
              ? `Estimated output: ${estimatedOut} ${tokenOut}`
              : 'Estimated output will appear here.'}
          </div>
        </div>

        {/* Extra info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#9ca3af',
            marginTop: 4,
          }}
        >
          <span>Gas Fees</span>
          <span>{1 ? 'estimating…' : '--'}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#9ca3af',
          }}
        >
          <span>Slippage</span>
          <span>0.5%</span>
        </div>

        {connectError && (
          <div style={{ fontSize: 12, color: '#f97373', marginTop: 4 }}>
            {connectError.message}
          </div>
        )}

        <TxStatus
          status={txStatus}
          txHash={lastTxHash}
          errorMessage={errorMessage}
        />

        {/* Swap button */}
        <button
          type="button"
          onClick={handleSwapClick}
          disabled={!isConnected || isBusy}
          style={{
            marginTop: 8,
            width: '100%',
            padding: '11px 14px',
            borderRadius: 999,
            border: 'none',
            fontSize: 15,
            fontWeight: 600,
            cursor: !isConnected || isBusy ? 'not-allowed' : 'pointer',
            background: isConnected
              ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #22c55e 100%)'
              : '#4b5563',
            color: isConnected ? '#020617' : '#e5e7eb',
            opacity: isSwapping ? 0.85 : 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {isSwapping && <LoadingSpinner />}
          {!isConnected
            ? 'Connect wallet to swap'
            : isSwapping
              ? 'Swapping…'
              : 'Swap'}
        </button>
      </div>

      {/* Success Toast */}
      {lastTxHash && txStatus === 'success' && (
        <TxToast
          txHash={lastTxHash}
          onClose={() => {
            setLastTxHash(undefined);
            setTxStatus('idle');
          }}
        />
      )}
    </>
  );
}
