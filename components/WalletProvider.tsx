'use client';

import { useMemo, type ReactNode } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  createDefaultAuthorizationCache,
  createDefaultChainSelector,
  createDefaultWalletNotFoundHandler,
  registerMwa,
} from '@solana-mobile/wallet-standard-mobile';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

// Register Mobile Wallet Adapter on Android - must happen before WalletProvider initializes
if (typeof window !== 'undefined') {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isAndroidDevice = /android/.test(userAgent);

  if (isAndroidDevice) {
    try {
      registerMwa({
        appIdentity: {
          name: 'Solana dApp',
          uri: window.location.origin,
          icon: `${window.location.origin}/icon.png`,
        },
        authorizationCache: createDefaultAuthorizationCache(),
        chains: ['solana:mainnet', 'solana:devnet', 'solana:testnet'],
        chainSelector: createDefaultChainSelector(),
        onWalletNotFound: createDefaultWalletNotFoundHandler(),
      });
      console.debug('Mobile Wallet Adapter registered successfully on Android');
    } catch (error) {
      // MWA might already be registered, ignore the error
      console.debug('MWA registration error (may already be registered):', error);
    }
  }
}

interface WalletProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
  endpoint?: string;
}

/**
 * WalletProvider component that conditionally includes Mobile Wallet Adapter for Android
 * 
 * This provider:
 * - Registers Mobile Wallet Adapter for Android devices
 * - Uses Phantom and Solflare for desktop, iOS, and Android
 * - Provides the Solana wallet connection context to child components
 * 
 * Usage:
 * Wrap your app or pages with this provider in your layout or _app.tsx
 */
export function WalletProvider({
  children,
  network = WalletAdapterNetwork.Mainnet,
  endpoint,
}: WalletProviderProps) {

  // Determine the RPC endpoint
  const rpcEndpoint = useMemo(() => {
    if (endpoint) return endpoint;
    return clusterApiUrl(network);
  }, [network, endpoint]);

  // Create wallet adapters - MWA is registered globally and will be available if supported
  const wallets = useMemo(() => {
    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // Mobile Wallet Adapter is registered globally via registerMwa() above
      // and will automatically appear if supported on the device
    ];
  }, []);

  return (
    <ConnectionProvider endpoint={rpcEndpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

