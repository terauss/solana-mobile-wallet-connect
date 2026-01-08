'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { isAndroid } from '@/utils/isAndroid';
import { useEffect, useState } from 'react';

/**
 * Example page component demonstrating wallet connection
 * 
 * This component shows:
 * - How to use the wallet connection hooks
 * - How to detect Android platform
 * - How to access wallet and connection state
 */
export default function Home() {
  const { wallet, publicKey, connected, connecting, disconnect } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [platform, setPlatform] = useState<'android' | 'other'>('other');

  useEffect(() => {
    // Detect platform on client side
    if (typeof window !== 'undefined') {
      setPlatform(isAndroid() ? 'android' : 'other');
    }
  }, []);

  useEffect(() => {
    // Fetch balance when wallet is connected
    if (connected && publicKey) {
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / 1e9); // Convert lamports to SOL
      });
    } else {
      setBalance(null);
    }
  }, [connected, publicKey, connection]);

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '2rem',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}>
          Solana Wallet Connect
        </h1>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          width: '100%',
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Platform:</strong> {platform === 'android' ? 'Android (Mobile Wallet Adapter enabled)' : 'Desktop/iOS'}
          </p>
          {wallet && (
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Wallet:</strong> {wallet.adapter.name}
            </p>
          )}
          {connected && publicKey && (
            <>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Public Key:</strong> {publicKey.toString()}
              </p>
              {balance !== null && (
                <p>
                  <strong>Balance:</strong> {balance.toFixed(4)} SOL
                </p>
              )}
            </>
          )}
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <WalletMultiButton />
        </div>

        {connected && (
          <button
            onClick={disconnect}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Disconnect
          </button>
        )}

        {connecting && (
          <p style={{ color: '#666' }}>Connecting to wallet....</p>
        )}
      </div>
    </main>
  );
}

