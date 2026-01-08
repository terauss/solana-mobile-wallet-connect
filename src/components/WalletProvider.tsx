import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { 
  SolanaMobileWalletAdapter,
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
} from '@solana-mobile/wallet-adapter-mobile';
import { clusterApiUrl, Cluster } from '@solana/web3.js';
import { isAndroidDevice } from '../utils/deviceDetection';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
  endpoint?: string;
}

/**
 * WalletProvider component that conditionally uses SolanaMobileWalletAdapter for Android
 * and Phantom/Solflare for desktop and iOS devices.
 * 
 * @param children - React children components
 * @param network - Solana network (mainnet-beta, testnet, devnet)
 * @param endpoint - Custom RPC endpoint (optional, overrides network)
 */
export const WalletContextProvider: FC<WalletContextProviderProps> = ({
  children,
  network = WalletAdapterNetwork.Mainnet,
  endpoint,
}) => {
  // Determine RPC endpoint
  const rpcEndpoint = useMemo(() => {
    return endpoint || clusterApiUrl(network);
  }, [endpoint, network]);

  // Conditionally create wallets based on device type
  const wallets = useMemo(() => {
    const isAndroid = isAndroidDevice();

    if (isAndroid) {
      // For Android: Use Solana Mobile Wallet Adapter
      // Map network to cluster
      const cluster: Cluster = 
        network === WalletAdapterNetwork.Mainnet ? 'mainnet-beta' :
        network === WalletAdapterNetwork.Testnet ? 'testnet' :
        'devnet';

      // Use default implementations for required interfaces
      // These handle address selection and authorization caching automatically
      const addressSelector = createDefaultAddressSelector();
      const authorizationResultCache = createDefaultAuthorizationResultCache();

      return [
        new SolanaMobileWalletAdapter({
          addressSelector: addressSelector,
          appIdentity: {
            name: 'Your dApp Name',
            uri: 'https://your-dapp-url.com',
            icon: 'https://your-dapp-url.com/icon.png',
          },
          authorizationResultCache: authorizationResultCache,
          cluster: cluster,
          onWalletNotFound: async () => {
            // Handle case when no mobile wallet is found
            window.open('https://solana.com/ecosystem/explore?categories=wallet', '_blank');
          },
        }),
      ];
    } else {
      // For Desktop & iOS: Use Phantom and Solflare
      return [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
      ];
    }
  }, [network]);

  return (
    <ConnectionProvider endpoint={rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

