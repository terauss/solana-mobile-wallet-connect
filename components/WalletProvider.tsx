'use client';

import { useMemo, useEffect, useState, type ReactNode } from 'react';
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

// Optional import for SolanaMobileWalletAdapter
// Install @solana-mobile/wallet-adapter-mobile for full Android support

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

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
  const [mounted, setMounted] = useState(false);
  const [mwaRegistered, setMwaRegistered] = useState(false);
  const [mobileAdapterClass, setMobileAdapterClass] = useState<any>(null);
  const [isAndroidDevice, setIsAndroidDevice] = useState(false);

  // Ensure we're on the client side before detecting platform and registering MWA
  useEffect(() => {
    setMounted(true);

    // Register Mobile Wallet Adapter only on Android
    // This registers the MWA globally, making it available to wallet adapters
    if (typeof window !== 'undefined') {
      try {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const androidCheck = /android/.test(userAgent);
        setIsAndroidDevice(androidCheck);

        if (androidCheck) {
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
          } catch (error) {
            console.error('Failed to register Mobile Wallet Adapter:', error);
          } finally {
            // Always set to true to allow app to continue, even if registration failed
            setMwaRegistered(true);
          }

          // Try to load SolanaMobileWalletAdapter if package is installed
          // Do this after MWA registration to avoid blocking
          import('@solana-mobile/wallet-adapter-mobile')
            .then((module) => {
              if (module && module.SolanaMobileWalletAdapter) {
                setMobileAdapterClass(module.SolanaMobileWalletAdapter);
              }
            })
            .catch((err) => {
              // Package not installed - this is fine, will use registerMwa only
              console.log('Mobile wallet adapter package not installed, using registerMwa only');
            });
        } else {
          setMwaRegistered(true);
        }
      } catch (error) {
        console.error('Error during wallet provider initialization:', error);
        // Always set to true to allow app to continue
        setMwaRegistered(true);
      }
    } else {
      setMwaRegistered(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Determine the RPC endpoint
  const rpcEndpoint = useMemo(() => {
    if (endpoint) return endpoint;
    return clusterApiUrl(network);
  }, [network, endpoint]);

  // Create wallet adapters - MUST be client-side only
  // Wait for MWA to be registered before creating wallets on Android
  const wallets = useMemo(() => {
    // CRITICAL: Never create wallets during SSR
    if (typeof window === 'undefined' || !mounted) {
      return [];
    }

    const walletList: any[] = [];

    // On Android, add SolanaMobileWalletAdapter if available
    // This provides the "Mobile Wallet Adapter" option in the wallet selection modal
    if (isAndroidDevice && mwaRegistered && mobileAdapterClass) {
      try {
        walletList.push(
          new mobileAdapterClass({
            appIdentity: {
              name: 'Solana dApp',
              uri: window.location.origin,
              icon: `${window.location.origin}/icon.png`,
            },
          })
        );
      } catch (error) {
        console.error('Failed to create mobile wallet adapter:', error);
      }
    }

    // Always add Phantom and Solflare adapters
    // On Android, these will use MWA if available (via registerMwa)
    try {
      walletList.push(
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter()
      );
    } catch (error) {
      console.error('Failed to create wallet adapters:', error);
      // Return empty array only if we can't create any wallets
      return [];
    }

    return walletList;
  }, [mounted, mwaRegistered, mobileAdapterClass, isAndroidDevice]);

  // Don't render until mounted and MWA is registered (if Android)
  if (!mounted || (isAndroidDevice && !mwaRegistered)) {
    return null;
  }

  // Safety check: ensure we have wallets
  if (!wallets || wallets.length === 0) {
    console.warn('No wallets available, rendering with empty wallet list');
  }

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

